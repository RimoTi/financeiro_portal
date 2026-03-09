import { createContext } from "react";
import { Usuario } from "../features/auth/types";

export interface AuthContextType {
  usuario?: Usuario;
  setUsuario: (user?: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  usuario: undefined,
  setUsuario: () => {},
  logout: () => {},
});