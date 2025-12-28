const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware: protect
 * Verifies the JWT sent in the Authorization header.
 * Ensures the user is logged in before allowing access to private routes.
 */
const protect = async (req, res, next) => {
    let token;

    // Check if the request contains a Bearer token in the headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from the "Bearer <token>" string
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'MensWear_Super_Secret_Sporty_Key_2025');

            // Find the user in the database (excluding password) and attach to the request object
            req.user = await User.findById(decoded.id).select('-password');

            return next(); // Proceed to the next middleware or controller
        } catch (error) {
            // If token is invalid or expired
            return res.status(401).json({ message: 'NOT AUTHORIZED, TOKEN FAILED' });
        }
    }

    // If no token is provided in the headers
    if (!token) {
        return res.status(401).json({ message: 'NOT AUTHORIZED, NO TOKEN' });
    }
};

/**
 * Authorization Middleware: admin
 * Restricts access to Admin-only routes.
 * Must be used after the 'protect' middleware to ensure req.user exists.
 */
exports.admin = (req, res, next) => {
    // Check if the user is authenticated AND has admin privileges
    if (req.user && req.user.isAdmin) {
        next(); // User is an admin, proceed to the route
    } else {
        // Access denied for non-admin users
        res.status(401).json({ message: "NOT AUTHORIZED AS ADMIN" });
    }
};

module.exports = { protect };