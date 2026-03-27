import { Navigate, useNavigate } from "react-router-dom";
import { getLoggedInUser, logoutUser } from "../utils/auth";

const Dashboard = () => {
    const navigate = useNavigate();
    const user = getLoggedInUser();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };
    return (
        <div className="container">
            <h2>Welcome, {user.name}</h2>
            <p><strong>Account Number:</strong> {user.accountNumber}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;