import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import CustomerLogin from "./pages/CustomerLogin";

import AdminDashboard from "./pages/AdminDashboard";
import AdminPending from "./pages/AdminPending";

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

import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";
import { Toaster } from "react-hot-toast";
function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>

                {/* 🔹 PUBLIC ROUTES */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/customer-login" element={<CustomerLogin />} />

                {/* 🔹 CUSTOMER ROUTES WITH LAYOUT */}
                <Route
                    element={
                        <ProtectedRoute role="CUSTOMER" redirectTo="/customer-login">
                            <CustomerLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/customer-dashboard" element={<CustomerDashboard />} />
                    <Route path="/transfer" element={<TransferPage />} />
                    <Route path="/transactions" element={<TransactionPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                    <Route path="/beneficiaries" element={<BeneficiaryPage />} />
                    <Route path="/apply-loan" element={<ApplyLoan />} />
                    <Route path="/apply-credit-card" element={<ApplyCreditCard />} />
                    <Route path="/apply-insurance" element={<ApplyInsurance />} />
                    <Route path="/limits" element={<LimitPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                </Route>

                {/* ADMIN ROUTES WITH LAYOUT */}
                <Route
                    element={
                        <ProtectedRoute role="ADMIN" redirectTo="/login">
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/pending" element={<AdminPending />} />
                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default App;