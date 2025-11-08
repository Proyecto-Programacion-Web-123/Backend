/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
  return knex.schema.createTable('order_details', (table) => {
    table.increments('id_order_detail').primary();
    table.integer('id_order').unsigned().notNullable().references('id_order').inTable('orders').onDelete('CASCADE');
    table.integer('id_product').unsigned().notNullable().references('id_product').inTable('products').onDelete('CASCADE');
    table.integer('quantity').notNullable();
    table.decimal('unit_price', 10, 2).notNullable();
    table.decimal('subtotal', 10, 2).notNullable();
    table.timestamp('deleted_at').nullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
  return knex.schema.dropTable('order_details');
};