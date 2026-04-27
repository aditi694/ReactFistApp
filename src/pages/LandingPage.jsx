import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar, Toolbar, Typography, Button,
    Container, Grid, Box, Stack,
    Dialog, DialogContent
} from "@mui/material";

const LandingPage = () => {
    const navigate = useNavigate();
    const [openLogin, setOpenLogin] = useState(false);

    return (
        <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh" }}>

            {/* ================= HEADER ================= */}
            <AppBar elevation={0} sx={{
                bgcolor: "#F9FAFC",
                borderBottom: "1px solid #E5E7EB"
            }}>
                <Toolbar sx={{ px: { xs: 2, md: 6 } }}>

                    <Typography color="primary" fontWeight={900} sx={{ flexGrow: 1 }}>
                        UNION BANK
                    </Typography>

                    <Stack direction="row" spacing={3}>

                        <Button onClick={() => setOpenLogin(true)}>
                            Login
                        </Button>

                    </Stack>

                </Toolbar>
            </AppBar>

            {/* ================= HERO ================= */}
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center" mt={6}>

                    {/* LEFT */}
                    <Grid item xs={12} md={6}>
                        <Typography fontSize={12} color="#2563EB" fontWeight={600}>
                            SIMPLE. SECURE. SMART.
                        </Typography>

                        <Typography sx={{
                            fontSize: { xs: 30, md: 40 },
                            fontWeight: 700,
                            mt: 1
                        }}>
                            Banking that makes your life easier.
                        </Typography>

                        <Typography mt={2} color="gray">
                            Manage money, transfer instantly, and track everything in one place.
                        </Typography>

                        <Stack direction="row" spacing={2} mt={3}>
                            <Button
                                variant="contained"
                                onClick={() => navigate("/register")}
                            >
                                Get Started
                            </Button>

                            <Button variant="outlined">
                                Learn More
                            </Button>
                        </Stack>
                    </Grid>

                    {/* RIGHT IMAGE*/}
                    <Grid item xs={12} md={6}>
                        <Box
                            component="img"
                            src="src/assets/phone.png"
                            sx={{
                                width: "100%",
                                maxHeight: 300,
                                objectFit: "cover",
                                borderRadius: 3
                            }}
                        />
                    </Grid>

                </Grid>
            </Container>

            {/* ================= FEATURES ================= */}
            <Container maxWidth="lg">
                <Grid container spacing={4} mt={8}>

                    {[
                        {
                            title: "Secure Banking",
                            desc: "Advanced encryption for safe transactions"
                        },
                        {
                            title: "Instant Transfers",
                            desc: "Send money anytime instantly"
                        },
                        {
                            title: "Smart Insights",
                            desc: "Track and manage your expenses easily"
                        },
                        {
                            title: "Credit Services",
                            desc: "Apply for loans and credit cards easily"
                        },
                        {
                            title: "24/7 Support",
                            desc: "We are always here to help you"
                        },
                        {
                            title: "Easy Payments",
                            desc: "Pay bills and recharge in seconds"
                        }
                    ].map((item, i) => (
                        <Grid item xs={12} md={4} key={i}>
                            <Box sx={{
                                p: 3,
                                borderRadius: 3,
                                bgcolor: "#fff",
                                border: "1px solid #E5E7EB"
                            }}>
                                <Typography fontWeight={600}>
                                    {item.title}
                                </Typography>

                                <Typography fontSize={14} color="gray" mt={1}>
                                    {item.desc}
                                </Typography>
                            </Box>
                        </Grid>
                    ))}

                </Grid>
            </Container>

            {/* ================= TRUST LOGOS ================= */}
            <Box sx={{
                mt: 8,
                py: 3,
                bgcolor: "#fff",
                borderTop: "1px solid #E5E7EB",
                borderBottom: "1px solid #E5E7EB"
            }}>
                <Container maxWidth="lg">
                    <Stack direction="row" spacing={4} justifyContent="center">

                        <Typography color="gray">HDFC</Typography>
                        <Typography color="gray">ICICI</Typography>
                        <Typography color="gray">SBI</Typography>
                        <Typography color="gray">AXIS</Typography>

                    </Stack>
                </Container>
            </Box>

            {/* ================= FOOTER ================= */}
            <Box sx={{
                mt: 8,
                py: 4,
                textAlign: "center",
                bgcolor: "#111827",
                color: "#fff"
            }}>
                <Typography fontWeight={600}>
                    UNION BANK
                </Typography>
                <Typography fontSize={13}>
                    © 2026 Secure Banking System
                </Typography>
            </Box>

            {/* ================= LOGIN MODAL ================= */}
            <Dialog
                open={openLogin}
                onClose={() => setOpenLogin(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 2,
                        width: 320
                    }
                }}
            >
                <DialogContent>

                    <Typography fontWeight={700} fontSize={18} mb={3} textAlign="center">
                        Choose Login Type
                    </Typography>

                    {/* ADMIN CARD */}
                    <Box
                        onClick={() => navigate("/login")}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid #E5E7EB",
                            cursor: "pointer",
                            mb: 2,
                            transition: "0.2s",
                            "&:hover": {
                                borderColor: "#54699a",
                                bgcolor: "#EFF6FF"
                            }
                        }}
                    >
                        <Typography fontWeight={600}>Admin Login</Typography>
                        <Typography fontSize={13} color="gray">
                            Manage users and system
                        </Typography>
                    </Box>

                    {/* CUSTOMER CARD */}
                    <Box
                        onClick={() => navigate("/customer-login")}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid #E5E7EB",
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": {
                                borderColor: "#2563EB",
                                bgcolor: "#EFF6FF"
                            }
                        }}
                    >
                        <Typography fontWeight={600}>Customer Login</Typography>
                        <Typography fontSize={13} color="gray">
                            Access your account & transactions
                        </Typography>
                    </Box>

                </DialogContent>
            </Dialog>

        </Box>
    );
};

export default LandingPage;