const mongoose = require('mongoose');

/**
 * Subscriber Schema
 * Manages email subscriptions for newsletters and marketing updates.
 */
// FIXED: Changed "Subscribers Schema" to "SubscriberSchema" (No spaces)
const SubscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,          // Prevents duplicate subscriptions
        trim: true,            // Removes unnecessary spaces
        lowercase: true,       // Ensures consistency by storing emails in lowercase
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] // Basic email format validation
    },
    createdAt: {
        type: Date,
        default: Date.now      // Automatically stores subscription date
    }
});

/**
 * Exporting the Subscriber model.
 * The first argument is the name of the model ('Subscriber').
 * The second argument must match the variable name defined above.
 */
module.exports = mongoose.model('Subscriber', SubscriberSchema);