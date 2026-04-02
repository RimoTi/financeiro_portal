type SpinnerProps = {
  text?: string;
  fullScreen?: boolean;
};

export const Spinner: React.FC<SpinnerProps> = ({
  text = "Carregando...",
  fullScreen = false,
}) => {
  return (
    <div style={fullScreen ? styles.overlay : styles.inlineContainer}>
      <div style={styles.modal}>
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
          <p>{text}</p>
        </div>
      </div>
    </div>
  );
};


 const styles = {
  // 🔥 fullscreen overlay
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    backdropFilter: "blur(3px)", // 👈 deixa bonito
  },

  // 🔹 uso inline (sem travar tela)
  inlineContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: "20px",
  },

  modal: {
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    minWidth: "220px",
    textAlign: "center" as const,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  spinnerContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "12px",
  },

  spinner: {
    width: "42px",
    height: "42px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite" as const,
  },
};