/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id_user').primary();
    table.string('first_name').notNullable();
    table.string('second_name');
    table.string('last_name').notNullable();
    table.string('second_last_name');
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};