const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");

const { protect } = require("./middleware/authMiddleware");
const { adminOnly } = require("./middleware/roleMiddleware");
const dbMiddleware = require("./middleware/dbMiddleware");

const app = express();

// Initial MongoDB connection
connectDB().catch((error) => {
    console.error(
        "Initial MongoDB connection failed:",
        error.message
    );
});

// Middleware
app.use(cors());
app.use(express.json());

// Make sure MongoDB is connected before API requests
app.use(dbMiddleware);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Canteen Pre-Order API is running"
    });
});

// Protected test route
app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user
    });
});

// Admin test route
app.get("/api/admin-test", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome Admin! You have access to this route."
    });
});

// Server
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;