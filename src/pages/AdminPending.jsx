import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Card, CardContent,
    CardActions, Button, Grid, Avatar,
    Chip, Divider, CircularProgress, Alert
} from "@mui/material";

import {
    CheckCircle, Cancel,
    CreditCard, AccountBalance, People
} from "@mui/icons-material";

import {
    getPendingLoans,
    approveLoan,
    rejectLoan,
    getPendingCards,
    approveCard,
    rejectCard,
    getAllCustomers
} from "../api/adminApi";

import {
    getPendingBeneficiaries,
    approveBeneficiary,
    rejectBeneficiary
} from "../api/beneficiaryApi";

const SectionHeader = ({ title, icon: Icon, count }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Icon sx={{ color: "#2563EB" }} />
        <Typography fontWeight={700}>{title}</Typography>
        <Chip label={count} size="small" />
    </Box>
);

const AdminPending = () => {
    const [cards, setCards] = useState([]);
    const [loans, setLoans] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);

        const [cardRes, loanRes, benRes, custRes] = await Promise.all([
            getPendingCards(),
            getPendingLoans(),
            getPendingBeneficiaries(),
            getAllCustomers()
        ]);

        setCards(cardRes?.data?.requests || []);
        setLoans(loanRes?.data?.loans || []);
        setBeneficiaries(benRes?.data || []);
        setCustomers(custRes?.data || []);

        setLoading(false);
    };

    const getUser = (id) =>
        customers.find(c => c.customerId === id) || {};

    // Generic action handler
    const handleAction = async (fn, id) => {
        setActionLoading(id);
        setMessage("");

        const res = await fn(id);

        setActionLoading(null);

        if (res?.error) {
            setError(true);
            setMessage(res.message || "Action failed");
            return;
        }

        setError(false);
        setMessage("Action completed successfully");

        fetchAll();
    };

    const renderCard = (title, icon, list, renderContent) => (
        <Card sx={{ borderRadius: 3, p: 2 }}>
            <SectionHeader title={title} icon={icon} count={list.length} />

            {list.length === 0 ? (
                <Typography color="text.secondary">
                    No pending {title.toLowerCase()}
                </Typography>
            ) : (
                list.map(renderContent)
            )}
        </Card>
    );

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>

            {/* HEADER */}
            <Typography variant="h4" fontWeight={700} mb={1}>
                Pending Requests
            </Typography>
            <Typography color="text.secondary" mb={3}>
                Approval panel for all pending operations
            </Typography>

            {/* ALERT */}
            {message && (
                <Alert severity={error ? "error" : "success"} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}

            <Grid container spacing={3}>

                {/* CARD REQUESTS */}
                <Grid item xs={12}>
                    {renderCard("Card Requests", CreditCard, cards, (c) => {
                        const user = getUser(c.customerId);

                        return (
                            <Card key={c.id} sx={{ mb: 2, border: "1px solid #E5E7EB" }}>
                                <CardContent>

                                    {/* USER */}
                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Avatar sx={{ bgcolor: "#2563EB" }}>
                                            {user.fullName?.charAt(0)}
                                        </Avatar>

                                        <Box>
                                            <Typography fontWeight={600}>
                                                {user.fullName}
                                            </Typography>
                                            <Typography fontSize={13} color="text.secondary">
                                                {user.email}
                                            </Typography>
                                            <Typography fontSize={13} color="text.secondary">
                                                {user.phone}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography fontSize={13}>
                                        Card Holder Name: <b>{c.cardHolderName}</b>
                                    </Typography>

                                    <Typography fontSize={12} color="text.secondary">
                                        Request ID: {c.id}
                                    </Typography>

                                </CardContent>

                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        startIcon={<CheckCircle />}
                                        onClick={() => handleAction(approveCard, c.id)}
                                        disabled={actionLoading === c.id}
                                    >
                                        {actionLoading === c.id ? <CircularProgress size={18} /> : "Approve"}
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<Cancel />}
                                        onClick={() => handleAction(rejectCard, c.id)}
                                        disabled={actionLoading === c.id}
                                    >
                                        Reject
                                    </Button>
                                </CardActions>
                            </Card>
                        );
                    })}
                </Grid>

                {/* LOANS */}
                <Grid item xs={12}>
                    {renderCard("Loan Requests", AccountBalance, loans, (l) => {
                        const user = getUser(l.customerId);

                        return (
                            <Card key={l.loanId} sx={{ mb: 2 }}>
                                <CardContent>

                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Avatar>{user.fullName?.charAt(0)}</Avatar>

                                        <Box>
                                            <Typography fontWeight={600}>
                                                {user.fullName}
                                            </Typography>
                                            <Typography fontSize={13}>{user.email}</Typography>
                                            <Typography fontSize={13}>{user.phone}</Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography>
                                        Loan Type: <b>{l.loanType}</b>
                                    </Typography>
                                    <Typography>
                                        Amount: <b>₹{l.loanAmount}</b>
                                    </Typography>

                                </CardContent>

                                <CardActions>
                                    <Button
                                        color="success"
                                        variant="contained"
                                        onClick={() => handleAction(approveLoan, l.loanId)}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        color="error"
                                        variant="contained"
                                        onClick={() => handleAction(rejectLoan, l.loanId)}
                                    >
                                        Reject
                                    </Button>
                                </CardActions>
                            </Card>
                        );
                    })}
                </Grid>

                {/* BENEFICIARIES */}
                <Grid item xs={12}>
                    {renderCard("Beneficiaries", People, beneficiaries, (b) => {
                        const user = getUser(b.customerId);

                        return (
                            <Card key={b.beneficiaryId} sx={{ mb: 2 }}>
                                <CardContent>

                                    <Box sx={{ display: "flex", gap: 2 }}>
                                        <Avatar>{user.fullName?.charAt(0)}</Avatar>

                                        <Box>
                                            <Typography fontWeight={600}>
                                                {user.fullName}
                                            </Typography>
                                            <Typography fontSize={13}>{user.email}</Typography>
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography>
                                        Account: <b>{b.beneficiaryAccount}</b>
                                    </Typography>
                                    <Typography>
                                        IFSC: <b>{b.ifscCode}</b>
                                    </Typography>

                                </CardContent>

                                <CardActions>
                                    <Button
                                        color="success"
                                        variant="contained"
                                        onClick={() => handleAction(approveBeneficiary, b.beneficiaryId)}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        color="error"
                                        variant="contained"
                                        onClick={() => handleAction(rejectBeneficiary, b.beneficiaryId)}
                                    >
                                        Reject
                                    </Button>
                                </CardActions>
                            </Card>
                        );
                    })}
                </Grid>

            </Grid>
        </Container>
    );
};

export default AdminPending;