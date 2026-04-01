import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Grid
} from "@mui/material";

import { getTransactions } from "../api/transactionApi";
import { getAccountNumber } from "../utils/accountHelper";

const HistoryPage = () => {

    const [accountNumber, setAccountNumber] = useState("");
    const [list, setList] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    // ✅ AUTO LOAD ACCOUNT
    useEffect(() => {
        const load = async () => {
            const acc = await getAccountNumber();
            if (acc) setAccountNumber(acc);
        };
        load();
    }, []);

    const fetchHistory = async (pageNumber = 1) => {

        if (!accountNumber) {
            setMessage("Account not loaded yet");
            return;
        }

        setLoading(true);
        setMessage("");

        const res = await getTransactions(accountNumber);

        setLoading(false);

        if (res?.error) {
            setMessage(res.message || "Failed to fetch history");
            return;
        }

        const data = res.data;

        setList(data.transactions || []);
        setHasMore(data.hasMore);
        setPage(pageNumber);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "SUCCESS":
                return "success.main";
            case "FAILED":
                return "error.main";
            case "PENDING":
            case "IN_PROGRESS":
                return "warning.main";
            default:
                return "text.primary";
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>

            {/* HEADER */}
            <Typography variant="h4" gutterBottom>
                Transaction History
            </Typography>

            {/* ACCOUNT (AUTO) */}
            <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                    fullWidth
                    label="Account Number"
                    value={accountNumber || ""}
                    disabled
                />

                <Button
                    variant="contained"
                    onClick={() => fetchHistory(1)}
                    disabled={!accountNumber || loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Fetch"}
                </Button>
            </Box>

            {/* MESSAGE */}
            {message && (
                <Typography color="error" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}

            {/* LOADING */}
            {loading && (
                <Box sx={{ mt: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* EMPTY */}
            {!loading && list.length === 0 && (
                <Typography sx={{ mt: 3 }}>
                    No transactions found
                </Typography>
            )}

            {/* LIST */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {list.map((t) => (
                    <Grid size={12} key={t.transactionId}>
                        <Card>
                            <CardContent>

                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="h6">
                                        {t.type}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color: getStatusColor(t.status),
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {t.status}
                                    </Typography>
                                </Box>

                                <Typography sx={{ mt: 1 }}>
                                    {t.description || "No description"}
                                </Typography>

                                <Typography sx={{ mt: 1 }}>
                                    {t.date} • {t.time}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontWeight: "bold",
                                        color: t.type === "DEBIT"
                                            ? "error.main"
                                            : "success.main"
                                    }}
                                >
                                    {t.amount}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1, color: "text.secondary" }}
                                >
                                    {t.statusMessage}
                                </Typography>

                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* PAGINATION */}
            {hasMore && (
                <Button
                    fullWidth
                    sx={{ mt: 3 }}
                    variant="outlined"
                    onClick={() => fetchHistory(page + 1)}
                >
                    Load More
                </Button>
            )}

        </Box>
    );
};

export default HistoryPage;