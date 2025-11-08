require('dotenv').config();
const knex = require('knex');
const config = require('./knexfile');

const env = process.env.NODE_ENV || 'development';
const db = knex(config[env]);

// (Opcional) pequeño helper para ping en runtime
db.ping = async () => {
  try { await db.raw('SELECT 1'); return true; }
  catch { return false; }
};

// Cierre limpio cuando se detiene el proceso
process.on('SIGINT', async () => {
  try { await db.destroy(); } finally { process.exit(0); }
});
process.on('SIGTERM', async () => {
  try { await db.destroy(); } finally { process.exit(0); }
});

module.exports = db;
