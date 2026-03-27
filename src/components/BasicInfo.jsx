import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { GENDER_OPTIONS } from "../constants/formOptions";

const BasicInfo = ({ formik, nextStep }) => {
    const fields = [
        { name: "name", placeholder: "Name" },
        { name: "email", placeholder: "Email" },
        { name: "phone", placeholder: "Phone" },
        { name: "dob", type: "date" },
    ];

    return (
        <div>
            <h3>Basic Information</h3>

            {fields.map((field) => (
                <InputField key={field.name} formik={formik} {...field} />
            ))}

            <SelectField
                name="gender"
                formik={formik}
                options={GENDER_OPTIONS}
                placeholder="Select Gender"
            />

            <textarea
                {...formik.getFieldProps("address")}
                placeholder="Address"
            />

            {formik.touched.address && formik.errors.address && (
                <div className="error">{formik.errors.address}</div>
            )}

            <button type="button" onClick={nextStep}>
                Next
            </button>
        </div>
    );
};

export default BasicInfo;