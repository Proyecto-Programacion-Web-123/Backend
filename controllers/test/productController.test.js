// ✅ Nombres reales que tu productController llama en el service:
// getProducts, getProductById, createProduct, updateProduct, deleteProduct

const makeRes = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.send = jest.fn(() => res);
  return res;
};

// Mock de los errores
jest.mock('../../utils/errors', () => ({
  BadRequestError: class BadRequestError extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadRequestError';
    }
  },
  NotFoundError: class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
    }
  }
}));

// Mock del servicio
jest.mock('../../services/productService', () => ({
  getProducts: jest.fn(),
  getProductById: jest.fn(),
  createProduct: jest.fn(),
  updateProduct: jest.fn(),
  deleteProduct: jest.fn(),
}));

const controller = require('../productController');
const productService = require('../../services/productService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

describe('productController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de éxito', () => {
    test('getAll -> 200', async () => {
      productService.getProducts.mockResolvedValue([{ id_product: 1 }]);
      const res = makeRes();
      await controller.getAll({}, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id_product: 1 }]);
    });

    test('getById -> 200', async () => {
      productService.getProductById.mockResolvedValue({ id_product: 3 });
      const res = makeRes();
      await controller.getById({ params: { id: '3' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id_product: 3 });
    });

    test('create -> 201', async () => {
      productService.createProduct.mockResolvedValue([21]);
      const res = makeRes();
      await controller.create({ body: { name: 'Pad' } }, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith([21]);
    });

    test('update -> 200', async () => {
      productService.updateProduct.mockResolvedValue(1);
      const res = makeRes();
      await controller.update({ params: { id: '1' }, body: { name: 'New' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(1);
    });

    test('delete -> 204', async () => {
      productService.deleteProduct.mockResolvedValue(1);
      const res = makeRes();
      await controller.delete({ params: { id: '1' } }, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    // Pruebas con los alias
    test('getProducts (alias) -> 200', async () => {
      productService.getProducts.mockResolvedValue([{ id_product: 1 }]);
      const res = makeRes();
      await controller.getProducts({}, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('getProductById (alias) -> 200', async () => {
      productService.getProductById.mockResolvedValue({ id_product: 3 });
      const res = makeRes();
      await controller.getProductById({ params: { id: '3' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Manejo de errores', () => {
    test('getAll -> 500 en error interno', async () => {
      productService.getProducts.mockRejectedValue(new Error('DB Error'));
      const res = makeRes();
      await controller.getAll({}, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    test('getById -> 404 cuando producto no se encuentra', async () => {
      productService.getProductById.mockRejectedValue(new NotFoundError('Product not found'));
      const res = makeRes();
      await controller.getById({ params: { id: '99' } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    test('getById -> 400 cuando ID es inválido', async () => {
      productService.getProductById.mockRejectedValue(new BadRequestError('Invalid product ID'));
      const res = makeRes();
      await controller.getById({ params: { id: 'invalid' } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid product ID' });
    });

    test('create -> 400 cuando body es inválido', async () => {
      productService.createProduct.mockRejectedValue(new BadRequestError('Name is required'));
      const res = makeRes();
      await controller.create({ body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Name is required' });
    });

    test('update -> 404 cuando producto no existe', async () => {
      productService.updateProduct.mockRejectedValue(new NotFoundError('Product not found'));
      const res = makeRes();
      await controller.update({ params: { id: '99' }, body: { name: 'New' } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    test('update -> 400 cuando datos son inválidos', async () => {
      productService.updateProduct.mockRejectedValue(new BadRequestError('Invalid price'));
      const res = makeRes();
      await controller.update({ params: { id: '1' }, body: { price: -10 } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid price' });
    });

    test('delete -> 404 cuando producto no existe', async () => {
      productService.deleteProduct.mockRejectedValue(new NotFoundError('Product not found'));
      const res = makeRes();
      await controller.delete({ params: { id: '99' } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found' });
    });

    test('delete -> 500 en error interno', async () => {
      productService.deleteProduct.mockRejectedValue(new Error('DB Error'));
      const res = makeRes();
      await controller.delete({ params: { id: '1' } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('Edge cases', () => {
    test('getById con params undefined', async () => {
      productService.getProductById.mockResolvedValue({ id_product: 1 });
      const res = makeRes();
      await controller.getById({}, res); // Sin params
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id_product: 1 });
    });

    test('create con body undefined', async () => {
      productService.createProduct.mockResolvedValue([21]);
      const res = makeRes();
      await controller.create({}, res); // Sin body
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith([21]);
    });

    test('update con body y params undefined', async () => {
      productService.updateProduct.mockResolvedValue(1);
      const res = makeRes();
      await controller.update({}, res); // Sin params ni body
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(1);
    });

    test('delete con params undefined', async () => {
      productService.deleteProduct.mockResolvedValue(1);
      const res = makeRes();
      await controller.delete({}, res); // Sin params
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('Compatibilidad con alias', () => {
    test('createProduct (alias) -> 201', async () => {
      productService.createProduct.mockResolvedValue([21]);
      const res = makeRes();
      await controller.createProduct({ body: { name: 'Pad' } }, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('deleteProduct (alias) -> 204', async () => {
      productService.deleteProduct.mockResolvedValue(1);
      const res = makeRes();
      await controller.deleteProduct({ params: { id: '1' } }, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });
});