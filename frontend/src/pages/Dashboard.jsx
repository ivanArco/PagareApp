import { useAuth } from '../contexts/AuthContext';
import DynamicForm from '../components/DynamicForm';
import PagareForm from '../components/PagareForm';
import PagareList from '../components/PagareList';
import { openPagareInNewTab } from '../components/PagareVistaPrevia';

export default function Dashboard() {
  const { user } = useAuth();

  const handleSelectPagare = (pagare) => {
    openPagareInNewTab(pagare);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl shadow-xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">¡Bienvenido, {user?.nombre}! 👋</h1>
            <p className="text-lg opacity-90">
              <span className="font-semibold capitalize">{user?.rol}</span> 
              <span className="mx-2">•</span>
              Matrícula: <span className="font-semibold">{user?.matricula}</span>
            </p>
          </div>
        </div>

        {/* Contenido */}
        {user?.rol === 'abogado' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda: Formularios y lista */}
            <div className="lg:col-span-2 space-y-8">
              {/* Formulario de nuevo pagaré */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    📄 Nuevo Pagaré
                  </h2>
                </div>
                <div className="p-8">
                  <PagareForm onSuccess={() => window.location.reload()} />
                </div>
              </div>

              {/* Lista de pagarés */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    📋 Pagarés Registrados
                  </h2>
                </div>
                <div className="p-8">
                  <PagareList onSelectPagare={handleSelectPagare} />
                </div>
              </div>
            </div>

            {/* Columna derecha: Información */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-6">📌 Información</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <p className="text-sm text-blue-900">
                      <strong>Rol:</strong> {user?.rol === 'abogado' ? '⚖️ Abogado' : user?.rol}
                    </p>
                  </div>
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                    <p className="text-sm text-amber-900">
                      <strong>Estado:</strong> Activo ✓
                    </p>
                  </div>
                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Última actualización: Hoy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
                <h2 className="text-2xl font-bold text-white">📋 Formulario</h2>
              </div>
              <div className="p-8">
                <DynamicForm userRole={user?.rol} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
