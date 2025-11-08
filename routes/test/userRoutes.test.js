const request = require('supertest');
const express = require('express');

jest.mock('../../controllers/userController', () => ({
  getAll: jest.fn(async (req, res) => res.status(200).json([{ id_user: 1 }])),
  getById: jest.fn(async (req, res) => {
    const id = Number(req.params.id);
    if (id === 404) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ id_user: id });
  }),
  create: jest.fn(async (req, res) => res.status(201).json([31])),
  update: jest.fn(async (req, res) => res.status(200).json(1)),
  delete: jest.fn(async (req, res) => res.status(204).send()),
  remove: jest.fn(async (req, res) => res.status(204).send())
}));

const userRoutes = require('../userRoutes');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/users', userRoutes);
  return app;
}

describe('User routes (mocked controller)', () => {
  let app;
  beforeAll(() => { app = makeApp(); });

  test('GET /users -> 200', async () => {
    const r = await request(app).get('/users');
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });

  test('GET /users/2 -> 200', async () => {
    const r = await request(app).get('/users/2');
    expect(r.status).toBe(200);
    expect(r.body).toEqual({ id_user: 2 });
  });

  test('GET /users/404 -> 404', async () => {
    const r = await request(app).get('/users/404');
    expect(r.status).toBe(404);
  });

  test('POST /users -> 201', async () => {
    const r = await request(app).post('/users').send({ name: 'Foo' });
    expect(r.status).toBe(201);
  });

  test('PUT /users/1 -> 200', async () => {
    const r = await request(app).put('/users/1').send({ name: 'Bar' });
    expect(r.status).toBe(200);
  });

  test('DELETE /users/1 -> 204', async () => {
    const r = await request(app).delete('/users/1');
    expect(r.status).toBe(204);
  });
});
