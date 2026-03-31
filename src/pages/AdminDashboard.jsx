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
import { logoutUser } from "../utils/auth";
import {
    Card,
    Box,
    CardContent,
    CardActions,
    Typography,
    Button,
    Divider
} from "@mui/material";

const AdminDashboard = () => {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loans, setLoans] = useState([]);
    const [cards, setCards] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
        fetchAdminData();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await getAllCustomers();
            if (res?.error) {
                setError(res.message);
                return;
            }
            setCustomers(res.data);
        } catch {
            setError("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminData = async () => {
        try {
            const loanRes = await getPendingLoans();
            if (!loanRes?.error) {
                setLoans(loanRes.data?.loans || []);
            }
            const cardRes = await getPendingCards();
            if (!cardRes?.error) {
                setCards(cardRes.data?.requests || []);
            }
        } catch {}
    };

    const handleApproveKyc = async (id) => {
        await updateKyc(id, "APPROVED", "Verified");
        fetchCustomers();
    };

    const handleRejectKyc = async (id) => {
        await updateKyc(id, "REJECTED", "Invalid documents");
        fetchCustomers();
    };

    const handleBlock = async (id) => {
        await blockCustomer(id, "Suspicious activity");
        fetchCustomers();
    };

    const handleUnblock = async (id) => {
        await unblockCustomer(id);
        fetchCustomers();
    };

    const handleApproveLoan = async (id) => {
        await approveLoan(id);
        fetchAdminData();
    };

    const handleRejectLoan = async (id) => {
        await rejectLoan(id);
        fetchAdminData();
    };

    const handleApproveCard = async (id) => {
        await approveCard(id);
        fetchAdminData();
    };

    const handleRejectCard = async (id) => {
        await rejectCard(id);
        fetchAdminData();
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    if (loading) return <h3>Loading customers...</h3>;
    if (error) return <h3>{error}</h3>;

    return (
        <div>

            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    mb: 3
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}
                >
                    Admin Dashboard
                </Typography>

                <Button
                    sx={{ ml: "auto" }}
                    variant="outlined"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
                Customers
            </Typography>

            {customers.length === 0 && <Typography>No customers found</Typography>}

            {customers.map((c) => (
                <Card
                    key={c.customerId}
                    sx={{
                        mb: 2,
                        p: 2,
                        borderRadius: 3,
                        boxShadow: 2
                    }}
                >
                    <CardContent>
                        <Typography variant="h6">{c.fullName}</Typography>
                        <Typography>Email: {c.email}</Typography>
                        <Typography>Phone: {c.phone}</Typography>

                        <Typography>
                            Status:{" "}
                            <span style={{ color: c.status === "ACTIVE" ? "green" : "red" }}>
                                {c.status}
                            </span>
                        </Typography>

                        <Typography>
                            KYC:{" "}
                            <span style={{ color: c.kycStatus === "APPROVED" ? "green" : "orange" }}>
                                {c.kycStatus}
                            </span>
                        </Typography>

                        {c.hasPendingLoan && (
                            <Typography sx={{ color: "warning.main", fontWeight: "bold" }}>
                                Loan Pending
                            </Typography>
                        )}

                        {c.hasPendingCreditCard && (
                            <Typography sx={{ color: "warning.main", fontWeight: "bold" }}>
                                Credit Card Pending
                            </Typography>
                        )}

                        <Typography>
                            Created: {new Date(c.createdAt).toLocaleString()}
                        </Typography>
                    </CardContent>

                    <CardActions sx={{ gap: 1, flexWrap: "wrap" }}>

                        {c.kycStatus === "PENDING" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => handleApproveKyc(c.customerId)}
                                >
                                    Approve
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    onClick={() => handleRejectKyc(c.customerId)}
                                >
                                    Reject
                                </Button>
                            </>
                        )}

                        {c.status === "ACTIVE" && (
                            <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                onClick={() => handleBlock(c.customerId)}
                            >
                                Block
                            </Button>
                        )}

                        {c.status === "BLOCKED" && (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => handleUnblock(c.customerId)}
                            >
                                Unblock
                            </Button>
                        )}

                    </CardActions>
                </Card>
            ))}

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
                Pending Loans
            </Typography>

            {loans.length === 0 && (
                <Typography color="text.secondary">No pending loans</Typography>
            )}

            {loans.map((loan) => (
                <Card key={loan.loanId} sx={{ mb: 2, p: 2, borderRadius: 3 }}>
                    <CardContent>
                        <Typography fontWeight="bold">{loan.loanType}</Typography>
                        <Typography color="text.secondary">₹{loan.amount}</Typography>

                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleApproveLoan(loan.loanId)}
                            >
                                Approve
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleRejectLoan(loan.loanId)}
                            >
                                Reject
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
                Pending Credit Cards
            </Typography>

            {cards.length === 0 && (
                <Typography color="text.secondary">No pending requests</Typography>
            )}

            {cards.map((card) => (
                <Card key={card.id} sx={{ mb: 2, p: 2, borderRadius: 3 }}>
                    <CardContent>
                        <Typography fontWeight="bold">{card.cardHolderName}</Typography>

                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleApproveCard(card.id)}
                            >
                                Approve
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                size="small"
                                onClick={() => handleRejectCard(card.id)}
                            >
                                Reject
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            ))}

        </div>
    );
};

export default AdminDashboard;