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

import {getTransactions, sendPdfToEmail} from "../api/transactionApi";
import { getAccountNumber } from "../utils/accountHelper";

const HistoryPage = () => {

    const [accountNumber, setAccountNumber] = useState("");
    const [list, setList] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [downloading, setDownloading] = useState(false);

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

        const res = await getTransactions(accountNumber, pageNumber);
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
                return "#2e7d32";
            case "FAILED":
                return "#d32f2f";
            case "PENDING":
            case "IN_PROGRESS":
                return "#ed6c02";
            default:
                return "#000";
        }
    };

    const handleDownloadPdf = async () => {
        if (!accountNumber || !fromDate || !toDate) {
            setMessage("Please select date range");
            return;
        }
        try {
            setDownloading(true);
            await sendPdfToEmail(accountNumber, fromDate, toDate);
            setMessage("✅ PDF sent to your email successfully!");
        } catch{
            setMessage("❌ Failed to send PDF");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>

            {/* HEADER */}
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                🏦 Transaction History
            </Typography>

            {/* ACCOUNT + FETCH */}
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

            {/* FILTER SECTION */}
            <Box sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: "#f5f7fa",
                boxShadow: 1
            }}>
                <TextField
                    type="date"
                    label="From"
                    InputLabelProps={{ shrink: true }}
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    fullWidth
                />

                <TextField
                    type="date"
                    label="To"
                    InputLabelProps={{ shrink: true }}
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    fullWidth
                />

                <Button
                    variant="contained"
                    sx={{
                        background: "linear-gradient(45deg, #6a11cb, #2575fc)",
                        color: "#fff",
                        fontWeight: "bold",
                        px: 3
                    }}
                    onClick={handleDownloadPdf}
                    disabled={!accountNumber || downloading}
                >
                    {downloading ? "Downloading..." : "Generate PDF"}
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

            {/* TRANSACTION LIST */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {list.map((t) => (
                    <Grid size={12} key={t.transactionId}>
                        <Card sx={{
                            borderRadius: 3,
                            boxShadow: 3,
                            transition: "0.3s",
                            "&:hover": { transform: "scale(1.02)" }
                        }}>
                            <CardContent>

                                <Box display="flex" justifyContent="space-between">
                                    <Typography variant="h6">
                                        {t.type}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: "20px",
                                            backgroundColor:
                                                t.status === "SUCCESS"
                                                    ? "#e8f5e9"
                                                    : t.status === "FAILED"
                                                        ? "#ffebee"
                                                        : "#fff3e0",
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

                                <Typography sx={{ mt: 1, color: "#555" }}>
                                    {t.date} • {t.time}
                                </Typography>

                                <Typography
                                    sx={{
                                        mt: 1,
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        color: t.type === "DEBIT"
                                            ? "#d32f2f"
                                            : "#2e7d32"
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