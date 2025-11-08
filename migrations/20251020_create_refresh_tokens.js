/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  await knex.schema.createTable('refresh_tokens', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().notNullable()
      .references('id_user').inTable('users').onDelete('CASCADE');
    t.string('token_hash').notNullable();
    t.string('user_agent');
    t.string('ip');
    t.datetime('expires_at').notNullable();
    t.boolean('revoked').defaultTo(false);
    t.timestamps(true, true);
    t.index(['user_id','revoked']);
  });
};
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
};
