# Centro Inteligente de Atención

React + TypeScript / FastAPI / PostgreSQL 17. Paso 3: estadísticas de atenciones reales con filtros y resultados persistentes. NLP y los gráficos superiores del dashboard todavía usan ejemplos educativos.

## Arranque con Docker

En este equipo Windows también puedes ejecutar `powershell -ExecutionPolicy Bypass -File .\Start-Local.ps1` desde la raíz. Inicia una base independiente en 127.0.0.1:55440 y la API en 127.0.0.1:8000; conserva los datos y la configuración local en `.local/` (excluida de Git). Ejecuta el comando nuevamente después de reiniciar Windows. El frontend se inicia por separado con `npm run dev` en `frontend`. Los logs quedan en `.local/api-error.log` y `.local/postgres.log`.

1. Inicia Docker Desktop.
2. Copia `.env.example` a `.env` y configura una contraseña propia.
3. Ejecuta `docker compose up --build -d` desde la raíz. La API aplica migraciones después del healthcheck de PostgreSQL.
4. En `frontend`, ejecuta `npm install` y `npm run dev`. Abre http://localhost:5173. API: http://localhost:8000/docs.

El volumen `postgres_data` conserva los datos al reiniciar o ejecutar `docker compose down`. No uses `down -v` si necesitas conservarlos. No se insertan datos de demostración automáticamente.

## Python y PostgreSQL sin Docker

Desde `backend`, crea un entorno Python 3.12 e instala `requirements.txt`. Configura `DATABASE_URL` en el entorno con una base dedicada, por ejemplo `postgresql://usuario:password@localhost:5433/empresa_inteligente` (codifica caracteres especiales de la contraseña en URLs). El backend no carga `.env` automáticamente.

```powershell
$env:DATABASE_URL = 'postgresql://usuario:password@localhost:5433/empresa_inteligente'
python -m app.database.migrate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Las migraciones `database/NNN_schema.sql` se aplican en orden, con transacción, bloqueo y checksum. No edites una migración aplicada: agrega la siguiente. `002_seed.sql` está reservado y no se ejecuta.

## Flujo y API

- `POST /api/clientes`: nombre, empresa, correo y teléfono; `GET /api/clientes` y `GET /api/clientes/{id}` incluyen conteo y promedio real de atenciones.
- `POST /api/comentarios`: `cliente_id` o `cliente_nombre`, `fecha` (YYYY-MM-DD), `comentario` y `tiempo_atencion_minutos` positivo con hasta dos decimales. Guarda comentario y tiempo en una sola transacción; devuelve 201 después del commit.
- `GET /api/comentarios?fecha=2026-09-05&cliente_id=1`: historial filtrado.

Los formularios actuales usan el nombre: reutilizan una coincidencia exacta ignorando mayúsculas, o crean un cliente si no existe. Si hay homónimos devuelven 409; la API permite seleccionar por ID. No se asigna sentimiento ni categoría artificial al registrar. La selección por ID en formularios y edición de clientes queda para gestión operativa posterior.

Modelo: clientes 1:N comentarios; comentarios 1:1 tiempos_atencion; cada tiempo pertenece al mismo cliente de su comentario. Fechas corresponden al día de atención y se guardan como DATE; created_at conserva la fecha técnica con zona horaria.

## Verificación

### Estadísticas de atención

`GET /api/metricas-atencion` calcula sobre PostgreSQL. Acepta `fecha=YYYY-MM-DD` o un rango inclusivo `fecha_inicio` / `fecha_fin`; los límites pueden omitirse. El dashboard comparte su fecha con el historial y la pantalla Métricas ofrece un rango.

Devuelve cantidad, media, mediana, desviación y varianza muestrales (`ddof=1`, SciPy), mínimo, máximo, percentiles lineales 25/75 y CV. Sin atenciones devuelve indicadores nulos; con una sola, la dispersión y CV son nulos. CV <20%, 20–<40% y ≥40% son bandas orientativas, no criterios contractuales de calidad.

Cada conjunto de entradas y filtro se guarda en `metricas_estadisticas`, con IDs de origen, versión del cálculo y fecha. Consultas idénticas reutilizan el resultado; cambios de datos generan uno nuevo. `GET /api/metricas-atencion/historial?limit=20` consulta resultados guardados. Los valores se redondean a cuatro decimales después del cálculo. `POST /api/metricas-atencion` mantiene los ejercicios manuales, valida valores positivos y no los incorpora al historial empresarial.

Frontend: `npm run typecheck`, `node --test tests/http.test.mjs`, `npm run build`.

Backend: instala `pytest httpx`, configura `TEST_DATABASE_URL` hacia una base de pruebas PostgreSQL y ejecuta `python -m pytest tests -q` desde `backend`. Cada prueba crea y elimina solo un esquema propio con nombre aleatorio. Comprueba persistencia desde otro proceso, filtros, relaciones, validación y rollback.

La autenticación, roles, análisis integrado y preparación de producción siguen pendientes. Usa esta etapa en desarrollo local.
