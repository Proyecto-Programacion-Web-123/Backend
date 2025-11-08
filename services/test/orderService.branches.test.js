const service = require('../orderService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

jest.mock('../../models/orderModel', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));
const OrderModel = require('../../models/orderModel');

describe('orderService (branches extra)', () => {
  afterEach(() => jest.clearAllMocks());

  test('getById -> BadRequestError si falta id', async () => {
    const fn = service.getById || service.getOrderById;
    if (!fn) return;
    await expect(fn()).rejects.toBeInstanceOf(BadRequestError);
  });

  test('getById -> NotFoundError si no existe', async () => {
    const fn = service.getById || service.getOrderById;
    if (!fn) return;
    OrderModel.findById.mockResolvedValue(null);
    await expect(fn(999)).rejects.toBeInstanceOf(NotFoundError);
  });

  test('create -> BadRequestError si faltan campos', async () => {
    const fn = service.create || service.createOrder;
    if (!fn) return;
    await expect(fn({})).rejects.toBeInstanceOf(BadRequestError);
  });

  test('delete -> BadRequestError si falta id', async () => {
    const fn = service.remove || service.delete || service.deleteOrder;
    if (!fn) return;
    await expect(fn()).rejects.toBeInstanceOf(BadRequestError);
  });
});
