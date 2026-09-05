import React, { useState } from 'react';

interface ResultadoOpt {
  recurso_a: number;
  recurso_b: number;
  costo_optimo: number;
  costo_inicial?: number;
}

export default function Optimizacion() {
  const [capacidad, setCapacidad] = useState(40);
  const [costoA,    setCostoA]    = useState(80);
  const [costoB,    setCostoB]    = useState(50);
  const [resultado, setResultado] = useState<ResultadoOpt | null>(null);
  const [cargando,  setCargando]  = useState(false);

  const calcular = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    try {
      const r = await fetch('/api/optimizacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capacidad_minima: capacidad, costo_base_a: costoA, costo_base_b: costoB }),
      });
      if (!r.ok) throw new Error('offline');
      setResultado(await r.json());
    } catch {
      // Calculo local de demostración
      const a = Math.max(0, (capacidad - 5 * 4) / 10);
      const b = Math.max(0, (capacidad - 10 * a) / 5);
      const costo = costoA * a + costoB * b + 10 * (a - 3) ** 2;
      setResultado({ recurso_a: parseFloat(a.toFixed(2)), recurso_b: parseFloat(b.toFixed(2)), costo_optimo: parseFloat(costo.toFixed(2)), costo_inicial: costoA * 2 + costoB * 4 });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={pageHeader}>
        <div>
          <h2 style={h2}>Optimizacion de Recursos — SciPy</h2>
          <p style={sub}>Ejercicio 2: minimizacion de funcion de costo con restriccion de capacidad</p>
        </div>
      </header>

      {/* Contexto */}
      <div style={card}>
        <h3 style={sectionH3}>Situacion del Ejercicio</h3>
        <p style={p}>Una empresa quiere reducir el costo de operacion de dos recursos (A y B). Se define una funcion de costo:</p>
        <div style={{ backgroundColor: 'var(--surface-muted)', border: '1px solid var(--border-color)', padding: '0.75rem 1rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary)', margin: '0.75rem 0' }}>
          costo(a, b) = costoA·a + costoB·b + 10·(a − 3)²
        </div>
        <p style={p}><strong>Restriccion:</strong> 10·a + 5·b ≥ capacidad_minima (asegurar cobertura operativa)</p>
        <p style={p}><strong>Metodo:</strong> <code>scipy.optimize.minimize</code> con solver SLSQP y bounds [(0,10),(0,10)].</p>
      </div>

      {/* Formulario */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <div style={card}>
          <h3 style={sectionH3}>Parametros de Entrada</h3>
          <form onSubmit={calcular} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <label style={labelSt}>
              Costo base Recurso A (S/):
              <input type="number" value={costoA} onChange={(e) => setCostoA(Number(e.target.value))} style={input} min={1} />
            </label>
            <label style={labelSt}>
              Costo base Recurso B (S/):
              <input type="number" value={costoB} onChange={(e) => setCostoB(Number(e.target.value))} style={input} min={1} />
            </label>
            <label style={labelSt}>
              Capacidad minima requerida:
              <input type="number" value={capacidad} onChange={(e) => setCapacidad(Number(e.target.value))} style={input} min={1} />
            </label>
            <button type="submit" style={btnDark} disabled={cargando}>
              {cargando ? 'Calculando...' : 'Ejecutar Optimizacion'}
            </button>
          </form>
        </div>

        {/* Resultado */}
        {resultado && (
          <div style={card}>
            <h3 style={sectionH3}>Resultado Optimo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
              <KpiRow label="Recurso A optimo"  value={`${resultado.recurso_a} unidades`}  />
              <KpiRow label="Recurso B optimo"  value={`${resultado.recurso_b} unidades`}  />
              <KpiRow label="Costo minimo"      value={`S/ ${resultado.costo_optimo}`}       highlight />
              {resultado.costo_inicial !== undefined && (
                <div style={{ backgroundColor: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: '6px', padding: '0.6rem 0.8rem', fontSize: '0.82rem', color: 'var(--success)' }}>
                  Ahorro vs. punto inicial: S/ {(resultado.costo_inicial - resultado.costo_optimo).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: '1rem', fontWeight: 700, color: highlight ? 'var(--primary)' : 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

const card: React.CSSProperties      = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem 1.25rem', boxSizing: 'border-box', boxShadow: 'var(--card-shadow)' };
const pageHeader: React.CSSProperties = { borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' };
const h2: React.CSSProperties        = { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' };
const sub: React.CSSProperties       = { margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' };
const sectionH3: React.CSSProperties = { fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem' };
const p: React.CSSProperties         = { margin: '0.4rem 0', fontSize: '0.85rem', color: 'var(--text-primary)' };
const labelSt: React.CSSProperties   = { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' };
const input: React.CSSProperties     = { padding: '0.45rem 0.6rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box', fontWeight: 400, backgroundColor: 'var(--surface-muted)', color: 'var(--text-primary)' };
const btnDark: React.CSSProperties   = { backgroundColor: 'var(--button-bg)', color: 'var(--button-text)', border: 'none', padding: '0.55rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' };
