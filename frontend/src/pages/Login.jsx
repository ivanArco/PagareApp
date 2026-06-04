import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Credenciales incorrectas. Verifique su correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    borderRadius: 9,
    padding: '11px 14px',
    fontSize: 14,
    fontFamily: "'DM Sans', system-ui, sans-serif",
    outline: 'none',
    background: '#FAFAF8',
    color: '#2C2C2A',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s, background 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F8F7F4',
      padding: 24,
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo / marca */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52,
            background: '#042C53',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 24,
          }}>⚖️</div>
          <h1 style={{
            margin: 0,
            fontSize: 26,
            fontWeight: 600,
            color: '#042C53',
            fontFamily: "'DM Serif Display', Georgia, serif",
            letterSpacing: '-0.02em',
          }}>LexDespacho</h1>
          <p style={{
            margin: '4px 0 0',
            fontSize: 13,
            color: '#888780',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}>Sistema de gestión legal</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '32px 32px 28px',
        }}>
          <h2 style={{
            margin: '0 0 24px',
            fontSize: 16,
            fontWeight: 600,
            color: '#2C2C2A',
          }}>Iniciar sesión</h2>

          {error && (
            <div style={{
              background: '#FCEBEB',
              border: '1px solid #F09595',
              color: '#791F1F',
              borderRadius: 9,
              padding: '10px 14px',
              fontSize: 13,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>✕</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                color: '#888780',
                marginBottom: 6,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>Correo electrónico</label>
              <input
                type="email"
                placeholder="usuario@despacho.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => { e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.background = '#FAFAF8'; }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#888780',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}>Contraseña</label>
                <Link to="/forgot-password" style={{
                  fontSize: 12,
                  color: '#185FA5',
                  textDecoration: 'none',
                  fontWeight: 500,
                }}>¿Olvidó su contraseña?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
                onFocus={e => { e.target.style.background = '#fff'; }}
                onBlur={e => { e.target.style.background = '#FAFAF8'; }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px 16px',
                background: loading ? '#B5D4F4' : '#0C447C',
                color: '#fff',
                border: 'none',
                borderRadius: 9,
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#042C53'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#0C447C'; }}
            >
              {loading ? 'Verificando…' : 'Ingresar'}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: 20,
          fontSize: 13,
          color: '#888780',
        }}>
          ¿No tiene cuenta?{' '}
          <Link to="/register" style={{
            color: '#185FA5',
            textDecoration: 'none',
            fontWeight: 600,
          }}>Registrarse</Link>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: 28,
          paddingTop: 20,
          fontSize: 11,
          color: '#B4B2A9',
          letterSpacing: '0.03em',
        }}>
          © {new Date().getFullYear()} LexDespacho · Acceso restringido
        </div>
      </div>
    </div>
  );
}