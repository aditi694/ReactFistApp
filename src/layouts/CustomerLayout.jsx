import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Box, Typography, Avatar, IconButton, TextField, InputAdornment
} from "@mui/material";
import { Drawer } from "@mui/material";
import { Squash as Hamburger } from "hamburger-react";

import {
    AccountBalance, Notifications, Search, Logout,
    ShowChart, SwapHoriz, CreditCard, Receipt,
    History, Savings
} from "@mui/icons-material";

import { logout } from "../features/authSlice.jsx";
import { logoutUser } from "../utils/auth.js";

const CustomerLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { data } = useSelector((state) => state.account);

    const menuItems = [
        { icon: ShowChart, label: "Dashboard", path: "/customer-dashboard" },
        { icon: SwapHoriz, label: "Transactions", path: "/transactions" },
        { icon: CreditCard, label: "Credit Cards", path: "/apply-credit-card" },
        { icon: Receipt, label: "Payments", path: "/transfer" },
        { icon: History, label: "Recent History", path: "/history" },
        { icon: Savings, label: "Loan Application", path: "/apply-loan" },
    ];

    const handleLogout = () => {
        dispatch(logout());
        logoutUser();
        navigate("/customer-login");
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F1F5F9", overflow: "hidden" }}>

            {/* MOBILE DRAWER */}
            <Drawer
                anchor="left"
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <Box sx={{ width: 260, height: "100vh", p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                        <Box sx={{ width: 38, height: 38, bgcolor: "#2563EB", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <AccountBalance sx={{ color: "#fff" }} />
                        </Box>
                        <Typography fontWeight={800}>UNION BANK</Typography>
                    </Box>

                    {menuItems.map(({ icon: Icon, label, path }) => (
                        <Box
                            key={label}
                            onClick={() => { navigate(path); setMenuOpen(false); }}
                            sx={{
                                display: "flex", alignItems: "center", gap: 2,
                                px: 2, py: 1.5, mb: 1, borderRadius: 2,
                                cursor: "pointer",
                                bgcolor: location.pathname === path ? "#EFF6FF" : "transparent"
                            }}
                        >
                            <Icon />
                            <Typography>{label}</Typography>
                        </Box>
                    ))}

                    <Box sx={{ mt: "auto", pt: 4 }}>
                        <Box onClick={handleLogout} sx={{
                            display: "flex", alignItems: "center", gap: 2,
                            px: 2, py: 1.5, borderRadius: 2, color: "#EF4444",
                            cursor: "pointer", "&:hover": { bgcolor: "#FEF2F2" }
                        }}>
                            <Logout />
                            <Typography fontWeight={500}>Logout</Typography>
                        </Box>
                    </Box>
                </Box>
            </Drawer>

            {/* FIXED SIDEBAR - DESKTOP */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                width: 240,
                bgcolor: "#ffffff",
                borderRight: "1px solid #E5E7EB",
                flexDirection: "column",
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                zIndex: 1000,
                overflowY: "auto",
                "&::-webkit-scrollbar": { display: "none" },
            }}>

                {/* BRAND */}
                <Box sx={{ p: 3, borderBottom: "1px solid #E5E7EB" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{
                            width: 38, height: 30,
                            bgcolor: "#2563EB",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <AccountBalance sx={{ color: "#fff" }} />
                        </Box>
                        <Typography fontWeight={800} fontSize={15}>UNION BANK</Typography>
                    </Box>
                </Box>

                {/* MENU ITEMS */}
                <Box sx={{ p: 2, flex: 1 }}>
                    {menuItems.map(({ icon: Icon, label, path }) => {
                        const active = location.pathname === path;
                        return (
                            <Box
                                key={label}
                                onClick={() => navigate(path)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    px: 2,
                                    py: 1.5,
                                    mb: 1,
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    bgcolor: active ? "#EFF6FF" : "transparent",
                                    color: active ? "#2563EB" : "#374151",
                                    "&:hover": { bgcolor: "#F1F5F9" }
                                }}
                            >
                                <Icon sx={{ fontSize: 20 }} />
                                <Typography fontWeight={active ? 600 : 500}>{label}</Typography>
                            </Box>
                        );
                    })}
                </Box>

                {/* LOGOUT - Always at bottom */}
                <Box sx={{ p: 3, borderTop: "1px solid #E5E7EB", mt: "auto" }}>
                    <Box
                        onClick={handleLogout}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            cursor: "pointer",
                            color: "#EF4444",
                            "&:hover": { bgcolor: "#FEF2F2" }
                        }}
                    >
                        <Logout sx={{ fontSize: 20 }} />
                        <Typography fontWeight={500}>Logout</Typography>
                    </Box>
                </Box>
            </Box>

            {/* MAIN CONTENT */}
            <Box sx={{
                flex: 1,
                ml: { xs: 0, md: "240px" },
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh"
            }}>

                {/* HEADER */}
                <Box sx={{
                    bgcolor: "#fff",
                    borderBottom: "1px solid #E5E7EB",
                    px: { xs: 2, md: 3 },
                    py: 1.8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 1100
                }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton
                            sx={{ display: { xs: "flex", md: "none" } }}
                            onClick={() => setMenuOpen(true)}
                        >
                            <Hamburger toggled={menuOpen} toggle={setMenuOpen} size={22} />
                        </IconButton>

                        <Typography fontWeight={700} fontSize={21}>
                            Dashboard
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1, maxWidth: 420, mx: 3, display: { xs: "none", sm: "block" } }}>
                        <TextField
                            fullWidth
                            placeholder="Search payment, transfer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search /></InputAdornment>
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <IconButton>
                            <Notifications />
                        </IconButton>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar sx={{ bgcolor: "#2563EB", width: 34, height: 34 }}>
                                {data?.customerName?.charAt(0) || "U"}
                            </Avatar>
                            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                <Typography fontSize={14} fontWeight={600}>
                                    {data?.customerName}
                                </Typography>
                                <Typography fontSize={11} color="gray">
                                    {data?.accountType || "SAVINGS"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* CONTENT - SINGLE SCROLLBAR */}
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, md: 3 },
                    overflowY: "auto",
                    bgcolor: "#F8FAFC",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none"
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerLayout;