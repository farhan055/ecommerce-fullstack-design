import mongoose from 'mongoose';

const connectDB = async () => {
    // Agar pehle se connected hai toh dobara connect na karein
    if (mongoose.connections[0].readyState) {
        return;
    }

    try {
        mongoose.set('strictQuery', true);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Ye options connection stable banate hain
            serverSelectionTimeoutMS: 5000, 
            socketTimeoutMS: 45000,
        });
        
        console.log(`🚀 DATABASE SYNCHRONIZED: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ CONNECTION FAILED: ${error.message}`);
        // Vercel par process.exit(1) mat karein, warna pura function kill ho jayega
        throw error; 
    }
};

export default connectDB;