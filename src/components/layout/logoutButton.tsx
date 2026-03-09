import React from "react";
import { useAuth } from "../../context/useAuth";

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      style={{
        borderRadius: "4px",
        padding: "8px 16px",
        backgroundColor: "#99d164",
        color: "white",
        border: "none",
        cursor: "pointer",
      }}
    >
      Sair
    </button>
  );
};
