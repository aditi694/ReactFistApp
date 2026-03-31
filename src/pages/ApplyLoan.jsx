import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyLoan } from "../api/customerApi";

const loanTypes = [
    "PERSONAL",
    "HOME",
    "CAR",
    "EDUCATION",
    "BUSINESS"
];

const ApplyLoan = () => {

    const [amount, setAmount] = useState("");
    const [loanType, setLoanType] = useState("PERSONAL");

    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleApply = async () => {

        setMessage("");
        setError(false);

        if (!amount || Number(amount) <= 0) {
            setMessage("Please enter valid loan amount");
            setError(true);
            return;
        }

        const res = await applyLoan({
            loanType,
            amount: Number(amount) // ✅ CORRECT FIELD
        });

        if (res?.error) {
            setMessage(res.message);
            setError(true);
            return;
        }

        setMessage(res?.resultInfo?.resultMsg || "Loan applied successfully");

        setTimeout(() => {
            navigate("/customer-dashboard", { state: { refresh: true } });
        }, 1500);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>

            <Typography variant="h5">Apply Loan</Typography>

            <TextField
                select
                fullWidth
                label="Loan Type"
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                margin="normal"
            >
                {loanTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                fullWidth
                label="Loan Amount"
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

export default ApplyLoan;