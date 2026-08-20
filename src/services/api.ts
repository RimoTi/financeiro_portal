// src/services/api.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

import { setupInterceptors } from "./interceptors";

const url = import.meta.env.VITE_BASE_PROD === 'true'
    ? import.meta.env.VITE_API_URL_PROD 
    : import.meta.env.VITE_API_URL_TES;

const api: AxiosInstance = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Aplica os interceptors externos
setupInterceptors(api);

export default api;
