// Backend/middlewares/metrics.js
const { dogstatsd } = require('../datadog');

function metricsMiddleware(req, res, next) {
  const start = Date.now();
  
  // Capturar la respuesta original
  const originalSend = res.send;
  
  res.send = function(data) {
    // Calcular latencia
    const duration = Date.now() - start;
    
    // Obtener información del request
    const method = req.method;
    const route = req.route?.path || req.path || 'unknown';
    const statusCode = res.statusCode;
    
    // Tags para las métricas
    const tags = [
      `method:${method}`,
      `route:${route}`,
      `status_code:${statusCode}`,
      `status_family:${Math.floor(statusCode / 100)}xx`
    ];
    
    // Enviar métricas a Datadog
    
    // 1. Latencia (tiempo de respuesta)
    dogstatsd.histogram('http.request.duration', duration, tags);
    
    // 2. Contador de requests por status code
    dogstatsd.increment('http.request.count', 1, tags);
    
    // 3. Contador específico por familia de status
    if (statusCode >= 200 && statusCode < 300) {
      dogstatsd.increment('http.request.success', 1, tags);
    } else if (statusCode >= 400 && statusCode < 500) {
      dogstatsd.increment('http.request.client_error', 1, tags);
    } else if (statusCode >= 500) {
      dogstatsd.increment('http.request.server_error', 1, tags);
    }
    
    // Logging opcional
    console.log(`[METRICS] ${method} ${route} - ${statusCode} - ${duration}ms`);
    
    // Llamar al send original
    return originalSend.call(this, data);
  };
  
  next();
}

module.exports = metricsMiddleware;