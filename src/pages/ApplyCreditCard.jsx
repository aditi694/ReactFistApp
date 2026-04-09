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
        <Box sx={{ p: 4 }}>

            {/* 🔝 HEADER */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight={700}>
                    Get Your Credit Card
                </Typography>

                <Typography color="text.secondary">
                    Enjoy cashback, rewards, and exclusive offers
                </Typography>
            </Box>

            <Grid container spacing={4}>

                {/* 💳 LEFT - CARD + BENEFITS */}
                <Grid item xs={12} md={7}>

                    {/* CARD */}
                    <Box sx={{
                        p: 4,
                        borderRadius: 4,
                        color: "white",
                        background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
                        mb: 3
                    }}>
                        <Typography>UNION BANK</Typography>

                        <Typography mt={3} letterSpacing={3}>
                            **** **** **** 1234
                        </Typography>

                        <Box mt={3}>
                            <Typography fontSize={12}>Card Holder</Typography>
                            <Typography>{name || "Your Name"}</Typography>
                        </Box>
                    </Box>

                    {/* BENEFITS */}
                    <Grid container spacing={2}>
                        {[
                            "5% Cashback on Online Shopping",
                            "No Annual Fee",
                            "Airport Lounge Access",
                            "Reward Points on Every Spend"
                        ].map((item, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                                <Card sx={{ p: 2, borderRadius: 2 }}>
                                    <Typography fontSize={13}>
                                        ✔ {item}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>

                {/* 📝 RIGHT - FORM */}
                <Grid item xs={12} md={5}>
                    <Card sx={{
                        p: 4,
                        borderRadius: 4,
                        position: "sticky",
                        top: 20
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