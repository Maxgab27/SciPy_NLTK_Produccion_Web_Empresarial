CREATE TABLE clientes (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL CHECK (length(trim(nombre)) > 0),
    empresa VARCHAR(200) NOT NULL DEFAULT '',
    correo VARCHAR(200) NOT NULL DEFAULT '',
    telefono VARCHAR(50) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX clientes_nombre_idx ON clientes (lower(nombre));
CREATE TABLE comentarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    contenido TEXT NOT NULL CHECK (length(trim(contenido)) BETWEEN 1 AND 10000),
    fecha DATE NOT NULL,
    estado VARCHAR(30) NOT NULL DEFAULT 'pendiente',
    categoria VARCHAR(100),
    procesado BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (id, cliente_id)
);
CREATE INDEX comentarios_fecha_idx ON comentarios (fecha, id);
CREATE INDEX comentarios_cliente_idx ON comentarios (cliente_id);
CREATE TABLE tiempos_atencion (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    comentario_id BIGINT NOT NULL UNIQUE,
    tiempo_minutos NUMERIC(10,2) NOT NULL CHECK (tiempo_minutos > 0 AND tiempo_minutos <> 'NaN'::numeric),
    fecha DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (comentario_id, cliente_id) REFERENCES comentarios(id, cliente_id)
);
CREATE INDEX tiempos_fecha_idx ON tiempos_atencion (fecha);
CREATE INDEX tiempos_cliente_idx ON tiempos_atencion (cliente_id);
