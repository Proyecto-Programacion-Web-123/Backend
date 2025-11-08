const cookieParser = require('cookie-parser'); // recuerda usar en app.js
const { register, login, refresh, logoutAll } = require('../services/authService');

function setRefreshCookie(res, token) {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: false,            // true en prod con HTTPS
    sameSite: 'lax',
    path: '/auth/refresh',
    maxAge: 1000*60*60*24*30
  });
}

module.exports = {
  register: async (req, res) => {
    try {
      const user = await register(req.body);
      res.status(201).json({ id_user: user.id_user, email: user.email });
    } catch (e) { res.status(400).json({ error: e.message }); }
  },
  login: async (req, res) => {
    try {
      const meta = { userAgent: req.get('user-agent'), ip: req.ip };
      const { user, accessToken, refreshToken } = await login(req.body, meta);
      setRefreshCookie(res, refreshToken);
      res.json({ accessToken, user: { id_user: user.id_user, email: user.email, role: user.role } });
    } catch (e) { res.status(401).json({ error: e.message }); }
  },
  refresh: async (req, res) => {
    try {
      const token = req.cookies?.refresh_token || req.body?.refresh_token;
      if (!token) return res.status(401).json({ error: 'Sin refresh' });
      const { accessToken, refreshToken } = await refresh({ token });
      setRefreshCookie(res, refreshToken);
      res.json({ accessToken });
    } catch (e) { res.status(401).json({ error: e.message }); }
  },
  logoutAll: async (req, res) => {
    try {
      await logoutAll(req.user.id);
      res.clearCookie('refresh_token', { path: '/auth/refresh' });
      res.status(204).end();
    } catch (e) { res.status(400).json({ error: e.message }); }
  }
};
