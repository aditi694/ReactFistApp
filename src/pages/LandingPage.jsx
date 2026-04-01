import React from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Card,
    CardContent,
    Box,
    Stack,
} from "@mui/material";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InsightsIcon from "@mui/icons-material/Insights";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>

            {/* 🔹 HEADER */}
            <AppBar position="static" color="inherit" elevation={1}>
                <Toolbar sx={{ px: 4 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        SmartBank
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/admin-login")}
                        >
                            Admin Login
                        </Button>

                        <Button
                            variant="outlined"
                            onClick={() => navigate("/customer-login")}
                        >
                            Customer Login
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => navigate("/register")}
                        >
                            Signup
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {/* 🔹 HERO */}
            <Container sx={{ py: 10 }}>
                <Grid container spacing={4} alignItems="center">

                    {/* LEFT */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Smart Banking App
                        </Typography>

                        <Typography variant="h6" color="text.secondary" mb={4}>
                            Manage accounts, transfers, analytics, and financial services — all in one place.
                        </Typography>

                        <Stack direction="row" spacing={2}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate("/register")}
                            >
                                Get Started
                            </Button>

                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate("/customer-login")}
                            >
                                Login
                            </Button>
                        </Stack>
                    </Grid>

                    {/* RIGHT */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                height: 260,
                                borderRadius: 3,
                                backgroundColor: "#e3f2fd",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Typography variant="h6" color="primary">
                                Dashboard Preview
                            </Typography>
                        </Box>
                    </Grid>

                </Grid>
            </Container>

            {/* 🔹 FEATURES (ONE LINE CARDS STYLE) */}
            <Container sx={{ pb: 10 }}>
                <Typography variant="h5" fontWeight="bold" mb={4}>
                    Key Features
                </Typography>

                <Grid container spacing={2}>

                    {[
                        {
                            icon: <AccountBalanceIcon color="primary" />,
                            title: "Account Management",
                        },
                        {
                            icon: <SwapHorizIcon color="primary" />,
                            title: "Instant Transfers",
                        },
                        {
                            icon: <SecurityIcon color="primary" />,
                            title: "Secure System",
                        },
                        {
                            icon: <InsightsIcon color="primary" />,
                            title: "Analytics & Reports",
                        },
                        {
                            icon: <SpeedIcon color="primary" />,
                            title: "Fast Processing",
                        },
                    ].map((feature, index) => (
                        <Grid item xs={12} sm={6} md={2.4} key={index}>
                            <Card
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    px: 2,
                                    py: 2,
                                    borderRadius: 2,
                                    boxShadow: 1,
                                }}
                            >
                                <Box mr={2}>{feature.icon}</Box>
                                <Typography variant="body1" fontWeight={500}>
                                    {feature.title}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}

                </Grid>
            </Container>
        </Box>
    );
};

export default LandingPage;