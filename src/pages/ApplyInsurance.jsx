import { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Alert,
    Paper
} from "@mui/material";
import { motion } from "framer-motion";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import HomeIcon from "@mui/icons-material/Home";
import FlightIcon from "@mui/icons-material/Flight";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { applyInsurance, getMyInsurances } from "../api/customerApi";
import { getUserFromToken } from "../utils/auth";

//  Insurance Types
const insuranceTypes = [
    { label: "Motor", value: "VEHICLE", icon: <DirectionsCarIcon /> },
    { label: "Home", value: "HOME", icon: <HomeIcon /> },
    { label: "Travel", value: "TRAVEL", icon: <FlightIcon /> },
    { label: "Health", value: "HEALTH", icon: <HealthAndSafetyIcon /> },
    { label: "Life", value: "LIFE", icon: <FavoriteIcon /> }
];

const InsurancePage = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    //  Fetch Policies
    const fetchPolicies = async () => {
        setLoading(true);
        const res = await getMyInsurances();

        if (!res?.error) {
            setPolicies(res.data || []);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchPolicies();
    }, []);

    //  Apply Insurance
    const handleSubmit = async () => {
        setMessage("");
        setError(false);

        if (!amount || Number(amount) <= 0) {
            setError(true);
            setMessage("Enter valid coverage amount");
            return;
        }

        const user = getUserFromToken();

        const res = await applyInsurance({
            insuranceType: selectedType,
            coverageAmount: Number(amount),
            accountId: user?.accountId || user?.accountNumber
        });

        if (res?.error) {
            setError(true);
            setMessage(res.message);
            return;
        }

        setMessage("Insurance applied successfully");

        // Refresh data after apply
        setTimeout(() => {
            setSelectedType(null);
            setAmount("");
            setMessage("");
            fetchPolicies();
        }, 1500);
    };

    const totalCoverage = policies.reduce(
        (sum, p) => sum + p.coverageAmount,
        0
    );

    return (
        <Box
            sx={{
                p: 4,
                minHeight: "100vh"
        }}
        >
            {/* HEADER */}
            <Typography variant="h4" fontWeight="bold" mb={1}>
                Insurance Dashboard
            </Typography>

            <Typography mb={4} color="text.secondary">
                Manage and apply for insurance easily
            </Typography>

            {/* STATS */}
            <Grid container spacing={3} mb={4}>

                <Grid item xs={12} sm={4}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            color: "#fff",
                            background: "linear-gradient(135deg, #1976d2, #42a5f5)"
                        }}
                    >
                        <Typography>Total Coverage</Typography>
                        <Typography variant="h5">
                            ₹{totalCoverage.toLocaleString()}
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Paper
                        sx={{
                            p: 3,
                            borderRadius: 4,
                            color: "#fff",
                            background: "linear-gradient(135deg, #1976d2, #42a5f5)"
                        }}
                    >
                        <Typography>Total Policies</Typography>
                        <Typography variant="h5">{policies.length}</Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* INSURANCE CARDS */}
            <Grid container spacing={3}>
                {insuranceTypes.map((item) => (
                    <Grid item xs={12} sm={6} md={3} key={item.value}>
                        <motion.div whileHover={{ scale: 1.05, y: -8 }}>
                            <Card
                                onClick={() => setSelectedType(item.value)}
                                sx={{
                                    textAlign: "center",
                                    cursor: "pointer",
                                    borderRadius: 4,
                                    p: 3,
                                    background: "#fff",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                                }}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: "50%",
                                            background: "#e3f2fd",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            margin: "0 auto",
                                            mb: 1,
                                            color: "#1976d2"
                                        }}
                                    >
                                        {item.icon}
                                    </Box>

                                    <Typography fontWeight="bold">
                                        {item.label} Insurance
                                    </Typography>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}
            </Grid>

            {/* POLICY LIST */}
            <Box mt={5}>
                <Typography variant="h6" mb={2}>
                    Your Policies
                </Typography>

                <Paper sx={{ p: 2, borderRadius: 3 }}>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : policies.length === 0 ? (
                        <Typography>No insurance found</Typography>
                    ) : (
                        policies.map((p, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    py: 1,
                                    borderBottom:
                                        i !== policies.length - 1 ? "1px solid #eee" : "none"
                                }}
                            >
                                <Typography>
                                    {p.insuranceType} Insurance
                                </Typography>

                                <Typography fontWeight="bold">
                                    ₹{p.coverageAmount.toLocaleString()}
                                </Typography>

                                <Box
                                    sx={{
                                        px: 2,
                                        py: 0.5,
                                        borderRadius: 2,
                                        background:
                                            p.status === "ACTIVE" ? "#e8f5e9" : "#ffebee",
                                        color:
                                            p.status === "ACTIVE" ? "#2e7d32" : "#c62828",
                                        fontSize: 12,
                                        fontWeight: "bold"
                                    }}
                                >
                                    {p.status}
                                </Box>
                            </Box>
                        ))
                    )}
                </Paper>
            </Box>

            {/* APPLY MODAL */}
            <Dialog open={!!selectedType} onClose={() => setSelectedType(null)}>
                <DialogTitle>
                    Apply for {selectedType} Insurance
                </DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        label="Coverage Amount"
                        type="number"
                        margin="normal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={handleSubmit}
                    >
                        Apply Now
                    </Button>

                    {message && (
                        <Alert severity={error ? "error" : "success"} sx={{ mt: 2 }}>
                            {message}
                        </Alert>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default InsurancePage;