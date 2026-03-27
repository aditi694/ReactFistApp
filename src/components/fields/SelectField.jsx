const SelectField = ({ name, formik, options, placeholder }) => {
    return (
        <div>
            <select {...formik.getFieldProps(name)}>
                <option value="">{placeholder}</option>

                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {formik.touched[name] && formik.errors[name] && (
                <div className="error">{formik.errors[name]}</div>
            )}
        </div>
    );
};

export default SelectField;