import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ nombre: '', apellidos: '', email: '', password: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch {
      alert('Error al registrar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Registro de nuevo usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required className="w-full border rounded px-3 py-2" />
          <input type="text" placeholder="Apellidos" value={form.apellidos} onChange={e => setForm({...form, apellidos: e.target.value})} required className="w-full border rounded px-3 py-2" />
          <input type="email" placeholder="Correo electrónico" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full border rounded px-3 py-2" />
          <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="w-full border rounded px-3 py-2" />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Registrarse</button>
        </form>
      </div>
    </div>
  );
}