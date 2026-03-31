import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CustomerLogin from "./pages/CustomerLogin";
import { isAuthenticated } from "./utils/auth";
import CustomerDashboard from "./pages/CustomerDashboard";
import ApplyLoan from "./pages/ApplyLoan";
import ApplyCreditCard from "./pages/ApplyCreditCard";
import ApplyInsurance from "./pages/ApplyInsurance";

function App() {

    return (
        <BrowserRouter>
            <Routes>

                {/* REGISTER */}
                <Route path="/" element={<Register />} />

                {/* ADMIN LOGIN */}
                <Route path="/login" element={<AdminLogin />} />

                {/* CUSTOMER LOGIN */}
                <Route path="/customer-login" element={<CustomerLogin />} />

                {/* ADMIN DASHBOARD */}
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated() ? <AdminDashboard /> : <Navigate to="/login" />
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
                <Route path="/apply-loan" element={<ApplyLoan />} />
                <Route path="/apply-credit-card" element={<ApplyCreditCard />} />
                <Route path="/apply-insurance" element={<ApplyInsurance />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;