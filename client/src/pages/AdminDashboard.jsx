import { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders");

            setOrders(response.data.orders);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load orders"
            );
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(
                `/orders/${id}/status`,
                { status }
            );

            fetchOrders();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update order"
            );
        }
    };

    return (
        <div className="page-container">

            <h1>Admin Dashboard</h1>

            {error && <p>{error}</p>}

            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                orders.map((order) => (
                    <div
                        className="card"
                        style={{ marginTop: "20px" }}
                        key={order._id}
                    >

                        <h2>
                            Order #{order._id.slice(-6)}
                        </h2>

                        <p>
                            Customer: {order.user.name}
                        </p>

                        <p>
                            Pickup: {order.pickupSlot}
                        </p>

                        <p>
                            Queue: #{order.queueNumber}
                        </p>

                        {order.items.map((item) => (
                            <p key={item._id}>
                                {item.food.name} × {item.quantity}
                            </p>
                        ))}

                        <p>
                            Total: ₹{order.totalAmount}
                        </p>

                        <p>
                            Status:{" "}
                            <strong>
                                {order.status.toUpperCase()}
                            </strong>
                        </p>

                        <div style={{ marginTop: "15px" }}>

                            {order.status === "placed" && (
                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            "preparing"
                                        )
                                    }
                                >
                                    Start Preparing
                                </button>
                            )}

                            {order.status === "preparing" && (
                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            "ready"
                                        )
                                    }
                                >
                                    Mark Ready
                                </button>
                            )}

                            {order.status === "ready" && (
                                <button
                                    className="primary-button"
                                    onClick={() =>
                                        updateStatus(
                                            order._id,
                                            "completed"
                                        )
                                    }
                                >
                                    Mark Completed
                                </button>
                            )}

                        </div>

                    </div>
                ))
            )}

        </div>
    );
}

export default AdminDashboard;