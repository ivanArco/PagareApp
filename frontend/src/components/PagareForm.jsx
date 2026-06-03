import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

export default function PagareForm({ onSuccess }) {
  const { token } = useAuth();
  const [usuariosBasicos, setUsuariosBasicos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tipoDeudor, setTipoDeudor] = useState('existente'); // 'existente' o 'nuevo'
  const [form, setForm] = useState({
    deudorId: '',
    nuevoDeudor: {
      nombre: '',
      apellidos: '',
      email: '',
      direccion: '',
      telefono: '',
      poblacion: '',
      password: ''
    },
    lugarExpedicion: '',
    monto: '',
    fechaPago: '',
    lugarPago: '',
    interesMoratorio: '',
    beneficiario: '',
    acepto: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBasicos = async () => {
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:5000/api/pagares/usuarios-basicos', {
          headers: { 'x-auth-token': token }
        });
        setUsuariosBasicos(res.data);
      } catch (err) {
        console.error('Error cargando deudores básicos:', err);
        setError('No se pudieron cargar los deudores. Refresca la página o inicia sesión de nuevo.');
      }
    };
    fetchBasicos();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('nuevoDeudor.')) {
      const field = name.split('.')[1];
      setForm({
        ...form,
        nuevoDeudor: { ...form.nuevoDeudor, [field]: value }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCheck = (e) => {
    setForm({ ...form, acepto: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const payload = {
        lugarExpedicion: form.lugarExpedicion,
        monto: Number(form.monto),
        fechaPago: form.fechaPago,
        lugarPago: form.lugarPago,
        interesMoratorio: Number(form.interesMoratorio),
        beneficiario: form.beneficiario,
        acepto: form.acepto
      };
      if (tipoDeudor === 'existente') {
        if (!form.deudorId) {
          throw new Error('Selecciona un deudor existente antes de enviar.');
        }
        payload.deudorId = form.deudorId;
      } else {
        payload.nuevoDeudor = form.nuevoDeudor;
      }
      const res = await axios.post('http://localhost:5000/api/pagares', payload, {
        headers: { 'x-auth-token': token || localStorage.getItem('token') }
      });
      setSuccess('Pagaré creado exitosamente.');
      setForm({
        deudorId: '',
        nuevoDeudor: { nombre: '', apellidos: '', email: '', direccion: '', telefono: '', poblacion: '', password: '' },
        lugarExpedicion: '',
        monto: '',
        fechaPago: '',
        lugarPago: '',
        interesMoratorio: '',
        beneficiario: '',
        acepto: false
      });
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      const message = err.response?.data?.msg || err.message || 'Error al crear pagaré';
      const details = err.response?.data?.details;
      const detailMessage = details
        ? Object.values(details).map(d => d.message).join(' ') : '';
      setError(`${message}${detailMessage ? ' - ' + detailMessage : ''}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {(error || success) && (
          <div className="space-y-3">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex items-start gap-3">
                <span className="text-xl">❌</span>
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3">
                <span className="text-xl">✓</span>
                <p>{success}</p>
              </div>
            )}
          </div>
        )}

        {/* Selector de tipo de deudor */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <label className="block text-sm font-semibold text-gray-900 mb-4">Tipo de Deudor</label>
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                value="existente" 
                checked={tipoDeudor === 'existente'} 
                onChange={() => setTipoDeudor('existente')}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Seleccionar deudor existente</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="radio" 
                value="nuevo" 
                checked={tipoDeudor === 'nuevo'} 
                onChange={() => setTipoDeudor('nuevo')}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Registrar nuevo deudor</span>
            </label>
          </div>
        </div>

        {/* Deudor existente o nuevo */}
        {tipoDeudor === 'existente' ? (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Deudor (usuario básico) *</label>
            <select
              name="deudorId"
              value={form.deudorId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione un deudor</option>
              {usuariosBasicos.map(u => (
                <option key={u._id} value={u._id}>{u.nombre} {u.apellidos} - {u.email}</option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Datos del Nuevo Deudor</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" name="nuevoDeudor.nombre" placeholder="Nombre *" value={form.nuevoDeudor.nombre} onChange={handleChange} required className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="nuevoDeudor.apellidos" placeholder="Apellidos *" value={form.nuevoDeudor.apellidos} onChange={handleChange} required className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
              <input type="email" name="nuevoDeudor.email" placeholder="Correo electrónico *" value={form.nuevoDeudor.email} onChange={handleChange} required className="col-span-2 sm:col-span-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="nuevoDeudor.direccion" placeholder="Dirección" value={form.nuevoDeudor.direccion} onChange={handleChange} className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="nuevoDeudor.telefono" placeholder="Teléfono" value={form.nuevoDeudor.telefono} onChange={handleChange} className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
              <input type="text" name="nuevoDeudor.poblacion" placeholder="Población" value={form.nuevoDeudor.poblacion} onChange={handleChange} className="col-span-2 sm:col-span-1 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
              <input type="password" name="nuevoDeudor.password" placeholder="Contraseña (dejar vacío para 'cambiar123')" value={form.nuevoDeudor.password} onChange={handleChange} className="col-span-2 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
            </div>
            <p className="text-xs text-blue-700 italic">* El usuario será creado con rol básico. Si no escribe contraseña, se usará "cambiar123".</p>
          </div>
        )}

        {/* Datos del pagaré */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 text-lg">Datos del Pagaré</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="text" name="lugarExpedicion" placeholder="Lugar de expedición *" value={form.lugarExpedicion} onChange={handleChange} required className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
            <input type="number" step="0.01" name="monto" placeholder="Monto ($) *" value={form.monto} onChange={handleChange} required className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
            <input type="date" name="fechaPago" value={form.fechaPago} onChange={handleChange} required className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="lugarPago" placeholder="Lugar de pago *" value={form.lugarPago} onChange={handleChange} required className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
            <input type="number" step="0.1" name="interesMoratorio" placeholder="Interés moratorio (% mensual) *" value={form.interesMoratorio} onChange={handleChange} required className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="beneficiario" placeholder="Beneficiario (a la orden de) *" value={form.beneficiario} onChange={handleChange} required className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Aceptación */}
        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer border border-gray-200">
          <input type="checkbox" id="acepto" checked={form.acepto} onChange={handleCheck} required className="w-5 h-5" />
          <span className="text-gray-700">Acepto las condiciones (firma simulada)</span>
        </label>

        {/* Botón enviar */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '⏳ Guardando...' : '✓ Crear Pagaré'}
        </button>
      </form>
    </div>
  );
}