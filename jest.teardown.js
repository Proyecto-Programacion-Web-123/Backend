const { closeStatsD } = require('./datadog');
const knex = require('./db/knex');

module.exports = async () => {
  await closeStatsD();
  await knex.destroy();
};