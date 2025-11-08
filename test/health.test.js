const request = require('supertest');
const app = require('../app');   // app.js exporta module.exports = app;

describe('Healthcheck', () => {
  it('GET /health -> 200 y {ok:true}', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
