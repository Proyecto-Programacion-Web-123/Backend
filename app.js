// Proyecto/Backend/app.js
require('dotenv').config();

// IMPORTANTE: Datadog debe ir primero, antes de cualquier otro import
require('./datadog');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const metricsMiddleware = require('./middlewares/metrics');

const db = require('./db');

// Rutas existentes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const order_detailRoutes = require('./routes/order_detailRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

/* CORS (multi-origen) */
const defaultOrigins = ['http://localhost:5173', 'http://localhost:3001', 'http://localhost:3000'];
const envOrigins = (process.env.WEB_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    return cb(null, ALLOWED_ORIGINS.includes(origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

/* Preflight manual + no-cache */
app.use((req, res, next) => {
  const reqOrigin = req.headers.origin;
  if (!reqOrigin || ALLOWED_ORIGINS.includes(reqOrigin)) {
    res.header('Access-Control-Allow-Origin', reqOrigin || '*');
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

/* Body & Cookies */
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

/* ✅ MÉTRICAS - Debe ir después de express.json pero antes de las rutas */
app.use(metricsMiddleware);

/* === ENDPOINT DE DIAGNÓSTICO === */
app.get('/__diag/db', async (_req, res) => {
  try {
    const [rows] = await db.raw('SELECT VERSION() AS version, DATABASE() AS dbname');
    const currentDB = rows[0]?.dbname;
    const columns = await db('information_schema.COLUMNS')
      .select('COLUMN_NAME')
      .where({ TABLE_SCHEMA: currentDB, TABLE_NAME: 'users' })
      .orderBy('COLUMN_NAME');

    res.json({
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      current_database: currentDB,
      users_columns: columns.map(c => c.COLUMN_NAME)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/* Rutas */
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/order_details', order_detailRoutes);

/* Healthcheck */
app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

/* 404 controlado */
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.originalUrl });
});

/* Manejador de errores */
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const payload = {
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  };
  res.status(status).json(payload);
});

module.exports = app;