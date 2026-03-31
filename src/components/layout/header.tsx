import { useAuth } from "../../context/useAuth";
import { LogoutButton } from "./logoutButton";

interface HeaderProps {
  onToggleSidebar: () => void; // função para abrir/fechar o menu
}
export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { usuario } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between", // Distribui os 3 elementos (Menu, Nome, Logout)
        alignItems: "center",
        padding: "0 1rem", // Ajustei o padding para não ficar muito alto
        height: "60px",    // Altura fixa costuma ser melhor para Headers
        backgroundColor: "#f9f9f9",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* 1. Lado Esquerdo: Apenas o Botão de Menu */}
      <button
        onClick={onToggleSidebar}
        style={{
          fontSize: "1.2rem",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        ☰
      </button>

      {/* 2. Centro/Direita: O nome do usuário */}
      {/* O flex: 1 faz ele ocupar todo o espaço central, e o textAlign joga o texto pra direita */}
      <h2 style={{ 
          margin: 0, 
          fontSize: 12, 
          textAlign: "right", 
          flex: 1, 
          paddingRight: "1rem", // Espaço entre o nome e o botão de Logout
          color: "#666" 
      }}> 
        {usuario?.nome}
      </h2>

      {/* 3. Lado Direito: Botão de Sair */}
      <LogoutButton />
    </header>
  );
};