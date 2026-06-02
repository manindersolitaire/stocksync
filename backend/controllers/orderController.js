const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// Get all orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('CustomerId', 'name email')
            .populate('ProductId', 'name sku price');
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

// Get order by ID
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('CustomerId', 'name email phone')
            .populate('ProductId', 'name sku price');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (err) {
        next(err);
    }
};

// Create order
exports.createOrder = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { CustomerId, ProductId, quantity } = req.body;

        if (!CustomerId || !ProductId || !quantity || quantity <= 0) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Invalid order data' });
        }

        // 1. Check Product & Stock
        const product = await Product.findById(ProductId).session(session);
        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantity) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // 2. Check Customer
        const customer = await Customer.findById(CustomerId).session(session);
        if (!customer) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Customer not found' });
        }

        // 3. Calculate Total Amount
        const totalAmount = (product.price * quantity).toFixed(2);

        // 4. Create Order
        const orderArray = await Order.create([{
            CustomerId,
            ProductId,
            quantity,
            totalAmount
        }], { session });
        const order = orderArray[0];

        // 5. Reduce Stock
        product.quantity -= quantity;
        await product.save({ session });

        await session.commitTransaction();
        session.endSession();
        
        // Return order with associated data
        const fullOrder = await Order.findById(order._id)
            .populate('CustomerId', 'name email')
            .populate('ProductId', 'name sku');
        
        res.status(201).json(fullOrder);
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

// Delete order (Cancel order)
exports.deleteOrder = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order = await Order.findById(req.params.id).session(session);
        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Order not found' });
        }

        // Optional: Restore stock when order is deleted/cancelled
        const product = await Product.findById(order.ProductId).session(session);
        if (product) {
            product.quantity += order.quantity;
            await product.save({ session });
        }

        await Order.findByIdAndDelete(order._id).session(session);
        await session.commitTransaction();
        session.endSession();
        
        res.json({ message: 'Order deleted and stock restored' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};
