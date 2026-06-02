const { body, validationResult } = require('express-validator');

// Generic validation cleaner
const validate = (validations) => {
    return async (req, res, next) => {
        console.log(`Validating request: ${req.method} ${req.originalUrl}`);
        for (const validation of validations) {
            const result = await validation.run(req);
            if (result.errors.length) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    };
};

// Product validations
exports.productValidation = validate([
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('sku').notEmpty().withMessage('SKU is required').trim(),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantity').isInt({ min: 0 }).withMessage('Quantity cannot be negative')
]);

// Customer validations
exports.customerValidation = validate([
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').notEmpty().withMessage('Phone is required').trim()
]);

// Order validations
exports.orderValidation = validate([
    body('CustomerId').isMongoId().withMessage('Valid Customer ID is required'),
    body('ProductId').isMongoId().withMessage('Valid Product ID is required'),
    body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')
]);
