import React, { useState } from "react";
import { getNota, vincularNota as vincularNotaApi } from "@features/consciliacao/consciliacaoService";
import { Conciliacao, NotaFiscal, ApiResquestGetNota } from "@features/consciliacao/types";
import { toast } from "react-toastify";


interface Props {
    visible: boolean;
    onClose: () => void;
    concil: Conciliacao;
}



export const ModalGetNota: React.FC<Props> = ({
    visible,
    onClose,
    concil,
}) => {

    const [apiResquestGetNota, setApiRequestGetNota] = useState<ApiResquestGetNota>({ numNf: 0, chaveAcesso: "" });
    const [nota, setNota] = useState<NotaFiscal | null>(null);
    const [loading, setLoading] = useState(false);


    const fetchNota = async () => {
        setNota(null);
        setLoading(true);
        try {
            const data = await getNota(apiResquestGetNota); // sua API
            setNota(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const vincularNota = async () => {
        if (!concil || !nota) {
            toast.error("Conciliacao ou Nota inválida");
            return;
        }
        const conciliacaoData: Conciliacao = {
            numAutorizacao: concil.numAutorizacao,
            nfsId: nota.id,
            transacoes: concil.transacoes,
        };
        // 👉 aqui você chama sua API para vincular a nota
        try {
            setLoading(true);
            await vincularNotaApi(conciliacaoData);
            toast.success("Nota vinculada com sucesso!");
            setNota(null);
            onClose();
            window.dispatchEvent(new Event("atualizarSidebar"));
        } catch (err) {
            console.error(err);
            toast.error("Erro ao vincular nota");
        } finally {
            setLoading(false);
        }

    }


    if (!visible || !concil) return null;
    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>🔍 Selecionar Nota</h2>


                <div >
                    <input
                        placeholder="Buscar por número da nota..."
                        value={apiResquestGetNota.numNf || ""}
                        onChange={(e) => setApiRequestGetNota({ ...apiResquestGetNota, numNf: Number(e.target.value) })}
                        style={styles.input}
                    />
                    <input
                        placeholder="Buscar por chave de acesso..."
                        value={apiResquestGetNota.chaveAcesso || ""}
                        onChange={(e) => setApiRequestGetNota({ ...apiResquestGetNota, chaveAcesso: e.target.value })}
                        style={styles.input}
                    />
                    <button style={styles.btn} onClick={fetchNota} disabled={loading}>
                        {loading ? "Buscando..." : "Buscar"}
                    </button>
                </div>
                <div style={styles.lista}>
                    {nota && (
                        <div key={nota.id} >
                            <div>
                                <strong>NF {nota.numNf}</strong>
                                <p>{nota.nome}</p>
                                <p>Valor: {nota.vlrTotal ? nota.vlrTotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                }) : "N/A"} </p>
                            </div>

                            <button
                                style={styles.btn}
                                onClick={() => {
                                    vincularNota();
                                }}
                            disabled={loading}>
                        {loading ? "Vinculando..." : "Vincular"}
                            </button>
                        </div>)}
                </div>


                <button style={styles.close} onClick={onClose}>
                    Fechar
                </button>
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
        marginBottom: "10px",
        marginTop: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
    },

    lista: {
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
    },

    item: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        border: "1px solid #eee",
        borderRadius: "8px",
    },

    btn: {
        backgroundColor: "#16a34a",
        color: "#fff",
        border: "none",
        padding: "6px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        marginTop: "30px",
        marginBottom: "30px",
        height: "46px",
        width: "100%",
    },

    close: {
        marginTop: "10px",
        backgroundColor: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "8px",
        borderRadius: "6px",
        width: "100%",
    },
};