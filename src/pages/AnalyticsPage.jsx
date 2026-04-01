import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    Grid,
    Card,
    CardContent,
    CircularProgress
} from "@mui/material";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { getAnalytics } from "../api/analyticsApi";
import { getUserFromToken } from "../utils/auth";

const AnalyticsPage = () => {

    const [month, setMonth] = useState("");
    const [summary, setSummary] = useState(null);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = getUserFromToken();

    const fetchData = async () => {
        if (!month) {
            setMessage("Select month");
            setError(true);
            return;
        }

        setLoading(true);

        const res = await getAnalytics(user.accountNumber, month);

        if (res.error) {
            setMessage(res.message);
            setError(true);
        } else {
            setSummary(res.data.summary);
            setCategories(res.data.categoryBreakdown || []);
            setError(false);
        }

        setLoading(false);
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>

            {/* HEADER */}
            <Typography variant="h4" gutterBottom>
                Analytics Dashboard
            </Typography>

            {/* FILTER */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    type="month"
                    label="Select Month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    fullWidth
                />

                <Button
                    variant="contained"
                    onClick={fetchData}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Fetch"}
                </Button>
            </Box>

            {/* KPI CARDS */}
            {summary && (
                <Grid container spacing={2} sx={{ mb: 3 }}>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Total Debit
                                </Typography>
                                <Typography variant="h6" color="error.main">
                                    ₹{summary.totalDebit}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Total Credit
                                </Typography>
                                <Typography variant="h6" color="success.main">
                                    ₹{summary.totalCredit}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Net Flow
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color={
                                        summary.netFlow >= 0
                                            ? "success.main"
                                            : "error.main"
                                    }
                                >
                                    ₹{summary.netFlow}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Transactions
                                </Typography>
                                <Typography variant="h6">
                                    {summary.transactionCount}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            )}

            {/* CHART */}
            {categories.length > 0 && (
                <Card sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Category Spending
                    </Typography>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categories}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="amount" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            )}

            {/* EMPTY STATE */}
            {!loading && summary && categories.length === 0 && (
                <Typography sx={{ mt: 2 }}>
                    No category data available
                </Typography>
            )}

            {/* SNACKBAR */}
            <Snackbar
                open={!!message}
                autoHideDuration={3000}
                onClose={() => setMessage("")}
            >
                <Alert severity={error ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default AnalyticsPage;