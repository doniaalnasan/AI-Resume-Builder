import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiLock, FiArrowLeft } from "react-icons/fi";
import { authApi } from "../api/authApi";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    try {
      await authApi.forgotPassword(email.trim());
      setSent(true); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fgp-page" dir="rtl">
      <form className="fgp-card" onSubmit={handleSubmit}>
        <header className="fgp-head">
          <span className="fgp-icon">
            <FiLock size={24} />
          </span>
          <div>
            <h1 className="fgp-title">Forgot your password?</h1>
            <p className="fgp-sub">Enter your email and we will send you a link to recover your account.</p>
          </div>
        </header>

        <div className="fgp-form">
          <label className="fgp-label" htmlFor="email">Email </label>
          <div className="fgp-field">
            <FiMail />
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {sent && (
            <p className="fgp-success" role="status">
              If the account exists, a reset message has been sent to your email.
              <br />
              <Link to={`/reset-password?email=${encodeURIComponent(email.trim())}`}>
                I have the verification code, continue   
              </Link>
            </p>
          )}
          {error && <p className="fgp-error" role="alert">{error}</p>}

          <button type="submit" className="fgp-btn" disabled={loading}>
            <span>{loading ? "Sending..." : " Send recovery link "}</span>
            <FiArrowLeft size={18} />
          </button>
        </div>

        <div className="fgp-divider">
          <span></span>
          <p>أو</p>
          <span></span>
        </div>

        <p className="fgp-foot">
          Did you remember the password?<Link to="/login">Log in </Link>
        </p>
      </form>
    </div>
  );
}
