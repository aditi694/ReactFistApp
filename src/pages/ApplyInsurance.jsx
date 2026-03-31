import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyInsurance } from "../api/customerApi";

const insuranceTypes = ["LIFE", "HEALTH", "LOAN", "VEHICLE"];

const ApplyInsurance = () => {

    const [amount, setAmount] = useState("");
    const [type, setType] = useState("HEALTH");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleApply = async () => {

        setMessage("");
        setError(false);

        if (!amount || Number(amount) <= 0) {
            setMessage("Enter valid coverage amount");
            setError(true);
            return;
        }

        const res = await applyInsurance({
            insuranceType: type,
            coverageAmount: Number(amount)
        });

        if (res?.error) {
            setMessage(res.message);
            setError(true);
            return;
        }

        setMessage(res?.resultInfo?.resultMsg || "Insurance applied");

        setTimeout(() => {
            navigate("/customer-dashboard", { state: { refresh: true } });
        }, 1500);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>

            <Typography variant="h5">Apply Insurance</Typography>

            <TextField
                select
                fullWidth
                label="Insurance Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                margin="normal"
            >
                {insuranceTypes.map((t) => (
                    <MenuItem key={t} value={t}>
                        {t}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                fullWidth
                label="Coverage Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                margin="normal"
            />

            <Button
                fullWidth
                variant="contained"
                onClick={handleApply}
                sx={{ mt: 2 }}
            >
                Submit
            </Button>

            {message && (
                <Typography
                    sx={{
                        mt: 2,
                        color: error ? "error.main" : "success.main",
                        fontWeight: "bold"
                    }}
                >
                    {message}
                </Typography>
            )}

        </Box>
    );
};

export default ApplyInsurance;