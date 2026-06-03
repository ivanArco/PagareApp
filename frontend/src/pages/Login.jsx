import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Acceso al Despacho</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Correo electrónico" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border rounded px-3 py-2 mb-4" />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border rounded px-3 py-2 mb-4" />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ingresar</button>
        </form>
        <div className="mt-4 text-center space-x-2">
          <Link to="/register" className="text-blue-600 hover:underline">Registrarse</Link>
          <span>|</span>
          <Link to="/forgot-password" className="text-blue-600 hover:underline">¿Olvidó su contraseña?</Link>
        </div>
      </div>
    </div>
  );
}