import { useEffect, useState } from "react";
import {
    Container, Typography, Box, Card, CardContent,
    CardActions, Button, Grid, Avatar, Chip, Divider,
    CircularProgress, Alert
} from "@mui/material";

import {
    CheckCircle, Cancel,
    CreditCard, AccountBalance, People
} from "@mui/icons-material";

import {
    getPendingLoans, approveLoan, rejectLoan,
    getPendingCards, approveCard, rejectCard,
    getAllCustomers, getPendingBeneficiaries, approveBeneficiary, rejectBeneficiary
} from "../api/adminApi";

const SectionHeader = ({ title, icon: Icon, count }) => (
    <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 3,
        pb: 2,
        borderBottom: "2px solid #f0f0f0"
    }}>
        <Icon sx={{ color: "#2563EB", fontSize: 30 }} />
        <Typography variant="h5" fontWeight={700}>{title}</Typography>
        <Chip label={count} color="primary" size="small" sx={{ fontWeight: 600 }} />
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

    const getUser = (id) => customers.find(c => c.customerId === id) || {};

    const handleAction = async (fn, id, successMsg) => {
        setActionLoading(id);
        setMessage("");

        const res = await fn(id);
        if (res?.error) {
            setError(true);
            setMessage(res.message || "Action failed");
        } else {
            setError(false);
            setMessage(successMsg);
            fetchAll();
        }
        setActionLoading(null);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 2, sm: 3 } }}>

            <Typography variant="h4" fontWeight={700} mb={1}>Pending Requests</Typography>
            <Typography color="text.secondary" mb={5}>
                Approval panel for all pending operations
            </Typography>

            {message && <Alert severity={error ? "error" : "success"} sx={{ mb: 4 }}>{message}</Alert>}

            {/* Card Requests */}
            <Box sx={{ mb: 6 }}>
                <SectionHeader title="Card Requests" icon={CreditCard} count={cards.length} />
                <Grid container spacing={3}>
                    {cards.map((c) => {
                        const user = getUser(c.customerId);
                        return (
                            <Grid item xs={12} sm={6} md={5} key={c.id}>
                                <Card sx={{ borderRadius: 4, boxShadow: 3, height: "100%" }}>
                                    <CardContent sx={{ pb: 1 }}>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Avatar sx={{ bgcolor: "#2563EB" }}>{user.fullName?.charAt(0)}</Avatar>
                                            <Box>
                                                <Typography fontWeight={600}>{user.fullName}</Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {user.email} • {user.phone}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography variant="body2"><b>Card Holder:</b> {c.cardHolderName}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Request ID: {c.id}
                                        </Typography>
                                    </CardContent>

                                    <CardActions sx={{ px: 2, pb: 2, gap: 1.5 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircle />}
                                            onClick={() => handleAction(approveCard, c.id, "Card Approved Successfully")}
                                            disabled={actionLoading === c.id}
                                        >
                                            APPROVE
                                        </Button>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="error"
                                            startIcon={<Cancel />}
                                            onClick={() => handleAction(rejectCard, c.id, "Card Rejected")}
                                            disabled={actionLoading === c.id}
                                        >
                                            REJECT
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* Loan Requests */}
            <Box sx={{ mb: 6 }}>
                <SectionHeader title="Loan Requests" icon={AccountBalance} count={loans.length} />
                <Grid container spacing={3}>
                    {loans.map((l) => {
                        const user = getUser(l.customerId || l.account?.customerId);
                        return (
                            <Grid item xs={12} sm={6} md={5} key={l.loanId}>
                                <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Avatar>{user.fullName?.charAt(0)}</Avatar>
                                            <Box>
                                                <Typography fontWeight={600}>{user.fullName}</Typography>
                                                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography><b>Loan Type:</b> {l.loanType}</Typography>
                                        <Typography><b>Amount:</b> ₹{(l.loanAmount || l.amount).toLocaleString('en-IN')}</Typography>
                                    </CardContent>

                                    <CardActions sx={{ px: 2, pb: 2, gap: 1.5 }}>
                                        <Button fullWidth variant="contained" color="success" onClick={() => handleAction(approveLoan, l.loanId, "Loan Approved")}>
                                            APPROVE
                                        </Button>
                                        <Button fullWidth variant="contained" color="error" onClick={() => handleAction(rejectLoan, l.loanId, "Loan Rejected")}>
                                            REJECT
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* Beneficiaries */}
            <Box sx={{ mb: 6 }}>
                <SectionHeader title="Beneficiaries" icon={People} count={beneficiaries.length} />
                <Grid container spacing={3}>
                    {beneficiaries.map((b) => {
                        const user = getUser(b.customerId);
                        return (
                            <Grid item xs={12} sm={6} md={5} key={b.beneficiaryId}>
                                <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                                    <CardContent>
                                        <Box sx={{ display: "flex", gap: 2 }}>
                                            <Avatar sx={{ bgcolor: "#7192da" }}>{user.fullName?.charAt(0)}</Avatar>
                                            <Box>
                                                <Typography fontWeight={600}>{user.fullName}</Typography>
                                                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                            </Box>
                                        </Box>

                                        <Divider sx={{ my: 2 }} />

                                        <Typography fontWeight={600}>Beneficiary: {b.beneficiaryName}</Typography>
                                        <Typography>Account: <b>{b.beneficiaryAccount}</b></Typography>
                                        <Typography>IFSC: <b>{b.ifscCode}</b></Typography>
                                    </CardContent>

                                    <CardActions sx={{ px: 2, pb: 2, gap: 1.5 }}>
                                        <Button fullWidth variant="contained" color="success" onClick={() => handleAction(approveBeneficiary, b.beneficiaryId, "Beneficiary Approved")}>
                                            APPROVE
                                        </Button>
                                        <Button fullWidth variant="contained" color="error" onClick={() => handleAction(rejectBeneficiary, b.beneficiaryId, "Beneficiary Rejected")}>
                                            REJECT
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

        </Container>
    );
};

export default AdminPending;