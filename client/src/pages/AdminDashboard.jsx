import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";
import FoodManagement from "../components/FoodManagement";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    // New order notification
    const [newOrderCount, setNewOrderCount] = useState(0);
    const [notification, setNotification] = useState("");

    const previousOrderIds = useRef([]);
    const isFirstFetch = useRef(true);
    const notificationTimer = useRef(null);

    // =========================
    // FETCH ORDERS
    // =========================

    const fetchOrders = async (showNotification = false) => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/orders");
            const latestOrders = response.data.orders || [];

            const latestOrderIds = latestOrders.map(
                (order) => order._id
            );

            // Detect newly created orders
            if (!isFirstFetch.current && showNotification) {
                const previousIds = previousOrderIds.current;

                const newOrders = latestOrders.filter(
                    (order) => !previousIds.includes(order._id)
                );

                if (newOrders.length > 0) {
                    setNewOrderCount(
                        (previous) =>
                            previous + newOrders.length
                    );

                    const latestNewOrder = newOrders[0];

                    setNotification(
                        `New order received! Queue #${
                            latestNewOrder.queueNumber || "-"
                        }`
                    );

                    if (notificationTimer.current) {
                        clearTimeout(notificationTimer.current);
                    }

                    notificationTimer.current = setTimeout(() => {
                        setNotification("");
                    }, 5000);
                }
            }

            previousOrderIds.current = latestOrderIds;
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

        const refreshInterval = setInterval(() => {
            fetchOrders(true);
        }, 10000);

        return () => {
            clearInterval(refreshInterval);

            if (notificationTimer.current) {
                clearTimeout(notificationTimer.current);
            }
        };
    }, []);

    // =========================
    // UPDATE ORDER STATUS
    // =========================

    const updateStatus = async (id, status) => {
        try {
            setError("");

            await api.put(
                `/orders/${id}/status`,
                { status }
            );

            await fetchOrders(false);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update order"
            );
        }
    };

    // =========================
    // CLEAR NOTIFICATIONS
    // =========================

    const clearNewOrderNotifications = () => {
        setNewOrderCount(0);
        setNotification("");
    };

    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (status) => {
        return `admin-status admin-status-${status}`;
    };

    // =========================
    // STATUS TEXT
    // =========================

    const getStatusText = (status) => {
        const statusMap = {
            placed: "Pending",
            preparing: "Preparing",
            ready: "Ready",
            completed: "Completed",
            cancelled: "Cancelled"
        };

        return statusMap[status] || status;
    };

    // =========================
    // NEXT ACTION
    // =========================

    const getNextAction = (order) => {
        if (order.status === "placed") {
            return (
                <button
                    type="button"
                    className="admin-action-btn preparing-btn"
                    onClick={() =>
                        updateStatus(
                            order._id,
                            "preparing"
                        )
                    }
                >
                    🔥 Start Preparing
                </button>
            );
        }

        if (order.status === "preparing") {
            return (
                <button
                    type="button"
                    className="admin-action-btn ready-btn"
                    onClick={() =>
                        updateStatus(
                            order._id,
                            "ready"
                        )
                    }
                >
                    ✓ Mark Ready
                </button>
            );
        }

        if (order.status === "ready") {
            return (
                <button
                    type="button"
                    className="admin-action-btn complete-btn"
                    onClick={() =>
                        updateStatus(
                            order._id,
                            "completed"
                        )
                    }
                >
                    ✓ Complete Order
                </button>
            );
        }

        return null;
    };

    // =========================
    // CUSTOMER NAME
    // =========================

    const getCustomerName = (order) => {
        return (
            order?.user?.name ||
            "Unknown Student"
        );
    };

    // =========================
    // CUSTOMER EMAIL
    // =========================

    const getCustomerEmail = (order) => {
        return (
            order?.user?.email ||
            "No email available"
        );
    };

    // =========================
    // CUSTOMER INITIAL
    // =========================

    const getCustomerInitial = (order) => {
        return getCustomerName(order)
            .charAt(0)
            .toUpperCase();
    };

    // =========================
    // FOOD NAME
    // =========================

    const getFoodName = (item) => {
        return (
            item?.food?.name ||
            "Food item unavailable"
        );
    };

    // =========================
    // FILTER ORDERS
    // =========================

    const filteredOrders = useMemo(() => {
        const searchText = search
            .trim()
            .toLowerCase();

        return orders.filter((order) => {
            const orderId =
                order?._id?.toLowerCase() || "";

            const customerName =
                getCustomerName(order).toLowerCase();

            const customerEmail =
                getCustomerEmail(order).toLowerCase();

            const queueNumber = String(
                order?.queueNumber || ""
            ).toLowerCase();

            const matchesSearch =
                !searchText ||
                orderId.includes(searchText) ||
                customerName.includes(searchText) ||
                customerEmail.includes(searchText) ||
                queueNumber.includes(searchText);

            const matchesStatus =
                statusFilter === "all" ||
                order?.status === statusFilter;

            return (
                matchesSearch &&
                matchesStatus
            );
        });
    }, [orders, search, statusFilter]);

    // =========================
    // CLEAR FILTERS
    // =========================

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("all");
    };

    // =========================
    // BASIC STATS
    // =========================

    const totalOrders = orders.length;

    const preparingOrders = orders.filter(
        (order) =>
            order.status === "preparing"
    ).length;

    const readyOrders = orders.filter(
        (order) =>
            order.status === "ready"
    ).length;

    const pendingOrders = orders.filter(
        (order) =>
            order.status === "placed"
    ).length;

    const completedOrders = orders.filter(
        (order) =>
            order.status === "completed"
    ).length;

    const cancelledOrders = orders.filter(
        (order) =>
            order.status === "cancelled"
    ).length;

    // =========================
    // REVENUE
    // =========================

    const totalRevenue = orders
        .filter(
            (order) =>
                order.status === "completed"
        )
        .reduce(
            (total, order) =>
                total +
                Number(
                    order.totalAmount || 0
                ),
            0
        );

    // =========================
    // ITEMS SOLD
    // =========================

    const totalItemsSold = orders
        .filter(
            (order) =>
                order.status !== "cancelled"
        )
        .reduce((total, order) => {
            const orderItems =
                order.items || [];

            return (
                total +
                orderItems.reduce(
                    (itemTotal, item) =>
                        itemTotal +
                        Number(
                            item.quantity || 0
                        ),
                    0
                )
            );
        }, 0);

    // =========================
    // AVERAGE ORDER VALUE
    // =========================

    const averageOrderValue =
        completedOrders > 0
            ? totalRevenue /
              completedOrders
            : 0;

    // =========================
    // TODAY'S ORDERS
    // =========================

    const today = new Date();

    const todayDate =
        today.toLocaleDateString("en-IN");

    const todayOrders = orders.filter(
        (order) => {
            if (!order.createdAt) {
                return false;
            }

            const orderDate =
                new Date(
                    order.createdAt
                ).toLocaleDateString("en-IN");

            return orderDate === todayDate;
        }
    ).length;

    // =========================
    // POPULAR FOOD
    // =========================

    const popularFoods = {};

    orders
        .filter(
            (order) =>
                order.status !== "cancelled"
        )
        .forEach((order) => {
            (order.items || []).forEach(
                (item) => {
                    const foodName =
                        item?.food?.name ||
                        "Unknown Food";

                    const quantity =
                        Number(
                            item?.quantity || 0
                        );

                    if (
                        !popularFoods[
                            foodName
                        ]
                    ) {
                        popularFoods[
                            foodName
                        ] = 0;
                    }

                    popularFoods[
                        foodName
                    ] += quantity;
                }
            );
        });

    const popularFoodList =
        Object.entries(popularFoods)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(0, 5);

    const maxFoodQuantity =
        popularFoodList.length > 0
            ? popularFoodList[0][1]
            : 1;

    // =========================
    // JSX
    // =========================

    return (
        <div className="admin-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="admin-header">

                <div>
                    <span className="admin-label">
                        CANTEEN MANAGEMENT
                    </span>

                    <h1>
                        Admin Dashboard 👨‍🍳
                    </h1>

                    <p>
                        Manage orders, food items
                        and canteen operations.
                    </p>
                </div>

                <div className="admin-header-actions">

                    <div className="admin-live-status">
                        <span className="admin-live-dot"></span>

                        Live

                        {newOrderCount > 0 && (
                            <button
                                type="button"
                                className="admin-new-order-badge"
                                onClick={
                                    clearNewOrderNotifications
                                }
                            >
                                🔔 {newOrderCount} New
                            </button>
                        )}
                    </div>

                    <button
                        type="button"
                        className="refresh-btn"
                        onClick={() =>
                            fetchOrders(true)
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "↻ Loading..."
                            : "↻ Refresh Orders"}
                    </button>

                </div>

            </div>

            {/* =========================
                NEW ORDER NOTIFICATION
            ========================= */}

            {notification && (
                <div className="admin-new-order-notification">

                    <div className="admin-notification-icon">
                        🔔
                    </div>

                    <div className="admin-notification-content">
                        <strong>
                            New Order
                        </strong>

                        <span>
                            {notification}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="admin-notification-close"
                        onClick={
                            clearNewOrderNotifications
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
                <div className="admin-error">
                    ⚠️ {error}
                </div>
            )}

            {/* =========================
                BASIC STATS
            ========================= */}

            <div className="admin-stats">

                <div className="stat-card">

                    <div className="stat-icon orange">
                        📋
                    </div>

                    <div>
                        <span>
                            Total Orders
                        </span>

                        <strong>
                            {totalOrders}
                        </strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon yellow">
                        🔥
                    </div>

                    <div>
                        <span>
                            Preparing
                        </span>

                        <strong>
                            {preparingOrders}
                        </strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon green">
                        ✓
                    </div>

                    <div>
                        <span>
                            Ready
                        </span>

                        <strong>
                            {readyOrders}
                        </strong>
                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon red">
                        ⏱
                    </div>

                    <div>
                        <span>
                            Pending
                        </span>

                        <strong>
                            {pendingOrders}
                        </strong>
                    </div>

                </div>

            </div>

            {/* =========================
                ANALYTICS
            ========================= */}

            <section className="analytics-section">

                <div className="admin-section-header">

                    <div>
                        <h2>
                            Analytics
                        </h2>

                        <p>
                            Monitor canteen performance
                            and sales.
                        </p>
                    </div>

                </div>

                <div className="analytics-grid">

                    {/* REVENUE */}

                    <div className="analytics-card">

                        <div className="analytics-card-top">

                            <div className="analytics-icon revenue-icon">
                                💰
                            </div>

                            <span>
                                Revenue
                            </span>

                        </div>

                        <strong>
                            ₹{totalRevenue.toFixed(0)}
                        </strong>

                        <p>
                            From completed orders
                        </p>

                    </div>

                    {/* COMPLETED */}

                    <div className="analytics-card">

                        <div className="analytics-card-top">

                            <div className="analytics-icon completed-icon">
                                ✓
                            </div>

                            <span>
                                Completed
                            </span>

                        </div>

                        <strong>
                            {completedOrders}
                        </strong>

                        <p>
                            Successfully collected orders
                        </p>

                    </div>

                    {/* ITEMS */}

                    <div className="analytics-card">

                        <div className="analytics-card-top">

                            <div className="analytics-icon items-icon">
                                🍔
                            </div>

                            <span>
                                Items Sold
                            </span>

                        </div>

                        <strong>
                            {totalItemsSold}
                        </strong>

                        <p>
                            Items across active orders
                        </p>

                    </div>

                    {/* AVERAGE */}

                    <div className="analytics-card">

                        <div className="analytics-card-top">

                            <div className="analytics-icon average-icon">
                                📊
                            </div>

                            <span>
                                Avg. Order
                            </span>

                        </div>

                        <strong>
                            ₹{averageOrderValue.toFixed(0)}
                        </strong>

                        <p>
                            Average completed order
                        </p>

                    </div>

                    {/* TODAY */}

                    <div className="analytics-card">

                        <div className="analytics-card-top">

                            <div className="analytics-icon today-icon">
                                📅
                            </div>

                            <span>
                                Today's Orders
                            </span>

                        </div>

                        <strong>
                            {todayOrders}
                        </strong>

                        <p>
                            Orders created today
                        </p>

                    </div>

                </div>

                {/* LOWER ANALYTICS */}

                <div className="analytics-lower">

                    {/* POPULAR FOOD */}

                    <div className="popular-food-card">

                        <div className="analytics-box-header">

                            <div>
                                <h3>
                                    Popular Food 🍴
                                </h3>

                                <p>
                                    Top selling items
                                    by quantity.
                                </p>
                            </div>

                        </div>

                        {popularFoodList.length === 0 ? (
                            <div className="analytics-empty">
                                No food sales data yet.
                            </div>
                        ) : (
                            <div className="popular-food-list">

                                {popularFoodList.map(
                                    (
                                        [
                                            foodName,
                                            quantity
                                        ],
                                        index
                                    ) => (
                                        <div
                                            className="popular-food-item"
                                            key={foodName}
                                        >

                                            <div className="popular-food-top">

                                                <div className="popular-food-name">

                                                    <span className="food-rank">
                                                        #{index + 1}
                                                    </span>

                                                    <strong>
                                                        {foodName}
                                                    </strong>

                                                </div>

                                                <span className="food-quantity">
                                                    {quantity} sold
                                                </span>

                                            </div>

                                            <div className="food-progress">

                                                <div
                                                    className="food-progress-bar"
                                                    style={{
                                                        width: `${(
                                                            (quantity /
                                                                maxFoodQuantity) *
                                                            100
                                                        ).toFixed(0)}%`
                                                    }}
                                                ></div>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                    {/* ORDER OVERVIEW */}

                    <div className="status-overview-card">

                        <div className="analytics-box-header">

                            <div>
                                <h3>
                                    Order Overview
                                </h3>

                                <p>
                                    Current order status.
                                </p>
                            </div>

                        </div>

                        <div className="status-overview-list">

                            <div className="status-overview-row">

                                <span>
                                    <i className="status-dot placed-dot"></i>
                                    Pending
                                </span>

                                <strong>
                                    {pendingOrders}
                                </strong>

                            </div>

                            <div className="status-overview-row">

                                <span>
                                    <i className="status-dot preparing-dot"></i>
                                    Preparing
                                </span>

                                <strong>
                                    {preparingOrders}
                                </strong>

                            </div>

                            <div className="status-overview-row">

                                <span>
                                    <i className="status-dot ready-dot"></i>
                                    Ready
                                </span>

                                <strong>
                                    {readyOrders}
                                </strong>

                            </div>

                            <div className="status-overview-row">

                                <span>
                                    <i className="status-dot completed-dot"></i>
                                    Completed
                                </span>

                                <strong>
                                    {completedOrders}
                                </strong>

                            </div>

                            <div className="status-overview-total">

                                <span>
                                    Total Orders
                                </span>

                                <strong>
                                    {totalOrders}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* =========================
                ORDERS
            ========================= */}

            <section className="admin-section">

                <div className="admin-section-header">

                    <div>
                        <h2>
                            Orders
                        </h2>

                        <p>
                            Manage incoming canteen orders.
                        </p>
                    </div>

                    <span className="order-count">
                        {filteredOrders.length} of{" "}
                        {orders.length} orders
                    </span>

                </div>

                {/* SEARCH + FILTERS */}

                <div className="admin-order-tools">

                    <div className="admin-search-box">

                        <span>
                            🔎
                        </span>

                        <input
                            type="text"
                            placeholder="Search by order ID, student, email or queue number..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                className="admin-clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>
                        )}

                    </div>

                    <div className="admin-filter-row">

                        {[
                            [
                                "all",
                                "All",
                                totalOrders
                            ],
                            [
                                "placed",
                                "Pending",
                                pendingOrders
                            ],
                            [
                                "preparing",
                                "Preparing",
                                preparingOrders
                            ],
                            [
                                "ready",
                                "Ready",
                                readyOrders
                            ],
                            [
                                "completed",
                                "Completed",
                                completedOrders
                            ],
                            [
                                "cancelled",
                                "Cancelled",
                                cancelledOrders
                            ]
                        ].map(
                            ([
                                value,
                                label,
                                count
                            ]) => (
                                <button
                                    type="button"
                                    key={value}
                                    className={`admin-filter ${
                                        statusFilter ===
                                        value
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setStatusFilter(
                                            value
                                        )
                                    }
                                >
                                    {label}

                                    <span>
                                        {count}
                                    </span>
                                </button>
                            )
                        )}

                    </div>

                    {(search ||
                        statusFilter !== "all") && (
                        <button
                            type="button"
                            className="admin-clear-filters"
                            onClick={
                                clearFilters
                            }
                        >
                            Clear all filters
                        </button>
                    )}

                </div>

                {/* LOADING */}

                {loading &&
                orders.length === 0 ? (
                    <div className="empty-orders">

                        <div className="empty-orders-icon">
                            ⏳
                        </div>

                        <h3>
                            Loading orders...
                        </h3>

                        <p>
                            Please wait while we
                            load the latest orders.
                        </p>

                    </div>
                ) : filteredOrders.length === 0 ? (

                    /* EMPTY / NO MATCH */

                    <div className="empty-orders">

                        <div className="empty-orders-icon">
                            {orders.length === 0
                                ? "🍽️"
                                : "🔎"}
                        </div>

                        <h3>
                            {orders.length === 0
                                ? "No orders yet"
                                : "No matching orders"}
                        </h3>

                        <p>
                            {orders.length === 0
                                ? "New student orders will appear here."
                                : "Try changing your search or filters."}
                        </p>

                        {orders.length > 0 && (
                            <button
                                type="button"
                                className="admin-reset-btn"
                                onClick={
                                    clearFilters
                                }
                            >
                                Reset Filters
                            </button>
                        )}

                    </div>

                ) : (

                    /* ORDER GRID */

                    <div className="orders-grid">

                        {filteredOrders.map(
                            (order) => (

                                <div
                                    className="admin-order-card"
                                    key={order._id}
                                >

                                    {/* ORDER HEADER */}

                                    <div className="order-card-header">

                                        <div>

                                            <span className="order-small-label">
                                                ORDER
                                            </span>

                                            <h3>
                                                #
                                                {order._id?.slice(
                                                    -6
                                                )}
                                            </h3>

                                        </div>

                                        <span
                                            className={getStatusClass(
                                                order.status
                                            )}
                                        >
                                            {getStatusText(
                                                order.status
                                            )}
                                        </span>

                                    </div>

                                    {/* CUSTOMER */}

                                    <div className="customer-info">

                                        <div className="customer-avatar">
                                            {getCustomerInitial(
                                                order
                                            )}
                                        </div>

                                        <div>

                                            <strong>
                                                {getCustomerName(
                                                    order
                                                )}
                                            </strong>

                                            <span>
                                                {getCustomerEmail(
                                                    order
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    {/* ORDER DETAILS */}

                                    <div className="order-details">

                                        <div className="detail-item">

                                            <span>
                                                🕐 Pickup
                                            </span>

                                            <strong>
                                                {order.pickupSlot ||
                                                    "Not selected"}
                                            </strong>

                                        </div>

                                        <div className="detail-item">

                                            <span>
                                                🎫 Queue
                                            </span>

                                            <strong>
                                                #
                                                {order.queueNumber ||
                                                    "-"}
                                            </strong>

                                        </div>

                                    </div>

                                    {/* ITEMS */}

                                    <div className="admin-order-items">

                                        <h4>
                                            Order Items
                                        </h4>

                                        {(order.items ||
                                            []).map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <div
                                                    className="admin-order-item"
                                                    key={
                                                        item?._id ||
                                                        `${order._id}-${index}`
                                                    }
                                                >

                                                    <span>
                                                        {getFoodName(
                                                            item
                                                        )}
                                                    </span>

                                                    <span>
                                                        ×{" "}
                                                        {item?.quantity ||
                                                            0}
                                                    </span>

                                                    <strong>
                                                        ₹
                                                        {(
                                                            Number(
                                                                item?.price ||
                                                                    0
                                                            ) *
                                                            Number(
                                                                item?.quantity ||
                                                                    0
                                                            )
                                                        ).toFixed(
                                                            0
                                                        )}
                                                    </strong>

                                                </div>

                                            )
                                        )}

                                    </div>

                                    {/* TOTAL */}

                                    <div className="admin-order-total">

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong>
                                            ₹
                                            {order.totalAmount ||
                                                0}
                                        </strong>

                                    </div>

                                    {/* ACTION */}

                                    <div className="order-action">

                                        {getNextAction(
                                            order
                                        )}

                                        {order.status ===
                                            "completed" && (
                                            <div className="completed-message">
                                                ✓ Order Completed
                                            </div>
                                        )}

                                        {order.status ===
                                            "cancelled" && (
                                            <div className="cancelled-message">
                                                ✕ Order Cancelled
                                            </div>
                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>
                )}

            </section>

            {/* =========================
                FOOD MANAGEMENT
            ========================= */}

            <FoodManagement />

        </div>
    );
}

export default AdminDashboard;