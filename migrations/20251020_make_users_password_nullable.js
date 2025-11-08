/**
 * @param { import("knex").Knex } knex
 */
exports.up = async function(knex) {
  // Algunos drivers requieren usar SQL crudo para modificar NULL/NOT NULL
  await knex.raw('ALTER TABLE `users` MODIFY `password` VARCHAR(255) NULL');
};

exports.down = async function(knex) {
  // Si quieres revertir (no lo recomiendo)
  await knex.raw('ALTER TABLE `users` MODIFY `password` VARCHAR(255) NOT NULL');
};
