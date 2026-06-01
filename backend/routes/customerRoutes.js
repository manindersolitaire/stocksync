const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { customerValidation } = require('../middleware/validation');

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerValidation, customerController.createCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
