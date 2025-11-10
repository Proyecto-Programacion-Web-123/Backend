// Backend/datadog.js
const tracer = require('dd-trace').init({
  service: 'videogames-ecommerce-backend',
  env: process.env.NODE_ENV || 'development',
  version: '1.0.0',
  logInjection: true,
  runtimeMetrics: true,
  hostname: 'host.docker.internal',
  port: 8126
});

const StatsD = require('hot-shots');

const dogstatsd = new StatsD({
  host: 'host.docker.internal',
  port: 8125,
  prefix: 'ecommerce.',
  globalTags: { 
    env: process.env.NODE_ENV || 'development',
    service: 'videogames-backend'
  },
  mock: process.env.NODE_ENV === 'test', // ← Mock en tests
  errorHandler: (error) => {
    console.error('StatsD error:', error);
  }
});

// Test de conexión - solo si NO estamos en tests
if (process.env.NODE_ENV !== 'test') {
  dogstatsd.increment('app.started', 1, ['test:connection']);
  console.log('📊 StatsD client initialized - host: host.docker.internal:8125');
}

// Función para cerrar el cliente
const closeStatsD = () => {
  return new Promise((resolve) => {
    if (dogstatsd && typeof dogstatsd.close === 'function') {
      dogstatsd.close(() => resolve());
    } else {
      resolve();
    }
  });
};

// UN SOLO module.exports
module.exports = { 
  tracer, 
  dogstatsd,
  statsd: dogstatsd, // ← Alias para compatibilidad
  closeStatsD 
};