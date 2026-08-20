import { useAuth } from "../../context/useAuth";
import { LogoutButton } from "./logoutButton";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { usuario } = useAuth();
  
  // Tratamento seguro para a variável de ambiente (como conversamos antes)
  const isTestBase = (import.meta.env.VITE_BASE_PROD as unknown as string) === 'false';

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 1rem",
        height: "60px",
        backgroundColor: !isTestBase ? "#f9f9f9" : "#b82c2c",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* 1. Lado Esquerdo: Botão de Menu + Badge de Ambiente de Teste */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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

        {isTestBase && (
          <span
            style={{
              backgroundColor: "#fff3cd", // Amarelo suave de alerta
              color: "#856404",           // Texto âmbar escuro
              border: "1px solid #ffeeba",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            ⚠️ Base de Teste
          </span>
        )}
      </div>

      {/* 2. Centro/Direita: Nome do usuário */}
      <h2 style={{ 
          margin: 0, 
          fontSize: 12, 
          textAlign: "right", 
          flex: 1, 
          paddingRight: "1rem", 
          color: isTestBase ? "#ffffff"  : "#666" 
      }}> 
        {usuario?.nome}
      </h2>

      {/* 3. Lado Direito: Botão de Sair */}
      <LogoutButton />
    </header>
  );
};