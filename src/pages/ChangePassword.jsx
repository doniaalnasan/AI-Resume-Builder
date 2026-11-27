import { useState } from "react";
import { FiLock, FiKey, FiCheck } from "react-icons/fi";
import Navbar from "../components/Navbar";
import { authApi } from "../api/authApi";
import "../styles/ChangePassword.css";

const emptyForm = {
  current_password: "",
  password: "",
  password_confirmation: "",
};

export default function ChangePassword() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("The new password must be at least 8 characters long.");
      return;
    }
    if (form.password !== form.password_confirmation) {
      setError("The two new passwords do not match.");
      return;
    }
    if (form.password === form.current_password) {
      setError("The new password must be different from the current one.");
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(form);
      setForm(emptyForm);
      setSuccess("The password has been changed successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cpw-wrap" dir="rtl">
      <Navbar />

      <main className="cpw-page">
        <form className="cpw-card" onSubmit={handleSubmit}>
          <header className="cpw-head">
            <span className="cpw-icon">
              <FiLock size={24} />
            </span>
            <div>
              <h1 className="cpw-title">Change password</h1>
              <p className="cpw-sub">Enter your current password, then the new one.</p>
            </div>
          </header>

          <div className="cpw-form">
            <label className="cpw-label" htmlFor="current_password">
              Current Password
            </label>
            <div className="cpw-field">
              <FiLock />
              <input
                id="current_password"
                name="current_password"
                type="password"
                placeholder="Enter the current password"
                value={form.current_password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <label className="cpw-label" htmlFor="password">
              New Password
            </label>
            <div className="cpw-field">
              <FiKey />
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

            <label className="cpw-label" htmlFor="password_confirmation">
              Confirm new password
            </label>
            <div className="cpw-field">
              <FiKey />
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                placeholder="Re-enter the new password"
                value={form.password_confirmation}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </div>

            {success && (
              <p className="cpw-success" role="status">
                {success}
              </p>
            )}
            {error && (
              <p className="cpw-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="cpw-btn" disabled={loading}>
              <FiCheck size={18} />
              <span>{loading ? "Saving..." : "change password"}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}