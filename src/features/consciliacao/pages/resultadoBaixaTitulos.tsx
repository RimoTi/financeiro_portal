import { useLocation, useNavigate } from "react-router-dom";

interface Resultado {
  transacaoId: number;
  numNf: number;
  status: string;
  mensagem: string;
}

export const ResultadoBaixaTitulos = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = (location.state as Resultado[]) || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Resultado da Baixa de Títulos</h1>

      {data.length === 0 && (
        <p style={styles.empty}>Nenhum resultado recebido.</p>
      )}

      <div>
        {data.map((item) => (
          <div key={item.transacaoId} style={styles.card(item.status)}>
            <div style={styles.cardContent}>
              <div style={styles.row}>
                <span style={styles.nf}>NF: {item.numNf}</span>

                <span
                  style={
                    item.status === "Sucesso"
                      ? styles.statusSuccess
                      : styles.statusError
                  }
                >
                  {item.status}
                </span>
              </div>

              <p style={styles.message}>{item.mensagem}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <button style={styles.button} onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>
    </div>
  );
};

//
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const styles: { [key: string]: any } = {
  container: {
    padding: "24px",
    backgroundColor: "#f1f5f9",
    minHeight: "100vh",
    maxWidth: "800px",
    margin: "0 auto",
  },

  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
  },

  empty: {
    color: "#6b7280",
  },

  card: (status: string): React.CSSProperties => ({
    backgroundColor: "#fff",
    borderRadius: "12px",
    marginBottom: "12px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    borderLeft:
      status === "Sucesso"
        ? "6px solid #22c55e"
        : "6px solid #ef4444",
  }),

  cardContent: {
    padding: "16px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },

  nf: {
    fontWeight: 600,
  },

  statusSuccess: {
    color: "#16a34a",
    fontWeight: "bold",
    fontSize: "14px",
  },

  statusError: {
    color: "#dc2626",
    fontWeight: "bold",
    fontSize: "14px",
  },

  message: {
    fontSize: "14px",
    color: "#374151",
  },

  footer: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
  },

  button: {
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};