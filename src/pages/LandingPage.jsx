import React from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Grid,
    Box,
    Stack
} from "@mui/material";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(180deg,#F8FAFC,#EEF2FF)",
            }}
        >

            {/* HEADER */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: "rgba(255,255,255,0.7)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid #E5E7EB"
                }}
            >
                <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1 }}>

                    {/* LOGO */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexGrow: 1 }}>
                        <Box
                            sx={{
                                width: 28,
                                height: 28,
                                borderRadius: 1,
                                background: "linear-gradient(135deg,#6366F1,#4F46E5)"
                            }}
                        />
                        <Typography fontWeight={800}>
                            UNION BANK
                        </Typography>
                    </Box>

                    {/* NAV BUTTONS */}
                    <Stack direction="row" spacing={1} alignItems="center">

                        <Button
                            sx={{
                                color: "#374151",
                                textTransform: "none",
                                fontWeight: 500
                            }}
                            onClick={() => navigate("/login")}
                        >
                            Admin
                        </Button>

                        <Button
                            sx={{
                                color: "#374151",
                                textTransform: "none",
                                fontWeight: 500
                            }}
                            onClick={() => navigate("/customer-login")}
                        >
                            Login
                        </Button>

                        <Button
                            variant="contained"
                            sx={{
                                textTransform: "none",
                                borderRadius: 3,
                                px: 2.5,
                                background: "linear-gradient(135deg,#6366F1,#4F46E5)",
                                boxShadow: "0 4px 14px rgba(99,102,241,0.4)"
                            }}
                            onClick={() => navigate("/register")}
                        >
                            Get Started
                        </Button>

                    </Stack>

                </Toolbar>
            </AppBar>

            {/* HERO */}
            <Container maxWidth="lg">

                <Box
                    sx={{
                        mt: 6,
                        px: 5,
                        py: 6,
                        borderRadius: 5,
                        bgcolor: "#fff",
                        boxShadow: "0 25px 80px rgba(0,0,0,0.08)",
                        position: "relative",
                        overflow: "hidden"
                    }}
                >

                    {/* BACKGROUND GLOW */}
                    <Box
                        sx={{
                            position: "absolute",
                            top: -50,
                            right: -50,
                            width: 200,
                            height: 200,
                            bgcolor: "#6366F1",
                            opacity: 0.15,
                            borderRadius: "50%",
                            filter: "blur(80px)"
                        }}
                    />

                    <Grid container spacing={6} alignItems="center">

                        {/* LEFT */}
                        <Grid item xs={12} md={6}>

                            <Typography fontSize={14} color="text.secondary" mb={1}>
                                🔥 Trusted by 10M+ users
                            </Typography>

                            <Typography
                                variant="h2"
                                fontWeight={800}
                                lineHeight={1.2}
                            >
                                Banking Made
                                <br />
                                Simple &{" "}
                                <Box component="span" sx={{ color: "#6366F1" }}>
                                    Secure
                                </Box>
                            </Typography>

                            <Typography color="text.secondary" mt={2} mb={4}>
                                Experience seamless payments, instant transfers,
                                and powerful financial insights — all in one platform.
                            </Typography>

                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        borderRadius: 5,
                                        px: 4,
                                        py: 1.2,
                                        background: "linear-gradient(135deg,#6366F1,#4F46E5)"
                                    }}
                                    onClick={() => navigate("/register")}
                                >
                                    Get Started
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    sx={{ borderRadius: 5, px: 4 }}
                                    onClick={() => navigate("/customer-login")}
                                >
                                    Open Account
                                </Button>
                            </Stack>

                        </Grid>

                        {/* RIGHT SIDE (IMPROVED BIG UI 🔥) */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: "relative" }}>

                                {/* MAIN CARD */}
                                <Box
                                    sx={{
                                        p: 3,
                                        borderRadius: 4,
                                        bgcolor: "#F8FAFC",
                                        border: "1px solid #E5E7EB",
                                        boxShadow: "0 15px 40px rgba(0,0,0,0.08)"
                                    }}
                                >
                                    <Typography fontWeight={600}>Dashboard</Typography>

                                    <Box
                                        sx={{
                                            mt: 2,
                                            p: 2,
                                            borderRadius: 3,
                                            background: "linear-gradient(135deg,#6366F1,#4F46E5)",
                                            color: "#fff"
                                        }}
                                    >
                                        <Typography fontSize={12}>Total Balance</Typography>
                                        <Typography variant="h6">₹••••••</Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            mt: 2,
                                            height: 60,
                                            borderRadius: 2,
                                            bgcolor: "#E0E7FF"
                                        }}
                                    />

                                    <Box mt={2}>
                                        <Typography fontSize={13}>
                                            Transfer <span style={{ color: "green" }}>+₹2000</span>
                                        </Typography>
                                        <Typography fontSize={13}>
                                            Shopping <span style={{ color: "red" }}>-₹500</span>
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* FLOATING SMALL CARD 🔥 */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: -20,
                                        right: -20,
                                        p: 2,
                                        borderRadius: 3,
                                        bgcolor: "#fff",
                                        boxShadow: 3,
                                        fontSize: 12
                                    }}
                                >
                                    💳 Card Active
                                </Box>

                                {/* FLOATING BADGE */}
                                <Box
                                    sx={{
                                        position: "absolute",
                                        bottom: -15,
                                        left: -15,
                                        p: 2,
                                        borderRadius: 3,
                                        bgcolor: "#fff",
                                        boxShadow: 3,
                                        fontSize: 12
                                    }}
                                >
                                    ⚡ Instant Transfer
                                </Box>

                            </Box>
                        </Grid>

                    </Grid>
                </Box>

            </Container>

            {/* FOOTER */}
            <Box
                sx={{
                    mt: 8,
                    py: 4,
                    textAlign: "center",
                    bgcolor: "#111827",
                    color: "#fff"
                }}
            >
                <Typography fontWeight={600}>UNION BANK</Typography>
                <Typography fontSize={13} mt={1}>
                    © 2026 Secure Banking System. All rights reserved.
                </Typography>
            </Box>

        </Box>
    );
};

export default LandingPage;