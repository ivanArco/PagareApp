import { useAuth } from '../contexts/AuthContext';
import DynamicForm from '../components/DynamicForm';
import PagareForm from '../components/PagareForm';
import PagareList from '../components/PagareList';
import { openPagareInNewTab } from '../components/PagareVistaPrevia';

const ROL_META = {
  abogado:   { label: 'Abogado',   icon: '⚖️',  color: '#3B6D11', bg: '#EAF3DE', border: '#97C459' },
  contador:  { label: 'Contador',  icon: '🧾',  color: '#185FA5', bg: '#E6F1FB', border: '#85B7EB' },
  admin:     { label: 'Admin',     icon: '⚙️',  color: '#A32D2D', bg: '#FCEBEB', border: '#F09595' },
  basico:    { label: 'Básico',    icon: '👤',  color: '#5F5E5A', bg: '#F1EFE8', border: '#B4B2A9' },
};

function RolPill({ rol }) {
  const m = ROL_META[rol] || ROL_META.basico;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 12px', borderRadius: 99,
      fontSize: 12, fontWeight: 600,
      background: m.bg, color: m.color,
      letterSpacing: '0.02em',
    }}>
      {m.icon} {m.label}
    </span>
  );
}

function SectionCard({ icon, title, children, noPad }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>{title}</h2>
      </div>
      <div style={noPad ? {} : { padding: '24px' }}>
        {children}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const meta = ROL_META[user?.rol] || ROL_META.basico;

  const handleSelectPagare = (pagare) => openPagareInNewTab(pagare);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F7F4',
      padding: '40px 0',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
          }}>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 600,
                color: '#042C53',
                fontFamily: "'DM Serif Display', Georgia, serif",
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}>
                Bienvenido, {user?.nombre}
              </h1>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginTop: 10,
              }}>
                <RolPill rol={user?.rol} />
                <span style={{
                  fontSize: 12, color: '#888780',
                  fontFamily: "'DM Mono', monospace",
                  background: '#F1EFE8',
                  padding: '2px 9px', borderRadius: 5,
                }}>#{user?.matricula}</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 12, color: '#3B6D11',
                  background: '#EAF3DE', padding: '2px 9px', borderRadius: 5,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#639922', display: 'inline-block' }} />
                  Activo
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#B4B2A9', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div style={{ height: 1, background: '#E5E3DC', marginTop: 20 }} />
        </div>

        {/* Contenido: vista abogado */}
        {user?.rol === 'abogado' ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>

            {/* Columna principal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <SectionCard icon="📄" title="Nuevo pagaré">
                <PagareForm onSuccess={() => window.location.reload()} />
              </SectionCard>

              <SectionCard icon="📋" title="Pagarés registrados">
                <PagareList onSelectPagare={handleSelectPagare} />
              </SectionCard>
            </div>

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Tarjeta de perfil */}
              <div style={{
                background: '#fff', borderRadius: 14,
                padding: '20px',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: meta.bg, color: meta.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, marginBottom: 12,
                }}>{meta.icon}</div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#2C2C2A' }}>
                  {user?.nombre} {user?.apellidos}
                </p>
                <p style={{ margin: '2px 0 12px', fontSize: 13, color: '#888780' }}>{user?.email}</p>
                <div style={{ height: 1, background: '#F1EFE8', marginBottom: 12 }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { label: 'Rol', value: meta.label },
                    { label: 'Matrícula', value: `#${user?.matricula}` },
                    { label: 'Estado', value: 'Activo' },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                      <span style={{ color: '#888780' }}>{label}</span>
                      <span style={{ fontWeight: 500, color: '#2C2C2A' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Aviso */}
              <div style={{
                borderRadius: 12,
                background: '#E6F1FB',
                padding: '14px 16px',
              }}>
                <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: '#0C447C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Acceso
                </p>
                <p style={{ margin: 0, fontSize: 13, color: '#185FA5', lineHeight: 1.5 }}>
                  Puede crear, consultar e imprimir pagarés desde este panel.
                </p>
              </div>

              <p style={{ margin: 0, fontSize: 11, color: '#B4B2A9', textAlign: 'center', letterSpacing: '0.03em' }}>
                Última actualización: hoy
              </p>
            </div>
          </div>

        ) : (
          /* Vista otros roles */
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <SectionCard icon={meta.icon} title={`Formulario — ${meta.label}`}>
              <DynamicForm userRole={user?.rol} />
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}