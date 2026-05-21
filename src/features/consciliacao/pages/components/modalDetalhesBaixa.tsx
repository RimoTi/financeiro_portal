import { CTooltip } from "@coreui/react";
import { useState } from "react";

type ModalDetalhesBaixaProps = {
    dataMovimentacao: Date;
    valorTotal: number;
    totalPagamentos: number;
}

interface props {
    visible: boolean;
    onClose: () => void;
    modalDetalhesBaixaProps: ModalDetalhesBaixaProps;
    baixarTitulos: () => Promise<void> | void; // Aceita funções assíncronas
}

export const ModalDetalhesBaixa: React.FC<props> = ({
    visible,
    onClose,
    modalDetalhesBaixaProps,
    baixarTitulos
}) => {
    const [buttonEnabled, setButtonEnabled] = useState(true); 

    // Transformamos em async para esperar a API processar a baixa
    const handleUpload = async () => {
        try {
            setButtonEnabled(false); // Trava o botão para evitar clique duplo
            await baixarTitulos();   // Espera o processo terminar de verdade
        } catch (error) {
            console.error("Erro ao baixar títulos:", error);
        } finally {
            setButtonEnabled(true);  // Destrava quando tudo terminar
        }
    }

    if (!visible) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Detalhes da Baixa</h2>
                </div>

                <div style={styles.body}>
                    <p>
                        <strong>Data:</strong>{" "}
                        {modalDetalhesBaixaProps.dataMovimentacao.toISOString().split("T")[0].split("-").reverse().join("/")}
                    </p>
                    <p><strong>Valor Total:</strong> {modalDetalhesBaixaProps.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    <p><strong>Total de Pagamentos:</strong> {modalDetalhesBaixaProps.totalPagamentos}</p>
                </div>

                <div style={styles.footer}>
                    <CTooltip content="Confirma a baixa dos títulos selecionados" placement="top">
                        {/* 1. Usamos a propriedade nativa disabled */}
                        {/* 2. Alteramos o estilo dinamicamente para dar feedback visual (opacidade) */}
                        <button 
                            style={{
                                ...styles.primaryButton, 
                                opacity: buttonEnabled ? 1 : 0.6,
                                cursor: buttonEnabled ? "pointer" : "not-allowed"
                            }} 
                            disabled={!buttonEnabled} 
                            onClick={handleUpload}
                        >
                            {buttonEnabled ? "Baixar Títulos" : "Processando..."}
                        </button>
                    </CTooltip>
                    <CTooltip content="Fecha esta janela sem realizar a baixa" placement="top">
                        <button style={styles.secondaryButton} onClick={onClose} disabled={!buttonEnabled}>
                            Fechar
                        </button>
                    </CTooltip>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: "fixed",
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
        borderRadius: "16px",
        width: "400px",
        maxWidth: "90%",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    header: {
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: "8px",
    },

    title: {
        margin: 0,
        fontSize: "20px",
        fontWeight: 600,
    },

    body: {
        fontSize: "14px",
        color: "#475569",
        lineHeight: "1.6",
    },

    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        marginTop: "10px",
    },

    primaryButton: {
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        fontWeight: 500,
        transition: "opacity 0.2s ease-in-out",
    },

    secondaryButton: {
        backgroundColor: "#e2e8f0",
        color: "#1e293b",
        border: "none",
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: 500,
    },
};