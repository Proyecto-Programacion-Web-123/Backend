jest.mock('../../services/order_detailService', () => ({
  getAll: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));

const controller = require('../order_detailController');
const svc = require('../../services/order_detailService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

const makeRes = () => ({ status: jest.fn(() => res), json: jest.fn() });
let res;
beforeEach(() => { res = makeRes(); jest.clearAllMocks(); });

test('500 en getAll', async () => {
  svc.getAll.mockRejectedValue(new Error('boom'));
  await controller.getOrderDetails({}, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test('404 en getById', async () => {
  svc.getById.mockRejectedValue(new NotFoundError('x'));
  await controller.getOrderDetailById({ params: { id: '3' } }, res);
  expect(res.status).toHaveBeenCalledWith(404);
});

test('400 en create', async () => {
  svc.create.mockRejectedValue(new BadRequestError('bad'));
  await controller.createOrderDetail({ body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(400);
});

test('500 en update', async () => {
  svc.update.mockRejectedValue(new Error('boom'));
  await controller.updateOrderDetail({ params: { id: '1' }, body: {} }, res);
  expect(res.status).toHaveBeenCalledWith(500);
});

test('404 en delete', async () => {
  svc.delete.mockRejectedValue(new NotFoundError('nope'));
  await controller.deleteOrderDetail({ params: { id: '1' } }, res);
  expect(res.status).toHaveBeenCalledWith(404);
});
