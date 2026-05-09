import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const { forgotPassword, getErrorMessage } = useAuth();
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await forgotPassword(email);
      setResult(data);
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
          { label: "Forgot Password" }
        ]}
        title="Forgot Password"
        subtitle="Enter your account email to generate a reset token for demo purposes."
        fallback="/auth"
      />
      <section className="panel auth-panel">
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Generating..." : "Generate Reset Token"}
          </button>
        </form>
        {error && <p className="error notice">{error}</p>}
        {result && (
          <div className="hint notice">
            <p>{result.message}</p>
            {result.resetToken && (
              <>
                <p>
                  <strong>Reset Token:</strong> {result.resetToken}
                </p>
                <p>
                  <strong>Expires:</strong> {new Date(result.expiresAt).toLocaleString()}
                </p>
                <Link to="/reset-password">Go To Reset Password</Link>
              </>
            )}
          </div>
        )}
      </section>
    </>
  );
}
