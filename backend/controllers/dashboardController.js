const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalProducts = await Product.count();
        const totalCustomers = await Customer.count();
        const totalOrders = await Order.count();
        
        // Low stock products (quantity < 10)
        const lowStockProducts = await Product.findAll({
            where: {
                quantity: {
                    [Op.lt]: 10
                }
            },
            limit: 5,
            order: [['quantity', 'ASC']]
        });

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
