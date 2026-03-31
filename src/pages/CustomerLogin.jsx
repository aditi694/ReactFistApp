import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { customerLogin } from "../api/authApi";
import { setToken } from "../utils/auth";

const CustomerLogin = () => {
    const [form, setForm] = useState({ accountNumber: "", password: "" });
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await customerLogin(form.accountNumber, form.password);
            const token = res.data.token;
            setToken(token);
            navigate("/customer-dashboard");
        } catch {
            setError("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Customer Login</h2>

            {error && <p>{error}</p>}

            <form onSubmit={handleLogin}>
                <input name="accountNumber" placeholder="Account Number" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default CustomerLogin;