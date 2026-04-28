import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Box, Typography, Avatar, Chip,
    Card, CardContent, LinearProgress
} from "@mui/material";
import {
    AccountBalanceWallet, TrendingUp, SwapHoriz,
    People, History, Analytics, CreditCard, AccountBalance, Settings, ArrowForwardIos,
    Add, ArrowUpward, ArrowDownward,
    Receipt, Shield, Savings
} from "@mui/icons-material";
import { fetchDashboard } from "../features/accountSlice.jsx";
import { Gauge } from '@mui/x-charts/Gauge';

// ─── Spending Gauge Chart (MUI X Style) ─────────────────────────────
const SpendingGauge = ({ categories, totalSpent }) => {
    if (!categories || categories.length === 0) {
        return (
            <Typography sx={{ fontSize: 12, color: "#9CA3AF", textAlign: "center", py: 4 }}>
                No spending data this month
            </Typography>
        );
    }

    const total = totalSpent || categories.reduce((sum, c) => sum + c.amount, 0);
    const maxLimit = Math.ceil(total * 1.3);
    // Get the highest spending category for color
    const colors = {
        SHOPPING: "#7C3AED",
        FOOD: "#EA580C",
        BILL: "#0891B2",
        TRANSFER: "#2563EB",
        SALARY: "#10B981",
        ATM: "#F59E0B",
        OTHERS: "#6B7280",
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 1 }}>
            <Gauge
                value={total}
                valueMax={maxLimit}
                startAngle={-120}
                endAngle={120}
                width={200}
                height={140}
                text={
                    ({ value }) => `₹${value.toLocaleString('en-IN')}`
                }
                sx={{
                    '& .MuiGauge-valueText': {
                        fontSize: 18,
                        fontWeight: 700,
                        fill: "#111827",
                    },
                    '& .MuiGauge-referenceArc': {
                        fill: "#E5E7EB",
                    },
                }}
            />

            {/* Category Breakdown Below Gauge */}
            <Box sx={{ mt: 2, width: "100%", maxWidth: 280 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", mb: 1.5, textAlign: "center" }}>
                    TOP SPENDING
                </Typography>
                {categories.slice(0, 4).map((cat, i) => {   // Show top 4 only
                    const percent = ((cat.amount / total) * 100).toFixed(1);
                    const color = colors[cat.category.toUpperCase()] || "#64748B";

                    return (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                            <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
                            <Typography sx={{ fontSize: 13, flex: 1 }}>{cat.category}</Typography>
                            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>₹{cat.amount}</Typography>
                            <Typography sx={{ fontSize: 12, color: "#6B7280", width: 42, textAlign: "right" }}>
                                {percent}%
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};

// ─── Quick Action Button ─────────────────────────────────────────
const ActionBtn = ({ icon: Icon, label, color = "#2563EB", bg = "#EFF6FF", onClick }) => (
    <Box
        onClick={onClick}
        sx={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 0.8, cursor: "pointer", p: 1.5, borderRadius: 2, minWidth: 64,
            transition: "all 0.18s",
            "&:hover": { bgcolor: "#F8FAFC", transform: "translateY(-2px)" }
        }}
    >
        <Box sx={{
            width: 46,
            height: 46,
            borderRadius: 2,
            bgcolor: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <Icon sx={{ color, fontSize: 21 }} />
        </Box>
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#374151", textAlign: "center" }}>
            {label}
        </Typography>
    </Box>
);

// ─── Transaction Row ─────────────────────────────────────────────
const TxnRow = ({ icon: Icon, iconBg, iconColor, title, sub, amount, type, time }) => (
    <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        py: 1.4,
        borderBottom: "1px solid #F3F4F6",
        "&:last-child": { borderBottom: "none" }
    }}>
        <Box sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
        }}>
            <Icon sx={{ color: iconColor, fontSize: 17 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#111827", lineHeight: 1.2 }}
                noWrap>{title}</Typography>
            <Typography sx={{ fontSize: 11, color: "#9CA3AF", mt: 0.2 }}>{sub}</Typography>
        </Box>
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: type === "DEBIT" ? "#EF4444" : "#10B981" }}>
                {type === "DEBIT" ? "−" : "+"}₹{amount}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>{time}</Typography>
        </Box>
    </Box>
);

// ─── Icon picker for transaction type/category ───────────────────
const getTxnMeta = (txn) => {
    const type = txn.type?.toUpperCase();
    const cat = (txn.category || txn.description || "").toUpperCase();
    if (type === "CREDIT") return { icon: TrendingUp, iconBg: "#ECFDF5", iconColor: "#10B981" };
    if (cat.includes("LOAN") || cat.includes("EMI")) return { icon: Savings, iconBg: "#F5F3FF", iconColor: "#7C3AED" };
    if (cat.includes("INSURANCE")) return { icon: Shield, iconBg: "#ECFEFF", iconColor: "#0891B2" };
    if (cat.includes("TRANSFER")) return { icon: SwapHoriz, iconBg: "#EFF6FF", iconColor: "#2563EB" };
    if (cat.includes("BILL")) return { icon: Receipt, iconBg: "#FEF3C7", iconColor: "#D97706" };
    return { icon: Receipt, iconBg: "#EFF6FF", iconColor: "#2563EB" };
};

const kycColor = (s) => s === "APPROVED" ? "#10B981" : s === "PENDING" ? "#D97706" : "#EF4444";

// ─── MAIN DASHBOARD ──────────────────────────────────────────────
const CustomerDashboard = () => {

    const dispatch = useDispatch();
    const { data, loading: dashLoading, error: dashError } = useSelector((state) => state.account);
    const navigate = useNavigate();

    const processCategoryData = (analyticsData) => {
        if (!analyticsData?.categoryBreakdown || analyticsData.categoryBreakdown.length === 0) return [];
        return analyticsData.categoryBreakdown
            .filter(c => c?.amount > 0)
            .sort((a, b) => b.amount - a.amount);
    };

    useEffect(() => {
        dispatch(fetchDashboard());
    }, [dispatch]);

    // ─── Loading ──────────────────────────────────────────────────
    if (dashLoading || !data) return (
        <Box
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "#F8FAFC" }}>
            <Box sx={{ textAlign: "center" }}>
                <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    bgcolor: "#2563EB",
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <AccountBalance sx={{ color: "#fff", fontSize: 24 }} />
                </Box>
                <LinearProgress sx={{ width: 200, borderRadius: 4, "& .MuiLinearProgress-bar": { bgcolor: "#2563EB" } }} />
                <Typography sx={{ fontSize: 12, color: "#9CA3AF", mt: 1.5 }}>Loading your dashboard...</Typography>
            </Box>
        </Box>
    );

    // ─── Error ────────────────────────────────────────────────────
    if (dashError) return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "#F8FAFC",
            flexDirection: "column",
            gap: 2
        }}>
            <Box sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#FEF2F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <AccountBalance sx={{ color: "#EF4444", fontSize: 26 }} />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Failed to load dashboard</Typography>
            <Typography sx={{ fontSize: 13, color: "#6B7280" }}>Please check your connection or login again.</Typography>
            <Box onClick={() => dispatch(fetchDashboard())}
                sx={{
                    cursor: "pointer",
                    bgcolor: "#2563EB",
                    color: "#fff",
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontSize: 13,
                    fontWeight: 600
                }}>
                Retry
            </Box>
        </Box>
    );

    const analytics = data?.analytics || null;
    const txns = data?.recentTransactions || [];
    const processedCategories = processCategoryData(analytics);

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "#F1F5F9", gap: 0 }}>


            {/* ══ MAIN AREA ══════════════════════════════════════════ */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

                {/* PAGE CONTENT */}
                <Box sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: { xs: 1.5, sm: 2, md: 3, lg: 4 },
                    bgcolor: "#F8FAFC",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none"
                }}>
                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr", lg: "2.2fr 1fr" },
                        gap: { xs: 2, md: 3 },
                        maxWidth: "1600px",
                        mx: "auto",
                        width: "100%",
                    }}>

                        {/* ════ LEFT COLUMN ════════════════════════════════ */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                            {/* ACCOUNT OVERVIEW */}
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border: "1px solid #E5E7EB",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        boxShadow: "0 12px 40px rgba(0,0,0,0.12)"
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <Box
                                        sx={{
                                            display: { xs: "block", md: "flex" },
                                            gap: { md: 3 }
                                        }}
                                    >

                                        {/* LEFT SIDE */}
                                        <Box
                                            sx={{
                                                flex: 1,
                                                p: { xs: 2, sm: 2.5, md: 3, lg: 3 },
                                                borderRight: { md: "1px solid #F3F4F6" }
                                            }}
                                        >

                                            {/* HEADER */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    mb: 2
                                                }}
                                            >
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: { xs: 14, md: 16 },
                                                            fontWeight: 600,
                                                            color: "#374151"
                                                        }}
                                                    >
                                                        Accounts
                                                    </Typography>

                                                    <Chip
                                                        label={data?.accountType?.toUpperCase().split(" ")[0] || "SAVINGS"}
                                                        size="small"
                                                        sx={{
                                                            fontSize: 10,
                                                            height: 20,
                                                            bgcolor: "#EFF6FF",
                                                            color: "#2563EB",
                                                            fontWeight: 700
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            {/* BALANCE */}
                                            <Typography
                                                sx={{
                                                    fontFamily: "monospace",
                                                    fontSize: { xs: 24, sm: 28, md: 34, lg: 42 },
                                                    fontWeight: 800,
                                                    color: "#111827",
                                                    letterSpacing: -1
                                                }}
                                            >
                                                ₹{data?.balance}
                                            </Typography>

                                            <Typography
                                                sx={{
                                                    fontSize: { xs: 12, md: 14 },
                                                    color: "#6B7280",
                                                    mt: 0.5,
                                                    mb: 3
                                                }}
                                            >
                                                Account: {data?.accountNumber}
                                            </Typography>

                                            {/* SPENDING */}
                                            {analytics?.categoryBreakdown?.length > 0 ? (
                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            fontWeight: 600,
                                                            color: "#9CA3AF",
                                                            mb: 1,
                                                            textTransform: "uppercase",
                                                            letterSpacing: 0.4
                                                        }}
                                                    >
                                                        Category Spending — This Month
                                                    </Typography>

                                                    {processedCategories.length > 0 ? (
                                                        <SpendingGauge
                                                            categories={processedCategories}
                                                            totalSpent={analytics?.summary?.totalDebit}
                                                        />
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                bgcolor: "#F8FAFC",
                                                                borderRadius: 2,
                                                                p: 3,
                                                                textAlign: "center"
                                                            }}
                                                        >
                                                            <Typography sx={{ fontSize: 14, color: "#9CA3AF" }}>
                                                                No spending data this month yet
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Box
                                                    sx={{
                                                        bgcolor: "#F8FAFC",
                                                        borderRadius: 2,
                                                        p: 2.5,
                                                        textAlign: "center"
                                                    }}
                                                >
                                                    <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>
                                                        No spending data this month yet
                                                    </Typography>

                                                    <Typography
                                                        onClick={() => navigate("/analytics")}
                                                        sx={{
                                                            fontSize: 13,
                                                            color: "#2563EB",
                                                            fontWeight: 600,
                                                            cursor: "pointer",
                                                            mt: 0.5
                                                        }}
                                                    >
                                                        View Analytics →
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Box sx={{ mt: 2, textAlign: "right" }}>
                                                <Typography
                                                    onClick={() => navigate("/analytics")}
                                                    sx={{
                                                        fontSize: 13,
                                                        color: "#2563EB",
                                                        fontWeight: 600,
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    More Details →
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* RIGHT SIDE (OVERVIEW) */}
                                        <Box
                                            sx={{
                                                width: { xs: "100%", md: 280, lg: 320 },
                                                p: { xs: 2, md: 3.5 },
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: { xs: 1.5, md: 2.5 }
                                            }}
                                        >

                                            <Typography
                                                sx={{
                                                    fontSize: { xs: 16, md: 18 },
                                                    fontWeight: 700,
                                                    color: "#374151"
                                                }}
                                            >
                                                Overview
                                            </Typography>

                                            {analytics?.summary ? (
                                                <>
                                                    {[
                                                        {
                                                            label: "Total Debit",
                                                            value: `₹${analytics.summary.totalDebit}`,
                                                            icon: ArrowDownward,
                                                            color: "#EF4444",
                                                            bg: "#FEF2F2"
                                                        },
                                                        {
                                                            label: "Total Credit",
                                                            value: `₹${analytics.summary.totalCredit}`,
                                                            icon: ArrowUpward,
                                                            color: "#10B981",
                                                            bg: "#ECFDF5"
                                                        },
                                                        {
                                                            label: "Net Flow",
                                                            value: `₹${analytics.summary.netFlow}`,
                                                            icon: SwapHoriz,
                                                            color:
                                                                analytics.summary.netFlow >= 0 ? "#10B981" : "#EF4444",
                                                            bg: "#EFF6FF"
                                                        },
                                                        {
                                                            label: "Transactions",
                                                            value: analytics.summary.transactionCount,
                                                            icon: Receipt,
                                                            color: "#7C3AED",
                                                            bg: "#F5F3FF"
                                                        }
                                                    ].map(({ label, value, icon: Icon, color, bg }) => (
                                                        <Box
                                                            key={label}
                                                            sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: { xs: 30, md: 34 },
                                                                    height: { xs: 30, md: 34 },
                                                                    borderRadius: 1.5,
                                                                    bgcolor: bg,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "center"
                                                                }}
                                                            >
                                                                <Icon sx={{ fontSize: 18, color }} />
                                                            </Box>

                                                            <Box>
                                                                <Typography
                                                                    sx={{
                                                                        fontSize: { xs: 14, md: 12 },
                                                                        color: "#9CA3AF",
                                                                        fontWeight: 600
                                                                    }}
                                                                >
                                                                    {label}
                                                                </Typography>

                                                                <Typography
                                                                    sx={{
                                                                        fontSize: { xs: 13, md: 14 },
                                                                        fontWeight: 700,
                                                                        color
                                                                    }}
                                                                >
                                                                    {value}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    ))}
                                                </>
                                            ) : (
                                                <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>
                                                    No analytics yet this month
                                                </Typography>
                                            )}

                                            {/* KYC */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: 1.5,
                                                        bgcolor: "#ECFDF5",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <Shield sx={{ fontSize: 18, color: "#10B981" }} />
                                                </Box>

                                                <Box>
                                                    <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>
                                                        KYC Status
                                                    </Typography>

                                                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                                        {data?.kyc?.status}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* CARD */}
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: 1.5,
                                                        bgcolor: "#F5F3FF",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <CreditCard sx={{ fontSize: 16, color: "#7C3AED" }} />
                                                </Box>

                                                <Box>
                                                    <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>
                                                        Debit Card
                                                    </Typography>

                                                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                                        {data?.debitCard?.cardNumber}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* QUICK ACTIONS */}
                            <Card sx={{
                                borderRadius: 3,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                                border: "1px solid #E5E7EB"
                            }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827", mb: 2 }}>Quick
                                        Actions</Typography>
                                    <Box sx={{
                                        display: "flex",
                                        gap: 0.5,
                                        flexWrap: "wrap",
                                        alignItems: "stretch",
                                        fontSize: 16
                                    }}>
                                        <ActionBtn icon={SwapHoriz} label="Transfer" color="#2563EB" bg="#EFF6FF"
                                            onClick={() => navigate("/transfer")} />
                                        <ActionBtn icon={AccountBalanceWallet} label="Transactions" color="#7C3AED"
                                            bg="#F5F3FF" onClick={() => navigate("/transactions")} />
                                        <ActionBtn icon={People} label="Beneficiaries" color="#0891B2" bg="#ECFEFF"
                                            onClick={() => navigate("/beneficiaries")} />
                                        <ActionBtn icon={History} label="History" color="#D97706" bg="#FFFBEB"
                                            onClick={() => navigate("/history")} />
                                        <ActionBtn icon={Analytics} label="Analytics" color="#10B981" bg="#ECFDF5"
                                            onClick={() => navigate("/analytics")} />
                                        <ActionBtn icon={CreditCard} label="Credit Card" color="#DC2626" bg="#FEF2F2"
                                            onClick={() => navigate("/apply-credit-card")} />
                                        <ActionBtn icon={Savings} label="Apply Loan" color="#7C3AED" bg="#F5F3FF"
                                            onClick={() => navigate("/apply-loan")} />
                                        <ActionBtn icon={Settings} label="Limits" color="#2563EB" bg="#EFF6FF"
                                            onClick={() => navigate("/limits")} />
                                        <ActionBtn icon={Shield} label="Insurance" color="#0891B2" bg="#ECFEFF"
                                            onClick={() => navigate("/apply-insurance")} />
                                    </Box>
                                </CardContent>
                            </Card>

                            {/* TRANSACTION HISTORY */}
                            <Card sx={{
                                borderRadius: 3,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                                border: "1px solid #E5E7EB"
                            }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2
                                    }}>
                                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Transaction
                                            History</Typography>
                                        <Typography onClick={() => navigate("/history")} sx={{
                                            fontSize: 14,
                                            color: "#2563EB",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.3
                                        }}>
                                            View All <ArrowForwardIos sx={{ fontSize: 10 }} />
                                        </Typography>
                                    </Box>

                                    {Array.isArray(txns) && txns.length > 0 ? (
                                        txns.map((t, i) => {
                                            const meta = getTxnMeta(t);
                                            return (
                                                <TxnRow
                                                    key={t.transactionId || i}
                                                    icon={meta.icon}
                                                    iconBg={meta.iconBg}
                                                    iconColor={meta.iconColor}
                                                    title={t.description || t.category || t.type || "Transaction"}
                                                    sub={t.category || (t.type === "DEBIT" ? "Debit" : "Credit")}
                                                    amount={t.amount}
                                                    type={t.type?.toUpperCase()}
                                                    time={t.date ? `${t.date}${t.time ? "  " + t.time : ""}` : "—"}
                                                />
                                            );
                                        })
                                    ) : (
                                        <Box sx={{ py: 3, textAlign: "center" }}>
                                            <Typography sx={{ fontSize: 14, color: "#9CA3AF" }}>No recent
                                                transactions</Typography>
                                            <Typography onClick={() => navigate("/transactions")} sx={{
                                                fontSize: 14,
                                                color: "#2563EB",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                mt: 0.5
                                            }}>
                                                Make your first transaction →
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                        </Box>

                        {/* ════ RIGHT COLUMN ═══════════════════════════════ */}
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                            {/* CREDIT CARD */}
                            <Card sx={{
                                borderRadius: 3,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                                border: "1px solid #E5E7EB"
                            }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2
                                    }}>
                                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Credit
                                            Card</Typography>
                                        {/*<IconButton size="small"><MoreHoriz sx={{ fontSize: 17, color: "#9CA3AF" }} /></IconButton>*/}
                                    </Box>

                                    {data.creditCard?.status === "ACTIVE" ? (
                                        <>
                                            <Box sx={{
                                                borderRadius: 2.5, p: 2.5, mb: 2,
                                                background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 55%, #3B82F6 100%)",
                                                color: "#fff", position: "relative", overflow: "hidden"
                                            }}>
                                                <Box sx={{
                                                    position: "absolute",
                                                    top: -20,
                                                    right: -20,
                                                    width: 90,
                                                    height: 90,
                                                    borderRadius: "50%",
                                                    bgcolor: "rgba(255,255,255,0.08)"
                                                }} />
                                                <Box sx={{
                                                    position: "absolute",
                                                    bottom: -10,
                                                    left: 50,
                                                    width: 70,
                                                    height: 70,
                                                    borderRadius: "50%",
                                                    bgcolor: "rgba(255,255,255,0.06)"
                                                }} />
                                                <Typography
                                                    sx={{ fontSize: 11, opacity: 0.7, mb: 1.5, letterSpacing: 1 }}>PAYABLE
                                                    BALANCE</Typography>
                                                <Typography sx={{
                                                    fontFamily: "monospace",
                                                    fontSize: 22,
                                                    fontWeight: 800,
                                                    mb: 2
                                                }}>
                                                    ₹{data?.creditCard?.availableCredit}
                                                </Typography>
                                                <Box sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "flex-end"
                                                }}>
                                                    <Box>
                                                        <Typography sx={{
                                                            fontSize: 13,
                                                            fontWeight: 600,
                                                            opacity: 0.9
                                                        }}>{data?.customerName}</Typography>
                                                        <Typography sx={{
                                                            fontSize: 11,
                                                            opacity: 0.65,
                                                            fontFamily: "monospace"
                                                        }}>{data?.creditCard?.cardNumber}</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex" }}>
                                                        <Box sx={{
                                                            width: 22,
                                                            height: 22,
                                                            borderRadius: "50%",
                                                            bgcolor: "#EF4444",
                                                            opacity: 0.9
                                                        }} />
                                                        <Box sx={{
                                                            width: 22,
                                                            height: 22,
                                                            borderRadius: "50%",
                                                            bgcolor: "#F97316",
                                                            ml: -1.2,
                                                            opacity: 0.9
                                                        }} />
                                                    </Box>
                                                </Box>
                                            </Box>
                                            {[
                                                {
                                                    label: "Available Credit",
                                                    value: data.creditCard.availableCredit != null ? `₹${data.creditCard.availableCredit}` : null
                                                },
                                                {
                                                    label: "Credit Limit",
                                                    value: data.creditCard.creditLimit != null ? `₹${data.creditCard.creditLimit}` : null
                                                },
                                                {
                                                    label: "Outstanding Balance",
                                                    value: data.creditCard.outstandingBalance != null ? `₹${data.creditCard.outstandingBalance}` : null
                                                },
                                                { label: "Due Date", value: data.creditCard.dueDate || null },
                                            ].filter(r => r.value !== null).map(({ label, value }) => (
                                                <Box key={label} sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    py: 0.8,
                                                    borderBottom: "1px solid #F3F4F6"
                                                }}>
                                                    <Typography
                                                        sx={{ fontSize: 12, color: "#6B7280" }}>{label}</Typography>
                                                    <Typography sx={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: "#111827"
                                                    }}>{value}</Typography>
                                                </Box>
                                            ))}
                                        </>
                                    ) : (
                                        <Box sx={{ textAlign: "center", py: 2 }}>
                                            <CreditCard sx={{ fontSize: 38, color: "#E5E7EB", mb: 1 }} />
                                            <Typography sx={{ fontSize: 13, color: "#6B7280", mb: 1.5 }}>
                                                {data.creditCard?.message ||
                                                    (data.creditCard?.status === "PENDING_APPROVAL" ? "Application under review" :
                                                        data.creditCard?.status === "REJECTED" ? "Application rejected" :
                                                            "No credit card applied")}
                                            </Typography>
                                            {data.creditCard?.status === "PENDING_APPROVAL" && (
                                                <Chip label="Under Review" size="small"
                                                    sx={{ bgcolor: "#FFFBEB", color: "#D97706", fontWeight: 600 }} />
                                            )}
                                            {(data.creditCard?.status === "NOT_APPLIED" || !data.creditCard?.status) && (
                                                <Box onClick={() => navigate("/apply-credit-card")} sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    cursor: "pointer",
                                                    bgcolor: "#2563EB",
                                                    color: "#fff",
                                                    borderRadius: 2,
                                                    px: 2,
                                                    py: 0.8,
                                                    fontSize: 13,
                                                    fontWeight: 600
                                                }}>
                                                    <Add sx={{ fontSize: 15 }} /> Apply Now
                                                </Box>
                                            )}
                                            {data.creditCard?.status === "REJECTED" && (
                                                <Box onClick={() => navigate("/apply-credit-card")} sx={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    bgcolor: "#F3F4F6",
                                                    color: "#374151",
                                                    borderRadius: 2,
                                                    px: 2,
                                                    py: 0.8,
                                                    fontSize: 13,
                                                    fontWeight: 600
                                                }}>
                                                    Reapply
                                                </Box>
                                            )}
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                            {/* QUICK ACCESS */}
                            <Card sx={{
                                borderRadius: 3,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                                border: "1px solid #E5E7EB"
                            }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 2
                                    }}>
                                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Quick
                                            Access</Typography>
                                    </Box>

                                    {data.bankBranch && (
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            py: 1.4,
                                            borderBottom: "1px solid #F3F4F6"
                                        }}>
                                            <Box sx={{
                                                width: 38,
                                                height: 38,
                                                borderRadius: 2,
                                                bgcolor: "#EFF6FF",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0
                                            }}>
                                                <AccountBalance sx={{ fontSize: 17, color: "#2563EB" }} />
                                            </Box>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
                                                    noWrap>{data?.bankBranch?.bankName}</Typography>
                                                <Typography sx={{ fontSize: 11, color: "#6B7280" }}
                                                    noWrap>{data?.bankBranch?.branchName} • {data?.bankBranch?.city}</Typography>
                                                {data?.debitCard?.dailyLimit && (
                                                    <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>Limit:
                                                        ₹{data?.debitCard?.dailyLimit} / day</Typography>
                                                )}
                                            </Box>
                                            <Box onClick={() => navigate("/transfer")} sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.2,
                                                cursor: "pointer",
                                                color: "#2563EB",
                                                fontSize: 12,
                                                fontWeight: 600,
                                                flexShrink: 0
                                            }}>
                                                Transfer <ArrowForwardIos sx={{ fontSize: 10 }} />
                                            </Box>
                                        </Box>
                                    )}

                                    {data.nominee?.name && (
                                        <Box sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            py: 1.4,
                                            borderBottom: "1px solid #F3F4F6"
                                        }}>
                                            <Avatar sx={{
                                                width: 38,
                                                height: 38,
                                                bgcolor: "#ECFDF5",
                                                fontSize: 13,
                                                fontWeight: 700,
                                                color: "#10B981"
                                            }}>
                                                {data.nominee.name.charAt(0)}
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography sx={{
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color: "#111827"
                                                }}>{data.nominee.name}</Typography>
                                                <Typography
                                                    sx={{ fontSize: 11, color: "#6B7280" }}>{data.nominee.relation} •
                                                    Nominee</Typography>
                                            </Box>
                                            <Chip label="Active" size="small" sx={{
                                                fontSize: 11,
                                                height: 19,
                                                bgcolor: "#ECFDF5",
                                                color: "#10B981",
                                                fontWeight: 600
                                            }} />
                                        </Box>
                                    )}

                                    {data.loans?.some(l => l.status === "ACTIVE") ? (
                                        data.loans.filter(l => l.status === "ACTIVE").slice(0, 1).map(loan => (
                                            <Box key={loan.loanId}
                                                sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.4 }}>
                                                <Box sx={{
                                                    width: 38,
                                                    height: 38,
                                                    borderRadius: 2,
                                                    bgcolor: "#F5F3FF",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0
                                                }}>
                                                    <Savings sx={{ fontSize: 17, color: "#7C3AED" }} />
                                                </Box>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{
                                                        fontSize: 13,
                                                        fontWeight: 700,
                                                        color: "#111827"
                                                    }}>{loan.loanType}</Typography>
                                                    <Typography
                                                        sx={{ fontSize: 11, color: "#6B7280" }}>₹{loan.loanAmount} • EMI
                                                        ₹{loan.emiAmount}</Typography>
                                                    <Typography sx={{ fontSize: 11, color: "#9CA3AF" }}>Amount:
                                                        ₹{loan.emiAmount} / month</Typography>
                                                </Box>
                                                <Box onClick={() => navigate("/history")} sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.2,
                                                    cursor: "pointer",
                                                    color: "#2563EB",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    flexShrink: 0
                                                }}>
                                                    Details <ArrowForwardIos sx={{ fontSize: 10 }} />
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{
                                            py: 1.4,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center"
                                        }}>
                                            <Typography sx={{ fontSize: 13, color: "#6B7280" }}>No active
                                                loans</Typography>
                                            <Box onClick={() => navigate("/apply-loan")} sx={{
                                                cursor: "pointer",
                                                color: "#2563EB",
                                                fontSize: 12,
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 0.2
                                            }}>
                                                Apply <ArrowForwardIos sx={{ fontSize: 10 }} />
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>

                            {/* INSURANCE */}
                            <Card sx={{
                                borderRadius: 3,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
                                border: "1px solid #E5E7EB"
                            }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mb: 1.5
                                    }}>
                                        <Typography sx={{
                                            fontSize: 16,
                                            fontWeight: 700,
                                            color: "#111827"
                                        }}>Insurance</Typography>
                                        <Box onClick={() => navigate("/apply-insurance")} sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 0.3,
                                            cursor: "pointer",
                                            bgcolor: "#EFF6FF",
                                            borderRadius: 1.5,
                                            px: 1.5,
                                            py: 0.4
                                        }}>
                                            <Add sx={{ fontSize: 14, color: "#2563EB" }} />
                                            <Typography sx={{ fontSize: 11, color: "#2563EB", fontWeight: 600 }}>Add
                                                New</Typography>
                                        </Box>
                                    </Box>

                                    {data.insurances?.length > 0 ? (
                                        data.insurances.map((ins, i) => (
                                            <Box key={ins.policyNumber || i}
                                                sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1 }}>
                                                <Box sx={{
                                                    width: 34,
                                                    height: 34,
                                                    borderRadius: 1.5,
                                                    bgcolor: "#ECFEFF",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}>
                                                    <Shield sx={{ fontSize: 15, color: "#0891B2" }} />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                        color: "#111827"
                                                    }}>{ins.insuranceType} INSURANCE</Typography>
                                                    <Typography sx={{ fontSize: 12, color: "#6B7280" }}>Coverage:
                                                        ₹{ins.coverageAmount}</Typography>
                                                </Box>
                                                <Chip label="Active" size="small" sx={{
                                                    fontSize: 11,
                                                    height: 18,
                                                    bgcolor: "#ECFDF5",
                                                    color: "#10B981",
                                                    fontWeight: 600
                                                }} />
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{ textAlign: "center", py: 1.5 }}>
                                            <Typography sx={{ fontSize: 13, color: "#9CA3AF" }}>No insurance
                                                found</Typography>
                                            <Typography onClick={() => navigate("/apply-insurance")} sx={{
                                                fontSize: 12,
                                                color: "#2563EB",
                                                fontWeight: 600,
                                                cursor: "pointer",
                                                mt: 0.5
                                            }}>
                                                Get Insurance →
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerDashboard;