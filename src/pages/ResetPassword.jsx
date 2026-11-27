import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { FiMail, FiLock, FiKey, FiArrowLeft } from "react-icons/fi";
import { authApi } from "../api/authApi";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    email: params.get("email") ?? "",
    token: params.get("token") ?? "",
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
      await authApi.resetPassword({
        ...form,
        email: form.email.trim(),
        token: form.token.trim(),
      });
      navigate("/login", {
        replace: true,
        state: { message: "The password has been changed; please log in using the new password." },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rsp-page" dir="rtl">
      <form className="rsp-card" onSubmit={handleSubmit}>
        <header className="rsp-head">
          <span className="rsp-icon">
            <FiKey size={24} />
          </span>
          <div>
            <h1 className="rsp-title">Reset password</h1>
            <p className="rsp-sub">Enter the code you received via email and your new password.</p>
          </div>
        </header>

        <div className="rsp-form">
          <label className="rsp-label" htmlFor="email">Email</label>
          <div className="rsp-field">
            <FiMail />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <label className="rsp-label" htmlFor="token">Verification code </label>
          <div className="rsp-field">
            <FiKey />
            <input
              id="token"
              name="token"
              dir="ltr"
              placeholder="Paste the code from the email."
              value={form.token}
              onChange={handleChange}
              autoComplete="one-time-code"
              required
            />
          </div>

          <label className="rsp-label" htmlFor="password">New password</label>
          <div className="rsp-field">
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

          <label className="rsp-label" htmlFor="password_confirmation">Confirm password</label>
          <div className="rsp-field">
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

          {error && <p className="rsp-error" role="alert">{error}</p>}

          <button type="submit" className="rsp-btn" disabled={loading}>
            <span>{loading ? "Saving..." : " change password "}</span>
            <FiArrowLeft size={18} />
          </button>
        </div>

        <div className="rsp-divider">
          <span></span>
          <p>أو</p>
          <span></span>
        </div>

        <p className="rsp-foot">
          <Link to="/login">Return to login</Link>
        </p>
      </form>
    </div>
  );
}