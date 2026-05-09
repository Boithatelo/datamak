import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword, getErrorMessage } = useAuth();
  const [form, setForm] = useState({ token: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPassword({ token: form.token, password: form.password });
      setStatus(data.message || "Password reset successful.");
      setTimeout(() => navigate("/auth"), 1200);
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Home", to: "/" },
          { label: "Login", to: "/auth" },
          { label: "Reset Password" }
        ]}
        title="Reset Password"
        subtitle="Paste your reset token and choose a strong new password."
        fallback="/auth"
      />
      <section className="panel auth-panel">
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Reset Token
            <input
              value={form.token}
              onChange={(event) =>
                setForm((current) => ({ ...current, token: event.target.value }))
              }
              required
            />
          </label>
          <label>
            New Password
            <div className="password-row">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                required
              />
              <button type="button" className="btn btn-light" onClick={() => setShowPassword((state) => !state)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          <label>
            Confirm New Password
            <input
              type={showPassword ? "text" : "password"}
              value={form.confirm}
              onChange={(event) =>
                setForm((current) => ({ ...current, confirm: event.target.value }))
              }
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
        {error && <p className="error notice">{error}</p>}
        {status && <p className="hint notice">{status}</p>}
        <p className="muted">
          Back to <Link to="/auth">Login</Link>
        </p>
      </section>
    </>
  );
}
