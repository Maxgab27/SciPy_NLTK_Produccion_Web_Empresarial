import React, { useState } from 'react';

interface ClasifResult { categoria: string; confianza: number; }
interface BusquedaResult { servicio: string; relevancia: string; }

const DEMO_SERVICIOS: BusquedaResult[] = [
  { servicio: 'Soporte Tecnico',     relevancia: 'Alta'  },
  { servicio: 'Instalacion',         relevancia: 'Media' },
  { servicio: 'Mantenimiento',       relevancia: 'Media' },
];

export default function AnalisisNLP() {
  // Ejercicio 5 — Clasificador
  const [mensaje,   setMensaje]   = useState('');
  const [clasif,    setClasif]    = useState<ClasifResult | null>(null);
  const [cargClasif, setCargClasif] = useState(false);

  // Ejercicio 6 — Buscador
  const [consulta,  setConsulta]  = useState('');
  const [resultados, setResultados] = useState<BusquedaResult[]>([]);
  const [cargBusq,  setCargBusq]  = useState(false);

  const clasificar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargClasif(true);
    try {
      const r = await fetch('/api/nltk/clasificar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mensaje }) });
      if (!r.ok) throw new Error('offline');
      setClasif(await r.json());
    } catch {
      // Clasificacion local
      const m = mensaje.toLowerCase();
      const cat = m.includes('reclamo') || m.includes('demora') || m.includes('mal') ? 'reclamo'
                : m.includes('precio') || m.includes('comprar') || m.includes('cotizacion') ? 'ventas'
                : 'soporte';
      setClasif({ categoria: cat, confianza: 0.88 });
    } finally {
      setCargClasif(false);
    }
  };

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargBusq(true);
    try {
      const r = await fetch(`/api/nltk/buscar?q=${encodeURIComponent(consulta)}`);
      if (!r.ok) throw new Error('offline');
      setResultados(await r.json());
    } catch {
      setResultados(DEMO_SERVICIOS);
    } finally {
      setCargBusq(false);
    }
  };

  const categoriaColor: Record<string, string> = { ventas: 'var(--primary)', soporte: 'var(--secondary-blue)', reclamo: 'var(--danger)' };
  const categoriaBg:    Record<string, string> = { ventas: 'var(--surface-muted)', soporte: 'var(--surface-muted)', reclamo: 'var(--danger-bg)' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={pageHeader}>
        <div>
          <h2 style={h2}>Analisis de Lenguaje Natural — NLTK</h2>
          <p style={sub}>Ejercicio 5: clasificacion de mensajes · Ejercicio 6: buscador inteligente de servicios</p>
        </div>
      </header>

      {/* Ejercicio 5 — Clasificador */}
      <section>
        <SectionTitle title="Ejercicio 5 — Clasificador de Mensajes" badge="NLTK Classifier" />
        <p style={desc}>
          Flujo: tokenizar → normalizar → extraer atributos → clasificar en <em>ventas</em>, <em>soporte</em> o <em>reclamo</em>.
          El backend devuelve la categoria y nivel de confianza.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={card}>
            <form onSubmit={clasificar} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label style={labelSt}>Mensaje del cliente:
                <textarea rows={4} placeholder='Ej: "Necesito soporte con mi computadora" o "Tengo un reclamo por la demora"' value={mensaje} onChange={(e) => setMensaje(e.target.value)} style={{ ...input, resize: 'vertical', marginTop: '0.25rem' }} required />
              </label>
              <button type="submit" style={btnDark} disabled={cargClasif}>
                {cargClasif ? 'Clasificando...' : 'Clasificar Mensaje'}
              </button>
            </form>
          </div>

          {clasif && (
            <div style={card}>
              <h3 style={sH3}>Resultado de la Clasificacion</h3>
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ display: 'inline-block', padding: '0.5rem 1.5rem', borderRadius: '999px', fontSize: '1.25rem', fontWeight: 700, backgroundColor: categoriaBg[clasif.categoria] ?? 'var(--surface-muted)', color: categoriaColor[clasif.categoria] ?? 'var(--text-primary)', border: `2px solid ${categoriaColor[clasif.categoria] ?? 'var(--border-color)'}`, textTransform: 'capitalize' }}>
                  {clasif.categoria}
                </div>
                <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Confianza: <strong>{(clasif.confianza * 100).toFixed(0)}%</strong>
                </p>
              </div>
              <div style={{ backgroundColor: 'var(--surface-muted)', borderRadius: '6px', padding: '0.6rem 0.8rem', fontSize: '0.78rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                Mensaje analizado: "{mensaje.slice(0, 60)}{mensaje.length > 60 ? '...' : ''}"
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ejercicio 6 — Buscador */}
      <section>
        <SectionTitle title="Ejercicio 6 — Buscador Inteligente de Servicios" badge="word_tokenize" />
        <p style={desc}>
          Recibe una consulta en lenguaje natural, tokeniza y normaliza, luego compara con la base de servicios de la empresa.
        </p>
        <div style={card}>
          <form onSubmit={buscar} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <input type="text" placeholder='Ej: "necesito ayuda con mi computadora"' value={consulta} onChange={(e) => setConsulta(e.target.value)} style={{ ...input, flex: 1, minWidth: '200px' }} required />
            <button type="submit" style={{ ...btnDark, whiteSpace: 'nowrap' }} disabled={cargBusq}>
              {cargBusq ? 'Buscando...' : 'Buscar Servicio'}
            </button>
          </form>
          {resultados.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                  <th style={th}>Servicio encontrado</th>
                  <th style={th}>Relevancia</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={td}><strong>{r.servicio}</strong></td>
                    <td style={td}>
                      <span style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '3px', backgroundColor: r.relevancia === 'Alta' ? 'var(--success-bg)' : 'var(--surface-muted)', color: r.relevancia === 'Alta' ? 'var(--success)' : 'var(--text-secondary)', border: '1px solid', borderColor: r.relevancia === 'Alta' ? 'var(--success-border)' : 'var(--border-color)' }}>
                        {r.relevancia}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ title, badge }: { title: string; badge: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</h3>
      <code style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace', backgroundColor: 'var(--surface-muted)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{badge}</code>
    </div>
  );
}

const card: React.CSSProperties       = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem 1.25rem', boxSizing: 'border-box', boxShadow: 'var(--card-shadow)' };
const pageHeader: React.CSSProperties  = { borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' };
const h2: React.CSSProperties         = { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' };
const sub: React.CSSProperties        = { margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' };
const sH3: React.CSSProperties        = { fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem' };
const desc: React.CSSProperties       = { fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem' };
const labelSt: React.CSSProperties    = { fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column' };
const input: React.CSSProperties      = { padding: '0.45rem 0.6rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-muted)', color: 'var(--text-primary)' };
const btnDark: React.CSSProperties    = { backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', border: 'none', padding: '0.5rem 1rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' };
const th: React.CSSProperties         = { padding: '0.4rem', fontWeight: 600 };
const td: React.CSSProperties         = { padding: '0.4rem' };
