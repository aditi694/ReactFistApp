import {useState} from "react";
import {useFormik} from "formik";
import BasicInfo from "../components/BasicInfo";
import DetailedInfo from "../components/DetailedInfo";
import {useNavigate} from "react-router-dom";
import {registerCustomer} from "../api/authApi";


import {
    step1Schema,
    step2Schema,
} from "../validation/registerSchema";

const Register = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

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
        },

        validationSchema: step === 1 ? step1Schema : step2Schema,

        onSubmit: async (values) => {
            try {
                const data = await registerCustomer(values);

                alert(`
                    Registration Successful!
                    Account Number: ${data.accountNumber}
                    Status: ${data.accountStatus}
                    KYC: ${data.kycStatus}
                `);

                navigate("/customer-login");

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
        <div className="container">
            <h2>Register</h2>

            <form onSubmit={formik.handleSubmit}>
                {step === 1 ? (
                    <BasicInfo formik={formik} nextStep={handleNext}/>
                ) : (
                    <DetailedInfo formik={formik} prevStep={() => setStep(1)}/>
                )}
            </form>
        </div>
    );
};

export default Register;