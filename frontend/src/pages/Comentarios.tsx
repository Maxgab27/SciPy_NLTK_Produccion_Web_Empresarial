import React, { useState, useEffect } from 'react';

interface Keyword    { palabra: string; frecuencia: number; }
interface Comentario { id: string; cliente_nombre: string; fecha: string; tiempo_atencion_minutos: number; comentario: string; }

const DEMO_KW: Keyword[] = [
  { palabra: 'servicio',   frecuencia: 12 },
  { palabra: 'atencion',   frecuencia: 9  },
  { palabra: 'rapido',     frecuencia: 7  },
  { palabra: 'soporte',    frecuencia: 5  },
  { palabra: 'excelente',  frecuencia: 4  },
  { palabra: 'demora',     frecuencia: 3  },
];
const DEMO_COM: Comentario[] = [
  { id: '1', cliente_nombre: 'Carlos Mendoza', fecha: '2026-09-01', tiempo_atencion_minutos: 15, comentario: 'El servicio fue rapido y el equipo brindo una excelente atencion.' },
  { id: '2', cliente_nombre: 'Mariana Silva',  fecha: '2026-09-01', tiempo_atencion_minutos: 25, comentario: 'Demora en la entrega del informe de soporte.' },
];

export default function Comentarios() {
  const [keywords,    setKeywords]    = useState<Keyword[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [online,      setOnline]      = useState<boolean | null>(null);

  // formulario
  const [cliente, setCliente] = useState('');
  const [tiempo,  setTiempo]  = useState(15);
  const [texto,   setTexto]   = useState('');

  const cargar = async () => {
    try {
      const [rK, rC] = await Promise.all([
        fetch('/api/comentarios/keywords'),
        fetch(fechaFiltro ? `/api/comentarios?fecha=${fechaFiltro}` : '/api/comentarios'),
      ]);
      if (!rK.ok) throw new Error('offline');
      const kd = await rK.json(); setKeywords(kd.keywords ?? []);
      setComentarios(await rC.json());
      setOnline(true);
    } catch {
      setOnline(false);
      setKeywords(DEMO_KW);
      setComentarios(DEMO_COM);
    }
  };

  useEffect(() => { cargar(); }, [fechaFiltro]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    const nuevo: Comentario = {
      id: String(Date.now()),
      cliente_nombre: cliente,
      fecha: new Date().toISOString().split('T')[0],
      tiempo_atencion_minutos: tiempo,
      comentario: texto,
    };
    try {
      await fetch('/api/comentarios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevo) });
    } catch {
      setComentarios((prev) => [nuevo, ...prev]);
    }
    setCliente(''); setTexto(''); setTiempo(15);
    cargar();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={pageHeader}>
        <div>
          <h2 style={h2}>Comentarios de Clientes</h2>
          <p style={sub}>Ejercicio 4: analisis de frecuencia con NLTK · Reto Final: registro y filtrado por fecha</p>
        </div>
        <span style={{ fontSize: '0.78rem', padding: '0.3rem 0.7rem', borderRadius: '4px', border: `1px solid ${online ? 'var(--success-border)' : 'var(--border-color)'}`, backgroundColor: online ? 'var(--success-bg)' : 'var(--surface-muted)', color: online ? 'var(--success)' : 'var(--text-secondary)' }}>
          {online === null ? 'Conectando...' : online ? 'Backend Activo' : 'Demostracion'}
        </span>
      </header>

      {/* Palabras clave — Ejercicio 4 */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={sH3}>Ejercicio 4 — Terminos Frecuentes (NLTK)</h3>
          <code style={badge}>Counter.most_common(10)</code>
        </div>
        <div style={card}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Flujo: tokenizar → eliminar stopwords en español → contar frecuencias con <code>collections.Counter</code>.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {keywords.map((k, i) => (
              <span key={k.palabra} style={{ backgroundColor: i < 3 ? 'var(--button-bg)' : 'var(--surface-muted)', color: i < 3 ? 'var(--button-text)' : 'var(--text-secondary)', border: '1px solid var(--border-color)', padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.82rem' }}>
                {k.palabra} <strong>({k.frecuencia})</strong>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario + tabla */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={card}>
          <h3 style={sH3}>Registrar Comentario</h3>
          <form onSubmit={guardar} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '0.75rem' }}>
            <input type="text"   placeholder="Nombre del cliente"  value={cliente} onChange={(e) => setCliente(e.target.value)} style={input} required />
            <input type="number" placeholder="Tiempo de atencion"  value={tiempo}  onChange={(e) => setTiempo(Number(e.target.value))} min={1} max={120} style={input} required />
            <textarea rows={3}   placeholder="Texto del comentario..." value={texto} onChange={(e) => setTexto(e.target.value)} style={{ ...input, resize: 'vertical' }} required />
            <button type="submit" style={btnDark}>Guardar</button>
          </form>
        </div>

        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <h3 style={sH3}>Historial</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Filtrar fecha:</label>
              <input type="date" value={fechaFiltro} onChange={(e) => setFechaFiltro(e.target.value)} style={{ ...input, width: 'auto', padding: '0.25rem 0.4rem' }} />
              {fechaFiltro && <button onClick={() => setFechaFiltro('')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', cursor: 'pointer' }}>Limpiar</button>}
            </div>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
            {comentarios.map((c) => (
              <div key={c.id} style={{ borderBottom: '1px solid var(--border-color)', padding: '0.65rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{c.cliente_nombre}</strong>
                  <span style={{ color: 'var(--text-secondary)' }}>{c.fecha} · {c.tiempo_atencion_minutos} min</span>
                </div>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: 'var(--text-primary)' }}>{c.comentario}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const card: React.CSSProperties      = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem 1.25rem', boxSizing: 'border-box', boxShadow: 'var(--card-shadow)' };
const pageHeader: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' };
const h2: React.CSSProperties        = { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' };
const sub: React.CSSProperties       = { margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' };
const sH3: React.CSSProperties       = { fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 };
const badge: React.CSSProperties     = { fontSize: '0.7rem', color: 'var(--text-secondary)', fontFamily: 'monospace', backgroundColor: 'var(--surface-muted)', padding: '0.2rem 0.5rem', borderRadius: '4px' };
const input: React.CSSProperties     = { padding: '0.45rem 0.6rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box', backgroundColor: 'var(--surface-muted)', color: 'var(--text-primary)' };
const btnDark: React.CSSProperties   = { backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', border: 'none', padding: '0.55rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' };
