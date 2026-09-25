const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getPickupSlots
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    createOrder
);

// Student - get own orders
router.get(
    "/my-orders",
    protect,
    getMyOrders
);


// Admin - get all orders
router.get(
    "/",
    protect,
    adminOnly,
    getAllOrders
);

router.get(
    "/pickup-slots",
    protect,
    getPickupSlots
);

// Student/Admin - get one order
router.get(
    "/:id",
    protect,
    getOrderById
);


// Student - cancel own order
router.put(
    "/:id/cancel",
    protect,
    cancelOrder
);


// Admin - update order status
router.put(
    "/:id/status",
    protect,
    adminOnly,
    updateOrderStatus
);


module.exports = router;