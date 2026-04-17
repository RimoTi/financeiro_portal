
import React, { useEffect, useState } from "react";
import { getHistoricoMovimentacoes } from "../consciliacaoService";
import { INotaFiscalHistorico } from "../types";
import { Spinner } from "@components/spinner";
import { useLocation } from "react-router-dom";


export const HistoricoMov: React.FC = () => {
    const [numeroNota, setNumeroNota] = useState("");
    const [historico, setHistorico] = useState<INotaFiscalHistorico | null>(null);
    const [loading, setLoading] = useState(false);

    const location = useLocation();

    const numNf = location.state?.numNf || "";

useEffect(() => {
    if (numNf) {
        const nota = String(numNf);
        setNumeroNota(nota);
    }
}, [numNf]);


    const handleBuscarHistorico = async () => {
        if (!numeroNota) {
            alert("Por favor, insira o número da nota fiscal.");
            return;
        }
        try {
            setLoading(true);
            const data = await getHistoricoMovimentacoes(Number(numeroNota));
            setHistorico(data);
        } catch (err) {
            alert(err instanceof Error ? err.message : "Erro ao buscar histórico de movimentações");
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <Spinner text="Buscados movimentações" />;
    }

    return (
        <div style={styles.container}>
            <div style={styles.backgroundImage}></div>

            <div style={styles.content}>
                <div style={styles.card}>
                    <h1 style={styles.title}>Consulta de Nota Fiscal</h1>
                    <p style={styles.subTitle}>Pesquise rapidamente pelo número da nota</p>

                    <div style={styles.searchArea}>
                        <input
                            style={styles.input}
                            placeholder="Digite o número da nota..."
                            value={numeroNota}
                            onChange={(e) => setNumeroNota(e.target.value)}
                        />

                        <button style={styles.button} onClick={handleBuscarHistorico}>
                            Pesquisar
                        </button>
                    </div>
                </div>

                <div style={styles.resultCard}>
                    <div style={styles.grid}>
                        <Info titulo="Número NF" valor={historico?.numNf} />
                        <Info titulo="Cliente" valor={historico?.nome} />
                        <Info titulo="Valor Total" valor={`R$ ${historico?.vlrTotal}`} />
                        <Info titulo="Em Aberto" valor={`R$ ${historico?.vlrAb}`} />
                    </div>

                    <div style={styles.chaveBox}>
                        <strong>Chave de Acesso:</strong>
                        <div>{historico?.chaveAcesso}</div>
                    </div>

                    <h3 style={styles.sectionTitle}>Movimentações</h3>

                    {historico?.titulos?.map((titulo) =>
                        titulo.baixas.map((item) => (
                            <div key={item.id} style={styles.movItem}>
                                <div>
                                    <strong>{item.tipoMovimento}</strong>
                                    <div style={{ fontSize: 13 }}>
                                        {new Date(item.data).toLocaleDateString("pt-BR")}
                                    </div>
                                    <div style={{ fontSize: 12, color: "#64748b" }}>
                                        {item.usuario}
                                    </div>
                                </div>

                                <div style={styles.valor}>
                                    R$ {item.valor.toLocaleString("pt-BR", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Info = ({ titulo, valor }: any) => (
    <div style={styles.infoCard}>
        <div style={styles.infoTitle}>{titulo}</div>
        <div style={styles.infoValue}>{valor}</div>
    </div>
);

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "auto",
        borderRadius: "8px",
    },

    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundImage: "url(loginImage.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(10px)",
        zIndex: 1,
    },

    content: {
        position: "relative",
        zIndex: 2,
        padding: "30px",
    },

    card: {
        background: "rgba(255,255,255,0.82)",
        borderRadius: "18px",
        padding: "30px",
        marginBottom: "20px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    },

    title: {
        margin: 0,
        fontSize: "28px",
        color: "#1e293b",
    },

    subTitle: {
        marginTop: "8px",
        color: "#64748b",
    },

    searchArea: {
        display: "flex",
        gap: "12px",
        marginTop: "25px",
        flexWrap: "wrap",
    },

    input: {
        flex: 1,
        minWidth: "250px",
        padding: "14px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        outline: "none",
    },

    button: {
        padding: "14px 28px",
        borderRadius: "12px",
        border: "none",
        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "15px",
    },

    resultCard: {
        background: "rgba(255,255,255,0.85)",
        borderRadius: "18px",
        padding: "25px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
        gap: "15px",
    },

    infoCard: {
        background: "#f8fafc",
        borderRadius: "14px",
        padding: "16px",
    },

    infoTitle: {
        fontSize: "13px",
        color: "#64748b",
    },

    infoValue: {
        fontSize: "18px",
        fontWeight: 700,
        color: "#0f172a",
        marginTop: "6px",
    },

    chaveBox: {
        marginTop: "20px",
        padding: "16px",
        background: "#eff6ff",
        borderRadius: "12px",
        wordBreak: "break-all",
        color: "#1e3a8a",
    },

    sectionTitle: {
        marginTop: "25px",
        marginBottom: "15px",
        color: "#1e293b",
    },

    movItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "#f8fafc",
        padding: "14px",
        borderRadius: "12px",
        marginBottom: "10px",
    },

    valor: {
        fontWeight: 700,
        color: "#059669",
    },
};