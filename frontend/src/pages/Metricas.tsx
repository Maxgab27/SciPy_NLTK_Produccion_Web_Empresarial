import React, { useState, useEffect } from 'react';

interface Punto { mes: string; ventas: number; tipo: 'real' | 'estimado'; }
interface Metricas { media: number; desviacion_estandar: number; mediana: number; varianza?: number; coeficiente_variacion?: number; }

const DEMO_PUNTOS: Punto[] = [
  { mes: 'Ene', ventas: 12000, tipo: 'real' },
  { mes: 'Feb', ventas: 13250, tipo: 'estimado' },
  { mes: 'Mar', ventas: 14500, tipo: 'real' },
  { mes: 'Abr', ventas: 15000, tipo: 'real' },
  { mes: 'May', ventas: 16500, tipo: 'estimado' },
  { mes: 'Jun', ventas: 18000, tipo: 'real' },
];
const DEMO_MET: Metricas = { media: 17.2, desviacion_estandar: 4.29, mediana: 17.5, varianza: 18.4, coeficiente_variacion: 24.94 };

export default function Metricas() {
  const [puntos, setPuntos]   = useState<Punto[]>([]);
  const [met, setMet]         = useState<Metricas | null>(null);
  const [online, setOnline]   = useState<boolean | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/scipy/interpolacion').then((r) => r.json()),
      fetch('/api/metricas-atencion').then((r) => r.json()),
    ])
      .then(([d1, d2]) => {
        setPuntos(d1.puntos ?? []);
        setMet(d2);
        setOnline(true);
      })
      .catch(() => {
        setPuntos(DEMO_PUNTOS);
        setMet(DEMO_MET);
        setOnline(false);
      });
  }, []);

  const maxV = Math.max(...puntos.map((p) => p.ventas), 1);
  const BAR_H = 140;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={pageHeader}>
        <div>
          <h2 style={h2}>Metricas e Interpolacion — SciPy</h2>
          <p style={sub}>Ejercicio 1: estadistica descriptiva · Ejercicio 3: interpolacion lineal</p>
        </div>
        <StatusBadge online={online} />
      </header>

      {/* Ejercicio 1 — estadistica */}
      <section>
        <SectionTitle title="Ejercicio 1 — Estadistica de Tiempos de Atencion" badge="scipy.stats" />
        <p style={desc}>Datos: [12, 15, 18, 20, 11, 25, 19, 17, 14, 21] minutos</p>
        <div style={grid4}>
          <StatCard label="Media"              value={`${met?.media ?? '-'} min`}           code="np.mean(tiempos)"   />
          <StatCard label="Desviacion Estandar" value={`${met?.desviacion_estandar ?? '-'} min`} code="np.std(ddof=1)"    />
          <StatCard label="Mediana"             value={`${met?.mediana ?? '-'} min`}          code="np.median(tiempos)" />
          <StatCard label="Varianza"            value={`${met?.varianza ?? '-'}`}             code="np.var(ddof=1)"    />
        </div>
        {met?.coeficiente_variacion !== undefined && (
          <div style={{ ...card, marginTop: '1rem', fontSize: '0.85rem', color: '#334155' }}>
            <strong>Interpretacion:</strong> Coeficiente de variacion = {met.coeficiente_variacion}%.{' '}
            {met.coeficiente_variacion < 20 ? 'Servicio estable — baja variabilidad.' : 'Variabilidad moderada — revisar tiempos atipicos.'}
          </div>
        )}
      </section>

      {/* Ejercicio 3 — interpolacion */}
      <section>
        <SectionTitle title="Ejercicio 3 — Interpolacion de Ventas Mensuales" badge="scipy.interpolate.interp1d" />
        <p style={desc}>Datos reales: enero, marzo, abril, junio. Meses estimados (febrero y mayo) calculados con interp1d(kind='linear').</p>

        {/* Grafica SVG */}
        <div style={card}>
          <svg width="100%" viewBox={`0 0 ${puntos.length * 80} ${BAR_H + 40}`} style={{ overflow: 'visible' }}>
            {puntos.map((p, i) => {
              const barH = (p.ventas / maxV) * BAR_H;
              const x = i * 80 + 20;
              const y = BAR_H - barH + 10;
              const color = p.tipo === 'real' ? '#0f172a' : '#94a3b8';
              return (
                <g key={p.mes}>
                  <rect x={x} y={y} width={40} height={barH} fill={color} rx={3} />
                  <text x={x + 20} y={y - 4} textAnchor="middle" fontSize="10" fill="#334155">{(p.ventas / 1000).toFixed(1)}k</text>
                  <text x={x + 20} y={BAR_H + 25} textAnchor="middle" fontSize="11" fill={p.tipo === 'estimado' ? '#64748b' : '#0f172a'} fontWeight={p.tipo === 'real' ? 600 : 400}>{p.mes}</text>
                </g>
              );
            })}
          </svg>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.78rem' }}>
            <span><span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#0f172a', borderRadius: 2, marginRight: 4, verticalAlign: 'middle' }} />Dato real</span>
            <span><span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: '#94a3b8', borderRadius: 2, marginRight: 4, verticalAlign: 'middle' }} />Estimado (interp1d)</span>
          </div>
        </div>

        {/* Tabla */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b', textAlign: 'left' }}>
              <th style={th}>Mes</th><th style={th}>Ventas (S/)</th><th style={th}>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {puntos.map((p) => (
              <tr key={p.mes} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={td}><strong>{p.mes}</strong></td>
                <td style={td}>S/ {p.ventas.toLocaleString()}</td>
                <td style={td}>
                  <span style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '3px', backgroundColor: p.tipo === 'real' ? '#f0fdf4' : '#f8fafc', color: p.tipo === 'real' ? '#166534' : '#64748b', border: '1px solid', borderColor: p.tipo === 'real' ? '#bbf7d0' : '#e2e8f0' }}>
                    {p.tipo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function StatCard({ label, value, code }: { label: string; value: string; code?: string }) {
  return (
    <div style={card}>
      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>{label}</span>
      <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', display: 'block', margin: '0.2rem 0' }}>{value}</span>
      {code && <code style={{ fontSize: '0.7rem', color: '#0284c7', fontFamily: 'monospace' }}>{code}</code>}
    </div>
  );
}

function StatusBadge({ online }: { online: boolean | null }) {
  return <span style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: online ? '#f0fdf4' : '#f8fafc', color: online ? '#166534' : '#475569' }}>{online === null ? 'Conectando...' : online ? 'Backend Activo' : 'Demostracion'}</span>;
}

function SectionTitle({ title, badge }: { title: string; badge: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{title}</h3>
      <code style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{badge}</code>
    </div>
  );
}

const card: React.CSSProperties = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', boxSizing: 'border-box' };
const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' };
const pageHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' };
const h2: React.CSSProperties = { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' };
const sub: React.CSSProperties = { margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#64748b' };
const desc: React.CSSProperties = { fontSize: '0.82rem', color: '#64748b', margin: '0 0 0.75rem' };
const th: React.CSSProperties = { padding: '0.4rem', fontWeight: 600 };
const td: React.CSSProperties = { padding: '0.4rem' };
