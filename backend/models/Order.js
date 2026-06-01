const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./Customer');
const Product = require('./Product');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: true
});

// Associations
Order.belongsTo(Customer, { foreignKey: { allowNull: false } });
Customer.hasMany(Order);

Order.belongsTo(Product, { foreignKey: { allowNull: false } });
Product.hasMany(Order);

module.exports = Order;
