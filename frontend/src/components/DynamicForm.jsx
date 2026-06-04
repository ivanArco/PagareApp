import { useState } from 'react';

const fieldsByRole = {
  basico: [
    { name: 'asunto', label: 'Asunto', type: 'text', required: true, placeholder: 'Ej. Consulta sobre contrato' },
    { name: 'descripcion', label: 'Descripción', type: 'textarea', placeholder: 'Detalle brevemente el asunto…' },
  ],
  contador: [
    { name: 'factura', label: 'Número de factura', type: 'text', placeholder: 'FAC-000001' },
    { name: 'monto', label: 'Monto (MXN)', type: 'number', placeholder: '0.00' },
  ],
  abogado: [
    { name: 'expediente', label: 'Expediente', type: 'text', placeholder: 'EXP-2026-001' },
    { name: 'cliente', label: 'Cliente', type: 'text', placeholder: 'Nombre completo' },
    { name: 'fecha_audiencia', label: 'Fecha de audiencia', type: 'date' },
  ],
  admin: [
    { name: 'reporte', label: 'Reporte interno', type: 'textarea', placeholder: 'Redacte el reporte…' },
  ],
};

const base = {
  width: '100%',
  border: 'none',
  borderRadius: 9,
  padding: '10px 13px',
  fontSize: 14,
  fontFamily: "'DM Sans', system-ui, sans-serif",
  background: '#FAFAF8',
  color: '#2C2C2A',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s, background 0.15s',
};

function Field({ field, onChange }) {
  const [focused, setFocused] = useState(false);
  const style = {
    ...base,
    borderColor: focused ? '#185FA5' : '#D3D1C7',
    background: focused ? '#fff' : '#FAFAF8',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: '#888780',
        letterSpacing: '0.05em', textTransform: 'uppercase',
      }}>
        {field.label}
        {field.required && <span style={{ color: '#A32D2D', marginLeft: 3 }}>*</span>}
      </label>

      {field.type === 'textarea' ? (
        <textarea
          name={field.name}
          onChange={onChange}
          rows={3}
          placeholder={field.placeholder || ''}
          required={field.required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...style, resize: 'none', lineHeight: 1.6 }}
        />
      ) : (
        <input
          type={field.type}
          name={field.name}
          onChange={onChange}
          required={field.required}
          placeholder={field.placeholder || ''}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={style}
        />
      )}
    </div>
  );
}

export default function DynamicForm({ userRole }) {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Formulario simulado (rol: ${userRole})\nDatos: ${JSON.stringify(formData, null, 2)}`);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const currentFields = fieldsByRole[userRole] || fieldsByRole.basico;

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {currentFields.map((field) => (
          <Field key={field.name} field={field} onChange={handleChange} />
        ))}

        <div style={{ paddingTop: 4 }}>
          <button
            type="submit"
            style={{
              padding: '10px 22px',
              background: submitted ? '#3B6D11' : '#0C447C',
              color: '#fff',
              border: 'none',
              borderRadius: 9,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
              transition: 'background 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
            }}
            onMouseEnter={e => { if (!submitted) e.currentTarget.style.background = '#042C53'; }}
            onMouseLeave={e => { if (!submitted) e.currentTarget.style.background = '#0C447C'; }}
          >
            {submitted ? '✓ Guardado' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}