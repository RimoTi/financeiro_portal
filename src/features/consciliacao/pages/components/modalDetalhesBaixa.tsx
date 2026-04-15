type ModalDetalhesBaixaProps = {
    dataMovimentacao: Date;
    valorTotal: number;
    totalPagamentos: number;
}

interface props {
    visible: boolean;
    onClose: () => void;
    modalDetalhesBaixaProps: ModalDetalhesBaixaProps;
    baixarTitulos: () => void;
}

export const ModalDetalhesBaixa: React.FC<props> = ({
    visible,
    onClose,
    modalDetalhesBaixaProps,
    baixarTitulos
}) => {
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
                    {modalDetalhesBaixaProps.dataMovimentacao.toLocaleDateString("pt-BR", {
                        timeZone: "America/Sao_Paulo"
                    })}
                    </p>
                    <p><strong>Valor Total:</strong> {modalDetalhesBaixaProps.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    <p><strong>Total de Pagamentos:</strong> {modalDetalhesBaixaProps.totalPagamentos}</p>
                </div>

                <div style={styles.footer}>
                    <button style={styles.primaryButton} onClick={baixarTitulos}>
                        Baixar Títulos
                    </button>
                    <button style={styles.secondaryButton} onClick={onClose}>
                        Fechar
                    </button>
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
        animation: "fadeIn 0.2s ease-in-out",
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
        cursor: "pointer",
        fontWeight: 500,
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