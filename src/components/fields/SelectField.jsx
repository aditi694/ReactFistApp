import { TextField, MenuItem } from "@mui/material";

const SelectField = ({ name, formik, options, placeholder }) => {
    return (
        <TextField
            select
            fullWidth
            margin="normal"
            label={placeholder}

            name={name}
            value={formik.values[name]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}

            error={formik.touched[name] && Boolean(formik.errors[name])}
            helperText={formik.touched[name] && formik.errors[name]}
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