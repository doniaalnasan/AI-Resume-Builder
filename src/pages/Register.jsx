import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { authApi } from "../api/authApi";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (form.password.length < 8) {
      setError("The password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.password_confirmation) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
    await authApi.register({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
    });

navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-page" dir="rtl">
      <form className="reg-card" onSubmit={handleSubmit}>
        <header className="reg-head">
          <span className="reg-icon">
            <FiUser size={24} />
          </span>
          <div>
            <h1 className="reg-title">Create a new account</h1>
            <p className="reg-sub">Create your account and start building your resume using artificial intelligence.</p>
          </div>
        </header>

        <div className="reg-form">
          <label className="reg-label" htmlFor="name">Full Name</label>
          <div className="reg-field">
            <FiUser />
            <input
              id="name"
              name="name"
              placeholder="Enter your name"
              maxLength={255}
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <label className="reg-label" htmlFor="email">Email </label>
          <div className="reg-field">
            <FiMail />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email "
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <label className="reg-label" htmlFor="password">Password</label>
          <div className="reg-field">
            <FiLock />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <label className="reg-label" htmlFor="password_confirmation">  Confirm password</label>
          <div className="reg-field">
            <FiLock />
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              placeholder="Re-enter the password"
              value={form.password_confirmation}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p className="reg-error" role="alert">{error}</p>}

          <button type="submit" className="reg-btn" disabled={loading}>
            <span>{loading ? "Creating..." : "Create an account"}</span>
            <FiArrowLeft size={18} />
          </button>
        </div>

        <div className="reg-divider">
          <span></span>
          <p>أو</p>
          <span></span>
        </div>

        <p className="reg-foot">
           Do you already have an account?<Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
