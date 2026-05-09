import { useState } from "react";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user, updateProfile, getErrorMessage } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: ""
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("");
    setError("");
    try {
      await updateProfile({
        name: form.name,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined
      });
      setStatus("Profile updated successfully.");
      setForm((current) => ({
        ...current,
        currentPassword: "",
        newPassword: ""
      }));
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    }
  };

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Profile" }]}
        title="User Profile"
        subtitle="Manage your account details and password securely."
        fallback="/catalog"
      >
        {status && <p className="hint notice">{status}</p>}
        {error && <p className="error notice">{error}</p>}
      </PageHeader>
      <section className="panel">
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Full Name
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
              required
            />
          </label>
          <label>
            Email
            <input value={user?.email || ""} disabled />
          </label>
          <label>
            Current Password
            <div className="password-row">
              <input
                type={showCurrent ? "text" : "password"}
                value={form.currentPassword}
                onChange={(event) =>
                  setForm((current) => ({ ...current, currentPassword: event.target.value }))
                }
                placeholder="Required only if changing password"
              />
              <button
                className="btn btn-light"
                type="button"
                onClick={() => setShowCurrent((state) => !state)}
              >
                {showCurrent ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          <label>
            New Password
            <div className="password-row">
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(event) =>
                  setForm((current) => ({ ...current, newPassword: event.target.value }))
                }
                placeholder="At least 8 chars with mixed case and number"
              />
              <button
                className="btn btn-light"
                type="button"
                onClick={() => setShowNew((state) => !state)}
              >
                {showNew ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          <button type="submit" className="btn btn-primary">
            Save Profile
          </button>
        </form>
      </section>
    </>
  );
}
