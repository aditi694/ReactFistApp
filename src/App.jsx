import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerDashboard from "./pages/CustomerDashboard";
import ApplyLoan from "./pages/ApplyLoan";
import ApplyCreditCard from "./pages/ApplyCreditCard";
import ApplyInsurance from "./pages/ApplyInsurance";
import TransactionPage from "./pages/TransactionPage";
import BeneficiaryPage from "./pages/BeneficiaryPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import LimitPage from "./pages/LimitPage";
import HistoryPage from "./pages/HistoryPage";
import AdminBeneficiaryPage from "./pages/AdminBeneficiaryPage";
import ProtectedRoute from "./components/ProtectedRoute";
import TransferPage from "./pages/TransferPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Register />} />
                <Route path="/login" element={<AdminLogin />} />
                <Route path="/customer-login" element={<CustomerLogin />} />

                {/* ADMIN */}
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

                <Route path="/apply-loan" element={<ApplyLoan />} />
                <Route path="/apply-credit-card" element={<ApplyCreditCard />} />
                <Route path="/apply-insurance" element={<ApplyInsurance />} />

                <Route path="/transactions" element={<TransactionPage />} />
                <Route path="/transfer" element={<TransferPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/limits" element={<LimitPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/beneficiaries" element={<BeneficiaryPage />} />
                <Route path="/admin/beneficiaries" element={<AdminBeneficiaryPage />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;