import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Snackbar,
    Alert,
    MenuItem
} from "@mui/material";

import {
    transfer,
    getTransactionStatus
} from "../api/transactionApi";

import { getBeneficiaries } from "../api/customerApi";
import {
    getUserFromToken,
    getAccountNumberFromAPI
} from "../utils/auth";

import {
    Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

import { AccountBalance, Send } from "@mui/icons-material";

import paymentBg from "../assets/transfer.jpg";

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

    const [confirmOpen, setConfirmOpen] = useState(false);
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

    useEffect(() => {
        if (successOpen) {
            const timer = setTimeout(() => {
                setSuccessOpen(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [successOpen]);

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
                setSuccessOpen(true);
                setMessage("");
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
                fromAccount: accountNumber,
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
            setLastAmount(amount);
            setAmount("");
            setDesc("");

        } catch {
            setState("FAILED");
            setMessage("Network error");
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

                <Typography variant="h6" fontWeight="bold" mb={2}>
                    💸 Send Money
                </Typography>

                {/* ACCOUNT */}
                <Box sx={{ mb: 2 }}>
                    <Typography fontSize={12} color="gray">From</Typography>
                    <Typography fontWeight="bold">
                        ****{accountNumber?.slice(-4)}
                    </Typography>
                </Box>

                {/* BENEFICIARY */}
                <TextField
                    select
                    fullWidth
                    label="Select Beneficiary"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    sx={{ mb: 2 }}
                    SelectProps={{
                        MenuProps: {
                            disablePortal: false,
                            container: document.body,
                            PaperProps: {
                                sx: {
                                    backgroundColor: "#ffffff",
                                    color: "#111827",
                                    zIndex: 9999,
                                    mt: 1,
                                    borderRadius: 2,
                                    maxHeight: 300
                                }
                            }
                        }
                    }}
                >
                    {beneficiaries.map((b) => (
                        <MenuItem
                            key={b.beneficiaryId}
                            value={b.beneficiaryId}
                            sx={{
                                color: "#111827",
                                fontSize: 14,
                                "&:hover": {
                                    backgroundColor: "#F3F4F6"
                                }
                            }}
                        >
                            {b.beneficiaryName} • ****{b.beneficiaryAccount.slice(-4)}
                        </MenuItem>
                    ))}
                </TextField>

                {/* AMOUNT BIG STYLE */}
                <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography fontSize={12} color="gray">Amount</Typography>

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

                {/* DESCRIPTION */}
                <TextField
                    fullWidth
                    label="Description"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {/* CTA */}
                <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Send />}
                    onClick={() => setConfirmOpen(true)}
                    sx={{
                        height: 50,
                        borderRadius: 2,
                        fontWeight: "bold",
                        fontSize: 16,
                        bgcolor: "#2563EB"
                    }}
                >
                    Send ₹{amount || ""}
                </Button>

            </Box>

            {/* CONFIRM MODAL */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Transfer</DialogTitle>

                <DialogContent>
                    <Typography>₹{amount}</Typography>
                    <Typography fontSize={13} color="gray">
                        To: {beneficiaries.find(b => b.beneficiaryId === selected)?.beneficiaryName}
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setConfirmOpen(false);
                            handleTransfer();
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* SUCCESS POPUP */}
            <Dialog open={successOpen} onClose={() => setSuccessOpen(false)}>
                <Box sx={{ textAlign: "center", p: 3 }}>

                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "50%",
                        bgcolor: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2
                    }}>
                        <Typography sx={{ fontSize: 40, color: "#fff" }}>
                            ✓
                        </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="bold">
                        Transfer Successful
                    </Typography>

                    <Typography variant="h4" fontWeight="bold">
                        ₹{lastAmount}
                    </Typography>

                    <Button
                        fullWidth
                        onClick={() => setSuccessOpen(false)}
                        sx={{ mt: 2 }}
                        variant="contained"
                    >
                        Done
                    </Button>

                </Box>
            </Dialog>

            {/* SNACKBAR (for errors only) */}
            <Snackbar
                open={!!message}
                autoHideDuration={3000}
                onClose={() => setMessage("")}
            >
                <Alert severity={error ? "error" : "info"}>
                    {message}
                </Alert>
            </Snackbar>

        </Box>
    );
};

export default TransferPage;