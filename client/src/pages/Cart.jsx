import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
    const [cart, setCart] = useState([]);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const savedCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        setCart(savedCart);
    }, []);

    const saveCart = (updatedCart) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const updateQuantity = (index, change) => {
        const updatedCart = [...cart];

        updatedCart[index].quantity += change;

        if (updatedCart[index].quantity <= 0) {
            updatedCart.splice(index, 1);
        }

        saveCart(updatedCart);
    };

    const removeItem = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        saveCart(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
        setShowClearConfirm(false);
    };

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

    if (cart.length === 0) {
        return (
            <div className="cart-page">
                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <span className="cart-label">
                        QUICKGRAB CART
                    </span>

                    <h1>Your Cart is Empty</h1>

                    <p>
                        Looks like you haven't added
                        anything delicious yet.
                    </p>

                    <button
                        className="browse-menu-btn"
                        onClick={() => navigate("/menu")}
                    >
                        🍴 Explore Menu
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">

            {/* HEADER */}
            <div className="cart-header">
                <div>
                    <span className="cart-label">
                        QUICKGRAB CART
                    </span>

                    <h1>Your Cart</h1>

                    <p>
                        Review your items before
                        checkout.
                    </p>
                </div>

                <div className="cart-header-actions">
                    <div className="cart-item-count">
                        {totalItems}{" "}
                        {totalItems === 1
                            ? "item"
                            : "items"}
                    </div>

                    <button
                        className="clear-cart-btn"
                        type="button"
                        onClick={() =>
                            setShowClearConfirm(true)
                        }
                    >
                        🗑 Clear Cart
                    </button>
                </div>
            </div>

            {/* MAIN */}
            <div className="cart-layout">

                {/* ITEMS */}
                <div className="cart-items-section">

                    <div className="cart-section-title">
                        <div>
                            <h2>Your Items</h2>
                            <span>
                                {cart.length}{" "}
                                {cart.length === 1
                                    ? "product"
                                    : "products"}
                            </span>
                        </div>
                    </div>

                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div
                                className="cart-item"
                                key={`${item.food}-${index}`}
                            >
                                <div className="cart-food-icon">
                                    🍽️
                                </div>

                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>

                                    <p>
                                        ₹
                                        {formatPrice(
                                            item.price
                                        )}{" "}
                                        each
                                    </p>

                                    <span>
                                        QuickGrab fresh pick
                                    </span>
                                </div>

                                <div className="cart-item-controls">

                                    <div className="quantity-control">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    index,
                                                    -1
                                                )
                                            }
                                            aria-label="Decrease quantity"
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateQuantity(
                                                    index,
                                                    1
                                                )
                                            }
                                            aria-label="Increase quantity"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <strong className="item-total">
                                        ₹
                                        {formatPrice(
                                            Number(item.price) *
                                                Number(
                                                    item.quantity
                                                )
                                        )}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remove-item-btn"
                                        onClick={() =>
                                            removeItem(index)
                                        }
                                    >
                                        🗑 Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="continue-shopping"
                        onClick={() => navigate("/menu")}
                    >
                        ← Continue Shopping
                    </button>
                </div>

                {/* SUMMARY */}
                <aside className="cart-summary">

                    <div className="summary-header">
                        <span>ORDER SUMMARY</span>

                        <h2>Your Order</h2>
                    </div>

                    <div className="summary-row">
                        <span>Items</span>
                        <strong>{totalItems}</strong>
                    </div>

                    <div className="summary-row">
                        <span>Subtotal</span>
                        <strong>
                            ₹{formatPrice(total)}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Pickup</span>
                        <strong className="free-text">
                            FREE
                        </strong>
                    </div>

                    <div className="summary-divider" />

                    <div className="summary-total">
                        <span>Total</span>

                        <strong>
                            ₹{formatPrice(total)}
                        </strong>
                    </div>

                    <div className="quickgrab-benefit">
                        <div className="benefit-icon">
                            ⚡
                        </div>

                        <div>
                            <strong>
                                Skip the Queue
                            </strong>

                            <p>
                                Choose your pickup slot
                                at checkout.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="checkout-btn"
                        onClick={() =>
                            navigate("/checkout")
                        }
                        disabled={cart.length === 0}
                    >
                        Proceed to Checkout
                        <span>→</span>
                    </button>

                    <p className="secure-text">
                        🔒 Secure & easy checkout
                    </p>
                </aside>
            </div>

            {/* CLEAR CART CONFIRMATION */}
            {showClearConfirm && (
                <div
                    className="cart-modal-overlay"
                    onClick={() =>
                        setShowClearConfirm(false)
                    }
                >
                    <div
                        className="cart-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="cart-modal-icon">
                            🗑️
                        </div>

                        <h2>Clear your cart?</h2>

                        <p>
                            All items will be removed from
                            your QuickGrab cart.
                        </p>

                        <div className="cart-modal-actions">
                            <button
                                type="button"
                                className="modal-cancel-btn"
                                onClick={() =>
                                    setShowClearConfirm(
                                        false
                                    )
                                }
                            >
                                Keep Items
                            </button>

                            <button
                                type="button"
                                className="modal-clear-btn"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;