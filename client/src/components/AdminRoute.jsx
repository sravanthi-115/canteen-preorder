import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    // Not logged in
    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // Student trying to access admin page
    if (user?.role !== "admin") {
        return (
            <Navigate
                to="/menu"
                replace
            />
        );
    }

    return children;
}

export default AdminRoute;