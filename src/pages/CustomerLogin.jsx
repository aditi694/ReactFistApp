import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerLogin } from "../api/authApi";
import { setToken } from "../utils/auth";

import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CustomerLogin = () => {
    const [form, setForm] = useState({ accountNumber: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // ✅ NEW

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await customerLogin(form.accountNumber, form.password);
            const token = res.data.token;
            setToken(token);
            navigate("/customer-dashboard");
        } catch {
            setError("Invalid credentials");
        }
    };

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
                        inputProps={{ spellCheck: false }}
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
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
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
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default CustomerLogin;