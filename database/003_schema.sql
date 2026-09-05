CREATE TABLE metricas_estadisticas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    huella TEXT NOT NULL UNIQUE,
    fecha_inicio DATE,
    fecha_fin DATE,
    cantidad_registros INTEGER NOT NULL CHECK (cantidad_registros >= 0),
    resultado JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CHECK (fecha_inicio IS NULL OR fecha_fin IS NULL OR fecha_inicio <= fecha_fin)
);
CREATE INDEX metricas_periodo_idx ON metricas_estadisticas (fecha_inicio, fecha_fin);
