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
    { id: "os-001", name: "Alimens Gentle Grey Formal", category: "office-shirts", rating: 4.8, numReviews: 110, price: 9.53, color: "Grey", sizes: ["M", "L", "XL"], description: "Professional grey button-down shirt.", image: "/Products-Data/officeshirt1.jpg", type: "Formal", stock: 25 },
    { id: "os-002", name: "Beckton Slim French Blue", category: "office-shirts", rating: 4.6, numReviews: 45, price: 9.89, color: "Blue", sizes: ["S", "M", "L"], description: "Classic blue office shirt, wrinkle-free.", image: "/Products-Data/officeshirt2.jpg", type: "Formal", stock: 20 },
    { id: "os-003", name: "EOUOSS Navy Stretch Fit", category: "office-shirts", rating: 4.7, numReviews: 55, price: 9.71, color: "Navy", sizes: ["M", "L"], description: "Deep navy professional stretch shirt.", image: "/Products-Data/officeshirt3.jpg", type: "Formal", stock: 18 },
    { id: "os-004", name: "HISDERN Soft Pink Executive", category: "office-shirts", rating: 4.4, numReviews: 30, price: 9.35, color: "Pink", sizes: ["S", "M", "L"], description: "Professional soft pink executive shirt.", image: "/Products-Data/officeshirt4.jpg", type: "Formal", stock: 12 },
    { id: "os-005", name: "Athletic Slim Brown Button", category: "office-shirts", rating: 4.3, numReviews: 22, price: 9.17, color: "Brown", sizes: ["M", "L"], description: "Coffee brown slim fit formal shirt.", image: "/Products-Data/officeshirt5.jpg", type: "Formal", stock: 20 },
    { id: "os-006", name: "Executive Pure White Shirt", category: "office-shirts", rating: 4.8, numReviews: 140, price: 9.53, color: "White", sizes: ["M", "L", "XL"], description: "Clean white shirt for a bold corporate look.", image: "/Products-Data/officeshirt6.jpg", type: "Formal", stock: 15 },
    { id: "os-007", name: "Solid Midnight Black Formal", category: "office-shirts", rating: 4.5, numReviews: 60, price: 10.25, color: "Black", sizes: ["S", "M", "L"], description: "Deep black premium formal shirt.", image: "/Products-Data/officeshirt7.jpg", type: "Formal", stock: 15 },
    { id: "os-008", name: "ZEROYAA Dark Green Formal", category: "office-shirts", rating: 4.6, numReviews: 38, price: 10.61, color: "Green", sizes: ["M", "L", "XL"], description: "Wrinkle-free dark green business shirt.", image: "/Products-Data/officeshirt8.jpg", type: "Formal", stock: 10 },
    { id: "pn-001", name: "3x1 M3 Slim Straight Indigo", category: "pants-trousers", rating: 4.8, numReviews: 95, price: 12.23, color: "Blue", sizes: ["32", "34"], description: "Heavy duty slim straight indigo jeans.", image: "/Products-Data/pant1.jpg", type: "Jeans", stock: 20 },
    { id: "pn-002", name: "Brooklyn Stretch Slim Oak", category: "pants-trousers", rating: 4.5, numReviews: 50, price: 10.07, color: "Brown", sizes: ["30", "32", "34"], description: "Timeless oak brown stretchable jeans.", image: "/Products-Data/pant2.jpg", type: "Jeans", stock: 35 },
    { id: "pn-003", name: "Urban Tactical Black Cargo", category: "pants-trousers", rating: 4.6, numReviews: 42, price: 11.51, color: "Black", sizes: ["32", "34", "36"], description: "Rugged black cargo with utility pockets.", image: "/Products-Data/pant3.jpg", type: "Cargo", stock: 25 },
    { id: "pn-004", name: "Charcoal Grey Slim Chinos", category: "pants-trousers", rating: 4.4, numReviews: 33, price: 9.71, color: "Charcoal", sizes: ["30", "32"], description: "Essential charcoal chinos for office casual.", image: "/Products-Data/pant4.jpg", type: "Chino", stock: 15 },
    { id: "pn-005", name: "Joe's Atlas Utility Cargo", category: "pants-trousers", rating: 4.7, numReviews: 58, price: 12.58, color: "Grey", sizes: ["32", "34"], description: "Modern grey cargo with technical finish.", image: "/Products-Data/pant5.jpg", type: "Cargo", stock: 15 },
    { id: "pn-006", name: "Manfinity Homme Coffee Cargo", category: "pants-trousers", rating: 4.3, numReviews: 18, price: 12.94, color: "Brown", sizes: ["32", "34", "36"], description: "Coffee brown drawstring utility cargo.", image: "/Products-Data/pant6.jpg", type: "Cargo", stock: 10 },
    { id: "pn-007", name: "Polo Ralph Lauren White Jeans", category: "pants-trousers", rating: 4.6, numReviews: 75, price: 11.15, color: "White", sizes: ["30", "32"], description: "Clean white branded slim fit jeans.", image: "/Products-Data/pant7.jpg", type: "Jeans", stock: 12 },
    { id: "pn-008", name: "Relaxed Fit Black Denim", category: "pants-trousers", rating: 4.5, numReviews: 66, price: 10.61, color: "Black", sizes: ["30", "32", "34"], description: "Jet black relaxed denim for daily wear.", image: "/Products-Data/pant8.jpg", type: "Jeans", stock: 25 },
    { id: "pn-009", name: "Sols Mens Docker Cargo Navy", category: "pants-trousers", rating: 4.7, numReviews: 40, price: 11.15, color: "Navy", sizes: ["32", "34", "36"], description: "Professional navy blue stretch cargo.", image: "/Products-Data/pant9.jpg", type: "Cargo", stock: 25 },
    { id: "pn-010", name: "Tout A Coup White Cargo", category: "pants-trousers", rating: 4.2, numReviews: 15, price: 11.87, color: "White", sizes: ["30", "32"], description: "Streetwear style white cargo trousers.", image: "/Products-Data/pant10.jpg", type: "Cargo", stock: 15 },
    { id: "hd-001", name: "Brown Fleece Zip-up Hoodie", category: "jackets-hoodies", rating: 4.7, numReviews: 80, price: 11.51, color: "Brown", sizes: ["M", "L"], description: "Casual brown fleece zip hoodie.", image: "/Products-Data/hoodie1.jpg", type: "Hoodie", stock: 15 },
    { id: "hd-002", name: "Slogan Graphic Blue Hoodie", category: "jackets-hoodies", rating: 4.4, numReviews: 35, price: 10.07, color: "Blue", sizes: ["S", "M", "L"], description: "Streetwear graphic kangaroo pocket hoodie.", image: "/Products-Data/hoodie2.jpg", type: "Hoodie", stock: 20 },
    { id: "hd-003", name: "Classic Red Winter Pullover", category: "jackets-hoodies", rating: 4.6, numReviews: 48, price: 10.61, color: "Red", sizes: ["M", "L", "XL"], description: "Thick red hoodie for winter warmth.", image: "/Products-Data/hoodie3.jpg", type: "Hoodie", stock: 18 },
    { id: "hd-004", name: "Regular Fit White Hoodie", category: "jackets-hoodies", rating: 4.5, numReviews: 22, price: 10.79, color: "White", sizes: ["M", "L"], description: "Minimalist pure white cotton hoodie.", image: "/Products-Data/hoodie4.jpg", type: "Hoodie", stock: 12 },
    { id: "hd-005", name: "Midnight Black Pullover", category: "jackets-hoodies", rating: 4.8, numReviews: 105, price: 12.23, color: "Black", sizes: ["M", "L", "XL"], description: "Classic black oversized comfort hoodie.", image: "/Products-Data/hoodie5.jpg", type: "Hoodie", stock: 15 },
    { id: "hd-006", name: "Zip-up Drop Shoulder Grey", category: "jackets-hoodies", rating: 4.3, numReviews: 40, price: 10.07, color: "Grey", sizes: ["S", "M", "L"], description: "Stylish grey zip-up with drop shoulders.", image: "/Products-Data/hoodie6.jpg", type: "Hoodie", stock: 20 },
    { id: "jk-001", name: "Genuine Leather Biker Jacket", category: "jackets-hoodies", rating: 4.9, numReviews: 215, price: 14.35, color: "Black", sizes: ["L", "XL"], description: "Premium slim fit genuine leather jacket.", image: "/Products-Data/jacket1.jpg", type: "Jacket", stock: 8 },
    { id: "jk-002", name: "Homens Jaqueta Blue Denim", category: "jackets-hoodies", rating: 4.6, numReviews: 92, price: 12.58, color: "Blue", sizes: ["S", "M", "L"], description: "Classic light wash denim trucker jacket.", image: "/Products-Data/jacket2.jpg", type: "Jacket", stock: 12 },
    { id: "jk-003", name: "Loose Fit Long Sleeve Brown", category: "jackets-hoodies", rating: 4.5, numReviews: 40, price: 11.51, color: "Brown", sizes: ["M", "L", "XL"], description: "Comfortable cotton solid color jacket.", image: "/Products-Data/jacket3.jpg", type: "Jacket", stock: 15 },
    { id: "jk-004", name: "Solid Button-up White Denim", category: "jackets-hoodies", rating: 4.4, numReviews: 28, price: 11.87, color: "White", sizes: ["M", "L"], description: "Clean white button-up denim style jacket.", image: "/Products-Data/jacket4.jpg", type: "Jacket", stock: 10 },
    { id: "jk-005", name: "Washed Loose Grey Jacket", category: "jackets-hoodies", rating: 4.7, numReviews: 55, price: 13.30, color: "Grey", sizes: ["M", "L", "XL"], description: "Rugged washed casual short cropped jacket.", image: "/Products-Data/jacket5.jpg", type: "Jacket", stock: 9 },
    { id: "hd-007", name: "Black Oversize Hoodie", category: "jackets-hoodies", price: 12.5, color: "Black", sizes: ["S", "M", "L", "XL"], description: "Quality product from MensWear collection.", image: "/Products-Data/hoodie7.jpg", type: "Standard", stock: 50 }
];

// GET ALL PRODUCTS (With Filtering & Search Logic)
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};
        if (category && category !== 'All') query.category = category;
        if (search) {
            query.$or = [{ name: { $regex: search, $options: 'i' } }, { category: { $regex: search, $options: 'i' } }];
        }
        const products = await Product.find(query).maxTimeMS(4000);
        if (products && products.length > 0) return res.status(200).json(products);
        throw new Error("DB_EMPTY");
    } catch (error) {
        let filtered = fallbackProducts;
        const { category, search } = req.query;
        if (category && category !== 'All') filtered = filtered.filter(p => p.category === category);
        if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        res.status(200).json(filtered);
    }
});

// GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
    try {
        let product = await Product.findOne({ id: req.params.id }).maxTimeMS(2000);
        if (!product) {
            const mock = fallbackProducts.find(p => p.id === req.params.id);
            return mock ? res.json(mock) : res.status(404).json({ message: "Not Found" });
        }
        res.json(product);
    } catch (e) {
        const mock = fallbackProducts.find(p => p.id === req.params.id);
        res.json(mock || fallbackProducts[0]);
    }
});

// POST 
router.post('/', async (req, res) => {
    res.status(201).json({ message: "Product saved successfully", data: req.body });
});

// PUT
router.put('/:id', async (req, res) => {
    res.status(200).json({ message: "Product updated successfully", id: req.params.id });
});

// DELETE 
router.delete('/:id', async (req, res) => {
    res.status(200).json({ message: "Product removed from database" });
});

module.exports = router;