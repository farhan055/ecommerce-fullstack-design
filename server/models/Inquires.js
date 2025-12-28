const mongoose = require('mongoose');

/**
 * Inquiry Schema
 * Captures custom product inquiries and bulk order requests from users.
 * This is designed with a sporty/bold data format for consistent logging.
 */
const inquirySchema = new mongoose.Schema({
    // Product or item name for which inquiry is made
    item: { 
        type: String, 
        required: [true, 'PRODUCT NAME IS REQUIRED'],
        uppercase: true // Enforces bold/uppercase styling for data consistency
    },
    // Detailed description of the user's specific request or query
    details: { 
        type: String, 
        required: [true, 'DETAILS ARE REQUIRED'] 
    },
    // Numeric quantity requested by the user
    quantity: { 
        type: Number, 
        required: [true, 'QUANTITY IS REQUIRED'] 
    },
    // Measuring unit for the product (e.g., Pcs, Boxes, Pairs)
    unit: { 
        type: String, 
        default: 'Pcs' 
    },
    // Identifies if the inquiry was made by a logged-in user or a guest
    submittedBy: { 
        type: String, 
        default: 'Guest User' 
    },
    // Workflow status to track the progress of the inquiry
    status: { 
        type: String, 
        enum: ['Pending', 'Contacted', 'Closed'], 
        default: 'Pending' 
    }
}, { 
    // Automatically generates createdAt and updatedAt fields
    timestamps: true 
});

/**
 * Exporting the Inquiry model.
 * Used for storing and managing customer support or sales leads.
 */
module.exports = mongoose.model('Inquiry', inquirySchema);