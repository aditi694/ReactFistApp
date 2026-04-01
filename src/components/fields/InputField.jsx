import { TextField } from "@mui/material";
import get from "lodash/get";

const InputField = ({ name, formik, type = "text", ...props }) => {
    const value = get(formik.values, name);
    const error = get(formik.errors, name);
    const touched = get(formik.touched, name);

    const handleChange = (e) => {
        let val = e.target.value;

        if (name === "Aadhaar") {
            val = val.replace(/\D/g, "");
        }

        if (name === "pan") {
            val = val.toUpperCase();
        }

        formik.setFieldValue(name, val);
    };

    return (
        <TextField
            fullWidth
            margin="normal"
            size="medium"
            variant="outlined"
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                },
            }}
            type={type}
            {...props}
            name={name}
            value={value || ""}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={touched && Boolean(error)}
            helperText={touched && error}
        />
    );
};

export default InputField;