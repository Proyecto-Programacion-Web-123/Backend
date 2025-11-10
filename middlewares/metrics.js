// Backend/middlewares/metrics.js
const { dogstatsd } = require('../datadog');

function normalizeRoute(req) {
  // 1) Si Express conoce la ruta paramétrica, úsala (e.g. "/users/:id")
  const routeFromExpress = req.route?.path || req.baseUrl || '';
  if (routeFromExpress) return routeFromExpress;

  // 2) Si no, deriva del path y normaliza segmentos numéricos/UUIDs
  //    /orders/123/items/456 -> /orders/:id/items/:id
  const path = (req.originalUrl || req.url || '').split('?')[0] || '/';
  return path
    .split('/')
    .map(seg => {
      if (!seg) return seg;
      // UUID v4/v7 aproximado
      if (/^[0-9a-fA-F-]{10,}$/.test(seg)) return ':id';
      // numérico
      if (/^\d+$/.test(seg)) return ':id';
      return seg;
    })
    .join('/') || '/';
}

module.exports = function metricsMiddleware(req, res, next) {
  // Opcional: evita ruido en healthchecks
  if (req.path === '/health' || req.path === '/__diag/db') return next();

  const start = process.hrtime.bigint();

  // Métricas al finalizar la respuesta (incluye statusCode final correcto)
  res.on('finish', () => {
    try {
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1e6;

      const method = req.method || 'GET';
      const status = res.statusCode || 0;
      const family = `${Math.floor(status / 100)}xx`;
      const route = normalizeRoute(req);

      // Tags (se suman a los globales puestos en datadog.js: env, service, version)
      const tags = [
        `method:${method}`,
        `route:${route}`,
        `status_code:${status}`,
        `status_family:${family}`
      ];

      // Contador de requests
      dogstatsd.increment('http.request.count', 1, tags);

      // Latencia como distribution (recomendado para percentiles globales)
      dogstatsd.distribution('http.request.duration_ms', durationMs, tags);

      // (Opcional) Bytes enviados si el header está presente
      const bytes = Number(res.getHeader('content-length')) || 0;
      if (bytes > 0) dogstatsd.distribution('http.response.bytes', bytes, tags);

      // Contadores por tipo de error
      if (status >= 500) dogstatsd.increment('http.request.server_error', 1, tags);
      else if (status >= 400) dogstatsd.increment('http.request.client_error', 1, tags);

      // Log de depuración solo en dev
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`[METRICS] ${method} ${route} -> ${status} in ${durationMs.toFixed(1)}ms`);
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[METRICS] error sending metrics:', err?.message || err);
      }
    }
  });

  next();
};
