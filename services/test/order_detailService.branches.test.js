const service = require('../order_detailService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

jest.mock('../../models/order_detailModel', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));
const OrderDetailModel = require('../../models/order_detailModel');

describe('order_detailService (branches extra)', () => {
  afterEach(() => jest.clearAllMocks());

  test('getById -> BadRequestError si falta id', async () => {
    const fn = service.getById || service.getOrderDetailById;
    if (!fn) return;
    await expect(fn()).rejects.toBeInstanceOf(BadRequestError);
  });

  test('getById -> NotFoundError si no existe', async () => {
    const fn = service.getById || service.getOrderDetailById;
    if (!fn) return;
    OrderDetailModel.findById.mockResolvedValue(null);
    await expect(fn(777)).rejects.toBeInstanceOf(NotFoundError);
  });

  test('create -> BadRequestError si faltan campos', async () => {
    const fn = service.create || service.createOrderDetail;
    if (!fn) return;
    await expect(fn({})).rejects.toBeInstanceOf(BadRequestError);
  });

  test('update -> BadRequestError si falta id', async () => {
    const fn = service.update || service.updateOrderDetail;
    if (!fn) return;
    await expect(fn(undefined, {})).rejects.toBeInstanceOf(BadRequestError);
  });

  test('delete -> BadRequestError si falta id', async () => {
    const fn = service.remove || service.delete || service.deleteOrderDetail;
    if (!fn) return;
    await expect(fn()).rejects.toBeInstanceOf(BadRequestError);
  });
});
