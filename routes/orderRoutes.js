const express = require('express');
const OrderController = require('../controllers/orderController');
const { auth } = require('../middlewares/auth');

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.get('/user', auth(), OrderController.getOrdersByUser); // Historial del usuario
router.post('/', auth(), OrderController.create); // Crear orden (comprar)

// Rutas administrativas (opcional, puedes protegerlas más adelante)
router.get('/', OrderController.getAll);
router.get('/:id', OrderController.getById);
router.put('/:id', OrderController.update);
router.delete('/:id', OrderController.delete);

module.exports = router;