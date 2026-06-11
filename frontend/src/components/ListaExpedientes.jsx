import { useState, useEffect } from 'react';
import api from '../services/api';

export default function ListaExpedientes() {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

  const cargarExpedientes = async () => {
    try {
      const res = await api.get('/expedientes');
      setExpedientes(res.data);
    } catch (error) {
      console.error('Error cargando expedientes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await cargarExpedientes();
    })();
  }, []);

  const getEstadoColor = (estado) => {
    const colores = {
      activo: 'bg-green-100 text-green-800',
      pagado: 'bg-blue-100 text-blue-800',
      vencido: 'bg-red-100 text-red-800',
      cancelado: 'bg-gray-100 text-gray-800',
      en_proceso: 'bg-yellow-100 text-yellow-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center p-8">Cargando expedientes...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">
          📁 Expedientes Registrados
        </h2>
        
        {expedientes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No hay expedientes registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 border text-left">No. Expediente</th>
                  <th className="px-4 py-3 border text-left">Abogado</th>
                  <th className="px-4 py-3 border text-left">Deudor</th>
                  <th className="px-4 py-3 border text-right">Monto Total</th>
                  <th className="px-4 py-3 border text-center">Estado</th>
                  <th className="px-4 py-3 border text-center">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {expedientes.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setExpedienteSeleccionado(exp)}>
                    <td className="px-4 py-3 border font-mono text-sm">{exp.noExpediente}</td>
                    <td className="px-4 py-3 border">{exp.abogado?.nombre || exp.abogado?.id?.nombre || 'N/A'}</td>
                    <td className="px-4 py-3 border">{exp.deudor?.nombre} {exp.deudor?.apellidos}</td>
                    <td className="px-4 py-3 border text-right font-semibold">${exp.montoTotal?.toFixed(2)}</td>
                    <td className="px-4 py-3 border text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(exp.estadoGeneral)}`}>
                        {exp.estadoGeneral}
                      </span>
                    </td>
                    <td className="px-4 py-3 border text-center text-sm">
                      {new Date(exp.fechaCreacion).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Detalle del Expediente */}
      {expedienteSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Expediente {expedienteSeleccionado.noExpediente}</h3>
              <button onClick={() => setExpedienteSeleccionado(null)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="p-6">
              {/* Información General */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Abogado</p>
                  <p className="font-semibold">{expedienteSeleccionado.abogado?.nombre || 'N/A'}</p>
                  <p className="text-xs text-gray-500">Matrícula: {expedienteSeleccionado.abogado?.matricula}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Deudor</p>
                  <p className="font-semibold">{expedienteSeleccionado.deudor?.nombre} {expedienteSeleccionado.deudor?.apellidos}</p>
                  <p className="text-xs text-gray-500">{expedienteSeleccionado.deudor?.correo}</p>
                </div>
              </div>
              
              {/* Datos del Prestamista */}
              <div className="bg-blue-50 p-4 rounded mb-6">
                <h4 className="font-semibold mb-2">🏦 Datos del Prestamista</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><strong>Nombre:</strong> {expedienteSeleccionado.prestamista?.nombre} {expedienteSeleccionado.prestamista?.apellidos}</p>
                  <p><strong>Correo:</strong> {expedienteSeleccionado.prestamista?.correo}</p>
                  <p><strong>Teléfono:</strong> {expedienteSeleccionado.prestamista?.telefono}</p>
                  <p><strong>Identificación:</strong> {expedienteSeleccionado.prestamista?.identificacion}</p>
                  <p className="col-span-2"><strong>Dirección:</strong> {expedienteSeleccionado.prestamista?.direccion}</p>
                </div>
              </div>
              
              {/* Pagarés */}
              <h4 className="font-semibold mb-3">📋 Pagarés</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 border">N°</th>
                      <th className="px-3 py-2 border text-right">Monto</th>
                      <th className="px-3 py-2 border">Vencimiento</th>
                      <th className="px-3 py-2 border text-right">Saldo</th>
                      <th className="px-3 py-2 border">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expedienteSeleccionado.pagares?.map((p, idx) => (
                      <tr key={idx}>
                        <td className="px-3 py-2 border text-center">{p.numero}</td>
                        <td className="px-3 py-2 border text-right">${p.monto?.toFixed(2)}</td>
                        <td className="px-3 py-2 border text-center">{new Date(p.fechaVencimiento).toLocaleDateString()}</td>
                        <td className="px-3 py-2 border text-right">${p.saldo?.toFixed(2)}</td>
                        <td className="px-3 py-2 border text-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            p.estado === 'pagado' ? 'bg-green-100 text-green-800' :
                            p.estado === 'vencido' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {p.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {expedienteSeleccionado.notasAdicionales && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600 mb-1">Notas Adicionales:</p>
                  <p className="text-sm">{expedienteSeleccionado.notasAdicionales}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}