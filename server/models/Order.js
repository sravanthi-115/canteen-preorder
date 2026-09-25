const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                food: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Food",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        pickupSlot: {
            type: String,
            required: true
        },

        queueNumber: {
            type: Number
        },

        status: {
            type: String,
            enum: [
                "placed",
                "preparing",
                "ready",
                "completed",
                "cancelled"
            ],
            default: "placed"
        }
    },
    {
        timestamps: true
    }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;