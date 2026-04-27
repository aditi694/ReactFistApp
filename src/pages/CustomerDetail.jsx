import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Chip,
    Paper,
    Tabs,
    Tab,
    CircularProgress,
    Button,
    Divider,
    IconButton
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../api/adminApi";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

/* ------------------ LOCAL THEME ------------------ */

const theme = createTheme({
    palette: {
        primary: { main: "#2563EB" },
        success: { main: "#16A34A" },
        error: { main: "#DC2626" },
        warning: { main: "#F59E0B" },
        background: {
            default: "#F9FAFB",
            paper: "#FFFFFF",
        },
    },
    shape: {
        borderRadius: 12,
    },
});

/* ------------------ MAIN COMPONENT ------------------ */

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        fetchCustomer();
    }, []);

    const fetchCustomer = async () => {
        try {
            const res = await getCustomerById(id);

            if (res?.error) {
                setCustomer(null);
            } else {
                setCustomer(res.data);
            }
        } catch (err) {
            console.error(err);
            setCustomer(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (!customer) {
        return (
            <Box textAlign="center" mt={10}>
                <Typography variant="h6">Customer not found</Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
                    Go Back
                </Button>
            </Box>
        );
    }

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
                <Box sx={{ maxWidth: 900, mx: "auto", px: 2 }}>

                    {/* BACK */}
                    <Button
                        onClick={() => navigate("/dashboard")}
                        sx={{ mb: 2, textTransform: "none", fontWeight: 600 }}
                    >
                        ← Back
                    </Button>

                    {/* HEADER */}
                    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>

                            <Avatar
                                sx={{
                                    width: 70,
                                    height: 70,
                                    bgcolor: "primary.main",
                                    fontSize: 26,
                                    fontWeight: 700
                                }}
                            >
                                {customer.fullName?.charAt(0)}
                            </Avatar>

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h5" fontWeight={700}>
                                    {customer.fullName}
                                </Typography>

                                <Typography color="text.secondary" fontSize={14}>
                                    {customer.email}
                                </Typography>

                                <Typography color="text.secondary" fontSize={14}>
                                    {customer.phone}
                                </Typography>

                                <Box sx={{ mt: 1.5, display: "flex", gap: 1 }}>
                                    <Chip
                                        label={`KYC: ${customer.kycStatus}`}
                                        color={customer.kycStatus === "APPROVED" ? "success" : "warning"}
                                        size="small"
                                    />
                                    <Chip
                                        label={`Status: ${customer.status}`}
                                        color={customer.status === "ACTIVE" ? "success" : "error"}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Paper>

                    {/* TABS */}
                    <Tabs
                        value={tab}
                        onChange={(e, v) => setTab(v)}
                        sx={{
                            mb: 2,
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                            },
                        }}
                    >
                        <Tab label="Overview" />
                    </Tabs>

                    {/* CONTENT */}
                    {tab === 0 && (
                        <Paper elevation={2} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Customer Details
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Info
                                label="Customer ID"
                                value={customer.customerId?.slice(0, 8) + "..."}
                                copy={customer.customerId}
                            />
                            <Info label="Email" value={customer.email} />
                            <Info label="Phone" value={customer.phone} />
                            <Info label="Status" value={customer.status} />
                            <Info label="KYC Status" value={customer.kycStatus} />
                            <Info
                                label="Created"
                                value={
                                    customer.createdAt
                                        ? new Date(customer.createdAt).toLocaleDateString("en-IN")
                                        : "—"
                                } />
                            <Info
                                label="Date of Birth"
                                value={
                                    customer.dob
                                        ? new Date(customer.dob).toLocaleDateString("en-IN")
                                        : "—"
                                }
                            />                            <Info label="Gender" value={customer.gender} />
                            <Info label="Address" value={customer.address} />
                            <Info
                                label="KYC Verified At"
                                value={
                                    customer.kycVerifiedAt
                                        ? new Date(customer.kycVerifiedAt).toLocaleString("en-IN")
                                        : "Not Verified"
                                }
                            />
                        </Paper>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

/* ------------------ INFO ROW ------------------ */

const Info = ({ label, value, copy }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1.2,
            borderBottom: "1px solid",
            borderColor: "divider",
        }}
    >
        <Typography color="text.secondary">{label}</Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
                fontWeight={600}
                sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 180
                }}
            >
                {value ?? "—"}
            </Typography>
            {copy && (
                <IconButton
                    size="small"
                    onClick={() => navigator.clipboard.writeText(copy)}
                >
                    <ContentCopyIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    </Box>
);

export default CustomerDetail;