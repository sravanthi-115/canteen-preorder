import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setMessage("");

            await api.post("/auth/register", {
                name,
                email,
                password
            });

            setMessage("Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="form-container">

            <h1>Create Account</h1>

            {error && <p>{error}</p>}

            {message && <p>{message}</p>}

            <form onSubmit={handleRegister}>

                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button
                    className="primary-button"
                    type="submit"
                >
                    Create Account
                </button>

            </form>

            <p style={{ marginTop: "20px" }}>
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>
    );
}

export default Register;