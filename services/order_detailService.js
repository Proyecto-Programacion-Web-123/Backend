// services/order_detailService.js
const Order_detailModel = require('../models/order_detailModel');
const { BadRequestError, NotFoundError } = require('../utils/errors');
const OrderDetailDto = require('../dto/orderDetailDTO');

const OrderDetailService = {
  async getOrderDetails() {
    const details = await Order_detailModel.findAll();
    return OrderDetailDto.map(details);
  },

  async getOrderDetailById(id) {
    if (!id) throw new BadRequestError('Order Detail ID is required');
    const detail = await Order_detailModel.findById(id);
    if (!detail) throw new NotFoundError('Order Detail not found');
    return new OrderDetailDto(detail);
  },

  async createOrderDetail({ id_order, id_product, quantity, unit_price, subtotal }) {
    if (!id_order || !id_product || !quantity || !unit_price || !subtotal) {
      throw new BadRequestError('Order, product, quantity, unit price, and subtotal are required');
    }
    const detail = await Order_detailModel.create({ id_order, id_product, quantity, unit_price, subtotal });
    return new OrderDetailDto(detail);
  },

  async updateOrderDetail(id, updates) {
    if (!id) throw new BadRequestError('Order Detail ID is required');
    const detail = await Order_detailModel.update(id, updates);
    if (!detail) throw new NotFoundError('Order Detail not found');
    return new OrderDetailDto(detail);
  },

  async deleteOrderDetail(id) {
    if (!id) throw new BadRequestError('Order Detail ID is required');
    const detail = await Order_detailModel.delete(id);
    if (!detail) throw new NotFoundError('Order Detail not found');
    return new OrderDetailDto(detail);
  },
};

// Alias para compatibilidad con tests/controladores
module.exports = {
  // nombres originales
  getOrderDetails: OrderDetailService.getOrderDetails,
  getOrderDetailById: OrderDetailService.getOrderDetailById,
  createOrderDetail: OrderDetailService.createOrderDetail,
  updateOrderDetail: OrderDetailService.updateOrderDetail,
  deleteOrderDetail: OrderDetailService.deleteOrderDetail,

  // alias genéricos
  getAll: OrderDetailService.getOrderDetails,
  getById: OrderDetailService.getOrderDetailById,
  create: OrderDetailService.createOrderDetail,
  update: OrderDetailService.updateOrderDetail,
  delete: OrderDetailService.deleteOrderDetail,
};
