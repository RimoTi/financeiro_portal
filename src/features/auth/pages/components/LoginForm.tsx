import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAuth } from '@context/useAuth';
import {authService} from '../../authService';

const Login: React.FC = () => {
  const [loginUsuario, setLoginUsuario] = useState<string>(''); // mudei o nome para não confundir com a função login
  const [senha, setSenha] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const handleSubmit = async (event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 3. Chama o serviço (apenas para a requisição API)
      const data = await authService.logar({ login: loginUsuario, senha });
      // 4. Se a API respondeu ok, avisamos o Contexto para gravar os dados e mudar o estado global
      if (data) {
        setUsuario(data);
        navigate('/home');
      } else {
        setError('Erro ao logar.');
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Trata erros de senha errada ou servidor fora
      const mensagemErro = err.response?.data?.message || err.response?.data || 'Falha na autenticação. Verifique os seus dados.';
      alert(mensagemErro);
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.leftSide}>
        <div style={styles.loginBox}>
          <header style={styles.header}>
            <h1 style={styles.title}>Portal Finanças</h1>
          </header>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="login" style={styles.label}>Usuário</label>
              <input
                id="login"
                type="text"
                value={loginUsuario}
                onChange={(e) => setLoginUsuario(e.target.value)}
                style={styles.input}
                placeholder="Digite o seu usuário"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="senha" style={styles.label}>Senha</label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                style={styles.input}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <span style={styles.errorText}>{error}</span>}

            <button
              type="submit"
              style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
              disabled={loading}
            >
              {loading ? 'A autenticar...' : 'Entrar no Sistema'}
            </button>

            <div style={styles.logoContainer}>
              <img
                src="logoRimo.png"
                alt="Logo Rimo"
                style={styles.logoImage}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
            </div>
          </form>
        </div>
      </div>
      <div style={styles.rightSide}>
        <div style={styles.backgroundImage}></div>
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
  backgroundImage: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(loginImage.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(8px)', transform: 'scale(1.1)' },
  logoContainer: { marginTop: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  logoImage: { maxWidth: '150px', height: 'auto' }
};

export default Login;