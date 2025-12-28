const mongoose = require('mongoose');
require('dotenv').config();

// 1. Product Schema (Agar aapka model alag file mein hai to wahan se import bhi kar sakte hain)
const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    category: String,
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    price: Number,
    color: String,
    sizes: [String],
    description: String,
    image: String,
    type: String,
    stock: Number
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const PKR_RATE = 278; // Dollar rate for conversion

const products = [
    // ==========================
    // T-SHIRTS (10 Items)
    // ==========================
    { id: "ts-001", name: "Tommy Hilfiger 1985 Red Polo", category: "t-shirts", rating: 4.5, numReviews: 85, price: 1900 / PKR_RATE, color: "Red", sizes: ["M", "L", "XL"], description: "Classic red polo with signature branding.", image: "/Products-Data/tshirt1.jpg", type: "Polo", stock: 30 },
    { id: "ts-002", name: "Chocolate Brown Cotton Tee", category: "t-shirts", rating: 4.2, numReviews: 40, price: 1250 / PKR_RATE, color: "Brown", sizes: ["S", "M", "L"], description: "Minimalist chocolate brown round neck tee.", image: "/Products-Data/tshirt2.jpg", type: "Simple Tee", stock: 25 },
    { id: "ts-003", name: "Manfinity VCAY White Tee", category: "t-shirts", rating: 4.8, numReviews: 120, price: 1150 / PKR_RATE, color: "White", sizes: ["M", "L", "XL"], description: "Premium breathable white cotton tee.", image: "/Products-Data/tshirt3.jpg", type: "Simple Tee", stock: 50 },
    { id: "ts-004", name: "Crimson Red Round Neck Tee", category: "t-shirts", rating: 4.3, numReviews: 55, price: 1100 / PKR_RATE, color: "Red", sizes: ["S", "M", "L"], description: "Vibrant red daily wear cotton tee.", image: "/Products-Data/tshirt4.jpg", type: "Simple Tee", stock: 45 },
    { id: "ts-005", name: "Midnight Black Round Neck Tee", category: "t-shirts", rating: 4.6, numReviews: 90, price: 1150 / PKR_RATE, color: "Black", sizes: ["M", "L", "XL"], description: "Solid black essential round neck tee.", image: "/Products-Data/tshirt5.jpg", type: "Simple Tee", stock: 60 },
    { id: "ts-006", name: "Polo Ralph Lauren Contrast Black", category: "t-shirts", rating: 4.7, numReviews: 70, price: 1950 / PKR_RATE, color: "Black", sizes: ["L", "XL"], description: "Black polo with sharp contrast logo.", image: "/Products-Data/tshirt6.jpg", type: "Polo", stock: 40 },
    { id: "ts-007", name: "Polo Ralph Lauren Classic Grey", category: "t-shirts", rating: 4.4, numReviews: 65, price: 1850 / PKR_RATE, color: "Grey", sizes: ["M", "L"], description: "Iconic grey polo with signature logo.", image: "/Products-Data/tshirt7.jpg", type: "Polo", stock: 35 },
    { id: "ts-008", name: "Polo Ralph Lauren Earth Brown", category: "t-shirts", rating: 4.5, numReviews: 30, price: 1800 / PKR_RATE, color: "Brown", sizes: ["M", "L", "XL"], description: "Classic cotton polo in earth brown tone.", image: "/Products-Data/tshirt8.jpg", type: "Polo", stock: 20 },
    { id: "ts-009", name: "Ralph Lauren Pique Polo White", category: "t-shirts", rating: 4.7, numReviews: 88, price: 1750 / PKR_RATE, color: "White", sizes: ["S", "M", "L"], description: "Stretch cotton piqué polo, slim fit.", image: "/Products-Data/tshirt9.jpg", type: "Polo", stock: 40 },
    { id: "ts-010", name: "Urban Slate Grey Tee", category: "t-shirts", rating: 4.1, numReviews: 25, price: 1200 / PKR_RATE, color: "Grey", sizes: ["M", "L"], description: "Minimalist slate grey soft-touch tee.", image: "/Products-Data/tshirt10.jpg", type: "Simple Tee", stock: 45 },

    // ==========================
    // OFFICE SHIRTS (8 Items)
    // ==========================
    { id: "os-001", name: "Alimens Gentle Grey Formal", category: "office-shirts", rating: 4.8, numReviews: 110, price: 2650 / PKR_RATE, color: "Grey", sizes: ["M", "L", "XL"], description: "Professional grey button-down shirt.", image: "/Products-Data/officeshirt1.jpg", type: "Formal", stock: 25 },
    { id: "os-002", name: "Beckton Slim French Blue", category: "office-shirts", rating: 4.6, numReviews: 45, price: 2750 / PKR_RATE, color: "Blue", sizes: ["S", "M", "L"], description: "Classic blue office shirt, wrinkle-free.", image: "/Products-Data/officeshirt2.jpg", type: "Formal", stock: 20 },
    { id: "os-003", name: "EOUOSS Navy Stretch Fit", category: "office-shirts", rating: 4.7, numReviews: 55, price: 2700 / PKR_RATE, color: "Navy", sizes: ["M", "L"], description: "Deep navy professional stretch shirt.", image: "/Products-Data/officeshirt3.jpg", type: "Formal", stock: 18 },
    { id: "os-004", name: "HISDERN Soft Pink Executive", category: "office-shirts", rating: 4.4, numReviews: 30, price: 2600 / PKR_RATE, color: "Pink", sizes: ["S", "M", "L"], description: "Professional soft pink executive shirt.", image: "/Products-Data/officeshirt4.jpg", type: "Formal", stock: 12 },
    { id: "os-005", name: "Athletic Slim Brown Button", category: "office-shirts", rating: 4.3, numReviews: 22, price: 2550 / PKR_RATE, color: "Brown", sizes: ["M", "L"], description: "Coffee brown slim fit formal shirt.", image: "/Products-Data/officeshirt5.jpg", type: "Formal", stock: 20 },
    { id: "os-006", name: "Executive Pure White Shirt", category: "office-shirts", rating: 4.8, numReviews: 140, price: 2650 / PKR_RATE, color: "White", sizes: ["M", "L", "XL"], description: "Clean white shirt for a bold corporate look.", image: "/Products-Data/officeshirt6.jpg", type: "Formal", stock: 15 },
    { id: "os-007", name: "Solid Midnight Black Formal", category: "office-shirts", rating: 4.5, numReviews: 60, price: 2850 / PKR_RATE, color: "Black", sizes: ["S", "M", "L"], description: "Deep black premium formal shirt.", image: "/Products-Data/officeshirt7.jpg", type: "Formal", stock: 15 },
    { id: "os-008", name: "ZEROYAA Dark Green Formal", category: "office-shirts", rating: 4.6, numReviews: 38, price: 2950 / PKR_RATE, color: "Green", sizes: ["M", "L", "XL"], description: "Wrinkle-free dark green business shirt.", image: "/Products-Data/officeshirt8.jpg", type: "Formal", stock: 10 },

    // ==========================
    // PANTS & TROUSERS (10 Items)
    // ==========================
    { id: "pn-001", name: "3x1 M3 Slim Straight Indigo", category: "pants-trousers", rating: 4.8, numReviews: 95, price: 3400 / PKR_RATE, color: "Blue", sizes: ["32", "34"], description: "Heavy duty slim straight indigo jeans.", image: "/Products-Data/pant1.jpg", type: "Jeans", stock: 20 },
    { id: "pn-002", name: "Brooklyn Stretch Slim Oak", category: "pants-trousers", rating: 4.5, numReviews: 50, price: 2800 / PKR_RATE, color: "Brown", sizes: ["30", "32", "34"], description: "Timeless oak brown stretchable jeans.", image: "/Products-Data/pant2.jpg", type: "Jeans", stock: 35 },
    { id: "pn-003", name: "Urban Tactical Black Cargo", category: "pants-trousers", rating: 4.6, numReviews: 42, price: 3200 / PKR_RATE, color: "Black", sizes: ["32", "34", "36"], description: "Rugged black cargo with utility pockets.", image: "/Products-Data/pant3.jpg", type: "Cargo", stock: 25 },
    { id: "pn-004", name: "Charcoal Grey Slim Chinos", category: "pants-trousers", rating: 4.4, numReviews: 33, price: 2700 / PKR_RATE, color: "Charcoal", sizes: ["30", "32"], description: "Essential charcoal chinos for office casual.", image: "/Products-Data/pant4.jpg", type: "Chino", stock: 15 },
    { id: "pn-005", name: "Joe's Atlas Utility Cargo", category: "pants-trousers", rating: 4.7, numReviews: 58, price: 3500 / PKR_RATE, color: "Grey", sizes: ["32", "34"], description: "Modern grey cargo with technical finish.", image: "/Products-Data/pant5.jpg", type: "Cargo", stock: 15 },
    { id: "pn-006", name: "Manfinity Homme Coffee Cargo", category: "pants-trousers", rating: 4.3, numReviews: 18, price: 3600 / PKR_RATE, color: "Brown", sizes: ["32", "34", "36"], description: "Coffee brown drawstring utility cargo.", image: "/Products-Data/pant6.jpg", type: "Cargo", stock: 10 },
    { id: "pn-007", name: "Polo Ralph Lauren White Jeans", category: "pants-trousers", rating: 4.6, numReviews: 75, price: 3100 / PKR_RATE, color: "White", sizes: ["30", "32"], description: "Clean white branded slim fit jeans.", image: "/Products-Data/pant7.jpg", type: "Jeans", stock: 12 },
    { id: "pn-008", name: "Relaxed Fit Black Denim", category: "pants-trousers", rating: 4.5, numReviews: 66, price: 2950 / PKR_RATE, color: "Black", sizes: ["30", "32", "34"], description: "Jet black relaxed denim for daily wear.", image: "/Products-Data/pant8.jpg", type: "Jeans", stock: 25 },
    { id: "pn-009", name: "Sols Mens Docker Cargo Navy", category: "pants-trousers", rating: 4.7, numReviews: 40, price: 3100 / PKR_RATE, color: "Navy", sizes: ["32", "34", "36"], description: "Professional navy blue stretch cargo.", image: "/Products-Data/pant9.jpg", type: "Cargo", stock: 25 },
    { id: "pn-010", name: "Tout A Coup White Cargo", category: "pants-trousers", rating: 4.2, numReviews: 15, price: 3300 / PKR_RATE, color: "White", sizes: ["30", "32"], description: "Streetwear style white cargo trousers.", image: "/Products-Data/pant10.jpg", type: "Cargo", stock: 15 },

    // ==========================
    // HOODIES (6 Items)
    // ==========================
    { id: "hd-001", name: "Brown Fleece Zip-up Hoodie", category: "jackets-hoodies", rating: 4.7, numReviews: 80, price: 3200 / PKR_RATE, color: "Brown", sizes: ["M", "L"], description: "Casual brown fleece zip hoodie.", image: "/Products-Data/hoodie1.jpg", type: "Hoodie", stock: 15 },
    { id: "hd-002", name: "Slogan Graphic Blue Hoodie", category: "jackets-hoodies", rating: 4.4, numReviews: 35, price: 2800 / PKR_RATE, color: "Blue", sizes: ["S", "M", "L"], description: "Streetwear graphic kangaroo pocket hoodie.", image: "/Products-Data/hoodie2.jpg", type: "Hoodie", stock: 20 },
    { id: "hd-003", name: "Classic Red Winter Pullover", category: "jackets-hoodies", rating: 4.6, numReviews: 48, price: 2950 / PKR_RATE, color: "Red", sizes: ["M", "L", "XL"], description: "Thick red hoodie for winter warmth.", image: "/Products-Data/hoodie3.jpg", type: "Hoodie", stock: 18 },
    { id: "hd-004", name: "Regular Fit White Hoodie", category: "jackets-hoodies", rating: 4.5, numReviews: 22, price: 3000 / PKR_RATE, color: "White", sizes: ["M", "L"], description: "Minimalist pure white cotton hoodie.", image: "/Products-Data/hoodie4.jpg", type: "Hoodie", stock: 12 },
    { id: "hd-005", name: "Midnight Black Pullover", category: "jackets-hoodies", rating: 4.8, numReviews: 105, price: 3400 / PKR_RATE, color: "Black", sizes: ["M", "L", "XL"], description: "Classic black oversized comfort hoodie.", image: "/Products-Data/hoodie5.jpg", type: "Hoodie", stock: 15 },
    { id: "hd-006", name: "Zip-up Drop Shoulder Grey", category: "jackets-hoodies", rating: 4.3, numReviews: 40, price: 2800 / PKR_RATE, color: "Grey", sizes: ["S", "M", "L"], description: "Stylish grey zip-up with drop shoulders.", image: "/Products-Data/hoodie6.jpg", type: "Hoodie", stock: 20 },

    // ==========================
    // JACKETS (5 Items)
    // ==========================
    { id: "jk-001", name: "Genuine Leather Biker Jacket", category: "jackets-hoodies", rating: 4.9, numReviews: 215, price: 3990 / PKR_RATE, color: "Black", sizes: ["L", "XL"], description: "Premium slim fit genuine leather jacket.", image: "/Products-Data/jacket1.jpg", type: "Jacket", stock: 8 },
    { id: "jk-002", name: "Homens Jaqueta Blue Denim", category: "jackets-hoodies", rating: 4.6, numReviews: 92, price: 3500 / PKR_RATE, color: "Blue", sizes: ["S", "M", "L"], description: "Classic light wash denim trucker jacket.", image: "/Products-Data/jacket2.jpg", type: "Jacket", stock: 12 },
    { id: "jk-003", name: "Loose Fit Long Sleeve Brown", category: "jackets-hoodies", rating: 4.5, numReviews: 40, price: 3200 / PKR_RATE, color: "Brown", sizes: ["M", "L", "XL"], description: "Comfortable cotton solid color jacket.", image: "/Products-Data/jacket3.jpg", type: "Jacket", stock: 15 },
    { id: "jk-004", name: "Solid Button-up White Denim", category: "jackets-hoodies", rating: 4.4, numReviews: 28, price: 3300 / PKR_RATE, color: "White", sizes: ["M", "L"], description: "Clean white button-up denim style jacket.", image: "/Products-Data/jacket4.jpg", type: "Jacket", stock: 10 },
    { id: "jk-005", name: "Washed Loose Grey Jacket", category: "jackets-hoodies", rating: 4.7, numReviews: 55, price: 3700 / PKR_RATE, color: "Grey", sizes: ["M", "L", "XL"], description: "Rugged washed casual short cropped jacket.", image: "/Products-Data/jacket5.jpg", type: "Jacket", stock: 9 }
];

const importData = async () => {
    try {
        // Database Connection
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connection Established...');

        // Clear existing products
        await Product.deleteMany();
        console.log('🗑️ Old Data Cleared.');

        // Insert new analyzed products
        await Product.insertMany(products);
        console.log(`🚀 Success: All ${products.length} analyzed products imported!`);

        process.exit();
    } catch (error) {
        console.error('❌ Error during data import:', error.message);
        process.exit(1);
    }
};

importData();