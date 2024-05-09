const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO, {
            useNewUrlParser: true,       // Deprecated but still required for MongoDB Atlas clusters
            useUnifiedTopology: true,   // Deprecated but still required for MongoDB Atlas clusters
            connectTimeoutMS: 30000,    // Timeout after 30 seconds of inactivity during initial connection
            socketTimeoutMS: 45000,     // Timeout after 45 seconds of inactivity for active connections
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit the process if there is an error
    }
};


module.exports = { connectDb };