import { Box, Typography, TextField, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyCreditCard } from "../api/customerApi";

const ApplyCreditCard = () => {

    const [name, setName] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const handleApply = async () => {

        setMessage("");
        setError(false);

        if (!name || name.trim().length < 5) {
            setMessage("Enter full name (min 5 characters)");
            setError(true);
            return;
        }

        const res = await applyCreditCard({
            cardHolderName: name.trim()
        });

        if (res?.error) {
            setMessage(res.message);
            setError(true);
            return;
        }

        setMessage(res?.resultInfo?.resultMsg || "Request submitted");

        setTimeout(() => {
            navigate("/customer-dashboard", { state: { refresh: true } });
        }, 1500);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>

            <Typography variant="h5">Apply Credit Card</Typography>

            <TextField
                fullWidth
                label="Card Holder Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

export default ApplyCreditCard;