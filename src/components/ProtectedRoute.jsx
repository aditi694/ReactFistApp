import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const ProtectedRoute = ({ children, role }) => {
    const isAuth = isAuthenticated();
    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }
    const userRole = getUserRole();
    if (role && userRole !== role) {
        if (userRole === "ADMIN") {
            return <Navigate to="/dashboard" replace />;
        }

        if (userRole === "CUSTOMER") {
            return <Navigate to="/customer-dashboard" replace />;
        }
    }
    return children;
};

export default ProtectedRoute;