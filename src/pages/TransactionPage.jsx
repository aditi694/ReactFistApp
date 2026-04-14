import { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
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

import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Fade
} from "@mui/material";

import {
    ShoppingCart, Fastfood, Receipt, Payments, AccountBalance
} from "@mui/icons-material";

import paymentBg from "../assets/payment.jpg";
import {useSelector} from "react-redux";

const categoriesMap = {
    DEBIT: ["SHOPPING", "FOOD", "BILL"],
    CREDIT: ["SALARY", "ATM", "OTHERS"]
};

const categoryIcons = {
    SHOPPING: <ShoppingCart />,
    FOOD: <Fastfood />,
    BILL: <Receipt />,
    SALARY: <Payments />,
    ATM: <AccountBalance />,
    OTHERS: <Receipt />
};
const TransactionPage = () => {

    const user = getUserFromToken();

    const [accountNumber, setAccountNumber] = useState("");

    const [type, setType] = useState("DEBIT");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("SHOPPING");
    const [description, setDescription] = useState("");

    const [ state , setState] = useState("IDLE");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const { data } = useSelector((state) => state.account);
    const [successOpen, setSuccessOpen] = useState(false);
    const [lastAmount, setLastAmount] = useState(0);

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
        if (successOpen) {
            const timer = setTimeout(() => {
                setSuccessOpen(false);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [successOpen]);

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
                setSuccessOpen(true);
                setError(false);
                setMessage("");
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
            setLastAmount(amount);
            setAmount("");
            setDescription("");

        } catch {
            setState("FAILED");
            setMessage("Network error. Try again.");
            setError(true);
        }
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            backgroundImage: `url(${paymentBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2
        }}>

            {/* GLASS CARD */}
            <Box sx={{
                width: "100%",
                maxWidth: 520,
                backdropFilter: "#fffff",
                background: "rgba(255,255,255,0.85)",
                borderRadius: 4,
                p: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
            }}>

                {/* HEADER */}
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    💳 Quick Pay
                </Typography>

                {/* TOGGLE */}
                <Box sx={{
                    display: "flex",
                    borderRadius: 2,
                    overflow: "hidden",
                    mb: 2
                }}>
                    {["DEBIT", "CREDIT"].map((t) => (
                        <Box
                            key={t}
                            onClick={() => {
                                setType(t);
                                setCategory(categoriesMap[t][0]);
                            }}
                            sx={{
                                flex: 1,
                                textAlign: "center",
                                py: 1,
                                cursor: "pointer",
                                fontWeight: "bold",
                                bgcolor: type === t
                                    ? (t === "DEBIT" ? "#cd2d2d" : "#437061")
                                    : "#e5e7eb",
                                color: type === t ? "#fff" : "#000"
                            }}
                        >
                            {t}
                        </Box>
                    ))}
                </Box>

                {/* ACCOUNT + BALANCE */}
                <Box sx={{ mb: 2 }}>
                    <Typography fontSize={12} color="gray">
                        Account
                    </Typography>
                    <Typography fontWeight="bold">
                        ****{accountNumber?.slice(-4)}
                    </Typography>

                    <Typography fontSize={12} color="gray">
                        Balance: ₹{data?.balance || 0}
                    </Typography>
                </Box>

                {/* AMOUNT */}
                <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography fontSize={12} color="gray">
                        Enter Amount
                    </Typography>

                    <TextField
                        variant="standard"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="₹0"
                        InputProps={{
                            disableUnderline: true,
                            sx: {
                                fontSize: 36,
                                textAlign: "center",
                                fontWeight: "bold"
                            }
                        }}
                        sx={{ width: "100%" }}
                    />
                </Box>

                {/* CATEGORY ICONS */}
                <Box sx={{ mb: 2 }}>
                    <Typography fontSize={12} color="gray" mb={1}>
                        Category
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {categoriesMap[type].map((c) => (
                            <Box
                                key={c}
                                onClick={() => setCategory(c)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    bgcolor: category === c ? "#9baed6" : "#f1f5f9",
                                    color: category === c ? "#fff" : "#000"
                                }}
                            >
                                {categoryIcons[c]}
                                {c}
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* CHARGES PREVIEW */}
                <Typography fontSize={13} color="gray" mb={2}>
                    Charges: ₹{type === "DEBIT" ? 0 : 0}
                </Typography>

                {/* DESCRIPTION */}
                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* CTA */}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => setConfirmOpen(true)}
                    sx={{
                        height: 50,
                        borderRadius: 2,
                        fontWeight: "bold",
                        fontSize: 16,
                        bgcolor: type === "DEBIT" ? "#cd2d2d" : "#437061"
                    }}
                >
                    {type === "DEBIT" ? "Pay" : "Add"} ₹{amount || ""}
                </Button>

            </Box>

            {/* CONFIRM MODAL */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Transaction</DialogTitle>

                <DialogContent>
                    <Typography>
                        {type} ₹{amount}
                    </Typography>
                    <Typography variant="body2" color="gray">
                        Category: {category}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setConfirmOpen(false);
                            handleTransaction();
                        }}
                        variant="contained"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            {/* SUCCESS POPUP */}
            <Dialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                fullWidth
                maxWidth="xs"
            >
                <Box sx={{
                    textAlign: "center",
                    p: 3
                }}>
                    {/* GREEN CIRCLE */}
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                        animation: "scaleIn 0.4s ease"
                    }}>
                        <Typography sx={{ fontSize: 40, color: "#fff" }}>
                            ✓
                        </Typography>
                    </Box>

                    {/* TITLE */}
                    <Typography variant="h6" fontWeight="bold" mb={1}>
                        Transaction Successful
                    </Typography>

                    {/* AMOUNT */}
                    <Typography variant="h4" fontWeight="bold" mb={1}>
                        ₹{lastAmount}
                    </Typography>

                    {/* DETAILS */}
                    <Typography fontSize={13} color="gray" mb={2}>
                        {type} • {category}
                    </Typography>

                    {/* BUTTON */}
                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => setSuccessOpen(false)}
                        sx={{
                            borderRadius: 2,
                            height: 45,
                            bgcolor: "#10B981",
                            fontWeight: "bold"
                        }}
                    >
                        Done
                    </Button>

                </Box>
            </Dialog>
            {/* SNACKBAR */}
            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage("")}
                TransitionComponent={Fade}
            >
                <Alert severity={error ? "error" : "success"}>
                    {message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default TransactionPage;