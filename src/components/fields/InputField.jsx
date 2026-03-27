const InputField = ({ name, formik, type = "text", ...props }) => {
    return (
        <div>
            <input
                type={type}
                {...formik.getFieldProps(name)}
                {...props}
            />

            {formik.touched[name] && formik.errors[name] && (
                <div className="error">{formik.errors[name]}</div>
            )}
        </div>
    );
};

export default InputField;