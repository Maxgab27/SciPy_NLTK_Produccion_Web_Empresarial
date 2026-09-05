import React from 'react';

const CRITERIOS = [
  { criterio: 'Conceptos de SciPy',  peso: '15%', evidencia: 'Explicacion y seleccion correcta de modulos.' },
  { criterio: 'Conceptos de NLTK',   peso: '15%', evidencia: 'Flujo de NLP y uso de tecnicas.' },
  { criterio: 'Ejercicios SciPy',    peso: '25%', evidencia: 'Correcta aplicacion y resultados coherentes.' },
  { criterio: 'Ejercicios NLTK',     peso: '25%', evidencia: 'Implementacion funcional con datos reales.' },
  { criterio: 'Proyecto integrador', peso: '20%', evidencia: 'Web funcional que combina SciPy y NLTK.' },
];

const CAPAS = [
  { capa: 'Frontend',      desc: 'React / HTML / CSS: dashboard, formularios, tablas y alertas.' },
  { capa: 'API',           desc: 'FastAPI: endpoints para metricas, optimizacion y NLP.' },
  { capa: 'SciPy',         desc: 'Estadistica, optimizacion e interpolacion de datos numericos.' },
  { capa: 'NLTK',          desc: 'Tokenizacion, limpieza, frecuencia y clasificacion de texto.' },
  { capa: 'Base de datos', desc: 'Almacena solicitudes, metricas y resultados procesados.' },
];

const PRACTICAS = [
  'Separar frontend, API, logica de negocio y acceso a datos.',
  'Validar y sanitizar toda entrada proveniente del navegador.',
  'No ejecutar calculos pesados directamente en el navegador.',
  'Controlar versiones de dependencias y fijar versiones compatibles.',
  'Registrar errores y metricas, evitando almacenar datos sensibles innecesarios.',
  'En NLP, documentar el idioma, los recursos descargados y las decisiones de limpieza.',
  'Para funciones criticas, agregar pruebas unitarias con datos reales anonimizados.',
];

export default function Reportes() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={pageHeader}>
        <div>
          <h2 style={h2}>Reporte Ejecutivo Consolidado</h2>
          <p style={sub}>Proyecto integrador — Portal web empresarial inteligente (SENATI)</p>
        </div>
      </header>

      {/* Arquitectura */}
      <section>
        <h3 style={sH3}>Arquitectura del Sistema</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          {CAPAS.map((c) => (
            <div key={c.capa} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem 1rem', alignItems: 'center', boxShadow: 'var(--card-shadow)' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary)' }}>{c.capa}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{c.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Criterios de evaluacion */}
      <section>
        <h3 style={sH3}>Criterios de Evaluacion</h3>
        <div style={card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                <th style={th}>Criterio</th><th style={th}>Peso</th><th style={th}>Evidencia requerida</th>
              </tr>
            </thead>
            <tbody>
              {CRITERIOS.map((c) => (
                <tr key={c.criterio} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={td}><strong>{c.criterio}</strong></td>
                  <td style={{ ...td, fontWeight: 700, color: 'var(--primary)' }}>{c.peso}</td>
                  <td style={{ ...td, color: 'var(--text-primary)' }}>{c.evidencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Buenas practicas */}
      <section>
        <h3 style={sH3}>Buenas Practicas para Produccion</h3>
        <div style={card}>
          <ul style={{ margin: 0, padding: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {PRACTICAS.map((p, i) => (
              <li key={i} style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{p}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Entregables */}
      <section>
        <h3 style={sH3}>Entregables del Reto Final</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
          {['Codigo fuente', 'API documentada', 'Interfaz web', 'Modelo de datos', 'Pruebas', 'Informe de resultados'].map((e) => (
            <div key={e} style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', textAlign: 'center', boxShadow: 'var(--card-shadow)' }}>
              {e}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const card: React.CSSProperties       = { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1rem 1.25rem', boxSizing: 'border-box', boxShadow: 'var(--card-shadow)' };
const pageHeader: React.CSSProperties  = { borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' };
const h2: React.CSSProperties         = { margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' };
const sub: React.CSSProperties        = { margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' };
const sH3: React.CSSProperties        = { fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.5rem' };
const th: React.CSSProperties         = { padding: '0.5rem 0.6rem', fontWeight: 600 };
const td: React.CSSProperties         = { padding: '0.5rem 0.6rem' };
