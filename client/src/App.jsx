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
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route path="/menu" element={<Menu />} />

                <Route path="/cart" element={<Cart />} />

                <Route path="/checkout" element={<Checkout />} />

                <Route path="/my-orders" element={<MyOrders />} />

                <Route
                  path="/admin"
                  element={
                      <ProtectedRoute role="admin">
                          <AdminDashboard />
                      </ProtectedRoute>
                  }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;