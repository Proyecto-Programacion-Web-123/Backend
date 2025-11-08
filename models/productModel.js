const db = require('../db');

const ProductModel = {
  findAll: () => db('products').whereNull('deleted_at').select('*'),
  findById: (id) => db('products').where({ id_product: id }).whereNull('deleted_at').first(),
  create: (product) => db('products').insert(product),
  update: (id, product) => db('products').where({ id_product: id }).update(product),
  delete: (id) => db('products').where({ id_product: id }).update({ deleted_at: db.fn.now() })
};

module.exports = ProductModel;