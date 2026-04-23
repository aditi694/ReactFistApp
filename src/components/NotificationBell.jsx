import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
    Badge,
    IconButton,
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
    Button
} from "@mui/material";

import {
    markAsRead,
    markAllAsRead
} from "../features/notificationSlice.jsx";

const NotificationBell = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(
        (state) => state.notification.notifications
    );

    const unreadCount = notifications.filter((n) => !n.read).length;

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            {/* 🔔 ICON */}
            <IconButton
                onClick={handleOpen}
                sx={{
                    backgroundColor: "#f5f5f5",
                    "&:hover": { backgroundColor: "#e0e0e0" }
                }}
            >
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsNoneIcon />
                </Badge>
            </IconButton>

            {/* 📦 DROPDOWN */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}

                disableScrollLock
                slotProps={{
                    backdrop: {
                        sx: {
                            backdropFilter: "blur(6px)",
                            backgroundColor: "rgba(0,0,0,0.1)"
                        }
                    }
                }}

                PaperProps={{
                    sx: {
                        width: 340,
                        maxHeight: 420,
                        borderRadius: 3,
                        mt: 1.5,
                        boxShadow: "0px 8px 24px rgba(0,0,0,0.12)"
                    }
                }}
            >
                {/* HEADER */}
                <Box
                    px={2}
                    py={1.5}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography fontWeight="bold" fontSize={15}>
                        Notifications
                    </Typography>

                    <Button
                        size="small"
                        onClick={() => dispatch(markAllAsRead())}
                        sx={{
                            textTransform: "none",
                            fontSize: 12,
                            color: "#2563EB",
                            fontWeight: 500,
                            px: 1,
                            minWidth: "auto",

                            "&:hover": {
                                backgroundColor: "transparent",
                                textDecoration: "underline"
                            }
                        }}
                    >
                        Mark all as read
                    </Button>
                </Box>

                <Divider />

                {/* LIST */}
                {notifications.length === 0 ? (
                    <Box p={2}>
                        <Typography variant="body2">No notifications</Typography>
                    </Box>
                ) : (

                    notifications.map((n) => (
                        <MenuItem
                            key={n.id}
                            onClick={() => dispatch(markAsRead(n.id))}
                            sx={{
                                alignItems: "flex-start",
                                gap: 1.5,
                                py: 1.5,
                                px: 2,
                                transition: "all 0.2s ease",
                                backgroundColor: n.read ? "#fff" : "#f5f9ff",

                                "&:hover": {
                                    backgroundColor: "#eef4ff"
                                }
                            }}
                        >
                            {/* LEFT ICON */}
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: "50%",
                                    backgroundColor: n.read ? "#e0e0e0" : "#1976d2",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff",
                                    fontSize: 16
                                }}
                            >
                                💰
                            </Box>

                            {/* TEXT CONTENT */}
                            <Box flex={1}>
                                <Typography fontSize={14} fontWeight={600}>
                                    {n.title}
                                </Typography>

                                <Typography fontSize={13} color="text.secondary">
                                    {n.message}
                                </Typography>

                                <Typography fontSize={11} color="gray" mt={0.5}>
                                    {n.time}
                                </Typography>
                            </Box>

                            {/* UNREAD DOT */}
                            {!n.read && (
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        backgroundColor: "#1976d2",
                                        mt: 1
                                    }}
                                />
                            )}
                        </MenuItem>
                    ))
                )}
            </Menu>
        </>
    );
};

export default NotificationBell;