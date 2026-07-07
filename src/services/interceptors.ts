/* eslint-disable @typescript-eslint/no-explicit-any */
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

    // 2. Extração da mensagem (Onde a mágica acontece)
      const data = error.response?.data as any;
      const message = data?.message || data || error.message || "Erro desconhecido";

      // 3. Rejeita a promise passando apenas o objeto Error com a mensagem correta
      return Promise.reject(new Error(message));
    }
  );
}
