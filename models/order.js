const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  point: { type: Number, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true
  },
});



const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
