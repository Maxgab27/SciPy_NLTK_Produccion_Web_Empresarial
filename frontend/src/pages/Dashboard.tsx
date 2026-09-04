import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  { id: '2', cliente_nombre: 'Mariana Silva',  fecha: '2026-09-01', tiempo_atencion_minutos: 25, comentario: 'Demora en la entrega del informe.' },
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
    setDisplayValue(0); // Reiniciar cada vez que entras o carga
    
    let inicio = 0;
    const duracion = 1000; // 1 segundo que tarda en subir el número
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

  // Formatear visualmente a estilo reloj "17:02" si es necesario o dejar decimal limpio
  const stringValue = displayValue.toFixed(2).replace('.', ':');

  return (
    <div style={estilos.kpiCardGranel}>
      <div style={estilos.kpiTextContainer}>
        <p style={estilos.kpiLabelBig}>{label}</p>
      </div>
      <div style={estilos.kpiNumberContainer}>
        <span style={estilos.kpiValueBig}>{stringValue}</span>
        <span style={estilos.kpiUnitBig}>{unit}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [metricas, setMetricas]   = useState<Metricas | null>(null);
  const [keywords, setKeywords]   = useState<Keyword[]>([]);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [online, setOnline]       = useState<boolean | null>(null);
  const [cliente, setCliente]     = useState('');
  const [tiempo,  setTiempo]      = useState(15);
  const [texto,   setTexto]       = useState('');

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
      
      {/* Cabecera con el Fondo Degradado Azul solicitado */}
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
            border: '1px solid #e2e8f0', 
            backgroundColor: online ? '#f0fdf4' : '#f8fafc', 
            color: online ? '#166534' : '#475569', 
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
          <code style={estilos.badge}>scipy.stats</code>
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
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="cantidad" stroke="#3b82f6" fillOpacity={0.1} fill="#3b82f6" />
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
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="cantidad" fill="#1067b9" radius={[4, 4, 0, 0]} />
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
          <code style={estilos.badge}>Counter.most_common</code>
        </div>
        <div style={estilos.cardStandard}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {keywords.map((k) => (
              <span key={k.palabra} style={estilos.keywordTag}>
                {k.palabra} <strong style={{ color: '#1e293b' }}>({k.frecuencia})</strong>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Estilos encapsulados en un Objeto JavaScript Completos ── */

const estilos = {
  dashboardWrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2rem',
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    paddingBottom: '2rem',
    padding: '1rem',
    paddingTop: '80px' // ← AÑADE ESTA LÍNEA (Ajusta los px según el alto de tu barra azul)
  },

  /* Cabecera Clásica Original */
  cabeceraOriginal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '1.25rem'
  },
  cabeceraSubtitleOriginal: {
    margin: 0,
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em'
  },
  cabeceraTitleOriginal: {
    margin: '0.2rem 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#0f172a'
  },
  cabeceraDescOriginal: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#64748b'
  },
  btnDark: {
    backgroundColor: '#0c296d',
    color: '#ffffff',
    padding: '0.4rem 0.9rem',
    borderRadius: '4px',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer'
  },
  /* Sección e Indicadores SciPy */
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#334155'
  },
  badge: {
    backgroundColor: '#ffffff',
    color: '#64748b',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    border: '1px solid #e2e8f0'
  },
  kpiRowTop: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  kpiCardGranel: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.5rem 2rem',
    border: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  kpiTextContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  kpiLabelBig: {
    margin: 0,
    fontSize: '1.3rem',
    fontWeight: 800,
    color: '#0f172a',
    maxWidth: '120px',
    lineHeight: '1.2'
  },
  kpiNumberContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.25rem'
  },
  kpiValueBig: {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: '#206e9b'
  },
  kpiUnitBig: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#0f172a'
  },
  /* Bloques de Gráficos Inferiores */
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem'
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid #e2e8f0'
  },
  chartCardLabel: {
    margin: '0 0 1rem 0',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#64748b'
  },
  /* Sección NLTK */
  cardStandard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '1.25rem'
  },
  keywordTag: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    fontSize: '0.82rem',
    color: '#475569'
  }
};
