const db = require('../db');

const Order_detailModel = {
  findAll: () => db('order_details').whereNull('deleted_at').select('*'),
  findById: (id) => db('order_details').where({ id_orderDetail: id }).whereNull('deleted_at').first(),
  findByOrderId: (orderId) => db('order_details').where({ id_order: orderId }).whereNull('deleted_at'),
  create: (order_detail) => db('order_details').insert(order_detail),
  update: (id, order_detail) => db('order_details').where({ id_orderDdetail: id }).update(order_detail),
  delete: (id) => db('order_details').where({ id_order_detail: id }).update({ deleted_at: db.fn.now() })
};

module.exports = Order_detailModel;