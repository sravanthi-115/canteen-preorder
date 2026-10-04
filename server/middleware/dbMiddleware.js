const connectDB = require("../config/db");

const dbMiddleware = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error.message);

        return res.status(503).json({
            message: "Database temporarily unavailable"
        });
    }
};

module.exports = dbMiddleware;