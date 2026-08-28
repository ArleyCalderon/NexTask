-- =========================================================
-- NexTask - Esquema inicial de base de datos
-- PostgreSQL
-- =========================================================

-- Permite volver a ejecutar el script durante desarrollo
-- eliminando primero las tablas dependientes.
DROP TABLE IF EXISTS tarea_etiquetas;
DROP TABLE IF EXISTS tareas;
DROP TABLE IF EXISTS etiquetas;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS usuarios;

-- =========================================================
-- USUARIOS
-- =========================================================

CREATE TABLE usuarios (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    ultimo_login_en TIMESTAMPTZ,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_usuarios_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) >= 2)
);

-- Evita correos duplicados incluso si cambia mayúsculas/minúsculas.
CREATE UNIQUE INDEX uq_usuarios_email
    ON usuarios (LOWER(email));


-- =========================================================
-- CATEGORÍAS
-- =========================================================

CREATE TABLE categorias (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nombre VARCHAR(80) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#6366F1',
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_categorias_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_categorias_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) >= 1),

    CONSTRAINT chk_categorias_color
        CHECK (color ~ '^#[0-9A-Fa-f]{6}$'),

    CONSTRAINT uq_categorias_id_usuario
        UNIQUE (id, usuario_id)
);

-- Un usuario no puede tener dos categorías con el mismo nombre.
CREATE UNIQUE INDEX uq_categorias_usuario_nombre
    ON categorias (usuario_id, LOWER(nombre));


-- =========================================================
-- TAREAS
-- =========================================================

CREATE TABLE tareas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    categoria_id BIGINT,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    prioridad VARCHAR(10) NOT NULL DEFAULT 'media',
    completada BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_vencimiento DATE,
    completada_en TIMESTAMPTZ,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_tareas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tareas_categoria_usuario
        FOREIGN KEY (categoria_id, usuario_id)
        REFERENCES categorias(id, usuario_id),

    CONSTRAINT chk_tareas_titulo
        CHECK (CHAR_LENGTH(TRIM(titulo)) >= 1),

    CONSTRAINT chk_tareas_prioridad
        CHECK (prioridad IN ('baja', 'media', 'alta')),

    CONSTRAINT chk_tareas_completada_fecha
        CHECK (
            (completada = TRUE AND completada_en IS NOT NULL)
            OR
            (completada = FALSE AND completada_en IS NULL)
        ),

    CONSTRAINT uq_tareas_id_usuario
        UNIQUE (id, usuario_id)
);


-- =========================================================
-- ETIQUETAS
-- =========================================================

CREATE TABLE etiquetas (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_etiquetas_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_etiquetas_nombre
        CHECK (CHAR_LENGTH(TRIM(nombre)) >= 1),

    CONSTRAINT uq_etiquetas_id_usuario
        UNIQUE (id, usuario_id)
);

CREATE UNIQUE INDEX uq_etiquetas_usuario_nombre
    ON etiquetas (usuario_id, LOWER(nombre));


-- =========================================================
-- RELACIÓN MUCHOS A MUCHOS: TAREAS ↔ ETIQUETAS
-- =========================================================

CREATE TABLE tarea_etiquetas (
    tarea_id BIGINT NOT NULL,
    etiqueta_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_tarea_etiquetas
        PRIMARY KEY (tarea_id, etiqueta_id),

    CONSTRAINT fk_tarea_etiquetas_tarea
        FOREIGN KEY (tarea_id, usuario_id)
        REFERENCES tareas(id, usuario_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_tarea_etiquetas_etiqueta
        FOREIGN KEY (etiqueta_id, usuario_id)
        REFERENCES etiquetas(id, usuario_id)
        ON DELETE CASCADE
);


-- =========================================================
-- ÍNDICES
-- =========================================================

CREATE INDEX idx_tareas_usuario
    ON tareas (usuario_id);

CREATE INDEX idx_tareas_usuario_completada
    ON tareas (usuario_id, completada);

CREATE INDEX idx_tareas_usuario_categoria
    ON tareas (usuario_id, categoria_id);

CREATE INDEX idx_tareas_usuario_prioridad
    ON tareas (usuario_id, prioridad);

CREATE INDEX idx_tareas_usuario_fecha_vencimiento
    ON tareas (usuario_id, fecha_vencimiento);

CREATE INDEX idx_tareas_usuario_creado_en
    ON tareas (usuario_id, creado_en DESC);

CREATE INDEX idx_tareas_creado_en
    ON tareas (creado_en);

CREATE INDEX idx_tareas_completada_en
    ON tareas (completada_en)
    WHERE completada_en IS NOT NULL;

CREATE INDEX idx_tarea_etiquetas_etiqueta
    ON tarea_etiquetas (etiqueta_id);


-- =========================================================
-- ACTUALIZACIÓN AUTOMÁTICA DE actualizado_en
-- =========================================================

CREATE OR REPLACE FUNCTION establecer_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_usuarios_actualizado_en
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION establecer_actualizado_en();


CREATE TRIGGER trg_categorias_actualizado_en
BEFORE UPDATE ON categorias
FOR EACH ROW
EXECUTE FUNCTION establecer_actualizado_en();


CREATE TRIGGER trg_tareas_actualizado_en
BEFORE UPDATE ON tareas
FOR EACH ROW
EXECUTE FUNCTION establecer_actualizado_en();


CREATE TRIGGER trg_etiquetas_actualizado_en
BEFORE UPDATE ON etiquetas
FOR EACH ROW
EXECUTE FUNCTION establecer_actualizado_en();