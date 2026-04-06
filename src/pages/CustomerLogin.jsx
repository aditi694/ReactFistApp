import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/authSlice";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    InputAdornment,
    CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {getUserRole} from "../utils/auth.js";

const CustomerLogin = () => {
    const [form, setForm] = useState({
        accountNumber: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (loading) return;
        localStorage.removeItem("token");
        dispatch(loginUser(form));
    };

    useEffect(() => {
        if (isAuthenticated && !loading) {
            const role = getUserRole();
            if (role === "CUSTOMER") {
                navigate("/customer-dashboard", { replace: true });
            }
        }
    }, [isAuthenticated, loading]);

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5"
            }}
        >
            <Paper elevation={4} sx={{ p: 4, width: 350, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Customer Login
                </Typography>

                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleLogin} spellCheck={false}>
                    <TextField
                        fullWidth
                        label="Account Number"
                        name="accountNumber"
                        margin="normal"
                        value={form.accountNumber}
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default CustomerLogin;