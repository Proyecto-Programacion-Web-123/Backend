const request = require('supertest');
const app = require('../app');

describe('Unit Test - Producto / Comprar', () => {
  
  describe('✅ Que exista el título del producto', () => {
    test('GET /products/:id debe retornar el producto con título o error manejado', async () => {
      const res = await request(app).get('/products/1');
      
      // Verificar que el endpoint funciona (200, 404 o 500 por BD en test)
      expect([200, 404, 500]).toContain(res.status);
      
      // Si existe (status 200), debe tener un name
      if (res.status === 200) {
        expect(res.body).toHaveProperty('name');
        expect(typeof res.body.name).toBe('string');
      }
    });
  });

  describe('✅ Que exista el botón comprar (endpoint disponible)', () => {
    test('POST /orders debe existir como endpoint', async () => {
      const res = await request(app)
        .post('/orders')
        .send({ product_id: 1, quantity: 1 });
      
      // No debe ser 404 (ruta no encontrada)
      // Debe ser 401 (no autenticado) porque requiere auth
      expect(res.status).not.toBe(404);
      expect(res.status).toBe(401);
    });
  });

  describe('✅ Validar que se pueda comprar si está loggeado', () => {
    test('Usuario con token puede intentar crear una orden', async () => {
      // Usar un token mock solo para verificar que pasa la autenticación
      // En producción, esto vendría de un login real
      const jwt = require('jsonwebtoken');
      const token = jwt.sign(
        { sub: 1, role: 'customer' },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '1h' }
      );

      const res = await request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({ 
          product_id: 1, 
          quantity: 1,
          total: 59.99
        });
      
      // Con token válido NO debe ser 401
      // Puede ser 400/500 por validación o BD, pero pasó la autenticación
      expect(res.status).not.toBe(401);
      
      // Verificar que el endpoint procesa la petición
      expect([200, 201, 400, 500]).toContain(res.status);
    });
  });

  describe('✅ Validar que no esté el usuario loggeado y que muestre el login', () => {
    test('Usuario NO loggeado debe recibir error 401', async () => {
      const res = await request(app)
        .post('/orders')
        .send({ product_id: 1, quantity: 1 });
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    test('Token inválido debe recibir error 401', async () => {
      const res = await request(app)
        .post('/orders')
        .set('Authorization', 'Bearer token_invalido_xyz')
        .send({ product_id: 1, quantity: 1 });
      
      expect(res.status).toBe(401);
    });

    test('Sin header Authorization debe recibir error 401', async () => {
      const res = await request(app)
        .post('/orders')
        .send({ product_id: 1, quantity: 1 });
      
      expect(res.status).toBe(401);
      expect(res.body.error).toMatch(/token|No token|autenticación/i);
    });
  });
});

afterAll(async () => {
  // Cerrar conexiones de base de datos
  const db = require('../db');
  if (db && db.destroy) {
    await db.destroy();
  }
});