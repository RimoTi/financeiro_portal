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
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Botão de menu (visível em mobile) */}
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

        <h2 style={{ margin: 0 }}>Olá, {usuario?.nome}</h2>
      </div>

      <LogoutButton />
    </header>
  );
};
