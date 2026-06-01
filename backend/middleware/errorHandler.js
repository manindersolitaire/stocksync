const errorHandler = (err, req, res, next) => {
    console.log('Error Handler caught error:', err.message, 'Code:', err.code, 'Status:', err.status);
    console.error(err.stack);

    let statusCode = err.status || err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
    let message = err.message || 'Internal Server Error';

    // Handle Mongoose duplicate key error (11000)
    if (err.code === 11000) {
        statusCode = 409;
        let field = 'Field';
        if (err.keyPattern) {
            field = Object.keys(err.keyPattern)[0];
            field = field.charAt(0).toUpperCase() + field.slice(1);
        } else if (err.message && err.message.includes('index:')) {
            // Fallback for some mongoose versions
            const match = err.message.match(/index: (\w+)_/);
            if (match) field = match[1].charAt(0).toUpperCase() + match[1].slice(1);
        }
        message = `${field} already exists`;
    }


    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Handle CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = errorHandler;
