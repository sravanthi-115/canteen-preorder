import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            setError("");

            const response = await api.post("/auth/login", {
                email,
                password
            });

            const { token, user } = response.data;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/menu");
            }

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="form-container">

            <h1>Login</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    className="primary-button"
                    type="submit"
                >
                    Login
                </button>

            </form>

            <p style={{ marginTop: "20px" }}>
                Don't have an account?{" "}
                <Link to="/register">
                    Register
                </Link>
            </p>

        </div>
    );
}

export default Login;