import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ── tipos locales ── */
interface Metricas {
  media: number;
  desviacion_estandar: number;
  mediana: number;
  coeficiente_variacion?: number;
  interpretacion?: string;
}
interface Keyword { palabra: string; frecuencia: number; }
interface Comentario {
  id: string;
  cliente_nombre: string;
  fecha: string;
  tiempo_atencion_minutos: number;
  comentario: string;
}

/* ── datos de demostración ── */
const DEMO_METRICAS: Metricas = { media: 17.2, desviacion_estandar: 4.29, mediana: 17.5, coeficiente_variacion: 24.94, interpretacion: 'Variabilidad moderada' };
const DEMO_KEYWORDS: Keyword[] = [{ palabra: 'servicio', frecuencia: 12 }, { palabra: 'atencion', frecuencia: 9 }, { palabra: 'rapido', frecuencia: 7 }, { palabra: 'soporte', frecuencia: 5 }];
const DEMO_COMENTARIOS: Comentario[] = [
  { id: '1', cliente_nombre: 'Carlos Mendoza', fecha: '2026-09-01', tiempo_atencion_minutos: 15, comentario: 'Excelente atencion y soporte rapido.' },
  { id: '2', cliente_nombre: 'Mariana Silva',  fecha: '2026-09-01', tiempo_atencion_minutos: 25, comentario: 'Demora en la entrega del informe.' },
];

const MODULOS = [
  { to: '/metricas',     title: 'Metricas SciPy',  desc: 'Estadistica e Interpolacion — Ejercicios 1 y 3' },
  { to: '/optimizacion', title: 'Optimizacion',     desc: 'Minimizacion de costos — Ejercicio 2' },
  { to: '/comentarios',  title: 'Comentarios',      desc: 'Keywords NLTK — Ejercicio 4' },
  { to: '/analisis-nlp', title: 'Analisis NLP',     desc: 'Clasificacion y Busqueda — Ejercicios 5 y 6' },
  { to: '/clientes',     title: 'Clientes',         desc: 'Directorio y tiempos de atencion' },
  { to: '/reportes',     title: 'Reportes',         desc: 'Informe ejecutivo consolidado' },
];

export default function Dashboard() {
  const [metricas, setMetricas]   = useState<Metricas | null>(null);
  const [keywords, setKeywords]   = useState<Keyword[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [online, setOnline]       = useState<boolean | null>(null);
  const [cliente, setCliente]     = useState('');
  const [tiempo,  setTiempo]      = useState(15);
  const [texto,   setTexto]       = useState('');

  const BASE = '/api';   // Vite proxy -> http://localhost:8000

  const cargar = async () => {
    try {
      const [rM, rK, rC] = await Promise.all([
        fetch(`${BASE}/metricas-atencion`),
        fetch(`${BASE}/comentarios/keywords`),
        fetch(fechaFiltro ? `${BASE}/comentarios?fecha=${fechaFiltro}` : `${BASE}/comentarios`),
      ]);
      if (!rM.ok) throw new Error('offline');
      setMetricas(await rM.json());
      const kd = await rK.json(); setKeywords(kd.keywords ?? []);
      setComentarios(await rC.json());
      setOnline(true);
    } catch {
      setOnline(false);
      setMetricas(DEMO_METRICAS);
      setKeywords(DEMO_KEYWORDS);
      setComentarios(DEMO_COMENTARIOS);
    }
  };

  useEffect(() => { cargar(); }, [fechaFiltro]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Comentario = { id: String(Date.now()), cliente_nombre: cliente, fecha: new Date().toISOString().split('T')[0], tiempo_atencion_minutos: tiempo, comentario: texto };
    try {
      await fetch(`${BASE}/comentarios`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevo) });
    } catch {
      setComentarios((prev) => [nuevo, ...prev]);
    }
    setCliente(''); setTexto(''); setTiempo(15);
    cargar();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Cabecera */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.25rem' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Panel de Control Ejecutivo</p>
          <h2 style={{ margin: '0.2rem 0 0.25rem', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>Centro Inteligente de Atencion</h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>SciPy (calculo numerico) + NLTK (procesamiento de texto) en arquitectura desacoplada.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: online ? '#f0fdf4' : '#f8fafc', color: online ? '#166534' : '#475569', fontWeight: 500 }}>
            {online === null ? 'Conectando...' : online ? 'Backend Activo (:8000)' : 'Modo Demostracion'}
          </span>
          <button onClick={cargar} style={btnDark}>Actualizar</button>
        </div>
      </div>

      {/* 1. Indicadores SciPy — Ejercicio 1 */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={sectionTitle}>1. Indicadores de Tiempos de Atencion — SciPy</h3>
          <code style={badge}>scipy.stats</code>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <KpiCard label="Tiempo Promedio"       value={`${metricas?.media ?? '-'} min`}           code="np.mean(tiempos)" />
          <KpiCard label="Desviacion Estandar"   value={`±${metricas?.desviacion_estandar ?? '-'} min`} code="np.std(ddof=1)" />
          <KpiCard label="Mediana"               value={`${metricas?.mediana ?? '-'} min`}          code="np.median(tiempos)" />
          <KpiCard label="Coef. de Variacion"    value={`${metricas?.coeficiente_variacion ?? '-'}%`} sub={metricas?.interpretacion} />
        </div>
      </section>

      {/* 2. Keywords NLTK — Ejercicio 4 */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={sectionTitle}>2. Terminos Frecuentes en Comentarios — NLTK</h3>
          <code style={badge}>Counter.most_common</code>
        </div>
        <div style={card}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {keywords.map((k) => (
              <span key={k.palabra} style={{ backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.82rem' }}>
                {k.palabra} <strong>({k.frecuencia})</strong>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Reto Final */}
      <section>
        <h3 style={{ ...sectionTitle, marginBottom: '0.75rem' }}>3. Reto Final — Registro y Filtrado por Fecha</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Formulario */}
          <div style={card}>
            <p style={cardLabel}>Registrar nueva atencion</p>
            <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <input type="text"   placeholder="Nombre del cliente" value={cliente} onChange={(e) => setCliente(e.target.value)} style={input} required />
              <input type="number" placeholder="Tiempo (minutos)"   value={tiempo}  onChange={(e) => setTiempo(Number(e.target.value))} min={1} max={120} style={input} required />
              <textarea rows={2}   placeholder="Comentario..."       value={texto}   onChange={(e) => setTexto(e.target.value)} style={{ ...input, resize: 'vertical' }} required />
              <button type="submit" style={btnDark}>Guardar registro</button>
            </form>
          </div>

          {/* Tabla */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={cardLabel}>Atenciones registradas</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.78rem', color: '#64748b' }}>Fecha:</label>
                <input type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} style={{ ...input, width: 'auto', padding: '0.25rem 0.4rem' }} />
                {fechaFiltro && <button onClick={() => setFechaFiltro('')} style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.78rem', cursor: 'pointer' }}>Limpiar</button>}
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #cbd5e1', color: '#64748b', textAlign: 'left' }}>
                    <th style={th}>Cliente</th><th style={th}>Fecha</th><th style={th}>Tiempo</th><th style={th}>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {comentarios.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={td}><strong>{c.cliente_nombre}</strong></td>
                      <td style={{ ...td, color: '#64748b' }}>{c.fecha}</td>
                      <td style={td}>{c.tiempo_atencion_minutos} min</td>
                      <td style={{ ...td, color: '#334155' }}>{c.comentario}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Modulos */}
      <section>
        <h3 style={{ ...sectionTitle, marginBottom: '0.75rem' }}>4. Modulos del Sistema</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
          {MODULOS.map((m) => (
            <Link key={m.to} to={m.to} style={{ textDecoration: 'none', ...card, display: 'block' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', display: 'block' }}>{m.title}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>{m.desc}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ── sub-componentes ── */
function KpiCard({ label, value, code, sub }: { label: string; value: string; code?: string; sub?: string }) {
  return (
    <div style={card}>
      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block' }}>{label}</span>
      <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', display: 'block', margin: '0.25rem 0' }}>{value}</span>
      {code && <code style={{ fontSize: '0.72rem', color: '#0284c7', fontFamily: 'monospace' }}>{code}</code>}
      {sub  && <span style={{ fontSize: '0.72rem', color: '#059669', display: 'block', marginTop: '0.2rem' }}>{sub}</span>}
    </div>
  );
}

/* ── estilos ── */
const card: React.CSSProperties  = { backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '1rem', boxSizing: 'border-box' };
const sectionTitle: React.CSSProperties = { fontSize: '1rem', fontWeight: 600, color: '#1e293b', margin: 0 };
const badge: React.CSSProperties = { fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' };
const cardLabel: React.CSSProperties = { margin: '0 0 0.6rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#1e293b' };
const input: React.CSSProperties = { width: '100%', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' };
const btnDark: React.CSSProperties = { backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' };
const th: React.CSSProperties = { padding: '0.4rem', fontWeight: 600 };
const td: React.CSSProperties = { padding: '0.4rem' };
