import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Menu.css";

function Menu() {
    const [foods, setFoods] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [favorites, setFavorites] = useState(() => {
        return JSON.parse(
            localStorage.getItem("quickgrabFavorites") || "[]"
        );
    });

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );


    /* =========================
       CHECK USER ROLE
    ========================= */

    useEffect(() => {
        if (!token) {
            navigate("/login", {
                replace: true
            });

            return;
        }

        if (user?.role !== "student") {
            navigate("/admin", {
                replace: true
            });
        }
    }, [token, user?.role, navigate]);


    /* =========================
       FETCH FOODS
    ========================= */

    useEffect(() => {
        if (!token || user?.role !== "student") {
            return;
        }

        const fetchFoods = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get("/foods");

                setFoods(response.data.foods || []);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load menu"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFoods();

    }, [token, user?.role]);


    /* =========================
       CATEGORIES
    ========================= */

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                foods
                    .map((food) => food.category)
                    .filter(Boolean)
            )
        ];

        return ["All", ...uniqueCategories];

    }, [foods]);


    /* =========================
       FILTER FOODS
    ========================= */

    const filteredFoods = useMemo(() => {

        return foods.filter((food) => {

            const searchText =
                `${food.name} ${food.description} ${food.category}`
                    .toLowerCase();

            const matchesSearch =
                searchText.includes(
                    search.toLowerCase().trim()
                );

            const matchesCategory =
                selectedCategory === "All" ||
                food.category === selectedCategory;

            return matchesSearch && matchesCategory;

        });

    }, [foods, search, selectedCategory]);


    /* =========================
       FAVORITES
    ========================= */

    const toggleFavorite = (foodId) => {

        let updatedFavorites;

        if (favorites.includes(foodId)) {

            updatedFavorites = favorites.filter(
                (id) => id !== foodId
            );

        } else {

            updatedFavorites = [
                ...favorites,
                foodId
            ];

        }

        setFavorites(updatedFavorites);

        localStorage.setItem(
            "quickgrabFavorites",
            JSON.stringify(updatedFavorites)
        );
    };


    /* =========================
       ADD TO CART
    ========================= */

    const addToCart = (food) => {

        if (user?.role !== "student") {
            return;
        }

        const existingCart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];

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


    /* =========================
       CLEAR FILTERS
    ========================= */

    const clearFilters = () => {
        setSearch("");
        setSelectedCategory("All");
    };


    /* =========================
       LOADING
    ========================= */

    if (loading) {

        return (
            <div className="menu-page">

                <div className="menu-loading">

                    <div className="menu-loading-icon">
                        🍽️
                    </div>

                    <h2>
                        Loading today's menu...
                    </h2>

                    <p>
                        Preparing something delicious for you.
                    </p>

                </div>

            </div>
        );
    }


    /* =========================
       PAGE
    ========================= */

    return (

        <div className="menu-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="menu-header">

                <div>

                    <span className="menu-label">
                        QUICKGRAB • CANTEEN MENU
                    </span>

                    <h1>
                        Today's Menu 🍴
                    </h1>

                    <p>
                        Fresh food. Quick pickup. No waiting.
                    </p>

                </div>

                <div className="menu-count">

                    <strong>
                        {foods.length}
                    </strong>

                    <span>
                        Items
                    </span>

                </div>

            </div>


            {/* =========================
                ERROR
            ========================= */}

            {error && (

                <div className="menu-error">
                    ⚠️ {error}
                </div>

            )}


            {/* =========================
                SEARCH
            ========================= */}

            {!error && foods.length > 0 && (

                <>

                    <div className="menu-search-section">

                        <div className="search-box">

                            <span className="search-icon">
                                🔎
                            </span>

                            <input
                                type="text"
                                placeholder="Search for burgers, pizza, drinks..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            {search && (

                                <button
                                    className="clear-search"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                >
                                    ×
                                </button>

                            )}

                        </div>

                    </div>


                    {/* =========================
                        CATEGORY FILTER
                    ========================= */}

                    <div className="category-section">

                        <div className="category-scroll">

                            {categories.map((category) => (

                                <button
                                    key={category}
                                    className={
                                        selectedCategory === category
                                            ? "category-filter active"
                                            : "category-filter"
                                    }
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                >
                                    {category === "All"
                                        ? "🍽️ All"
                                        : category}
                                </button>

                            ))}

                        </div>

                    </div>


                    {/* =========================
                        RESULTS INFO
                    ========================= */}

                    <div className="menu-results-bar">

                        <div>

                            <strong>
                                {filteredFoods.length}
                            </strong>

                            <span>
                                {filteredFoods.length === 1
                                    ? " food item"
                                    : " food items"}
                            </span>

                        </div>


                        {(search ||
                            selectedCategory !== "All") && (

                            <button
                                className="clear-filters-btn"
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </button>

                        )}

                    </div>

                </>

            )}


            {/* =========================
                EMPTY DATABASE
            ========================= */}

            {!error && foods.length === 0 && (

                <div className="menu-empty">

                    <div className="menu-empty-icon">
                        🍽️
                    </div>

                    <h2>
                        No food available
                    </h2>

                    <p>
                        The canteen hasn't added any
                        food items yet.
                    </p>

                </div>

            )}


            {/* =========================
                NO SEARCH RESULTS
            ========================= */}

            {!error &&
                foods.length > 0 &&
                filteredFoods.length === 0 && (

                    <div className="menu-empty">

                        <div className="menu-empty-icon">
                            🔎
                        </div>

                        <h2>
                            No food found
                        </h2>

                        <p>
                            Try another food name or category.
                        </p>

                        <button
                            className="reset-menu-btn"
                            onClick={clearFilters}
                        >
                            Show All Food
                        </button>

                    </div>

                )}


            {/* =========================
                FOOD GRID
            ========================= */}

            {!error &&
                filteredFoods.length > 0 && (

                    <div className="food-grid">

                        {filteredFoods.map((food) => (

                            <div
                                className="food-card"
                                key={food._id}
                            >

                                {/* IMAGE */}

                                <div className="food-image-wrapper">

                                    {food.image ? (

                                        <img
                                            className="food-image"
                                            src={food.image}
                                            alt={food.name}
                                        />

                                    ) : (

                                        <div className="food-image food-image-placeholder">
                                            🍽️
                                        </div>

                                    )}


                                    {/* FAVORITE */}

                                    <button
                                        type="button"
                                        className={
                                            favorites.includes(food._id)
                                                ? "favorite-btn favorite-active"
                                                : "favorite-btn"
                                        }
                                        onClick={() =>
                                            toggleFavorite(food._id)
                                        }
                                        aria-label={
                                            favorites.includes(food._id)
                                                ? "Remove from favorites"
                                                : "Add to favorites"
                                        }
                                    >
                                        {favorites.includes(food._id)
                                            ? "♥"
                                            : "♡"}
                                    </button>


                                    {/* AVAILABILITY */}

                                    <span
                                        className={
                                            food.available
                                                ? "menu-availability available-badge"
                                                : "menu-availability unavailable-badge"
                                        }
                                    >
                                        {food.available
                                            ? "Available"
                                            : "Unavailable"}
                                    </span>

                                </div>


                                {/* CONTENT */}

                                <div className="food-content">

                                    <div className="food-title-row">

                                        <h2>
                                            {food.name}
                                        </h2>

                                    </div>


                                    <p className="food-description">
                                        {food.description}
                                    </p>


                                    <div className="food-meta">

                                        <span className="food-category">
                                            {food.category}
                                        </span>

                                        <strong className="food-price">
                                            ₹{food.price}
                                        </strong>

                                    </div>


                                    <button
                                        className="add-cart-btn"
                                        onClick={() =>
                                            addToCart(food)
                                        }
                                        disabled={!food.available}
                                    >
                                        {food.available
                                            ? "🛒 Add to Cart"
                                            : "Currently Unavailable"}
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
}

export default Menu;