import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    const isLoggedIn = !!token;
    const isStudent = user?.role === "student";
    const isAdmin = user?.role === "admin";

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="main-navbar">

            {/* ================= BRAND ================= */}

            <Link to="/" className="navbar-brand">

                <img
                    src="/quickgrab-logo.png"
                    alt="QuickGrab"
                    className="quickgrab-brand-icon"
                />

                <div className="brand-content">

                    <div className="brand-name">
                        QuickGrab
                    </div>

                    <div className="brand-tagline">
                        Order. Skip the Queue. Grab Your Food.
                    </div>

                </div>

            </Link>


            {/* ================= NAV LINKS ================= */}

            <div className="navbar-links">

                {/* HOME - EVERYONE */}

                <Link
                    to="/"
                    className="navbar-link"
                >
                    Home
                </Link>


                {/* STUDENT ONLY */}

                {isLoggedIn && isStudent && (
                    <>
                        <Link
                            to="/menu"
                            className="navbar-link"
                        >
                            🍽️ Menu
                        </Link>

                        <Link
                            to="/cart"
                            className="navbar-link"
                        >
                            🛒 Cart
                        </Link>

                        <Link
                            to="/my-orders"
                            className="navbar-link"
                        >
                            📋 My Orders
                        </Link>
                    </>
                )}


                {/* ADMIN ONLY */}

                {isLoggedIn && isAdmin && (
                    <Link
                        to="/admin"
                        className="navbar-link"
                    >
                        📊 Dashboard
                    </Link>
                )}

            </div>


            {/* ================= RIGHT SIDE ================= */}

            <div className="navbar-right">

                {!isLoggedIn ? (
                    <>
                        <Link
                            to="/login"
                            className="navbar-login"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="navbar-register"
                        >
                            Get Started
                        </Link>
                    </>
                ) : (
                    <>
                        <div className="user-pill">

                            <div className="user-avatar">
                                {user?.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <span>
                                {user?.name}
                            </span>

                        </div>

                        <button
                            className="navbar-logout"
                            onClick={logout}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;