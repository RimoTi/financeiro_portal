import api from '../../services/api'; 
import { Usuario } from "@features/auth/types";

// Definição do formato dos dados para o TypeScript
export interface LoginCredentials {
  login: string;
  senha: string;
}


export const authService = {
  async logar(credentials: LoginCredentials): Promise<Usuario | void> {
     try {
      const { data } = await api.post<Usuario>("/Auth/Logar", credentials);
        return data; // Retorna os dados da resposta para o componente
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data || "Erro ao fazer login");
    }
  }
};