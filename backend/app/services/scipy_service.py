import numpy as np
from scipy import stats

VERSION = 'estadisticas-v1'


def calcular_estadisticas(valores):
    tiempos = np.asarray(valores, dtype=float)
    n = len(tiempos)
    result = dict.fromkeys(['media', 'mediana', 'desviacion_estandar', 'varianza',
                           'minimo', 'maximo', 'percentil_25', 'percentil_75', 'coeficiente_variacion'])
    result.update(tiempos=tiempos.tolist(), total_registros=n, metodo=VERSION)
    if not n:
        return {**result, 'interpretacion': 'No hay atenciones en el período seleccionado.'}
    result.update(media=float(np.mean(tiempos)), mediana=float(np.median(tiempos)),
                  minimo=float(np.min(tiempos)), maximo=float(np.max(tiempos)),
                  percentil_25=float(np.percentile(tiempos, 25, method='linear')),
                  percentil_75=float(np.percentile(tiempos, 75, method='linear')))
    if n == 1:
        result['interpretacion'] = 'Se necesitan al menos dos atenciones para calcular la dispersión muestral.'
    else:
        result['varianza'] = float(stats.tvar(tiempos, ddof=1))
        result['desviacion_estandar'] = float(stats.tstd(tiempos, ddof=1))
        cv = result['desviacion_estandar'] / result['media'] * 100
        result['coeficiente_variacion'] = cv
        nivel = 'Baja' if cv < 20 else 'Moderada' if cv < 40 else 'Alta'
        result['interpretacion'] = f'{nivel} variabilidad. Criterio orientativo: CV <20% baja, 20–<40% moderada, ≥40% alta; no es un umbral de SLA.'
    return {key: round(value, 4) if isinstance(value, float) else value for key, value in result.items()}
