const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const sequelize = require('../config/database');

// Get all orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            include: [
                { model: Customer, attributes: ['name', 'email'] },
                { model: Product, attributes: ['name', 'sku', 'price'] }
            ]
        });
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

// Get order by ID
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.id, {
            include: [
                { model: Customer, attributes: ['name', 'email', 'phone'] },
                { model: Product, attributes: ['name', 'sku', 'price'] }
            ]
        });
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
    const t = await sequelize.transaction();
    try {
        const { CustomerId, ProductId, quantity } = req.body;

        if (!CustomerId || !ProductId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid order data' });
        }

        // 1. Check Product & Stock
        const product = await Product.findByPk(ProductId, { transaction: t });
        if (!product) {
            await t.rollback();
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantity) {
            await t.rollback();
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // 2. Check Customer
        const customer = await Customer.findByPk(CustomerId, { transaction: t });
        if (!customer) {
            await t.rollback();
            return res.status(404).json({ message: 'Customer not found' });
        }

        // 3. Calculate Total Amount
        const totalAmount = (product.price * quantity).toFixed(2);

        // 4. Create Order
        const order = await Order.create({
            CustomerId,
            ProductId,
            quantity,
            totalAmount
        }, { transaction: t });

        // 5. Reduce Stock
        product.quantity -= quantity;
        await product.save({ transaction: t });

        await t.commit();
        
        // Return order with associated data
        const fullOrder = await Order.findByPk(order.id, {
            include: [
                { model: Customer, attributes: ['name', 'email'] },
                { model: Product, attributes: ['name', 'sku'] }
            ]
        });
        
        res.status(201).json(fullOrder);
    } catch (err) {
        await t.rollback();
        next(err);
    }
};

// Delete order (Cancel order)
exports.deleteOrder = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const order = await Order.findByPk(req.params.id, { transaction: t });
        if (!order) {
            await t.rollback();
            return res.status(404).json({ message: 'Order not found' });
        }

        // Optional: Restore stock when order is deleted/cancelled
        const product = await Product.findByPk(order.ProductId, { transaction: t });
        if (product) {
            product.quantity += order.quantity;
            await product.save({ transaction: t });
        }

        await order.destroy({ transaction: t });
        await t.commit();
        
        res.json({ message: 'Order deleted and stock restored' });
    } catch (err) {
        await t.rollback();
        next(err);
    }
};
