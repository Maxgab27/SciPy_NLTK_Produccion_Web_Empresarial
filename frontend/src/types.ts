export interface Comentario { id: string; cliente_nombre: string; fecha: string; tiempo_atencion_minutos: number; comentario: string; categoria?: string; sentimiento?: string; }
export interface KeywordsResult { texto_analizado?: string; keywords: { palabra: string; frecuencia: number }[]; total_palabras_clave: number; }
export interface ClasificacionResult { mensaje: string; categoria: string; confianza: number; palabras_clave_detectadas: string[]; }
export interface ServicioItem { id: number; nombre: string; categoria: string; descripcion: string; etiquetas: string[]; coincidencia?: number; }
export interface MetricasAtencion {
  tiempos: number[]; total_registros: number;
  media: number | null; mediana: number | null; desviacion_estandar: number | null;
  varianza: number | null; coeficiente_variacion: number | null;
  minimo: number | null; maximo: number | null; percentil_25: number | null; percentil_75: number | null;
  interpretacion: string; resultado_id?: number; calculado_en?: string;
  fecha_inicio?: string | null; fecha_fin?: string | null;
}

export interface OptimizacionInput { capacidad_minima: number; costo_base_a: number; costo_base_b: number; }
export interface OptimizacionResult { recurso_a: number; recurso_b: number; costo_optimo: number; costo_inicial: number; ahorro_obtenido: number; exito: boolean; mensaje: string; }
export interface InterpolacionResult { puntos: { mes: string; mes_num: number; ventas: number; tipo: 'real' | 'estimado' }[]; meses_estimados: string[]; metodo: string; explicacion: string; }
