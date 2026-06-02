const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await Customer.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        // Low stock products (quantity < 10)
        const lowStockProducts = await Product.find({
            quantity: { $lt: 10 }
        })
        .sort({ quantity: 1 })
        .limit(5);

        res.json({
            totalProducts,
            totalCustomers,
            totalOrders,
            lowStockProducts
        });
    } catch (err) {
        next(err);
    }
};
