import React from "react";
import LoginForm from "./components/LoginForm";


export const Login: React.FC = () => {

  return (

    <div style={{ display: "flex", height: "50vh" }}>

      {/* Sidebar controlada por props */}
      <LoginForm />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>


        <main style={{ flex: 1, padding: "1rem" }}>
          <div style={styles.backgroundImage}></div>
        </main>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: { display: 'flex', minHeight: '100vh', width: '100vw', overflow: 'hidden', margin: 0, padding: 0 },
  leftSide: { flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: '40px', zIndex: 2 },
  loginBox: { width: '100%', maxWidth: '380px' },
  header: { marginBottom: '32px', textAlign: 'left' },
  title: { fontSize: '28px', fontWeight: '700', color: '#164a75', margin: '0 0 8px 0' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#164a75' },
  input: { padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px', backgroundColor: '#f8fafc', outline: 'none', color: '#1e293b', },
  button: { marginTop: '10px', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#164a75', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'pointer' },
  buttonDisabled: { backgroundColor: '#94a3b8', cursor: 'not-allowed' },
  errorText: { color: '#dc2626', fontSize: '14px', textAlign: 'center' },
  rightSide: { flex: '3', position: 'relative', overflow: 'hidden', height: '100vh' },
  backgroundImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(loginImage.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)', transform: 'scale(1.0)' },
  logoContainer: { marginTop: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  logoImage: { maxWidth: '150px', height: 'auto' }
};
