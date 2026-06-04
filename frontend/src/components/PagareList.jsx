import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PagareList({ onSelectPagare }) {
  const [pagares, setPagares] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPagares = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/pagares', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setPagares(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVistaPrevia = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/pagares/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      // Notifica al padre para que abra la pestaña
      if (typeof onSelectPagare === 'function') onSelectPagare(res.data);
    } catch (err) {
      alert('Error al cargar el pagaré: ' + (err.response?.data?.msg || err.message));
    }
  };

  useEffect(() => {
    fetchPagares();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">⏳ Cargando pagarés...</div>;

  return (
    <div className="space-y-4">
      {pagares.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">📭 No hay pagarés registrados aún</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Número</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Deudor</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Monto</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Fecha Pago</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Beneficiario</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Expedición</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pagares.map((p, idx) => (
                <tr key={p._id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}>
                  <td className="px-4 py-4 font-mono font-semibold" style={{ color: '#042C53' }}>{p.numero}</td>
                  <td className="px-4 py-4 text-gray-900">{p.nombreDeudor}</td>
                  <td className="px-4 py-4 font-semibold text-gray-900">${p.monto.toFixed(2)}</td>
                  <td className="px-4 py-4 text-gray-600">{new Date(p.fechaPago).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-gray-600">{p.beneficiario}</td>
                  <td className="px-4 py-4 text-gray-600">{new Date(p.fechaExpedicion).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleVistaPrevia(p._id)}
                      className="text-white px-4 py-2 rounded-lg transition font-medium text-sm"
                      style={{ background: '#0C447C' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#042C53'}
                      onMouseLeave={e => e.currentTarget.style.background = '#0C447C'}
                    >
                      👁️ Ver PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}