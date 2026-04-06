import { useEffect, useState } from "react";
import { logoutUser } from "../utils/auth.js";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Box, Typography, Avatar, IconButton, Chip,
    Card, CardContent, LinearProgress, Menu, MenuItem,
    TextField, InputAdornment
} from "@mui/material";
import {
    AccountBalanceWallet, TrendingUp, SwapHoriz,
    People, History, Analytics, CreditCard, AccountBalance,
    Notifications, Search, Settings, MoreHoriz, ArrowForwardIos,
    Add, Logout, ShowChart, ArrowUpward, ArrowDownward,
    Receipt, Shield, Savings
} from "@mui/icons-material";
import { Drawer } from "@mui/material";
import { Squash as Hamburger } from "hamburger-react";
import {logout} from "../features/authSlice.jsx";
import {fetchDashboard} from "../features/accountSlice.jsx";

// ─── Donut Chart ─────────────────────────────────────────────────
const DonutChart = ({ categories }) => {
    if (!categories || categories.length === 0) {
        return (
            <Typography sx={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", py: 3 }}>
                No spending data this month
            </Typography>
        );
    }

    const total = categories.reduce((sum, c) => sum + c.amount, 0);

    const colors = {
        SHOPPING: "#7C3AED",
        FOOD: "#EA580C",
        BILL: "#0891B2",
        TRANSFER: "#2563EB",
        SALARY: "#10B981",
        ATM: "#F59E0B",
        OTHERS: "#6B7280",
    };

    const size = 180;
    const strokeWidth = 26;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let cumulative = 0;

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg width={size} height={size}>
                <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
                    {categories.map((cat, i) => {
                        const value = cat.amount;
                        const percent = value / total;
                        const dash = percent * circumference;
                        const color = colors[cat.category.toUpperCase()] || "#64748B";
                        const strokeDasharray = `${dash} ${circumference}`;
                        const strokeDashoffset = -cumulative * circumference;
                        cumulative += percent;
                        return (
                            <circle
                                key={i}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={color}
                                strokeWidth={strokeWidth}
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="butt"
                            />
                        );
                    })}
                </g>
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
                      fontSize="14" fontWeight="700" fill="#111827">
                    ₹{total}
                </text>
                <text x="50%" y="60%" textAnchor="middle" fontSize="10" fill="#9CA3AF">
                    Total
                </text>
            </svg>

            {/* Legend */}
            <Box sx={{ mt: 2, width: "100%" }}>
                {categories.map((cat, i) => {
                    const color = colors[cat.category.toUpperCase()] || "#64748B";
                    const percent = ((cat.amount / total) * 100).toFixed(1);
                    return (
                        <Box key={i} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
                                <Typography sx={{ fontSize: 12, color: "#374151" }}>{cat.category}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{percent}%</Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

// ─── Quick Action Button ─────────────────────────────────────────
const ActionBtn = ({ icon: Icon, label, color = "#2563EB", bg = "#EFF6FF", onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 0.8, cursor: "pointer", p: 1.5, borderRadius: 2, minWidth: 64,
            transition: "all 0.18s",
            "&:hover": { bgcolor: "#F8FAFC", transform: "translateY(-2px)" }
        }}
    >
        <Box sx={{ width: 46, height: 46, borderRadius: 2, bgcolor: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon sx={{ color, fontSize: 21 }} />
        </Box>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#374151", textAlign: "center" }}>
            {label}
        </Typography>
    </Box>
);

// ─── Transaction Row ─────────────────────────────────────────────
const TxnRow = ({ icon: Icon, iconBg, iconColor, title, sub, amount, type, time }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.4, borderBottom: "1px solid #F3F4F6", "&:last-child": { borderBottom: "none" } }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon sx={{ color: iconColor, fontSize: 17 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.2 }} noWrap>{title}</Typography>
            <Typography sx={{ fontSize: 11, color: "#9CA3AF", mt: 0.2 }}>{sub}</Typography>
        </Box>
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: type === "DEBIT" ? "#EF4444" : "#10B981" }}>
                {type === "DEBIT" ? "−" : "+"}₹{amount}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>{time}</Typography>
        </Box>
    </Box>
);

// ─── Icon picker for transaction type/category ───────────────────
const getTxnMeta = (txn) => {
    const type = txn.type?.toUpperCase();
    const cat  = (txn.category || txn.description || "").toUpperCase();
    if (type === "CREDIT")                                 return { icon: TrendingUp, iconBg: "#ECFDF5", iconColor: "#10B981" };
    if (cat.includes("LOAN") || cat.includes("EMI"))      return { icon: Savings,    iconBg: "#F5F3FF", iconColor: "#7C3AED" };
    if (cat.includes("INSURANCE"))                        return { icon: Shield,      iconBg: "#ECFEFF", iconColor: "#0891B2" };
    if (cat.includes("TRANSFER"))                         return { icon: SwapHoriz,   iconBg: "#EFF6FF", iconColor: "#2563EB" };
    if (cat.includes("BILL"))                             return { icon: Receipt,     iconBg: "#FEF3C7", iconColor: "#D97706" };
    return                                                       { icon: Receipt,     iconBg: "#EFF6FF", iconColor: "#2563EB" };
};

const kycColor = (s) => s === "APPROVED" ? "#10B981" : s === "PENDING" ? "#D97706" : "#EF4444";

// ─── MAIN DASHBOARD ──────────────────────────────────────────────
const CustomerDashboard = () => {

    // ✅ Redux — replaces all useState for data/loading/error
    const dispatch = useDispatch();
    const { data, loading: dashLoading, error: dashError } = useSelector((state) => state.account);

    const [anchorEl,   setAnchorEl]   = useState(null);
    const [menuOpen,   setMenuOpen]   = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ Plain array — NOT imported from lodash or anywhere else
    const menuItems = [
        { icon: ShowChart,  label: "Dashboard",        path: "/customer-dashboard" },
        { icon: SwapHoriz,  label: "Transactions",     path: "/transactions" },
        { icon: CreditCard, label: "Credit Cards",     path: "/apply-credit-card" },
        { icon: Receipt,    label: "Payments",         path: "/transfer" },
        { icon: History,    label: "Recent History",   path: "/history" },
        { icon: Savings,    label: "Loan Application", path: "/apply-loan" },
    ];

    const handleLogout = () => {
        dispatch(logout());
        logoutUser();
        navigate("/customer-login");
    };

    const processCategoryData = (analyticsData) => {
        if (!analyticsData?.categoryBreakdown || analyticsData.categoryBreakdown.length === 0) return [];
        return analyticsData.categoryBreakdown
            .filter(c => c?.amount > 0)
            .sort((a, b) => b.amount - a.amount);
    };

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchTerm.trim()) {
            navigate(`/search?query=${searchTerm}`);
        }
    };

    // ✅ Dispatch Redux thunk on mount — fetches dashboard + analytics + transactions
    useEffect(() => {
        dispatch(fetchDashboard());
    }, [dispatch]);

    // ─── Loading ──────────────────────────────────────────────────
    if (dashLoading || !data) return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#F8FAFC" }}>
            <Box sx={{ textAlign: "center" }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "#2563EB", mx: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AccountBalance sx={{ color: "#fff", fontSize: 24 }} />
                </Box>
                <LinearProgress sx={{ width: 200, borderRadius: 4, "& .MuiLinearProgress-bar": { bgcolor: "#2563EB" } }} />
                <Typography sx={{ fontSize: 12, color: "#9CA3AF", mt: 1.5 }}>Loading your dashboard...</Typography>
            </Box>
        </Box>
    );

    // ─── Error ────────────────────────────────────────────────────
    if (dashError) return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#F8FAFC", flexDirection: "column", gap: 2 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: "50%", bgcolor: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AccountBalance sx={{ color: "#EF4444", fontSize: 26 }} />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Failed to load dashboard</Typography>
            <Typography sx={{ fontSize: 13, color: "#6B7280" }}>Please check your connection or login again.</Typography>
            <Box onClick={() => dispatch(fetchDashboard())}
                 sx={{ cursor: "pointer", bgcolor: "#2563EB", color: "#fff", px: 3, py: 1, borderRadius: 2, fontSize: 13, fontWeight: 600 }}>
                Retry
            </Box>
        </Box>
    );

    // ✅ Read analytics + recent transactions from merged Redux state
    const analytics           = data?.analytics || null;
    const txns                = data?.recentTransactions || [];
    const processedCategories = processCategoryData(analytics);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F1F5F9" }}>

            {/* ══ MOBILE DRAWER ══════════════════════════════════════ */}
            <Drawer
                anchor="left"
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <Box sx={{ width: 220, p: 2 }}>
                    <Typography sx={{ fontWeight: "bold", mb: 2 }}>Menu</Typography>
                    {menuItems.map(({ icon: Icon, label, path }) => {
                        const isActive = location.pathname === path;
                        return (
                            <Box
                                key={label}
                                onClick={() => { navigate(path); setMenuOpen(false); }}
                                sx={{
                                    display: "flex", alignItems: "center", gap: 1.5,
                                    p: 1, borderRadius: 2, cursor: "pointer", mb: 1,
                                    bgcolor: isActive ? "#E0F2FE" : "transparent",
                                    color: isActive ? "#2563EB" : "#000",
                                    "&:hover": { bgcolor: "#F1F5F9" }
                                }}
                            >
                                <Icon sx={{ fontSize: 18 }} />
                                <Typography sx={{ fontSize: 14 }}>{label}</Typography>
                            </Box>
                        );
                    })}
                    <Typography onClick={handleLogout} sx={{ mt: 3, color: "red", cursor: "pointer" }}>
                        Logout
                    </Typography>
                </Box>
            </Drawer>

            {/* ══ SIDEBAR ════════════════════════════════════════════ */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                width: 210, bgcolor: "#fff",
                borderRight: "1px solid #E5E7EB",
                flexDirection: "column", py: 3, px: 2,
                flexShrink: 0, position: "sticky", top: 0, height: "100vh"
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1, mb: 4 }}>
                    <Box sx={{ width: 32, height: 32, bgcolor: "#2563EB", borderRadius: 1.5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <AccountBalance sx={{ color: "#fff", fontSize: 17 }} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#111827", letterSpacing: -0.3 }}>UNION BANK</Typography>
                </Box>

                {menuItems.map(({ icon: Icon, label, path }) => {
                    const active = location.pathname === path;
                    return (
                        <Box key={label} onClick={() => navigate(path)} sx={{
                            display: "flex", alignItems: "center", gap: 1.5,
                            px: 1.5, py: 1.1, borderRadius: 1.5, mb: 0.4, cursor: "pointer",
                            bgcolor: active ? "#EFF6FF" : "transparent",
                            borderLeft: `3px solid ${active ? "#2563EB" : "transparent"}`,
                            "&:hover": { bgcolor: active ? "#EFF6FF" : "#F8FAFC" },
                            transition: "all 0.15s"
                        }}>
                            <Icon sx={{ fontSize: 17, color: active ? "#2563EB" : "#6B7280" }} />
                            <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#2563EB" : "#374151" }}>
                                {label}
                            </Typography>
                        </Box>
                    );
                })}

                <Box sx={{ flex: 1 }} />
                <Box onClick={handleLogout} sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1.1, borderRadius: 1.5, cursor: "pointer", "&:hover": { bgcolor: "#FEF2F2" } }}>
                    <Logout sx={{ fontSize: 17, color: "#EF4444" }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#EF4444" }}>Logout</Typography>
                </Box>
            </Box>

            {/* ══ MAIN AREA ══════════════════════════════════════════ */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* TOP BAR */}
                <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #E5E7EB", display: "flex", alignItems: "center", px: 3, py: 1.5 }}>

                    {/* LEFT */}
                    <Box sx={{ display: "flex", alignItems: "center", width: "25%" }}>
                        <Box sx={{ display: { xs: "block", md: "none" } }}>
                            <Hamburger toggled={menuOpen} toggle={setMenuOpen} size={20} />
                        </Box>
                    </Box>

                    {/* CENTER SEARCH */}
                    <Box sx={{ width: "50%", display: "flex", justifyContent: "center" }}>
                        <TextField
                            fullWidth
                            placeholder="Search payment, transfer, transaction..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            size="small"
                            sx={{ maxWidth: 400, bgcolor: "#F8FAFC", borderRadius: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ fontSize: 18 }} />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    {/* RIGHT */}
                    <Box sx={{ width: "25%", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1.5 }}>
                        <IconButton size="small" sx={{ bgcolor: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                            <Notifications sx={{ fontSize: 18, color: "#374151" }} />
                        </IconButton>
                        <Box
                            sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer" }}
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        >
                            <Avatar sx={{ width: 33, height: 33, bgcolor: "#2563EB", fontSize: 13, fontWeight: 700 }}>
                                {data?.customerName?.charAt(0)}
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{data?.customerName}</Typography>
                                <Typography sx={{ fontSize: 11, color: "#6B7280" }}>
                                    {data?.accountType?.split(" ")[0] || "SAVINGS"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                        <MenuItem onClick={handleLogout} sx={{ fontSize: 13, color: "#EF4444" }}>
                            <Logout sx={{ fontSize: 15, mr: 1 }} /> Logout
                        </MenuItem>
                    </Menu>
                </Box>

                {/* PAGE CONTENT */}
                <Box sx={{ flex: 1, overflow: "auto", p: 2.5 }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr", lg: "1fr 320px" }, gap: 2.5, maxWidth: 1280, mx: "auto" }}>

                        {/* ════ LEFT COLUMN ════════════════════════════════ */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                            {/* ACCOUNT OVERVIEW */}
                            <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB" }}>
                                <CardContent sx={{ p: 0 }}>
                                    <Box sx={{ display: { xs: "block", md: "flex" } }}>

                                        {/* Balance + Chart */}
                                        <Box sx={{ flex: 1, p: 2.5, borderRight: "1px solid #F3F4F6" }}>
                                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Accounts</Typography>
                                                    <Chip
                                                        label={data?.accountType?.toUpperCase().split(" ")[0] || "SAVINGS"}
                                                        size="small"
                                                        sx={{ fontSize: 10, height: 19, bgcolor: "#EFF6FF", color: "#2563EB", fontWeight: 700 }}
                                                    />
                                                </Box>
                                                <IconButton size="small"><MoreHoriz sx={{ fontSize: 17, color: "#9CA3AF" }} /></IconButton>
                                            </Box>

                                            <Typography sx={{ fontFamily: "monospace", fontSize: 30, fontWeight: 800, color: "#111827", letterSpacing: -1 }}>
                                                ₹{data?.balance}
                                            </Typography>
                                            <Typography sx={{ fontSize: 12, color: "#6B7280", mt: 0.5, mb: 2.5 }}>
                                                Account: {data?.accountNumber}
                                            </Typography>

                                            {analytics?.categoryBreakdown?.length > 0 ? (
                                                <Box>
                                                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", mb: 1, textTransform: "uppercase", letterSpacing: 0.4 }}>
                                                        Category Spending — This Month
                                                    </Typography>
                                                    {processedCategories.length > 0 ? (
                                                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                            <DonutChart categories={processedCategories} />
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 2, p: 2, textAlign: "center" }}>
                                                            <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>No spending data this month yet</Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Box sx={{ bgcolor: "#F8FAFC", borderRadius: 2, p: 2, textAlign: "center" }}>
                                                    <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>No spending data this month yet</Typography>
                                                    <Typography onClick={() => navigate("/analytics")} sx={{ fontSize: 12, color: "#2563EB", fontWeight: 600, cursor: "pointer", mt: 0.5 }}>
                                                        View Analytics →
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Box sx={{ mt: 1.5, textAlign: "right" }}>
                                                <Typography onClick={() => navigate("/analytics")} sx={{ fontSize: 12, color: "#2563EB", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 0.3 }}>
                                                    More Details <ArrowForwardIos sx={{ fontSize: 10 }} />
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Overview KPIs */}
                                        <Box sx={{ width: 190, p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                                            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Overview</Typography>

                                            {analytics?.summary ? (
                                                <>
                                                    {[
                                                        { label: "Total Debit",  value: `₹${analytics.summary.totalDebit}`,  icon: ArrowDownward, color: "#EF4444", bg: "#FEF2F2" },
                                                        { label: "Total Credit", value: `₹${analytics.summary.totalCredit}`, icon: ArrowUpward,   color: "#10B981", bg: "#ECFDF5" },
                                                        { label: "Net Flow",     value: `₹${analytics.summary.netFlow}`,     icon: SwapHoriz,     color: analytics.summary.netFlow >= 0 ? "#10B981" : "#EF4444", bg: "#EFF6FF" },
                                                        { label: "Transactions", value: analytics.summary.transactionCount,  icon: Receipt,       color: "#7C3AED", bg: "#F5F3FF" },
                                                    ].map(({ label, value, icon: Icon, color, bg }) => (
                                                        <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                            <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                                <Icon sx={{ fontSize: 14, color }} />
                                                            </Box>
                                                            <Box>
                                                                <Typography sx={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>{label}</Typography>
                                                                <Typography sx={{ fontSize: 12, fontWeight: 700, color }}>{value}</Typography>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </>
                                            ) : (
                                                <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>No analytics yet this month</Typography>
                                            )}

                                            {/* KYC */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Shield sx={{ fontSize: 14, color: "#10B981" }} />
                                                </Box>
                                                <Box>
                                                    <Typography sx={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>KYC Status</Typography>
                                                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: kycColor(data?.kyc?.status) }}>
                                                        {data?.kyc?.status}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Debit Card */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Box sx={{ width: 30, height: 30, borderRadius: 1.5, bgcolor: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <CreditCard sx={{ fontSize: 14, color: "#7C3AED" }} />
                                                </Box>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography sx={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3 }}>Debit Card</Typography>
                                                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#111827" }} noWrap>
                                                        {data?.debitCard?.cardNumber}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* QUICK ACTIONS */}
                            <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB" }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827", mb: 2 }}>Quick Actions</Typography>
                                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                                        <ActionBtn icon={SwapHoriz}            label="Transfer"      color="#2563EB" bg="#EFF6FF"  onClick={() => navigate("/transfer")} />
                                        <ActionBtn icon={AccountBalanceWallet} label="Transactions"  color="#7C3AED" bg="#F5F3FF"  onClick={() => navigate("/transactions")} />
                                        <ActionBtn icon={People}               label="Beneficiaries" color="#0891B2" bg="#ECFEFF"  onClick={() => navigate("/beneficiaries")} />
                                        <ActionBtn icon={History}              label="History"       color="#D97706" bg="#FFFBEB"  onClick={() => navigate("/history")} />
                                        <ActionBtn icon={Analytics}            label="Analytics"     color="#10B981" bg="#ECFDF5"  onClick={() => navigate("/analytics")} />
                                        <ActionBtn icon={CreditCard}           label="Credit Card"   color="#DC2626" bg="#FEF2F2"  onClick={() => navigate("/apply-credit-card")} />
                                        <ActionBtn icon={Savings}              label="Apply Loan"    color="#7C3AED" bg="#F5F3FF"  onClick={() => navigate("/apply-loan")} />
                                        <ActionBtn icon={Settings}             label="Limits"        color="#2563EB" bg="#EFF6FF"  onClick={() => navigate("/limits")} />
                                        <ActionBtn icon={Shield}               label="Insurance"     color="#0891B2" bg="#ECFEFF"  onClick={() => navigate("/apply-insurance")} />
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* TRANSACTION HISTORY */}
                            <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB" }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Transaction History</Typography>
                                        <Typography onClick={() => navigate("/history")} sx={{ fontSize: 12, color: "#2563EB", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 0.3 }}>
                                            View All <ArrowForwardIos sx={{ fontSize: 10 }} />
                                        </Typography>
                                    </Box>

                                    {Array.isArray(txns) && txns.length > 0 ? (
                                        txns.map((t, i) => {
                                            const meta = getTxnMeta(t);
                                            return (
                                                <TxnRow
                                                    key={t.transactionId || i}
                                                    icon={meta.icon}
                                                    iconBg={meta.iconBg}
                                                    iconColor={meta.iconColor}
                                                    title={t.description || t.category || t.type || "Transaction"}
                                                    sub={t.category || (t.type === "DEBIT" ? "Debit" : "Credit")}
                                                    amount={t.amount}
                                                    type={t.type?.toUpperCase()}
                                                    time={t.date ? `${t.date}${t.time ? "  " + t.time : ""}` : "—"}
                                                />
                                            );
                                        })
                                    ) : (
                                        <Box sx={{ py: 3, textAlign: "center" }}>
                                            <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>No recent transactions</Typography>
                                            <Typography onClick={() => navigate("/transactions")} sx={{ fontSize: 12, color: "#2563EB", fontWeight: 600, cursor: "pointer", mt: 0.5 }}>
                                                Make your first transaction →
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                        </Box>

                        {/* ════ RIGHT COLUMN ═══════════════════════════════ */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                            {/* CREDIT CARD */}
                            <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB" }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Credit Card</Typography>
                                        <IconButton size="small"><MoreHoriz sx={{ fontSize: 17, color: "#9CA3AF" }} /></IconButton>
                                    </Box>

                                    {data.creditCard?.status === "ACTIVE" ? (
                                        <>
                                            <Box sx={{
                                                borderRadius: 2.5, p: 2.5, mb: 2,
                                                background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 55%, #3B82F6 100%)",
                                                color: "#fff", position: "relative", overflow: "hidden"
                                            }}>
                                                <Box sx={{ position: "absolute", top: -20, right: -20, width: 90, height: 90, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.08)" }} />
                                                <Box sx={{ position: "absolute", bottom: -10, left: 50, width: 70, height: 70, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.06)" }} />
                                                <Typography sx={{ fontSize: 11, opacity: 0.7, mb: 1.5, letterSpacing: 1 }}>PAYABLE BALANCE</Typography>
                                                <Typography sx={{ fontFamily: "monospace", fontSize: 22, fontWeight: 800, mb: 2 }}>
                                                    ₹{data?.creditCard?.availableCredit}
                                                </Typography>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                                    <Box>
                                                        <Typography sx={{ fontSize: 12, fontWeight: 600, opacity: 0.9 }}>{data?.customerName}</Typography>
                                                        <Typography sx={{ fontSize: 11, opacity: 0.65, fontFamily: "monospace" }}>{data?.creditCard?.cardNumber}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex" }}>
                                                        <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "#EF4444", opacity: 0.9 }} />
                                                        <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "#F97316", ml: -1.2, opacity: 0.9 }} />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            {[
                                                { label: "Available Credit",    value: data.creditCard.availableCredit    != null ? `₹${data.creditCard.availableCredit}`    : null },
                                                { label: "Credit Limit",        value: data.creditCard.creditLimit        != null ? `₹${data.creditCard.creditLimit}`        : null },
                                                { label: "Outstanding Balance", value: data.creditCard.outstandingBalance != null ? `₹${data.creditCard.outstandingBalance}` : null },
                                                { label: "Due Date",            value: data.creditCard.dueDate || null },
                                            ].filter(r => r.value !== null).map(({ label, value }) => (
                                                <Box key={label} sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F3F4F6" }}>
                                                    <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{label}</Typography>
                                                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{value}</Typography>
                                                </Box>
                                            ))}
                                        </>
                                    ) : (
                                        <Box sx={{ textAlign: "center", py: 2 }}>
                                            <CreditCard sx={{ fontSize: 38, color: "#E5E7EB", mb: 1 }} />
                                            <Typography sx={{ fontSize: 13, color: "#6B7280", mb: 1.5 }}>
                                                {data.creditCard?.message ||
                                                    (data.creditCard?.status === "PENDING_APPROVAL" ? "Application under review" :
                                                        data.creditCard?.status === "REJECTED" ? "Application rejected" :
                                                            "No credit card applied")}
                                            </Typography>
                                            {data.creditCard?.status === "PENDING_APPROVAL" && (
                                                <Chip label="Under Review" size="small" sx={{ bgcolor: "#FFFBEB", color: "#D97706", fontWeight: 600 }} />
                                            )}
                                            {(data.creditCard?.status === "NOT_APPLIED" || !data.creditCard?.status) && (
                                                <Box onClick={() => navigate("/apply-credit-card")} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, cursor: "pointer", bgcolor: "#2563EB", color: "#fff", borderRadius: 2, px: 2, py: 0.8, fontSize: 13, fontWeight: 600 }}>
                                                    <Add sx={{ fontSize: 15 }} /> Apply Now
                                                </Box>
                                            )}
                                            {data.creditCard?.status === "REJECTED" && (
                                                <Box onClick={() => navigate("/apply-credit-card")} sx={{ display: "inline-flex", alignItems: "center", cursor: "pointer", bgcolor: "#F3F4F6", color: "#374151", borderRadius: 2, px: 2, py: 0.8, fontSize: 13, fontWeight: 600 }}>
                                                    Reapply
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                            {/* QUICK ACCESS */}
                            <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB" }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Quick Access</Typography>
                                        <IconButton size="small"><MoreHoriz sx={{ fontSize: 17, color: "#9CA3AF" }} /></IconButton>
                                    </Box>

                                    {data.bankBranch && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.4, borderBottom: "1px solid #F3F4F6" }}>
                                            <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <AccountBalance sx={{ fontSize: 17, color: "#2563EB" }} />
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }} noWrap>{data?.bankBranch?.bankName}</Typography>
                                                <Typography sx={{ fontSize: 11, color: "#6B7280" }} noWrap>{data?.bankBranch?.branchName} • {data?.bankBranch?.city}</Typography>
                                                {data?.debitCard?.dailyLimit && (
                                                    <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>Limit: ₹{data?.debitCard?.dailyLimit} / day</Typography>
                                                )}
                                            </Box>
                                            <Box onClick={() => navigate("/transfer")} sx={{ display: "flex", alignItems: "center", gap: 0.2, cursor: "pointer", color: "#2563EB", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                                                Transfer <ArrowForwardIos sx={{ fontSize: 10 }} />
                                            </Box>
                                        </Box>
                                    )}

                                    {data.nominee?.name && (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.4, borderBottom: "1px solid #F3F4F6" }}>
                                            <Avatar sx={{ width: 38, height: 38, bgcolor: "#ECFDF5", fontSize: 13, fontWeight: 700, color: "#10B981" }}>
                                                {data.nominee.name.charAt(0)}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{data.nominee.name}</Typography>
                                                <Typography sx={{ fontSize: 11, color: "#6B7280" }}>{data.nominee.relation} • Nominee</Typography>
                                            </Box>
                                            <Chip label="Active" size="small" sx={{ fontSize: 10, height: 19, bgcolor: "#ECFDF5", color: "#10B981", fontWeight: 600 }} />
                                        </Box>
                                    )}

                                    {data.loans?.some(l => l.status === "ACTIVE") ? (
                                        data.loans.filter(l => l.status === "ACTIVE").slice(0, 1).map(loan => (
                                            <Box key={loan.loanId} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.4 }}>
                                                <Box sx={{ width: 38, height: 38, borderRadius: 2, bgcolor: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                    <Savings sx={{ fontSize: 17, color: "#7C3AED" }} />
                                                </Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{loan.loanType}</Typography>
                                                    <Typography sx={{ fontSize: 11, color: "#6B7280" }}>₹{loan.loanAmount} • EMI ₹{loan.emiAmount}</Typography>
                                                    <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>Amount: ₹{loan.emiAmount} / month</Typography>
                                                </Box>
                                                <Box onClick={() => navigate("/history")} sx={{ display: "flex", alignItems: "center", gap: 0.2, cursor: "pointer", color: "#2563EB", fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                                                    Details <ArrowForwardIos sx={{ fontSize: 10 }} />
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{ py: 1.4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <Typography sx={{ fontSize: 13, color: "#6B7280" }}>No active loans</Typography>
                                            <Box onClick={() => navigate("/apply-loan")} sx={{ cursor: "pointer", color: "#2563EB", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 0.2 }}>
                                                Apply <ArrowForwardIos sx={{ fontSize: 10 }} />
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                            {/* INSURANCE */}
                            <Card sx={{ borderRadius: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.07)", border: "1px solid #E5E7EB" }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                                        <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Insurance</Typography>
                                        <Box onClick={() => navigate("/apply-insurance")} sx={{ display: "flex", alignItems: "center", gap: 0.3, cursor: "pointer", bgcolor: "#EFF6FF", borderRadius: 1.5, px: 1.5, py: 0.4 }}>
                                            <Add sx={{ fontSize: 13, color: "#2563EB" }} />
                                            <Typography sx={{ fontSize: 11, color: "#2563EB", fontWeight: 600 }}>Add New</Typography>
                                        </Box>
                                    </Box>

                                    {data.insurances?.length > 0 ? (
                                        data.insurances.map((ins, i) => (
                                            <Box key={ins.policyNumber || i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                                                <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: "#ECFEFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <Shield sx={{ fontSize: 15, color: "#0891B2" }} />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{ins.insuranceType} Insurance</Typography>
                                                    <Typography sx={{ fontSize: 11, color: "#6B7280" }}>Coverage: ₹{ins.coverageAmount}</Typography>
                                                </Box>
                                                <Chip label="Active" size="small" sx={{ fontSize: 10, height: 18, bgcolor: "#ECFDF5", color: "#10B981", fontWeight: 600 }} />
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{ textAlign: "center", py: 1.5 }}>
                                            <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>No insurance found</Typography>
                                            <Typography onClick={() => navigate("/apply-insurance")} sx={{ fontSize: 12, color: "#2563EB", fontWeight: 600, cursor: "pointer", mt: 0.5 }}>
                                                Get Insurance →
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerDashboard;