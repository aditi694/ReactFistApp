import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { BANK_OPTIONS, ACCOUNT_TYPES } from "../constants/formOptions";
import { Button, Typography, Box } from "@mui/material";

const DetailedInfo = ({ formik, prevStep }) => {
    return (
        <Box>

            <Typography variant="h6" fontWeight={600} mb={2}>
                Account Details
            </Typography>

            <InputField name="aadhaar" label="Aadhaar Number" formik={formik} />
            <InputField name="pan" label="PAN Number" formik={formik} />
            <InputField name="preferredCity" label="City" formik={formik} />
            <InputField name="preferredBranchName" label="Branch" formik={formik} />

            <InputField name="password" type="password" label="Password" formik={formik} />
            <InputField name="confirmPassword" type="password" label="Confirm Password" formik={formik} />

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

            <Typography mt={3} mb={1} fontWeight={600}>
                Nominee Details
            </Typography>

            <InputField name="nominee.name" label="Nominee Name" formik={formik} />
            <InputField name="nominee.relation" label="Relation" formik={formik} />
            <InputField
                name="nominee.dob"
                type="date"
                label="Nominee DOB"
                formik={formik}
                InputLabelProps={{ shrink: true }}
            />

            {/* BUTTONS */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button
                    fullWidth
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                    onClick={prevStep}
                >
                    Back
                </Button>

                <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Submit
                </Button>
            </Box>

        </Box>
    );
};

export default DetailedInfo;