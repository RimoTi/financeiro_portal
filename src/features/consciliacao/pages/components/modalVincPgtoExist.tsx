import React, { useEffect, useRef, useState } from "react";
import { getConsiliacao, vincularExistente} from "@features/consciliacao/consciliacaoService";
import {  ApiResquestGetNota, Autorizacao, Pagamento } from "@features/consciliacao/types";
import { toast } from "react-toastify";


interface Props {
    visible: boolean;
    onClose: () => void;
    pagamento: Pagamento;
    removerPagamento: (pagamento: Pagamento) => void;
}

export const ModalVincularPagamentoExistente: React.FC<Props> = ({
    visible,
    onClose,
    pagamento,
    removerPagamento
}) => {

    const [apiResquestGetNota, setApiRequestGetNota] = useState<ApiResquestGetNota>({ numNf: 0, chaveAcesso: "" });
    const [loading, setLoading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);


    const fetchNota = async () => {
        setLoading(true);
        try {
            const data = await getConsiliacao(apiResquestGetNota);
            //caso não queria mostrar o resultado na tela, apenas selecionar a nota e fechar o modal, descomentar as linhas abaixo e comentar as linhas acima
            if (data && data.id) {
                console.log("Pagamento", pagamento);
                const autorizacao: Autorizacao = {
                    id: null,
                    concId: data.id,
                    pagamentoId: pagamento.id,
                    numAutorizacao: pagamento.numAutorizacao,
                    totalParc: pagamento.totalParcela,
                    vlrTotal: pagamento.valorParcelaLiquido,
                    DataUltParc: pagamento.dataPagamento
                }

                vincularExistente(data.id, autorizacao);
                removerPagamento(pagamento);
                setApiRequestGetNota({ numNf: 0, chaveAcesso: "" });
                onClose();
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            const mensagem =
                error?.response?.data ||
                error?.response?.data?.message ||
                "Erro ao processar"

            toast.error(mensagem)
        } finally {
            setLoading(false);
            setApiRequestGetNota({ numNf: 0, chaveAcesso: "" });
        }
    };



    if (!visible) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>🔍 Buscar Conciliação</h2>

                {/* INPUTS */}
                <div>
                    <input
                        ref={inputRef}
                        placeholder="Número da nota..."
                        value={apiResquestGetNota.numNf || ""}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                fetchNota();
                            }
                        }}
                        onChange={(e) =>
                            setApiRequestGetNota({
                                ...apiResquestGetNota,
                                numNf: Number(e.target.value)
                            })
                        }
                        style={styles.input}
                    />

                   {/* <input
                        
                        placeholder="Chave de acesso..."
                        value={apiResquestGetNota.chaveAcesso || ""}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                fetchNota();
                            }
                        }}
                        onChange={(e) =>
                            setApiRequestGetNota({
                                ...apiResquestGetNota,
                                chaveAcesso: e.target.value
                            })
                        }
                        style={styles.input}
                    />*/}
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "10px" }}>
                        * Para vincular a autorização {pagamento?.numAutorizacao}, basta informar o número da nota.
                    </div>

                    <button style={styles.btnBuscar} onClick={fetchNota} disabled={loading}>
                        {loading ? "Vinculando..." : "Vincular"}
                    </button>

                    <button
                        style={styles.btnFechar}
                        onClick={onClose}
                        disabled={loading}
                    >
                        Fechar
                    </button>
                </div>

            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },

    modal: {
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        width: "500px",
        maxHeight: "80vh",
        overflowY: "auto" as const,
    },

    input: {
        width: "100%",
        padding: "10px",
        margin: "8px 0",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },

    lista: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
    },

    cardNota: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px",
        borderRadius: "12px",
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
    },

    cardContent: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "6px",
    },

    badge: {
        backgroundColor: "#2563eb",
        color: "#fff",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
    },

    nome: {
        fontSize: "14px",
        fontWeight: 500,
    },

    valor: {
        fontSize: "13px",
        color: "#64748b",
    },

    notaItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#e0f2fe",
        padding: "8px 10px",
        borderRadius: "8px",
        marginTop: "6px",
    },

    btnRemove: {
        background: "transparent",
        border: "none",
        color: "#ef4444",
        cursor: "pointer",
        fontSize: "14px",
    },

    btnAdd: {
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        width: "40%",
    },
    btnBuscar: {
        backgroundColor: "#16a34a",
        color: "#fff",
        border: "none",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        width: "100%",
    },
    btnFechar: {
        backgroundColor: "#be6836",
        color: "#fff",
        border: "none",
        padding: "8px",
        borderRadius: "6px",
        cursor: "pointer",
        width: "100%",
        marginTop: "20px"
    },

    close: {
        backgroundColor: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "8px",
        borderRadius: "6px",
        width: "100%",
    },

    actions: {
        display: "flex",
        gap: "10px",
        marginTop: "20px",
    },

    empty: {
        color: "#64748b",
        fontSize: "14px",
        marginTop: "5px",
    },
};