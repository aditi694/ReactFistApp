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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyCreditCard } from "../api/customerApi";

const ApplyCreditCard = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleApply = async () => {
        setMessage("");
        setError(false);

        if (!name || name.trim().length < 5) {
            setMessage("Enter full name (min 5 characters)");
            setError(true);
            return;
        }

        const res = await applyCreditCard({
            cardHolderName: name.trim()
        });

        if (res?.error) {
            setMessage(res.message);
            setError(true);
            return;
        }

        setMessage("Application submitted");
        setTimeout(() => {
            navigate("/customer-dashboard", { state: { refresh: true } });
        }, 1500);
    };

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

                            <Typography
                                sx={{ mt: 2, color: "text.secondary", maxWidth: 500 }}
                            >
                                Enjoy seamless payments, cashback rewards, airport lounge access,
                                and complete financial flexibility.
                            </Typography>
                        </Box>
                    </Fade>

                    {/* TRUST STATS */}
                    <Stack
                        direction="row"
                        spacing={4}
                        mt={4}
                        flexWrap="wrap"
                    >
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

                    {/* CARD VISUAL */}
                    <Box sx={{ mt: 6, position: "relative", height: 220 }}>
                        <Box
                            sx={{
                                width: { xs: 280, md: 340 },
                                height: 200,
                                borderRadius: 4,
                                p: 3,
                                background:
                                    "linear-gradient(135deg, #2563eb, #1e40af)",
                                color: "#fff",
                                boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
                                transition: "0.3s",
                                "&:hover": {
                                    transform: "translateY(-6px)"
                                }
                            }}
                        >
                            <Typography fontSize={12} opacity={0.8}>
                                CARD NUMBER
                            </Typography>
                            <Typography mt={1} letterSpacing={2}>
                                **** **** **** 1234
                            </Typography>

                            <Box mt={4}>
                                <Typography fontSize={12} opacity={0.8}>
                                    CARD HOLDER
                                </Typography>
                                <Typography fontWeight={600}>
                                    {name || "Your Name"}
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
                                <Card
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        textAlign: "center",
                                        boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                                        transition: "0.3s",
                                        "&:hover": {
                                            transform: "translateY(-5px)"
                                        }
                                    }}
                                >
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
                        <Card
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: 4,
                                boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
                            }}
                        >
                            <Typography variant="h5" fontWeight={700}>
                                Start your application
                            </Typography>

                            <Typography
                                fontSize={13}
                                color="text.secondary"
                                mb={3}
                            >
                                Takes less than 2 minutes
                            </Typography>

                            <TextField
                                fullWidth
                                label="Full Name (as per PAN)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleApply}
                                sx={{
                                    mt: 3,
                                    py: 1.3,
                                    fontWeight: 700,
                                    borderRadius: 3,
                                    boxShadow: "none"
                                }}
                            >
                                Apply Now
                            </Button>

                            {message && (
                                <Typography
                                    sx={{
                                        mt: 2,
                                        color: error
                                            ? "error.main"
                                            : "success.main",
                                        fontWeight: 600
                                    }}
                                >
                                    {message}
                                </Typography>
                            )}

                            <Typography
                                fontSize={12}
                                color="text.secondary"
                                mt={2}
                            >
                                By applying, you agree to our terms & conditions.
                            </Typography>
                        </Card>
                    </Fade>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ApplyCreditCard;