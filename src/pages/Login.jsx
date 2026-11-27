import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FiLock, FiMail, FiArrowLeft } from "react-icons/fi";
import { authApi } from "../api/authApi";
import "../styles/Login.css";

export default function Login() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const location = useLocation();
    const notice = location.state?.message;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            await authApi.login({ email: email.trim(), password, remember });
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(
                err.status === 401
                    ? "The email or password is incorrect."
                    : err.message
            );
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="container">
    <form className="loginForm" onSubmit={handleSubmit}>
        <div className="welcome">
            <div>
                <h3>Log in</h3>
                <h4>Welcome back! Log in to manage your resumes.</h4>
            </div>
            <FiLock size={24} />
        </div>

        <div className="form">
            <label htmlFor="email">Email</label>
            <div className="inputGroup">
            <FiMail />
            <input
                id="email"
                type="email"
                placeholder="  Enter your email "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
            />
        </div>

        <label htmlFor="password">Password </label>
        <div className="inputGroup">
            <FiLock />
            <input
                id="password"
                type="password"
                placeholder="Enter the password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
            />
        </div>

        <div className="loginOptions">
            <label>
            <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
            </label>
            <Link to="/forgot-password"> Forgot your password? </Link>
        </div>
        {notice && <p className="formSuccess" role="status">{notice}</p>}
        {error && <p className="formError" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
            <span>{loading ? " Logging in..." : "Log in "}</span>
            <FiArrowLeft size={18} />
        </button>
        </div>

        <div className="divider">
            <span></span>
            <p>أو</p>
            <span></span>
        </div>

        <div className="signup">
            <p>
                Don't have an account?
                <Link to="/register"> Create a new account</Link>
            </p>
        </div>
    </form>
    </div>
);
}