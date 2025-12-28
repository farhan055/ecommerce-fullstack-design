const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 

/**
 * @desc    Fetch all products with optional filtering and search functionality
 * @route   GET /api/products
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        // Filter by category if specified and not set to 'All'
        if (category && category !== 'All') {
            query.category = category;
        }

        // Implement Search logic using MongoDB Regular Expressions (case-insensitive)
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

/**
 * @desc    Fetch a single product by either Custom ID or MongoDB ObjectId
 * @route   GET /api/products/:id
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        // First attempt to find by custom unique string ID
        let product = await Product.findOne({ id: req.params.id });
        
        // Fallback: If not found, check if the ID matches MongoDB ObjectId format and search by _id
        if (!product && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(req.params.id);
        }
        
        if (!product) {
            return res.status(404).json({ message: "PRODUCT NOT FOUND" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "SERVER ERROR", error: error.message });
    }
});

/**
 * @desc    Create a new product (Admin Panel functionality)
 * @route   POST /api/products
 * @access  Private/Admin
 */
router.post('/', async (req, res) => {
    try {
        const { name, price, image, category, stock, description } = req.body;
        
        const newProduct = new Product({
            id: "PRD-" + Date.now(), // Generates a unique traceable product code
            name,
            price,
            image, // Stores the image URL provided by the admin
            category,
            stock: stock || 0,
            description: description || "Quality product from MensWear collection.",
            sizes: ["S", "M", "L", "XL"] // Default available variants
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: "COULD NOT ADD PRODUCT", error: error.message });
    }
});

/**
 * @desc    Update product details
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // Returns the modified document rather than the original
        );
        if (!updatedProduct) return res.status(404).json({ message: "NOT FOUND" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "UPDATE FAILED", error: error.message });
    }
});

/**
 * @desc    Delete a product from the database
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "NOT FOUND" });
        res.status(200).json({ message: "PRODUCT REMOVED" });
    } catch (error) {
        res.status(500).json({ message: "DELETE FAILED", error: error.message });
    }
});

module.exports = router;