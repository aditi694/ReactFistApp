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
    Legend,
    CartesianGrid
} from "recharts";
import { TrendingUp, TrendingDown, Receipt, CalendarMonth, BarChart as BarIcon } from "@mui/icons-material";

import { getAnalytics } from "../api/transactionApi";
import { getUserFromToken, getAccountNumberFromAPI } from "../utils/auth";

const COLORS = ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#0891B2"];

const AnalyticsPage = () => {
    const [month, setMonth] = useState("");
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [accountNumber, setAccountNumber] = useState(null);

    const userFromToken = getUserFromToken();

    useEffect(() => {
        const initAccount = async () => {
            let acc = userFromToken?.accountNumber;

            if (!acc) {
                console.log("Account number not in token, fetching from dashboard API...");
                acc = await getAccountNumberFromAPI(userFromToken);
            }

            if (acc) {
                setAccountNumber(acc);
                console.log("✅ Using account number:", acc);
            } else {
                setMessage("Could not retrieve account number. Please login again.");
                setError(true);
            }
        };

        initAccount();
    }, [userFromToken]);

    useEffect(() => {
        setMonth("2026-04");
    }, []);

    const fetchAnalytics = async () => {
        if (!month) {
            setMessage("Please select a month");
            setError(true);
            return;
        }

        if (!accountNumber) {
            setMessage("Account number not available. Please refresh the page.");
            setError(true);
            return;
        }

        setLoading(true);
        setMessage("");
        setError(false);

        try {
            const res = await getAnalytics(accountNumber, month);

            if (res?.error || !res?.data) {
                setMessage(res?.message || "Failed to load analytics data");
                setError(true);
                setSummary(null);
                setCategories([]);
            } else {
                const data = res.data;

                setSummary(data.summary || null);

                const catData = [...(data.categoryBreakdown || [])]
                    .filter(c => c?.amount && Number(c.amount) > 0)
                    .sort((a, b) => Number(b.amount) - Number(a.amount));

                setCategories(catData);

                if (catData.length === 0) {
                    setMessage(`No spending records found for ${month}`);
                }
            }
        } catch (err) {
            console.error("Analytics fetch error:", err);
            setMessage("Failed to fetch analytics. Please check your connection.");
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (accountNumber && month) {
            fetchAnalytics();
        }
    }, [accountNumber, month]);

    // const totalSpending = categories.reduce((sum, cat) => sum + Number(cat.amount || 0), 0);
    const totalSpending = categories.reduce(
        (sum, cat) => sum + Number(cat.amount || 0),
        0
    );
    return (
        <Box sx={{ mx: "auto", p: 3, minHeight: "100vh" }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4, flexWrap: "wrap", gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#111827" }}>
                        <BarIcon sx={{ color: "#2563EB" }} />
                        Analytics
                    </Typography>
                    <Typography color="#6B7280" sx={{ mt: 0.5 }}>
                        Detailed spending insights • {month || "Select a month"}
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
                        disabled={loading || !accountNumber}
                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalendarMonth />}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </Button>
                </Box>
            </Box>

            {/* Loading */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
                    <CircularProgress size={50} />
                </Box>
            )}

            {!loading && message && !summary && (
                <Card sx={{ borderRadius: 3, p: 6, textAlign: "center" }}>
                    <Typography color={error ? "error" : "#6B7280"} variant="h6">
                        {message}
                    </Typography>
                </Card>
            )}

            {/* Main Analytics Content */}
            {summary && (
                <>
                    {/* KPI Cards */}
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
                        {[
                            { title: "Total Debit", value: `₹${Number(summary.totalDebit || 0).toLocaleString("en-IN")}`, color: "#EF4444", icon: TrendingDown, bg: "#FEF2F2" },
                            { title: "Total Credit", value: `₹${Number(summary.totalCredit || 0).toLocaleString("en-IN")}`, color: "#10B981", icon: TrendingUp, bg: "#ECFDF5" },
                            {
                                title: "Net Flow",
                                value: `₹${Number(summary.netFlow || 0).toLocaleString("en-IN")}`,
                                color: Number(summary.netFlow || 0) >= 0 ? "#10B981" : "#EF4444",
                                icon: Number(summary.netFlow || 0) >= 0 ? TrendingUp : TrendingDown,
                                bg: "#EFF6FF"
                            },
                            { title: "Transactions", value: summary.transactionCount || 0, color: "#7C3AED", icon: Receipt, bg: "#F5F3FF" },
                        ].map((item, i) => (
                            <Card key={i} sx={{ borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 2,
                                                bgcolor: item.bg,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
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
                    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.7fr 1fr" }, gap: 3 }}>

                        {/*
                        Horizontal Bar Chart */}
                        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    Category Spending
                                </Typography>

                                {/* 🔥 Insight */}
                                <Typography sx={{ fontSize: 13, color: "#6B7280", mb: 2 }}>
                                    {categories[0] && (
                                        <>
                                            Highest: <b>{categories[0].category}</b> (₹{categories[0].amount}) •{" "}
                                            {((categories[0].amount / totalSpending) * 100).toFixed(1)}%
                                        </>
                                    )}
                                </Typography>

                                {categories.length > 0 ? (
                                    <ResponsiveContainer width="100%" height={420}>
                                        <BarChart
                                            data={categories}
                                            layout="vertical"
                                            margin={{ top: 10, right: 50, left: 40, bottom: 30 }}
                                        >
                                            {/* VALUE AXIS */}
                                            <XAxis
                                                type="number"
                                                tick={{ fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={{ stroke: "#E5E7EB" }}
                                                label={{
                                                    value: "Amount (₹)",
                                                    position: "insideBottom",
                                                    offset: -10,
                                                    style: { fontSize: 12 }
                                                }}
                                            />

                                            {/* CATEGORY AXIS */}
                                            <YAxis
                                                type="category"
                                                dataKey="category"
                                                width={110}
                                                tick={{ fontSize: 13 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />

                                            {/* GRID */}
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                horizontal={false}
                                                stroke="#E5E7EB"
                                            />

                                            {/* TOOLTIP */}
                                            <Tooltip
                                                formatter={(value) => [`₹${value}`, "Amount"]}
                                            />

                                            {/* BARS */}
                                            <Bar
                                                dataKey="amount"
                                                radius={[0, 8, 8, 0]}
                                                barSize={28}
                                                label={{
                                                    position: "right",
                                                    formatter: (value) => `₹${value}`
                                                }}
                                            >
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

                        {/*
                        Donut Chart */}
                        <Card sx={{ borderRadius: 3, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                    Spending Breakdown
                                </Typography>

                                {categories.length > 0 ? (
                                    <Box sx={{ position: "relative" }}>
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie
                                                    data={categories}
                                                    cx="50%"
                                                    cy="45%"
                                                    innerRadius="60%"
                                                    outerRadius="85%"
                                                    dataKey="amount"
                                                    nameKey="category"
                                                    paddingAngle={3}
                                                    label={({ percent }) =>
                                                        `${(percent * 100).toFixed(0)}%`
                                                    }
                                                >
                                                    {categories.map((_, index) => (
                                                        <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>

                                                <Tooltip
                                                    formatter={(value, name) => [`₹${value}`, name]}
                                                />

                                                <Legend
                                                    verticalAlign="bottom"
                                                    align="center"
                                                    iconType="circle"
                                                    formatter={(value) => value.toLowerCase()}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>

                                        {/* 🔥 CENTER TOTAL */}
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: "48%",
                                                left: "50%",
                                                transform: "translate(-50%, -50%)",
                                                textAlign: "center"
                                            }}
                                        >
                                            <Typography fontSize={12} color="#6B7280">
                                                Total
                                            </Typography>
                                            <Typography fontWeight={700} fontSize={18}>
                                                ₹{totalSpending.toLocaleString("en-IN")}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography color="#9CA3AF">No spending breakdown available</Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </>
            )}

            {/* Snackbar */}
            <Snackbar
                open={!!message}
                autoHideDuration={5000}
                onClose={() => setMessage("")}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity={error ? "error" : "info"} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AnalyticsPage;