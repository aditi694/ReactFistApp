import { useEffect, useState } from "react";
import { getCustomerDashboard } from "../api/customerApi";
import {
    Container,
    Card,
    CardContent,
    Typography,
    Box,
    Divider,
    Button
} from "@mui/material";
import { logoutUser } from "../utils/auth.js";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {

    const [data, setData] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/customer-login");
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await getCustomerDashboard();
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!data) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>

            {/* HEADER FIXED */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2
                }}
            >
                <Typography variant="h4">
                    Customer Dashboard
                </Typography>

                <Button
                    variant="outlined"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
                <CardContent>

                    {/* CUSTOMER NAME */}
                    <Typography variant="h5" gutterBottom>
                        {data.customerName}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    {/* ACCOUNT DETAILS */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h6">Account Details</Typography>
                        <Typography>
                            Account Number: {data.accountNumber}
                        </Typography>
                        <Typography>
                            Account Type: {data.accountType}
                        </Typography>
                        <Typography sx={{ fontWeight: "bold" }}>
                            Balance: ₹{data.balance}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* BANK BRANCH */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Bank Branch</Typography>
                        <Typography>{data.bankBranch?.bankName}</Typography>
                        <Typography>{data.bankBranch?.branchName}</Typography>
                        <Typography>{data.bankBranch?.city}</Typography>
                    </Box>

                    <Divider />

                    {/* DEBIT CARD */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Debit Card</Typography>
                        <Typography>{data.debitCard?.cardNumber}</Typography>
                        <Typography>
                            Limit: ₹{data.debitCard?.dailyLimit}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* CREDIT CARD */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Credit Card</Typography>

                        {data.creditCard?.status === "NOT_APPLIED" ? (
                            <Typography sx={{ color: "gray" }}>
                                {data.creditCard?.message}
                            </Typography>
                        ) : (
                            <>
                                <Typography>{data.creditCard?.cardNumber}</Typography>
                                <Typography>
                                    Available: ₹{data.creditCard?.availableCredit}
                                </Typography>
                            </>
                        )}
                    </Box>

                    <Divider />

                    {/* LOANS */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Loans</Typography>
                        {data.loans?.length === 0 ? (
                            <Typography sx={{ color: "gray" }}>
                                No active loans
                            </Typography>
                        ) : (
                            data.loans.map((loan) => (
                                <Typography key={loan.loanId}>
                                    {loan.loanType} - ₹{loan.loanAmount}
                                </Typography>
                            ))
                        )}
                    </Box>

                    <Divider />

                    {/* INSURANCE */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Insurances</Typography>
                        {data.insurances?.length === 0 ? (
                            <Typography sx={{ color: "gray" }}>
                                No active insurances
                            </Typography>
                        ) : (
                            data.insurances.map((ins) => (
                                <Typography key={ins.policyNumber}>
                                    {ins.insuranceType} - ₹{ins.coverageAmount}
                                </Typography>
                            ))
                        )}
                    </Box>

                    <Divider />

                    {/* NOMINEE */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">Nominee</Typography>
                        <Typography>
                            {data.nominee?.name} ({data.nominee?.relation})
                        </Typography>
                    </Box>

                    <Divider />

                    {/* KYC */}
                    <Box sx={{ my: 2 }}>
                        <Typography variant="h6">KYC Status</Typography>
                        <Typography
                            sx={{
                                color:
                                    data.kyc?.status === "APPROVED"
                                        ? "green"
                                        : "orange",
                                fontWeight: "bold"
                            }}
                        >
                            {data.kyc?.status}
                        </Typography>
                    </Box>

                    <Divider />

                    {/* LIMITS */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6">
                            Transaction Limits
                        </Typography>
                        <Typography>
                            Daily: ₹{data.limits?.dailyTransactionLimit}
                        </Typography>
                        <Typography>
                            Per Txn: ₹{data.limits?.perTransactionLimit}
                        </Typography>
                    </Box>

                </CardContent>
            </Card>

        </Container>
    );
};

export default CustomerDashboard;