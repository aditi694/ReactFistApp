import { useState } from "react";
import { useFormik } from "formik";
import BasicInfo from "../components/BasicInfo";
import DetailedInfo from "../components/DetailedInfo";
import { useNavigate } from "react-router-dom";
import { registerCustomer } from "../api/authApi";

import {
    step1Schema,
    step2Schema,
} from "../validation/registerSchema";

import {
    Box,
    Container,
    Card,
    CardContent,
    Typography,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

const steps = ["Basic Info", "Details"];

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [open, setOpen] = useState(false);
    const [responseData, setResponseData] = useState(null);

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            dob: "",
            gender: "",
            address: "",
            aadhaar: "",
            pan: "",
            preferredBankName: "",
            preferredCity: "",
            preferredBranchName: "",
            accountType: "",
            password: "",
            confirmPassword: "",
            nominee: {
                name: "",
                relation: "",
                dob: "",
            },
        },

        validationSchema: step === 1 ? step1Schema : step2Schema,

        onSubmit: async (values) => {
            try {
                const res = await registerCustomer(values);

                console.log("API RESPONSE:", res);

                const data = res?.data || res;

                setResponseData(data);
                setOpen(true);

            } catch (error) {
                alert(error.message);
            }
        },
    });

    const handleNext = async () => {
        const errors = await formik.validateForm();

        const step1Fields = [
            "name",
            "email",
            "phone",
            "dob",
            "gender",
            "address",
        ];

        const hasError = step1Fields.some((f) => errors[f]);

        if (!hasError) setStep(2);
        else step1Fields.forEach((f) => formik.setFieldTouched(f, true));
    };

    return (
        <Box sx={{ py: 6 }}>
            <Container maxWidth="sm">
                <Card
                    sx={{
                        borderRadius: 3,
                        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                        border: "1px solid #eee",
                    }}
                >
                    <CardContent sx={{ p: 4 }}>

                        {/* TITLE */}
                        <Typography
                            variant="h5"
                            fontWeight={600}
                            textAlign="center"
                            mb={1}
                        >
                            Signup Form
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                            mb={3}
                        >
                            Create your banking account
                        </Typography>

                        {/* STEPPER */}
                        <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 3 }}>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        <Divider sx={{ mb: 3 }} />

                        {/* FORM */}
                        <form onSubmit={formik.handleSubmit}>
                            {step === 1 ? (
                                <BasicInfo formik={formik} nextStep={handleNext} />
                            ) : (
                                <DetailedInfo
                                    formik={formik}
                                    prevStep={() => setStep(1)}
                                />
                            )}
                        </form>

                    </CardContent>
                </Card>
            </Container>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    🎉 Registration Successful
                </DialogTitle>

                <DialogContent dividers>

                    <Typography mb={1}>
                        <strong>Account Number:</strong> {responseData?.accountNumber}
                    </Typography>

                    <Typography mb={1}>
                        <strong>Status:</strong> {responseData?.accountStatus}
                    </Typography>

                    <Typography mb={1}>
                        <strong>Bank:</strong> {responseData?.bankName}
                    </Typography>

                    <Typography mb={1}>
                        <strong>Branch:</strong> {responseData?.branchName}
                    </Typography>

                    <Typography mb={1}>
                        <strong>IFSC:</strong> {responseData?.ifscCode}
                    </Typography>

                    <Typography mb={1}>
                        <strong>KYC:</strong> {responseData?.kycStatus}
                    </Typography>

                    <Typography mt={2} color="primary">
                        {responseData?.message}
                    </Typography>

                    <Typography mt={1} variant="body2" color="text.secondary">
                        {responseData?.nextSteps}
                    </Typography>

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => navigate("/customer-login")}
                    >
                        Go to Login
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Register;