import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    MenuItem,
    CircularProgress
} from "@mui/material";

import {
    transfer,
    getTransactionStatus
} from "../api/transactionApi";

import { getBeneficiaries } from "../api/beneficiaryApi";
import {
    getUserFromToken,
    getAccountNumberFromAPI
} from "../utils/auth";

const TransferPage = () => {

    const user = getUserFromToken();

    const [accountNumber, setAccountNumber] = useState("");

    const [beneficiaries, setBeneficiaries] = useState([]);
    const [selected, setSelected] = useState("");

    const [amount, setAmount] = useState("");
    const [desc, setDesc] = useState("");

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

    useEffect(() => {
        const fetch = async () => {
            const res = await getBeneficiaries();
            if (!res?.error) {
                const filtered = res.data.filter(
                    (b) => b.verificationStatus === "VERIFIED" && b.active
                );
                setBeneficiaries(filtered);
            }
        };
        fetch();
    }, []);

    const validate = () => {
        if (!accountNumber) return "Account not loaded yet";
        if (!selected) return "Select beneficiary";
        if (!amount || Number(amount) <= 0) return "Amount must be greater than 0";
        if (Number(amount) > 50000) return "Exceeds per transaction limit";
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
                setMessage("✅ Transfer Successful");
                setError(false);
            }

            if (status === "FAILED") {
                clearInterval(interval);
                setState("FAILED");
                setMessage("❌ Transfer Failed");
                setError(true);
            }

            if (attempts > 10) {
                clearInterval(interval);
                setState("IDLE");
                setMessage("⏳ Still processing. Check history.");
            }

        }, 2000);
    };

    const handleTransfer = async () => {

        setMessage("");
        setError(false);

        const validationError = validate();
        if (validationError) {
            setMessage(validationError);
            setError(true);
            return;
        }

        setState("LOADING");

        const beneficiary = beneficiaries.find(
            (b) => b.beneficiaryId === selected
        );

        try {

            const res = await transfer({
                fromAccount: accountNumber, // ✅ FIXED
                toAccount: beneficiary.beneficiaryAccount,
                amount: Number(amount),
                description: desc
            });

            if (res.error) {
                setState("FAILED");

                if (res.status === 503) {
                    setMessage("⚠️ Service unavailable. Try again.");
                } else {
                    setMessage(res.message || "Transfer failed");
                }

                setError(true);
                return;
            }

            const txnId = res.data.transactionId;

            setState("PROCESSING");
            setMessage("⏳ Transfer initiated. Processing...");

            pollStatus(txnId);

            setAmount("");
            setDesc("");

        } catch {
            setState("FAILED");
            setMessage("Network error");
            setError(true);
        }
    };

    return (
        <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>

            <Typography variant="h4" gutterBottom>
                Transfer Money
            </Typography>

            {/* FROM ACCOUNT */}
            <TextField
                fullWidth
                label="From Account"
                value={accountNumber || ""}
                disabled
                margin="normal"
            />

            {/* BENEFICIARY */}
            <TextField
                select
                fullWidth
                label="Select Beneficiary"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                margin="normal"
            >
                {beneficiaries.map((b) => (
                    <MenuItem key={b.beneficiaryId} value={b.beneficiaryId}>
                        {b.beneficiaryName} • {b.beneficiaryAccount}
                    </MenuItem>
                ))}
            </TextField>

            {/* AMOUNT */}
            <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(e.target.value)}
                margin="normal"
            />

            {/* DESCRIPTION */}
            <TextField
                fullWidth
                label="Description"
                value={desc || ""}
                onChange={(e) => setDesc(e.target.value)}
                margin="normal"
            />

            {/* BUTTON */}
            <Button
                fullWidth
                variant="contained"
                onClick={handleTransfer}
                disabled={
                    state === "LOADING" ||
                    state === "PROCESSING" ||
                    !accountNumber
                }
                sx={{ mt: 2 }}
            >
                {state === "LOADING" && <CircularProgress size={24} />}
                {state === "PROCESSING" && "Processing..."}
                {state === "FAILED" && "Retry Transfer"}
                {(state === "IDLE" || state === "SUCCESS") && "Transfer"}
            </Button>

            {/* MESSAGE */}
            <Snackbar
                open={!!message}
                autoHideDuration={3000}
                onClose={() => setMessage("")}
            >
                <Alert severity={error ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default TransferPage;