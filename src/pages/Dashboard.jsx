import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllCustomers,
    updateKyc,
    blockCustomer,
    unblockCustomer
} from "../api/adminApi";
import { logoutUser } from "../utils/auth";
import {
    Card,
    Box,
    CardContent,
    CardActions,
    Typography,
    Button
} from "@mui/material";

const Dashboard = () => {

    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            console.log("TOKEN:", localStorage.getItem("token"));
            const res = await getAllCustomers();
            setCustomers(res.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load customers");
        } finally {
            setLoading(false);
        }
    };

    const handleApproveKyc = async (id) => {
        try {
            console.log("TOKEN BEFORE KYC:", localStorage.getItem("token"));
            await updateKyc(id, "APPROVED", "Verified");
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRejectKyc = async (id) => {
        try {
            console.log("TOKEN BEFORE KYC:", localStorage.getItem("token"));
            await updateKyc(id, "REJECTED", "Invalid documents");
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleBlock = async (id) => {
        try {
            await blockCustomer(id, "Suspicious activity");
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnblock = async (id) => {
        try {
            await unblockCustomer(id);
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    if (loading) return <h3>Loading customers...</h3>;
    if (error) return <h3>{error}</h3>;

    return (
        <div>
            <Box
                sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    mb: 2
                }}>
                <Typography
                    variant="h5"
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)"
                    }}>
                    Admin Dashboard
                </Typography>
                <Button
                    sx={{ ml: "auto" }}
                    variant="outlined"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            <h3>Customers List</h3>

            {customers.length === 0 && <p>No customers found</p>}

            {customers.map((c) => (
                <Card key={c.customerId} sx={{ mb: 2, p: 1 }}>

                    <CardContent>
                        <Typography variant="h6">{c.fullName}</Typography>

                        <Typography>Email: {c.email}</Typography>
                        <Typography>Phone: {c.phone}</Typography>

                        <Typography>
                            Status:
                            <span style={{ color: c.status === "ACTIVE" ? "green" : "red" }}>
          {" "}{c.status}
        </span>
                        </Typography>

                        <Typography>
                            KYC:
                            <span style={{ color: c.kycStatus === "APPROVED" ? "green" : "orange" }}>
          {" "}{c.kycStatus}
        </span>
                        </Typography>

                        <Typography>
                            Created: {new Date(c.createdAt).toLocaleString()}
                        </Typography>
                    </CardContent>

                    <CardActions>

                        {c.kycStatus === "PENDING" && (
                            <>
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleApproveKyc(c.customerId)}
                                >
                                    Approve
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRejectKyc(c.customerId)}
                                >
                                    Reject
                                </Button>
                            </>
                        )}

                        {c.status === "ACTIVE" && (
                            <Button
                                variant="outlined"
                                color="warning"
                                onClick={() => handleBlock(c.customerId)}
                            >
                                Block
                            </Button>
                        )}

                        {c.status === "BLOCKED" && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleUnblock(c.customerId)}
                            >
                                Unblock
                            </Button>
                        )}

                    </CardActions>

                </Card>
            ))}
        </div>
    );
};

export default Dashboard;