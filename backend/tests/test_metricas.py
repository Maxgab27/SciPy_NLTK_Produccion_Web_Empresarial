import pytest
from test_persistence import api, payload
from app.database.connection import connect


def test_reference_statistics_are_saved_and_reused(api):
    for value in [12, 15, 18, 20, 11, 25, 19, 17, 14, 21]:
        assert api.post('/api/comentarios', json=payload(tiempo_atencion_minutos=value)).status_code == 201
    response = api.get('/api/metricas-atencion?fecha=2026-09-05')
    assert response.status_code == 200, response.text
    m = response.json()
    assert m['total_registros'] == 10
    assert m['media'] == 17.2 and m['mediana'] == 17.5
    assert m['varianza'] == pytest.approx(18.6222)
    assert m['desviacion_estandar'] == pytest.approx(4.3153)
    assert m['percentil_25'] == 14.25 and m['percentil_75'] == 19.75
    assert m['minimo'] == 11 and m['maximo'] == 25
    again = api.get('/api/metricas-atencion?fecha=2026-09-05').json()
    assert again['resultado_id'] == m['resultado_id']
    assert len(api.get('/api/metricas-atencion/historial').json()) == 1
    with connect() as db:
        saved = db.execute('SELECT resultado FROM metricas_estadisticas WHERE id=%s', (m['resultado_id'],)).fetchone()['resultado']
        assert saved['media'] == m['media'] and len(saved['atencion_ids']) == 10
    api.post('/api/comentarios', json=payload(tiempo_atencion_minutos=50))
    changed = api.get('/api/metricas-atencion?fecha=2026-09-05').json()
    assert changed['resultado_id'] != m['resultado_id'] and changed['total_registros'] == 11
    assert changed['media'] == pytest.approx(222 / 11, abs=0.0001)


def test_date_boundaries_empty_and_single(api):
    for day, value in [('2026-09-04', 10), ('2026-09-05', 20), ('2026-09-06', 30)]:
        api.post('/api/comentarios', json=payload(fecha=day, tiempo_atencion_minutos=value))
    m = api.get('/api/metricas-atencion?fecha_inicio=2026-09-04&fecha_fin=2026-09-05').json()
    assert m['tiempos'] == [10, 20] and m['media'] == 15
    assert api.get('/api/metricas-atencion?fecha_inicio=2026-09-05').json()['total_registros'] == 2
    assert api.get('/api/metricas-atencion?fecha_fin=2026-09-05').json()['total_registros'] == 2
    single = api.get('/api/metricas-atencion?fecha=2026-09-05').json()
    assert single['media'] == 20 and single['desviacion_estandar'] is None
    assert single['varianza'] is None and single['coeficiente_variacion'] is None
    empty = api.get('/api/metricas-atencion?fecha=2020-01-01').json()
    assert empty['total_registros'] == 0 and empty['media'] is None
    assert empty['minimo'] is None and empty['percentil_25'] is None
    for query in ['fecha=invalid', 'fecha=2026-09-05&fecha_inicio=2026-09-01', 'fecha_inicio=2026-09-06&fecha_fin=2026-09-01']:
        assert api.get('/api/metricas-atencion?' + query).status_code == 422


def test_manual_values_are_validated_and_not_saved(api):
    response = api.post('/api/metricas-atencion', json={'tiempos': [10, 10]})
    assert response.status_code == 200
    assert response.json()['varianza'] == 0
    assert api.get('/api/metricas-atencion/historial').json() == []
    for values in [[], [0], [-1], ['NaN'], [100000000]]:
        assert api.post('/api/metricas-atencion', json={'tiempos': values}).status_code == 422
