import { TextField, MenuItem } from "@mui/material";
import get from "lodash/get";

const SelectField = ({ name, formik, options, placeholder }) => {
    const value = get(formik.values, name);
    const error = get(formik.errors, name);
    const touched = get(formik.touched, name);

    return (
        <TextField
            select
            fullWidth
            margin="normal"
            label={placeholder}
            name={name}
            value={value || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={touched && Boolean(error)}
            helperText={touched && error}
            sx={{
                "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                },
            }}
        >
            {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default SelectField;