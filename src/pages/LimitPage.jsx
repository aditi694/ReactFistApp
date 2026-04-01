import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress
} from "@mui/material";

import { getLimits } from "../api/limitApi";
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

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>

            {/* HEADER */}
            <Typography variant="h4" gutterBottom>
                Transaction Limits
            </Typography>

            {/* ACCOUNT (AUTO FILLED) */}
            <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                    fullWidth
                    label="Account Number"
                    value={accountNumber || ""}
                    disabled
                />

                <Button
                    variant="contained"
                    onClick={fetchLimits}
                    disabled={!accountNumber || loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Fetch"}
                </Button>
            </Box>

            {/* ERROR */}
            {message && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}

            {/* LIMIT CARDS */}
            {limits && (
                <Grid container spacing={2} sx={{ mt: 3 }}>

                    <Grid size={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Daily Limit
                                </Typography>
                                <Typography variant="h6">
                                    {formatCurrency(limits.dailyLimit)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Per Transaction Limit
                                </Typography>
                                <Typography variant="h6">
                                    {formatCurrency(limits.perTransactionLimit)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Monthly Limit
                                </Typography>
                                <Typography variant="h6">
                                    {formatCurrency(limits.monthlyLimit)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={12} sm={6}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    ATM Limit
                                </Typography>
                                <Typography variant="h6">
                                    {formatCurrency(limits.atmLimit)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={12}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary">
                                    Online Shopping Limit
                                </Typography>
                                <Typography variant="h6">
                                    {formatCurrency(limits.onlineShoppingLimit)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            )}

            {/* EMPTY STATE */}
            {!loading && limits === null && (
                <Typography sx={{ mt: 3 }}>
                    Click "Fetch" to view your limits
                </Typography>
            )}

        </Box>
    );
};

export default LimitPage;