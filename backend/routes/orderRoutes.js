const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { orderValidation } = require('../middleware/validation');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.post('/', orderValidation, orderController.createOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
