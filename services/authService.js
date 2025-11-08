const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const db = require('../db'); // << para migrar password legado
const { findByEmail, createUser, updateLastLogin } = require('../models/userModel');
const { insertToken, findValidByUserAndHash, revokeAllForUser } = require('../models/refreshTokenModel');

function signAccess(user) {
  return jwt.sign(
    { role: user.role || 'customer' },
    process.env.JWT_ACCESS_SECRET,
    { subject: String(user.id_user), expiresIn: process.env.JWT_ACCESS_TTL || '15m' }
  );
}

function signRefresh(user) {
  return jwt.sign(
    { t: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { subject: String(user.id_user), expiresIn: process.env.JWT_REFRESH_TTL || '30d' }
  );
}

function sha256(x) { return crypto.createHash('sha256').update(x).digest('hex'); }
function parseTtl(ttl = '30d') {
  const m = /^(\d+)([smhd])$/.exec(ttl) || [];
  const n = +m[1] || 30;
  const u = m[2] || 'd';
  const f = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 };
  return n * f[u];
}

/**
 * REGISTRO: siempre guarda password_hash (BCrypt).
 * No uses el campo legacy "password".
 */
async function register({ first_name, last_name, email, password }) {
  const existing = await findByEmail(email);
  if (existing) throw new Error('Email ya registrado');

  const password_hash = await bcrypt.hash(password, 10);

  const user = await createUser({
    first_name,
    last_name,
    email,
    password_hash,              // <-- solo hash
    role: 'customer',
    created_at: new Date(),
    updated_at: new Date()
  });

  return user;
}

/**
 * LOGIN:
 * - Si existe password_hash => valida con bcrypt.
 * - Si NO hay hash pero sí "password" legacy => valida 1 vez en texto plano,
 *   migra guardando el hash y limpia el campo legacy.
 */
async function login({ email, password }, meta) {
  const user = await findByEmail(email);
  if (!user) throw new Error('Credenciales inválidas');

  // Caso 1: usuario con hash (flujo normal)
  if (user.password_hash) {
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new Error('Credenciales inválidas');
  } else if (user.password) {
 
    if (password !== user.password) throw new Error('Credenciales inválidas');

    const newHash = await bcrypt.hash(password, 10);
    await db('users')
      .where({ id_user: user.id_user })
      .update({
        password_hash: newHash,
        password: null,              
        updated_at: db.fn.now()
      });

    user.password_hash = newHash; // para seguir el flujo como si ya tuviera hash
  } else {
    // No hay ni hash ni password legacy -> inválido
    throw new Error('Credenciales inválidas');
  }

  await updateLastLogin(user.id_user);

  const accessToken = signAccess(user);
  const refreshToken = signRefresh(user);

  const token_hash = sha256(refreshToken);
  const expires_at = new Date(Date.now() + parseTtl(process.env.JWT_REFRESH_TTL));
  await insertToken({
    user_id: user.id_user,
    token_hash,
    user_agent: meta?.userAgent,
    ip: meta?.ip,
    expires_at
  });

  return { user, accessToken, refreshToken };
}

async function refresh({ token }) {
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw new Error('Refresh inválido');
  }
  const user_id = Number(payload.sub);
  const token_hash = sha256(token);
  const row = await findValidByUserAndHash(user_id, token_hash);
  if (!row) throw new Error('Refresh revocado o expirado');

  const accessToken = jwt.sign({}, process.env.JWT_ACCESS_SECRET, {
    subject: String(user_id),
    expiresIn: process.env.JWT_ACCESS_TTL || '15m'
  });
  const newRefresh = signRefresh({ id_user: user_id, role: payload.role });


  return { accessToken, refreshToken: newRefresh };
}

async function logoutAll(user_id) {
  await revokeAllForUser(user_id);
}

module.exports = { register, login, refresh, logoutAll };
