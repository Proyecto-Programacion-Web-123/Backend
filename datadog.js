// Backend/datadog.js
const tracer = require('dd-trace').init({
  service: 'videogames-ecommerce-backend',
  env: process.env.NODE_ENV || 'development',
  version: '1.0.0',
  logInjection: true,
  runtimeMetrics: true,
  hostname: 'host.docker.internal',  // ← CAMBIO IMPORTANTE
  port: 8126
});

const StatsD = require('hot-shots');

const dogstatsd = new StatsD({
  host: 'host.docker.internal',  // ← CAMBIO IMPORTANTE (era 'localhost')
  port: 8125,
  prefix: 'ecommerce.',
  globalTags: { 
    env: process.env.NODE_ENV || 'development',
    service: 'videogames-backend'
  },
  errorHandler: (error) => {
    console.error('StatsD error:', error);
  }
});

// Test de conexión
dogstatsd.increment('app.started', 1, ['test:connection']);
console.log('📊 StatsD client initialized - host: host.docker.internal:8125');

module.exports = { tracer, dogstatsd };