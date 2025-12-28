import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Establish connection to MongoDB (Compass/Atlas)
connectDB();

const app = express();

/**
 * ES Modules Fix for __dirname
 * Since __dirname is not available in ES modules, we derive it from the current file URL.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- MIDDLEWARES ---

// Enable Cross-Origin Resource Sharing (Allows Frontend to talk to Backend)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

/**
 * Static File Serving
 * Exposes the 'Products-Data' folder publicly so product images can be accessed via URL.
 * Example: http://localhost:5000/Products-Data/tshirt1.jpg
 */
app.use('/Products-Data', express.static(path.join(__dirname, 'Products-Data')));

// --- API ROUTES ---

/**
 * Product Routes Mounting
 * All requests to /api/products will be handled by productRoutes.js
 * Access: http://localhost:5000/api/products
 */
app.use('/api/products', productRoutes);

// Health Check Route to verify server status
app.get('/', (req, res) => {
    res.send("🚀 MENSWEAR API is running...");
});

// Define Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server active on http://localhost:${PORT}`);
    console.log(`✅ Product API: http://localhost:${PORT}/api/products`);
});