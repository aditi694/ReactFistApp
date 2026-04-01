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
    Container,
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    Divider,
    CircularProgress,
    Alert
} from "@mui/material";

const AdminDashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [cards, setCards] = useState([]);
    const [pendingBeneficiaryCount, setPendingBeneficiaryCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            setLoading(true);
            setError("");

            const custRes = await getAllCustomers();
            if (!custRes || custRes.error || !custRes.data) {
                handleError(custRes);
                return;
            }
            setCustomers(custRes.data);

            const loanRes = await getPendingLoans();
            setLoans(loanRes?.data?.loans || []);

            const cardRes = await getPendingCards();
            setCards(cardRes?.data?.requests || []);

            const benRes = await getPendingBeneficiaries();
            if (!benRes?.error && Array.isArray(benRes?.data)) {
                setPendingBeneficiaryCount(benRes.data.length);
            } else {
                setPendingBeneficiaryCount(0);
            }
        } catch {
            setError("Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    const handleError = (res) => {
        if (res?.message === "Unauthorized") {
            logoutUser();
            navigate("/login");
        } else {
            setError(res?.message || "Something went wrong");
        }
    };

    const getCustomerMeta = (customer) => {
        const loan = loans.find(
            (l) =>
                l.customerId === customer.customerId ||
                l.account?.customerId === customer.customerId
        );
        const card = cards.find(
            (c) =>
                c.customerId === customer.customerId ||
                c.account?.customerId === customer.customerId
        );
        return {
            loanStatus: loan?.status || "NONE",
            loanId: loan?.loanId,
            cardStatus: card?.status || "NONE",
            cardId: card?.id
        };
    };

    // ACTIONS
    const handleApproveKyc = async (id) => {
        await updateKyc(id, "APPROVED", "Verified");
        fetchAll();
    };

    const handleRejectKyc = async (id) => {
        await updateKyc(id, "REJECTED", "Invalid");
        fetchAll();
    };

    const handleBlock = async (id) => {
        await blockCustomer(id, "Suspicious");
        fetchAll();
    };

    const handleUnblock = async (id) => {
        await unblockCustomer(id);
        fetchAll();
    };

    const handleApproveLoan = async (id) => {
        await approveLoan(id);
        fetchAll();
    };

    const handleRejectLoan = async (id) => {
        await rejectLoan(id);
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

    const handleLogout = () => {
        logoutUser();
        navigate("/login", { replace: true });
    };

    // UI STATES
    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* HEADER */}
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h4">Admin Dashboard</Typography>
                <Button variant="outlined" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>
                Customers
            </Typography>

            {customers.map((c) => {
                const meta = getCustomerMeta(c);

                return (
                    <Card key={c.customerId} sx={{ mb: 2, borderRadius: 3 }}>
                        <CardContent>
                            <Typography variant="h6">{c.fullName}</Typography>
                            <Typography color="text.secondary">{c.email}</Typography>
                            <Typography color="text.secondary">{c.phone}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography>
                                Status:{" "}
                                <Box component="span" sx={{
                                    color: c.status === "ACTIVE" ? "success.main" : "error.main",
                                    fontWeight: "bold"
                                }}>
                                    {c.status}
                                </Box>
                            </Typography>
                            <Typography>
                                KYC:{" "}
                                <Box component="span" sx={{
                                    color: c.kycStatus === "APPROVED" ? "success.main" : "warning.main",
                                    fontWeight: "bold"
                                }}>
                                    {c.kycStatus}
                                </Box>
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            {meta.loanStatus !== "NONE" && (
                                <Typography>Loan: {meta.loanStatus}</Typography>
                            )}
                            {meta.cardStatus !== "NONE" && (
                                <Typography>Card: {meta.cardStatus}</Typography>
                            )}
                            <Typography sx={{ mt: 1, fontSize: 12 }}>
                                Created: {new Date(c.createdAt).toLocaleString()}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ flexWrap: "wrap", gap: 1, px: 2, pb: 2 }}>
                            {/* KYC */}
                            {c.kycStatus === "PENDING" && (
                                <>
                                    <Button size="small" color="success" variant="contained"
                                            onClick={() => handleApproveKyc(c.customerId)}>
                                        Approve KYC
                                    </Button>
                                    <Button size="small" color="error" variant="contained"
                                            onClick={() => handleRejectKyc(c.customerId)}>
                                        Reject KYC
                                    </Button>
                                </>
                            )}
                            {/* LOAN */}
                            {["REQUESTED", "PENDING"].includes(meta.loanStatus) && (
                                <>
                                    <Button size="small" color="success" variant="contained"
                                            onClick={() => handleApproveLoan(meta.loanId)}>
                                        Approve Loan
                                    </Button>
                                    <Button size="small" color="error" variant="contained"
                                            onClick={() => handleRejectLoan(meta.loanId)}>
                                        Reject Loan
                                    </Button>
                                </>
                            )}
                            {/* CARD */}
                            {["PENDING"].includes(meta.cardStatus) && (
                                <>
                                    <Button size="small" color="success" variant="contained"
                                            onClick={() => handleApproveCard(meta.cardId)}>
                                        Approve Card
                                    </Button>
                                    <Button size="small" color="error" variant="contained"
                                            onClick={() => handleRejectCard(meta.cardId)}>
                                        Reject Card
                                    </Button>
                                </>
                            )}
                            {/* BLOCK */}
                            {c.status === "ACTIVE" && (
                                <Button size="small" variant="outlined" color="warning"
                                        onClick={() => handleBlock(c.customerId)}>
                                    Block
                                </Button>
                            )}
                            {c.status === "BLOCKED" && (
                                <Button size="small" variant="contained"
                                        onClick={() => handleUnblock(c.customerId)}>
                                    Unblock
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                );
            })}

            {/* ✅ BENEFICIARY SUMMARY - ONLY ONE SECTION AT THE BOTTOM */}
            <Box sx={{ mt: 5, p: 3, border: "1px solid #ddd", borderRadius: 2, textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                    Beneficiary Management
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Total Pending Beneficiaries: <strong>{pendingBeneficiaryCount}</strong>
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/admin/beneficiaries")}
                    sx={{ px: 4 }}
                >
                    Manage Pending Beneficiaries
                </Button>
            </Box>
        </Container>
    );
};

export default AdminDashboard;