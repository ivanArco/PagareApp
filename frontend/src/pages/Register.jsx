import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 px-8 py-8 text-center">
          <div className="text-4xl mb-3">⚖️</div>
          <h1 className="text-2xl font-bold text-white tracking-tight">LexDespacho</h1>
          <p className="text-blue-300 text-sm mt-1">Sistema de Gestión Legal</p>
        </div>

        <div className="p-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Crear cuenta</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={e => setForm({...form, nombre: e.target.value})}
                  required
                  className="w-full rounded-lg px-3 py-2.5 bg-gray-100 focus:outline-none focus:bg-white transition text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Apellidos</label>
                <input
                  type="text"
                  value={form.apellidos}
                  onChange={e => setForm({...form, apellidos: e.target.value})}
                  required
                  className="w-full rounded-lg px-3 py-2.5 bg-gray-100 focus:outline-none focus:bg-white transition text-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Correo electrónico</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                className="w-full rounded-lg px-4 py-2.5 bg-gray-100 focus:outline-none focus:bg-white transition text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
                className="w-full rounded-lg px-4 py-2.5 bg-gray-100 focus:outline-none focus:bg-white transition text-gray-900"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-2.5 rounded-lg font-semibold transition shadow-md hover:shadow-lg mt-1"
            >
              Crear cuenta
            </button>
          </form>

          <div className="mt-6 pt-5 text-center text-sm">
            <span className="text-gray-500">¿Ya tienes cuenta? </span>
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition">Iniciar sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}