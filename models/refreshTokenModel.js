const db = require('../db');

function insertToken({ user_id, token_hash, user_agent, ip, expires_at }) {
  return db('refresh_tokens').insert({ user_id, token_hash, user_agent, ip, expires_at });
}
function findValidByUserAndHash(user_id, token_hash) {
  return db('refresh_tokens')
    .where({ user_id, token_hash, revoked: false })
    .andWhere('expires_at', '>', db.fn.now())
    .first();
}
function revokeAllForUser(user_id) {
  return db('refresh_tokens').where({ user_id, revoked: false }).update({ revoked: true });
}

module.exports = { insertToken, findValidByUserAndHash, revokeAllForUser };
