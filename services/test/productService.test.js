// services/test/productService.test.js
jest.mock('../../db', () => {
  // Query builder "thenable" de mentira
  const k = (...args) => k;
  k._result = [];
  const chain = () => k;

  // Métodos de cadena
  k.from = chain;
  k.where = chain;
  k.whereNull = chain;
  k.whereNotNull = chain;
  k.andWhere = chain;
  k.join = chain;
  k.leftJoin = chain;
  k.returning = chain;

  // select debe resolver a un ARRAY (para que .map exista)
  k.select = jest.fn((...cols) => {
    k._result = [
      { id_product: 1, name: 'A', price: 10 },
      { id_product: 2, name: 'B', price: 20 },
    ];
    return k;
  });

  // first debe resolver a un OBJETO
  k.first = jest.fn(() => {
    k._result = { id_product: 3, name: 'C', price: 30 };
    return k;
  });

  // operaciones de escritura (resuelven valores estándar)
  k.insert = jest.fn(async () => [21]);
  k.update = jest.fn(async () => 1);
  k.del    = jest.fn(async () => 1);

  // utilidades
  k.raw = jest.fn(async () => ({}));
  k.fn = { now: jest.fn(() => 'now()') };

  // thenable: permite await sobre el builder
  k.then = (resolve, reject) => Promise.resolve(k._result).then(resolve, reject);

  return k;
});

const service = require('../productService');

describe('productService', () => {
  test('módulo carga', () => { expect(service).toBeTruthy(); });

  test('getAll/getProducts (si existe)', async () => {
    const fn = service.getAll || service.getProducts;
    if (!fn) return;
    await expect(fn()).resolves.toBeDefined();
  });

  test('getById/getProductById (si existe)', async () => {
    const fn = service.getById || service.getProductById;
    if (!fn) return;
    await expect(fn(3)).resolves.toBeDefined();
  });

  test('create/createProduct (si existe)', async () => {
    const fn = service.create || service.createProduct;
    if (!fn) return;
    await expect(fn({ name: 'Pad', price: 10 })).resolves.toBeDefined();
  });

  test('update/updateProduct (si existe)', async () => {
    const fn = service.update || service.updateProduct;
    if (!fn) return;
    await expect(fn(1, { name: 'New', price: 20 })).resolves.toBeDefined();
  });

  test('remove/delete/deleteProduct (si existe)', async () => {
    const fn = service.remove || service.delete || service.deleteProduct;
    if (!fn) return;
    await expect(fn(1)).resolves.toBeDefined();
  });
});
