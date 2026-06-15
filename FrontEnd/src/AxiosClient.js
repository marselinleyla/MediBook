/* ============================================================
 * AxiosClient.js – Axios HTTP client for the MediBook API.
 *
 * Creates a pre-configured Axios instance that points to the
 * Laravel backend at http://127.0.0.1:8000/api and attaches a
 * Bearer token (user, doctor, or admin) to every outgoing
 * request automatically via a request interceptor.
 * ============================================================ */

import axios from "axios";
import { get } from "./Services/LocalStorageService";

// Create an Axios instance with the API base URL
const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Request interceptor – attaches the correct Bearer token
// before any HTTP request is sent.
axiosClient.interceptors.request.use((config) => {
  let token;
  // Try to retrieve a token from localStorage; priority order: user → doctor → admin
  if (get("TOKEN_USER")) {
    token = get("TOKEN_USER");
  } else if (get("TOKEN_DOCTOR")) {
    token = get("TOKEN_DOCTOR");
  } else if (get("TOKEN_ADMIN")) {
    token = get("TOKEN_ADMIN");
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } ;
  return config;
});

export default axiosClient;
