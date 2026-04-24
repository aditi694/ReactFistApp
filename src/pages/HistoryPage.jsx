import { useEffect, useState, useMemo } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Grid,
    TablePagination,
    Chip,
    MenuItem,
    Popover
} from "@mui/material";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from "@mui/material";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import { getTransactions, sendPdfToEmail } from "../api/transactionApi";
import { getAccountNumber } from "../utils/accountHelper";

import { Snackbar, Alert } from "@mui/material";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

const HistoryPage = () => {

    const [accountNumber, setAccountNumber] = useState("");
    const [list, setList] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const [typeFilter, setTypeFilter] = useState("ALL");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(5);
    const [hasMore, setHasMore] = useState(false);

    const [downloading, setDownloading] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);

    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        }
    ]);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const load = async () => {
            const acc = await getAccountNumber();
            if (acc) setAccountNumber(acc);
        };
        load();
    }, []);

    const fetchHistory = async (pageNumber = 0) => {
        if (!accountNumber) return;

        setLoading(true);

        const res = await getTransactions(accountNumber, pageNumber + 1, 5);

        setLoading(false);

        if (res?.error) {
            setMessage("Failed to fetch history");
            return;
        }

        const data = res.data;

        setList(data.transactions || []);
        setHasMore(data.hasMore);
        setPage(pageNumber);
    };

    const handleDownloadPdf = async () => {
        try {
            setDownloading(true);

            await sendPdfToEmail(
                accountNumber,
                range[0].startDate.toISOString().split("T")[0],
                range[0].endDate.toISOString().split("T")[0]
            );

            setSnackbar({
                message: "PDF sent successfully",
                severity: "success"
            });

            setOpenDialog(true);

        } catch {
            setSnackbar({
                message: "Failed to send PDF",
                severity: "error"
            });

            setOpenDialog(true);
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        if (!list || list.length === 0) {
            setFiltered([]);
            return;
        }

        let temp = [...list];

        if (typeFilter !== "ALL") {
            temp = temp.filter((t) => t.type === typeFilter);
        }

        setFiltered(temp);
    }, [typeFilter, list]);

    // SUMMARY
    const summary = useMemo(() => {
        let credit = 0, debit = 0;

        list.forEach(t => {
            if (t.type === "CREDIT") credit += t.amount;
            else debit += t.amount;
        });

        return { credit, debit, total: list.length };
    }, [list]);

    const getStatusStyle = (status) => {
        if (status === "SUCCESS")
            return { bg: "#ECFDF5", color: "#059669" };
        if (status === "FAILED")
            return { bg: "#FEF2F2", color: "#DC2626" };
        return { bg: "#FFFBEB", color: "#D97706" };
    };
    return (
        <>
            <Box
                sx={{
                    width: "100%",
                    minHeight: "100vh",
                    background: "#F9FAFB",
                    p: 4
                }}
            >

                {/* HEADER */}
                <Typography variant="h3" fontWeight={800} mb={1}>
                    Transaction History
                </Typography>

                <Typography fontSize={16} color="text.secondary" mb={4}>
                    Monitor and manage your financial activity
                </Typography>

                {/* FILTER BAR */}
                <Box
                    sx={{
                        p: 3,
                        borderRadius: 4,
                        background: "#fff",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                        mb: 4
                    }}
                >
                    <Grid container spacing={2} alignItems="center">

                        <Grid item>
                            <TextField
                                size="medium"
                                label="Account"
                                value={accountNumber || ""}
                                disabled
                            />
                        </Grid>

                        <Grid item>
                            <TextField
                                select
                                size="medium"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <MenuItem value="ALL">All</MenuItem>
                                <MenuItem value="CREDIT">Credit</MenuItem>
                                <MenuItem value="DEBIT">Debit</MenuItem>
                            </TextField>
                        </Grid>

                        {/* DATE */}
                        <Grid item>
                            <Button
                                variant="outlined"
                                startIcon={<CalendarTodayIcon />}
                                sx={{ height: 42 }}
                                onClick={(e) => setAnchorEl(e.currentTarget)}
                            >
                                {range[0].startDate.toLocaleDateString()} -{" "}
                                {range[0].endDate.toLocaleDateString()}
                            </Button>

                            <Popover
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                            >
                                <DateRange
                                    ranges={range}
                                    onChange={(item) => setRange([item.selection])}
                                    months={2}
                                />
                            </Popover>
                        </Grid>

                        <Grid item>
                            <Button
                                variant="contained"
                                sx={{ height: 42, px: 3 }}
                                onClick={() => fetchHistory(0)}
                            >
                                Fetch
                            </Button>
                        </Grid>

                        <Grid item>
                            <Button
                                variant="contained"
                                sx={{
                                    height: 42,
                                    px: 3,
                                    background: "linear-gradient(135deg,#4F46E5,#7C3AED)"
                                }}
                                onClick={handleDownloadPdf}
                            >
                                {downloading ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "PDF"}
                            </Button>
                        </Grid>

                    </Grid>
                </Box>

                {/* TABLE */}
                <Paper
                    sx={{
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                    }}
                >
                    <TableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader>

                            <TableHead>
                                <TableRow sx={{ background: "#F3F4F6" }}>
                                    <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : (filtered.length ? filtered : list).map((t) => (
                                    <TableRow key={t.transactionId} hover>

                                        <TableCell>
                                            {t.type === "CREDIT"
                                                ? <ArrowDownwardIcon sx={{ color: "#059669" }} />
                                                : <ArrowUpwardIcon sx={{ color: "#DC2626" }} />}
                                        </TableCell>

                                        <TableCell>{t.description}</TableCell>
                                        <TableCell>{t.date}</TableCell>

                                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                                            ₹{t.amount}
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={t.status}
                                                size="small"
                                                sx={{
                                                    background: getStatusStyle(t.status).bg,
                                                    color: getStatusStyle(t.status).color,
                                                    fontWeight: 600
                                                }}
                                            />
                                        </TableCell>

                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 2,
                            py: 1.5,
                            borderTop: "1px solid #E5E7EB"
                        }}
                    >
                        <Typography fontSize={13}>
                            Page {page + 1} • Showing {list.length} records
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                                size="small"
                                variant="outlined"
                                disabled={page === 0}
                                onClick={() => fetchHistory(page - 1)}
                            >
                                Prev
                            </Button>

                            <Button
                                size="small"
                                variant="contained"
                                disabled={!hasMore}
                                onClick={() => fetchHistory(page + 1)}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Paper>

            </Box>

            {/* POPUP */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 3,
                        minWidth: 360,
                        textAlign: "center"
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: 22 }}>
                    {snackbar.severity === "success" ? "✅ Success" : "❌ Error"}
                </DialogTitle>

                <DialogContent>
                    <Typography fontSize={16}>
                        {snackbar.message}
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        variant="contained"
                        sx={{ px: 4 }}
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default HistoryPage;