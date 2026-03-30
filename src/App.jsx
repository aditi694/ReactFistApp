import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomerLogin from "./pages/CustomerLogin";
import { isAuthenticated } from "./utils/auth";
import CustomerDashboard from "./pages/CustomerDashboard";

function App() {

    return (
        <BrowserRouter>
            <Routes>

                {/* REGISTER */}
                <Route path="/" element={<Register />} />

                {/* ADMIN LOGIN */}
                <Route path="/login" element={<Login />} />

                {/* CUSTOMER LOGIN */}
                <Route path="/customer-login" element={<CustomerLogin />} />

                {/* ADMIN DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
                    }
                />

                {/* CUSTOMER DASHBOARD */}
                <Route
                    path="/customer-dashboard"
                    element={
                        isAuthenticated()
                            ? <CustomerDashboard />
                            : <Navigate to="/customer-login" />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;