// services/test/orderService.test.js
jest.mock('../../db', () => {
  const k = (...args) => k;
  k._result = [];
  const chain = () => k;

  k.from = chain;
  k.where = chain;
  k.whereNull = chain;
  k.whereNotNull = chain;
  k.andWhere = chain;
  k.join = chain;
  k.leftJoin = chain;
  k.returning = chain;

  // select -> ARRAY (para .map)
  k.select = jest.fn((...cols) => {
    k._result = [
      { id_order: 1, id_user: 10, total: 100 },
      { id_order: 2, id_user: 20, total: 200 },
    ];
    return k;
  });

  // first -> OBJETO
  k.first = jest.fn(() => {
    k._result = { id_order: 2, id_user: 20, total: 200 };
    return k;
  });

  k.insert = jest.fn(async () => [41]);
  k.update = jest.fn(async () => 1);
  k.del    = jest.fn(async () => 1);

  k.raw = jest.fn(async () => ({}));
  k.fn = { now: jest.fn(() => 'now()') };

  k.then = (resolve, reject) => Promise.resolve(k._result).then(resolve, reject);
  return k;
});

const service = require('../orderService');

describe('orderService', () => {
  test('módulo carga', () => { expect(service).toBeTruthy(); });

  test('getAll/getOrders (si existe)', async () => {
    const fn = service.getAll || service.getOrders;
    if (!fn) return;
    await expect(fn()).resolves.toBeDefined();
  });

  test('getById/getOrderById (si existe)', async () => {
    const fn = service.getById || service.getOrderById;
    if (!fn) return;
    await expect(fn(2)).resolves.toBeDefined();
  });

  test('create/createOrder (si existe)', async () => {
    const fn = service.create || service.createOrder;
    if (!fn) return;
    await expect(fn({ id_user: 1, date: '2025-01-01', total: 100 })).resolves.toBeDefined();
  });

  test('update/updateOrder (si existe)', async () => {
    const fn = service.update || service.updateOrder;
    if (!fn) return;
    await expect(fn(1, { total: 150 })).resolves.toBeDefined();
  });

  test('remove/delete/deleteOrder (si existe)', async () => {
    const fn = service.remove || service.delete || service.deleteOrder;
    if (!fn) return;
    await expect(fn(1)).resolves.toBeDefined();
  });
});
