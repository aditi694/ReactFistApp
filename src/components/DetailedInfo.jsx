import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { BANK_OPTIONS, ACCOUNT_TYPES } from "../constants/formOptions";
import { Button, Typography, Box } from "@mui/material";

const DetailedInfo = ({ formik, prevStep }) => {
    const fields = [
        { name: "aadhaar", label: "Aadhaar Number" },
        { name: "pan", label: "PAN Number" },
        { name: "preferredCity", label: "City" },
        { name: "preferredBranchName", label: "Branch" },
        { name: "password", type: "password", label: "Password" },
        { name: "confirmPassword", type: "password", label: "Confirm Password" },
    ];

    return (
        <Box>

            <Typography variant="h5" gutterBottom>
                Detailed Information
            </Typography>

            {fields.map((field) => (
                <InputField
                    key={field.name}
                    formik={formik}
                    {...field}
                />
            ))}

            <SelectField
                name="preferredBankName"
                formik={formik}
                options={BANK_OPTIONS}
                placeholder="Select Bank"
            />

            <SelectField
                name="accountType"
                formik={formik}
                options={ACCOUNT_TYPES}
                placeholder="Account Type"
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={prevStep}
                >
                    Back
                </Button>

                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                >
                    Submit
                </Button>
            </Box>

        </Box>
    );
};

export default DetailedInfo;