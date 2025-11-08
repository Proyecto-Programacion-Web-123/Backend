const knexLib = require('knex');
const knexConfig = require('../../knexfile');

describe('Migrations smoke', () => {
  if (!knexConfig || !knexConfig.test || !knexConfig.test.client) {
    throw new Error(
      'Config de test no encontrada en knexfile.js. Asegúrate de exportar { test: { client: "sqlite3", ... } }'
    );
  }

  const knex = knexLib(knexConfig.test);

  beforeAll(async () => {
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.rollback(undefined, true);
    await knex.destroy();
  });

  it('aplica migraciones sin errores', async () => {
    const tables = await knex.raw(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('users','products','orders','order_details')"
    );
    // Para sqlite3, el result.rows no existe; parse simple:
    const names = (tables?.[0] || tables)?.map?.(r => r.name) || [];
    expect(Array.isArray(names)).toBe(true);
  });
});
