// src/services/api.ts
import axios from "axios";
import type { AxiosInstance } from "axios";

import { setupInterceptors } from "./interceptors";

const api: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.250/engenharia-prod-back-end/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Aplica os interceptors externos
setupInterceptors(api);

export default api;
