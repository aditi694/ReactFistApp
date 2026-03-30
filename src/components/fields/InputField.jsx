import { TextField } from "@mui/material";

const InputField = ({ name, formik, type = "text", ...props }) => {
    return (
        <TextField
            fullWidth
            margin="normal"
            type={type}
            {...props}

            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}

            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
        />
    );
};

export default InputField;