import { useEffect, useState } from "react";
import api from "../services/api";
import "./FoodManagement.css";

function FoodManagement() {

    const [foods, setFoods] = useState([]);
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        available: true
    });

    const [editingFood, setEditingFood] = useState(null);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    // =========================
    // FETCH FOODS
    // =========================

    const fetchFoods = async () => {

        try {

            setError("");

            const response = await api.get("/foods");

            setFoods(response.data.foods || []);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load foods"
            );

        }

    };


    useEffect(() => {
        fetchFoods();
    }, []);


    // =========================
    // FORM CHANGE
    // =========================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));

    };


    // =========================
    // RESET ADD FORM
    // =========================

    const resetForm = () => {

        setForm({
            name: "",
            description: "",
            price: "",
            category: "",
            image: "",
            available: true
        });

    };


    // =========================
    // ADD FOOD
    // =========================

    const handleAddFood = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            await api.post("/foods", {
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                category: form.category.trim(),
                image: form.image.trim(),
                available: form.available
            });

            setSuccess("Food item added successfully!");

            resetForm();

            await fetchFoods();

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to add food"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const editFood = (food) => {

        setEditingFood(food);

        setForm({
            name: food.name || "",
            description: food.description || "",
            price: food.price ?? "",
            category: food.category || "",
            image: food.image || "",
            available: food.available ?? true
        });

        setError("");
        setSuccess("");

    };


    // =========================
    // CLOSE EDIT MODAL
    // =========================

    const closeEditModal = () => {

        setEditingFood(null);

        resetForm();

        setError("");
        setSuccess("");

    };


    // =========================
    // UPDATE FOOD
    // =========================

    const handleUpdateFood = async (e) => {

        e.preventDefault();

        if (!editingFood) {
            return;
        }

        try {

            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.put(
                `/foods/${editingFood._id}`,
                {
                    name: form.name.trim(),
                    description: form.description.trim(),
                    price: Number(form.price),
                    category: form.category.trim(),
                    image: form.image.trim(),
                    available: form.available
                }
            );

            // Update the card immediately
            setFoods((previousFoods) =>
                previousFoods.map((food) =>
                    food._id === editingFood._id
                        ? response.data.food
                        : food
                )
            );

            setSuccess(
                `${form.name} updated successfully!`
            );

            setEditingFood(null);

            resetForm();

        } catch (error) {

            console.error("Update food error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update food"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // DELETE FOOD
    // =========================

    const deleteFood = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this food?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.delete(`/foods/${id}`);

            setFoods((previousFoods) =>
                previousFoods.filter(
                    (food) => food._id !== id
                )
            );

            setSuccess("Food item deleted successfully!");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to delete food"
            );

        }

    };


    // =========================
    // TOGGLE AVAILABILITY
    // =========================

    const toggleAvailability = async (food) => {

        try {

            setError("");
            setSuccess("");

            const response = await api.put(
                `/foods/${food._id}`,
                {
                    name: food.name,
                    description: food.description,
                    price: food.price,
                    category: food.category,
                    image: food.image || "",
                    available: !food.available
                }
            );

            setFoods((previousFoods) =>
                previousFoods.map((item) =>
                    item._id === food._id
                        ? response.data.food
                        : item
                )
            );

            setSuccess(
                `${food.name} is now ${
                    !food.available
                        ? "available"
                        : "unavailable"
                }.`
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to update availability"
            );

        }

    };


    // =========================
    // CLOSE MODAL ON BACKDROP
    // =========================

    const handleModalClick = (e) => {

        if (e.target === e.currentTarget) {
            closeEditModal();
        }

    };


    return (
        <section className="food-management">

            {/* =========================
                HEADER
            ========================= */}

            <div className="food-management-header">

                <div>

                    <span className="food-management-label">
                        MENU CONTROL
                    </span>

                    <h2>
                        Food Management 🍴
                    </h2>

                    <p>
                        Add, update and manage your canteen menu.
                    </p>

                </div>

                <div className="food-count">
                    {foods.length} items
                </div>

            </div>


            {/* =========================
                MESSAGES
            ========================= */}

            {error && (
                <div className="food-message food-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="food-message food-success">
                    {success}
                </div>
            )}


            {/* =========================
                ADD FOOD FORM
            ========================= */}

            <div className="food-form-card">

                <div className="food-form-title">

                    <div className="food-form-icon">
                        ➕
                    </div>

                    <div>

                        <h3>
                            Add New Food
                        </h3>

                        <p>
                            Add a new item to your menu.
                        </p>

                    </div>

                </div>


                <form
                    className="food-form"
                    onSubmit={handleAddFood}
                >

                    <div className="form-row">

                        <div className="form-field">

                            <label>
                                Food Name
                            </label>

                            <input
                                name="name"
                                placeholder="e.g. Veg Burger"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Category
                            </label>

                            <input
                                name="category"
                                placeholder="e.g. Burgers"
                                value={form.category}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    <div className="form-field">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            placeholder="Describe the food item..."
                            value={form.description}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <div className="form-row">

                        <div className="form-field">

                            <label>
                                Price
                            </label>

                            <div className="price-input">

                                <span>₹</span>

                                <input
                                    name="price"
                                    type="number"
                                    placeholder="60"
                                    value={form.price}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-field">

                            <label>
                                Image URL
                            </label>

                            <input
                                name="image"
                                placeholder="https://..."
                                value={form.image}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    <label className="availability-toggle">

                        <input
                            type="checkbox"
                            name="available"
                            checked={form.available}
                            onChange={handleChange}
                        />

                        <span className="toggle-ui"></span>

                        <span>

                            <strong>
                                Available for ordering
                            </strong>

                            <small>
                                Students can see and order this item.
                            </small>

                        </span>

                    </label>


                    <div className="food-form-actions">

                        <button
                            className="save-food-btn"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Adding..."
                                : "＋ Add Food"}
                        </button>

                    </div>

                </form>

            </div>


            {/* =========================
                CURRENT MENU
            ========================= */}

            <div className="current-menu">

                <div className="current-menu-header">

                    <div>

                        <h3>
                            Current Menu
                        </h3>

                        <p>
                            Manage your available food items.
                        </p>

                    </div>

                </div>


                {foods.length === 0 ? (

                    <div className="empty-foods">

                        <div className="empty-food-icon">
                            🍽️
                        </div>

                        <h3>
                            No food items yet
                        </h3>

                        <p>
                            Add your first food item above.
                        </p>

                    </div>

                ) : (

                    <div className="food-admin-grid">

                        {foods.map((food) => (

                            <div
                                className="food-admin-card"
                                key={food._id}
                            >

                                {/* IMAGE */}

                                <div className="food-admin-image">

                                    {food.image ? (

                                        <img
                                            src={food.image}
                                            alt={food.name}
                                        />

                                    ) : (

                                        <span>
                                            🍽️
                                        </span>

                                    )}


                                    <span
                                        className={
                                            food.available
                                                ? "food-available"
                                                : "food-unavailable"
                                        }
                                    >
                                        {food.available
                                            ? "Available"
                                            : "Unavailable"}
                                    </span>

                                </div>


                                {/* CONTENT */}

                                <div className="food-admin-content">

                                    <span className="food-admin-category">
                                        {food.category}
                                    </span>

                                    <h4>
                                        {food.name}
                                    </h4>

                                    <p>
                                        {food.description}
                                    </p>

                                    <strong className="food-admin-price">
                                        ₹{food.price}
                                    </strong>


                                    {/* ACTIONS */}

                                    <div className="food-admin-actions">

                                        <button
                                            type="button"
                                            className="edit-food-btn"
                                            onClick={() =>
                                                editFood(food)
                                            }
                                        >
                                            ✏️ Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="toggle-food-btn"
                                            onClick={() =>
                                                toggleAvailability(food)
                                            }
                                        >
                                            {food.available
                                                ? "Disable"
                                                : "Enable"}
                                        </button>


                                        <button
                                            type="button"
                                            className="delete-food-btn"
                                            onClick={() =>
                                                deleteFood(food._id)
                                            }
                                        >
                                            🗑
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* =========================
                EDIT MODAL
            ========================= */}

            {editingFood && (

                <div
                    className="edit-modal-overlay"
                    onClick={handleModalClick}
                >

                    <div className="edit-modal">

                        {/* MODAL HEADER */}

                        <div className="edit-modal-header">

                            <div>

                                <span className="edit-modal-label">
                                    QUICKGRAB • MENU CONTROL
                                </span>

                                <h2>
                                    Edit Food Item
                                </h2>

                                <p>
                                    Update the details of this menu item.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="close-modal-btn"
                                onClick={closeEditModal}
                            >
                                ✕
                            </button>

                        </div>


                        {/* EDIT FORM */}

                        <form
                            className="edit-food-form"
                            onSubmit={handleUpdateFood}
                        >

                            <div className="edit-form-row">

                                <div className="form-field">

                                    <label>
                                        Food Name
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Category
                                    </label>

                                    <input
                                        name="category"
                                        value={form.category}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                    required
                                />

                            </div>


                            <div className="edit-form-row">

                                <div className="form-field">

                                    <label>
                                        Price
                                    </label>

                                    <div className="price-input">

                                        <span>₹</span>

                                        <input
                                            name="price"
                                            type="number"
                                            min="0"
                                            value={form.price}
                                            onChange={handleChange}
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="form-field">

                                    <label>
                                        Image URL
                                    </label>

                                    <input
                                        name="image"
                                        value={form.image}
                                        onChange={handleChange}
                                        placeholder="https://..."
                                    />

                                </div>

                            </div>


                            {/* AVAILABILITY */}

                            <label className="availability-toggle">

                                <input
                                    type="checkbox"
                                    name="available"
                                    checked={form.available}
                                    onChange={handleChange}
                                />

                                <span className="toggle-ui"></span>

                                <span>

                                    <strong>
                                        Available for ordering
                                    </strong>

                                    <small>
                                        Students can see and order this item.
                                    </small>

                                </span>

                            </label>


                            {/* BUTTONS */}

                            <div className="edit-form-actions">

                                <button
                                    type="button"
                                    className="cancel-edit-btn"
                                    onClick={closeEditModal}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="update-food-btn"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : "✓ Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}

export default FoodManagement;