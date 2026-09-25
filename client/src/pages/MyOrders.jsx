import { useEffect, useState } from "react";
import api from "../services/api";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            const response = await api.get("/orders/my-orders");
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

    const cancelOrder = async (id) => {
        try {
            await api.put(`/orders/${id}/cancel`);
            fetchOrders();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to cancel order"
            );
        }
    };

    return (
        <div className="page-container">

            <h1>My Orders</h1>

            {error && <p>{error}</p>}

            {orders.length === 0 ? (
                <p>No orders yet.</p>
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

                        {order.items.map((item) => (
                            <p key={item._id}>
                                {item.food.name} × {item.quantity}
                                {" "}— ₹
                                {item.price * item.quantity}
                            </p>
                        ))}

                        <hr style={{ margin: "15px 0" }} />

                        <p>
                            Total: ₹{order.totalAmount}
                        </p>

                        <p>
                            Pickup: {order.pickupSlot}
                        </p>

                        <p>
                            Queue Number: #{order.queueNumber}
                        </p>

                        <p>
                            Status:{" "}
                            <strong>
                                {order.status.toUpperCase()}
                            </strong>
                        </p>

                        {order.status === "placed" && (
                            <button
                                className="danger-button"
                                onClick={() =>
                                    cancelOrder(order._id)
                                }
                            >
                                Cancel Order
                            </button>
                        )}

                    </div>
                ))
            )}

        </div>
    );
}

export default MyOrders;