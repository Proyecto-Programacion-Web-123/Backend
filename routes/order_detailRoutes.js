const express = require('express');
const Order_detailController = require('../controllers/order_detailController');
const router = express.Router();

router.get('/', Order_detailController.getAll);
router.get('/:id', Order_detailController.getById);
router.post('/', Order_detailController.create);
router.put('/:id', Order_detailController.update);
router.delete('/:id', Order_detailController.delete);

module.exports = router;
