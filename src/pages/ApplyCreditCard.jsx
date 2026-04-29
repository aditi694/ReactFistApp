import {
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Card,
    Stack,
    Fade,
    Chip,
    Divider,
    LinearProgress,
    Tabs,
    Tab,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FlightIcon from "@mui/icons-material/Flight";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import PersonIcon from "@mui/icons-material/Person";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { applyCreditCard, getCreditCardStatus } from "../api/accountApi";

// ─── Color palette ────────────────────────────────────────────────────────────
const BRAND = "#ee0c6ea3";
const BRAND_DARK = "#be3d91";
const BRAND_LIGHT = "#f5e6ee";
const ACCENT = "#12877F";
const GRAY_BG = "#f4f6f8";

// ─── SHARED SECTION HEADER ────────────────────────────────────────────────────
const SectionHeading = ({ children, sub }) => (
    <Box textAlign="center" mb={{ xs: 3, md: 4 }}>
        <Typography
            sx={{
                fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                fontWeight: 700,
                fontFamily: "'Georgia', serif",
                color: "#1a1a2e",
            }}
        >
            {children}
        </Typography>
        {sub && (
            <Typography mt={1} sx={{ color: "text.secondary", fontSize: { xs: 12.5, sm: 14, md: 15 }, px: { xs: 1, sm: 0 } }}>
                {sub}
            </Typography>
        )}
        <Box mt={1.5} mx="auto" sx={{ width: { xs: 36, md: 48 }, height: 3, borderRadius: 2, background: BRAND }} />
    </Box>
);

// ─── CARD VISUAL PREVIEW ─────────────────────────────────────────────────────
const CardPreview = ({
    holderName,
    cardNumber = "**** **** **** 1234",
    variant = "apply",
}) => (
    <Box
        sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: 420, md: 520, lg: 600 },
            height: { xs: 220, sm: 260, md: 300, lg: 340 },
            borderRadius: { xs: "16px", md: "22px" },
            p: { xs: 2.5, sm: 3, md: 3.5 },
            background:
                variant === "active"
                    ? "linear-gradient(135deg, #97144D 0%, #7a0f3d 50%, #3d0820 100%)"
                    : "linear-gradient(135deg, #2563eb 0%, #1e40af 60%, #1e3a8a 100%)",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
        }}
    >
        {/* Background blobs */}
        <Box
            sx={{
                position: "absolute",
                top: { xs: -30, md: -40 },
                right: { xs: -30, md: -40 },
                width: { xs: 120, md: 160 },
                height: { xs: 120, md: 160 },
                borderRadius: "50%",
                background: "rgba(255,255,255,0.06)",
            }}
        />
        <Box
            sx={{
                position: "absolute",
                bottom: { xs: -40, md: -50 },
                left: { xs: -20, md: -30 },
                width: { xs: 140, md: 180 },
                height: { xs: 140, md: 180 },
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
            }}
        />

        {/* Top Row */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
                sx={{
                    fontSize: { xs: 12, md: 14 },
                    letterSpacing: 1.2,
                    opacity: 0.85,
                }}
            >
                Union Bank
            </Typography>

            <Box
                sx={{
                    width: { xs: 40, md: 50 },
                    height: { xs: 24, md: 30 },
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Typography fontSize={{ xs: 10, md: 11 }} fontWeight={700}>
                    VISA
                </Typography>
            </Box>
        </Box>

        {/* Chip */}
        <Box
            sx={{
                mt: { xs: 1.5, md: 2 },
                width: { xs: 40, md: 50 },
                height: { xs: 28, md: 34 },
                background: "rgba(255,215,0,0.7)",
                borderRadius: "8px",
            }}
        />

        {/* Card Number */}
        <Typography
            mt={2}
            sx={{
                fontSize: { xs: 16, md: 20 },
                letterSpacing: { xs: 3, md: 4 },
                opacity: 0.95,
            }}
        >
            {cardNumber}
        </Typography>

        {/* Bottom */}
        <Box mt={2} sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
                <Typography
                    fontSize={{ xs: 10, md: 11 }}
                    sx={{ opacity: 0.7 }}
                >
                    CARD HOLDER
                </Typography>

                <Typography
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: 14, md: 16 },
                        letterSpacing: 0.5,
                    }}
                >
                    {(holderName || "YOUR NAME").toUpperCase()}
                </Typography>
            </Box>

            <Box textAlign="right">
                <Typography
                    fontSize={{ xs: 10, md: 11 }}
                    sx={{ opacity: 0.7 }}
                >
                    EXPIRES
                </Typography>

                <Typography fontWeight={600} fontSize={{ xs: 14, md: 16 }}>
                    12/28
                </Typography>
            </Box>
        </Box>
    </Box>
);

// ════════════════════════════════════════════════════════════════
//  STATE 1 — ACTIVE CARD
// ════════════════════════════════════════════════════════════════
const ActiveCardView = ({ cardStatus }) => {
    const [activeTab, setActiveTab] = useState(0);

    const holderName = cardStatus?.cardHolderName || "Card Holder";
    const creditLimit = cardStatus?.creditLimit || 150000;
    const usedLimit = cardStatus?.usedLimit || 42000;
    const availableLimit = creditLimit - usedLimit;
    const usedPct = Math.round((usedLimit / creditLimit) * 100);
    const firstName = holderName?.split(" ")[0]?.slice(0, 12);

    const benefits = [
        { icon: <EmojiEventsIcon sx={{ color: BRAND }} />, title: "5% Cashback", desc: "On all online transactions" },
        { icon: <FlightIcon sx={{ color: BRAND }} />, title: "Travel Perks", desc: "Complimentary airport lounge access" },
        { icon: <ShoppingCartIcon sx={{ color: BRAND }} />, title: "Reward Points", desc: "2X points on weekends" },
        { icon: <SecurityIcon sx={{ color: BRAND }} />, title: "Zero Liability", desc: "100% fraud protection" },
        { icon: <LocalOfferIcon sx={{ color: BRAND }} />, title: "Exclusive Offers", desc: "Partner discounts & deals" },
        { icon: <AccountBalanceIcon sx={{ color: BRAND }} />, title: "No Annual Fee", desc: "For the first year" },
    ];

    const recentTxns = [
        { name: "Amazon Shopping", date: "25 Apr 2025", amount: "-₹3,200", color: "error.main" },
        { name: "Reward Points Credited", date: "24 Apr 2025", amount: "+150 pts", color: "success.main" },
        { name: "Swiggy Food Order", date: "22 Apr 2025", amount: "-₹580", color: "error.main" },
        { name: "Cashback Credited", date: "20 Apr 2025", amount: "+₹320", color: "success.main" },
    ];

    return (
        <Box sx={{ background: GRAY_BG, minHeight: "100vh" }}>
            {/* ── HERO ── */}
            <Box sx={{ background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 60%, #3d0820 100%)`, py: { xs: 4, sm: 5, md: 7 }, px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, color: "#fff", position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", top: { xs: -80, md: -60 }, right: { xs: -80, md: -60 }, width: { xs: 200, md: 300 }, height: { xs: 200, md: 300 }, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <Grid
                    container
                    spacing={{ xs: 2, sm: 3, md: 6, lg: 8 }}
                    justifyContent="center"
                    sx={{ maxWidth: "1600px", mx: "auto" }}
                >
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={5}>
                        <Fade in timeout={600}>
                            <Box textAlign={{ xs: "center", md: "left" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
                                    <CheckCircleIcon sx={{ color: "#4ade80", fontSize: 20 }} />
                                    <Chip label="ACTIVE" size="small" sx={{ background: "#4ade80", color: "#000", fontWeight: 700, fontSize: 11 }} />
                                </Box>
                                <Typography sx={{ fontWeight: 800, fontFamily: "'Georgia', serif", fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.6rem" }, lineHeight: 1.3 }}>
                                    Welcome back,<br />{firstName}!
                                </Typography>
                                <Typography sx={{ mt: 1.5, opacity: 0.85, fontSize: { xs: 13, sm: 14, md: 15 }, px: { xs: 1, md: 0 } }}>
                                    Your Union Bank Premium Credit Card is active and ready to use.
                                </Typography>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 3 }} mt={3} alignItems={{ xs: "center", md: "flex-start" }}>
                                    {[
                                        { label: "Total Credit Limit", value: `₹${creditLimit.toLocaleString("en-IN")}`, color: "#fff" },
                                        { label: "Available Limit", value: `₹${availableLimit.toLocaleString("en-IN")}`, color: "#4ade80" },
                                        { label: "Amount Used", value: `₹${usedLimit.toLocaleString("en-IN")}`, color: "#fbbf24" },
                                    ].map((s, i) => (
                                        <Box key={i} textAlign={{ xs: "center", md: "left" }}>
                                            <Typography fontSize={12} sx={{ opacity: 0.7 }}>{s.label}</Typography>
                                            <Typography fontWeight={700} fontSize={{ xs: 17, md: 20 }} color={s.color}>{s.value}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={4} justifyContent={{ xs: "center", md: "flex-start" }}>
                                    <Button variant="contained" sx={{ background: "#fff", color: "#000", fontWeight: 600, px: 3, borderRadius: "12px", "&:hover": { background: "#f3f4f6" } }}>View Details</Button>
                                    <Button variant="outlined" sx={{ borderColor: "rgba(255,255,255,0.6)", color: "#fff", fontWeight: 600, px: 3, borderRadius: "12px" }}>Pay Now</Button>
                                </Stack>
                            </Box>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" } }}>
                        <Fade in timeout={900}>
                            <Box sx={{ width: "100%", maxWidth: { xs: 300, sm: 340 } }}>
                                <CardPreview holderName={holderName} variant="active" />
                            </Box>
                        </Fade>
                    </Grid>
                </Grid>
            </Box>

            {/* ── UTILIZATION BAR ── */}
            <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, py: { xs: 2.5, md: 3 }, background: "#fff", borderBottom: "1px solid #eee" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography fontSize={{ xs: 12, md: 13 }} color="text.secondary">Credit Utilization</Typography>
                    <Typography fontSize={{ xs: 12, md: 13 }} fontWeight={600} color={usedPct > 70 ? "error.main" : BRAND}>{usedPct}% used</Typography>
                </Box>
                <LinearProgress variant="determinate" value={usedPct} sx={{ height: { xs: 8, md: 10 }, borderRadius: 5, backgroundColor: "#f3f4f6", "& .MuiLinearProgress-bar": { background: usedPct > 70 ? "linear-gradient(90deg,#f97316,#ef4444)" : `linear-gradient(90deg,${BRAND},${BRAND_DARK})`, borderRadius: 5 } }} />
                <Typography fontSize={{ xs: 11, md: 12 }} color="text.secondary" mt={0.8}>
                    Recommended: keep utilization below <Box component="span" fontWeight={600}>30%</Box> for better credit score
                </Typography>
            </Box>

            {/* ── TABS ── */}
            <Box sx={{ px: { xs: 0, sm: 2, md: 8 }, background: "#fff", borderBottom: "1px solid #eee" }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile
                    sx={{ "& .MuiTab-root": { fontWeight: 600, textTransform: "none", fontSize: { xs: 12, md: 14 }, minHeight: { xs: 44, md: 48 }, px: { xs: 1.5, md: 2 } }, "& .Mui-selected": { color: BRAND }, "& .MuiTabs-indicator": { height: 3, borderRadius: 2, background: BRAND } }}>
                    <Tab label="Benefits & Features" />
                    <Tab label="Recent Activity" />
                    <Tab label="Card Details" />
                </Tabs>
            </Box>

            <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, py: { xs: 4, md: 5 } }}>
                {/* TAB 0 */}
                {activeTab === 0 && (
                    <Fade in timeout={400}><Box>
                        <SectionHeading sub="Exclusive privileges on your Union Bank Credit Card">Your Card Benefits</SectionHeading>
                        <Grid container spacing={{ xs: 2, sm: 3 }}>
                            {benefits.map((b, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Card sx={{ p: { xs: 2.2, md: 3 }, borderRadius: 3, border: "1px solid #f3e8ef", height: "100%", transition: "all 0.25s", "&:hover": { boxShadow: "0 10px 30px rgba(151,20,77,0.12)", transform: { md: "translateY(-4px)" }, borderColor: BRAND } }}>
                                        <Box sx={{ mb: 1.5, p: 1.2, display: "inline-flex", borderRadius: 2, background: BRAND_LIGHT }}>{b.icon}</Box>
                                        <Typography fontWeight={700} sx={{ fontSize: { xs: 14, md: 15 } }}>{b.title}</Typography>
                                        <Typography sx={{ fontSize: { xs: 12.5, md: 13 }, color: "text.secondary", mt: 0.5 }}>{b.desc}</Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box mt={{ xs: 4, md: 5 }} sx={{ background: `linear-gradient(135deg,${BRAND} 0%,${BRAND_DARK} 100%)`, borderRadius: { xs: 3, md: 4 }, p: { xs: 2.5, sm: 3, md: 4 }, display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", gap: 2, color: "#fff" }}>
                            <Box>
                                <Typography fontWeight={700} sx={{ fontSize: { xs: 16, md: 18 } }}>Refer & Earn ₹500</Typography>
                                <Typography sx={{ fontSize: { xs: 13, md: 14 }, opacity: 0.85, mt: 0.5 }}>Invite friends and family to apply for a Union Bank Credit Card today.</Typography>
                            </Box>
                            <Button variant="outlined" sx={{ color: "#fff", borderColor: "rgba(255,255,255,0.8)", fontWeight: 600, px: 3, borderRadius: "12px", alignSelf: { xs: "stretch", md: "auto" }, "&:hover": { background: "rgba(255,255,255,0.1)" } }}>Explore More</Button>
                        </Box>
                    </Box></Fade>
                )}

                {/* TAB 1 */}
                {activeTab === 1 && (
                    <Fade in timeout={400}><Box>
                        <SectionHeading sub="Your latest transactions and credit activity">Recent Activity</SectionHeading>
                        <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                            {recentTxns.map((txn, i) => (
                                <Box key={i}>
                                    <Box sx={{ px: { xs: 2, md: 3 }, py: { xs: 2, md: 2.5 }, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 }, minWidth: 0 }}>
                                            <Box sx={{ width: { xs: 36, md: 42 }, height: { xs: 36, md: 42 }, borderRadius: "50%", background: BRAND_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                                <CreditCardIcon sx={{ color: BRAND, fontSize: { xs: 18, md: 20 } }} />
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography fontWeight={600} sx={{ fontSize: { xs: 13, md: 14 }, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{txn.name}</Typography>
                                                <Typography sx={{ fontSize: { xs: 11, md: 12 }, color: "text.secondary" }}>{txn.date}</Typography>
                                            </Box>
                                        </Box>
                                        <Typography fontWeight={700} sx={{ fontSize: { xs: 13, md: 15 }, color: txn.color, whiteSpace: "nowrap" }}>{txn.amount}</Typography>
                                    </Box>
                                    {i < recentTxns.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </Card>
                    </Box></Fade>
                )}

                {/* TAB 2 */}
                {activeTab === 2 && (
                    <Fade in timeout={400}>
                        <Box>
                            <SectionHeading sub="Your credit card information at a glance">
                                Card Details
                            </SectionHeading>

                            <Box
                                sx={{
                                    maxWidth: "1100px",
                                    mx: "auto",
                                }}
                            >
                                <Grid
                                    container
                                    spacing={{ xs: 4, md: 6 }}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Grid item xs={12} md={6} display="flex" justifyContent="center">
                                        <Box
                                            sx={{
                                                width: "100%",
                                                maxWidth: { xs: 320, sm: 420, md: 520 },
                                            }}
                                        >
                                            <CardPreview holderName={holderName} variant="active" />
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Card
                                            sx={{
                                                borderRadius: 4,
                                                p: { xs: 2.5, md: 3.5 },
                                                boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
                                            }}
                                        >
                                            {[
                                                { label: "Card Holder Name", value: holderName },
                                                { label: "Card Number", value: "**** **** **** 1234" },
                                                { label: "Card Type", value: "Union Bank Premium Visa Credit Card" },
                                                { label: "Card Status", value: "ACTIVE", chip: true },
                                                { label: "Total Credit Limit", value: `₹${creditLimit.toLocaleString("en-IN")}` },
                                                { label: "Available Limit", value: `₹${availableLimit.toLocaleString("en-IN")}` },
                                                { label: "Statement Date", value: "5th of every month" },
                                                { label: "Due Date", value: "25th of every month" },
                                            ].map((row, i) => (
                                                <Box key={i}>
                                                    <Box
                                                        sx={{
                                                            py: { xs: 1.5, md: 1.8 },
                                                            display: "flex",
                                                            justifyContent: "space-between",
                                                            alignItems: "center",
                                                            gap: 2,
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        <Typography
                                                            sx={{
                                                                fontSize: { xs: 13, md: 14 },
                                                                color: "text.secondary",
                                                            }}
                                                        >
                                                            {row.label}
                                                        </Typography>

                                                        {row.chip ? (
                                                            <Chip
                                                                label={row.value}
                                                                size="small"
                                                                sx={{
                                                                    background: "#dcfce7",
                                                                    color: "#15803d",
                                                                    fontWeight: 700,
                                                                    fontSize: 12,
                                                                }}
                                                            />
                                                        ) : (
                                                            <Typography
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    fontSize: { xs: 13, md: 15 },
                                                                    textAlign: "right",
                                                                }}
                                                            >
                                                                {row.value}
                                                            </Typography>
                                                        )}
                                                    </Box>

                                                    {i < 7 && <Divider />}
                                                </Box>
                                            ))}
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Fade>
                )}
            </Box>
        </Box>
    );
};

// ════════════════════════════════════════════════════════════════
//  STATE 2 — PENDING APPROVAL
// ════════════════════════════════════════════════════════════════
const PendingCardView = () => {
    const steps = [
        { label: "Application Submitted", done: true },
        { label: "Document Verification", done: true },
        { label: "Credit Assessment", done: false, active: true },
        { label: "Approval Decision", done: false },
        { label: "Card Dispatch", done: false },
    ];

    const items = [
        { title: "Verification Call", desc: "Our representative may call you for verification within 24 hours." },
        { title: "Document Submission", desc: "Ensure your documents (PAN, Aadhaar, income proof) are readily available." },
        { title: "Decision Notification", desc: "You'll receive an SMS and email once a decision has been made." },
        { title: "Card Delivery", desc: "Approved cards are delivered within 7–10 working days." },
    ];

    return (
        <Box sx={{ background: GRAY_BG, minHeight: "100vh" }}>
            <Box sx={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)", py: { xs: 4, sm: 5, md: 7 }, px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, color: "#fff", textAlign: "center" }}>
                <AccessTimeIcon sx={{ fontSize: { xs: 44, md: 56 }, mb: 1 }} />
                <Typography sx={{ fontWeight: 800, fontFamily: "'Georgia', serif", fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.4rem" } }}>Application Under Review</Typography>
                <Typography mt={1.5} sx={{ opacity: 0.9, maxWidth: 480, mx: "auto", fontSize: { xs: 13, md: 15 }, px: { xs: 1, md: 0 } }}>
                    We've received your credit card application and our team is currently reviewing it. This typically takes 3–5 business days.
                </Typography>
            </Box>

            <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, py: { xs: 4, md: 5 } }}>
                <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
                    {/* Progress tracker */}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={5}>
                        <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
                            <Typography fontWeight={700} fontSize={{ xs: 15, md: 17 }} mb={3}>Application Progress</Typography>
                            {steps.map((step, i) => (
                                <Box key={i} sx={{ display: "flex", gap: 2, alignItems: "flex-start", mb: i < steps.length - 1 ? 1.5 : 0 }}>
                                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <Box sx={{ width: { xs: 24, md: 28 }, height: { xs: 24, md: 28 }, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step.done ? ACCENT : step.active ? "#f59e0b" : "#e5e7eb", color: "#fff", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                            {step.done ? "✓" : i + 1}
                                        </Box>
                                        {i < steps.length - 1 && <Box sx={{ width: 2, height: { xs: 28, md: 36 }, background: step.done ? ACCENT : "#e5e7eb", my: 0.5 }} />}
                                    </Box>
                                    <Box pt={0.2}>
                                        <Typography sx={{ fontWeight: step.active ? 700 : 500, fontSize: { xs: 13, md: 14 }, color: step.done ? ACCENT : step.active ? "#d97706" : "text.secondary" }}>{step.label}</Typography>
                                        {step.active && <Typography fontSize={11} color="text.secondary" mt={0.3}>Currently in progress</Typography>}
                                    </Box>
                                </Box>
                            ))}
                        </Card>
                    </Grid>

                    {/* What happens next */}
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={5}>
                        <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
                            <Typography fontWeight={700} fontSize={{ xs: 15, md: 17 }} mb={3}>What happens next?</Typography>
                            {items.map((item, i) => (
                                <Box key={i} sx={{ display: "flex", gap: 2, mb: 2 }}>
                                    <Box sx={{ mt: 0.3, color: "#f59e0b", flexShrink: 0 }}><InfoOutlinedIcon fontSize="small" /></Box>
                                    <Box>
                                        <Typography fontWeight={600} fontSize={{ xs: 13, md: 14 }}>{item.title}</Typography>
                                        <Typography fontSize={{ xs: 12, md: 13 }} color="text.secondary" mt={0.3}>{item.desc}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Card>

                        {/* Track Banner */}
                        <Box mt={3} sx={{ background: `linear-gradient(135deg,${BRAND} 0%,${BRAND_DARK} 100%)`, borderRadius: 3, p: { xs: 2.5, md: 3 }, color: "#fff", display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2 }}>
                            <Box>
                                <Typography fontWeight={700} fontSize={{ xs: 14, md: 15 }}>Already applied? Track your application</Typography>
                                <Typography fontSize={{ xs: 12, md: 13 }} sx={{ opacity: 0.85, mt: 0.5 }}>Have your Application ID or PAN card ready</Typography>
                            </Box>
                            <Button variant="outlined" sx={{ color: "#fff", borderColor: "#fff", fontWeight: 600, borderRadius: "12px", alignSelf: { xs: "stretch", sm: "auto" }, "&:hover": { background: "rgba(255,255,255,0.1)" } }}>
                                Track Now
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

// ════════════════════════════════════════════════════════════════
//  STATE 3 — APPLY NEW CARD
// ════════════════════════════════════════════════════════════════
const ApplyNewCard = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isValidName = (n) => /^[A-Za-z]+ [A-Za-z]+/.test(n.trim());

    const handleApply = async () => {
        setMessage(""); setError(false);
        if (!isValidName(name)) { setMessage("Enter valid full name (first & last name)"); setError(true); return; }
        try {
            setLoading(true);
            const res = await applyCreditCard({ cardHolderName: name.trim() });
            if (res?.error) { setMessage(res.message || "Something went wrong"); setError(true); return; }
            const status = res?.data?.status;
            if (status === "APPROVED") setMessage("🎉 Your credit card is approved instantly!");
            else if (status === "PENDING_APPROVAL") setMessage("⏳ Your application is under review.");
            else if (status === "REJECTED") { setMessage("❌ Application rejected"); setError(true); }
            else setMessage("Application submitted successfully");
            const updated = await getCreditCardStatus();
            const newStatus = updated?.data?.data;
            localStorage.setItem("cardStatus", JSON.stringify(newStatus));
            window.location.reload();
        } catch (e) {
            setMessage("Something went wrong. Please try again."); setError(true);
        } finally { setLoading(false); }
    };

    const cards = [
        {
            tags: ["Travel", "UPI Card"],
            title: "IndiGo Union Bank Credit Card",
            color: "#3b82f6",
            benefits: ["Welcome voucher worth 1200 IndiGo BluChips on fee payment.", "Milestone Vouchers worth 1200 IndiGo BluChips on cumulative spends."],
            joining: "799", annual: "799", best: true,
        },
        {
            tags: ["Travel"],
            title: "IndiGo Union Bank Premium Credit Card",
            color: "#8b5cf6",
            benefits: ["Welcome voucher worth 5000 IndiGo BluChips.", "Milestone Vouchers worth 5000 IndiGo BluChips."],
            joining: "5,000", annual: "5,000", best: true,
        },
        {
            tags: ["Lifestyle", "UPI Card", "Shopping"],
            title: "Neo Credit Card",
            color: "#0ea5e9",
            benefits: ["Welcome benefit of up to ₹300* on Utility bill payment.", "Monthly 2 times - Flat ₹120* off on Zomato."],
            joining: "NIL", annual: "NIL",
        },
        {
            tags: ["Travel", "UPI Card"],
            title: "IndiGo Union Bank Credit Card",
            color: "#3b82f6",
            benefits: ["Welcome voucher worth 1200 IndiGo BluChips on fee payment.", "Milestone Vouchers worth 1200 IndiGo BluChips on cumulative spends."],
            joining: "799", annual: "799", best: true,
        },
        {
            tags: ["Travel"],
            title: "IndiGo Union Bank Premium Credit Card",
            color: "#8b5cf6",
            benefits: ["Welcome voucher worth 5000 IndiGo BluChips.", "Milestone Vouchers worth 5000 IndiGo BluChips."],
            joining: "5,000", annual: "5,000", best: true,
        },
        {
            tags: ["Lifestyle", "UPI Card", "Shopping"],
            title: "Neo Credit Card",
            color: "#0ea5e9",
            benefits: ["Welcome benefit of up to ₹300* on Utility bill payment.", "Monthly 2 times - Flat ₹120* off on Zomato."],
            joining: "NIL", annual: "NIL",
        }
    ];

    const eligibility = [
        { icon: <PersonIcon sx={{ color: BRAND }} />, title: "Age", desc: "Primary cardholder should be between the age of 18 and 70 years." },
        { icon: <TrendingUpIcon sx={{ color: BRAND }} />, title: "Income", desc: "Minimum income required is ₹15,000 per month." },
        { icon: <HomeIcon sx={{ color: BRAND }} />, title: "Residential status", desc: "The individual should either be a resident of India or a non-resident Indian." },
        { icon: <DescriptionIcon sx={{ color: BRAND }} />, title: "Documents required", desc: "PAN card, Aadhaar card, Passport or Driver's license, income proof etc." },
    ];
    const sliderRef = useRef(null);

    const scrollToCard = (direction) => {
        const container = sliderRef.current;
        if (!container) return;

        const cardWidth = container.children[0]?.offsetWidth || 300; // fallback
        const gap = 24; // gap between cards (adjust according to your sx gap)

        const scrollAmount = (cardWidth + gap) * (direction === 'next' ? 1 : -1);

        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    // Optional: Auto-center clicked card (keep if you like it)
    const handleCardClick = (index) => {
        const container = sliderRef.current;
        if (!container) return;

        const card = container.children[index];
        if (!card) return;

        const containerWidth = container.offsetWidth;
        const cardWidth = card.offsetWidth;

        const scrollPosition = card.offsetLeft - (containerWidth / 2) + (cardWidth / 2);

        container.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
        });
    };
    return (
        <Box sx={{ background: "#fff" }}>

            {/* ── HERO ── */}
            <Box sx={{ background: `linear-gradient(135deg,${BRAND} 0%,${BRAND_DARK} 60%,#3d0820 100%)`, py: { xs: 4, sm: 5, md: 9 }, px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, color: "#fff", position: "relative", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", top: { xs: -100, md: -80 }, right: { xs: -100, md: -80 }, width: { xs: 250, md: 400 }, height: { xs: 250, md: 400 }, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                <Grid container spacing={{ xs: 4, md: 5 }} justifyContent="center">
                    <Grid item xs={12} md={7}>
                        <Fade in timeout={700}>
                            <Box textAlign={{ xs: "center", md: "left" }}>
                                <Typography sx={{ fontWeight: 800, fontFamily: "'Georgia', serif", fontSize: { xs: "1.7rem", sm: "2rem", md: "3.2rem" }, lineHeight: 3.2 }}>
                                    Apply for Credit Card online
                                </Typography>
                                <Typography mt={0} sx={{ fontWeight: 800, opacity: 0.88, maxWidth: 520, fontSize: { xs: 13, md: 18 }, lineHeight: 1.7, mx: { xs: "auto", md: 0 } }}>
                                    Credit cards are important financial instruments that come with a variety of advantages.
                                </Typography>
                                <Stack direction="row" spacing={{ xs: 3, sm: 4 }} mt={4} justifyContent={{ xs: "center", md: "flex-start" }}>
                                    {[{ v: "44+", l: "Credit Cards" }, { v: "1M+", l: "Happy Customers" }, { v: "Instant", l: "Approval" }].map((s, i) => (
                                        <Box key={i} textAlign={{ xs: "center", md: "left" }}>
                                            <Typography fontWeight={900} fontSize={{ xs: 18, md: 26 }}>{s.v}</Typography>
                                            <Typography fontSize={{ xs: 14, md: 24 }} sx={{ opacity: 0.75 }}>{s.l}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Fade>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Fade in timeout={1000}>
                            <Card sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 4, width: "100%", maxWidth: 380, mx: "auto" }}>
                                <Typography fontWeight={700} fontSize={16} mb={0.5}>Start your application</Typography>
                                <Typography fontSize={12.5} color="text.secondary" mb={2.5}>Takes less than 2 minutes</Typography>
                                <CardPreview holderName={name} />
                                <TextField fullWidth label="Full Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2.5 }} size="small" />
                                <Button fullWidth variant="contained" onClick={handleApply} disabled={loading}
                                    sx={{ mt: 2, py: 1.3, background: BRAND, fontWeight: 700, borderRadius: "12px", "&:hover": { background: BRAND_DARK }, "&:active": { transform: "scale(0.97)" } }}>
                                    {loading ? "Processing..." : "Apply Now"}
                                </Button>
                                {message && <Typography mt={2} fontSize={12} color={error ? "error.main" : "success.main"}>{message}</Typography>}
                            </Card>
                        </Fade>
                    </Grid>
                </Grid>
            </Box >

            {/* ── CARD LISTING ── */}
            < Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, py: { xs: 4, md: 6 }, background: "#f9fafb" }}>
                <SectionHeading>Apply for Credit Card online</SectionHeading>

                {/* ✅ Card grid */}
                <Box
                    ref={sliderRef}
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: { xs: 2, sm: 3 },
                        px: { xs: 2, sm: 4 },
                        pb: 2,
                        scrollSnapType: "x mandatory",
                        scrollBehavior: "smooth",
                        WebkitOverflowScrolling: "touch",
                        "&::-webkit-scrollbar": { display: "none" },
                        "& > *": {
                            scrollSnapAlign: "center",
                            flex: "0 0 auto",
                        },
                    }}
                >

                    {cards.map((card, i) => (
                        <Box
                            key={i}
                            onClick={() => handleCardClick(i)}
                            sx={{
                                width: {
                                    xs: "85%",      // Better for mobile
                                    sm: "48%",
                                    md: "32%"
                                },
                                scrollSnapAlign: "center",
                                cursor: "pointer",
                            }}
                        >
                            <Card sx={{ borderRadius: 3, border: "1px solid #eee", height: "100%", display: "flex", flexDirection: "column", transition: "all 0.25s ease", "&:hover": { boxShadow: { md: "0 12px 40px rgba(0,0,0,0.12)" }, transform: { md: "translateY(-4px)" } } }}>

                                {card.best && (
                                    <Box sx={{ background: BRAND, py: 0.6, px: 2 }}>
                                        <Typography fontSize={11} color="#fff" fontWeight={700}>⭐ Best Seller</Typography>
                                    </Box>
                                )}

                                <Box p={{ xs: 2, md: 2.5 }} flex={1} display="flex" flexDirection="column">
                                    <Stack direction="row" spacing={0.5} mb={1} flexWrap="wrap" useFlexGap>
                                        {card.tags.map((t) => (
                                            <Chip key={t} label={t} size="small" sx={{ fontSize: 10, color: BRAND, background: BRAND_LIGHT, fontWeight: 600 }} />
                                        ))}
                                    </Stack>

                                    <Typography fontWeight={700} sx={{ fontSize: { xs: 14, md: 15 }, minHeight: { xs: "auto", md: 40 }, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                        {card.title}
                                    </Typography>

                                    <Box sx={{ height: { xs: 70, md: 90 }, borderRadius: 2, background: `linear-gradient(135deg,${card.color},${card.color}88)`, my: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <CreditCardIcon sx={{ color: "rgba(255,255,255,0.6)", fontSize: { xs: 32, md: 40 } }} />
                                    </Box>

                                    {card.benefits.map((b, j) => (
                                        <Box key={j} sx={{ display: "flex", gap: 1, mb: 0.6 }}>
                                            <CheckCircleIcon sx={{ color: ACCENT, fontSize: 15, mt: 0.2, flexShrink: 0 }} />
                                            <Typography sx={{ fontSize: { xs: 11.5, md: 12 }, color: "text.secondary", lineHeight: 1.5 }}>{b}</Typography>
                                        </Box>
                                    ))}

                                    <Box sx={{ flex: 1 }} />
                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Box>
                                            <Typography fontSize={11} color="text.secondary">Joining Fee</Typography>
                                            <Typography fontWeight={700} fontSize={13}>₹{card.joining}</Typography>
                                        </Box>
                                        <Box textAlign="right">
                                            <Typography fontSize={11} color="text.secondary">Annual Fee</Typography>
                                            <Typography fontWeight={700} fontSize={13}>₹{card.annual}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Box sx={{ px: { xs: 2, md: 2.5 }, pb: { xs: 2, md: 2.5 }, display: "flex", gap: 1, flexDirection: { xs: "column", sm: "row" } }}>
                                    <Button variant="outlined" fullWidth size="medium"
                                        sx={{ borderRadius: "8px", borderColor: BRAND, color: BRAND, fontWeight: 600, fontSize: { xs: 13, md: 13 }, py: 1, "&:hover": { background: BRAND_LIGHT }, "&:active": { transform: "scale(0.97)" } }}>
                                        Know More
                                    </Button>
                                    <Button variant="contained" fullWidth size="medium"
                                        sx={{ borderRadius: "8px", background: BRAND, fontWeight: 600, fontSize: { xs: 13, md: 13 }, py: 1, "&:hover": { background: BRAND_DARK }, "&:active": { transform: "scale(0.97)" } }}>
                                        Apply Now
                                    </Button>
                                </Box>
                            </Card>
                        </Box>
                    ))}
                </Box>
            </Box >

            {/* ── HOW TO APPLY ── */}
            < Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, py: { xs: 4, md: 6 }, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <SectionHeading>How to apply for a Credit Card?</SectionHeading>
                <Box sx={{ background: `linear-gradient(135deg,${BRAND} 0%,${BRAND_DARK} 100%)`, borderRadius: { xs: 3, md: 4 }, p: { xs: 2.5, sm: 3, md: 5 }, color: "#fff", display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", gap: { xs: 3, md: 4 }, maxWidth: { xs: "100%", md: 1200, lg: 1400, xl: 1600 }, mx: "auto" }}>
                    <Box sx={{ width: { xs: "100%", md: 240 }, height: { xs: 140, md: 200 }, borderRadius: 3, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <PersonIcon sx={{ fontSize: { xs: 60, md: 80 }, opacity: 0.4 }} />
                    </Box>
                    <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
                        <Typography sx={{ fontWeight: 700, fontFamily: "'Georgia', serif", fontSize: { xs: 18, md: 22 } }} mb={1}>Credit card application made easy</Typography>
                        <Typography sx={{ fontSize: { xs: 13, md: 14 }, opacity: 0.85 }} mb={3}>Just follow these steps</Typography>
                        {[
                            { n: 1, title: "Specify your customer status", desc: "Indicate whether you are a new or existing Union Bank customer." },
                            { n: 2, title: "Check eligibility and offers", desc: "Provide the required information and check your eligibility and tailored offers." },
                        ].map((s) => (
                            <Box key={s.n} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "flex-start", justifyContent: { xs: "center", md: "flex-start" }, textAlign: "left" }}>
                                <Box sx={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{s.n}</Box>
                                <Box>
                                    <Typography fontWeight={700} fontSize={{ xs: 13, md: 14 }}>{s.title}</Typography>
                                    <Typography sx={{ fontSize: { xs: 12, md: 13 }, opacity: 0.8, lineHeight: 1.5 }}>{s.desc}</Typography>
                                </Box>
                            </Box>
                        ))}
                        <Button variant="outlined" sx={{
                            mt: 2, px: 2, py: 0.5, fontSize: { xs: 12, md: 13 }, borderRadius: "8px", color: "#fff", borderColor: "#fff", fontWeight: 600, alignSelf: "center", width: "fit-content", minWidth: "unset", "&:hover": {
                                background: "rgba(255,255,255,0.1)"
                            }
                        }}
                        >
                            Apply Now
                        </Button>
                    </Box>
                </Box>
            </Box >

            {/* ── ELIGIBILITY ── */}
            <Box
                sx={{
                    px: { xs: 2, sm: 4, md: 4, lg: 8 },
                    py: { xs: 6, md: 8 },
                    background: "#f3f4f6",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: { xs: "100%", md: 1100, lg: 1300 },
                        borderRadius: "24px",
                        px: { xs: 2.5, sm: 4, md: 8 },
                        py: { xs: 4, sm: 5, md: 7 },
                        color: "#fff",
                        background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND_DARK} 100%)`,
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: 18, sm: 20, md: 24 },
                            fontWeight: 600,
                            mb: { xs: 3, md: 6 },
                            textAlign: "center",
                        }}
                    >
                        Credit Card Eligibility Criteria
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                                md: "1fr 1fr 1fr 1fr",
                            },
                            gap: { xs: 2, sm: 3, md: 4 },
                        }}
                    >
                        {eligibility.map((e, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "row", md: "column" },
                                    alignItems: { xs: "flex-start", md: "center" },
                                    gap: { xs: 1.5, md: 1 },
                                    textAlign: { xs: "left", md: "center" },
                                }}
                            >
                                <Box
                                    sx={{
                                        width: { xs: 40, md: 48 },
                                        height: { xs: 40, md: 48 },
                                        borderRadius: "12px",
                                        background: "rgba(255,255,255,0.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    {e.icon}
                                </Box>

                                <Box>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            fontSize: { xs: 13, md: 14 },
                                            mb: 0.5,
                                        }}
                                    >
                                        {e.title}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: { xs: 12, md: 13 },
                                            color: "rgba(255,255,255,0.85)",
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        {e.desc}
                                    </Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Typography
                        sx={{
                            fontSize: { xs: 12, md: 13 },
                            color: "rgba(255,255,255,0.7)",
                            mt: { xs: 4, md: 5 },
                            maxWidth: 720,
                            mx: "auto",
                            lineHeight: 1.6,
                            textAlign: "center",
                        }}
                    >
                        Additionally, the bank may also look at your credit score and credit history to determine eligibility. Please note that these criteria are only indicative, & the bank reserves the right to approve or decline applications for its credit cards.
                    </Typography>

                    <Box
                        sx={{
                            mt: { xs: 4, md: 5 },
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            onClick={handleApply}
                            fullWidth
                            sx={{
                                maxWidth: { xs: "100%", sm: 400, md: 600 },
                                py: { xs: 1.2, md: 1.4 },
                                borderRadius: "12px",
                                background: "#e5e5e5",
                                color: BRAND,
                                fontSize: { xs: 13, md: 14 },
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                    background: "#dcdcdc",
                                },
                            }}
                        >
                            Apply Now
                        </Button>
                    </Box>
                </Box>
            </Box>
            {/* ── EMI CALCULATOR ── */}
            < EmiCalculator />

            {/* ── SERVICES ── */}
            <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, py: { xs: 4, md: 6 } }}>
                <SectionHeading sub="A diverse range of services, including rewards, travel perks, fraud protection & more that add value to your transactions.">
                    Need information on Credit Card services?
                </SectionHeading>

                <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center" sx={{ maxWidth: 1000, mx: "auto" }}>
                    {[
                        { icon: <TrendingUpIcon sx={{ color: BRAND, fontSize: { xs: 28, md: 36 } }} />, label: "Credit Limit Increase", disabled: false },
                        { icon: <AccountBalanceIcon sx={{ color: BRAND, fontSize: { xs: 28, md: 36 } }} />, label: "Instant loan on credit card", disabled: false },
                        { icon: <SecurityIcon sx={{ color: "#9ca3af", fontSize: { xs: 28, md: 36 } }} />, label: "Credit Card against Fixed Deposit", disabled: true },
                    ].map((s, i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card
                                sx={{
                                    p: { xs: 2.5, md: 3 },
                                    textAlign: "center",
                                    borderRadius: 3,
                                    border: "1px solid #eee",
                                    cursor: s.disabled ? "not-allowed" : "pointer",
                                    opacity: s.disabled ? 0.5 : 1,
                                    transition: "all 0.25s",
                                    "&:hover": {
                                        boxShadow: { md: s.disabled ? "none" : "0 8px 24px rgba(0,0,0,0.1)" },
                                        transform: { md: s.disabled ? "none" : "translateY(-2px)" },
                                    },
                                }}
                            >
                                {s.icon}
                                <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, md: 14 }, mt: 1 }}>
                                    {s.label}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box
                    mt={4}
                    sx={{
                        background: `linear-gradient(135deg,${BRAND} 0%,${BRAND_DARK} 100%)`,
                        borderRadius: 3,
                        px: { xs: 2.5, md: 4 },
                        py: { xs: 2.5, md: 3 },
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ p: 1.2, background: "rgba(255,255,255,0.15)", borderRadius: 2 }}>
                            <DescriptionIcon sx={{ color: "#fff", fontSize: { xs: 20, md: 24 } }} />
                        </Box>
                        <Box>
                            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: { xs: 14, md: 15 } }}>
                                Fees and charges
                            </Typography>
                            <Typography sx={{ color: "#fff", fontSize: { xs: 12, md: 13 }, opacity: 0.85 }}>
                                Know about our credit card fees and charges.
                            </Typography>
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        sx={{
                            flex: { sm: 1 },
                            maxWidth: { sm: 420 },
                            height: 44,
                            borderRadius: 2,
                            fontWeight: 700,
                            background: "#fff",
                            color: BRAND,
                            "&:hover": { background: "#f3f4f6" },
                        }}
                    >
                        LEARN MORE
                    </Button>
                </Box>
            </Box>

            {/* ── TRACK BANNER ── */}
            < Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, pb: { xs: 4, md: 6 } }}>
                <Box sx={{ borderRadius: { xs: 3, md: 4 }, overflow: "hidden", display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: { xs: "auto", md: 220 }, maxWidth: { xs: "100%", md: 1200, lg: 1400, xl: 1600 }, mx: "auto" }}>
                    <Box sx={{ flex: 1, background: "linear-gradient(135deg,#e0e7ff,#c7d2fe)", display: "flex", alignItems: "center", justifyContent: "center", py: { xs: 3, md: 0 }, minHeight: { xs: 130, md: "auto" } }}>
                        <PersonIcon sx={{ fontSize: { xs: 60, md: 80 }, color: "#6366f1", opacity: 0.5 }} />
                    </Box>
                    <Box sx={{ flex: 1.5, background: BRAND, p: { xs: 2.5, sm: 3, md: 5 }, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: { xs: "center", md: "left" } }}>
                        <Typography sx={{ fontWeight: 800, fontFamily: "'Georgia', serif", fontSize: { xs: 18, sm: 20, md: 24 }, lineHeight: 1.3 }}>
                            Already applied?<br />Track your application here
                        </Typography>
                        <Typography sx={{ mt: 1, fontSize: { xs: 13, md: 14 }, opacity: 0.85, maxWidth: { md: 420 }, mx: { xs: "auto", md: 0 } }}>
                            Have your Application ID or PAN card ready for a hassle-free experience
                        </Typography>
                        <Box mt={3}>
                            <Button variant="outlined" sx={{ px: 3, py: 1, borderRadius: "12px", color: "#fff", borderColor: "#fff", fontWeight: 700, "&:hover": { background: "rgba(255,255,255,0.1)" } }}>
                                Track Now
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box >
        </Box >
    );
};

// ── EMI Calculator ─────────────────────────────────────────────────────────
const EmiCalculator = () => {
    const [loan, setLoan] = useState(25000);
    const [tenure, setTenure] = useState(12);
    const rate = 18;
    const mr = rate / 12 / 100;
    const emi = loan * mr * Math.pow(1 + mr, tenure) / (Math.pow(1 + mr, tenure) - 1);
    const total = emi * tenure;
    const totalInterest = total - loan;
    const processingFee = 500;
    const gstOnInterest = Math.round(totalInterest * 0.18);
    const gstOnPF = Math.round(processingFee * 0.18);
    const totalPayable = total + processingFee + gstOnInterest + gstOnPF;

    return (
        <Box sx={{ px: { xs: 2, sm: 4, md: 6, lg: 10, xl: 14 }, py: { xs: 4, md: 6 }, background: "#f9fafb" }}>
            <SectionHeading sub={<>A <Box component="span" sx={{ color: BRAND, textDecoration: "underline", cursor: "pointer" }}>Credit Card EMI calculator</Box> helps you manage your outstanding Credit Card loan better.</>}>
                Credit Card EMI Calculator
            </SectionHeading>
            <Box sx={{ maxWidth: 1100, mx: "auto" }}>
                <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={5}>
                        <Card sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "16px" }}>
                            <Typography fontWeight={600} mb={2} fontSize={{ xs: 14, md: 15 }}>Loan Amount</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <input type="range" min={1500} max={1000000} value={loan} onChange={(e) => setLoan(+e.target.value)} style={{ width: "100%", accentColor: BRAND, height: "4px" }} />
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography fontSize={11} color="text.secondary">1.5K</Typography>
                                        <Typography fontSize={11} color="text.secondary">10L</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ border: "1px solid #ddd", borderRadius: 2, px: 1.5, py: 1, minWidth: { xs: 80, md: 90 }, textAlign: "center" }}>
                                    <Typography fontSize={{ xs: 12, md: 13 }} fontWeight={600}>₹{loan.toLocaleString("en-IN")}</Typography>
                                </Box>
                            </Box>

                            <Typography fontWeight={600} mt={3} mb={2} fontSize={{ xs: 14, md: 15 }}>Tenure (Months)</Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Box sx={{ flex: 1 }}>
                                    <input type="range" min={6} max={24} value={tenure} onChange={(e) => setTenure(+e.target.value)}
                                        style={{ width: "100%", accentColor: BRAND, height: "4px" }} />
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography fontSize={11} color="text.secondary">6</Typography>
                                        <Typography fontSize={11} color="text.secondary">24</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ border: "1px solid #ddd", borderRadius: 2, px: 1.5, py: 1, minWidth: { xs: 80, md: 90 }, textAlign: "center" }}>
                                    <Typography fontSize={{ xs: 12, md: 13 }} fontWeight={600}>{tenure} M</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ mt: 3, p: 2, background: GRAY_BG, borderRadius: 2, display: "flex", justifyContent: "space-between" }}>
                                <Typography fontWeight={600} fontSize={{ xs: 13, md: 14 }}>Interest Rate (p.a.)</Typography>
                                <Typography fontWeight={700} fontSize={{ xs: 13, md: 14 }} color={BRAND}>{rate}%</Typography>
                            </Box>

                            <Button fullWidth variant="contained" sx={{ mt: 3, py: 1.3, background: BRAND, fontWeight: 700, borderRadius: "12px", "&:hover": { background: BRAND_DARK } }}>
                                Apply Now
                            </Button>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6} lg={6} xl={5}>
                        <Card sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "16px", height: "100%" }}>
                            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                                <Box sx={{
                                    width: { xs: 140, md: 160 }, height: { xs: 140, md: 160 }, borderRadius: "50%", border: `10px solid ${ACCENT}`,
                                    borderTop: `10px solid ${BRAND}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                                }}>
                                    <Typography fontSize={10} color="text.secondary" textAlign="center">Total Amount<br />Payable</Typography>
                                    <Typography fontWeight={800} fontSize={{ xs: 16, md: 18 }} color="#1a1a2e">₹{Math.round(totalPayable).toLocaleString("en-IN")}</Typography>
                                </Box>
                            </Box>
                            <Stack direction="row" spacing={3} justifyContent="center" mb={3}>
                                {[
                                    { dot: BRAND, label: "Principal Amount", val: `₹${loan.toLocaleString("en-IN")}` },
                                    { dot: ACCENT, label: "Extra Payable", val: `₹${Math.round(totalInterest + processingFee + gstOnInterest + gstOnPF).toLocaleString("en-IN")}` },
                                ].map((item, i) => (
                                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: item.dot, flexShrink: 0 }} />
                                        <Box>
                                            <Typography fontSize={10} color="text.secondary">{item.label}</Typography>
                                            <Typography fontSize={{ xs: 12, md: 13 }} fontWeight={600}>{item.val}</Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                            <Divider />
                            <Grid container spacing={1} mt={1}>
                                {[
                                    { l: "Total Interest", v: `₹${Math.round(totalInterest).toLocaleString("en-IN")}` },
                                    { l: "Processing Fee", v: `₹${processingFee}` },
                                    { l: "GST on Interest", v: `₹${gstOnInterest}` },
                                    { l: "GST on PF", v: `₹${gstOnPF}` },
                                ].map((item, i) => (
                                    <Grid item xs={6} key={i}>
                                        <Typography fontSize={11} color="text.secondary">{item.l}</Typography>
                                        <Typography fontSize={{ xs: 12, md: 13 }} fontWeight={600}>{item.v}</Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

// ════════════════════════════════════════════════════════════════
//  ROOT — routes to correct state
// ════════════════════════════════════════════════════════════════
const ApplyCreditCard = () => {
    const [cardStatus, setCardStatus] = useState(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const saved = localStorage.getItem("cardStatus");

                if (saved) {
                    setCardStatus(JSON.parse(saved));
                    localStorage.removeItem("cardStatus");
                } else {
                    const res = await getCreditCardStatus();
                    if (!res?.error) {
                        const normalized = res.data?.data;
                        setCardStatus(normalized);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                setFetching(false);
            }
        })();
    }, []);
    if (fetching) {
        return (
            <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LinearProgress sx={{ width: 200, "& .MuiLinearProgress-bar": { background: BRAND } }} />
            </Box>
        );
    }
    const status = cardStatus?.status;

    if (status === "ACTIVE") return <ActiveCardView cardStatus={cardStatus} />;
    if (status === "PENDING_APPROVAL") return <PendingCardView />;
    return <ApplyNewCard />;
};

export default ApplyCreditCard;