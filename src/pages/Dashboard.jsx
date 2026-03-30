import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllCustomers,
    updateKyc,
    blockCustomer,
    unblockCustomer
} from "../api/adminApi";
import { logoutUser } from "../utils/auth";

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
            <h2>Admin Dashboard</h2>

            <button onClick={handleLogout}>Logout</button>

            <h3>Customers List</h3>

            {customers.length === 0 && <p>No customers found</p>}

            {customers.map((c) => (
                <div
                    key={c.customerId}
                    style={{
                        border: "1px solid gray",
                        marginBottom: "10px",
                        padding: "10px"
                    }}
                >

                    <p><b>Name:</b> {c.fullName}</p>
                    <p><b>Email:</b> {c.email}</p>
                    <p><b>Phone:</b> {c.phone}</p>

                    <p>
                        <b>Status:</b>
                        <span style={{ color: c.status === "ACTIVE" ? "green" : "red" }}>
                            {" "}{c.status}
                        </span>
                    </p>

                    <p>
                        <b>KYC:</b>
                        <span style={{ color: c.kycStatus === "APPROVED" ? "green" : "orange" }}>
                            {" "}{c.kycStatus}
                        </span>
                    </p>

                    <p>
                        <b>Created:</b> {new Date(c.createdAt).toLocaleString()}
                    </p>

                    <div style={{ marginTop: "10px" }}>

                        {c.kycStatus === "PENDING" && (
                            <>
                                <button onClick={() => handleApproveKyc(c.customerId)}>
                                    Approve KYC
                                </button>

                                <button onClick={() => handleRejectKyc(c.customerId)}>
                                    Reject KYC
                                </button>
                            </>
                        )}

                        {c.status === "ACTIVE" && (
                            <button onClick={() => handleBlock(c.customerId)}>
                                Block
                            </button>
                        )}

                        {c.status === "BLOCKED" && (
                            <button onClick={() => handleUnblock(c.customerId)}>
                                Unblock
                            </button>
                        )}

                    </div>

                </div>
            ))}
        </div>
    );
};

export default Dashboard;