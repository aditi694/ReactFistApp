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
    Divider
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../api/adminApi";

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
        const res = await getCustomerById(id);
        if (!res?.error) setCustomer(res.data);
        setLoading(false);
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
                <CircularProgress />
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

                            <Avatar
                                sx={{
                                    width: 64,
                                    height: 64,
                                    bgcolor: "primary.main",
                                    fontWeight: 700
                                }}
                            >
                                {customer.fullName?.charAt(0)}
                            </Avatar>

                            <Box>
                                <Typography variant="h5">
                                    {customer.fullName}
                                </Typography>

                                <Typography color="text.secondary">
                                    {customer.email} • {customer.phone}
                                </Typography>

                                <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                                    <Chip
                                        label={customer.kycStatus}
                                        color={
                                            customer.kycStatus === "APPROVED"
                                                ? "success"
                                                : "warning"
                                        }
                                        size="small"
                                    />
                                    <Chip
                                        label={customer.status}
                                        color={
                                            customer.status === "ACTIVE"
                                                ? "success"
                                                : "error"
                                        }
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

                            <Info label="Customer ID" value={customer.customerId} />
                            <Info label="Email" value={customer.email} />
                            <Info label="Phone" value={customer.phone} />
                            <Info label="Status" value={customer.status} />
                            <Info label="KYC Status" value={customer.kycStatus} />
                            <Info
                                label="Created"
                                value={new Date(customer.createdAt).toLocaleDateString("en-IN")}
                            />
                        </Paper>
                    )}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

/* ------------------ INFO ROW ------------------ */

const Info = ({ label, value }) => (
    <Box
        sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 1.2,
            borderBottom: "1px solid",
            borderColor: "divider",
        }}
    >
        <Typography color="text.secondary">{label}</Typography>
        <Typography fontWeight={600}>{value || "—"}</Typography>
    </Box>
);

export default CustomerDetail;