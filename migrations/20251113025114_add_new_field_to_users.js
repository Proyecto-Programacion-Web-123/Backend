/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.table('users', (table) => {
    table.string('phone').nullable().after('email'); // Ejemplo: campo teléfono
    // table.integer('age').nullable();
    // table.boolean('is_active').defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('phone');
  });
};