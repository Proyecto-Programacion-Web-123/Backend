// ✅ Nombres reales que tu order_detailController llama en el service:
// getOrderDetails, getOrderDetailById, createOrderDetail, updateOrderDetail, deleteOrderDetail

const makeRes = () => {
  const r = {};
  r.status = jest.fn(() => r);
  r.json = jest.fn(() => r);
  r.send = jest.fn(() => r);
  return r;
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
jest.mock('../../services/order_detailService', () => ({
  getOrderDetails: jest.fn(),
  getOrderDetailById: jest.fn(),
  createOrderDetail: jest.fn(),
  updateOrderDetail: jest.fn(),
  deleteOrderDetail: jest.fn(),
}));

const controller = require('../order_detailController');
const orderDetailService = require('../../services/order_detailService');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

describe('order_detailController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Casos de éxito', () => {
    test('getAll -> 200', async () => {
      orderDetailService.getOrderDetails.mockResolvedValue([{ id_order_detail: 1 }]);
      const res = makeRes();
      await controller.getAll({}, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id_order_detail: 1 }]);
    });

    test('getById -> 200', async () => {
      orderDetailService.getOrderDetailById.mockResolvedValue({ id_order_detail: 2 });
      const res = makeRes();
      await controller.getById({ params: { id: '2' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id_order_detail: 2 });
    });

    test('create -> 201', async () => {
      orderDetailService.createOrderDetail.mockResolvedValue([51]);
      const res = makeRes();
      await controller.create({ body: { order_id: 1, product_id: 2, quantity: 3 } }, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith([51]);
    });

    test('update -> 200', async () => {
      orderDetailService.updateOrderDetail.mockResolvedValue(1);
      const res = makeRes();
      await controller.update({ params: { id: '1' }, body: { quantity: 5 } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(1);
    });

    test('delete -> 204', async () => {
      orderDetailService.deleteOrderDetail.mockResolvedValue(1);
      const res = makeRes();
      await controller.delete({ params: { id: '1' } }, res);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    // Pruebas con los alias
    test('getOrderDetails (alias) -> 200', async () => {
      orderDetailService.getOrderDetails.mockResolvedValue([{ id_order_detail: 1 }]);
      const res = makeRes();
      await controller.getOrderDetails({}, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('getOrderDetailById (alias) -> 200', async () => {
      orderDetailService.getOrderDetailById.mockResolvedValue({ id_order_detail: 2 });
      const res = makeRes();
      await controller.getOrderDetailById({ params: { id: '2' } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Manejo de errores', () => {
    test('getAll -> 500 en error interno', async () => {
      orderDetailService.getOrderDetails.mockRejectedValue(new Error('DB Error'));
      const res = makeRes();
      await controller.getAll({}, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    test('getById -> 404 cuando order detail no se encuentra', async () => {
      orderDetailService.getOrderDetailById.mockRejectedValue(new NotFoundError('Order detail not found'));
      const res = makeRes();
      await controller.getById({ params: { id: '99' } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order detail not found' });
    });

    test('getById -> 400 cuando ID es inválido', async () => {
      orderDetailService.getOrderDetailById.mockRejectedValue(new BadRequestError('Invalid order detail ID'));
      const res = makeRes();
      await controller.getById({ params: { id: 'invalid' } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid order detail ID' });
    });

    test('create -> 400 cuando body es inválido', async () => {
      orderDetailService.createOrderDetail.mockRejectedValue(new BadRequestError('Order ID and Product ID are required'));
      const res = makeRes();
      await controller.create({ body: {} }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order ID and Product ID are required' });
    });

    test('create -> 400 cuando quantity es inválida', async () => {
      orderDetailService.createOrderDetail.mockRejectedValue(new BadRequestError('Quantity must be positive'));
      const res = makeRes();
      await controller.create({ body: { order_id: 1, product_id: 2, quantity: -1 } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Quantity must be positive' });
    });

    test('update -> 404 cuando order detail no existe', async () => {
      orderDetailService.updateOrderDetail.mockRejectedValue(new NotFoundError('Order detail not found'));
      const res = makeRes();
      await controller.update({ params: { id: '99' }, body: { quantity: 5 } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order detail not found' });
    });

    test('update -> 400 cuando datos son inválidos', async () => {
      orderDetailService.updateOrderDetail.mockRejectedValue(new BadRequestError('Invalid quantity'));
      const res = makeRes();
      await controller.update({ params: { id: '1' }, body: { quantity: -5 } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid quantity' });
    });

    test('delete -> 404 cuando order detail no existe', async () => {
      orderDetailService.deleteOrderDetail.mockRejectedValue(new NotFoundError('Order detail not found'));
      const res = makeRes();
      await controller.delete({ params: { id: '99' } }, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order detail not found' });
    });

    test('delete -> 500 en error interno', async () => {
      orderDetailService.deleteOrderDetail.mockRejectedValue(new Error('DB Error'));
      const res = makeRes();
      await controller.delete({ params: { id: '1' } }, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('Edge cases', () => {
    test('getById con params undefined', async () => {
      orderDetailService.getOrderDetailById.mockResolvedValue({ id_order_detail: 1 });
      const res = makeRes();
      await controller.getById({}, res); // Sin params
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id_order_detail: 1 });
    });

    test('create con body undefined', async () => {
      orderDetailService.createOrderDetail.mockResolvedValue([51]);
      const res = makeRes();
      await controller.create({}, res); // Sin body
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith([51]);
    });

    test('update con body y params undefined', async () => {
      orderDetailService.updateOrderDetail.mockResolvedValue(1);
      const res = makeRes();
      await controller.update({}, res); // Sin params ni body
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(1);
    });

    test('delete con params undefined', async () => {
      orderDetailService.deleteOrderDetail.mockResolvedValue(1);
      const res = makeRes();
      await controller.delete({}, res); // Sin params
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('Compatibilidad con alias', () => {
    test('createOrderDetail (alias) -> 201', async () => {
      orderDetailService.createOrderDetail.mockResolvedValue([51]);
      const res = makeRes();
      await controller.createOrderDetail({ body: { order_id: 1, product_id: 2, quantity: 3 } }, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    test('updateOrderDetail (alias) -> 200', async () => {
      orderDetailService.updateOrderDetail.mockResolvedValue(1);
      const res = makeRes();
      await controller.updateOrderDetail({ params: { id: '1' }, body: { quantity: 5 } }, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    test('deleteOrderDetail (alias) -> 204', async () => {
      orderDetailService.deleteOrderDetail.mockResolvedValue(1);
      const res = makeRes();
      await controller.deleteOrderDetail({ params: { id: '1' } }, res);
      expect(res.status).toHaveBeenCalledWith(204);
    });
  });

  describe('Validaciones específicas de order details', () => {
    test('create -> 400 cuando falta order_id', async () => {
      orderDetailService.createOrderDetail.mockRejectedValue(new BadRequestError('Order ID is required'));
      const res = makeRes();
      await controller.create({ body: { product_id: 2, quantity: 3 } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order ID is required' });
    });

    test('create -> 400 cuando falta product_id', async () => {
      orderDetailService.createOrderDetail.mockRejectedValue(new BadRequestError('Product ID is required'));
      const res = makeRes();
      await controller.create({ body: { order_id: 1, quantity: 3 } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product ID is required' });
    });

    test('update -> 400 cuando quantity es cero', async () => {
      orderDetailService.updateOrderDetail.mockRejectedValue(new BadRequestError('Quantity cannot be zero'));
      const res = makeRes();
      await controller.update({ params: { id: '1' }, body: { quantity: 0 } }, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Quantity cannot be zero' });
    });
  });
});