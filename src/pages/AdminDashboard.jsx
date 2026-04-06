import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { getPendingBeneficiaries } from "../api/beneficiaryApi";
import { logoutUser } from "../utils/auth";

import {
    Container, Typography, Box, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Paper, Chip, IconButton,
    Avatar, TextField, InputAdornment, Collapse, Grid, Button,
    Badge, Card
} from "@mui/material";

import {
    Search, KeyboardArrowDown, KeyboardArrowUp,
    CheckCircle, Cancel, Block, Notifications
} from "@mui/icons-material";

const AdminDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [cards, setCards] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [expanded, setExpanded] = useState({});
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        const [custRes, loanRes, cardRes, benRes] = await Promise.all([
            getAllCustomers(),
            getPendingLoans(),
            getPendingCards(),
            getPendingBeneficiaries()
        ]);

        const cust      = custRes?.data || [];
        const loansData = loanRes?.data?.loans || [];
        const cardsData = cardRes?.data?.requests || [];
        const benCount  = benRes?.data?.length || 0;

        setCustomers(cust);
        setFilteredCustomers(cust);
        setLoans(loansData);
        setCards(cardsData);
        setPendingCount(loansData.length + cardsData.length + benCount);
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

    const getMeta = (c) => {
        const loan = loans.find(l => l.customerId === c.customerId);
        const card = cards.find(cd => cd.customerId === c.customerId);
        return { loan, card };
    };

    const handleUpdateKyc = async (id, status) => {
        await updateKyc(id, status);
        fetchAll();
    };

    const handleBlock = async (id, reason = "Blocked by admin") => {
        await blockCustomer(id, reason);
        fetchAll();
    };

    const handleUnblock = async (id) => {
        await unblockCustomer(id);
        fetchAll();
    };

    const handleApproveLoan = async (loanId) => {
        await approveLoan(loanId);
        fetchAll();
    };

    const handleRejectLoan = async (loanId) => {
        await rejectLoan(loanId);
        fetchAll();
    };

    const handleApproveCard = async (id) => {
        await approveCard(id);
        fetchAll();
    };

    const handleRejectCard = async (id) => {
        await rejectCard(id);
        fetchAll();
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>

            {/* HEADER */}
            <Card sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
                        <Typography color="text.secondary">Banking Control Panel</Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 2 }}>
                        <IconButton onClick={() => navigate("/admin/pending")}>
                            <Badge badgeContent={pendingCount} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => { logoutUser(); navigate("/login"); }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Box>
            </Card>

            {/* SEARCH */}
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

            {/* TABLE */}
            <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell />
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
                            const meta   = getMeta(c);

                            return (
                                <>
                                    {/* MAIN ROW */}
                                    <TableRow hover key={c.customerId}>
                                        <TableCell>
                                            <IconButton onClick={() => toggleExpand(c.customerId)}>
                                                {isOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                            </IconButton>
                                        </TableCell>

                                        <TableCell>
                                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                                <Avatar sx={{ bgcolor: "#2563EB" }}>
                                                    {c.fullName?.charAt(0)}
                                                </Avatar>
                                                {c.fullName}
                                            </Box>
                                        </TableCell>

                                        <TableCell>{c.email}</TableCell>
                                        <TableCell>{c.phone}</TableCell>

                                        <TableCell>
                                            <Chip
                                                label={c.kycStatus}
                                                color={c.kycStatus === "APPROVED" ? "success" : "warning"}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                label={c.status}
                                                color={c.status === "ACTIVE" ? "success" : "error"}
                                            />
                                        </TableCell>
                                    </TableRow>

                                    {/* EXPANDED ROW */}
                                    <TableRow key={`${c.customerId}-expanded`}>
                                        <TableCell colSpan={6} sx={{ p: 0 }}>
                                            <Collapse in={isOpen}>
                                                <Box sx={{ p: 3, bgcolor: "#F8FAFC" }}>
                                                    <Grid container spacing={2}>

                                                        {/* CREATED */}
                                                        <Grid item xs={12}>
                                                            <Typography fontSize={12} color="gray">Created At:</Typography>
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
                                                                    startIcon={<CheckCircle />}
                                                                    onClick={() => handleUpdateKyc(c.customerId, "APPROVED")}
                                                                >
                                                                    Approve KYC
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="error"
                                                                    sx={{ ml: 1 }}
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
                                                                    sx={{ ml: 1 }}
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
                                                                    sx={{ ml: 1 }}
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
                                                                    startIcon={<Block />}
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
        </Container>
    );
};

export default AdminDashboard;