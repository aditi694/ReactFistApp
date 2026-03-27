import * as Yup from "yup";

export const step1Schema = Yup.object({
    name: Yup.string().required("Name is required"),

    email: Yup.string()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email")
        .required("Email is required"),

    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone is required"),

    dob: Yup.string().required("DOB is required"),

    gender: Yup.string().required("Gender is required"),

    address: Yup.string().required("Address is required"),
});

export const step2Schema = Yup.object({
    aadhaar: Yup.string()
        .matches(/^[0-9]{12}$/, "Aadhaar must be 12 digits")
        .required("Aadhaar is required"),

    pan: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN")
        .required("PAN is required"),

    preferredBankName: Yup.string().required("Bank is required"),

    preferredCity: Yup.string().required("City is required"),

    preferredBranchName: Yup.string().required("Branch is required"),

    accountType: Yup.string().required("Account type is required"),

    password: Yup.string()
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$]).{6,}$/,
            "Weak password"
        )
        .required("Password is required"),

    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Password mismatch")
        .required("Confirm your password"),
});