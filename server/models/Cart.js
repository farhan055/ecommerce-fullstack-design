const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    items: [
        {
            productId: { type: String, required: true },
            name: { type: String },
            price: { type: Number },
            image: { type: String },
            size: { type: String },
            quantity: { type: Number, default: 1 }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);