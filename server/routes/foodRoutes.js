const express = require("express");

const {
    createFood,
    getFoods,
    updateFood,
    deleteFood
} = require("../controllers/foodController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    adminOnly,
    createFood
);

router.get(
    "/",
    getFoods
);

router.put(
    "/:id",
    protect,
    adminOnly,
    updateFood
);

router.delete(
    "/:id",
    protect,
    adminOnly,
    deleteFood
);

module.exports = router;