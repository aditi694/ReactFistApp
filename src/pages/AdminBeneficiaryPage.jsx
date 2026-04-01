import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Container,
    CircularProgress,
    Alert,
    Divider
} from "@mui/material";
import { CheckCircle as CheckIcon, Cancel as CancelIcon } from "@mui/icons-material";

import {
    getPendingBeneficiaries,
    approveBeneficiary,
    rejectBeneficiary
} from "../api/beneficiaryApi";

const AdminBeneficiaryPage = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // Track which item is being actioned
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    /**
     * Fetch pending beneficiaries
     */
    const fetchData = async () => {
        setLoading(true);
        setMessage("");
        setError(false);

        const res = await getPendingBeneficiaries();

        if (!res?.error && Array.isArray(res?.data)) {
            setList(res.data);
            console.log("✅ Pending beneficiaries loaded:", res.data);
        } else {
            setList([]);
            setMessage(res?.message || "Failed to load pending beneficiaries");
            setError(true);
            console.error("❌ Failed to load:", res?.message);
        }

        setLoading(false);
    };

    /**
     * Initialize on mount
     */
    useEffect(() => {
        fetchData();
    }, []);

    /**
     * Handle approve action
     */
    const handleApprove = async (id) => {
        if (!id) {
            setError(true);
            setMessage("Invalid beneficiary ID");
            return;
        }

        setActionLoading(id);
        setMessage("");

        const res = await approveBeneficiary(id);

        setActionLoading(null);

        if (res?.error) {
            setError(true);
            setMessage(res?.message || "Failed to approve beneficiary");
            console.error("❌ Approve error:", res?.message);
            return;
        }

        setError(false);
        setMessage(res?.message || "Beneficiary approved successfully");
        console.log("✅ Approved:", id);

        // Refresh list
        await fetchData();
    };

    /**
     * Handle reject action
     */
    const handleReject = async (id) => {
        if (!id) {
            setError(true);
            setMessage("Invalid beneficiary ID");
            return;
        }

        setActionLoading(id);
        setMessage("");

        const res = await rejectBeneficiary(id);

        setActionLoading(null);

        if (res?.error) {
            setError(true);
            setMessage(res?.message || "Failed to reject beneficiary");
            console.error("❌ Reject error:", res?.message);
            return;
        }

        setError(false);
        setMessage(res?.message || "Beneficiary rejected successfully");
        console.log("✅ Rejected:", id);

        // Refresh list
        await fetchData();
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            {/* HEADER */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
                Pending Beneficiary Approvals
            </Typography>

            {/* MESSAGE ALERT */}
            {message && (
                <Alert
                    severity={error ? "error" : "success"}
                    onClose={() => setMessage("")}
                    sx={{ mb: 2 }}
                >
                    {message}
                </Alert>
            )}

            {/* LOADING */}
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress />
                </Box>
            ) : list.length === 0 ? (
                /* EMPTY STATE */
                <Card sx={{ textAlign: "center", py: 4 }}>
                    <Typography color="text.secondary" variant="body1">
                        ✅ No pending beneficiaries to approve
                    </Typography>
                </Card>
            ) : (
                /* BENEFICIARY LIST */
                list.map((b) => (
                    <Card
                        key={b.beneficiaryId}
                        sx={{
                            mb: 2,
                            borderLeft: "4px solid #ff9800",
                            transition: "all 0.2s",
                            "&:hover": { boxShadow: 3 }
                        }}
                    >
                        <CardContent>
                            {/* BENEFICIARY NAME */}
                            <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                                {b.beneficiaryName || "Unnamed Beneficiary"}
                            </Typography>

                            <Divider sx={{ my: 1.5 }} />

                            {/* DETAILS GRID */}
                            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                                {/* Account */}
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Beneficiary Account
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {b.beneficiaryAccount || "-"}
                                    </Typography>
                                </Box>

                                {/* IFSC */}
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        IFSC Code
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {b.ifscCode || "-"}
                                    </Typography>
                                </Box>

                                {/* Bank */}
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Bank Name
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {b.bankName || "Unknown"}
                                    </Typography>
                                </Box>

                                {/* Status */}
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Verification Status
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 500,
                                            color:
                                                b.verificationStatus === "VERIFIED"
                                                    ? "success.main"
                                                    : b.verificationStatus === "PENDING"
                                                        ? "warning.main"
                                                        : "error.main"
                                        }}
                                    >
                                        {b.verificationStatus || "UNKNOWN"}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* CREATED DATE */}
                            <Typography variant="caption" color="text.secondary">
                                Created: {new Date(b.createdAt).toLocaleString()}
                            </Typography>
                        </CardContent>

                        {/* ACTIONS */}
                        <CardActions sx={{ pt: 0, px: 2, pb: 2, gap: 1 }}>
                            <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckIcon />}
                                onClick={() => handleApprove(b.beneficiaryId)}
                                disabled={actionLoading !== null}
                                size="small"
                            >
                                {actionLoading === b.beneficiaryId ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    "Approve"
                                )}
                            </Button>

                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={() => handleReject(b.beneficiaryId)}
                                disabled={actionLoading !== null}
                                size="small"
                            >
                                {actionLoading === b.beneficiaryId ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    "Reject"
                                )}
                            </Button>
                        </CardActions>
                    </Card>
                ))
            )}
        </Container>
    );
};

export default AdminBeneficiaryPage;