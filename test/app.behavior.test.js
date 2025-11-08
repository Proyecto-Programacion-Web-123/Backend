const request = require('supertest');
const app = require('../app');

describe('App behavior', () => {
  test('OPTIONS preflight devuelve 200 y headers CORS', async () => {
    const res = await request(app).options('/products');
    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:3001');
    expect(res.headers['access-control-allow-methods']).toContain('OPTIONS');
  });

  test('GET a ruta inexistente devuelve 404 con JSON', async () => {
    const res = await request(app).get('/ruta-que-no-existe');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not found');
    expect(res.body).toHaveProperty('path', '/ruta-que-no-existe');
  });

  test('Manejador de errores devuelve 500', async () => {
    // inyectamos una ruta ad-hoc que lanza error
    app.get('/boom', () => { throw new Error('boom'); });
    const res = await request(app).get('/boom');
    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error', 'Internal Server Error');
  });
});
