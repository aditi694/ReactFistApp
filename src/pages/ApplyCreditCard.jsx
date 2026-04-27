import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    Stack,
    Fade
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applyCreditCard, getCreditCardStatus } from "../api/accountApi";

const ApplyCreditCard = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [cardStatus, setCardStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchStatus();
    }, []);

    // ✅ FIX 1: Proper error handling
    const fetchStatus = async () => {
        try {
            const res = await getCreditCardStatus();
            if (!res?.error) {
                setCardStatus(res.data);
            }
        } catch (e) {
            console.error("Failed to fetch card status", e);
        }
    };

    // ✅ FIX 2: Strong name validation
    const isValidName = (name) => {
        return /^[A-Za-z]+ [A-Za-z]+/.test(name.trim());
    };

    const handleApply = async () => {
        setMessage("");
        setError(false);

        if (!isValidName(name)) {
            setMessage("Enter valid full name (first & last name)");
            setError(true);
            return;
        }

        try {
            setLoading(true);

            const res = await applyCreditCard({
                cardHolderName: name.trim()
            });

            // ✅ FIX 3: Handle API error safely
            if (res?.error) {
                setMessage(res.message || "Something went wrong");
                setError(true);
                return;
            }

            const status = res?.data?.status;

            // ✅ FIX 4: Correct backend status handling
            if (status === "APPROVED") {
                setMessage("🎉 Your credit card is approved instantly!");
            } else if (status === "PENDING_APPROVAL") {
                setMessage("⏳ Your application is under review.");
            } else if (status === "REJECTED") {
                setMessage("❌ Application rejected");
                setError(true);
            } else {
                setMessage("Application submitted successfully");
            }

            // refresh status
            await fetchStatus();

            // ✅ FIX 5: No unnecessary delay
            navigate("/customer-dashboard", { state: { refresh: true } });

        } catch (e) {
            console.error(e);
            setMessage("Something went wrong. Please try again.");
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // ✅ STATUS BLOCK UI
    if (cardStatus?.status === "ACTIVE") {
        return (
            <Box p={5}>
                <Card sx={{ p: 3 }}>
                    <Typography color="success.main" fontWeight={600}>
                        ✅ You already have an active credit card
                    </Typography>
                </Card>
            </Box>
        );
    }

    if (cardStatus?.status === "PENDING_APPROVAL") {
        return (
            <Box p={5}>
                <Card sx={{ p: 3 }}>
                    <Typography color="warning.main" fontWeight={600}>
                        ⏳ Your application is under review
                    </Typography>
                </Card>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                px: { xs: 2, md: 6 },
                py: { xs: 4, md: 6 },
                background:
                    "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)"
            }}
        >
            <Grid container spacing={6} alignItems="center">

                {/* LEFT SIDE */}
                <Grid item xs={12} md={7}>
                    <Fade in timeout={800}>
                        <Box>
                            <Typography
                                variant="h3"
                                fontWeight={800}
                                sx={{ fontSize: { xs: "2rem", md: "3rem" } }}
                            >
                                Apply for your premium credit card
                            </Typography>

                            <Typography sx={{ mt: 2, color: "text.secondary", maxWidth: 500 }}>
                                Enjoy cashback, rewards, and secure payments.
                            </Typography>
                        </Box>
                    </Fade>

                    <Stack direction="row" spacing={4} mt={4} flexWrap="wrap">
                        {[
                            { label: "1M+ Users", sub: "Trusted customers" },
                            { label: "99.9% Secure", sub: "Bank-level security" },
                            { label: "Instant Approval", sub: "Quick processing" }
                        ].map((item, i) => (
                            <Box key={i}>
                                <Typography fontWeight={700}>{item.label}</Typography>
                                <Typography fontSize={13} color="text.secondary">
                                    {item.sub}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>

                    {/* CARD PREVIEW */}
                    <Box sx={{ mt: 6 }}>
                        <Box
                            sx={{
                                width: 320,
                                height: 200,
                                borderRadius: 4,
                                p: 3,
                                background: "linear-gradient(135deg, #2563eb, #1e40af)",
                                color: "#fff"
                            }}
                        >
                            <Typography fontSize={12}>CARD NUMBER</Typography>
                            <Typography mt={1}>**** **** **** 1234</Typography>

                            <Box mt={4}>
                                <Typography fontSize={12}>CARD HOLDER</Typography>
                                <Typography fontWeight={600}>
                                    {name.toUpperCase() || "YOUR NAME"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* FEATURES */}
                    <Grid container spacing={2} mt={4}>
                        {[
                            { icon: <EmojiEventsIcon />, text: "5% Cashback" },
                            { icon: <CreditCardIcon />, text: "No Annual Fee" },
                            { icon: <SecurityIcon />, text: "Secure Payments" }
                        ].map((item, i) => (
                            <Grid item xs={12} sm={4} key={i}>
                                <Card sx={{ p: 2, textAlign: "center" }}>
                                    <Box mb={1}>{item.icon}</Box>
                                    <Typography fontSize={14}>{item.text}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                {/* RIGHT FORM */}
                <Grid item xs={12} md={5}>
                    <Fade in timeout={1200}>
                        <Card sx={{ p: 4, borderRadius: 4 }}>
                            <Typography variant="h5" fontWeight={700}>
                                Start your application
                            </Typography>

                            <TextField
                                fullWidth
                                label="Full Name (as per account)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{ mt: 3 }}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleApply}
                                disabled={loading}
                                sx={{ mt: 3 }}
                            >
                                {loading ? "Processing..." : "Apply Now"}
                            </Button>

                            {message && (
                                <Typography
                                    sx={{
                                        mt: 2,
                                        color: error ? "error.main" : "success.main"
                                    }}
                                >
                                    {message}
                                </Typography>
                            )}
                        </Card>
                    </Fade>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ApplyCreditCard;