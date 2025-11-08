const OrderService = require('../services/orderService');
const { BadRequestError, NotFoundError } = require('../utils/errors');

function handleError(err, res) {
  if (err instanceof BadRequestError) return res.status(400).json({ error: err.message });
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

async function getAll(_req, res) {
  try {
    const data = await (OrderService.getAll || OrderService.getOrders)();
    return res.status(200).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params || {};
    const data = await OrderService.getById(id);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}

async function create(req, res) {
  try {
    const payload = req.body || {};
    
    // Agregar el user_id del token
    if (req.user?.id) {
      payload.user_id = req.user.id;
    }
    
    const data = await (OrderService.create || OrderService.createOrder)(payload);
    return res.status(201).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params || {};
    const updates = req.body || {};
    const data = await (OrderService.update || OrderService.updateOrder)(id, updates);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params || {};
    await (OrderService.delete || OrderService.deleteOrder)(id);
    return res.status(204).send();
  } catch (err) {
    return handleError(err, res);
  }
}

async function getOrdersByUser(req, res) {
  try {
    // Obtener el user_id del token JWT (ya viene en req.user)
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    
    const data = await OrderService.getOrdersByUser(userId);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}


module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: remove,
  getOrdersByUser,
  // alias esperados por tests de errores
  getOrders: getAll,
  getOrderById: getById,
  createOrder: create,
  updateOrder: update,
  deleteOrder: remove,
};
