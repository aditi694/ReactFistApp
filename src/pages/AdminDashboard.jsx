import { useEffect, useState } from "react";
import {
    getAllCustomers,
    updateKyc,
    blockCustomer,
    unblockCustomer,
    getPendingLoans,
    approveLoan,
    rejectLoan,
    getPendingCards,
    approveCard,
    rejectCard
} from "../api/adminApi";
import {
    Container, Typography, Box, Paper, Chip, IconButton,
    Avatar, TextField, InputAdornment, Collapse, Grid, Button,
    Card, CardContent, Divider,
    Table, TableContainer, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";

import {
    Search, KeyboardArrowDown, KeyboardArrowUp,
    CheckCircle, Block
} from "@mui/icons-material";

import { useTheme, useMediaQuery } from "@mui/material";

const AdminDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [cards, setCards] = useState([]);
    const [expanded, setExpanded] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));   // Changed to lg for better transition

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        const [custRes, loanRes, cardRes] = await Promise.all([
            getAllCustomers(),
            getPendingLoans(),
            getPendingCards()
        ]);

        const cust = custRes?.data || [];
        setCustomers(cust);
        setFilteredCustomers(cust);
        setLoans(loanRes?.data?.loans || []);
        setCards(cardRes?.data?.requests || []);
    };

    useEffect(() => {
        const filtered = customers.filter(c =>
            c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCustomers(filtered);
    }, [searchTerm, customers]);

    const toggleExpand = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const getMeta = (c) => ({
        loan: loans.find(l => l.customerId === c.customerId),
        card: cards.find(cd => cd.customerId === c.customerId)
    });

    // Handlers
    const handleUpdateKyc = async (id, status) => { await updateKyc(id, status); fetchAll(); };
    const handleBlock = async (id) => { await blockCustomer(id, "Blocked by admin"); fetchAll(); };
    const handleUnblock = async (id) => { await unblockCustomer(id); fetchAll(); };
    const handleApproveLoan = async (loanId) => { await approveLoan(loanId); fetchAll(); };
    const handleRejectLoan = async (loanId) => { await rejectLoan(loanId); fetchAll(); };
    const handleApproveCard = async (id) => { await approveCard(id); fetchAll(); };
    const handleRejectCard = async (id) => { await rejectCard(id); fetchAll(); };

    return (
        <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, sm: 3 } }}>

            {/* SEARCH BAR */}
            <TextField
                fullWidth
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search />
                        </InputAdornment>
                    )
                }}
            />

            {isSmallScreen ? (
                /* ==================== CARD VIEW (Mobile + Tablet) ==================== */
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {filteredCustomers.map((c) => {
                        const isOpen = expanded[c.customerId];

                        return (
                            <Card key={c.customerId} sx={{ borderRadius: 3, boxShadow: 3 }}>
                                <CardContent>
                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Avatar sx={{ bgcolor: "#2563EB" }}>
                                                {c.fullName?.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight={600}>{c.fullName}</Typography>
                                                <Typography variant="body2" color="text.secondary">{c.email}</Typography>
                                            </Box>
                                        </Box>
                                        <IconButton onClick={() => toggleExpand(c.customerId)}>
                                            {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    </Box>

                                    <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        <Chip label={c.kycStatus} color={c.kycStatus === "APPROVED" ? "success" : "warning"} size="small" />
                                        <Chip label={c.status} color={c.status === "ACTIVE" ? "success" : "error"} size="small" />
                                        <Chip label={c.phone} variant="outlined" size="small" />
                                    </Box>
                                </CardContent>

                                <Collapse in={isOpen}>
                                    <Divider />
                                    <Box sx={{ p: 3, bgcolor: "#F8FAFC" }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography fontSize={13} color="gray">Created At</Typography>
                                                <Typography fontWeight={500}>
                                                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                                                </Typography>
                                            </Grid>

                                            {/* Action Buttons - Full Width on small screens */}
                                            <Grid item xs={12} sx={{ mt: 1 }}>
                                                <Grid container spacing={1.5}>
                                                    {c.kycStatus === "PENDING" && (
                                                        <>
                                                            <Grid item xs={6}>
                                                                <Button fullWidth variant="contained" color="success" startIcon={<CheckCircle />} onClick={() => handleUpdateKyc(c.customerId, "APPROVED")}>
                                                                    Approve KYC
                                                                </Button>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <Button fullWidth variant="outlined" color="error" onClick={() => handleUpdateKyc(c.customerId, "REJECTED")}>
                                                                    Reject KYC
                                                                </Button>
                                                            </Grid>
                                                        </>
                                                    )}
                                                    {/* Similar for Loan and Card - you can keep adding */}
                                                    <Grid item xs={12}>
                                                        {c.status === "ACTIVE" ? (
                                                            <Button fullWidth variant="outlined" color="warning" startIcon={<Block />} onClick={() => handleBlock(c.customerId)}>
                                                                Block Customer
                                                            </Button>
                                                        ) : (
                                                            <Button fullWidth variant="contained" onClick={() => handleUnblock(c.customerId)}>
                                                                Unblock Customer
                                                            </Button>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Collapse>
                            </Card>
                        );
                    })}
                </Box>
            ) : (
                /* ==================== FULL DESKTOP TABLE ==================== */
                <TableContainer component={Paper} sx={{ borderRadius: 3, overflowX: "auto" }}>
                    <Table sx={{ minWidth: 950 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: 60 }} />
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>KYC</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCustomers.map((c) => {
                                const isOpen = expanded[c.customerId];
                                const meta = getMeta(c);

                                return (
                                    <>
                                        <TableRow hover key={c.customerId}>
                                            <TableCell>
                                                <IconButton onClick={() => toggleExpand(c.customerId)}>
                                                    {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                                    <Avatar sx={{ bgcolor: "#2563EB" }}>{c.fullName?.charAt(0)}</Avatar>
                                                    {c.fullName}
                                                </Box>
                                            </TableCell>
                                            <TableCell>{c.email}</TableCell>
                                            <TableCell>{c.phone}</TableCell>
                                            <TableCell>
                                                <Chip label={c.kycStatus} color={c.kycStatus === "APPROVED" ? "success" : "warning"} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={c.status} color={c.status === "ACTIVE" ? "success" : "error"} size="small" />
                                            </TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell colSpan={6} sx={{ p: 0 }}>
                                                <Collapse in={isOpen}>
                                                    <Box sx={{ p: 3, bgcolor: "#F8FAFC" }}>
                                                        <Grid container spacing={2}>

                                                            {/* CREATED */}
                                                            <Grid item xs={12}>
                                                                <Typography fontSize={12} color="gray">Created
                                                                    At:</Typography>
                                                                <Typography fontWeight={600}>
                                                                    {new Date(c.createdAt).toLocaleDateString("en-IN")}
                                                                </Typography>
                                                            </Grid>

                                                            {/* KYC */}
                                                            {c.kycStatus === "PENDING" && (
                                                                <Grid item>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        startIcon={<CheckCircle/>}
                                                                        onClick={() => handleUpdateKyc(c.customerId, "APPROVED")}
                                                                    >
                                                                        Approve KYC
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="error"
                                                                        sx={{ml: 1}}
                                                                        onClick={() => handleUpdateKyc(c.customerId, "REJECTED")}
                                                                    >
                                                                        Reject KYC
                                                                    </Button>
                                                                </Grid>
                                                            )}

                                                            {/* LOAN */}
                                                            {meta.loan && (
                                                                <Grid item>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        onClick={() => handleApproveLoan(meta.loan.loanId)}
                                                                    >
                                                                        Approve Loan
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="error"
                                                                        sx={{ml: 1}}
                                                                        onClick={() => handleRejectLoan(meta.loan.loanId)}
                                                                    >
                                                                        Reject Loan
                                                                    </Button>
                                                                </Grid>
                                                            )}

                                                            {/* CARD */}
                                                            {meta.card && (
                                                                <Grid item>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        onClick={() => handleApproveCard(meta.card.id)}
                                                                    >
                                                                        Approve Card
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="error"
                                                                        sx={{ml: 1}}
                                                                        onClick={() => handleRejectCard(meta.card.id)}
                                                                    >
                                                                        Reject Card
                                                                    </Button>
                                                                </Grid>
                                                            )}

                                                            {/* BLOCK / UNBLOCK */}
                                                            <Grid item>
                                                                {c.status === "ACTIVE" ? (
                                                                    <Button
                                                                        variant="outlined"
                                                                        color="warning"
                                                                        startIcon={<Block/>}
                                                                        onClick={() => handleBlock(c.customerId)}
                                                                    >
                                                                        Block Customer
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="contained"
                                                                        onClick={() => handleUnblock(c.customerId)}
                                                                    >
                                                                        Unblock
                                                                    </Button>
                                                                )}
                                                            </Grid>

                                                        </Grid>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AdminDashboard;