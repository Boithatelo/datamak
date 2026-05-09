import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const savedToken = await AsyncStorage.getItem("shop_token");
        const savedUser = await AsyncStorage.getItem("shop_user");

        if (!mounted) {
          return;
        }

        if (savedToken) {
          setToken(savedToken);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
          try {
            const { data } = await api.get("/auth/me");
            if (mounted) {
              setUser(data.user);
              await AsyncStorage.setItem("shop_user", JSON.stringify(data.user));
            }
          } catch (error) {
            if (mounted) {
              await AsyncStorage.multiRemove(["shop_token", "shop_user"]);
              setToken(null);
              setUser(null);
            }
          }
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
  }, []);

  const saveSession = async (nextToken, nextUser) => {
    await AsyncStorage.setItem("shop_token", nextToken);
    await AsyncStorage.setItem("shop_user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    await saveSession(data.token, data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    await saveSession(data.token, data.user);
    return data.user;
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
    await AsyncStorage.setItem("shop_user", JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["shop_token", "shop_user"]);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      register,
      forgotPassword,
      resetPassword,
      updateProfile,
      logout,
      getApiError
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
