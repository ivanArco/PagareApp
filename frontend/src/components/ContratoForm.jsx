import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function ContratoForm({ onSuccess }) {
  const { token, user } = useAuth();
  const [deudores, setDeudores] = useState([]);
  const [loadingDeudores, setLoadingDeudores] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    deudorId: '',
    prestamista: {
      nombre: '',
      apellidos: '',
      correo: '',
      telefono: '',
      direccion: '',
      identificacion: ''
    },
    montoTotal: '',
    numPagos: 1,
    notasAdicionales: ''
  });
  const [pagares, setPagares] = useState([]);
  const [loading, setLoading] = useState(false);

  // Verificar si el usuario puede crear expedientes (abogado o admin)
  const esAbogadoAutorizado = ['abogado', 'admin'].includes(user?.rol || user?.role);

  useEffect(() => {
    const fetchDeudores = async () => {
      if (!token) return;
      try {
        setLoadingDeudores(true);
        const res = await axios.get('http://localhost:5000/api/pagares/usuarios-basicos', {
          headers: { 'x-auth-token': token }
        });
        setDeudores(res.data);
      } catch (err) {
        console.error('Error cargando deudores básicos:', err);
        setError('No se pudieron cargar los deudores.');
      } finally {
        setLoadingDeudores(false);
      }
    };
    fetchDeudores();
  }, [token]);

  const generarPagares = () => {
    const montoTotal = parseFloat(formData.montoTotal);
    const numPagos = parseInt(formData.numPagos);
    
    if (!montoTotal || montoTotal <= 0) {
      setError('❌ Ingrese un monto total válido');
      return;
    }
    if (!numPagos || numPagos < 1) {
      setError('❌ Ingrese un número de pagos válido');
      return;
    }

    const montoPorPagare = montoTotal / numPagos;
    const nuevosPagares = [];
    
    for (let i = 1; i <= numPagos; i++) {
      const fechaVencimiento = new Date();
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);
      
      nuevosPagares.push({
        numero: Number(i),
        monto: Number(montoPorPagare.toFixed(2)),
        fechaVencimiento: fechaVencimiento.toISOString().split('T')[0],
        saldo: Number(montoPorPagare.toFixed(2)),
        estado: 'pendiente',
        pagosRealizados: []
      });
    }
    
    setPagares(nuevosPagares);
    setSuccess(`✅ Se generaron ${numPagos} pagaré(s)`);
    setTimeout(() => setSuccess(''), 4000);
  };

  const handlePrestamistaChange = (e) => {
    setFormData({
      ...formData,
      prestamista: { ...formData.prestamista, [e.target.name]: e.target.value }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!esAbogadoAutorizado) {
      setError('❌ Permiso denegado: Tu usuario no cuenta con el rol de Abogado en el sistema.');
      return;
    }
    
    if (!formData.deudorId) {
      setError('❌ Debes seleccionar un deudor');
      return;
    }
    
    if (pagares.length === 0) {
      setError('❌ Debes generar los pagarés primero');
      return;
    }

    const deudorSeleccionado = deudores.find(u => u._id === formData.deudorId);
    if (!deudorSeleccionado) {
      setError('❌ El deudor seleccionado no es válido');
      return;
    }
    
    setLoading(true);
    
    try {
      const expedienteData = {
        deudorId: formData.deudorId,
        prestamista: {
          nombre: formData.prestamista.nombre,
          apellidos: formData.prestamista.apellidos,
          correo: formData.prestamista.correo,
          telefono: formData.prestamista.telefono,
          direccion: formData.prestamista.direccion,
          identificacion: formData.prestamista.identificacion
        },
        montoTotal: Number(formData.montoTotal),
        numPagos: Number(formData.numPagos),
        pagares: pagares,
        notasAdicionales: formData.notasAdicionales || ''
      };
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${API_URL}/expedientes`, expedienteData, {
        headers: { 'x-auth-token': token }
      });
      
      setSuccess(`✅ Expediente creado con éxito`);
      setFormData({
        deudorId: '',
        prestamista: { nombre: '', apellidos: '', correo: '', telefono: '', direccion: '', identificacion: '' },
        montoTotal: '',
        numPagos: 1,
        notasAdicionales: ''
      });
      setPagares([]);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error('❌ Error recibido del Servidor:', err.response?.data);
      const message = err.response?.data?.msg || err.response?.data?.message || err.message || 'Error al crear expediente';
      setError(`❌ Error del Servidor: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 14, padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#2C2C2A' }}>
          📄 Generar Nuevo Contrato/Expediente
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#888780' }}>
          Complete los datos para generar el expediente y sus pagarés asociados
        </p>
      </div>
      
      {/* Mensajes de Alerta */}
      {(error || success || !esAbogadoAutorizado) && (
        <div style={{ marginBottom: 20 }}>
          {!esAbogadoAutorizado && (
            <div style={{
              padding: '12px 16px',
              borderRadius: 10,
              background: '#FFF4E5',
              color: '#663C00',
              fontSize: 14,
              border: '1px solid #FFD399',
              marginBottom: 10
            }}>
              ⚠️ <strong>Atención:</strong> Tu cuenta actual tiene el rol de <u>{user?.rol || user?.role || 'indefinido'}</u>. Necesitas rol de <strong>abogado</strong> para registrar expedientes en el servidor.
            </div>
          )}
          {error && (
            <div style={{
              padding: '12px 16px', id: 'err-box', borderRadius: 10, background: '#FCEBEB', color: '#A32D2D', fontSize: 14, border: '1px solid #F09595'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              padding: '12px 16px', borderRadius: 10, background: '#EAF3DE', color: '#3B6D11', fontSize: 14, border: '1px solid #97C459'
            }}>
              {success}
            </div>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Información del Abogado Ocupando el Sistema */}
        <div style={{
          background: '#F8F7F4', borderRadius: 12, padding: 16, marginBottom: 24, border: '1px solid #E5E3DC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>⚖️</span>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: '#888780' }}>Usuario del Sistema</p>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>
                {user?.nombre} {user?.apellidos} ({user?.rol || user?.role})
              </p>
            </div>
          </div>
          <div style={{ fontSize: 12, color: '#888780' }}>
            Matrícula: {user?.matricula || 'Sin Matrícula'} | Correo: {user?.email || user?.correo}
          </div>
        </div>
        
        {/* Selección de Deudor */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#2C2C2A' }}>Deudor (Cliente) *</label>
          <select name="deudorId" value={formData.deudorId} onChange={handleChange} required style={selectStyle}>
            <option value="">Seleccione un deudor</option>
            {deudores.map(u => (
              <option key={u._id} value={u._id}>{u.nombre} {u.apellidos} - {u.email || u.correo}</option>
            ))}
          </select>
        </div>
        
        {/* Datos del Prestamista */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>🏦 Datos del Prestamista</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input type="text" name="nombre" placeholder="Nombre *" style={inputStyle} value={formData.prestamista.nombre} onChange={handlePrestamistaChange} required />
              <input type="text" name="apellidos" placeholder="Apellidos *" style={inputStyle} value={formData.prestamista.apellidos} onChange={handlePrestamistaChange} required />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input type="email" name="correo" placeholder="Correo electrónico *" style={inputStyle} value={formData.prestamista.correo} onChange={handlePrestamistaChange} required />
              <input type="tel" name="telefono" placeholder="Teléfono *" style={inputStyle} value={formData.prestamista.telefono} onChange={handlePrestamistaChange} required />
            </div>
            <input type="text" name="identificacion" placeholder="Identificación (INE/RFC) *" style={inputStyle} value={formData.prestamista.identificacion} onChange={handlePrestamistaChange} required />
            <input type="text" name="direccion" placeholder="Dirección completa *" style={inputStyle} value={formData.prestamista.direccion} onChange={handlePrestamistaChange} required />
          </div>
        </div>
        
        {/* Información Financiera */}
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>💰 Información Financiera</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#2C2C2A' }}>Monto Total *</label>
              <input type="number" step="0.01" min="0.01" name="montoTotal" style={inputStyle} value={formData.montoTotal} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500, color: '#2C2C2A' }}>Número de Pagos</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" min="1" max="36" name="numPagos" style={{ ...inputStyle, width: 80 }} value={formData.numPagos} onChange={handleChange} />
                <button type="button" onClick={generarPagares} style={{ padding: '10px 16px', background: '#042C53', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>Generar</button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabla de Pagarés */}
        {pagares.length > 0 && (
          <div style={{ marginBottom: 20, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8F7F4' }}>
                  <th style={{ padding: 10, textAlign: 'left' }}>N°</th>
                  <th style={{ padding: 10, textAlign: 'right' }}>Monto</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Vencimiento</th>
                  <th style={{ padding: 10, textAlign: 'center' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pagares.map(p => (
                  <tr key={p.numero} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: 10 }}>{p.numero}</td>
                    <td style={{ padding: 10, textAlign: 'right' }}>${p.monto.toFixed(2)}</td>
                    <td style={{ padding: 10 }}>{p.fechaVencimiento}</td>
                    <td style={{ padding: 10, textAlign: 'center' }}><span style={{ background: '#FCEBEB', color: '#A32D2D', padding: '2px 8px', borderRadius: 20 }}>{p.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Notas */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 500 }}>Notas Adicionales</label>
          <textarea name="notasAdicionales" rows="3" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: 10 }} value={formData.notasAdicionales} onChange={handleChange} placeholder="Condiciones especiales..." />
        </div>
        
        {/* Botón Submit controlado por Rol */}
        <button 
          type="submit" 
          disabled={loading || pagares.length === 0 || loadingDeudores || !esAbogadoAutorizado} 
          style={{ 
            width: '100%', 
            padding: 14, 
            background: loading || pagares.length === 0 || loadingDeudores || !esAbogadoAutorizado ? '#C9C8C4' : '#3B6D11', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 10, 
            fontSize: 15, 
            fontWeight: 600, 
            cursor: loading || pagares.length === 0 || loadingDeudores || !esAbogadoAutorizado ? 'not-allowed' : 'pointer' 
          }}
        >
          {loading ? 'Creando Expediente...' : '✅ Crear Contrato y Expediente'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid #E5E3DC', borderRadius: 10, fontSize: 14, background: '#fff'
};

const selectStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid #E5E3DC', borderRadius: 10, fontSize: 14, background: '#fff', cursor: 'pointer'
};