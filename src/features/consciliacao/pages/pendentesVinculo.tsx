import React, { useEffect, useState } from "react";
import { Pagamento, NotaFiscal, Conciliacao, Autorizacao } from "@features/consciliacao/types";
import { getTransacoesSemVinculo, vincularNota } from "@features/consciliacao/consciliacaoService";
import { Spinner } from "@components/spinner";
import { ModalGetNota } from "./components/modalGetNota";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export const ConciliacaoSemVinculo = () => {
  const [pagamentosSemVinculo, setPagamentosSemVinculo] = useState<Pagamento[]>([]);
  const [pagamentosSelecionado, setPagamentosSelecionado] = useState<Pagamento[]>([]);
  const [pagamentosFiltrados, setPagamentosFiltrados] = useState<Pagamento[]>([]);
  const [notasSelecionadas, setNotasSelecionadas] = useState<NotaFiscal[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalGetNotaVisible, setModalGetNotasVisible] = useState(false);
  const location = useLocation();



  const pagamentos = useMemo(() => {
    return location.state?.pagamentos || [];
  }, [location.state]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);

        let res: Pagamento[] = [];

        if (pagamentos.length > 0) {
          // ✅ veio da tela anterior
          res = pagamentos;
        } else {
          // ✅ fallback mock
          res = await getTransacoesSemVinculo();
        }

        const sorted = [...res].sort(
          (a, b) => a.valorParcelaLiquido - b.valorParcelaLiquido
        );

        setPagamentosSemVinculo(sorted);
        setPagamentosFiltrados(sorted);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [pagamentos]);

  // ✅ Selecionar (remove da lista)
  const handleSelect = (item: Pagamento) => {
    setPagamentosSelecionado(prev => [...prev, item]);

    setPagamentosFiltrados(prev =>
      prev.filter(p => p.numAutorizacao !== item.numAutorizacao));
  };

  // ✅ Remover (volta pra lista)
  const handleRemove = (item: Pagamento) => {
    setPagamentosSelecionado(prev =>
      prev.filter(p => p.numAutorizacao !== item.numAutorizacao)
    );

    setPagamentosFiltrados(prev => [...prev, item]);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!value) {
      setPagamentosFiltrados(pagamentosSemVinculo.filter(
        p => !pagamentosSelecionado.some(sel => sel.id === p.id)
      ));
      return;
    }

    const filtered = pagamentosSemVinculo.filter(item =>
      item.numAutorizacao.includes(value) &&
      !pagamentosSelecionado.some(sel => sel.id === item.id)
    );

    setPagamentosFiltrados(filtered);
  };

  const formatMoney = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("pt-BR");

  const fecharModal = () => {
    setModalGetNotasVisible(false);
  }

  const handleUpload = async () => {

    const autoriz: Autorizacao[] = pagamentosSelecionado.map(p => ({
      id: null,
      concId: null,
      numAutorizacao: p.numAutorizacao,
      totalParc: p.totalParcela,
      DataUltParc: p.dataPagamento,
      vlrTotal: p.valorParcelaLiquido,
      pagamentoId: p.id
    }));

    const maiorData = autoriz
      .map(a => new Date(a.DataUltParc || Date.now.toString()))
      .reduce((max, atual) => (atual > max ? atual : max));

    const conciliacao: Conciliacao = {
      id: null,
      autorizacoes: autoriz,
      DataUltParc: maiorData,
      Finalizada: 0,
      totalAutoriz: autoriz.length,
      totalNotas: notasSelecionadas.length,
      vlrAbNotas: notasSelecionadas.reduce(
        (soma, n) => soma + (n.vlrAb || 0),
        0
      ),
      vlrTotalAutoriz: pagamentosSelecionado.reduce(
        (soma, p) => soma + (p.valorParcelaLiquido || 0),
        0
      ),

      notas: notasSelecionadas,
    };

    console.log("dados enviados:", conciliacao);
    await vincularNota(conciliacao);


    const novaLista = pagamentosSemVinculo.filter(p =>
      !pagamentosSelecionado.some(ps => ps.numAutorizacao === p.numAutorizacao)
    );

    setPagamentosSemVinculo(novaLista);
    setPagamentosFiltrados(novaLista);
    setNotasSelecionadas([]);
    setPagamentosSelecionado([]);
    toast.success("Sucesso!");
    window.dispatchEvent(new CustomEvent("atualizarSidebar"));
  };

  const selecionarNota = (nota: NotaFiscal) => {
    setNotasSelecionadas(prev => [...prev, nota]);
  }

  if (loading) return <Spinner fullScreen />;

  return (
    <div style={{ display: "flex", width: "100%" }}>

      {/* LISTA PRINCIPAL */}
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>🔗 Pendentes de Vínculo</h2>

          <input
            style={styles.input}
            type="text"
            placeholder="Número da Autorização"
            onChange={handleSearch}
          />
        </div>

        {pagamentosFiltrados.length === 0 ? (
          <div style={styles.empty}>Nenhuma transação encontrada</div>
        ) : (
          <div style={styles.grid}>
            {pagamentosFiltrados.map(item => (
              <div key={item.numAutorizacao} style={styles.card}>

                <div style={styles.header}>
                  <span style={styles.autorizacao}>
                    #{item.numAutorizacao}
                  </span>

                  <span style={styles.badge}>
                    💳 {item.bandeira}
                  </span>
                </div>

                <div style={styles.body}>
                  <p><strong>Parcela:</strong> {item.parcela}/{item.totalParcela}</p>
                  <p><strong>Valor:</strong> {formatMoney(item.valorParcelaLiquido)}</p>
                  <p><strong>Total:</strong> {formatMoney(item.totalPlanoVenda)}</p>
                  <p><strong>Data:</strong>{item.dataPagamento ? formatDate(item.dataPagamento.toString()) : "—"}</p>
                </div>

                <button
                  style={styles.button}
                  onClick={() => handleSelect(item)}
                >
                  Selecionar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LATERAL */}
      <div style={styles.side}>
        <div style={styles.cardSide}>
          <button
            style={styles.btnOpenModal}
            onClick={() => setModalGetNotasVisible(true)}
          >
            + Selecionar Notas
          </button>
          <h4 style={styles.sectionTitle}>📌 Pagamentos Selecionados</h4>

          {pagamentosSelecionado.length === 0 && (
            <div style={styles.emptySmall}>
              Nenhum pagamento selecionado
            </div>
          )}

          {pagamentosSelecionado.map(p => (
            <div key={p.numAutorizacao} style={styles.selectedItem}>
              <div>
                <div style={styles.selectedTitle}>
                  #{p.numAutorizacao}
                </div>

                <div style={styles.selectedValue}>
                  {formatMoney(p.valorParcelaLiquido)}
                </div>
              </div>

              <button
                style={styles.btnRemove}
                onClick={() => handleRemove(p)}
              >
                ✕
              </button>
            </div>
          ))}

          {/* DIVISOR */}
          <div style={styles.divider} />

          {/* 🔥 NOTAS */}
          <h4 style={styles.sectionTitle}>🧾 Notas Fiscais</h4>

          {notasSelecionadas.length === 0 && (
            <div style={styles.emptySmall}>
              Nenhuma nota adicionada
            </div>
          )}

          {notasSelecionadas.map(n => (
            <div key={n.id} style={styles.selectedItem}>
              <div>
                <div style={styles.selectedTitle}>
                  NF {n.numNf}
                </div>

                <div style={styles.selectedValue}>
                  {formatMoney(n.vlrTotal)}
                </div>
              </div>

              <button
                style={styles.btnRemove}
                onClick={() =>
                  setNotasSelecionadas(prev =>
                    prev.filter(x => x.id !== n.id)
                  )
                }
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      {notasSelecionadas.length > 0 && pagamentosSelecionado.length > 0 && (
        <button style={styles.fab} onClick={handleUpload}>
          ⬆ Vincular
        </button>
      )}

      {modalGetNotaVisible && (
        <ModalGetNota
          onClose={fecharModal}
          selecionarNota={selecionarNota}
          visible={modalGetNotaVisible}
        />
      )}

    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    width: "75%",
  },

  fab: {
    position: "fixed",
    bottom: "30px",
    right: "30px",
    backgroundColor: "#164a75",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "15px 20px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    zIndex: 999,
  },

  btnOpenModal: {
    width: "100%",
    backgroundColor: "#0ea5e9", // azul bonito (diferente do vincular)
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    marginBottom: "15px",
    transition: "0.2s",
  },

  side: {
    padding: "20px",
    width: "25%",
  },

  cardSide: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    height: "100%",
  },
  sectionTitle: {
    marginBottom: "10px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },

  divider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "15px 0",
  },

  empty: {
    textAlign: "center" as const,
    marginTop: "40px",
    color: "#64748b",
  },

  emptySmall: {
    fontSize: "13px",
    color: "#94a3b8",
  },

  input: {
    width: "300px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },

  title: {
    fontSize: "22px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "16px",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },

  autorizacao: {
    fontWeight: "bold",
  },

  badge: {
    backgroundColor: "#e2e8f0",
    padding: "4px 8px",
    borderRadius: "8px",
    fontSize: "12px",
  },

  body: {
    fontSize: "14px",
    marginBottom: "10px",
  },

  button: {
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  selectedItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    marginTop: "8px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
  },

  selectedTitle: {
    fontWeight: "600",
    fontSize: "13px",
  },

  selectedValue: {
    fontSize: "12px",
    color: "#64748b",
  },

  btnRemove: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    width: "24px",
    height: "24px",
    cursor: "pointer",
    padding: "0px"
  },
} as const;