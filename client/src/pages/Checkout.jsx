import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Checkout() {
    const [cart, setCart] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        setCart(savedCart);

        const fetchSlots = async () => {
            try {
                const response =
                    await api.get("/orders/pickup-slots");

                setSlots(response.data.slots);

            } catch (error) {
                setError("Failed to load pickup slots");
            }
        };

        fetchSlots();
    }, []);

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const placeOrder = async () => {
        if (!selectedSlot) {
            setError("Please select a pickup slot");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const items = cart.map((item) => ({
                food: item.food,
                quantity: item.quantity
            }));

            const response = await api.post("/orders", {
                items,
                pickupSlot: selectedSlot
            });

            localStorage.removeItem("cart");

            alert(
                `Order placed! Queue Number: ${response.data.order.queueNumber}`
            );

            navigate("/my-orders");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to place order"
            );
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div>
                <h1>Checkout</h1>
                <p>Your cart is empty.</p>

                <button onClick={() => navigate("/menu")}>
                    Go to Menu
                </button>
            </div>
        );
    }

    return (
        <div>
            <h1>Checkout</h1>

            <h2>Order Summary</h2>

            {cart.map((item) => (
                <p key={item.food}>
                    {item.name} × {item.quantity} =
                    ₹{item.price * item.quantity}
                </p>
            ))}

            <h2>Total: ₹{total}</h2>

            <h2>Select Pickup Slot</h2>

            {slots.map((slot) => (
                <div key={slot.slot}>

                    <button
                        disabled={!slot.available}
                        onClick={() =>
                            setSelectedSlot(slot.slot)
                        }
                    >
                        {slot.slot}

                        {" "}({slot.booked}/{slot.capacity})

                        {slot.available
                            ? ""
                            : " - FULL"}
                    </button>

                </div>
            ))}

            {selectedSlot && (
                <p>
                    Selected slot: <strong>{selectedSlot}</strong>
                </p>
            )}

            {error && <p>{error}</p>}

            <button
                onClick={placeOrder}
                disabled={loading}
            >
                {loading
                    ? "Placing Order..."
                    : "Place Order"}
            </button>
        </div>
    );
}

export default Checkout;