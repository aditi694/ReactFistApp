import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    Box, Typography, Avatar, IconButton, TextField, InputAdornment, Drawer
} from "@mui/material";
import { Squash as Hamburger } from "hamburger-react";

import {
    AccountBalance, Notifications, Search, Logout,
    ShowChart, SwapHoriz, CreditCard, Receipt,
    History, Savings
} from "@mui/icons-material";

import { logout } from "../features/authSlice.jsx";
import { logoutUser } from "../utils/auth.js";
import NotificationBell from "../components/NotificationBell";

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

    const Sidebar = () => (
        <>
            <Box sx={{
                px: 3,
                py: 2.5,
                borderBottom: "1px solid #F1F5F9",
                display: "flex",
                alignItems: "center",
                gap: 1.5
            }}>
                <Box sx={{
                    width: 36,
                    height: 36,
                    background: "#2563EB",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    <AccountBalance sx={{ color: "#fff", fontSize: 20 }} />
                </Box>

                <Box>
                    <Typography fontWeight={600} fontSize={14}>
                        UNION BANK
                    </Typography>
                    <Typography fontSize={11} color="#94A3B8">
                        Customer Panel
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ px: 2, py: 2, flex: 1 }}>
                {menuItems.map(({ icon: Icon, label, path }) => {
                    const active = location.pathname === path;
                    return (
                        <Box
                            key={label}
                            onClick={() => {
                                navigate(path);
                                setMenuOpen(false);
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                px: 2,
                                py: 1.6,
                                mb: 1,
                                borderRadius: 2,
                                cursor: "pointer",
                                bgcolor: active ? "#2563EB" : "transparent",
                                color: active ? "#fff" : "#374151",
                                "&:hover": {
                                    bgcolor: active ? "#1D4ED8" : "#F1F5F9"
                                }
                            }}
                        >
                            <Icon sx={{ fontSize: 20 }} />
                            <Typography fontSize={14}>{label}</Typography>
                        </Box>
                    );
                })}
            </Box>

            <Box sx={{ p: 2, borderTop: "1px solid #E5E7EB" }}>
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
                    <Typography fontSize={14}>Logout</Typography>
                </Box>
            </Box>
        </>
    );

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fff" }}>

            {/* DESKTOP SIDEBAR */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                width: 260,
                flexDirection: "column",
                position: "fixed",
                height: "100vh",
                bgcolor: "#fff",
                borderRight: "1px solid #E5E7EB"
            }}>
                <Sidebar />
            </Box>

            {/* MOBILE DRAWER */}
            <Drawer
                anchor="left"
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <Box sx={{
                    width: 260,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <Sidebar />
                </Box>
            </Drawer>

            {/* MAIN */}
            <Box sx={{
                flex: 1,
                ml: { md: "260px" },
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "#fff"
            }}>

                {/* HEADER */}
                <Box sx={{
                    height: 80,
                    bgcolor: "#fff",
                    borderBottom: "1px solid #E5E7EB",
                    px: { xs: 2, md: 3 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 1100
                }}>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
                        <IconButton
                            sx={{ display: { xs: "flex", md: "none" } }}
                            onClick={() => setMenuOpen(true)}
                        >
                            <Hamburger toggled={menuOpen} toggle={setMenuOpen} size={20} />
                        </IconButton>

                        <Typography fontSize={20} fontWeight={700} noWrap>
                            Dashboard
                        </Typography>
                    </Box>

                    {/* SEARCH */}
                    <Box sx={{
                        flex: 1,
                        maxWidth: 420,
                        mx: 3,
                        display: { xs: "none", sm: "block" }
                    }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Box>

                    {/* RIGHT */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
                        <Box className="flex items-center">
                            <NotificationBell />
                        </Box>

                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            px: 1.5,
                            py: 0.6,
                            borderRadius: 2,
                            border: "1px solid #E5E7EB"
                        }}>
                            <Avatar sx={{ bgcolor: "#2563EB", width: 32, height: 32 }}>
                                {data?.customerName?.charAt(0) || "U"}
                            </Avatar>

                            <Box sx={{ display: { xs: "none", sm: "block" } }}>
                                <Typography fontSize={13} fontWeight={600}>
                                    {data?.customerName || "User"}
                                </Typography>
                                <Typography fontSize={11} color="#64748B">
                                    {data?.accountType || "SAVINGS"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* CONTENT */}
                <Box sx={{
                    // flex: 1,
                    // p: 3,
                    // overflowY: "auto"
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default CustomerLayout;