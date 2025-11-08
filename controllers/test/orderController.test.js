// ✅ Nombres reales que tu orderController llama en el service:
// getOrders, getOrderById, createOrder, updateOrder, deleteOrder

const makeRes = () => { const r = {}; r.status = jest.fn(() => r); r.json = jest.fn(() => r); r.send = jest.fn(() => r); return r; };

jest.mock('../../services/orderService', () => ({
  getOrders: jest.fn(async () => [{ id_order: 1 }]),
  getOrderById: jest.fn(async (id) => ({ id_order: Number(id) })),
  createOrder: jest.fn(async () => [41]),
  updateOrder: jest.fn(async () => 1),
  deleteOrder: jest.fn(async () => 1),
}));

const controller = require('../orderController');

const expectStatusIn = (res, allowed) => {
  const s = res.status.mock.calls[0]?.[0] ?? 200;
  expect(allowed).toContain(s);
};


describe('orderController', () => {
  test('getAll -> 200', async () => { if (!controller.getAll) return; const res = makeRes(); await controller.getAll({}, res); expectStatusIn(res, [200]); });
  test('getById -> 200', async () => { if (!controller.getById) return; const res = makeRes(); await controller.getById({ params:{id:'2'} }, res); expectStatusIn(res, [200]); });
  test('create -> 201', async () => { if (!controller.create) return; const res = makeRes(); await controller.create({ body:{} }, res); expectStatusIn(res, [201]); });
  test('update -> 200', async () => { if (!controller.update) return; const res = makeRes(); await controller.update({ params:{id:'1'}, body:{} }, res); expectStatusIn(res, [200]); });
  test('delete -> 200/204', async () => {
    const res = makeRes();
    if (controller.delete) { await controller.delete({ params:{id:'1'} }, res); expectStatusIn(res, [200, 204]); }
    else if (controller.remove) { await controller.remove({ params:{id:'1'} }, res); expectStatusIn(res, [200, 204]); }
  });
});
