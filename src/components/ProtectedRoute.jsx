import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const ProtectedRoute = ({ children, role, redirectTo }) => {
    const isAuth = isAuthenticated();

    if (!isAuth) {
        console.log("🚫 Not logged in");
        return <Navigate to={redirectTo} replace />;
    }

    const userRole = getUserRole();

    console.log(" Role Check:", {
        userRole,
        requiredRole: role
    });

    if (role && userRole !== role) {
        console.log("🚫 Role mismatch → redirecting");
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default ProtectedRoute;