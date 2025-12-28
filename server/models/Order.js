const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customOrderId: { type: String, required: true, unique: true },
    orderItems: [
      {
        name: { type: String },
        qty: { type: Number },
        image: { type: String }, 
        price: { type: Number }, 
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      },
    ],
    shippingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    phone: { type: String }, 
    email: { type: String }, 
    paymentMethod: { type: String },
    currencyCode: { type: String },
    totalPrice: { type: Number },
    status: { type: String, default: 'Processing' },
    isPaid: { type: Boolean, default: false },
    expectedDelivery: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);