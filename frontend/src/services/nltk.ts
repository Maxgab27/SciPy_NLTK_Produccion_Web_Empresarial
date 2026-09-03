import { apiRequest } from './api';
import { KeywordsResult, ClasificacionResult, ServicioItem } from '../types';

// Ejercicio 4: Análisis de palabras clave con NLTK
export async function getKeywordsComentarios(texto?: string) {
  const fallback: KeywordsResult = {
    texto_analizado: texto || 'El servicio fue rápido y el equipo brindó una excelente atención a los clientes.',
    keywords: [
      { palabra: 'servicio', frecuencia: 12 },
      { palabra: 'atención', frecuencia: 9 },
      { palabra: 'rápido', frecuencia: 7 },
      { palabra: 'excelente', frecuencia: 6 },
      { palabra: 'soporte', frecuencia: 5 },
      { palabra: 'respuesta', frecuencia: 4 },
      { palabra: 'equipo', frecuencia: 3 },
    ],
    total_palabras_clave: 7,
  };

  const endpoint = '/comentarios/keywords';
  const options: RequestInit = texto
    ? { method: 'POST', body: JSON.stringify({ texto }) }
    : { method: 'GET' };

  return apiRequest<KeywordsResult>(endpoint, options, fallback);
}

// Ejercicio 5: Clasificación de mensajes con NLTK (ventas, soporte, reclamo)
export async function clasificarMensaje(mensaje: string) {
  // Lógica de respaldo inteligente basada en palabras clave
  const msgLower = mensaje.toLowerCase();
  let categoria: 'ventas' | 'soporte' | 'reclamo' = 'soporte';
  let confianza = 0.85;
  const detectadas: string[] = [];

  const palabrasVentas = ['precio', 'costo', 'cotizar', 'comprar', 'adquirir', 'planes', 'venta', 'descuento'];
  const palabrasReclamo = ['demora', 'queja', 'reclamo', 'mal', 'pésimo', 'lento', 'inconforme', 'error', 'falla'];
  const palabrasSoporte = ['ayuda', 'problema', 'computadora', 'sistema', 'acceso', 'configurar', 'soporte', 'reparar'];

  if (palabrasReclamo.some((p) => msgLower.includes(p))) {
    categoria = 'reclamo';
    confianza = 0.92;
    detectadas.push(...palabrasReclamo.filter((p) => msgLower.includes(p)));
  } else if (palabrasVentas.some((p) => msgLower.includes(p))) {
    categoria = 'ventas';
    confianza = 0.89;
    detectadas.push(...palabrasVentas.filter((p) => msgLower.includes(p)));
  } else {
    categoria = 'soporte';
    confianza = 0.84;
    detectadas.push(...palabrasSoporte.filter((p) => msgLower.includes(p)));
  }

  const fallback: ClasificacionResult = {
    mensaje,
    categoria,
    confianza,
    palabras_clave_detectadas: detectadas.length > 0 ? detectadas : ['general'],
  };

  return apiRequest<ClasificacionResult>(
    '/nltk/clasificar',
    {
      method: 'POST',
      body: JSON.stringify({ mensaje }),
    },
    fallback
  );
}

// Ejercicio 6: Buscador inteligente de servicios con tokenización NLTK
export async function buscarServicios(consulta: string) {
  const serviciosEmpresariales: ServicioItem[] = [
    {
      id: 1,
      nombre: 'Mantenimiento Preventivo y Correctivo',
      categoria: 'Soporte Técnico',
      descripcion: 'Atención a computadoras, laptops e infraestructura de oficina.',
      etiquetas: ['computadora', 'laptop', 'mantenimiento', 'ayuda', 'reparar', 'hardware'],
    },
    {
      id: 2,
      nombre: 'Desarrollo de Software a Medida',
      categoria: 'Tecnología',
      descripcion: 'Construcción de portales web empresariales y APIs con Python y React.',
      etiquetas: ['web', 'software', 'sistema', 'api', 'desarrollo', 'programacion'],
    },
    {
      id: 3,
      nombre: 'Consultoría en Ciencia de Datos y NLP',
      categoria: 'Analítica',
      descripcion: 'Procesamiento de texto con NLTK y modelos estadísticos avanzados con SciPy.',
      etiquetas: ['datos', 'analisis', 'scipy', 'nltk', 'estadistica', 'inteligencia'],
    },
    {
      id: 4,
      nombre: 'Optimización de Costos y Operaciones',
      categoria: 'Consultoría',
      descripcion: 'Modelado matemático de asignación de recursos y minimización de costos operativos.',
      etiquetas: ['costo', 'optimizacion', 'recursos', 'capacidad', 'operaciones', 'eficiencia'],
    },
    {
      id: 5,
      nombre: 'Mesa de Ayuda y Atención 24/7',
      categoria: 'Atención al Cliente',
      descripcion: 'Gestión inmediata de tickets, reclamos y solicitudes de clientes.',
      etiquetas: ['ayuda', 'atencion', 'ticket', 'reclamo', 'soporte', 'cliente'],
    },
  ];

  if (!consulta.trim()) {
    return { data: serviciosEmpresariales, isFallback: true };
  }

  const tokensConsulta = consulta
    .toLowerCase()
    .split(/[\s,.;:!?]+/)
    .filter((t) => t.length > 2);

  const resultados = serviciosEmpresariales
    .map((s) => {
      let matches = 0;
      tokensConsulta.forEach((t) => {
        if (s.etiquetas.some((tag) => tag.includes(t) || t.includes(tag))) matches += 2;
        if (s.nombre.toLowerCase().includes(t)) matches += 3;
        if (s.descripcion.toLowerCase().includes(t)) matches += 1;
      });
      return { ...s, coincidencia: matches };
    })
    .filter((s) => (s.coincidencia || 0) > 0)
    .sort((a, b) => (b.coincidencia || 0) - (a.coincidencia || 0));

  return apiRequest<ServicioItem[]>(
    `/nltk/buscar?q=${encodeURIComponent(consulta)}`,
    { method: 'GET' },
    resultados.length > 0 ? resultados : serviciosEmpresariales.slice(0, 2)
  );
}
