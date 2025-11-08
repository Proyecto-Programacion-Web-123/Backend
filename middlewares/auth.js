const jwt = require('jsonwebtoken');

function auth(required = true) {
  return (req, res, next) => {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) {
      if (required) return res.status(401).json({ error: 'No token' });
      req.user = null; return next();
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = { id: Number(payload.sub), role: payload.role || 'customer' };
      next();
    } catch {
      if (required) return res.status(401).json({ error: 'Token inválido o expirado' });
      req.user = null; next();
    }
  };
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Prohibido' });
    next();
  };
}

module.exports = { auth, authorizeRoles };
