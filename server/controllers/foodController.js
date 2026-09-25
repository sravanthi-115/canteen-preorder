const Food = require("../models/Food");

const createFood = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            available
        } = req.body;

        // Validate required fields
        if (!name || !description || price === undefined || !category) {
            return res.status(400).json({
                message: "Name, description, price and category are required"
            });
        }

        // Validate price
        if (price < 0) {
            return res.status(400).json({
                message: "Price cannot be negative"
            });
        }

        // Create food
        const food = await Food.create({
            name,
            description,
            price,
            category,
            image,
            available
        });

        res.status(201).json({
            message: "Food item created successfully",
            food
        });

    } catch (error) {
        console.error("Create food error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getFoods = async (req, res) => {
    try {
        const foods = await Food.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: foods.length,
            foods
        });

    } catch (error) {
        console.error("Get foods error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateFood = async (req, res) => {
    try {
        const { id } = req.params;

        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        const updatedFood = await Food.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            message: "Food item updated successfully",
            food: updatedFood
        });

    } catch (error) {
        console.error("Update food error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;

        const food = await Food.findById(id);

        if (!food) {
            return res.status(404).json({
                message: "Food item not found"
            });
        }

        await Food.findByIdAndDelete(id);

        res.status(200).json({
            message: "Food item deleted successfully"
        });

    } catch (error) {
        console.error("Delete food error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createFood,
    getFoods,
    updateFood,
    deleteFood
};