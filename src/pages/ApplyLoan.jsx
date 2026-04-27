import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Grid,
    Paper,
    Slider
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyLoan } from "../api/accountApi";

const loanTypes = ["PERSONAL", "HOME", "CAR", "EDUCATION", "BUSINESS"];

const ApplyLoan = () => {
    const [amount, setAmount] = useState(900000);
    const [interest, setInterest] = useState(11);
    const [tenure, setTenure] = useState(12);
    const [loanType, setLoanType] = useState("PERSONAL");

    const navigate = useNavigate();

    const calculateEMI = () => {
        const r = interest / 12 / 100;
        const emi = (amount * r * Math.pow(1 + r, tenure)) /
            (Math.pow(1 + r, tenure) - 1);
        return Math.round(emi);
    };

    const emi = calculateEMI();
    const total = emi * tenure;
    const interestPay = total - amount;

    const handleApply = async () => {
        const res = await applyLoan({ loanType, amount });
        if (!res?.error) navigate("/customer-dashboard");
    };

    return (
        <Box sx={{
            // maxWidth: 1280,
            mx: "auto",
            p: { xs: 2, sm: 3, md: 4, lg: 5 },
            width: "100%"
        }}>

            {/* 🔹 LOAN TYPE TABS - EXACTLY as in your screenshot */}
            <Box
                sx={{
                    display: "flex",
                    gap: { xs: 1.5, md: 2 },
                    mb: 5,
                    flexWrap: { xs: "wrap", md: "nowrap" },
                    overflowX: { xs: "auto", md: "visible" },
                    pb: { xs: 1, md: 0 }
                }}
            >
                {loanTypes.map((type) => (
                    <Button
                        key={type}
                        variant={loanType === type ? "contained" : "outlined"}
                        onClick={() => setLoanType(type)}
                        sx={{
                            minWidth: { xs: 110, md: 130 },
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            fontWeight: 600,
                            px: { xs: 3, md: 4 },
                            py: 1.2,
                            textTransform: "none",
                            borderRadius: 2,
                            whiteSpace: "nowrap"
                        }}
                    >
                        {type}
                    </Button>
                ))}
            </Box>

            {/* HERO SECTION - Matches your laptop screenshot perfectly */}
            <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Typography
                        fontSize={{ xs: 28, sm: 32, md: 36, lg: 40 }}
                        fontWeight={800}
                        lineHeight={1.2}
                    >
                        Get Instant Loan Approval
                    </Typography>

                    <Typography
                        mt={2}
                        color="gray"
                        fontSize={{ xs: "1rem", md: "1.1rem" }}
                    >
                        Flexible repayment options with minimal documentation.
                    </Typography>

                    <Box mt={3} display="flex" flexDirection="column" gap={1}>
                        <Typography sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}>
                            ✔ Low interest rates
                        </Typography>
                        <Typography sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}>
                            ✔ Quick approval
                        </Typography>
                        <Typography sx={{ fontSize: { xs: "1rem", md: "1.1rem" } }}>
                            ✔ Flexible EMI
                        </Typography>
                    </Box>
                </Grid>

                {/* Apply Now Card - Exact look from screenshot */}
                <Grid item xs={12} md={6}>
                    <Paper
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 3,
                            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                        }}
                    >
                        <Typography fontWeight={700} fontSize={{ xs: 18, md: 20 }} mb={3}>
                            Apply Now
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            value={loanType}
                            onChange={(e) => setLoanType(e.target.value)}
                            sx={{ mb: 2 }}
                            size="medium"
                        >
                            {loanTypes.map((t) => (
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            label="Loan Amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            size="medium"
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 4,
                                py: 1.8,
                                bgcolor: "#97144D",
                                fontSize: { xs: "1rem", md: "1.1rem" },
                                fontWeight: 600,
                                "&:hover": { bgcolor: "#7a1039" }
                            }}
                            onClick={handleApply}
                        >
                            APPLY NOW
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            {/* EMI CALCULATOR + WHY UNION BANK - Already responsive as before */}
            <Box mt={{ xs: 7, md: 10 }} sx={{ px: { xs: 1, md: 2 } }}>
                <Typography
                    fontSize={{ xs: 24, sm: 28, md: 32 }}
                    fontWeight={700}
                    textAlign="center"
                    mb={4}
                >
                    EMI Calculator
                </Typography>

                <Paper
                    sx={{
                        maxWidth: 800,
                        mx: "auto",
                        bgcolor: "#F3F4F6",
                        borderRadius: 4,
                        p: { xs: 3, sm: 4, md: 6 },
                        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
                    }}
                >
                    <Grid container spacing={{ xs: 6, md: 16 }} alignItems="center">
                        <Grid item xs={12} md={6} >
                            <Typography mb={1} fontWeight={500}>
                                Loan Amount: ₹{amount.toLocaleString()}
                            </Typography>
                            <Slider
                                value={amount}
                                min={50000}
                                max={4000000}
                                step={10000}
                                onChange={(e, v) => setAmount(v)}
                                sx={{ mb: 4 }}
                            />

                            <Typography mb={1} fontWeight={500}>
                                Interest: {interest}%
                            </Typography>
                            <Slider
                                value={interest}
                                min={5}
                                max={20}
                                step={0.5}
                                onChange={(e, v) => setInterest(v)}
                                sx={{ mb: 4 }}
                            />

                            <Typography mb={1} fontWeight={500}>
                                Tenure: {tenure} months
                            </Typography>
                            <Slider
                                value={tenure}
                                min={6}
                                max={84}
                                step={1}
                                onChange={(e, v) => setTenure(v)}
                            />

                            <Box
                                sx={{
                                    mt: { xs: 4, md: 6 },
                                    bgcolor: "#fff",
                                    borderRadius: 3,
                                    p: 3,
                                    display: "flex",
                                    justifyContent: "center",
                                    boxShadow: "0 5px 15px rgba(0,0,0,0.06)"
                                }}
                            >
                                <Typography
                                    fontWeight={700}
                                    fontSize={{ xs: 22, md: 26 }}
                                    color="#97144D"
                                >
                                    EMI ₹{emi.toLocaleString()}
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <Box sx={{ width: { xs: 220, sm: 240, md: 280 }, mx: "auto" }}>
                                    <svg width="100%" height="100%" viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="110" cy="110" r="90" stroke="#eee" strokeWidth="20" fill="none" />
                                        <circle cx="110" cy="110" r="90" stroke="#97144D" strokeWidth="20" fill="none"
                                            strokeDasharray={`${(amount / total) * 565} 565`}
                                            transform="rotate(-90 110 110)" />
                                    </svg>
                                </Box>
                            </Box>

                            <Box sx={{ textAlign: "center", mt: 3 }}>
                                <Typography fontWeight={700} fontSize={{ xs: 22, md: 28 }}>
                                    ₹{total.toLocaleString()}
                                </Typography>
                                <Typography color="gray">Total Payable</Typography>
                                <Box mt={2} display="flex" justifyContent="center" gap={4} flexWrap="wrap">
                                    <Typography>Principal: <strong>₹{amount.toLocaleString()}</strong></Typography>
                                    <Typography>Interest: <strong>₹{interestPay.toLocaleString()}</strong></Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            {/* WHY UNION BANK SECTION */}
            <Box mt={{ xs: 6, md: 8 }}>
                <Paper
                    sx={{
                        maxWidth: 1000,
                        mx: "auto",
                        p: { xs: 2, md: 5 },
                        borderRadius: 2,
                        bgcolor: "#F4F6F8"
                    }}
                >
                    <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                        <Grid item xs={12} md={5}>
                            <Typography fontSize={{ xs: 24, md: 28, lg: 32 }} fontWeight={700}>
                                Why Union Bank?
                            </Typography>
                            <Typography mt={2} color="gray">
                                Trusted banking with nationwide presence, secure systems, and fast loan approvals.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Grid container spacing={3}>
                                {[
                                    "1,00,000+ Customers",
                                    "14,000+ Loans",
                                    "570+ Experts",
                                    "5,800+ Branches"
                                ].map((item, i) => (
                                    <Grid item xs={6} key={i}>
                                        <Box sx={{
                                            p: { xs: 2.5, md: 3.5 },
                                            bgcolor: "#fff",
                                            borderRadius: 3,
                                            textAlign: "center",
                                            boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
                                        }}>
                                            <Typography fontWeight={700} fontSize={{ xs: "1rem", md: "1.1rem" }}>
                                                {item}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Box>
    );
};

export default ApplyLoan;