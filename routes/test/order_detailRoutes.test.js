const request = require('supertest');
const express = require('express');

jest.mock('../../controllers/order_detailController', () => ({
  getAll: jest.fn(async (req, res) => res.status(200).json([{ id_order_detail: 1 }])),
  getById: jest.fn(async (req, res) => {
    const id = Number(req.params.id);
    if (id === 404) return res.status(404).json({ error: 'Order detail not found' });
    return res.status(200).json({ id_order_detail: id });
  }),
  create: jest.fn(async (req, res) => res.status(201).json([51])),
  update: jest.fn(async (req, res) => res.status(200).json(1)),
  delete: jest.fn(async (req, res) => res.status(204).send()),
  remove: jest.fn(async (req, res) => res.status(204).send())
}));

const orderDetailRoutes = require('../order_detailRoutes');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/order_details', orderDetailRoutes);
  return app;
}

describe('Order detail routes (mocked controller)', () => {
  let app;
  beforeAll(() => { app = makeApp(); });

  test('GET /order_details -> 200', async () => {
    const r = await request(app).get('/order_details');
    expect(r.status).toBe(200);
  });

  test('GET /order_details/2 -> 200', async () => {
    const r = await request(app).get('/order_details/2');
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ id_order_detail: 2 });
  });

  test('GET /order_details/404 -> 404', async () => {
    const r = await request(app).get('/order_details/404');
    expect(r.status).toBe(404);
  });

  test('POST /order_details -> 201', async () => {
    const r = await request(app).post('/order_details').send({});
    expect(r.status).toBe(201);
  });

  test('PUT /order_details/1 -> 200', async () => {
    const r = await request(app).put('/order_details/1').send({});
    expect(r.status).toBe(200);
  });

  test('DELETE /order_details/1 -> 204', async () => {
    const r = await request(app).delete('/order_details/1');
    expect(r.status).toBe(204);
  });
});
