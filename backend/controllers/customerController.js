const Customer = require('../models/Customer');

// Get all customers
exports.getAllCustomers = async (req, res, next) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (err) {
        next(err);
    }
};

// Get customer by ID
exports.getCustomerById = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        next(err);
    }
};

// Create customer
exports.createCustomer = async (req, res, next) => {
    try {
        const { name, email, phone } = req.body;
        
        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const customer = await Customer.create({
            name,
            email,
            phone
        });
        res.status(201).json(customer);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        next(err);
    }
};

// Delete customer
exports.deleteCustomer = async (req, res, next) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted' });
    } catch (err) {
        next(err);
    }
};
