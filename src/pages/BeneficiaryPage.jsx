import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Alert
} from "@mui/material";
import {
    addBeneficiary,
    getBeneficiaries
} from "../api/beneficiaryApi";

import { getUserFromToken, getAccountNumberFromAPI } from "../utils/auth";

const getBeneficiaryList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.content)) return payload.content;
    if (Array.isArray(payload?.beneficiaries)) return payload.beneficiaries;
    return [];
};

const normalizeBeneficiary = (beneficiary, index) => ({
    beneficiaryId: beneficiary?.beneficiaryId ?? beneficiary?.id ?? `ben-${index}`,
    beneficiaryName: beneficiary?.beneficiaryName ?? beneficiary?.name ?? "Unnamed",
    beneficiaryAccount: beneficiary?.beneficiaryAccount ?? beneficiary?.accountNumber ?? "-",
    ifscCode: beneficiary?.ifscCode ?? beneficiary?.ifsc ?? "-",
    bankName: beneficiary?.bankName ?? "Unknown",
    verificationStatus: beneficiary?.verificationStatus ?? beneficiary?.status ?? "UNKNOWN",
    verified: beneficiary?.verified ?? false,
    active: beneficiary?.active ?? true,
    createdAt: beneficiary?.createdAt ?? new Date().toISOString()
});

const BeneficiaryPage = () => {
    const [accountNumber, setAccountNumber] = useState("");
    const [name, setName] = useState("");
    const [account, setAccount] = useState("");
    const [ifsc, setIfsc] = useState("");

    const [list, setList] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(false);
    const [initLoading, setInitLoading] = useState(true); // Initial load

    const user = getUserFromToken();
    const fetchData = async () => {
        setListLoading(true);
        setMessage("");

        const res = await getBeneficiaries();

        if (!res?.error) {
            const beneficiaries = getBeneficiaryList(res?.data)
                .map((b, idx) => normalizeBeneficiary(b, idx));

            setList(beneficiaries);
            console.log("✅ Beneficiaries loaded:", beneficiaries);
        } else {
            setList([]);
            setMessage(res?.message || "Unable to load beneficiaries");
            setError(true);
            console.error("❌ Failed to load beneficiaries:", res?.message);
        }

        setListLoading(false);
    };

    useEffect(() => {
        const initializePage = async () => {
            setInitLoading(true);

            if (!user) {
                console.error("❌ User not logged in or token invalid");
                setError(true);
                setMessage("Login again to manage beneficiaries");
                setInitLoading(false);
                return;
            }
            let accountNum = user.accountNumber;

            if (!accountNum) {
                console.log("⏳ Account number not in token, fetching from API...");
                accountNum = await getAccountNumberFromAPI(user);
            }

            if (!accountNum) {
                console.error("❌ Could not get account number from token or API");
                setError(true);
                setMessage("Account number not found. Please login again.");
                setInitLoading(false);
                return;
            }

            setAccountNumber(accountNum);
            console.log("✅ Account number set:", accountNum);
            await fetchData();
            setInitLoading(false);
        };

        initializePage();
    }, []);

    const handleAdd = async () => {
        setMessage("");
        setError(false);

        const trimmedName = name.trim();
        const trimmedAccount = account.trim().toUpperCase();
        const trimmedIfsc = ifsc.trim().toUpperCase();

        if (!accountNumber) {
            setMessage("Login again. Account missing.");
            setError(true);
            return;
        }

        if (trimmedAccount === accountNumber) {
            setMessage("You cannot add your own account");
            setError(true);
            return;
        }

        if (!trimmedName || trimmedName.length < 2) {
            setMessage("Invalid name");
            setError(true);
            return;
        }

        if (!/^AC\d{10,}$/.test(trimmedAccount)) {
            setMessage("Invalid account format (AC...)");
            setError(true);
            return;
        }

        if (!/^[A-Z]{4}0[A-Z0-9]{5,6}$/.test(trimmedIfsc)) {
            setMessage("Invalid IFSC (ICIC0XXXX)");
            setError(true);
            return;
        }

        setLoading(true);

        console.log("📤 Sending:", {
            accountNumber,
            beneficiaryName: trimmedName,
            beneficiaryAccount: trimmedAccount,
            ifscCode: trimmedIfsc
        });

        const res = await addBeneficiary({
            accountNumber,
            beneficiaryName: trimmedName,
            beneficiaryAccount: trimmedAccount,
            ifscCode: trimmedIfsc
        });

        setLoading(false);

        if (res?.error) {
            setMessage(res.message);
            setError(true);
            return;
        }

        setMessage(" Beneficiary added successfully");
        setError(false);

        setName("");
        setAccount("");
        setIfsc("");

        await fetchData();
    };

    if (initLoading) {
        return (
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, color: "text.secondary" }}>
                    Loading your account...
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
            {/* HEADER */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
                Manage Beneficiaries
            </Typography>

            {/* ACCOUNT NUMBER (READ-ONLY) */}
            <TextField
                fullWidth
                label="Your Account Number"
                value={accountNumber}
                InputProps={{ readOnly: true }}
                margin="normal"
                disabled
                helperText={accountNumber ? "Your account" : "Account not found"}
            />

            {/* DIVIDER */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2, color: "text.secondary" }}>
                Add New Beneficiary
            </Typography>

            {/* BENEFICIARY NAME */}
            <TextField
                fullWidth
                label="Beneficiary Name"
                placeholder="e.g., John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                disabled={!accountNumber || loading}
                helperText="2-50 characters"
            />

            {/* BENEFICIARY ACCOUNT */}
            <TextField
                fullWidth
                label="Beneficiary Account Number"
                placeholder="e.g., 1234567890"
                value={account}
                onChange={(e) => setAccount(e.target.value.toUpperCase())}
                margin="normal"
                disabled={!accountNumber || loading}
                helperText="10-20 digits"
            />

            {/* IFSC CODE */}
            <TextField
                fullWidth
                label="IFSC Code"
                placeholder="ICIC0BEN02"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                margin="normal"
                inputProps={{ maxLength: 11 }}
                helperText="Example: ICIC0BEN02"
            />

            {/* MESSAGE ALERT */}
            {message && (
                <Alert severity={error ? "error" : "success"} sx={{ mt: 2, mb: 2 }}>
                    {message}
                </Alert>
            )}

            {/* ADD BUTTON */}
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAdd}
                disabled={loading || !accountNumber}
                sx={{ mt: 2, py: 1.5 }}
                size="large"
            >
                {loading ? (
                    <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Adding...
                    </>
                ) : (
                    "Add Beneficiary"
                )}
            </Button>

            {/* BENEFICIARIES LIST */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                    Your Beneficiaries
                </Typography>

                {listLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : list.length === 0 ? (
                    <Typography sx={{ color: "text.secondary", textAlign: "center", py: 3 }}>
                        No beneficiaries yet. Add one above.
                    </Typography>
                ) : (
                    list.map((b) => (
                        <Card
                            key={b.beneficiaryId}
                            sx={{
                                mb: 2,
                                borderLeft: `4px solid ${
                                    b.verificationStatus === "VERIFIED"
                                        ? "#4caf50"
                                        : b.verificationStatus === "PENDING"
                                            ? "#ff9800"
                                            : "#f44336"
                                }`
                            }}
                        >
                            <CardContent>
                                {/* NAME */}
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {b.beneficiaryName}
                                </Typography>

                                {/* ACCOUNT */}
                                <Typography color="text.secondary">
                                    Account: <strong>{b.beneficiaryAccount}</strong>
                                </Typography>

                                {/* IFSC */}
                                <Typography color="text.secondary">
                                    IFSC: <strong>{b.ifscCode}</strong>
                                </Typography>

                                {/* BANK NAME */}
                                {b.bankName && (
                                    <Typography color="text.secondary">
                                        Bank: <strong>{b.bankName}</strong>
                                    </Typography>
                                )}

                                {/* STATUS */}
                                <Typography
                                    sx={{
                                        mt: 1.5,
                                        fontWeight: "bold",
                                        color:
                                            b.verificationStatus === "VERIFIED"
                                                ? "success.main"
                                                : b.verificationStatus === "PENDING"
                                                    ? "warning.main"
                                                    : "error.main"
                                    }}
                                >
                                    Status: {b.verificationStatus}
                                </Typography>

                                {/* CREATED DATE */}
                                <Typography sx={{ mt: 1, fontSize: 12, color: "text.secondary" }}>
                                    Added: {new Date(b.createdAt).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default BeneficiaryPage;