import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        setCart(savedCart);
    }, []);

    const updateQuantity = (index, change) => {
        const updatedCart = [...cart];

        updatedCart[index].quantity += change;

        if (updatedCart[index].quantity <= 0) {
            updatedCart.splice(index, 1);
        }

        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    const removeItem = (index) => {
        const updatedCart = cart.filter(
            (_, i) => i !== index
        );

        setCart(updatedCart);

        localStorage.setItem(
            "cart",
            JSON.stringify(updatedCart)
        );
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="cart-page">

            <h1>Your Cart</h1>

            {cart.length === 0 ? (
                <>
                    <p>Your cart is empty.</p>

                    <button
                        className="primary-button"
                        onClick={() => navigate("/menu")}
                    >
                        Go to Menu
                    </button>
                </>
            ) : (
                <>
                    {cart.map((item, index) => (
                        <div
                            className="cart-item"
                            key={item.food}
                        >

                            <div>
                                <h2>{item.name}</h2>
                                <p>₹{item.price} each</p>
                            </div>

                            <div className="quantity-buttons">

                                <button
                                    onClick={() =>
                                        updateQuantity(index, -1)
                                    }
                                >
                                    −
                                </button>

                                {item.quantity}

                                <button
                                    onClick={() =>
                                        updateQuantity(index, 1)
                                    }
                                >
                                    +
                                </button>

                                <button
                                    onClick={() =>
                                        removeItem(index)
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        </div>
                    ))}

                    <div className="cart-total">
                        Total: ₹{total}
                    </div>

                    <br />

                    <button
                        className="primary-button"
                        onClick={() => navigate("/checkout")}
                    >
                        Proceed to Checkout
                    </button>

                </>
            )}

        </div>
    );
}

export default Cart;