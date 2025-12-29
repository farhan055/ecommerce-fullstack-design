const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }

    try {
        mongoose.set('strictQuery', true);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        });
        
        console.log(`🚀 DATABASE SYNCHRONIZED: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ CONNECTION FAILED: ${error.message}`);
        // Throw error taake controller ko pata chale connection fail hua
        throw error; 
    }
};

// Vercel/Node ke liye export ka sahi tareeqa
module.exports = connectDB;