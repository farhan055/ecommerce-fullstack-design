// server/config/db.js
import mongoose from 'mongoose';

/**
 * Database Connection Handler
 * Connects the application to MongoDB (via Compass locally or Atlas in cloud).
 */
const connectDB = async () => {
    try {
        // MONGO_URI will contain your Compass string (mongodb://localhost:27017/...)
        const conn = await mongoose.connect(process.env.MONGO_URI);
        
        // Success message for terminal logs
        console.log(`🚀 DATABASE SYNCHRONIZED: ${conn.connection.host}`);
    } catch (error) {
        // Detailed error logging for troubleshooting
        console.error(`❌ CONNECTION FAILED: ${error.message}`);
        
        // Critical error: Shutdown server if database is unreachable
        process.exit(1); 
    }
};

export default connectDB;