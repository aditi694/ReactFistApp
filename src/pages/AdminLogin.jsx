import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/authApi";
import { setToken } from "../utils/auth";

const AdminLogin = () => {
    const [form, setForm] = useState({ username: "", password: "" });
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
            const res = await adminLogin(form.username, form.password);
            const token = res.data.token;
            setToken(token);
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Admin Login</h2>

            {error && <p>{error}</p>}

            <form onSubmit={handleLogin}>
                <input name="username" placeholder="Username" onChange={handleChange} />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;