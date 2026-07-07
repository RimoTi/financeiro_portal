import React, { useState, useEffect } from "react";
// Importe seu serviço aqui:
// import { getSeusLancamentos } from "../services/lancamentoService"; 
import { Spinner } from "@components/spinner";
import { Representante } from "@features/cupom/types";

export const ListaCupons: React.FC = () => {
    const [dados, setDados] = useState<Representante[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDados = async () => {
            setLoading(true);
            try {
                // const resultado = await getSeusLancamentos();
                // setDados(resultado);
            } catch (error) {
                console.error("Erro ao buscar lançamentos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDados();
    }, []);

    const formatMoney = (val: number) => 
        val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    if (loading) {
        return <Spinner text="Carregando Lançamentos..." />;
    }

    return (
        <div style={styles.container}>
            {dados.map((rep) => (
                <div key={rep.repId} style={styles.section}>
                    <h2 style={styles.repTitle}>{rep.descRep} ({rep.codRep})</h2>

                    {/* CRÉDITOS */}
                    <h3 style={styles.subTitle}>Créditos</h3>
                    <div style={styles.grid}>
                        {rep.creditos.map((c) => (
                            <div key={c.id} style={{ ...styles.card, borderLeft: "4px solid #22c55e" }}>
                                <p><strong>PDV:</strong> {c.numPdvLoja}</p>
                                <p><strong>Valor PDV:</strong> {formatMoney(c.vlrPdv)}</p>
                                <p><strong>Prêmio:</strong> {formatMoney(c.vlrPremioPdv)}</p>
                            </div>
                        ))}
                    </div>

                    {/* DÉBITOS */}
                    <h3 style={styles.subTitle}>Débitos</h3>
                    <div style={styles.grid}>
                        {rep.debitos.map((d) => (
                            <div key={d.id} style={{ ...styles.card, borderLeft: "4px solid #ef4444" }}>
                                <p><strong>Tipo:</strong> {d.tipoDeb}</p>
                                <p><strong>Valor Pendente:</strong> {formatMoney(d.vlrPend)}</p>
                                <p><strong>Data:</strong> {new Date(d.dtPdv).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            {dados.length === 0 && (
                <div style={styles.empty}>Nenhum lançamento encontrado.</div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: "24px",
        backgroundColor: "#f1f5f9",
        minHeight: "100vh",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "18px",
    },
    section: {
        marginBottom: "40px",
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
    },
    repTitle: {
        fontSize: "20px",
        color: "#1e293b",
        marginBottom: "15px",
        borderBottom: "2px solid #e2e8f0",
        paddingBottom: "10px"
    },
    subTitle: {
        fontSize: "16px",
        color: "#64748b",
        marginTop: "20px",
        marginBottom: "10px"
    },
    card: {
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        padding: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    empty: {
        textAlign: "center",
        marginTop: "40px",
        color: "#64748b",
    }
};