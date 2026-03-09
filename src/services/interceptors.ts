// src/services/interceptors.ts
import type { AxiosError, AxiosInstance } from "axios";

export function setupInterceptors(api: AxiosInstance) {
  // Antes de cada requisição
  api.interceptors.request.use(
    (config) => {
      const stored = localStorage.getItem("usuario");
      const usuario = stored ? JSON.parse(stored) : null;

      if (usuario?.token) {
        config.headers.Authorization = `Bearer ${usuario.token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Para tratar respostas com erro
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;

      if (status === 401) {
        console.warn("Token expirado ou inválido — redirecionando para login");
        localStorage.removeItem("usuario");
        window.location.href = "/";
      }

      if (status === 500) {
        console.error("Erro interno no servidor:", error.response?.data);
      }

      return Promise.reject(error);
    }
  );
}
