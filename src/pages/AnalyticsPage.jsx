import { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    Divider
} from "@mui/material";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";
import { TrendingUp, TrendingDown, Receipt, CalendarMonth, BarChart as BarIcon } from "@mui/icons-material";

import { getAnalytics } from "../api/analyticsApi";
import { getUserFromToken } from "../utils/auth";

const COLORS = ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#0891B2"];

const AnalyticsPage = () => {
    const [month, setMonth] = useState("");
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const user = getUserFromToken();

    // Set current month automatically
    useEffect(() => {
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
        setMonth(currentMonth);
    }, []);

    const fetchAnalytics = async () => {
        if (!month || !user?.accountNumber) return;

        setLoading(true);
        try {
            const res = await getAnalytics(user.accountNumber, month);

            if (res.error) {
                setMessage(res.message || "Failed to load analytics");
                setError(true);
            } else {
                setSummary(res.data?.summary || null);

                const catData = [...(res.data?.categoryBreakdown || [])]
                    .filter(c => c?.amount > 0)
                    .sort((a, b) => b.amount - a.amount);

                setCategories(catData);
                setError(false);
            }
        } catch (err) {
            console.error(err);
            setMessage("Failed to fetch analytics data");
            setError(true);
        }
        setLoading(false);
    };

    // Auto fetch when month changes
    useEffect(() => {
        if (month) fetchAnalytics();
    }, [month]);

    const totalSpending = categories.reduce((sum, cat) => sum + (cat.amount || 0), 0);

    return (
        <Box sx={{ maxWidth: 1280, mx: "auto", p: 3, bgcolor: "#F8FAFC", minHeight: "100vh" }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#111827" }}>
                        <BarIcon sx={{ color: "#2563EB" }} />
                        Analytics
                    </Typography>
                    <Typography color="#6B7280" sx={{ mt: 0.5 }}>
                        Detailed spending insights • {month}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        size="small"
                        sx={{ minWidth: 180 }}
                    />
                    <Button
                        variant="contained"
                        onClick={fetchAnalytics}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalendarMonth />}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </Button>
                </Box>
            </Box>

            {loading && !summary && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                    <CircularProgress size={50} />
                </Box>
            )}

            {summary && (
                <>
                    {/* KPI Cards */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
                        {[
                            { title: "Total Debit", value: `₹${summary.totalDebit || 0}`, color: "#EF4444", icon: TrendingDown, bg: "#FEF2F2" },
                            { title: "Total Credit", value: `₹${summary.totalCredit || 0}`, color: "#10B981", icon: TrendingUp, bg: "#ECFDF5" },
                            {
                                title: "Net Flow",
                                value: `₹${summary.netFlow || 0}`,
                                color: (summary.netFlow || 0) >= 0 ? "#10B981" : "#EF4444",
                                icon: (summary.netFlow || 0) >= 0 ? TrendingUp : TrendingDown,
                                bg: "#EFF6FF"
                            },
                            { title: "Transactions", value: summary.transactionCount || 0, color: "#7C3AED", icon: Receipt, bg: "#F5F3FF" },
                        ].map((item, i) => (
                            <Card key={i} sx={{ borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Box sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            bgcolor: item.bg,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <item.icon sx={{ fontSize: 26, color: item.color }} />
                                        </Box>
                                        <Box>
                                            <Typography sx={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>{item.title}</Typography>
                                            <Typography sx={{ fontSize: 26, fontWeight: 800, color: "#111827", mt: 0.5 }}>
                                                {item.value}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>

                    {/* Charts Section */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" }, gap: 3 }}>
                        {/* Bar Chart */}
                        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Category Spending</Typography>
                                {categories.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={420}>
                                        <BarChart data={categories}>
                                            <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#6B7280" }} tickLine={false} />
                                            <YAxis tickLine={false} axisLine={false} />
                                            <Tooltip formatter={(value) => [`₹${value}`, "Amount"]} />
                                            <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                                {categories.map((_, index) => (
                                                    <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <Box sx={{ height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography color="#9CA3AF">No category spending data available</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pie Chart + Top Categories */}
                        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Spending Breakdown</Typography>

                                {categories.length > 0 ? (
                                    <>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie
                                                    data={categories}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={75}
                                                    outerRadius={115}
                                                    dataKey="amount"
                                                    nameKey="category"
                                                >
                                                    {categories.map((_, index) => (
                                                        <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => `₹${value}`} />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={50}
                                                    iconType="circle"
                                                    formatter={(value) => <span style={{ color: "#374151", fontSize: "13px" }}>{value}</span>}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>

                                        <Divider sx={{ my: 3 }} />

                                        <Typography fontWeight={600} sx={{ mb: 2 }}>Top Categories</Typography>

                                        {categories.slice(0, 5).map((cat, i) => (
                                            <Box
                                                key={i}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    py: 1.8,
                                                    borderBottom: i < 4 ? "1px solid #F3F4F6" : "none"
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                    <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: COLORS[i % COLORS.length] }} />
                                                    <Typography sx={{ fontWeight: 500 }}>{cat.category}</Typography>
                                                </Box>
                                                <Box sx={{ textAlign: "right" }}>
                                                    <Typography fontWeight={700}>₹{cat.amount}</Typography>
                                                    <Typography fontSize={12} color="#6B7280">
                                                        {totalSpending > 0 ? ((cat.amount / totalSpending) * 100).toFixed(1) : 0}%
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </>
                                ) : (
                                    <Box sx={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography color="#9CA3AF">No data to show</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </>
            )}

            {/* Notification */}
            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={error ? "error" : "success"} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AnalyticsPage;