import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    CircularProgress,
    Grid,
    Snackbar,
    Alert
} from "@mui/material";

import {
    debit,
    credit,
    getTransactionStatus
} from "../api/transactionApi";

import {
    getUserFromToken,
    getAccountNumberFromAPI
} from "../utils/auth";

const categoriesMap = {
    DEBIT: ["SHOPPING", "FOOD", "BILL"],
    CREDIT: ["SALARY", "ATM", "OTHERS"]
};

const TransactionPage = () => {

    const user = getUserFromToken();

    const [accountNumber, setAccountNumber] = useState("");

    const [type, setType] = useState("DEBIT");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("SHOPPING");
    const [description, setDescription] = useState("");

    const [state, setState] = useState("IDLE");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    useEffect(() => {
        const initAccount = async () => {
            const acc = await getAccountNumberFromAPI(user);

            if (acc) {
                setAccountNumber(acc);
                localStorage.setItem("accountNumber", acc);
            }
        };

        initAccount();
    }, []);

    const validate = () => {
        if (!amount || Number(amount) <= 0) {
            return "Amount must be greater than 0";
        }
        if (!accountNumber) {
            return "Account not loaded yet";
        }
        return "";
    };

    const pollStatus = (txnId) => {

        let attempts = 0;

        const interval = setInterval(async () => {

            attempts++;

            const res = await getTransactionStatus(txnId);

            if (res.error) return;

            const status = res.data.status;

            if (status === "SUCCESS") {
                clearInterval(interval);
                setState("SUCCESS");
                setMessage("✅ Transaction Successful");
                setError(false);
            }

            if (status === "FAILED") {
                clearInterval(interval);
                setState("FAILED");
                setMessage("❌ Transaction Failed");
                setError(true);
            }

            if (attempts > 10) {
                clearInterval(interval);
                setState("IDLE");
                setMessage("⏳ Still processing. Check history.");
            }

        }, 2000);
    };

    const handleTransaction = async () => {

        setMessage("");
        setError(false);

        const validationError = validate();
        if (validationError) {
            setMessage(validationError);
            setError(true);
            return;
        }

        setState("LOADING");

        try {

            const payload = {
                accountNumber: accountNumber,
                amount: Number(amount),
                category,
                description
            };

            let res;

            if (type === "DEBIT") {
                res = await debit(payload);
            } else {
                res = await credit(payload);
            }

            if (res.error) {
                setState("FAILED");

                if (res.status === 503) {
                    setMessage("⚠️ Service temporarily unavailable. Please try again.");
                } else {
                    setMessage(res.message || "Transaction failed");
                }

                setError(true);
                return;
            }

            const txnId = res.data.transactionId;

            setState("PROCESSING");
            setMessage("⏳ Transaction initiated. Processing...");

            pollStatus(txnId);

            setAmount("");
            setDescription("");

        } catch {
            setState("FAILED");
            setMessage("Network error. Try again.");
            setError(true);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>

            <Typography variant="h4" gutterBottom>
                Make Transaction
            </Typography>

            <Grid container spacing={2}>

                {/* TYPE */}
                <Grid size={12}>
                    <TextField
                        select
                        fullWidth
                        label="Transaction Type"
                        value={type}
                        onChange={(e) => {
                            setType(e.target.value);
                            setCategory(categoriesMap[e.target.value][0]);
                        }}
                    >
                        <MenuItem value="DEBIT">DEBIT</MenuItem>
                        <MenuItem value="CREDIT">CREDIT</MenuItem>
                    </TextField>
                </Grid>

                {/* ACCOUNT */}
                <Grid size={12}>
                    <TextField
                        fullWidth
                        label="Account Number"
                        value={accountNumber || ""}
                        disabled
                    />
                </Grid>

                {/* AMOUNT */}
                <Grid size={12}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Amount"
                        value={amount || ""}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </Grid>

                {/* CATEGORY */}
                <Grid size={12}>
                    <TextField
                        select
                        fullWidth
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categoriesMap[type].map((c) => (
                            <MenuItem key={c} value={c}>
                                {c}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* DESCRIPTION */}
                <Grid size={12}>
                    <TextField
                        fullWidth
                        label="Description"
                        value={description || ""}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>

                {/* SUBMIT */}
                <Grid size={12}>
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleTransaction}
                        disabled={
                            state === "LOADING" ||
                            state === "PROCESSING" ||
                            !accountNumber
                        }
                    >
                        {state === "LOADING" && <CircularProgress size={24} />}
                        {state === "PROCESSING" && "Processing..."}
                        {state === "FAILED" && "Retry Transaction"}
                        {(state === "IDLE" || state === "SUCCESS") && "Submit"}
                    </Button>
                </Grid>

            </Grid>

            {/* SNACKBAR */}
            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage("")}
            >
                <Alert severity={error ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default TransactionPage;