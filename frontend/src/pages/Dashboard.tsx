import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
// Importamos componentes de gráficos simples
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';

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
const DEMO_METRICAS: Metricas = { media: 17.02, desviacion_estandar: 4.29, mediana: 17.05, coeficiente_variacion: 24.94, interpretacion: 'Variabilidad moderada' };
const DEMO_KEYWORDS: Keyword[] = [{ palabra: 'servicio', frecuencia: 12 }, { palabra: 'atencion', frecuencia: 9 }, { palabra: 'rapido', frecuencia: 7 }, { palabra: 'soporte', frecuencia: 5 }];
const DEMO_COMENTARIOS: Comentario[] = [
  { id: '1', cliente_nombre: 'Carlos Mendoza', fecha: '2026-09-01', tiempo_atencion_minutos: 15, comentario: 'Excelente atencion y soporte rapido.' },
  { id: '2', cliente_nombre: 'Mariana Silva', fecha: '2026-09-01', tiempo_atencion_minutos: 25, comentario: 'Demora en la entrega del informe.' },
];

// Datos ficticios para rellenar tus nuevos gráficos simulando SciPy
const DATA_GRAFICO_DISTRIBUCION = [
  { name: 'Min 10', cantidad: 2 },
  { name: 'Min 14', cantidad: 7 },
  { name: 'Min 17', cantidad: 15 },
  { name: 'Min 20', cantidad: 9 },
  { name: 'Min 25', cantidad: 3 },
];

/* ── Componente de Tarjeta con Animación de Carga de Números ── */
interface KpiCardProps {
  label: string;
  targetValue: number; // El número final al que debe llegar
  unit?: string;
}
function AnimatedKpiCard({ label, targetValue, unit = "min" }: KpiCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!targetValue) return;
    setDisplayValue(0);

    let inicio = 0;
    const duracion = 1000;
    const pasos = 30;
    const incremento = targetValue / pasos;
    const intervaloTiempo = duracion / pasos;

    const cronometro = setInterval(() => {
      inicio += incremento;
      if (inicio >= targetValue) {
        setDisplayValue(targetValue);
        clearInterval(cronometro);
      } else {
        setDisplayValue(Number(inicio.toFixed(2)));
      }
    }, intervaloTiempo);

    return () => clearInterval(cronometro);
  }, [targetValue]);

  const stringValue = displayValue.toFixed(2);

  return (
    <div style={estilos.kpiCardGranel}>
      <div style={estilos.kpiContent}>

        <p style={estilos.kpiLabelBig}>
          {label}
        </p>

        <div style={estilos.kpiNumberContainer}>
          <span style={estilos.kpiValueBig}>
            {stringValue}
          </span>

          <span style={estilos.kpiUnitBig}>
            {unit}
          </span>
        </div>

      </div>
    </div>
  );
}

export default function Dashboard() {
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [online, setOnline] = useState<boolean | null>(null);
  const [cliente, setCliente] = useState('');
  const [tiempo, setTiempo] = useState(15);
  const [texto, setTexto] = useState('');

  const BASE = '/api';

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
    <div style={estilos.dashboardWrapper}>

      {/* Cabecera (Restaurada al diseño original) */}
      <div style={estilos.cabeceraOriginal}>
        <div>
          <p style={estilos.cabeceraSubtitleOriginal}>Panel de Control Ejecutivo</p>
          <h2 style={estilos.cabeceraTitleOriginal}>Centro Inteligente de Atencion</h2>
          <p style={estilos.cabeceraDescOriginal}>SciPy (calculo numerico) + NLTK (procesamiento de texto) en arquitectura desacoplada.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.78rem',
            padding: '0.3rem 0.7rem',
            borderRadius: '4px',
            border: '1px solid var(--border-color)',
            backgroundColor: online ? 'var(--success-bg)' : 'var(--surface-muted)',
            color: online ? 'var(--success)' : 'var(--text-secondary)',
            fontWeight: 500
          }}>
            {online === null ? 'Conectando...' : online ? 'Backend Activo (:8000)' : 'Modo Demostracion'}
          </span>
          <button onClick={cargar} style={estilos.btnDark}>Actualizar</button>
        </div>
      </div>

      {/* 1. Indicadores SciPy */}
      <section style={{ padding: '0 1.5rem' }}>
        <div style={estilos.sectionHeader}>
          <h3 style={estilos.sectionTitle}>1. Indicadores de Tiempos de Atencion — SciPy</h3>
        </div>

        {/* Fila superior: Las dos grandes tarjetas animadas (Tiempo Promedio y Mediana) */}
        <div style={estilos.kpiRowTop}>
          <AnimatedKpiCard label="Tiempo Promedio" targetValue={metricas?.media ?? 17.02} />
          <AnimatedKpiCard label="Mediana" targetValue={metricas?.mediana ?? 17.05} />
        </div>

        {/* Fila Inferior: Espacio asignado para tus dos gráficos dinámicos */}
        <div style={estilos.chartsGrid}>
          {/* Gráfico 1: Desviación Estándar (Representado con área suave) */}
          <div style={estilos.chartCard}>
            <p style={estilos.chartCardLabel}>Distribución de Tiempos & Desviación (±{metricas?.desviacion_estandar ?? '4.29'} min)</p>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <AreaChart data={DATA_GRAFICO_DISTRIBUCION}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="cantidad" stroke="var(--primary)" fillOpacity={0.15} fill="var(--primary)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico 2: Coeficiente de Variación (Representado en barras de frecuencia) */}
          <div style={estilos.chartCard}>
            <p style={estilos.chartCardLabel}>Coeficiente de Variación ({metricas?.coeficiente_variacion ?? '24.94'}%) — {metricas?.interpretacion ?? 'Estable'}</p>
            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer>
                <BarChart data={DATA_GRAFICO_DISTRIBUCION}>
                  <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="var(--secondary-blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Keywords NLTK */}
      <section style={{ padding: '0 1.5rem' }}>
        <div style={estilos.sectionHeader}>
          <h3 style={estilos.sectionTitle}>2. Terminos Frecuentes en Comentarios — NLTK</h3>
        </div>
        <div style={estilos.cardStandard}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {keywords.map((k) => (
              <span key={k.palabra} style={estilos.keywordTag}>
                {k.palabra} <strong style={{ color: 'var(--text-primary)' }}>({k.frecuencia})</strong>
              </span>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}

const estilos: Record<string, CSSProperties> = {
  dashboardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingBottom: '3rem',
  },
  cabeceraOriginal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.5rem',
    backgroundColor: 'transparent', // Se hace transparente para unirse al fondo general
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  cabeceraSubtitleOriginal: {
    margin: 0,
    fontSize: '0.8rem',
    color: 'var(--primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 600,
  },
  cabeceraTitleOriginal: {
    margin: '0.15rem 0',
    fontSize: '2rem',
    color: 'var(--text-primary)',
    fontWeight: 700,
    letterSpacing: '-0.02em',
  },
  cabeceraDescOriginal: {
    margin: 0,
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  btnDark: {
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    padding: '0.5rem 1.25rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.25rem',
    color: 'var(--text-primary)',
    fontWeight: 700,
  },

  kpiRowTop: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  // Tarjetas oscuras semitransparentes (Glassmorphism)
  kpiCardGranel: {
    flex: 1,
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '18px',
    padding: '1.5rem',
    boxShadow: 'var(--card-shadow)',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
  kpiContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    minHeight: '100px',
  },
  kpiLabelBig: {
    margin: 0,
    fontSize: '1.15rem',
    color: 'var(--text-primary)',
    fontWeight: 700,
    lineHeight: 1.1,
    textAlign: 'right',
    maxWidth: '120px',
  },
  kpiNumberContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  kpiValueBig: {
    fontSize: '2.7rem',

    lineHeight: '1',

    fontWeight: 800,

    color: 'var(--text-primary)',
  },
  kpiUnitBig: {
    fontSize: '1.2rem',

    lineHeight: '1.2',

    color: 'var(--text-secondary)',

    fontWeight: 700,

    marginTop: '0.15rem',
  },
  chartsGrid: {
    display: 'flex',
    gap: '1.5rem',
  },
  chartCard: {
    flex: 1,

    backgroundColor: 'var(--card-bg)',

    border:
      '1px solid var(--border-color)',

    borderRadius: '16px',

    padding: '1.5rem',

    boxShadow:
      'var(--card-shadow)',

    transition:
      'all 0.3s ease',
  },
  chartCardLabel: {
    margin: '0 0 1rem 0',

    fontSize: '0.875rem',

    color: 'var(--text-primary)',

    fontWeight: 600,
  },
  cardStandard: {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '1.25rem',
    boxShadow: 'var(--card-shadow)',
  },
  keywordTag: {
    backgroundColor: 'var(--surface-muted)',
    border: '1px solid var(--border-color)',
    padding: '0.35rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  
}