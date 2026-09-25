import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Menu.css";

function Menu() {
    const [foods, setFoods] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await api.get("/foods");

                setFoods(response.data.foods);

            } catch (error) {
                setError("Failed to load menu");
            }
        };

        fetchFoods();
    }, []);

    const addToCart = (food) => {
        const existingCart =
            JSON.parse(localStorage.getItem("cart")) || [];

        const existingItem = existingCart.find(
            (item) => item.food === food._id
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            existingCart.push({
                food: food._id,
                name: food.name,
                price: food.price,
                quantity: 1
            });
        }

        localStorage.setItem(
            "cart",
            JSON.stringify(existingCart)
        );

        navigate("/cart");
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="menu-page">

            <h1>Canteen Menu</h1>

            {error && <p>{error}</p>}

            {foods.length === 0 ? (
                <p>No food items available.</p>
            ) : (
                <div className="food-grid">

                    {foods.map((food) => (
                        <div
                            className="food-card"
                            key={food._id}
                        >

                            <h2>{food.name}</h2>

                            <p>{food.description}</p>

                            <p className="food-price">
                                ₹{food.price}
                            </p>

                            <p>
                                Category: {food.category}
                            </p>

                            <p>
                                {food.available
                                    ? "Available"
                                    : "Currently unavailable"}
                            </p>

                            <button
                                onClick={() =>
                                    addToCart(food)
                                }
                                disabled={!food.available}
                            >
                                Add to Cart
                            </button>

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default Menu;