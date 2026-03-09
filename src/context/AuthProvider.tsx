import React, { useState, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./AuthContext";
import { Usuario } from "../features/auth/types";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

  const [usuario, setUsuarioState] = useState<Usuario | undefined>(() => {
    const stored = localStorage.getItem("usuario");
    return stored ? JSON.parse(stored) : undefined;
  });

  const setUsuario = (user?: Usuario) => {
    setUsuarioState(user);
    if (user) localStorage.setItem("usuario", JSON.stringify(user));
    else localStorage.removeItem("usuario");
  };

  const logout: AuthContextType["logout"] = () => { setUsuarioState(undefined); localStorage.removeItem("usuario"); }

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
};