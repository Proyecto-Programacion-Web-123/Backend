/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('users', (t) => {
    t.string('password_hash');
    t.boolean('email_verified').defaultTo(false);
    t.string('role').defaultTo('customer');
    t.datetime('last_login_at');
  });
};
exports.down = async function(knex) {
  await knex.schema.alterTable('users', (t) => {
    t.dropColumns('password_hash','email_verified','role','last_login_at');
  });
};
