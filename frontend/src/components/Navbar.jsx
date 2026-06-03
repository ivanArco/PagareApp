import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">⚖️</span>
            <span className="text-xl font-semibold text-white hidden sm:inline">LexDespacho</span>
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span className="text-gray-100 text-sm sm:text-base">Hola, <span className="font-semibold">{user.nombre}</span></span>
                {user.rol === 'admin' && (
                  <Link to="/admin" className="text-amber-300 hover:text-amber-200 font-medium transition">Admin</Link>
                )}
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium">
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}