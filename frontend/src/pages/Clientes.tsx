import React from 'react';

interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  correo: string;
  telefono: string;
  tiempo_promedio_min: number;
  total_atenciones: number;
}

const CLIENTES: Cliente[] = [
  { id: '1', nombre: 'Carlos Mendoza',  empresa: 'Inversiones Norte SAC', correo: 'cmendoza@norte.pe',  telefono: '987-654-321', tiempo_promedio_min: 15, total_atenciones: 8  },
  { id: '2', nombre: 'Mariana Silva',   empresa: 'Consultora Silva E.I.R.L', correo: 'msilva@csv.pe',    telefono: '976-543-210', tiempo_promedio_min: 25, total_atenciones: 5  },
  { id: '3', nombre: 'Roberto Paredes', empresa: 'Distribuidora Paredes',    correo: 'rparedes@dist.pe', telefono: '965-432-109', tiempo_promedio_min: 18, total_atenciones: 12 },
  { id: '4', nombre: 'Ana Torres',      empresa: 'Grupo Torres SAA',         correo: 'atorres@gt.pe',    telefono: '954-321-098', tiempo_promedio_min: 11, total_atenciones: 3  },
];

export default function Clientes() {
  const promedio = (CLIENTES.reduce((s, c) => s + c.tiempo_promedio_min, 0) / CLIENTES.length).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={pageHeader}>
        <div>
          <h2 style={h2}>Directorio de Clientes</h2>
          <p style={sub}>Tiempos de atencion promedio y conteo de atenciones por cliente</p>
        </div>
      </header>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        <div style={kpiCard}>
          <span style={kpiLabel}>Total clientes</span>
          <span style={kpiValue}>{CLIENTES.length}</span>
        </div>
        <div style={kpiCard}>
          <span style={kpiLabel}>Tiempo promedio global</span>
          <span style={kpiValue}>{promedio} min</span>
        </div>
        <div style={kpiCard}>
          <span style={kpiLabel}>Total atenciones</span>
          <span style={kpiValue}>{CLIENTES.reduce((s, c) => s + c.total_atenciones, 0)}</span>
        </div>
      </div>

      {/* Tabla */}
      <div style={card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                <th style={th}>Cliente</th>
                <th style={th}>Empresa</th>
                <th style={th}>Correo</th>
                <th style={th}>Telefono</th>
                <th style={{ ...th, textAlign: 'center' }}>Tiempo Prom.</th>
                <th style={{ ...th, textAlign: 'center' }}>Atenciones</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTES.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={td}><strong style={{ color: '#0f172a' }}>{c.nombre}</strong></td>
                  <td style={{ ...td, color: '#475569' }}>{c.empresa}</td>
                  <td style={{ ...td, color: '#64748b', fontFamily: 'monospace', fontSize: '0.78rem' }}>{c.correo}</td>
                  <td style={{ ...td, color: '#64748b' }}>{c.telefono}</td>
                  <td style={{ ...td, textAlign: 'center', fontWeight: 600, color: c.tiempo_promedio_min > 20 ? '#dc2626' : '#166534' }}>
                    {c.tiempo_promedio_min} min
                  </td>
                  <td style={{ ...td, textAlign: 'center' }}>{c.total_atenciones}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
          Tiempos en rojo indican atencion por encima de 20 minutos (umbral de alerta).
        </p>
      </div>
    </div>
  );
}

const card: React.CSSProperties       = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem 1.25rem', boxSizing: 'border-box' };
const pageHeader: React.CSSProperties  = { borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' };
const h2: React.CSSProperties         = { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' };
const sub: React.CSSProperties        = { margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' };
const kpiCard: React.CSSProperties    = { ...{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.85rem 1rem', boxSizing: 'border-box' as const } };
const kpiLabel: React.CSSProperties   = { fontSize: '0.75rem', color: '#64748b', display: 'block' };
const kpiValue: React.CSSProperties   = { fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', display: 'block', marginTop: '0.2rem' };
const th: React.CSSProperties         = { padding: '0.5rem 0.6rem', fontWeight: 600 };
const td: React.CSSProperties         = { padding: '0.5rem 0.6rem' };
