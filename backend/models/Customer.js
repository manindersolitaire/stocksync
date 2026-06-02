const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }
}, {
  timestamps: true
});

customerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { ret.id = ret._id; delete ret._id; }
});

module.exports = mongoose.model('Customer', customerSchema);
