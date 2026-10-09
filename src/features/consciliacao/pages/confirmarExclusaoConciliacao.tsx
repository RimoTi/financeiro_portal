import React, { useState } from "react";
import { Conciliacao } from "../types";
import { excluirConciliacao, getConciliacaoByNota } from "../consciliacaoService";

export const ConfirmarExclusaoConciliacao = () => {
  const [dados, setDados] = useState<Conciliacao | null>(null);
  const [searchInput, setSearchInput] = useState(""); // Novo estado para o input
  const [loading, setLoading] = useState(false); // Estado para feedback visual

  const handleSearch = async () => {
    if (!searchInput) return;

    setLoading(true);
    try {
      const response = await getConciliacaoByNota(Number(searchInput));
      setDados(response);
    } catch (error) {
      console.error("Erro ao buscar conciliação:", error);
      alert("Conciliação não encontrada ou erro na busca.");
      setDados(null);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const formatDate = (date: string) => new Date(date).toLocaleDateString("pt-BR");

  const handleConfirmar = async () => {
    if (!dados) return;
    if (!window.confirm(`Tem certeza que deseja excluir a conciliação #${dados.id}? Esta ação não pode ser desfeita.`)) {
      return;
    }
    // Aqui você chamaria a função de exclusão da conciliação
    console.log("Excluindo conciliação:", dados.id);
    // Lógica para excluir a conciliação
    try {
            await excluirConciliacao(Number(searchInput))
      alert("Conciliação excluída com sucesso!");
      setDados(null); // Limpa os dados após a exclusão
      setSearchInput(""); // Limpa o input após a exclusão
    } catch (error) {
      console.error("Erro ao excluir conciliação:", error);
      alert("Erro ao excluir conciliação.");
    }
  };

  const handleCancelar = () => {
    console.log("Operação cancelada");
    // Lógica de voltar ou fechar modal
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>

        {/* BARRA DE BUSCA */}
        <div style={styles.searchCard}>
          <h3 style={styles.searchTitle}>Buscar Conciliação</h3>
          <div style={styles.searchRow}>
            <input
              type="number"
              style={styles.searchInput}
              placeholder="Digite o número da Nota Fiscal..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Permite buscar com o Enter
            />
            <button
              style={styles.btnSearch}
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* SÓ EXIBE O RESTO SE TIVER DADOS */}
        {dados ? (
          <>
            {/* CABEÇALHO DE ALERTA */}
            <div style={styles.alertCard}>
              <h2 style={styles.alertTitle}>⚠️ Confirmar Exclusão de Vínculo</h2>
              <p style={styles.alertText}>
                Você está prestes a excluir a conciliação <strong>#{dados.id}</strong>.
                Isso irá desfazer o vínculo entre as autorizações e notas fiscais abaixo. Esta ação não pode ser desfeita.
              </p>
            </div>

            {/* RESUMO DA CONCILIAÇÃO */}
            <h4 style={styles.sectionTitle}>Resumo da Operação</h4>
            <div style={styles.summaryGrid}>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Status</span>
                <span style={styles.summaryValue}>
                  {dados.finalizada === 1 ? "Finalizada" : "Pendente"}
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Última Parcela</span>
                <span style={styles.summaryValue}>
                  {dados.dataUltParc ? formatDate(String(dados.dataUltParc)) : '-'}
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Total Autorizado ({dados.totalAutoriz})</span>
                <span style={{ ...styles.summaryValue, color: "#059669" }}>
                  {formatMoney(dados.vlrTotalAutoriz ?? 0)}
                </span>
              </div>
              <div style={styles.summaryItem}>
                <span style={styles.summaryLabel}>Total Notas ({dados.totalNotas})</span>
                <span style={{ ...styles.summaryValue, color: "#2563eb" }}>
                  {formatMoney(dados.vlrAbNotas ?? 0)}
                </span>
              </div>
            </div>

            <div style={styles.divider} />

            {/* AUTORIZAÇÕES VINCULADAS */}
            <h4 style={styles.sectionTitle}>💳 Autorizações que serão desvinculadas</h4>
            <div style={styles.grid}>
              {dados.autorizacoes.map((aut) => (
                <div key={aut.id} style={styles.card}>
                  <div style={styles.header}>
                    <span style={styles.autorizacao}>#{aut.numAutorizacao}</span>
                    <span style={styles.badge}>ID: {aut.id}</span>
                  </div>
                  <div style={styles.body}>
                    <p><strong>Venda:</strong> {aut.idVenda}</p>
                    <p><strong>Parcelas:</strong> {aut.totalParc}x</p>
                    <p><strong>Última Parc:</strong> {aut.dataUltParc ? formatDate(String(aut.dataUltParc)) : '-'}</p>
                  </div>
                  <div style={styles.footerRow}>
                    <strong>Valor:</strong>
                    <span style={{ color: "#059669", fontWeight: "bold" }}>
                      {formatMoney(aut.vlrTotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.divider} />

            {/* NOTAS VINCULADAS */}
            <h4 style={styles.sectionTitle}>🧾 Notas Fiscais que retornarão ao status aberto</h4>
            <div style={styles.grid}>
              {dados.notas.map((nota) => (
                <div key={nota.id} style={styles.card}>
                  <div style={styles.header}>
                    <span style={styles.autorizacao}>NF {nota.numNf}</span>
                  </div>
                  <div style={styles.body}>
                    <p><strong>Cliente:</strong> {nota.nome}</p>
                    <p><strong>Valor Total:</strong> {formatMoney(nota.vlrTotal)}</p>
                  </div>
                  <div style={styles.footerRow}>
                    <strong>Em Aberto:</strong>
                    <span style={{ color: "#2563eb", fontWeight: "bold" }}>
                      {formatMoney(nota.vlrAb)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div style={styles.actionRow}>
              <button style={styles.btnCancel} onClick={handleCancelar}>
                Cancelar
              </button>
              <button style={styles.btnDanger} onClick={handleConfirmar}>
                Sim, Excluir Conciliação
              </button>
            </div>
          </>
        ) : (
          /* MENSAGEM QUANDO ESTIVER VAZIO */
          !loading && (
            <div style={{ textAlign: "center", color: "#64748b", marginTop: "40px" }}>
              <p>Digite o número de uma nota fiscal para carregar os dados da conciliação.</p>
            </div>
          )
        )}

      </div>
    </div>
  );
};

// Estilos
const styles = {
  pageWrapper: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    padding: "20px 0",
  },
  container: {
    width: "80%",
    maxWidth: "1000px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
  },

  // NOVOS ESTILOS PARA A BUSCA
  searchCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    marginBottom: "10px",
  },
  searchTitle: {
    margin: "0 0 15px 0",
    fontSize: "16px",
    color: "#1e293b",
  },
  searchRow: {
    display: "flex",
    gap: "12px",
  },
  searchInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },
  btnSearch: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "0 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "15px",
    transition: "0.2s",
  },

  alertCard: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "10px",
  },
  alertTitle: {
    color: "#b91c1c",
    fontSize: "20px",
    marginTop: 0,
    marginBottom: "10px",
  },
  alertText: {
    color: "#991b1b",
    margin: 0,
    fontSize: "15px",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "10px",
  },
  summaryItem: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column" as const,
  },
  summaryLabel: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "4px",
  },
  summaryValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
  },

  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  btnCancel: {
    backgroundColor: "#fff",
    color: "#475569",
    border: "1px solid #cbd5e1",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },
  btnDanger: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
    boxShadow: "0 4px 6px rgba(239, 68, 68, 0.2)",
  },

  sectionTitle: {
    marginTop: "20px",
    marginBottom: "10px",
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e2e8f0",
    margin: "15px 0",
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
    fontSize: "15px",
    color: "#0f172a",
  },
  badge: {
    backgroundColor: "#e2e8f0",
    color: "#475569",
    padding: "4px 8px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
  },
  body: {
    fontSize: "14px",
    marginBottom: "15px",
    color: "#334155",
    lineHeight: "1.6",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px dashed #e2e8f0",
    paddingTop: "12px",
    fontSize: "15px",
  },
} as const;