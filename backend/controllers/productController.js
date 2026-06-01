const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) {
        next(err);
    }
};

// Get product by ID
exports.getProductById = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        next(err);
    }
};

// Create product
exports.createProduct = async (req, res, next) => {
    try {
        const { name, sku, price, quantity } = req.body;
        
        // Basic validation
        if (!name || !sku || price === undefined || quantity === undefined) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const product = await Product.create({
            name,
            sku,
            price,
            quantity
        });
        res.status(201).json(product);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'SKU must be unique' });
        }
        next(err);
    }
};

// Update product
exports.updateProduct = async (req, res, next) => {
    try {
        const { name, sku, price, quantity } = req.body;
        const product = await Product.findByPk(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (name) product.name = name;
        if (sku) product.sku = sku;
        if (price !== undefined) product.price = price;
        if (quantity !== undefined) product.quantity = quantity;

        await product.save();
        res.json(product);
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'SKU must be unique' });
        }
        next(err);
    }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        next(err);
    }
};
