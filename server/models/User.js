const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Defines user profile, authentication credentials, and account permissions.
 */
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User name is required'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        lowercase: true 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'] 
    },
    gender: { 
        type: String, 
        enum: ['male', 'female'], 
        default: 'male' 
    },
    isAdmin: { 
        type: Boolean, 
        default: false 
    },
    resetPasswordCode: { type: String },
    resetPasswordExpires: { type: Date },

},{ 
    timestamps: true 
});

/**
 * Pre-save Middleware
 * Optimized to handle async/await without the 'next' conflict.
 */
userSchema.pre('save', async function() {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) {
        return; 
    }

    try {
        const salt = await bcrypt.genSalt(10); 
        this.password = await bcrypt.hash(this.password, salt); 
    } catch (error) {
        throw error;
    }
});

/**
 * Instance Method: comparePassword
 * Verifies if the provided plain-text password matches the stored hash.
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);