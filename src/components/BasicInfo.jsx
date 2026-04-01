import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { GENDER_OPTIONS } from "../constants/formOptions";
import { Button, Typography, Box } from "@mui/material";

const BasicInfo = ({ formik, nextStep }) => {
    return (
        <Box>

            <Typography variant="h6" fontWeight={600} mb={2}>
                Basic Information
            </Typography>

            <InputField name="name" label="Full Name" formik={formik} />
            <InputField name="email" label="Email" formik={formik} />
            <InputField name="phone" label="Phone" formik={formik} />
            <InputField
                name="dob"
                type="date"
                label="Date of Birth"
                formik={formik}
                InputLabelProps={{ shrink: true }}
            />

            <SelectField
                name="gender"
                formik={formik}
                options={GENDER_OPTIONS}
                placeholder="Gender"
            />

            <InputField
                name="address"
                label="Address"
                formik={formik}
                multiline
                rows={3}
            />

            <Button
                fullWidth
                variant="contained"
                sx={{
                    mt: 3,
                    py: 1.2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                }}
                onClick={nextStep}
            >
                Next
            </Button>

        </Box>
    );
};

export default BasicInfo;