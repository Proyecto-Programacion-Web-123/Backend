jest.mock('../../services/orderService', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const controller = require('../orderController');
const svc = require('../../services/orderService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

const makeRes = () => ({ status: jest.fn(() => res), json: jest.fn() });
let res;
beforeEach(() => { res = makeRes(); jest.clearAllMocks(); });

test('500 en getAll', async () => {
  svc.getAll.mockRejectedValue(new Error('boom'));
  await controller.getOrders({}, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test('404 en getById', async () => {
  svc.getById.mockRejectedValue(new NotFoundError('x'));
  await controller.getOrderById({ params: { id: '2' } }, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('400 en create', async () => {
  svc.create.mockRejectedValue(new BadRequestError('bad'));
  await controller.createOrder({ body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('500 en update', async () => {
  svc.update.mockRejectedValue(new Error('boom'));
  await controller.updateOrder({ params: { id: '1' }, body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test('404 en delete', async () => {
  svc.delete.mockRejectedValue(new NotFoundError('nope'));
  await controller.deleteOrder({ params: { id: '1' } }, res);
  expect(res.status).toHaveBeenCalledWith(404);
});
