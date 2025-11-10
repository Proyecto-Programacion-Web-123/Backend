// Backend/datadog.js
// Debe cargarse ANTES que Express y el resto de imports
const ddtrace = require('dd-trace');
const StatsD = require('hot-shots');

// ======= Config común (usa las mismas que el agente) =======
const DD_ENV     = process.env.DD_ENV     || 'dev';
const DD_SERVICE = process.env.DD_SERVICE || 'videogames-ecommerce-backend';
const DD_VERSION = process.env.DD_VERSION || '1.0.0';

// Si el backend corre FUERA de Docker => host.docker.internal
// Si corre DENTRO de Docker => usa el nombre del servicio del agente (p. ej. "datadog")
const AGENT_HOST = process.env.DD_AGENT_HOST || 'host.docker.internal';
const APM_PORT   = Number(process.env.DD_APM_PORT || 8126);
const DOGSTATSD_PORT = Number(process.env.DD_DOGSTATSD_PORT || 8125);

// ======= APM (tracing) =======
ddtrace.init({
  env: DD_ENV,
  service: DD_SERVICE,
  version: DD_VERSION,
  hostname: AGENT_HOST,        // comenta esta línea si el backend corre dentro de Docker y el agente se resuelve por DNS interno
  port: APM_PORT,              // 8126 por defecto
  logInjection: true,          // inyecta trace-id en logs si luego usas pino/winston
  runtimeMetrics: true         // métricas de runtime (requiere DogStatsD)
  // analytics: true,          // opcional: habilitar analytics de traces
});
const tracer = ddtrace; // por si quieres crear spans manuales

// ======= Métricas (DogStatsD) =======
const dogstatsd = new StatsD({
  host: AGENT_HOST,
  port: DOGSTATSD_PORT,
  prefix: 'ecommerce.',
  // mejor como array explícito:
  globalTags: [`env:${DD_ENV}`, `service:${DD_SERVICE}`, `version:${DD_VERSION}`],
  errorHandler: (err) => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[DogStatsD] error:', err?.message || err);
    }
  }
});

// Test de arranque (verás la métrica en Metrics → Explorer)
dogstatsd.increment('app.started', 1, ['test:connection']);

console.log(`📊 Datadog ready → env=${DD_ENV} service=${DD_SERVICE} version=${DD_VERSION} agent=${AGENT_HOST} APM:${APM_PORT} DS:${DOGSTATSD_PORT}`);

module.exports = { tracer, dogstatsd };
