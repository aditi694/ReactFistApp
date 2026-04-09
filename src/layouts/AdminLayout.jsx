import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Box, Typography, Avatar, IconButton, Badge, Drawer
} from "@mui/material";
import {
    AccountBalance, Dashboard, PendingActions, Logout, Notifications
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { logoutUser } from "../utils/auth";

const AdminLayout = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const pendingCount = 0;

    const menuItems = [
        { icon: Dashboard, label: "Dashboard", path: "/dashboard" },
        { icon: PendingActions, label: "Pending", path: "/admin/pending" },
    ];

    const getTitle = () => {
        if (location.pathname.includes("pending")) return "Pending Requests";
        return "Admin Dashboard";
    };

    const handleNavigate = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    const SidebarContent = () => (
        <>
            {/* BRAND */}
            <Box sx={{ px: 3, py: 3, borderBottom: "1px solid #E5E7EB" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{
                        width: 42,
                        height: 42,
                        background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <AccountBalance sx={{ color: "#fff" }} />
                    </Box>
                    <Box>
                        <Typography fontWeight={700} fontSize={15}>UNION BANK</Typography>
                        <Typography fontSize={12} color="#6B7280">Admin Panel</Typography>
                    </Box>
                </Box>
            </Box>

            {/* MENU */}
            <Box sx={{ px: 2, py: 2, flex: 1 }}>
                {menuItems.map(({ icon: Icon, label, path }) => {
                    const active = location.pathname === path;
                    return (
                        <Box
                            key={label}
                            onClick={() => handleNavigate(path)}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                px: 2,
                                py: 1.6,
                                mb: 1,
                                borderRadius: 2,
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                bgcolor: active ? "#EFF6FF" : "transparent",
                                color: active ? "#2563EB" : "#374151",
                                fontWeight: active ? 600 : 500,
                                "&:hover": {
                                    bgcolor: "#F1F5F9"
                                }
                            }}
                        >
                            <Icon sx={{ fontSize: 20 }} />
                            <Typography fontSize={14}>{label}</Typography>
                        </Box>
                    );
                })}
            </Box>

            {/* LOGOUT */}
            <Box sx={{ p: 2, borderTop: "1px solid #E5E7EB" }}>
                <Box
                    onClick={() => { logoutUser(); navigate("/login"); }}
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
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F1F5F9" }}>

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
                <SidebarContent />
            </Box>

            {/* MOBILE DRAWER */}
            <Drawer
                anchor="left"
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <Box sx={{ width: 260, height: "100%", display: "flex", flexDirection: "column" }}>
                    <SidebarContent />
                </Box>
            </Drawer>

            {/* MAIN */}
            <Box sx={{
                flex: 1,
                ml: { md: "260px" },
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh"
            }}>

                {/* HEADER */}
                <Box sx={{
                    height: 90,
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

                    {/* LEFT */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        minWidth: 0 // IMPORTANT (prevents overflow bugs)
                    }}>
                        <IconButton
                            sx={{ display: { xs: "flex", md: "none" } }}
                            onClick={() => setMenuOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography
                            fontSize={20}
                            fontWeight={700}
                            noWrap
                            sx={{ color: "#111827" }}
                        >
                            {getTitle()}
                        </Typography>
                    </Box>

                    {/* RIGHT */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1, md: 2 },
                        flexShrink: 0 // 🔥 prevents shrinking
                    }}>

                        {/* NOTIFICATION */}
                        <IconButton
                            onClick={() => navigate("/admin/pending")}
                            sx={{
                                bgcolor: "#F1F5F9",
                                borderRadius: 2,
                                width: 40,
                                height: 40,
                                "&:hover": { bgcolor: "#E2E8F0" }
                            }}
                        >
                            <Badge badgeContent={pendingCount} color="error">
                                <Notifications sx={{ fontSize: 20 }} />
                            </Badge>
                        </IconButton>

                        {/* USER */}
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            pl: 1.5,
                            pr: 2,
                            py: 0.7,
                            borderRadius: 2,
                            border: "1px solid #E5E7EB",
                            bgcolor: "#fff",
                            minWidth: { xs: "auto", md: 140 }
                        }}>

                            <Avatar sx={{
                                bgcolor: "#2563EB",
                                width: 32,
                                height: 32,
                                fontSize: 13
                            }}>
                                A
                            </Avatar>

                            {/* TEXT (HIDE ON SMALL SCREENS CLEANLY) */}
                            <Box sx={{
                                display: { xs: "none", sm: "block" }
                            }}>
                                <Typography fontSize={13} fontWeight={600} noWrap>
                                    Admin
                                </Typography>
                                <Typography fontSize={11} color="#64748B" noWrap>
                                    Super Admin
                                </Typography>
                            </Box>

                        </Box>
                    </Box>
                </Box>

                {/* CONTENT */}
                <Box sx={{
                    flex: 1,
                    p: 3,
                    overflowY: "auto"
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;