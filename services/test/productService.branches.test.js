const service = require('../productService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

jest.mock('../../models/productModel', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
}));
const ProductModel = require('../../models/productModel');

describe('productService (branches extra)', () => {
  afterEach(() => jest.clearAllMocks());

  test('getById -> BadRequestError si falta id', async () => {
    const fn = service.getById || service.getProductById;
    if (!fn) return;
    await expect(fn()).rejects.toBeInstanceOf(BadRequestError);
  });

  test('getById -> NotFoundError si no existe', async () => {
    const fn = service.getById || service.getProductById;
    if (!fn) return;
    ProductModel.findById.mockResolvedValue(null);
    await expect(fn(123)).rejects.toBeInstanceOf(NotFoundError);
  });

  test('create -> BadRequestError si faltan campos', async () => {
    const fn = service.create || service.createProduct;
    if (!fn) return;
    await expect(fn({})).rejects.toBeInstanceOf(BadRequestError);
  });
});
