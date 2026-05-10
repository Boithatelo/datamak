import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export function getApiOrigin() {
  return API_BASE_URL.replace(/\/+$/, "").replace(/\/api(?:\/.*)?$/i, "");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("shop_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiError(error, fallback = "Request failed.") {
  return error?.response?.data?.message || error?.message || fallback;
}

export default api;
