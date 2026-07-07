/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { getCuponsPedidosNaoGerados, gerarTituloCupom } from "@features/cupom/cupom_service";
import { Spinner } from "@components/spinner";
import { Cupom, Representante } from "@features/cupom/types";
import { CButton } from "@coreui/react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const GerarCupons: React.FC = () => {
    const [dados, setDados] = useState<Representante[]>([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDados = async () => {
            setLoading(true);
            try {
                const resultado = await getCuponsPedidosNaoGerados();
                setDados(resultado);
            } catch (error) {
                const mensagem = error instanceof Error ? error.message : "Erro inesperado";
                toast.error(mensagem);
            } finally {
                setLoading(false);
            }
        };
        fetchDados();
    }, []);

const GerarCupons = async (repId:number) => {
    if(dados.length == 0){
        toast.error("Lista esta vazia")
        return
    }
    try {
        setLoading(true);
        const rep = dados.find(x=>x.repId == repId)        
        if (!rep) {
            toast.error("Representante não encontrado na lista.");
            return; // Interrompe a execução
        }
        const reps = [rep]
        const msg = await gerarTituloCupom(reps);
        toast.success(msg);
    } catch (error) {
        const mensagem = error instanceof Error ? error.message : "Erro inesperado";
        toast.error(mensagem);
    } finally {
        // O finally sempre executa, independente de sucesso ou falha
        setLoading(false);
    }
}

    const getCorCard = (cupon: Cupom) => (cupon.vlrTit >= 0 ? "#16a34a" : "#dc2626");

    if (loading) return <Spinner text="Carregando Lançamentos..." />;

    return (
        <div style={styles.container}>
            {dados.map((rep) => (
                <div key={rep.repId} style={styles.card}>
                    <div style={styles.header}>
                        <h5 style={styles.repId}>Rep: {rep.descRep}</h5>
                        <span>{new Date(rep.cupon.dtCadastro).toLocaleDateString()}</span>
                    </div>

                    <div style={styles.bodyLayout}>
                        <div style={styles.infoArea}>
                            <p style={styles.obs}>{rep.cupon.observacao}</p>
                            <h2 style={{ ...styles.valor, color: getCorCard(rep.cupon) }}>
                                R$ {rep.cupon.vlrTit.toFixed(2)}
                            </h2>
                            <p style={styles.pendente}>Pendente: R$ {rep.cupon.vlrPendente.toFixed(2)}</p>
                        </div>

                        <div style={styles.buttonsArea}>
                            <CButton color="secondary" size="sm"
                                onClick={()=>navigate(`/detalhes/cupons/a/gerar/${rep.repId}`, { state: { representante: rep } })}
                            >Detalhes</CButton>
                            <CButton color="primary" size="sm"
                            onClick={()=>GerarCupons(rep.repId)}
                            >Gerar</CButton>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: "24px",
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        justifyContent: "flex-start",
        borderRadius: "12px",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        border: "1px solid #e5e7eb",
        width: "400px",
        display: "flex",
        flexDirection: "column",
        height: "200px"
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
        fontSize: "0.85rem",
        color: "#6b7280",
    },
    bodyLayout: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: "10px",
    },
    infoArea: {
        flex: 1,
    },
    buttonsArea: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginLeft: "20px",
        marginTop: "25px"
    },
    valor: {
        margin: "10px 0",
        fontSize: "1.5rem",
    },
    obs: {
        fontSize: "0.9rem",
        fontWeight: "500",
        marginBottom: "4px",
    },
    pendente: {
        fontSize: "0.8rem",
        color: "#9ca3af",
        margin: 0,
    },
    repId: {
        fontSize: "0.95rem",
        margin: 0,
    },
};