import { useState } from "react";
import { getAccounts, setLoggedInUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        accountNumber: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const users = getAccounts();

        const user = users.find(
            (u) =>
                u.accountNumber.trim() === form.accountNumber.trim() &&
                atob(u.password) === form.password.trim()
        );

        if (user) {
            setLoggedInUser(user);
            navigate("/dashboard");
        } else {
            setError("Invalid Account Number or Password");
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleLogin}>
                <input
                    name="accountNumber"
                    placeholder="Account Number"
                    value={form.accountNumber}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                />

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;