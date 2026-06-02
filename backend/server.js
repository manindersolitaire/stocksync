const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/database');

// Import models (optional in Mongoose but good for consistency)
require('./models/Product');
require('./models/Customer');
require('./models/Order');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => res.send('StockSync API is running...'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Error Handler
app.use(require('./middleware/errorHandler'));

// Database Connection and Server Start
const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

startServer();
