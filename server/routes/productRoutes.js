const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// FULL MOCK DATA (Hardcoded 39+ Products Logic)
const fallbackProducts = [
    { id: "ts-001", name: "Tommy Hilfiger 1985 Red Polo", category: "t-shirts", price: 6.83, color: "Red", sizes: ["M", "L", "XL"], image: "/Products-Data/tshirt1.jpg", stock: 30 },
    { id: "ts-002", name: "Chocolate Brown Cotton Tee", category: "t-shirts", price: 4.49, color: "Brown", sizes: ["S", "M", "L"], image: "/Products-Data/tshirt2.jpg", stock: 25 },
    { id: "ts-003", name: "Manfinity VCAY White Tee", category: "t-shirts", price: 4.13, color: "White", sizes: ["M", "L", "XL"], image: "/Products-Data/tshirt3.jpg", stock: 50 },
    { id: "ts-004", name: "Crimson Red Round Neck Tee", category: "t-shirts", price: 3.95, color: "Red", sizes: ["S", "M", "L"], image: "/Products-Data/tshirt4.jpg", stock: 45 },
    { id: "ts-005", name: "Midnight Black Round Neck Tee", category: "t-shirts", price: 4.13, color: "Black", sizes: ["M", "L", "XL"], image: "/Products-Data/tshirt5.jpg", stock: 60 },
    { id: "ts-006", name: "Polo Ralph Lauren Contrast Black", category: "t-shirts", price: 7.01, color: "Black", sizes: ["L", "XL"], image: "/Products-Data/tshirt6.jpg", stock: 40 },
    { id: "ts-007", name: "Polo Ralph Lauren Classic Grey", category: "t-shirts", price: 6.65, color: "Grey", sizes: ["M", "L"], image: "/Products-Data/tshirt7.jpg", stock: 35 },
    { id: "ts-008", name: "Polo Ralph Lauren Earth Brown", category: "t-shirts", price: 6.47, color: "Brown", sizes: ["M", "L", "XL"], image: "/Products-Data/tshirt8.jpg", stock: 20 },
    { id: "ts-009", name: "Ralph Lauren Pique Polo White", category: "t-shirts", price: 6.29, color: "White", sizes: ["S", "M", "L"], image: "/Products-Data/tshirt9.jpg", stock: 40 },
    { id: "ts-010", name: "Urban Slate Grey Tee", category: "t-shirts", price: 4.31, color: "Grey", sizes: ["M", "L"], image: "/Products-Data/tshirt10.jpg", stock: 45 },
    { id: "os-001", name: "Alimens Gentle Grey Formal", category: "office-shirts", price: 9.53, color: "Grey", stock: 25, image: "/Products-Data/officeshirt1.jpg" },
    { id: "pn-001", name: "3x1 M3 Slim Straight Indigo", category: "pants-trousers", price: 12.23, color: "Blue", stock: 20, image: "/Products-Data/pant1.jpg" },
    { id: "jk-001", name: "Genuine Leather Biker Jacket", category: "jackets-hoodies", price: 14.35, color: "Black", stock: 8, image: "/Products-Data/jacket1.jpg" }
    // Note: Add all other 39 products here in the same format
];

// --- GET ALL PRODUCTS ---
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category && category !== 'All') query.category = category;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } }, 
                { id: { $regex: search, $options: 'i' } }
            ];
        }
        const products = await Product.find(query);
        // If DB is empty, send fallback
        if (products.length === 0 && !category && !search) {
            return res.status(200).json(fallbackProducts);
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// --- GET SINGLE PRODUCT (Hybrid Fix for 404) ---
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // 1. Check Custom ID (ts-001)
        let product = await Product.findOne({ id: id });
        
        // 2. Check MongoDB ID
        if (!product && id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(id);
        }

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// --- CREATE PRODUCT ---
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error creating product", error: error.message });
    }
});

// --- UPDATE PRODUCT (Hybrid) ---
router.put('/:id', async (req, res) => {
    const requestedId = req.params.id;
    try {
        let updatedProduct = await Product.findOneAndUpdate({ id: requestedId }, req.body, { new: true });

        if (!updatedProduct && requestedId.match(/^[0-9a-fA-F]{24}$/)) {
            updatedProduct = await Product.findByIdAndUpdate(requestedId, req.body, { new: true });
        }

        if (!updatedProduct) return res.status(404).json({ message: "Not Found" });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
});

// --- DELETE PRODUCT ---
router.delete('/:id', async (req, res) => {
    const requestedId = req.params.id;
    try {
        let deletedProduct = await Product.findOneAndDelete({ id: requestedId });
        if (!deletedProduct && requestedId.match(/^[0-9a-fA-F]{24}$/)) {
            deletedProduct = await Product.findByIdAndDelete(requestedId);
        }
        if (!deletedProduct) return res.status(404).json({ message: "Not Found" });
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;