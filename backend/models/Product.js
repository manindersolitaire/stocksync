const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0, min: 0 }
}, {
  timestamps: true
});

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Product', productSchema);
