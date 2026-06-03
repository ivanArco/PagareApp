export default function FormViewer() {
  // Mock de formularios enviados (solo visual)
  const formsMock = [
    { id: 1, tipo: 'abogado', creado: '2025-01-15', datos: 'Expediente: 1234, Cliente: Pérez' },
    { id: 2, tipo: 'contador', creado: '2025-01-16', datos: 'Factura: F-001, Monto: 5000' },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Formularios registrados (demo)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Tipo</th>
              <th className="py-2 px-4 text-left">Fecha</th>
              <th className="py-2 px-4 text-left">Contenido</th>
            </tr>
          </thead>
          <tbody>
            {formsMock.map(form => (
              <tr key={form.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{form.id}</td>
                <td className="py-2 px-4">{form.tipo}</td>
                <td className="py-2 px-4">{form.creado}</td>
                <td className="py-2 px-4">{form.datos}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-gray-500 mt-3">* Vista estática - sin conexión a la base de datos aún</p>
      </div>
    </div>
  );
}