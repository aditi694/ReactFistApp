import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
    Badge,
    IconButton,
    Menu,
    Typography,
    Box,
} from "@mui/material";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
    setNotifications,
    addNotification,
    markAsRead,
} from "../features/notificationSlice";

import {
    getNotifications,
    markNotificationRead,
} from "../api/customerApi.js";

const NotificationBell = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const notifications =
        useSelector((state) => state.notification.notifications) || [];

    const unreadCount = notifications.filter(
        (n) => n.status === "UNREAD"
    ).length;

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const getIcon = (type) => {
        switch (type) {
            case "TRANSACTION":
                return "💰";
            case "LOAN":
                return "🏦";
            case "CARD":
                return "💳";
            case "BENEFICIARY":
                return "👤";
            case "STATEMENT":
                return "📄";
            case "INSURANCE":
                return "🛡️";
            default:
                return "🔔";
        }
    };

    const groupNotifications = () => {
        const today = [];
        const yesterday = [];

        const now = new Date();

        notifications.forEach((n) => {
            const date = new Date(n.createdAt);

            const diff = now - date;
            const oneDay = 24 * 60 * 60 * 1000;

            if (diff < oneDay) {
                today.push(n);
            } else {
                yesterday.push(n);
            }
        });

        return { today, yesterday };
    };

    const { today, yesterday } = groupNotifications();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getNotifications();
                const data = Array.isArray(res) ? res : res.data;
                dispatch(setNotifications(data || []));
            } catch (e) {
                console.error("Failed to fetch notifications", e);
            }
        };

        fetchData();
    }, [dispatch]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const ws = new WebSocket(
            `ws://localhost:8080/ws/notifications?userId=${userId}`
        );

        ws.onmessage = (event) => {
            const parsed = JSON.parse(event.data);
            const notif = parsed.data || parsed;

            dispatch(addNotification(notif));

            toast.success(notif.message, {
                duration: 4000,
            });
        };

        return () => ws.close();
    }, [dispatch]);

    const handleRead = async (id) => {
        dispatch(markAsRead(id));

        try {
            await markNotificationRead(id);
        } catch (e) {
            console.error("Failed to mark read", e);
        }
    };

    return (
        <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsNoneIcon />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                disableScrollLock
                slotProps={{
                    backdrop: {
                        sx: {
                            backdropFilter: "blur(12px)",
                            backgroundColor: "rgba(0,0,0,0.15)",
                        },
                    },
                }}
                PaperProps={{
                    component: motion.div,
                    initial: { opacity: 0, y: -20, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    transition: { duration: 0.25 },

                    sx: {
                        width: 380,
                        borderRadius: "20px",
                        backdropFilter: "blur(20px)",
                        background: "rgba(255,255,255,0.75)",
                        boxShadow:
                            "0px 10px 40px rgba(0,0,0,0.15)",
                        mt: 2,
                    },
                }}
            >
                {/* HEADER */}
                <Box
                    px={2}
                    py={1.5}
                    sx={{
                        color: "#070606",
                    }}
                >
                    <Typography fontWeight={600}>
                        Notifications
                    </Typography>
                </Box>

                <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
                    {/* TODAY */}
                    {today.length > 0 && (
                        <>
                            <Typography px={2} py={1} fontSize={12}>
                                Today
                            </Typography>

                            {today.map((n) => (
                                <Item key={n.id} n={n} handleRead={handleRead} getIcon={getIcon} />
                            ))}
                        </>
                    )}

                    {/* YESTERDAY */}
                    {yesterday.length > 0 && (
                        <>
                            <Typography px={2} py={1} fontSize={12}>
                                Earlier
                            </Typography>

                            {yesterday.map((n) => (
                                <Item key={n.id} n={n} handleRead={handleRead} getIcon={getIcon} />
                            ))}
                        </>
                    )}
                </Box>
            </Menu>
        </>
    );
};

const Item = ({ n, handleRead, getIcon }) => (
    <Box
        onClick={() => handleRead(n.id)}
        sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            gap: 1.5,
            cursor: "pointer",
            transition: "0.2s",
            background:
                n.status === "UNREAD"
                    ? "rgba(25,118,210,0.06)"
                    : "transparent",

            "&:hover": {
                background: "rgba(25,118,210,0.12)",
            },
        }}
    >
        <Box
            sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: "#1976d2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
            }}
        >
            {getIcon(n.type)}
        </Box>

        <Box flex={1}>
            <Typography fontSize={13}>{n.message}</Typography>
            <Typography fontSize={11} color="gray">
                {new Date(n.createdAt).toLocaleString()}
            </Typography>
        </Box>
    </Box>
);

export default NotificationBell;