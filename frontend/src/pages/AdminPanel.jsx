import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import FormViewer from '../components/FormViewer';

const ROL_LABELS = {
  basico: { label: 'Básico', color: '#888780', bg: '#F1EFE8' },
  contador: { label: 'Contador', color: '#185FA5', bg: '#E6F1FB' },
  abogado: { label: 'Abogado', color: '#3B6D11', bg: '#EAF3DE' },
  admin: { label: 'Admin', color: '#A32D2D', bg: '#FCEBEB' },
};

function RolBadge({ rol }) {
  const r = ROL_LABELS[rol] || ROL_LABELS.basico;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: '0.02em',
      background: r.bg,
      color: r.color,
    }}>{r.label}</span>
  );
}

function Avatar({ nombre, apellidos }) {
  const initials = `${nombre?.[0] || ''}${apellidos?.[0] || ''}`.toUpperCase();
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%',
      background: '#E6F1FB', color: '#185FA5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 600, flexShrink: 0,
      fontFamily: 'var(--font-mono, monospace)',
    }}>{initials}</div>
  );
}

export default function AdminPanel() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nombre: '', apellidos: '', email: '', password: '', rol: 'basico' });
  const [submitting, setSubmitting] = useState(false);
  const authHeaders = { 'x-auth-token': token || localStorage.getItem('token') };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { 'x-auth-token': token || localStorage.getItem('token') }
      });
      setUsers(res.data);
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/admin/users', newUser, { headers: authHeaders });
      fetchUsers();
      setNewUser({ nombre: '', apellidos: '', email: '', password: '', rol: 'basico' });
    } finally { setSubmitting(false); }
  };

  const handleRoleChange = async (userId, newRole) => {
    await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { rol: newRole }, { headers: authHeaders });
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Eliminar usuario?')) {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, { headers: authHeaders });
      fetchUsers();
    }
  };

  const inputStyle = {
    width: '100%',
    borderRadius: 8,
    padding: '9px 13px',
    fontSize: 14,
    fontFamily: 'inherit',
    outline: 'none',
    background: '#fff',
    color: '#2C2C2A',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: '#888780',
    marginBottom: 6,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8F7F4', padding: '40px 0', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 4 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: '#0C447C', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontSize: 18,
            }}>⚙</div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: '#0C447C', letterSpacing: '-0.02em' }}>
                Panel de Administración
              </h1>
              <p style={{ margin: 0, fontSize: 13, color: '#888780' }}>
                Gestión de usuarios y configuración del sistema
              </p>
            </div>
          </div>
          <div style={{ height: 1, background: '#D3D1C7', marginTop: 20 }} />
        </div>

        {/* Crear usuario */}
        <div style={{
          background: '#fff', borderRadius: 14,
          marginBottom: 24, overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 16, color: '#185FA5' }}>✦</span>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>
              Crear nuevo usuario
            </h2>
          </div>

          <div style={{ padding: '24px' }}>
            <form onSubmit={handleCreateUser}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                {[
                  { key: 'nombre', label: 'Nombre', type: 'text' },
                  { key: 'apellidos', label: 'Apellidos', type: 'text' },
                  { key: 'email', label: 'Correo electrónico', type: 'email' },
                  { key: 'password', label: 'Contraseña', type: 'password' },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      type={type}
                      value={newUser[key]}
                      onChange={e => setNewUser({ ...newUser, [key]: e.target.value })}
                      required
                      style={inputStyle}
                    />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Rol</label>
                  <select
                    value={newUser.rol}
                    onChange={e => setNewUser({ ...newUser, rol: e.target.value })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="basico">Básico</option>
                    <option value="contador">Contador</option>
                    <option value="abogado">Abogado</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%', padding: '9px 16px',
                      background: submitting ? '#B5D4F4' : '#185FA5',
                      color: '#fff', border: 'none', borderRadius: 8,
                      fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', letterSpacing: '0.01em',
                      transition: 'background 0.15s',
                    }}
                  >
                    {submitting ? 'Creando…' : '+ Crear usuario'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div style={{
          background: '#fff', borderRadius: 14,
          marginBottom: 24, overflow: 'hidden',
        }}>
          <div style={{
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 16, color: '#185FA5' }}>◈</span>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>
                Gestión de usuarios
              </h2>
            </div>
            <span style={{
              fontSize: 12, fontWeight: 500, color: '#888780',
              background: '#F1EFE8', padding: '3px 10px', borderRadius: 99,
            }}>{users.length} usuario{users.length !== 1 ? 's' : ''}</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  {['Usuario', 'Correo', 'Matrícula', 'Rol', 'Acciones'].map((h, i) => (
                    <th key={h} style={{
                      padding: '11px 20px', textAlign: i === 4 ? 'center' : 'left',
                      fontSize: 11, fontWeight: 600, color: '#888780',
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      background: '#FAFAF8',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id} style={{
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    <td style={{ padding: '13px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar nombre={user.nombre} apellidos={user.apellidos} />
                        <span style={{ fontWeight: 500, color: '#2C2C2A' }}>
                          {user.nombre} {user.apellidos}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 20px', color: '#5F5E5A' }}>{user.email}</td>
                    <td style={{ padding: '13px 20px' }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 13, color: '#5F5E5A',
                        background: '#F1EFE8', padding: '2px 8px', borderRadius: 5,
                      }}>{user.matricula}</span>
                    </td>
                    <td style={{ padding: '13px 20px' }}>
                      <select
                        value={user.rol}
                        onChange={e => handleRoleChange(user._id, e.target.value)}
                        style={{
                          borderRadius: 7,
                          padding: '5px 10px', fontSize: 13,
                          fontFamily: 'inherit', background: '#fff',
                          color: '#2C2C2A', cursor: 'pointer', outline: 'none',
                        }}
                      >
                        <option value="basico">Básico</option>
                        <option value="contador">Contador</option>
                        <option value="abogado">Abogado</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={{ padding: '13px 20px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        style={{
                          background: 'none',
                          borderRadius: 7, padding: '5px 12px',
                          fontSize: 13, color: '#A32D2D', cursor: 'pointer',
                          fontFamily: 'inherit', fontWeight: 500,
                          transition: 'background 0.15s, border-color 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FCEBEB'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#B4B2A9', fontSize: 14 }}>
                      No hay usuarios registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <FormViewer />
      </div>
    </div>
  );
}