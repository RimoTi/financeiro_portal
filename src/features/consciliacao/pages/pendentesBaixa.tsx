import React from "react";

import { getTransacoesPendentesBaixa } from "../consciliacaoService";
import { Transacao } from "../types";


export const PendentesBaixa = () => {

    const [pendentesBaixa, setPendentesBaixa] = React.useState<Transacao[]>([]);
    React.useEffect(() => {
        const fetchData = async () => {
            try {

                const dataBaixa = await getTransacoesPendentesBaixa();
                const dataBaixaFiltrada = dataBaixa.filter((item) =>
                    item.vincTitNfs?.nfsSaida?.id
                );
                setPendentesBaixa(dataBaixaFiltrada);
            } catch (error) {
                console.error("Erro ao buscar transações sem vínculo:", error);
            }
        };
        fetchData();
    }, []);

    const formatMoney = (value: number) =>
        value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("pt-BR");

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>💳 Transações</h2>
                <button style={styles.button}>Baixar Títulos</button>
            </div>


            <div style={styles.grid}>
                {pendentesBaixa.map((item) => {
                    const nota = item.vincTitNfs?.nfsSaida;

                    return (
                        <div key={item.id} style={styles.card}>
                            {/* HEADER */}
                            <div style={styles.header}>
                                <span style={styles.autorizacao}>
                                    #{item.numAutorizacao}
                                </span>

                                <span style={styles.badge}>
                                    {item.bandeira}
                                </span>
                            </div>

                            {/* BODY */}
                            <div style={styles.body}>
                                <p>
                                    <strong>Parcela:</strong>{" "}
                                    {item.parcela}/{item.totalParcela}
                                </p>

                                <p>
                                    <strong>Valor:</strong>{" "}
                                    {formatMoney(item.valorParcelaLiquido)}
                                </p>

                                <p>
                                    <strong>Total Venda:</strong>{" "}
                                    {formatMoney(item.totalPlanoVenda)}
                                </p>

                                <p>
                                    <strong>Data:</strong>{" "}
                                    {formatDate(item.dataTransacao)}
                                </p>
                            </div>

                            {/* NOTA */}
                            <div style={styles.footer}>
                                {nota ? (
                                    <div style={styles.notaOk}>
                                        NF #{nota.numNf}
                                    </div>
                                ) : (
                                    <div style={styles.notaPendente}>
                                        Sem Nota Fiscal
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {pendentesBaixa.length === 0 && (
                <div style={styles.empty}>
                    Nenhuma transação encontrada
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "24px",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
    },

    title: {
        fontSize: "24px",
        fontWeight: "600",
        marginBottom: "24px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    button: {
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "500",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "18px",
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: "14px",
        padding: "18px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
    },

    autorizacao: {
        fontWeight: "600",
        fontSize: "15px",
        color: "#1e293b",
    },

    badge: {
        backgroundColor: "#e2e8f0",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
    },

    body: {
        fontSize: "14px",
        lineHeight: "1.6",
        marginBottom: "14px",
        color: "#475569",
    },

    footer: {
        marginTop: "auto",
    },

    notaOk: {
        backgroundColor: "#dcfce7",
        color: "#166534",
        padding: "6px",
        borderRadius: "8px",
        textAlign: "center" as const,
        fontWeight: "500",
    },

    notaPendente: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        padding: "6px",
        borderRadius: "8px",
        textAlign: "center" as const,
        fontWeight: "500",
    },

    empty: {
        textAlign: "center" as const,
        marginTop: "40px",
        color: "#64748b",
    },
};