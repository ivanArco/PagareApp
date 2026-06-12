import { useState, useEffect } from 'react';
import api from '../services/api';

const ESTADO_CONFIG = {
  activo:     { color: '#166534', bg: '#dcfce7', label: 'Activo' },
  pagado:     { color: '#1e40af', bg: '#dbeafe', label: 'Pagado' },
  vencido:    { color: '#991b1b', bg: '#fee2e2', label: 'Vencido' },
  cancelado:  { color: '#374151', bg: '#f3f4f6', label: 'Cancelado' },
  en_proceso: { color: '#92400e', bg: '#fef3c7', label: 'En proceso' },
};

function Badge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.cancelado;
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      padding: '3px 10px', borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: .3
    }}>
      {cfg.label}
    </span>
  );
}

function ProgressBar({ pagares = [] }) {
  const total = pagares.reduce((s, p) => s + (p.monto || 0), 0);
  const pagado = pagares.reduce((s, p) => s + ((p.monto || 0) - (p.saldo || 0)), 0);
  const pct = total > 0 ? Math.min((pagado / total) * 100, 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b7280', marginBottom: 4 }}>
        <span>Pagado: ${pagado.toFixed(2)}</span>
        <span>{pct.toFixed(0)}%</span>
      </div>
      <div style={{ background: '#e5e7eb', borderRadius: 6, height: 7, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`, height: '100%', borderRadius: 6,
          background: pct >= 100 ? '#16a34a' : pct > 50 ? '#2563eb' : '#f59e0b',
          transition: 'width .4s'
        }} />
      </div>
    </div>
  );
}

function Modal({ exp, onClose }) {
  const cfg = ESTADO_CONFIG[exp.estadoGeneral] || ESTADO_CONFIG.cancelado;
  const totalPagado = exp.pagares?.reduce((s, p) => s + ((p.monto || 0) - (p.saldo || 0)), 0) || 0;
  const saldoPendiente = (exp.montoTotal || 0) - totalPagado;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, zIndex: 50
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 760,
        maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,.25)'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          position: 'sticky', top: 0, background: '#fff',
          borderBottom: '1px solid #e5e7eb', padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>📁</span>
            <div>
              <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase' }}>Expediente</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#111827', fontFamily: 'monospace' }}>{exp.noExpediente}</div>
            </div>
            <Badge estado={exp.estadoGeneral} />
          </div>
          <button onClick={onClose} style={{
            background: '#f3f4f6', border: 'none', borderRadius: 8,
            width: 32, height: 32, fontSize: 18, cursor: 'pointer', color: '#6b7280'
          }}>×</button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Resumen financiero */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { label: 'Monto Total', value: `$${exp.montoTotal?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, color: '#1f2937' },
              { label: 'Pagado', value: `$${totalPagado.toFixed(2)}`, color: '#16a34a' },
              { label: 'Pendiente', value: `$${saldoPendiente.toFixed(2)}`, color: saldoPendiente > 0 ? '#dc2626' : '#16a34a' },
            ].map(item => (
              <div key={item.label} style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4, textTransform: 'uppercase', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>

          <ProgressBar pagares={exp.pagares} />

          {/* Partes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InfoCard icon="⚖️" title="Abogado" lines={[
              `${exp.abogado?.nombre || ''} ${exp.abogado?.apellidos || ''}`.trim() || 'N/A',
              `Matrícula: ${exp.abogado?.matricula || 'N/A'}`
            ]} />
            <InfoCard icon="👤" title="Deudor" lines={[
              `${exp.deudor?.nombre || ''} ${exp.deudor?.apellidos || ''}`.trim() || 'N/A',
              exp.deudor?.correo || ''
            ]} />
          </div>

          <InfoCard icon="🏦" title="Prestamista" lines={[
            `${exp.prestamista?.nombre || ''} ${exp.prestamista?.apellidos || ''}`.trim(),
            `Tel: ${exp.prestamista?.telefono || 'N/A'}  •  ${exp.prestamista?.correo || ''}`,
            `ID: ${exp.prestamista?.identificacion || 'N/A'}`,
            exp.prestamista?.direccion || ''
          ]} />

          {/* Tabla pagarés */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>📋 Pagarés ({exp.pagares?.length || 0})</div>
            <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid #e5e7eb' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: '#f9fafb' }}>
                    {['N°', 'Monto', 'Vencimiento', 'Saldo', 'Estado'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: h === 'N°' ? 'center' : h === 'Monto' || h === 'Saldo' ? 'right' : 'left', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {exp.pagares?.map((p, i) => {
                    const vencido = new Date(p.fechaVencimiento) < new Date() && p.estado !== 'pagado';
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #f3f4f6', background: vencido ? '#fff7f7' : 'transparent' }}>
                        <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 700 }}>{p.numero}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>${p.monto?.toFixed(2)}</td>
                        <td style={{ padding: '10px 12px', color: vencido ? '#dc2626' : '#374151' }}>{new Date(p.fechaVencimiento).toLocaleDateString('es-MX')}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: p.saldo > 0 ? '#dc2626' : '#16a34a' }}>${p.saldo?.toFixed(2)}</td>
                        <td style={{ padding: '10px 12px' }}><Badge estado={p.estado === 'pendiente' && vencido ? 'vencido' : p.estado} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {exp.notasAdicionales && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', marginBottom: 4 }}>NOTAS</div>
              <div style={{ fontSize: 13, color: '#78350f' }}>{exp.notasAdicionales}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, lines }) {
  return (
    <div style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 16px' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 6 }}>{icon} {title}</div>
      {lines.filter(Boolean).map((l, i) => (
        <div key={i} style={{ fontSize: i === 0 ? 14 : 12, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#111827' : '#6b7280', marginBottom: 2 }}>{l}</div>
      ))}
    </div>
  );
}

export default function ListaExpedientes() {
  const [expedientes, setExpedientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState(null);

  const cargarExpedientes = async () => {
    try {
      const res = await api.get('/expedientes');
      setExpedientes(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Error al cargar expedientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarExpedientes(); }, []);

  const filtrados = expedientes.filter(exp => {
    const texto = busqueda.toLowerCase();
    const coincide = !texto ||
      exp.noExpediente?.toLowerCase().includes(texto) ||
      exp.deudor?.nombre?.toLowerCase().includes(texto) ||
      exp.deudor?.apellidos?.toLowerCase().includes(texto) ||
      exp.prestamista?.nombre?.toLowerCase().includes(texto);
    const estado = filtroEstado === 'todos' || exp.estadoGeneral === filtroEstado;
    return coincide && estado;
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 48, color: '#6b7280' }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
      Cargando expedientes...
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>

      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#111827' }}>📁 Expedientes</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#9ca3af' }}>{expedientes.length} registro{expedientes.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={cargarExpedientes} style={{
          background: '#f3f4f6', border: 'none', borderRadius: 8,
          padding: '8px 14px', cursor: 'pointer', fontSize: 13, color: '#374151', fontWeight: 600
        }}>↻ Actualizar</button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por deudor, expediente o prestamista..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            flex: 1, minWidth: 220, padding: '10px 14px',
            border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14,
            outline: 'none', background: '#fff'
          }}
        />
        <select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          style={{
            padding: '10px 14px', border: '1px solid #e5e7eb',
            borderRadius: 10, fontSize: 14, background: '#fff', cursor: 'pointer'
          }}
        >
          <option value="todos">Todos los estados</option>
          {Object.entries(ESTADO_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Contenido */}
      {error ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, padding: 20, color: '#dc2626', textAlign: 'center' }}>
          ❌ {error}
        </div>
      ) : filtrados.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗂️</div>
          {busqueda || filtroEstado !== 'todos' ? 'Sin resultados para la búsqueda' : 'No hay expedientes registrados'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtrados.map(exp => {
            const cfg = ESTADO_CONFIG[exp.estadoGeneral] || ESTADO_CONFIG.cancelado;
            return (
              <div
                key={exp._id}
                onClick={() => setExpedienteSeleccionado(exp)}
                style={{
                  background: '#fff', borderRadius: 14, padding: 20,
                  border: `1.5px solid #e5e7eb`, cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,.06)',
                  transition: 'box-shadow .15s, border-color .15s',
                  borderLeft: `4px solid ${cfg.color}`
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)'; e.currentTarget.style.borderColor = cfg.color; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,.06)'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.borderLeftColor = cfg.color; }}
              >
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>No. Expediente</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#111827', fontFamily: 'monospace' }}>{exp.noExpediente}</div>
                  </div>
                  <Badge estado={exp.estadoGeneral} />
                </div>

                {/* Deudor */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 }}>👤 Deudor</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                    {exp.deudor?.nombre} {exp.deudor?.apellidos}
                  </div>
                </div>

                {/* Monto */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 }}>Monto Total</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>
                    ${exp.montoTotal?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>

                {/* Progress */}
                <ProgressBar pagares={exp.pagares} />

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>
                    {new Date(exp.fechaCreacion).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>
                    {exp.pagares?.length || 0} pagaré{(exp.pagares?.length || 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {expedienteSeleccionado && (
        <Modal exp={expedienteSeleccionado} onClose={() => setExpedienteSeleccionado(null)} />
      )}
    </div>
  );
}
