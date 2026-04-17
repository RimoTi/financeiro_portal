import React, { useEffect, useRef, useState } from "react";
import { getNota } from "@features/consciliacao/consciliacaoService";
import { NotaFiscal, ApiResquestGetNota } from "@features/consciliacao/types";
import { toast } from "react-toastify";


interface Props {
    visible: boolean;
    onClose: () => void;
    selecionarNota: (notas: NotaFiscal) => void;
}

export const ModalGetNota: React.FC<Props> = ({
    visible,
    onClose,
    selecionarNota,
}) => {

    const [apiResquestGetNota, setApiRequestGetNota] = useState<ApiResquestGetNota>({ numNf: 0, chaveAcesso: "" });
    const [nota, setNota] = useState<NotaFiscal | null>(null);
    const [loading, setLoading] = useState(false);
    
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


    const fetchNota = async () => {
        setNota(null);
        setLoading(true);
        try {
            const data = await getNota(apiResquestGetNota);
            setNota(data);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao buscar nota");
        } finally {
            setLoading(false);
            setApiRequestGetNota({ numNf: 0, chaveAcesso: "" });
        }
    };

    const handelAdicionarNota = () => {
        if (nota) {
            selecionarNota(nota);
            setNota(null);
            inputRef.current?.focus();
        }
    };



    if (!visible) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>🔍 Selecionar Nota</h2>

                {/* INPUTS */}
                <div>
                    <input
                        placeholder="Número da nota..."
                        value={apiResquestGetNota.numNf || ""}
                        onChange={(e) =>
                            setApiRequestGetNota({
                                ...apiResquestGetNota,
                                numNf: Number(e.target.value)
                            })
                        }
                        style={styles.input}
                    />

                    <input
                    ref={inputRef}
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
                    />

                    <button style={styles.btnBuscar} onClick={fetchNota} disabled={loading}>
                        {loading ? "Buscando..." : "Buscar"}
                    </button>

                     <button
                                style={styles.btnFechar}
                                onClick={onClose}
                                disabled={loading}
                            >
                                Fechar
                            </button>
                </div>

                {/* RESULTADO */}
                <div style={styles.lista}>
                    {nota && (
                        <div style={styles.cardNota}>
                            <div style={styles.cardContent}>
                                <span style={styles.badge}>NF {nota.numNf}</span>

                                <div style={styles.nome}>{nota.nome}</div>

                                <div style={styles.valor}>
                                    {nota.vlrTotal
                                        ? nota.vlrTotal.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })
                                        : "N/A"}
                                </div>
                            </div>

                            <button
                                style={styles.btnAdd}
                                onClick={handelAdicionarNota}
                                disabled={loading}
                            >
                                + Adicionar
                            </button>
                           
                        </div>
                    )}
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
        marginTop:"20px"
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