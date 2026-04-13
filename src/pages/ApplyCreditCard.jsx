import {
    Box, Typography, TextField, Button,
    Grid, Card
} from "@mui/material";

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
                p: { xs: 2, md: 4 },
                minHeight: "100vh",
                background: "linear-gradient(135deg, #eef2ff, #f8fafc)"
            }}
        >
            <Grid container spacing={4} alignItems="center">
                {/* LEFT SIDE (HERO) */}
                <Grid item xs={12} md={7}>

                    <Typography variant="h3" fontWeight={700} mb={2}>
                        Go further with Card.
                    </Typography>

                    <Typography color="text.secondary" mb={4}>
                        Experience seamless payments, rewards, and premium benefits with Union Bank Credit Card.
                    </Typography>
                    {/*CARD STACK */}
                    <Box sx={{ position: "relative", height: 220 }}>
                        {/* BACK CARD */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 20,
                                left: 40,
                                width: 300,
                                height: 180,
                                borderRadius: 3,
                                background: "#111",
                                color: "#fff",
                                p: 2,
                                opacity: 0.8
                            }}
                        >
                            <Typography fontSize={12}>CARD NUMBER</Typography>
                            <Typography mt={1}>**** **** **** 5678</Typography>
                        </Box>
                        {/* FRONT CARD */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: 320,
                                height: 190,
                                borderRadius: 3,
                                p: 2,
                                color: "#fff",
                                background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
                            }}
                        >
                            <Typography fontSize={12}>CARD NUMBER</Typography>
                            <Typography mt={1}>**** **** **** 1234</Typography>

                            <Box mt={3}>
                                <Typography fontSize={12}>CARD HOLDER</Typography>
                                <Typography>{name || "Your Name"}</Typography>
                            </Box>
                        </Box>

                    </Box>
                    {/* BENEFITS */}
                    <Grid container spacing={2} mt={3}>
                        {[
                            "5% Cashback",
                            "No Annual Fee",
                            "Lounge Access",
                            "Reward Points"
                        ].map((item, i) => (
                            <Grid item xs={6} key={i}>
                                <Card sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    textAlign: "center",
                                    boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
                                }}>
                                    <Typography fontSize={13}>✔ {item}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>
                {/* RIGHT SIDE (FORM) */}
                <Grid item xs={12} md={5}>
                    <Card sx={{
                        p: 4,
                        borderRadius: 4,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}>
                        <Typography variant="h5" fontWeight={700}>
                            Apply Now
                        </Typography>

                        <Typography fontSize={13} color="text.secondary" mb={3}>
                            Takes less than 2 minutes
                        </Typography>

                        <TextField
                            fullWidth
                            label="Card Holder Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleApply}
                            sx={{
                                mt: 3,
                                py: 1.2,
                                fontWeight: 600,
                                borderRadius: 2
                            }}
                        >
                            Apply for Card
                        </Button>
                        {message && (
                            <Typography
                                sx={{
                                    mt: 2,
                                    color: error ? "error.main" : "success.main",
                                    fontWeight: 600
                                }}
                            >
                                {message}
                            </Typography>
                        )}
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ApplyCreditCard;