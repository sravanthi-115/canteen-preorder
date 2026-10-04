import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const goToMenu = () => {
        if (token) {
            navigate("/menu");
        } else {
            navigate("/login");
        }
    };

    return (
        <div className="home-page">

            {/* ================= HERO ================= */}

            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-badge">
                        🍴 QUICKGRAB • SMART CANTEEN
                    </span>

                    <h1>
                        Your Food.
                        <br />

                        <span>
                            Your Time.
                        </span>

                        <br />

                        Your Choice.
                    </h1>

                    <p>
                        Order your favorite canteen food
                        before you arrive. Choose your
                        pickup slot and skip the queue.
                    </p>


                    <div className="hero-buttons">

                        <button
                            className="hero-primary-btn"
                            onClick={goToMenu}
                        >
                            🍽️ Explore Menu
                        </button>


                        {!token && (
                            <Link
                                to="/register"
                                className="hero-secondary-btn"
                            >
                                Create Account →
                            </Link>
                        )}

                    </div>


                    {/* TRUST FEATURES */}

                    <div className="hero-trust">

                        <div>
                            <strong>⚡</strong>

                            <span>
                                Quick Ordering
                            </span>
                        </div>

                        <div>
                            <strong>🕐</strong>

                            <span>
                                Scheduled Pickup
                            </span>
                        </div>

                        <div>
                            <strong>🎫</strong>

                            <span>
                                Queue Number
                            </span>
                        </div>

                    </div>

                </div>


                {/* ================= FOOD VISUAL ================= */}

                <div className="hero-visual">

                    <div className="hero-circle"></div>


                    <div className="floating-card card-top">

                        <span>🔥</span>

                        <div>
                            <strong>
                                Fresh & Hot
                            </strong>

                            <small>
                                Made for you
                            </small>
                        </div>

                    </div>


                    <div className="food-plate">

                        <div className="plate">
                            🍔
                        </div>

                    </div>


                    <div className="floating-card card-bottom">

                        <div className="mini-avatar">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Order Ready!
                            </strong>

                            <small>
                                Pickup #24
                            </small>
                        </div>

                    </div>


                    <div className="floating-food food-one">
                        🍟
                    </div>

                    <div className="floating-food food-two">
                        🥤
                    </div>

                </div>

            </section>


            {/* ================= FEATURES ================= */}

            <section className="features-section">

                <div className="section-heading">

                    <span>
                        WHY QUICKGRAB?
                    </span>

                    <h2>
                        Order less. Wait less. Enjoy more.
                    </h2>

                    <p>
                        Everything you need for a faster
                        canteen experience.
                    </p>

                </div>


                <div className="features-grid">

                    <div className="feature-card">

                        <div className="feature-icon orange-icon">
                            📱
                        </div>

                        <h3>
                            Order Online
                        </h3>

                        <p>
                            Browse the menu and order your
                            favorite food before reaching
                            the canteen.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon yellow-icon">
                            🕐
                        </div>

                        <h3>
                            Choose Your Time
                        </h3>

                        <p>
                            Select a convenient pickup slot
                            instead of waiting in line.
                        </p>

                    </div>


                    <div className="feature-card">

                        <div className="feature-icon green-icon">
                            🎫
                        </div>

                        <h3>
                            Grab & Go
                        </h3>

                        <p>
                            Get your queue number, collect
                            your order and get back to your day.
                        </p>

                    </div>

                </div>

            </section>


            {/* ================= CTA ================= */}

            <section className="home-cta">

                <div>

                    <span>
                        QUICKGRAB
                    </span>

                    <h2>
                        Order. Skip the Queue. Grab Your Food. 🍔
                    </h2>

                    <p>
                        Spend your break enjoying your food
                        instead of standing in a queue.
                    </p>

                </div>


                <button
                    className="cta-button"
                    onClick={goToMenu}
                >
                    Order Food →
                </button>

            </section>


            {/* ================= FOOTER ================= */}

            <footer className="home-footer">

                <div className="footer-brand">
                    🍴{" "}
                    <strong>
                        QuickGrab
                    </strong>
                </div>

                <p>
                    Order. Skip the Queue. Grab Your Food.
                </p>

            </footer>

        </div>
    );
}

export default Home;