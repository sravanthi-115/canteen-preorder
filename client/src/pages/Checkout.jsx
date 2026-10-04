import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Checkout.css";

function Checkout() {
    const [cart, setCart] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        setCart(savedCart);

        const fetchSlots = async () => {
            try {
                const response =
                    await api.get("/orders/pickup-slots");

                setSlots(response.data.slots || []);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Failed to load pickup slots"
                );
            }
        };

        fetchSlots();
    }, []);

    const total = cart.reduce(
        (sum, item) =>
            sum +
            Number(item.price) *
                Number(item.quantity),
        0
    );

    const totalItems = cart.reduce(
        (sum, item) =>
            sum + Number(item.quantity),
        0
    );

    const formatPrice = (value) =>
        Number(value).toLocaleString("en-IN");

    const placeOrder = async () => {
        if (!selectedSlot) {
            setError("Please select a pickup slot.");
            return;
        }

        if (cart.length === 0) {
            setError(
                "Your cart is empty. Please add food first."
            );
            return;
        }

        try {
            setLoading(true);
            setError("");

            const items = cart.map((item) => ({
                food: item.food,
                quantity: Number(item.quantity)
            }));

            const response = await api.post("/orders", {
                items,
                pickupSlot: selectedSlot
            });

            const createdOrder = response.data.order;

            localStorage.removeItem("cart");
            setCart([]);

            setOrderSuccess({
                queueNumber:
                    createdOrder?.queueNumber ||
                    "Assigned",
                pickupSlot:
                    createdOrder?.pickupSlot ||
                    selectedSlot,
                orderId:
                    createdOrder?._id || ""
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to place order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="checkout-page">
                <div className="checkout-success">

                    <div className="success-check">
                        ✓
                    </div>

                    <span className="checkout-label">
                        QUICKGRAB ORDER CONFIRMED
                    </span>

                    <h1>
                        Your Order is Confirmed! 🎉
                    </h1>

                    <p className="success-message">
                        Your food is being queued up.
                        We'll have it ready for your
                        selected pickup time.
                    </p>

                    <div className="queue-card">
                        <span>Your Queue Number</span>

                        <strong>
                            #{orderSuccess.queueNumber}
                        </strong>

                        <small>
                            Keep this number handy
                            when collecting your order.
                        </small>
                    </div>

                    <div className="success-details">

                        <div className="success-detail">
                            <span>🕐</span>
                            <div>
                                <small>
                                    PICKUP SLOT
                                </small>
                                <strong>
                                    {
                                        orderSuccess.pickupSlot
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="success-detail">
                            <span>⚡</span>
                            <div>
                                <small>STATUS</small>
                                <strong>
                                    Order Placed
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="success-actions">
                        <button
                            className="track-order-btn"
                            onClick={() =>
                                navigate(
                                    "/my-orders"
                                )
                            }
                        >
                            🎫 Track My Order
                        </button>

                        <button
                            className="success-menu-btn"
                            onClick={() =>
                                navigate("/menu")
                            }
                        >
                            🍴 Order More Food
                        </button>
                    </div>

                    <p className="success-note">
                        🔒 Your order details are safely
                        saved in My Orders.
                    </p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="checkout-page">
                <div className="empty-checkout">

                    <div className="empty-icon">
                        🛒
                    </div>

                    <span className="checkout-label">
                        QUICKGRAB CHECKOUT
                    </span>

                    <h1>Your Cart is Empty</h1>

                    <p>
                        Add some delicious food before
                        checking out.
                    </p>

                    <button
                        className="checkout-primary-btn"
                        onClick={() =>
                            navigate("/menu")
                        }
                    >
                        🍴 Browse Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">

            {/* HEADER */}
            <div className="checkout-header">
                <div>
                    <span className="checkout-label">
                        ORDER CHECKOUT
                    </span>

                    <h1>
                        Complete Your Order 🍴
                    </h1>

                    <p>
                        Choose a pickup time and we'll
                        have your food ready.
                    </p>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="checkout-top-error">
                    <span>⚠️</span>
                    <p>{error}</p>

                    <button
                        type="button"
                        onClick={() => setError("")}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="checkout-layout">

                {/* LEFT */}
                <div className="checkout-main">

                    {/* ORDER SUMMARY */}
                    <section className="checkout-card">

                        <div className="section-title">
                            <div className="section-icon">
                                🛒
                            </div>

                            <div>
                                <h2>
                                    Order Summary
                                </h2>

                                <p>
                                    {totalItems}{" "}
                                    {totalItems === 1
                                        ? "item"
                                        : "items"}{" "}
                                    in your order
                                </p>
                            </div>
                        </div>

                        <div className="order-items">
                            {cart.map((item, index) => (
                                <div
                                    className="order-item"
                                    key={`${item.food}-${index}`}
                                >
                                    <div className="order-item-icon">
                                        🍽️
                                    </div>

                                    <div className="order-item-info">
                                        <h3>
                                            {item.name}
                                        </h3>

                                        <p>
                                            ₹
                                            {formatPrice(
                                                item.price
                                            )}{" "}
                                            ×{" "}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <div className="order-item-total">
                                        ₹
                                        {formatPrice(
                                            Number(
                                                item.price
                                            ) *
                                                Number(
                                                    item.quantity
                                                )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="total-row">
                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{formatPrice(total)}
                            </strong>
                        </div>
                    </section>

                    {/* PICKUP SLOT */}
                    <section className="checkout-card">

                        <div className="section-title">
                            <div className="section-icon">
                                🕐
                            </div>

                            <div>
                                <h2>
                                    Select Pickup Slot
                                </h2>

                                <p>
                                    Choose when you want
                                    to collect your order.
                                </p>
                            </div>
                        </div>

                        {slots.length === 0 ? (
                            <div className="no-slots">
                                <span>🕐</span>
                                <strong>
                                    No pickup slots available
                                </strong>
                                <p>
                                    Please try again shortly.
                                </p>
                            </div>
                        ) : (
                            <div className="slot-grid">
                                {slots.map((slot) => (
                                    <button
                                        key={slot.slot}
                                        type="button"
                                        className={`slot-card ${
                                            selectedSlot ===
                                            slot.slot
                                                ? "selected"
                                                : ""
                                        } ${
                                            !slot.available
                                                ? "full"
                                                : ""
                                        }`}
                                        disabled={
                                            !slot.available
                                        }
                                        onClick={() => {
                                            setSelectedSlot(
                                                slot.slot
                                            );
                                            setError("");
                                        }}
                                    >
                                        <span className="slot-time">
                                            🕐 {slot.slot}
                                        </span>

                                        <span className="slot-capacity">
                                            {slot.available ? (
                                                <>
                                                    {slot.capacity -
                                                        slot.booked}{" "}
                                                    spots left
                                                </>
                                            ) : (
                                                "Fully Booked"
                                            )}
                                        </span>

                                        {selectedSlot ===
                                            slot.slot && (
                                            <span className="slot-check">
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        {selectedSlot && (
                            <div className="selected-slot">
                                <span>✓</span>

                                <div>
                                    <small>
                                        YOUR PICKUP SLOT
                                    </small>

                                    <strong>
                                        {selectedSlot}
                                    </strong>
                                </div>
                            </div>
                        )}
                    </section>
                </div>

                {/* RIGHT */}
                <aside className="checkout-sidebar">

                    <div className="place-order-card">

                        <div className="sidebar-title">
                            <span>
                                QUICKGRAB
                            </span>

                            <h2>
                                Order Total
                            </h2>
                        </div>

                        <div className="sidebar-row">
                            <span>Items</span>

                            <span>
                                {totalItems}
                            </span>
                        </div>

                        <div className="sidebar-row">
                            <span>Subtotal</span>

                            <span>
                                ₹{formatPrice(total)}
                            </span>
                        </div>

                        <div className="sidebar-row">
                            <span>Pickup</span>

                            <span className="sidebar-free">
                                FREE
                            </span>
                        </div>

                        <div className="sidebar-row pickup-summary">
                            <span>Pickup Time</span>

                            <span>
                                {selectedSlot ||
                                    "Not selected"}
                            </span>
                        </div>

                        <div className="sidebar-divider" />

                        <div className="sidebar-total">
                            <span>Total</span>

                            <strong>
                                ₹{formatPrice(total)}
                            </strong>
                        </div>

                        <div className="checkout-reminder">
                            <span>⚡</span>

                            <p>
                                Select a pickup slot
                                before placing your
                                order.
                            </p>
                        </div>

                        <button
                            className="place-order-btn"
                            onClick={placeOrder}
                            disabled={
                                loading ||
                                !selectedSlot ||
                                slots.length === 0
                            }
                        >
                            {loading ? (
                                <>
                                    <span className="spinner" />
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    Place Order
                                    <span>→</span>
                                </>
                            )}
                        </button>

                        <button
                            className="back-menu-btn"
                            onClick={() =>
                                navigate("/cart")
                            }
                            disabled={loading}
                        >
                            ← Back to Cart
                        </button>

                        <div className="secure-note">
                            🔒 Secure checkout
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Checkout;