import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unexpected authentication error."
  );
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("shop_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("shop_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  const saveSession = (nextToken, nextUser) => {
    localStorage.setItem("shop_token", nextToken);
    localStorage.setItem("shop_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const clearSession = () => {
    localStorage.removeItem("shop_token");
    localStorage.removeItem("shop_user");
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me");
        if (mounted) {
          setUser(data.user);
          localStorage.setItem("shop_user", JSON.stringify(data.user));
        }
      } catch (error) {
        if (mounted) {
          clearSession();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data.token, data.user);
    return data.user;
  };

  const register = async ({ name, email, password }) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    saveSession(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    clearSession();
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  };

  const resetPassword = async ({ token: resetToken, password }) => {
    const { data } = await api.post("/auth/reset-password", {
      token: resetToken,
      password
    });
    return data;
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/auth/me", payload);
    setUser(data.user);
    localStorage.setItem("shop_user", JSON.stringify(data.user));
    return data.user;
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      updateProfile,
      getErrorMessage
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
