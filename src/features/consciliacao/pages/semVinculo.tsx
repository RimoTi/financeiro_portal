import React, { useEffect, useState } from "react";
import { Conciliacao } from "@features/consciliacao/types";
import { getTransacoesSemVinculo } from "@features/consciliacao/consciliacaoService";
import { ModalGetNota } from "./components/modalGetNota";
import { Spinner } from "@components/spinner";

export const ConciliacaoSemVinculo = () => {
  const [data, setData] = useState<Conciliacao[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Conciliacao | null>(null);
  const [dataFiltrada, setDataFiltrada] = useState<Conciliacao[]>([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    try {
      setLoading(true);
      const fetch = async () => {
        const res = await getTransacoesSemVinculo();
        const sorted = [...res].sort((a, b) => {
          const totalA = a?.transacoes?.reduce(
            (sum, t) => sum + (t?.valorParcelaLiquido ?? 0),
            0
          ) ?? 0;

          const totalB = b?.transacoes?.reduce(
            (sum, t) => sum + (t?.valorParcelaLiquido ?? 0),
            0
          ) ?? 0;

          return totalA - totalB;
        });
        setData(sorted || []);
        setDataFiltrada(sorted || []);
      };
      fetch();
    } catch (error) {
      console.error("Erro ao buscar transações sem vínculo:", error);
    } finally {
      setLoading(false);
    }

  }, [modalOpen]);

  const closeModal = () => {
    const updatedData = dataFiltrada.filter(item => item.numAutorizacao !== selectedItem?.numAutorizacao);
    setData(updatedData);
    setDataFiltrada(updatedData);
    setSelectedItem(null);
    setModalOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setDataFiltrada(data);
      return;
    }
    const filtered = data.filter(item => item.numAutorizacao.toString().includes(value));
    setDataFiltrada(filtered);
  }

  const formatMoney = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("pt-BR");

  if (loading) { <Spinner fullScreen /> }

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h2 style={styles.title}>🔗 Pendentes de Vínculo</h2>
        <input style={styles.input} type="text" placeholder="Número da Autorização" onChange={handleSearch} />
      </div>
      {dataFiltrada.length == 0 ? <div style={styles.empty}>
        Nenhuma transação encontrada
      </div> : (
        <div style={styles.grid}>
          {dataFiltrada.map((item) => {
            const t = item.transacoes[0];

            return (
              <div key={item.numAutorizacao} style={styles.card}>
                <div style={styles.header}>
                  <span style={styles.autorizacao}>
                    {item.numAutorizacao}
                  </span>

                  <span style={styles.badge}>
                    💳 {t.bandeira}
                  </span>
                </div>

                <div style={styles.body}>
                  <p><strong>Parcela:</strong> {t.parcela}/{t.totalParcela}</p>
                  <p><strong>Valor:</strong> {formatMoney(t.valorParcelaLiquido)}</p>
                  <p><strong>Total:</strong> {formatMoney(t.totalPlanoVenda)}</p>
                  <p><strong>Data:</strong> {formatDate(t.dataTransacao)}</p>
                </div>

                <button
                  style={styles.button}
                  onClick={() => {
                    setSelectedItem(item);
                    setModalOpen(true);
                  }}
                >
                  Vincular
                </button>
              </div>
            );
          })}
        </div>)}

      {selectedItem && (
        <ModalGetNota
          visible={modalOpen}
          onClose={() => closeModal()}
          concil={selectedItem}
        />
      )}
    </div>)
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  empty: {
    textAlign: "center" as const,
    marginTop: "40px",
    color: "#64748b",
  },
  input: {
    width: "350px",
    padding: "10px",
    marginBottom: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  title: {
    fontSize: "22px",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column", // ✅ agora funciona
    justifyContent: "space-between",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  autorizacao: {
    fontWeight: "bold",
    fontSize: "16px",
  },

  badge: {
    backgroundColor: "#e2e8f0",
    padding: "4px 8px",
    borderRadius: "8px",
    fontSize: "12px",
  },

  body: {
    fontSize: "14px",
    lineHeight: "1.6",
    marginBottom: "12px",
  },

  button: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
} as const;