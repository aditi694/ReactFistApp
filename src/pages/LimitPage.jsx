import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Paper
} from "@mui/material";

import { getLimits } from "../api/accountApi";
import { getAccountNumber } from "../utils/accountHelper";

const LimitPage = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [limits, setLimits] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            const acc = await getAccountNumber();
            if (acc) setAccountNumber(acc);
        };
        load();
    }, []);

    const fetchLimits = async () => {
        if (!accountNumber) {
            setMessage("Account not loaded yet");
            return;
        }

        setLoading(true);
        setMessage("");

        const res = await getLimits(accountNumber);

        setLoading(false);

        if (res?.error) {
            setMessage(res.message || "Failed to fetch limits");
            return;
        }

        setLimits(res.data);
    };

    const formatCurrency = (value) =>
        `₹${Number(value).toLocaleString("en-IN")}`;

    const limitData = limits
        ? [
            { label: "Daily Limit", value: limits.dailyLimit, color: "#1e3465" },
            { label: "Per Transaction", value: limits.perTransactionLimit, color: "#1e3465" },
            { label: "Monthly Limit", value: limits.monthlyLimit, color: "#1e3465" },
            { label: "ATM Limit", value: limits.atmLimit, color: "#1e3465" },
            { label: "Online Shopping", value: limits.onlineShoppingLimit, color: "#1e3465" }
        ]
        : [];

    return (
        <Box
            sx={{
                px: { xs: 2, md: 4 },
                py: 4,
                minHeight: "100vh"
            }}
        >
            {/* CENTER CONTAINER */}
            <Box sx={{ maxWidth: 1100, mx: "auto" }}>

                {/* HEADER */}
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}
                    mb={1}
                >
                    Transaction Limits
                </Typography>

                <Typography color="text.secondary" mb={3}>
                    View and manage your account transaction limits
                </Typography>

                {/* FETCH SECTION */}
                <Paper
                    sx={{
                        p: 2,
                        borderRadius: 3,
                        mb: 4,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2
                    }}
                >
                    <TextField
                        fullWidth
                        label="Account Number"
                        value={accountNumber || ""}
                        disabled
                    />

                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            minWidth: { sm: 160 },
                            height: 56,
                            borderRadius: 2
                        }}
                        onClick={fetchLimits}
                        disabled={!accountNumber || loading}
                    >
                        {loading ? <CircularProgress size={22} /> : "Fetch"}
                    </Button>
                </Paper>

                {/* ERROR */}
                {message && (
                    <Typography color="error" mb={2}>
                        {message}
                    </Typography>
                )}

                {/* LOADING */}
                {loading && (
                    <Box textAlign="center" mt={5}>
                        <CircularProgress />
                    </Box>
                )}

                {/* LIMIT CARDS */}
                {limits && !loading && (
                    <Grid container spacing={3}>
                        {limitData.map((item, i) => (
                            <Grid item xs={12} sm={6} md={4} key={i}>
                                <Card
                                    sx={{
                                        borderRadius: 4,
                                        p: 2,
                                        height: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        background: "#ffffff",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                                        transition: "0.3s",

                                        "&:hover": {
                                            transform: "translateY(-6px)",
                                            boxShadow: "0 15px 35px rgba(0,0,0,0.15)"
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Typography color="text.secondary" mb={1}>
                                            {item.label}
                                        </Typography>

                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            sx={{
                                                color: item.color,
                                                fontSize: { xs: "1.3rem", md: "1.6rem" }
                                            }}
                                        >
                                            {formatCurrency(item.value)}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* EMPTY */}
                {!loading && !limits && (
                    <Box textAlign="center" mt={5}>
                        <Typography color="text.secondary">
                            Click "Fetch" to view your limits
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default LimitPage;