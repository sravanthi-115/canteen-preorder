import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav>
            <div>
                <Link to="/">
                    Canteen Pre-Order
                </Link>
            </div>

            <div>
                <Link to="/">Home</Link>

                <Link to="/menu">Menu</Link>

                {token && user?.role === "student" && (
                    <>
                        <Link to="/cart">Cart</Link>
                        <Link to="/my-orders">
                            My Orders
                        </Link>
                    </>
                )}

                {token && user?.role === "admin" && (
                    <Link to="/admin">
                        Dashboard
                    </Link>
                )}

                {!token ? (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                ) : (
                    <button onClick={logout}>
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;