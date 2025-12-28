const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect } = require('../middleware/authMiddleware');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/* ================= STRIPE VERIFY ROUTE ================= */
// frontend: /api/orders/verify?id=...&session_id=...
router.get('/verify', async (req, res) => {
    const { id, session_id } = req.query;
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        
        if (session.payment_status === 'paid') {
            const order = await Order.findOneAndUpdate(
                { customOrderId: id },
                { isPaid: true },
                { new: true }
            );

            if (!order) {
                return res.status(404).json({ success: false, message: "Order not found" });
            }

            // Note: Email backend server.js se trigger hogi ya aap yahan bhi logic daal sakte hain
            res.json({ success: true, order });
        } else {
            res.status(400).json({ success: false, message: "Payment not verified" });
        }
    } catch (err) {
        console.error("Verify Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

/* ================= GET SINGLE ORDER ================= */
router.get('/single/:orderId', async (req, res) => {
    try {
        const order = await Order.findOne({ customOrderId: req.params.orderId });
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= CANCEL ORDER ================= */
router.put('/cancel/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.isCancelled = true;
        await order.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;