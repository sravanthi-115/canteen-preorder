const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

const connectDB = async () => {
    // Reuse existing connection
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    // Reuse connection attempt already in progress
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 10000,
                maxPoolSize: 10,
                family: 4
            })
            .then((mongooseInstance) => {
                console.log("MongoDB connected successfully");
                return mongooseInstance;
            })
            .catch((error) => {
                cached.promise = null;

                console.error(
                    "MongoDB connection failed:",
                    error.message
                );

                throw error;
            });
    }

    cached.conn = await cached.promise;

    return cached.conn;
};

module.exports = connectDB;