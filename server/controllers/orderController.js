const Order = require("../models/Order");
const Food = require("../models/Food");

const createOrder = async (req, res) => {
    try {
        const { items, pickupSlot } = req.body;

        if (!items || items.length === 0 || !pickupSlot) {
            return res.status(400).json({
                message: "Items and pickup slot are required"
            });
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const food = await Food.findById(item.food);

            if (!food) {
                return res.status(404).json({
                    message: `Food not found: ${item.food}`
                });
            }

            if (!food.available) {
                return res.status(400).json({
                    message: `${food.name} is currently unavailable`
                });
            }

            const quantity = item.quantity;

            if (!quantity || quantity < 1) {
                return res.status(400).json({
                    message: "Invalid quantity"
                });
            }

            const itemTotal = food.price * quantity;

            totalAmount += itemTotal;

            orderItems.push({
                food: food._id,
                quantity,
                price: food.price
            });
        }

        const activeOrders = await Order.countDocuments({
            pickupSlot,
            status: {
                $in: ["placed", "preparing"]
            }
        });

        const MAX_ORDERS_PER_SLOT = 5;

        if (activeOrders >= MAX_ORDERS_PER_SLOT) {
            return res.status(400).json({
                message: "This pickup slot is full"
            });
        }

        const lastOrder = await Order.findOne({
            pickupSlot,
            status: {
                $in: ["placed", "preparing"]
            }
        }).sort({ queueNumber: -1 });

        const queueNumber = lastOrder
            ? lastOrder.queueNumber + 1
            : 1;

        const order = await Order.create({
            user: req.user.userId,
            items: orderItems,
            totalAmount,
            pickupSlot,
            queueNumber
        });

        const populatedOrder = await Order.findById(order._id)
            .populate("items.food", "name price");

        res.status(201).json({
            message: "Order placed successfully",
            order: populatedOrder
        });

    } catch (error) {
        console.error("Create order error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.userId
        })
            .populate("items.food", "name price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Get my orders error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("items.food", "name price")
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (
            order.user._id.toString() !== req.user.userId &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.status(200).json({
            order
        });

    } catch (error) {
        console.error("Get order error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.user.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (order.status !== "placed") {
            return res.status(400).json({
                message: "Only placed orders can be cancelled"
            });
        }

        order.status = "cancelled";

        await order.save();

        res.status(200).json({
            message: "Order cancelled successfully",
            order
        });

    } catch (error) {
        console.error("Cancel order error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.food", "name price")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Get all orders error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "placed",
            "preparing",
            "ready",
            "completed",
            "cancelled"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid order status"
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        order.status = status;

        await order.save();

        res.status(200).json({
            message: "Order status updated successfully",
            order
        });

    } catch (error) {
        console.error("Update order status error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getPickupSlots = async (req, res) => {
    try {
        const slots = [
            "12:00-12:15",
            "12:15-12:30",
            "12:30-12:45",
            "12:45-1:00",
            "1:00-1:15",
            "1:15-1:30"
        ];

        const MAX_ORDERS_PER_SLOT = 5;

        const result = [];

        for (const slot of slots) {
            const orderCount = await Order.countDocuments({
                pickupSlot: slot,
                status: {
                    $in: ["placed", "preparing"]
                }
            });

            result.push({
                slot,
                booked: orderCount,
                capacity: MAX_ORDERS_PER_SLOT,
                available: orderCount < MAX_ORDERS_PER_SLOT
            });
        }

        res.status(200).json({
            slots: result
        });

    } catch (error) {
        console.error("Get pickup slots error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getPickupSlots
};
