require('dotenv').config();
const db = require('../db');

(async () => {
  try {
    const [rows] = await db.raw('SELECT 1 AS ok');
    console.log('DB OK:', rows);
    process.exit(0);
  } catch (e) {
    console.error('DB ERROR:', e.message);
    process.exit(1);
  }
})();
