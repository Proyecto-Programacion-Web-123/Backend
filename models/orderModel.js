const db = require('../db');

const OrderModel = {
  findAll: () => db('orders').whereNull('deleted_at').select('*'),
  findById: (id) => db('orders').where({ id_order: id }).whereNull('deleted_at').first(),
  create: (order) => db('orders').insert(order),
  update: (id, order) => db('orders').where({ id_order: id }).update(order),
  delete: (id) => db('orders').where({ id_order: id }).update({ deleted_at: db.fn.now() })
};

module.exports = OrderModel;