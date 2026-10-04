import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";

import StudentRoute from "./components/StudentRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                {/* =========================
                    PUBLIC PAGES
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* =========================
                    STUDENT ONLY PAGES
                ========================= */}

                <Route
                    path="/menu"
                    element={
                        <StudentRoute>
                            <Menu />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <StudentRoute>
                            <Cart />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <StudentRoute>
                            <Checkout />
                        </StudentRoute>
                    }
                />

                <Route
                    path="/my-orders"
                    element={
                        <StudentRoute>
                            <MyOrders />
                        </StudentRoute>
                    }
                />


                {/* =========================
                    ADMIN ONLY PAGE
                ========================= */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;