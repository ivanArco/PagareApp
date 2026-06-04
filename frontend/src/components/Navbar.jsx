import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const ROL_META = {
  abogado:  { label: 'Abogado',  color: '#3B6D11', bg: '#EAF3DE' },
  contador: { label: 'Contador', color: '#185FA5', bg: '#E6F1FB' },
  admin:    { label: 'Admin',    color: '#A32D2D', bg: '#FCEBEB' },
  basico:   { label: 'Básico',   color: '#5F5E5A', bg: '#F1EFE8' },
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  const meta = ROL_META[user?.rol] || ROL_META.basico;
  const initial = user?.nombre?.charAt(0).toUpperCase() || '?';

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#fff',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <div style={{
          maxWidth: 1060,
          margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: '#042C53',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, flexShrink: 0,
            }}>⚖️</div>
            <div style={{ lineHeight: 1.2 }}>
              <span style={{
                display: 'block',
                fontSize: 15,
                fontWeight: 600,
                color: '#042C53',
                fontFamily: "'DM Serif Display', Georgia, serif",
                letterSpacing: '-0.01em',
              }}>LexDespacho</span>
              <span style={{ fontSize: 10, color: '#B4B2A9', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Gestión Legal
              </span>
            </div>
          </Link>

          {/* Acciones */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

              {/* Link Admin (solo admin) */}
              {user.rol === 'admin' && (
                <Link
                  to="/admin"
                  style={{
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#A32D2D',
                    background: '#FCEBEB',
                    borderRadius: 7,
                    padding: '5px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    transition: 'background 0.15s',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F7C1C1'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FCEBEB'}
                >
                  ⚙️ <span>Admin</span>
                </Link>
              )}

              {/* Separador */}
              <div style={{ width: 1, height: 22, background: '#E5E3DC' }} />

              {/* Perfil */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 30, height: 30,
                  borderRadius: '50%',
                  background: meta.bg,
                  color: meta.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700,
                  flexShrink: 0,
                }}>{initial}</div>

                <div style={{ lineHeight: 1.25 }}>
                  <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#2C2C2A' }}>
                    {user.nombre}
                  </span>
                  <span style={{
                    display: 'block', fontSize: 10,
                    color: meta.color, fontWeight: 600,
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                  }}>{meta.label}</span>
                </div>
              </div>

              {/* Separador */}
              <div style={{ width: 1, height: 22, background: '#E5E3DC' }} />

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  borderRadius: 7,
                  padding: '5px 13px',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#5F5E5A',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#FCEBEB';
                  e.currentTarget.style.borderColor = '#F09595';
                  e.currentTarget.style.color = '#A32D2D';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.borderColor = '#D3D1C7';
                  e.currentTarget.style.color = '#5F5E5A';
                }}
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}