import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import BrandLogo from "../components/BrandLogo";
import { useAuth } from "../context/AuthContext";
import { shadows } from "../theme";

export default function AuthScreen() {
  const { login, register, forgotPassword, resetPassword, getApiError } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    token: ""
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setStatus("");
  };

  const onSubmit = async () => {
    setBusy(true);
    setError("");
    setStatus("");
    try {
      if (mode === "login") {
        await login(form.email.trim(), form.password);
      } else if (mode === "register") {
        if (form.password !== form.confirmPassword) {
          setError("Password and confirm password do not match.");
          return;
        }
        await register(form.name.trim(), form.email.trim(), form.password);
      } else if (mode === "forgot") {
        const data = await forgotPassword(form.email.trim());
        setStatus(
          data.resetToken
            ? `${data.message} Token: ${data.resetToken}`
            : data.message
        );
        if (data.resetToken) {
          update("token", data.resetToken);
        }
      } else if (mode === "reset") {
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match.");
          return;
        }
        const data = await resetPassword({ token: form.token, password: form.password });
        setStatus(data.message || "Password reset successful.");
        setMode("login");
      }
    } catch (submitError) {
      setError(getApiError(submitError, "Authentication failed."));
    } finally {
      setBusy(false);
    }
  };

  const title =
    mode === "login"
      ? "Member Login"
      : mode === "register"
      ? "Create Account"
      : mode === "forgot"
      ? "Forgot Password"
      : "Reset Password";

  const subtitle =
    mode === "login"
      ? "Login to continue with your shopping and hosting account."
      : mode === "register"
      ? "Create your customer account in under a minute."
      : mode === "forgot"
      ? "Enter your account email to generate a reset token."
      : "Paste your reset token and choose a strong new password.";

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BrandLogo light style={styles.logo} />
        <View style={styles.card}>
          <Text style={styles.kicker}>Datamak Access</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          <View style={styles.toggleRow}>
            <ModeButton active={mode === "login"} label="Login" onPress={() => switchMode("login")} />
            <ModeButton active={mode === "register"} label="Register" onPress={() => switchMode("register")} />
          </View>

          {mode === "register" ? (
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={form.name}
              onChangeText={(value) => update("name", value)}
            />
          ) : null}

          {mode !== "reset" ? (
            <TextInput
              style={styles.input}
              placeholder="Email"
              autoCapitalize="none"
              keyboardType="email-address"
              value={form.email}
              onChangeText={(value) => update("email", value)}
            />
          ) : null}

          {mode === "reset" ? (
            <TextInput
              style={styles.input}
              placeholder="Reset token"
              autoCapitalize="none"
              value={form.token}
              onChangeText={(value) => update("token", value)}
            />
          ) : null}

          {mode !== "forgot" ? (
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={form.password}
              onChangeText={(value) => update("password", value)}
            />
          ) : null}

          {(mode === "register" || mode === "reset") ? (
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              secureTextEntry
              value={form.confirmPassword}
              onChangeText={(value) => update("confirmPassword", value)}
            />
          ) : null}

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {status ? <Text style={styles.status}>{status}</Text> : null}

          <Pressable
            style={[styles.button, busy && styles.buttonDisabled]}
            onPress={onSubmit}
            disabled={busy}
          >
            {busy ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {mode === "login"
                  ? "Login"
                  : mode === "register"
                  ? "Create Account"
                  : mode === "forgot"
                  ? "Generate Reset Token"
                  : "Reset Password"}
              </Text>
            )}
          </Pressable>

          <View style={styles.linkRow}>
            <Pressable onPress={() => switchMode("forgot")}>
              <Text style={styles.linkText}>Forgot password?</Text>
            </Pressable>
            <Pressable onPress={() => switchMode("reset")}>
              <Text style={styles.linkText}>Have a token?</Text>
            </Pressable>
          </View>

          <Text style={styles.adminHint}>
            Admin account: admin@datamak.local / Admin@123
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ModeButton({ label, active, onPress }) {
  return (
    <Pressable style={[styles.toggle, active && styles.toggleActive]} onPress={onPress}>
      <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#2078be"
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    gap: 16
  },
  logo: {
    width: "100%",
    maxWidth: 430,
    paddingHorizontal: 4
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    padding: 22,
    gap: 10,
    backgroundColor: "rgba(35,132,204,0.92)",
    ...shadows.strong
  },
  kicker: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.16)",
    color: "#fff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  title: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "rgba(255,255,255,0.94)",
    letterSpacing: 4,
    textTransform: "uppercase"
  },
  subtitle: {
    color: "rgba(255,255,255,0.86)",
    lineHeight: 20,
    textAlign: "center"
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2
  },
  toggle: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.36)",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)"
  },
  toggleActive: {
    backgroundColor: "#fff"
  },
  toggleText: {
    color: "#fff",
    fontWeight: "900"
  },
  toggleTextActive: {
    color: "#1f3975"
  },
  input: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.94)",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    backgroundColor: "rgba(80,210,240,0.18)"
  },
  button: {
    backgroundColor: "#213a78",
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 2,
    alignSelf: "center",
    width: "100%",
    maxWidth: 230
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase"
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  linkText: {
    color: "#fff",
    fontWeight: "900",
    textDecorationLine: "underline"
  },
  error: {
    color: "#fff",
    backgroundColor: "rgba(196,55,58,0.3)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    borderRadius: 10,
    padding: 10,
    fontWeight: "700"
  },
  status: {
    color: "#fff",
    backgroundColor: "rgba(23,138,83,0.32)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.24)",
    borderRadius: 10,
    padding: 10,
    fontWeight: "700"
  },
  adminHint: {
    marginTop: 4,
    color: "rgba(255,255,255,0.78)",
    fontSize: 12
  }
});
