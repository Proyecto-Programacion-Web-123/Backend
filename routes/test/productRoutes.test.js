const request = require('supertest');
const express = require('express');

// ✅ MOCK del controller real que usa el router
// Cubre ambas variantes: delete y remove
jest.mock('../../controllers/productController', () => ({
  getAll: jest.fn(async (req, res) => res.status(200).json([{ id_product: 1, name: 'Mocked' }])),
  getById: jest.fn(async (req, res) => {
    const id = Number(req.params.id);
    if (id === 404) return res.status(404).json({ error: 'Product not found' });
    return res.status(200).json({ id_product: id });
  }),
  create: jest.fn(async (req, res) => res.status(201).json([21])),
  update: jest.fn(async (req, res) => res.status(200).json(1)),
  // Algunos proyectos usan "delete", otros "remove"
  delete: jest.fn(async (req, res) => res.status(204).send()),
  remove: jest.fn(async (req, res) => res.status(204).send())
}));

// 🧭 Importa el router REAL
const productRoutes = require('../productRoutes');

function makeApp() {
  const app = express();
  app.use(express.json());
  // Tu app principal monta '/products'; aquí igual
  app.use('/products', productRoutes);
  return app;
}

describe('Product routes (mocked controller)', () => {
  let app;
  beforeAll(() => { app = makeApp(); });

  test('GET /products -> 200 y lista', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /products/3 -> 200 con objeto', async () => {
    const res = await request(app).get('/products/3');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id_product: 3 });
  });

  test('GET /products/404 -> 404', async () => {
    const res = await request(app).get('/products/404');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Product not found');
  });

  test('POST /products -> 201', async () => {
    const res = await request(app).post('/products').send({ name: 'Pad' });
    expect(res.status).toBe(201);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PUT /products/1 -> 200', async () => {
    const res = await request(app).put('/products/1').send({ name: 'New' });
    expect(res.status).toBe(200);
    expect(res.body).toBe(1);
  });

  test('DELETE /products/1 -> 204', async () => {
    const res = await request(app).delete('/products/1');
    expect(res.status).toBe(204);
    expect(res.text).toBe('');
  });
});
