import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

function getHostFromUri(uri) {
  if (!uri || uri.includes("exp.host")) {
    return "";
  }

  return uri.replace(/^https?:\/\//, "").split("/")[0].split(":")[0];
}

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.extra?.apiHost ||
    Constants.expoConfig?.hostUri ||
    Constants.manifest?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    Constants.linkingUri;

  return getHostFromUri(hostUri);
}

function getDefaultApiBaseUrl() {
  const expoHost = getExpoHost();
  if (expoHost) {
    return `http://${expoHost}:4000/api`;
  }

  return "http://localhost:4000/api";
}

export const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL || getDefaultApiBaseUrl()).replace(/\/+$/, "");

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
  if (error?.message === "Network Error") {
    return `Network Error. The phone could not reach ${API_BASE_URL}. Check that the backend is running, the phone and laptop are on the same Wi-Fi, and mobile/.env has your current laptop IP address.`;
  }

  if (error?.code === "ECONNABORTED") {
    return `Request timed out while connecting to ${API_BASE_URL}.`;
  }

  return error?.response?.data?.message || error?.message || fallback;
}

export default api;
