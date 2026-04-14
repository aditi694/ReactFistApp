import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Grid, TablePagination
} from "@mui/material";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";
import {getTransactions, sendPdfToEmail} from "../api/transactionApi";
import { getAccountNumber } from "../utils/accountHelper";

const HistoryPage = () => {

    const [accountNumber, setAccountNumber] = useState("");
    const [list, setList] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0); // MUI starts from 0
    const [rowsPerPage, setRowsPerPage] = useState(5);
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

    const fetchHistory = async (pageNumber = 0) => {
        if (!accountNumber) {
            setMessage("Account not loaded yet");
            return;
        }

        setLoading(true);
        setMessage("");
        const res = await getTransactions(accountNumber, pageNumber + 1);

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

    const handleChangePage = (event, newPage) => {
        fetchHistory(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        fetchHistory(0);
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
        <Box sx={{ mx: "auto", mt: 3,p:3}}>

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
                    onClick={() => fetchHistory(0)}
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
                {list.length > 0 && (
                    <TableContainer
                        component={Paper}
                        sx={{
                            mt: 3,
                            borderRadius: 3,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
                        }}
                    >
                        <Table>

                            {/* HEADER */}
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#F9FAFB" }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>

                            {/* BODY */}
                            <TableBody>
                                {list.map((t) => (
                                    <TableRow
                                        key={t.transactionId}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "#F9FAFB"
                                            }
                                        }}
                                    >
                                        {/* TYPE */}
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            {t.type}
                                        </TableCell>

                                        {/* DESCRIPTION */}
                                        <TableCell>
                                            {t.description || "—"}
                                        </TableCell>

                                        {/* DATE */}
                                        <TableCell sx={{ color: "#6B7280" }}>
                                            {t.date} • {t.time}
                                        </TableCell>

                                        {/* AMOUNT */}
                                        <TableCell
                                            sx={{
                                                fontWeight: 700,
                                                color:
                                                    t.type === "DEBIT"
                                                        ? "#EF4444"
                                                        : "#10B981"
                                            }}
                                        >
                                            {t.type === "DEBIT" ? "-" : "+"} ₹{t.amount}
                                        </TableCell>

                                        {/* STATUS */}
                                        <TableCell>
                                            <Box
                                                sx={{
                                                    display: "inline-block",
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: "20px",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    backgroundColor:
                                                        t.status === "SUCCESS"
                                                            ? "#ECFDF5"
                                                            : t.status === "FAILED"
                                                                ? "#FEF2F2"
                                                                : "#FFF7ED",
                                                    color: getStatusColor(t.status)
                                                }}
                                            >
                                                {t.status}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                        <TablePagination
                            component="div"
                            count={(page + 1) * rowsPerPage + (hasMore ? rowsPerPage : 0)}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5]}
                            sx={{
                                borderTop: "1px solid #E5E7EB",
                                mt: 2
                            }}
                        />
                    </TableContainer>
                )}
            </Grid>

            {/*/!* PAGINATION *!/*/}
            {/*{hasMore && (*/}
            {/*    <Button*/}
            {/*        fullWidth*/}
            {/*        sx={{ mt: 3 }}*/}
            {/*        variant="outlined"*/}
            {/*        onClick={() => fetchHistory(page + 1)}*/}
            {/*    >*/}
            {/*        Load More*/}
            {/*    </Button>*/}
            {/*)}*/}

        </Box>
    );
};

export default HistoryPage;