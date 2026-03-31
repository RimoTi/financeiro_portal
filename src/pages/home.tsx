export const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.backgroundImage}></div>
      <div style={styles.content}>
        <h1>Bem-vindo ao Sistema</h1>
        {/* Seu conteúdo aqui */}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: '8px' // Opcional, para dar um charme no painel central
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(loginImage.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
    zIndex: 1 // Fica atrás
  },
  content: {
    position: 'relative',
    zIndex: 2, // Fica na frente da imagem borrada
    padding: '2rem',
    color: '#0c0c0c'
  }
};