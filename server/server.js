const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const { protect } = require("./middleware/authMiddleware");
const { adminOnly } = require("./middleware/roleMiddleware");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Canteen Pre-Order API is running"
    });
});

app.get("/api/protected", protect, (req, res) => {
    res.json({
        message: "You accessed a protected route!",
        user: req.user
    });
});
app.get("/api/admin-test", protect, adminOnly, (req, res) => {
    res.json({
        message: "Welcome Admin! You have access to this route."
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});