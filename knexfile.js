// Proyecto/Backend/knexfile.js
require('dotenv').config();

const DEV = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3307),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '7465726D696E61',
    database: process.env.DB_NAME || 'term'
  },
  migrations: { directory: './migrations' },
  pool: { min: 0, max: 10 }
};

const TEST = {
  client: 'sqlite3',
  connection: { filename: ':memory:' },
  useNullAsDefault: true,
  migrations: { directory: './migrations' }
};

module.exports = {
  development: DEV,
  test: TEST
};
