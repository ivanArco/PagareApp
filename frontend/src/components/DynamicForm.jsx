import { useState } from 'react';

export default function DynamicForm({ userRole }) {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Formulario simulado (rol: ${userRole})\nDatos: ${JSON.stringify(formData, null, 2)}`);
    // Aquí en el futuro se enviaría a la BD
  };

  const fieldsByRole = {
    basico: [
      { name: 'asunto', label: 'Asunto', type: 'text', required: true },
      { name: 'descripcion', label: 'Descripción', type: 'textarea' },
    ],
    contador: [
      { name: 'factura', label: 'Número de factura', type: 'text' },
      { name: 'monto', label: 'Monto (MXN)', type: 'number' },
    ],
    abogado: [
      { name: 'expediente', label: 'Expediente', type: 'text' },
      { name: 'cliente', label: 'Cliente', type: 'text' },
      { name: 'fecha_audiencia', label: 'Fecha audiencia', type: 'date' },
    ],
    admin: [
      { name: 'reporte', label: 'Reporte interno', type: 'textarea' },
    ],
  };

  const currentFields = fieldsByRole[userRole] || fieldsByRole.basico;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Formulario {userRole}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {currentFields.map((field) => (
          <div key={field.name}>
            <label className="block text-gray-700 font-medium">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea name={field.name} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" rows="3" />
            ) : (
              <input type={field.type} name={field.name} onChange={handleChange} required={field.required} className="w-full border rounded px-3 py-2 mt-1" />
            )}
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Guardar (simulado)</button>
      </form>
    </div>
  );
}