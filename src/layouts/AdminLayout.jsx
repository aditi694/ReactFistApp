import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
    Box, Typography, Avatar, IconButton, Badge, Drawer
} from "@mui/material";
import {
    AccountBalance, Dashboard, PendingActions, Logout, Notifications
} from "@mui/icons-material";
import { logoutUser } from "../utils/auth";
import MenuIcon from "@mui/icons-material/Menu";

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

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC", overflow: "hidden" }}>

            {/* DESKTOP SIDEBAR */}
            <Box sx={{
                display: { xs: "none", md: "flex" },
                width: 260,
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
                <Box sx={{ p: 3.5, borderBottom: "1px solid #E5E7EB" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{
                            width: 40, height: 40,
                            background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <AccountBalance sx={{ color: "#fff" }} />
                        </Box>
                        <Box>
                            <Typography fontWeight={800} fontSize={16}>UNION BANK</Typography>
                            <Typography fontSize={12} color="#6B7280">Admin Panel</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* MENU ITEMS */}
                <Box sx={{ p: 2, flex: 1 }}>
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
                                    py: 1.5,
                                    mb: 1,
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    bgcolor: active ? "#EFF6FF" : "transparent",
                                    color: active ? "#4768b1" : "#24282e",
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
                        <Typography fontWeight={500}>Logout</Typography>
                    </Box>
                </Box>
            </Box>

            {/* MOBILE DRAWER */}
            <Drawer
                anchor="left"
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                sx={{ display: { xs: "block", md: "none" } }}
            >
                <Box sx={{ width: 260, height: "100vh", bgcolor: "#fff", pt: 2 }}>
                    {/* Brand + Menu + Logout (same as desktop) */}
                    {/* ... (same content as sidebar above) */}
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 4 }}>
                            <Box sx={{ width: 40, height: 40, background: "linear-gradient(135deg, #2563EB, #1E40AF)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <AccountBalance sx={{ color: "#fff" }} />
                            </Box>
                            <Box>
                                <Typography fontWeight={800}>UNION BANK</Typography>
                                <Typography fontSize={12} color="#6B7280">Admin Panel</Typography>
                            </Box>
                        </Box>

                        {menuItems.map(({ icon: Icon, label, path }) => (
                            <Box key={label} onClick={() => handleNavigate(path)} sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 1.8, borderRadius: 2, mb: 1, bgcolor: location.pathname === path ? "#EFF6FF" : "transparent" }}>
                                <Icon />
                                <Typography>{label}</Typography>
                            </Box>
                        ))}

                        <Box sx={{ mt: 6 }}>
                            <Box onClick={() => { logoutUser(); navigate("/login"); }} sx={{ display: "flex", alignItems: "center", gap: 2, px: 3, py: 1.8, color: "#d31919", borderRadius: 2, cursor: "pointer" }}>
                                <Logout />
                                <Typography>Logout</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Drawer>

            {/* MAIN CONTENT */}
            <Box sx={{ flex: 1, ml: { xs: 0, md: "260px" }, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

                {/* HEADER */}
                <Box sx={{
                    bgcolor: "#fff",
                    borderBottom: "1px solid #E5E7EB",
                    px: { xs: 2, sm: 3 },
                    py: 2.5,
                    position: "sticky",
                    top: 0,
                    zIndex: 1100
                }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <IconButton sx={{ display: { xs: "flex", md: "none" } }} onClick={() => setMenuOpen(true)}>
                                <MenuIcon />
                            </IconButton>
                            <Typography fontSize={22} fontWeight={700}>{getTitle()}</Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <IconButton onClick={() => navigate("/admin/pending")}>
                                <Badge badgeContent={pendingCount} color="error">
                                    <Notifications />
                                </Badge>
                            </IconButton>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, bgcolor: "#F8FAFC", px: 2, py: 1, borderRadius: 2 }}>
                                <Avatar sx={{ bgcolor: "#17213c", width: 34, height: 34 }}>A</Avatar>
                                <Box>
                                    <Typography fontSize={14} fontWeight={600}>Admin</Typography>
                                    <Typography fontSize={12} color="gray">Super Admin</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* CONTENT AREA */}
                <Box sx={{
                    flex: 1,
                    p: { xs: 2, sm: 3 },
                    overflowY: "auto",
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none"
                }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;