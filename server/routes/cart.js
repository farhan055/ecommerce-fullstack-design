const router = require('express').Router();
const Cart = require('../models/Cart');

// @desc    Save or Update Cart (Persist from LocalStorage to DB)
router.post('/save', async (req, res) => {
    const { userId, items } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        if (cart) {
            cart.items = items; // Purani items ko naye data se replace karo
            await cart.save();
        } else {
            cart = await Cart.create({ userId, items });
        }
        res.status(200).json({ success: true, cart });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error", error: err });
    }
});

// @desc    Get Specific User Cart by ID
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(200).json({ items: [] }); // Agar cart na mile toh khali array bhejo
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ success: false, message: "Fetch Error", error: err });
    }
});

// @desc    Clear Cart after Order Placement (Optional but helpful)
router.delete('/clear/:userId', async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.params.userId });
        res.status(200).json({ success: true, message: "Cart Cleared" });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;