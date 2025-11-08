const UserService = require('../services/userService');
const { BadRequestError, NotFoundError } = require('../utils/errors');

function handleError(err, res) {
  if (err instanceof BadRequestError) return res.status(400).json({ error: err.message });
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
}

async function getAll(_req, res) {
  try {
    const data = await (UserService.getAll || UserService.getUsers)();
    return res.status(200).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}

async function getById(req, res) {
  try {
    const { id } = req.params || {};
    const data = await (UserService.getById || UserService.getUserById)(id);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}

async function create(req, res) {
  try {
    const payload = req.body || {};
    const data = await (UserService.create || UserService.createUser)(payload);
    return res.status(201).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}

async function update(req, res) {
  try {
    const { id } = req.params || {};
    const updates = req.body || {};
    const data = await (UserService.update || UserService.updateUser)(id, updates);
    return res.status(200).json(data);
  } catch (err) {
    return handleError(err, res);
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params || {};
    await (UserService.delete || UserService.deleteUser)(id);
    return res.status(204).send();
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
  // alias esperados por tests de errores
  getUsers: getAll,
  getUserById: getById,
  createUser: create,
  updateUser: update,
  deleteUser: remove,
};
