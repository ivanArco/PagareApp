const ROL_META = {
  abogado:  { label: 'Abogado',  color: '#3B6D11', bg: '#EAF3DE', border: '#97C45944' },
  contador: { label: 'Contador', color: '#185FA5', bg: '#E6F1FB', border: '#85B7EB44' },
  admin:    { label: 'Admin',    color: '#A32D2D', bg: '#FCEBEB', border: '#F0959544' },
  basico:   { label: 'Básico',   color: '#5F5E5A', bg: '#F1EFE8', border: '#B4B2A944' },
};

const formsMock = [
  { id: 1, tipo: 'abogado',  creado: '2025-01-15', datos: 'Expediente: 1234, Cliente: Pérez' },
  { id: 2, tipo: 'contador', creado: '2025-01-16', datos: 'Factura: F-001, Monto: $5,000' },
];

function RolPill({ tipo }) {
  const m = ROL_META[tipo] || ROL_META.basico;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 99,
      fontSize: 12,
      fontWeight: 600,
      background: m.bg,
      color: m.color,
      letterSpacing: '0.02em',
    }}>
      {m.label}
    </span>
  );
}

export default function FormViewer() {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      overflow: 'hidden',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>📁</span>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>
            Formularios registrados
          </h2>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, color: '#888780',
          background: '#F1EFE8', padding: '3px 10px', borderRadius: 99,
          letterSpacing: '0.03em',
        }}>
          Demo · {formsMock.length} registros
        </span>
      </div>

      {/* Tabla */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              {['ID', 'Tipo', 'Fecha', 'Contenido'].map((h, i) => (
                <th key={h} style={{
                  padding: '10px 20px',
                  textAlign: 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#888780',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  background: '#FAFAF8',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {formsMock.map((form, idx) => (
              <tr
                key={form.id}
                style={{}}
                onMouseEnter={e => e.currentTarget.style.background = '#FAFAF8'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <td style={{ padding: '13px 20px' }}>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    color: '#5F5E5A',
                    background: '#F1EFE8',
                    padding: '2px 8px',
                    borderRadius: 5,
                  }}>#{String(form.id).padStart(3, '0')}</span>
                </td>
                <td style={{ padding: '13px 20px' }}>
                  <RolPill tipo={form.tipo} />
                </td>
                <td style={{ padding: '13px 20px', color: '#888780', fontSize: 13, whiteSpace: 'nowrap' }}>
                  {new Date(form.creado).toLocaleDateString('es-MX', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </td>
                <td style={{ padding: '13px 20px', color: '#5F5E5A', fontSize: 13 }}>
                  {form.datos}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B4B2A9', display: 'inline-block' }} />
        <p style={{ margin: 0, fontSize: 11, color: '#B4B2A9', letterSpacing: '0.02em' }}>
          Vista estática — sin conexión a base de datos
        </p>
      </div>
    </div>
  );
}