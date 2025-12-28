const express = require('express');
const router = express.Router();

// Middleware
const { protect } = require('../middleware/authMiddleware');

// Controller logic
const { 
    register, 
    login, 
    forgotPassword, 
    resetPassword, 
    getMe,
    updateProfile, 
    deleteUser,    
    addPaymentMethod,
    updateAddress,
    subscribeEmail,
    handleInquiry 
} = require('../controllers/authController');

// --- PUBLIC ROUTES ---
router.get('/ping', (req, res) => res.json({ message: "Auth system is running fine!" }));
router.post('/register', register); // 👈 Ye ab sahi chale ga
router.post('/login', login);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPassword);
router.post('/inquires', handleInquiry); 
router.post('/subscribe', subscribeEmail); 

// --- PRIVATE ROUTES ---
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile); 
router.delete('/me', protect, deleteUser);      
router.post('/add-payment', protect, addPaymentMethod);
router.post('/update-address', protect, updateAddress);

// Admin route
router.get('/newsletter', protect, async (req, res) => {
    const Subscriber = require('../models/Subscriber');
    try {
        const subs = await Subscriber.find().sort({ createdAt: -1 });
        res.json(subs);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch subscribers" });
    }
});

module.exports = router;