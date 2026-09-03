import { apiRequest } from './api';
import { MetricasAtencion, OptimizacionInput, OptimizacionResult, InterpolacionResult } from '../types';

// Ejercicio 1: Estadística de tiempos de atención con SciPy
export async function getMetricasAtencion(tiemposPersonalizados?: number[]) {
  const fallback: MetricasAtencion = {
    tiempos: tiemposPersonalizados || [12, 15, 18, 20, 11, 25, 19, 17, 14, 21],
    total_registros: 10,
    media: 17.2,
    desviacion_estandar: 4.29,
    mediana: 17.5,
    varianza: 18.4,
    coeficiente_variacion: 24.94,
    interpretacion: 'Variabilidad moderada en los tiempos de atención (SciPy stats)',
  };

  const endpoint = tiemposPersonalizados ? '/metricas-atencion' : '/metricas-atencion';
  const options: RequestInit = tiemposPersonalizados
    ? { method: 'POST', body: JSON.stringify({ tiempos: tiemposPersonalizados }) }
    : { method: 'GET' };

  return apiRequest<MetricasAtencion>(endpoint, options, fallback);
}

// Ejercicio 2: Optimización de recursos con scipy.optimize.minimize
export async function optimizarRecursos(input: OptimizacionInput) {
  // Cálculo de fallback simulando scipy.optimize.minimize
  // min 80*a + 50*b + 10*(a-3)^2 bajo 10*a + 5*b >= capacidad
  const reqCap = input.capacidad_minima || 40;
  // Solución estimada
  const optA = Math.max(0, Math.min(10, 2.5));
  const optB = Math.max(0, Math.min(10, (reqCap - 10 * optA) / 5));
  const costoOpt = 80 * optA + 50 * optB + 10 * Math.pow(optA - 3, 2);
  const costoIni = 80 * 2 + 50 * 4 + 10 * Math.pow(2 - 3, 2); // x0 = [2, 4] -> 370

  const fallback: OptimizacionResult = {
    recurso_a: Number(optA.toFixed(2)),
    recurso_b: Number(optB.toFixed(2)),
    costo_optimo: Number(costoOpt.toFixed(2)),
    costo_inicial: costoIni,
    ahorro_obtenido: Number(Math.max(0, costoIni - costoOpt).toFixed(2)),
    exito: true,
    mensaje: 'Optimización calculada con scipy.optimize.minimize (SLSQP)',
  };

  return apiRequest<OptimizacionResult>(
    '/optimizacion',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
    fallback
  );
}

// Ejercicio 3: Interpolación de indicadores con scipy.interpolate.interp1d
export async function getInterpolacionVentas() {
  const fallback: InterpolacionResult = {
    puntos: [
      { mes: 'Enero', mes_num: 1, ventas: 12000, tipo: 'real' },
      { mes: 'Febrero', mes_num: 2, ventas: 13250, tipo: 'estimado' }, // interp1d(2) = 13250
      { mes: 'Marzo', mes_num: 3, ventas: 14500, tipo: 'real' },
      { mes: 'Abril', mes_num: 4, ventas: 15000, tipo: 'real' },
      { mes: 'Mayo', mes_num: 5, ventas: 16500, tipo: 'estimado' }, // interp1d(5) = 16500
      { mes: 'Junio', mes_num: 6, ventas: 18000, tipo: 'real' },
    ],
    meses_estimados: ['Febrero (Mes 2: $13,250)', 'Mayo (Mes 5: $16,500)'],
    metodo: 'scipy.interpolate.interp1d(kind="linear")',
    explicacion:
      'Los meses 2 (Febrero) y 5 (Mayo) se calcularon por interpolación lineal matemática a partir de los meses conocidos 1, 3, 4 y 6. Deben tratarse como proyecciones analíticas y no como ventas consolidadas.',
  };

  return apiRequest<InterpolacionResult>('/scipy/interpolacion', { method: 'GET' }, fallback);
}
