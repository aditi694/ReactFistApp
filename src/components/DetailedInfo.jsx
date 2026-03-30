import InputField from "./fields/InputField";
import SelectField from "./fields/SelectField";
import { BANK_OPTIONS, ACCOUNT_TYPES } from "../constants/formOptions";

const DetailedInfo = ({ formik, prevStep }) => {
    const fields = [
        { name: "aadhaar", placeholder: "Aadhaar" },
        { name: "pan", placeholder: "PAN" },
        { name: "preferredCity", placeholder: "City" },
        { name: "preferredBranchName", placeholder: "Branch" },
        { name: "password", type: "password", placeholder: "Password" },
        { name: "confirmPassword", type: "password", placeholder: "Confirm Password" },
    ];

    return (
        <div>
            <h3>Detailed Information</h3>

            {fields.map((field) => (
                <InputField key={field.name} formik={formik} {...field} />
            ))}

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
                placeholder="Select Account Type"
            />

            <button type="button" onClick={prevStep}>
                Back
            </button>

            <button type="submit">Submit</button>
        </div>
    );
};

export default DetailedInfo;