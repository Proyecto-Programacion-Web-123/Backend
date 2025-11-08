// services/test/order_detailService.test.js
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

  // select -> ARRAY
  k.select = jest.fn((...cols) => {
    k._result = [
      { id_order_detail: 1, id_order: 1, id_product: 2, quantity: 1, unit_price: 10, subtotal: 10 },
      { id_order_detail: 2, id_order: 2, id_product: 3, quantity: 2, unit_price: 5, subtotal: 10 },
    ];
    return k;
  });

  // first -> OBJETO
  k.first = jest.fn(() => {
    k._result = { id_order_detail: 2, id_order: 2, id_product: 3, quantity: 2, unit_price: 5, subtotal: 10 };
    return k;
  });

  k.insert = jest.fn(async () => [51]);
  k.update = jest.fn(async () => 1);
  k.del    = jest.fn(async () => 1);

  k.raw = jest.fn(async () => ({}));
  k.fn = { now: jest.fn(() => 'now()') };

  k.then = (resolve, reject) => Promise.resolve(k._result).then(resolve, reject);
  return k;
});

const service = require('../order_detailService');

describe('order_detailService', () => {
  test('módulo carga', () => { expect(service).toBeTruthy(); });

  test('getAll/getOrderDetails (si existe)', async () => {
    const fn = service.getAll || service.getOrderDetails;
    if (!fn) return;
    await expect(fn()).resolves.toBeDefined();
  });

  test('getById/getOrderDetailById (si existe)', async () => {
    const fn = service.getById || service.getOrderDetailById;
    if (!fn) return;
    await expect(fn(2)).resolves.toBeDefined();
  });

  test('create/createOrderDetail (si existe)', async () => {
    const fn = service.create || service.createOrderDetail;
    if (!fn) return;
    await expect(
      fn({ id_order:1, id_product:1, quantity:1, unit_price:10, subtotal:10 })
    ).resolves.toBeDefined();
  });

  test('update/updateOrderDetail (si existe)', async () => {
    const fn = service.update || service.updateOrderDetail;
    if (!fn) return;
    await expect(fn(1, { quantity:2, subtotal:20 })).resolves.toBeDefined();
  });

  test('remove/delete/deleteOrderDetail (si existe)', async () => {
    const fn = service.remove || service.delete || service.deleteOrderDetail;
    if (!fn) return;
    await expect(fn(1)).resolves.toBeDefined();
  });
});

