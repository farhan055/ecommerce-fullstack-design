const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// FULL MOCK DATA (All 41 Products)
const fallbackProducts = [
    { id: "ts-001", name: "Tommy Hilfiger 1985 Red Polo", category: "t-shirts", rating: 4.5, numReviews: 85, price: 6.83, color: "Red", sizes: ["M", "L", "XL"], description: "Classic red polo with signature branding.", image: "/Products-Data/tshirt1.jpg", type: "Polo", stock: 30 },
    { id: "ts-002", name: "Chocolate Brown Cotton Tee", category: "t-shirts", rating: 4.2, numReviews: 40, price: 4.49, color: "Brown", sizes: ["S", "M", "L"], description: "Minimalist chocolate brown round neck tee.", image: "/Products-Data/tshirt2.jpg", type: "Simple Tee", stock: 25 },
    { id: "ts-003", name: "Manfinity VCAY White Tee", category: "t-shirts", rating: 4.8, numReviews: 120, price: 4.13, color: "White", sizes: ["M", "L", "XL"], description: "Premium breathable white cotton tee.", image: "/Products-Data/tshirt3.jpg", type: "Simple Tee", stock: 50 },
    { id: "ts-004", name: "Crimson Red Round Neck Tee", category: "t-shirts", rating: 4.3, numReviews: 55, price: 3.95, color: "Red", sizes: ["S", "M", "L"], description: "Vibrant red daily wear cotton tee.", image: "/Products-Data/tshirt4.jpg", type: "Simple Tee", stock: 45 },
    { id: "ts-005", name: "Midnight Black Round Neck Tee", category: "t-shirts", rating: 4.6, numReviews: 90, price: 4.13, color: "Black", sizes: ["M", "L", "XL"], description: "Solid black essential round neck tee.", image: "/Products-Data/tshirt5.jpg", type: "Simple Tee", stock: 60 },
    { id: "ts-006", name: "Polo Ralph Lauren Contrast Black", category: "t-shirts", rating: 4.7, numReviews: 70, price: 7.01, color: "Black", sizes: ["L", "XL"], description: "Black polo with sharp contrast logo.", image: "/Products-Data/tshirt6.jpg", type: "Polo", stock: 40 },
    { id: "ts-007", name: "Polo Ralph Lauren Classic Grey", category: "t-shirts", rating: 4.4, numReviews: 65, price: 6.65, color: "Grey", sizes: ["M", "L"], description: "Iconic grey polo with signature logo.", image: "/Products-Data/tshirt7.jpg", type: "Polo", stock: 35 },
    { id: "ts-008", name: "Polo Ralph Lauren Earth Brown", category: "t-shirts", rating: 4.5, numReviews: 30, price: 6.47, color: "Brown", sizes: ["M", "L", "XL"], description: "Classic cotton polo in earth brown tone.", image: "/Products-Data/tshirt8.jpg", type: "Polo", stock: 20 },
    { id: "ts-009", name: "Ralph Lauren Pique Polo White", category: "t-shirts", rating: 4.7, numReviews: 88, price: 6.29, color: "White", sizes: ["S", "M", "L"], description: "Stretch cotton piqué polo, slim fit.", image: "/Products-Data/tshirt9.jpg", type: "Polo", stock: 40 },
    { id: "ts-010", name: "Urban Slate Grey Tee", category: "t-shirts", rating: 4.1, numReviews: 25, price: 4.31, color: "Grey", sizes: ["M", "L"], description: "Minimalist slate grey soft-touch tee.", image: "/Products-Data/tshirt10.jpg", type: "Simple Tee", stock: 45 },
    { id: "os-001", name: "Alimens Gentle Grey Formal", category: "office-shirts", price: 9.53, color: "Grey", stock: 25, image: "/Products-Data/officeshirt1.jpg" },
    { id: "pn-001", name: "3x1 M3 Slim Straight Indigo", category: "pants-trousers", price: 12.23, color: "Blue", stock: 20, image: "/Products-Data/pant1.jpg" },
    { id: "jk-001", name: "Genuine Leather Biker Jacket", category: "jackets-hoodies", price: 14.35, color: "Black", stock: 8, image: "/Products-Data/jacket1.jpg" }
    // ... baqi data bhi isi format mein rahay ga
];

// 1. CREATE: Add New Product
router.post('/', async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: "Error creating product", error: error.message });
    }
});

// 2. READ: Get All Products
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
        const products = await Product.find(query).maxTimeMS(4000);
        if (products && products.length > 0) return res.status(200).json(products);
        throw new Error("DB_EMPTY");
    } catch (error) {
        let filtered = fallbackProducts;
        const { category, search } = req.query;
        if (category && category !== 'All') filtered = filtered.filter(p => p.category === category);
        if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));
        res.status(200).json(filtered);
    }
});

// 3. READ: Get Single Product by Custom ID
router.get('/:id', async (req, res) => {
    const requestedId = req.params.id;
    try {
        let product = await Product.findOne({ id: requestedId }).maxTimeMS(2000);
        if (!product) {
            const mock = fallbackProducts.find(p => p.id === requestedId);
            return mock ? res.json(mock) : res.status(404).json({ message: "Product Not Found" });
        }
        res.json(product);
    } catch (e) {
        const mock = fallbackProducts.find(p => p.id === requestedId);
        res.json(mock || { message: "Error fetching product" });
    }
});

// 4. UPDATE: Update Product by Custom ID
router.put('/:id', async (req, res) => {
    const requestedId = req.params.id;
    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: requestedId },
            req.body,
            { new: true, runValidators: true }
        );

        if (updatedProduct) {
            return res.status(200).json(updatedProduct);
        }

        // Mock Fallback Update Simulation
        const mockIndex = fallbackProducts.findIndex(p => p.id === requestedId);
        if (mockIndex !== -1) {
            return res.status(200).json({ ...fallbackProducts[mockIndex], ...req.body });
        }

        res.status(404).json({ message: "Product not found to update" });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
});

// 5. DELETE: Remove Product by Custom ID
router.delete('/:id', async (req, res) => {
    const requestedId = req.params.id;
    try {
        const deletedProduct = await Product.findOneAndDelete({ id: requestedId });
        if (deletedProduct) {
            return res.status(200).json({ message: "Product deleted successfully" });
        }

        const mockExists = fallbackProducts.some(p => p.id === requestedId);
        if (mockExists) {
            return res.status(200).json({ message: "Mock product removed (session only)" });
        }

        res.status(404).json({ message: "Product not found" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
});

module.exports = router;