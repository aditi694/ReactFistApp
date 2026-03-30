import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { GENDER_OPTIONS } from "../constants/formOptions";
import { TextField, Button, Typography, Box } from "@mui/material";

const BasicInfo = ({ formik, nextStep }) => {
    const fields = [
        { name: "name", label: "Full Name" },
        { name: "email", label: "Email" },
        { name: "phone", label: "Phone" },
        { name: "dob", type: "date", label: "Date of Birth" },
    ];

    return (
        <Box>

            <Typography variant="h5" gutterBottom>
                Basic Information
            </Typography>

            {fields.map((field) => (
                <InputField
                    key={field.name}
                    formik={formik}
                    {...field}
                    InputLabelProps={
                        field.type === "date" ? { shrink: true } : {}
                    }
                />
            ))}

            <SelectField
                name="gender"
                formik={formik}
                options={GENDER_OPTIONS}
                placeholder="Gender"
            />

            {/* ADDRESS FIELD (UPDATED) */}
            <TextField
                fullWidth
                multiline
                rows={3}
                margin="normal"
                label="Address"

                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}

                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
            />

            <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                onClick={nextStep}
            >
                Next
            </Button>

        </Box>
    );
};

export default BasicInfo;