const db = require('../db');

async function findAll() {
  return db('users')
    .whereNull('deleted_at')
    .select('*');
}

async function findById(id) {
  return db('users')
    .where({ id_user: id })
    .whereNull('deleted_at')
    .first();
}

async function findByEmail(email) {
  return db('users')
    .where({ email })
    .whereNull('deleted_at')
    .first();
}

/**
 * Crea usuario y devuelve el registro completo (incluye id_user).
 * Acepta campos como: first_name, last_name, email, password_hash, role, etc.
 */
async function createUser(user) {
  const now = db.fn.now();
  const payload = {
    ...user,
    created_at: user.created_at ?? now,
    updated_at: user.updated_at ?? now
  };

  const [id_user] = await db('users').insert(payload);
  return findById(id_user);
}

async function update(id, user) {
  return db('users')
    .where({ id_user: id })
    .update({ ...user, updated_at: db.fn.now() });
}

/** Soft delete */
async function remove(id) {
  return db('users')
    .where({ id_user: id })
    .update({ deleted_at: db.fn.now(), updated_at: db.fn.now() });
}

/** Marca última sesión */
async function updateLastLogin(id_user) {
  return db('users')
    .where({ id_user })
    .update({ last_login_at: db.fn.now(), updated_at: db.fn.now() });
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  createUser,
  update,
  delete: remove,     
  updateLastLogin
};
