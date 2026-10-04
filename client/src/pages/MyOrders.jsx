import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

import "./MyOrders.css";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // =========================
    // LIVE UPDATE STATE
    // =========================

    const [notification, setNotification] = useState("");
    const [notificationType, setNotificationType] =
        useState("default");

    const previousStatuses = useRef({});
    const isFirstFetch = useRef(true);
    const notificationTimer = useRef(null);

    // =========================
    // FETCH ORDERS
    // =========================

    const fetchOrders = async (checkForUpdates = false) => {
        try {
            setError("");

            if (!checkForUpdates) {
                setLoading(true);
            }

            const response =
                await api.get("/orders/my-orders");

            const latestOrders =
                response.data.orders || [];

            // =========================
            // DETECT STATUS CHANGES
            // =========================

            if (
                checkForUpdates &&
                !isFirstFetch.current
            ) {
                let changedOrder = null;
                let newStatus = null;

                latestOrders.forEach((order) => {
                    const previousStatus =
                        previousStatuses.current[
                            order._id
                        ];

                    if (
                        previousStatus &&
                        previousStatus !==
                            order.status
                    ) {
                        changedOrder = order;
                        newStatus = order.status;
                    }
                });

                if (
                    changedOrder &&
                    newStatus
                ) {
                    let message = "";
                    let type = "default";

                    if (
                        newStatus ===
                        "preparing"
                    ) {
                        message =
                            `🔥 Order #${changedOrder._id
                                .slice(-6)
                                .toUpperCase()} is now being prepared.`;

                        type = "preparing";
                    } else if (
                        newStatus === "ready"
                    ) {
                        message =
                            `🎉 Order #${changedOrder._id
                                .slice(-6)
                                .toUpperCase()} is ready for pickup!`;

                        type = "ready";
                    } else if (
                        newStatus ===
                        "completed"
                    ) {
                        message =
                            `✓ Order #${changedOrder._id
                                .slice(-6)
                                .toUpperCase()} has been completed.`;

                        type = "completed";
                    } else if (
                        newStatus ===
                        "cancelled"
                    ) {
                        message =
                            `✕ Order #${changedOrder._id
                                .slice(-6)
                                .toUpperCase()} has been cancelled.`;

                        type = "cancelled";
                    } else {
                        message =
                            `Order #${changedOrder._id
                                .slice(-6)
                                .toUpperCase()} status was updated.`;

                        type = "default";
                    }

                    setNotification(message);
                    setNotificationType(type);

                    if (
                        notificationTimer.current
                    ) {
                        clearTimeout(
                            notificationTimer.current
                        );
                    }

                    notificationTimer.current =
                        setTimeout(() => {
                            setNotification("");
                        }, 6000);
                }
            }

            // =========================
            // SAVE CURRENT STATUSES
            // =========================

            const currentStatuses = {};

            latestOrders.forEach(
                (order) => {
                    currentStatuses[
                        order._id
                    ] = order.status;
                }
            );

            previousStatuses.current =
                currentStatuses;

            isFirstFetch.current = false;

            setOrders(latestOrders);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to load orders"
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // AUTO REFRESH
    // =========================

    useEffect(() => {
        fetchOrders(false);

        const refreshInterval =
            setInterval(() => {
                fetchOrders(true);
            }, 10000);

        return () => {
            clearInterval(
                refreshInterval
            );

            if (
                notificationTimer.current
            ) {
                clearTimeout(
                    notificationTimer.current
                );
            }
        };
    }, []);

    // =========================
    // CANCEL ORDER
    // =========================

    const cancelOrder = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            await api.put(
                `/orders/${id}/cancel`
            );

            await fetchOrders(false);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to cancel order"
            );
        }
    };

    // =========================
    // CLOSE NOTIFICATION
    // =========================

    const closeNotification = () => {
        setNotification("");

        if (
            notificationTimer.current
        ) {
            clearTimeout(
                notificationTimer.current
            );
        }
    };

    // =========================
    // STATUS TEXT
    // =========================

    const getStatusText = (status) => {
        switch (status) {
            case "placed":
                return "Order Placed";

            case "preparing":
                return "Preparing";

            case "ready":
                return "Ready for Pickup";

            case "completed":
                return "Completed";

            case "cancelled":
                return "Cancelled";

            default:
                return status || "Unknown";
        }
    };

    // =========================
    // FOOD NAME
    // =========================

    const getFoodName = (item) => {
        if (item?.food?.name) {
            return item.food.name;
        }

        return "Food item unavailable";
    };

    // =========================
    // ITEM TOTAL
    // =========================

    const getItemTotal = (item) => {
        const price = Number(
            item?.price || 0
        );

        const quantity = Number(
            item?.quantity || 0
        );

        return price * quantity;
    };

    // =========================
    // TRACKING STEPS
    // =========================

    const trackingSteps = [
        {
            status: "placed",
            icon: "🧾",
            title: "Order Placed",
            description: "Order received"
        },
        {
            status: "preparing",
            icon: "🔥",
            title: "Preparing",
            description: "Canteen is cooking"
        },
        {
            status: "ready",
            icon: "🎉",
            title: "Ready",
            description: "Ready for pickup"
        },
        {
            status: "completed",
            icon: "✓",
            title: "Completed",
            description: "Order collected"
        }
    ];

    // =========================
    // TRACKING STEP STATE
    // =========================

    const getStepState = (
        orderStatus,
        stepStatus
    ) => {
        if (
            orderStatus === "cancelled"
        ) {
            return "cancelled-step";
        }

        const statusOrder = [
            "placed",
            "preparing",
            "ready",
            "completed"
        ];

        const currentIndex =
            statusOrder.indexOf(
                orderStatus
            );

        const stepIndex =
            statusOrder.indexOf(
                stepStatus
            );

        if (
            stepIndex < currentIndex
        ) {
            return "completed-step";
        }

        if (
            stepIndex === currentIndex
        ) {
            return "active-step";
        }

        return "pending-step";
    };

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="orders-page">

                <div className="orders-loading">

                    <div className="loading-icon">
                        🍽️
                    </div>

                    <h2>
                        Loading your orders...
                    </h2>

                    <p>
                        Please wait a moment.
                    </p>

                </div>

            </div>
        );
    }

    // =========================
    // PAGE
    // =========================

    return (
        <div className="orders-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="orders-header">

                <div>

                    <span className="orders-label">
                        ORDER HISTORY
                    </span>

                    <h1>
                        My Orders 📋
                    </h1>

                    <p>
                        Track your food orders
                        and pickup status.
                    </p>

                </div>

                <div className="orders-header-actions">

                    <div className="orders-live-status">

                        <span className="orders-live-dot"></span>

                        Live

                    </div>

                    <button
                        type="button"
                        className="orders-refresh-btn"
                        onClick={() =>
                            fetchOrders(true)
                        }
                    >
                        ↻ Refresh
                    </button>

                </div>

            </div>

            {/* =========================
                LIVE NOTIFICATION
            ========================= */}

            {notification && (
                <div
                    className={`order-update-notification ${notificationType}`}
                >

                    <div className="order-notification-icon">

                        {notificationType ===
                        "ready"
                            ? "🎉"
                            : notificationType ===
                              "completed"
                            ? "✓"
                            : notificationType ===
                              "cancelled"
                            ? "✕"
                            : "🔔"}

                    </div>

                    <div className="order-notification-content">

                        <strong>
                            Order Update
                        </strong>

                        <span>
                            {notification}
                        </span>

                    </div>

                    <button
                        type="button"
                        className="order-notification-close"
                        onClick={
                            closeNotification
                        }
                        aria-label="Close notification"
                    >
                        ×
                    </button>

                </div>
            )}

            {/* =========================
                ERROR
            ========================= */}

            {error && (
                <div className="orders-error">
                    ⚠️ {error}
                </div>
            )}

            {/* =========================
                EMPTY
            ========================= */}

            {orders.length === 0 &&
            !error ? (

                <div className="empty-orders-page">

                    <div className="empty-order-icon">
                        🍽️
                    </div>

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        You haven't placed any
                        orders. Your delicious
                        journey starts here!
                    </p>

                    <Link
                        to="/menu"
                        className="browse-food-btn"
                    >
                        🍴 Browse Menu
                    </Link>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map(
                        (order) => (

                            <div
                                className="customer-order-card"
                                key={order?._id}
                            >

                                {/* =========================
                                    ORDER HEADER
                                ========================= */}

                                <div className="customer-order-header">

                                    <div>

                                        <span className="customer-order-label">
                                            ORDER
                                        </span>

                                        <h2>
                                            #
                                            {order?._id
                                                ? order._id
                                                      .slice(
                                                          -6
                                                      )
                                                      .toUpperCase()
                                                : "------"}
                                        </h2>

                                    </div>

                                    <span
                                        className={`customer-status status-${
                                            order?.status ||
                                            "unknown"
                                        }`}
                                    >
                                        {getStatusText(
                                            order?.status
                                        )}
                                    </span>

                                </div>

                                {/* =========================
                                    ORDER INFO
                                ========================= */}

                                <div className="customer-order-info">

                                    <div className="info-box">

                                        <span>
                                            🕐 Pickup
                                        </span>

                                        <strong>
                                            {order?.pickupSlot ||
                                                "Not selected"}
                                        </strong>

                                    </div>

                                    <div className="info-box queue-box">

                                        <span>
                                            🎫 Queue Number
                                        </span>

                                        <strong>
                                            #
                                            {order?.queueNumber ||
                                                "-"}
                                        </strong>

                                    </div>

                                    <div className="info-box">

                                        <span>
                                            💰 Total
                                        </span>

                                        <strong>
                                            ₹
                                            {order?.totalAmount ||
                                                0}
                                        </strong>

                                    </div>

                                </div>

                                {/* =========================
                                    ORDER TRACKING
                                ========================= */}

                                {order?.status !==
                                    "cancelled" && (

                                    <div className="order-tracking">

                                        <div className="tracking-title">

                                            <span>
                                                ORDER PROGRESS
                                            </span>

                                            <strong>
                                                {getStatusText(
                                                    order?.status
                                                )}
                                            </strong>

                                        </div>

                                        <div className="tracking-timeline">

                                            {trackingSteps.map(
                                                (
                                                    step,
                                                    index
                                                ) => {

                                                    const state =
                                                        getStepState(
                                                            order?.status,
                                                            step.status
                                                        );

                                                    return (
                                                        <div
                                                            className={`tracking-step ${state}`}
                                                            key={
                                                                step.status
                                                            }
                                                        >

                                                            <div className="tracking-line-wrapper">

                                                                <div className="tracking-circle">

                                                                    {state ===
                                                                    "completed-step"
                                                                        ? "✓"
                                                                        : step.icon}

                                                                </div>

                                                                {index <
                                                                    trackingSteps.length -
                                                                        1 && (
                                                                    <div className="tracking-line" />
                                                                )}

                                                            </div>

                                                            <div className="tracking-step-content">

                                                                <strong>
                                                                    {
                                                                        step.title
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        step.description
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>
                                                    );
                                                }
                                            )}

                                        </div>

                                    </div>

                                )}

                                {/* =========================
                                    CANCELLED TRACKING
                                ========================= */}

                                {order?.status ===
                                    "cancelled" && (

                                    <div className="cancelled-tracking">

                                        <div className="cancelled-tracking-icon">
                                            ✕
                                        </div>

                                        <div>

                                            <strong>
                                                Order Cancelled
                                            </strong>

                                            <span>
                                                This order
                                                will not
                                                be prepared.
                                            </span>

                                        </div>

                                    </div>

                                )}

                                {/* =========================
                                    ITEMS
                                ========================= */}

                                <div className="customer-items">

                                    <h3>
                                        Your Items
                                    </h3>

                                    {(order?.items ||
                                        []).map(
                                        (
                                            item,
                                            index
                                        ) => (

                                            <div
                                                className="customer-item"
                                                key={
                                                    item?._id ||
                                                    `${order?._id}-${index}`
                                                }
                                            >

                                                <div className="customer-item-icon">
                                                    🍽️
                                                </div>

                                                <div className="customer-item-details">

                                                    <strong>
                                                        {getFoodName(
                                                            item
                                                        )}
                                                    </strong>

                                                    <span>
                                                        ₹
                                                        {item?.price ||
                                                            0}
                                                        {" × "}
                                                        {item?.quantity ||
                                                            0}
                                                    </span>

                                                </div>

                                                <strong className="customer-item-price">
                                                    ₹
                                                    {getItemTotal(
                                                        item
                                                    )}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                                {/* =========================
                                    TOTAL
                                ========================= */}

                                <div className="customer-total">

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹
                                        {order?.totalAmount ||
                                            0}
                                    </strong>

                                </div>

                                {/* =========================
                                    STATUS MESSAGE
                                ========================= */}

                                {order?.status ===
                                    "placed" && (

                                    <div className="order-status-message placed-message">
                                        🕐 Your order
                                        has been received.
                                        The canteen will
                                        start preparing
                                        it soon.
                                    </div>

                                )}

                                {order?.status ===
                                    "preparing" && (

                                    <div className="order-status-message preparing-message">
                                        🔥 Your food is
                                        being prepared
                                        right now!
                                    </div>

                                )}

                                {order?.status ===
                                    "ready" && (

                                    <div className="order-status-message ready-message">
                                        🎉 Your order is
                                        ready! Please
                                        collect it during
                                        your pickup slot.
                                    </div>

                                )}

                                {order?.status ===
                                    "completed" && (

                                    <div className="order-status-message completed-message">
                                        ✓ Order completed.
                                        Enjoy your meal! 🍴
                                    </div>

                                )}

                                {order?.status ===
                                    "cancelled" && (

                                    <div className="order-status-message cancelled-message">
                                        ✕ This order has
                                        been cancelled.
                                    </div>

                                )}

                                {/* =========================
                                    ACTION
                                ========================= */}

                                {order?.status ===
                                    "placed" && (

                                    <button
                                        type="button"
                                        className="cancel-order-btn"
                                        onClick={() =>
                                            cancelOrder(
                                                order._id
                                            )
                                        }
                                    >
                                        Cancel Order
                                    </button>

                                )}

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default MyOrders;