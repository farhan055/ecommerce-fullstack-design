const Cart = require('../models/Cart');

// GET Cart by UserID
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(200).json({ items: [] });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// SAVE or UPDATE Cart
exports.saveCart = async (req, res) => {
    const { userId, items } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = items;
            await cart.save();
        } else {
            cart = new Cart({ userId, items });
            await cart.save();
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};