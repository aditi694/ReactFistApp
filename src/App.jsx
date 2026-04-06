import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import CustomerLogin from "./pages/CustomerLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import TransferPage from "./pages/TransferPage";
import TransactionPage from "./pages/TransactionPage";
import HistoryPage from "./pages/HistoryPage";
import BeneficiaryPage from "./pages/BeneficiaryPage";
import ApplyLoan from "./pages/ApplyLoan";
import ApplyCreditCard from "./pages/ApplyCreditCard";
import ApplyInsurance from "./pages/ApplyInsurance";
import LimitPage from "./pages/LimitPage";
import AnalyticsPage from "./pages/AnalyticsPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminPending from "./pages/AdminPending.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/customer-login" element={<CustomerLogin />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute role="ADMIN" redirectTo="/login">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/customer-dashboard"
                    element={
                        <ProtectedRoute role="CUSTOMER" redirectTo="/customer-login">
                            <CustomerDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Customer Features */}
                <Route path="/transfer" element={<TransferPage />} />
                <Route path="/transactions" element={<TransactionPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/beneficiaries" element={<BeneficiaryPage />} />
                <Route path="/apply-loan" element={<ApplyLoan />} />
                <Route path="/apply-credit-card" element={<ApplyCreditCard />} />
                <Route path="/apply-insurance" element={<ApplyInsurance />} />
                <Route path="/limits" element={<LimitPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/admin/pending" element={<AdminPending />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;