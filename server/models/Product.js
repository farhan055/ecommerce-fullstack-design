const mongoose = require('mongoose');

/**
 * Product Schema
 * Defines the structure for products in the MongoDB collection.
 * Includes basic info, variant details (colors/sizes), and inventory management.
 */
const productSchema = new mongoose.Schema({
    // Custom ID field (optional, marked sparse to allow unique nulls if not provided)
    id: { 
        type: String, 
        unique: true,
        sparse: true 
    },
    name: { 
        type: String, 
        required: [true, 'Product name is required'] 
    },
    category: { 
        type: String, 
        required: [true, 'Product category is required'] 
    },
    price: { 
        type: Number, 
        required: [true, 'Product price is required'] 
    },
    color: { 
        type: String,
        default: ""
    },
    sizes: { 
        type: [String],
        default: []
    },
    description: { 
        type: String,
        default: "Premium quality product designed for durability and comfort."
    },
    image: { 
        type: String, 
        required: [true, 'Product image path is required'] 
    },
    // Type field to distinguish between different product collections (e.g., Featured, Standard)
    type: { 
        type: String,
        default: "Standard"
    },
    stock: { 
        type: Number, 
        required: [true, 'Stock count is required'],
        default: 0 
    }
}, { 
    // Automatically creates 'createdAt' and 'updatedAt' fields
    timestamps: true 
});

// Generate and export the Product model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;