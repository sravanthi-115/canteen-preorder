import { Navigate } from "react-router-dom";

function StudentRoute({ children }) {

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

    // Admin trying to access student pages
    if (user?.role !== "student") {
        return (
            <Navigate
                to="/admin"
                replace
            />
        );
    }

    return children;
}

export default StudentRoute;