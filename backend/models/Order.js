const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  CustomerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  ProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true }
}, {
  timestamps: true
});

orderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Order', orderSchema);
