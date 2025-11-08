/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.createTable('orders', (table) => {
    table.increments('id_order').primary();
    table.integer('id_user').unsigned().notNullable().references('id_user').inTable('users').onDelete('CASCADE');
    table.date('date').notNullable();
    table.decimal('total', 10, 2).notNullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};