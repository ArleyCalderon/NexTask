-- =========================================================
-- NexTask - Datos de ejemplo
-- PostgreSQL
-- =========================================================
-- Contraseña de los tres usuarios demo: Demo123!
-- Los hashes fueron generados con bcrypt (cost factor 12).
--
-- Este script es idempotente para desarrollo:
-- limpia los datos existentes y reinicia las identidades.
-- =========================================================

BEGIN;

TRUNCATE TABLE
    tarea_etiquetas,
    tareas,
    etiquetas,
    categorias,
    usuarios
RESTART IDENTITY CASCADE;


-- =========================================================
-- USUARIOS
-- =========================================================

INSERT INTO usuarios (
    nombre,
    email,
    password_hash,
    ultimo_login_en,
    creado_en
)
VALUES
(
    'Usuario Demo',
    'demo@nextask.local',
    '$2b$12$1LGxeXU/gIwh9Bu7EQ2o7.QAoeZtj/Jbp5khD/GHp2149c8g5oipa',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '14 months'
),
(
    'Ana Torres',
    'ana@nextask.local',
    '$2b$12$naFWvlxpXXN4U/fLq8FmgepG5QeNUx6GwINwcxffRRB6L13RtOYgi',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '13 months'
),
(
    'Carlos Ruiz',
    'carlos@nextask.local',
    '$2b$12$ik4.Ol3fF2oj7RijvDOsxewghiR4ThQrzmoWCECpfVt.SDsH80ZyW',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '12 months'
);


-- =========================================================
-- CATEGORÍAS
-- =========================================================

INSERT INTO categorias (usuario_id, nombre, color)
SELECT u.id, datos.nombre, datos.color
FROM usuarios u
JOIN (
    VALUES
        ('demo@nextask.local',   'Trabajo',    '#2563EB'),
        ('demo@nextask.local',   'Personal',   '#16A34A'),
        ('demo@nextask.local',   'Estudio',    '#9333EA'),

        ('ana@nextask.local',    'Marketing',  '#DB2777'),
        ('ana@nextask.local',    'Personal',   '#16A34A'),
        ('ana@nextask.local',    'Equipo',      '#EA580C'),

        ('carlos@nextask.local', 'Desarrollo', '#2563EB'),
        ('carlos@nextask.local', 'Soporte',    '#DC2626'),
        ('carlos@nextask.local', 'Personal',   '#16A34A')
) AS datos(email, nombre, color)
    ON datos.email = u.email;


-- =========================================================
-- ETIQUETAS
-- =========================================================

INSERT INTO etiquetas (usuario_id, nombre)
SELECT u.id, datos.nombre
FROM usuarios u
JOIN (
    VALUES
        ('demo@nextask.local',   'urgente'),
        ('demo@nextask.local',   'backend'),
        ('demo@nextask.local',   'frontend'),
        ('demo@nextask.local',   'reunión'),
        ('demo@nextask.local',   'estudio'),

        ('ana@nextask.local',    'urgente'),
        ('ana@nextask.local',    'cliente'),
        ('ana@nextask.local',    'campaña'),
        ('ana@nextask.local',    'reunión'),

        ('carlos@nextask.local', 'urgente'),
        ('carlos@nextask.local', 'bug'),
        ('carlos@nextask.local', 'backend'),
        ('carlos@nextask.local', 'soporte')
) AS datos(email, nombre)
    ON datos.email = u.email;


-- =========================================================
-- TAREAS
-- =========================================================
-- Se usan fechas relativas a NOW()/CURRENT_DATE para que
-- los datos sigan siendo útiles sin importar cuándo se ejecute.
-- =========================================================

WITH datos_tareas (
    email,
    categoria,
    titulo,
    descripcion,
    prioridad,
    completada,
    fecha_vencimiento,
    creado_en,
    completada_en
) AS (
    VALUES

    -- -----------------------------------------------------
    -- Usuario Demo
    -- -----------------------------------------------------
    (
        'demo@nextask.local',
        'Trabajo',
        'Preparar sustentación técnica',
        'Repasar arquitectura, seguridad y decisiones de diseño.',
        'alta',
        FALSE,
        CURRENT_DATE + 3,
        date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '18 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Documentar API',
        'Completar ejemplos de request y response de los endpoints.',
        'media',
        FALSE,
        CURRENT_DATE + 5,
        date_trunc('day', NOW()) - INTERVAL '4 days' + INTERVAL '10 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Corregir filtro de prioridades',
        'Validar combinación de prioridad y estado de completado.',
        'alta',
        TRUE,
        CURRENT_DATE - 1,
        date_trunc('day', NOW()) - INTERVAL '6 days' + INTERVAL '14 hours',
        date_trunc('day', NOW()) - INTERVAL '5 days' + INTERVAL '16 hours'
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Diseñar esquema PostgreSQL',
        'Definir relaciones, constraints e índices.',
        'alta',
        TRUE,
        CURRENT_DATE - 7,
        date_trunc('day', NOW()) - INTERVAL '9 days' + INTERVAL '18 hours',
        date_trunc('day', NOW()) - INTERVAL '8 days' + INTERVAL '19 hours'
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Actualizar dependencias',
        'Revisar librerías principales del backend.',
        'baja',
        TRUE,
        CURRENT_DATE - 12,
        date_trunc('day', NOW()) - INTERVAL '14 days' + INTERVAL '9 hours',
        date_trunc('day', NOW()) - INTERVAL '13 days' + INTERVAL '11 hours'
    ),
    (
        'demo@nextask.local',
        'Estudio',
        'Leer documentación de React Router',
        'Revisar navegación y rutas protegidas.',
        'media',
        TRUE,
        CURRENT_DATE - 18,
        date_trunc('day', NOW()) - INTERVAL '20 days' + INTERVAL '20 hours',
        date_trunc('day', NOW()) - INTERVAL '19 days' + INTERVAL '21 hours'
    ),
    (
        'demo@nextask.local',
        'Personal',
        'Revisar tareas personales',
        'Organizar pendientes de la semana.',
        'baja',
        FALSE,
        CURRENT_DATE - 3,
        date_trunc('day', NOW()) - INTERVAL '12 days' + INTERVAL '8 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Preparar retrospectiva',
        'Registrar aprendizajes del sprint.',
        'media',
        TRUE,
        CURRENT_DATE - 26,
        date_trunc('day', NOW()) - INTERVAL '28 days' + INTERVAL '15 hours',
        date_trunc('day', NOW()) - INTERVAL '27 days' + INTERVAL '17 hours'
    ),
    (
        'demo@nextask.local',
        NULL,
        'Organizar archivos del proyecto',
        'Eliminar archivos temporales y ordenar documentación.',
        'baja',
        TRUE,
        CURRENT_DATE - 32,
        date_trunc('day', NOW()) - INTERVAL '35 days' + INTERVAL '11 hours',
        date_trunc('day', NOW()) - INTERVAL '34 days' + INTERVAL '12 hours'
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Optimizar consultas SQL',
        'Revisar índices y planes de ejecución.',
        'alta',
        TRUE,
        CURRENT_DATE - 42,
        date_trunc('day', NOW()) - INTERVAL '45 days' + INTERVAL '19 hours',
        date_trunc('day', NOW()) - INTERVAL '43 days' + INTERVAL '21 hours'
    ),
    (
        'demo@nextask.local',
        'Personal',
        'Actualizar portafolio',
        'Agregar proyectos recientes.',
        'baja',
        FALSE,
        CURRENT_DATE + 20,
        date_trunc('day', NOW()) - INTERVAL '55 days' + INTERVAL '9 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'demo@nextask.local',
        'Estudio',
        'Curso de seguridad web',
        'Repasar autenticación, autorización y OWASP.',
        'media',
        TRUE,
        CURRENT_DATE - 65,
        date_trunc('day', NOW()) - INTERVAL '70 days' + INTERVAL '20 hours',
        date_trunc('day', NOW()) - INTERVAL '67 days' + INTERVAL '22 hours'
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Refactorizar módulo de autenticación',
        'Separar responsabilidades del servicio de autenticación.',
        'alta',
        TRUE,
        CURRENT_DATE - 115,
        date_trunc('day', NOW()) - INTERVAL '120 days' + INTERVAL '10 hours',
        date_trunc('day', NOW()) - INTERVAL '117 days' + INTERVAL '13 hours'
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Probar despliegue en staging',
        'Validar variables de entorno y conectividad.',
        'media',
        TRUE,
        CURRENT_DATE - 175,
        date_trunc('day', NOW()) - INTERVAL '180 days' + INTERVAL '16 hours',
        date_trunc('day', NOW()) - INTERVAL '178 days' + INTERVAL '18 hours'
    ),
    (
        'demo@nextask.local',
        'Trabajo',
        'Revisar accesibilidad',
        'Verificar navegación por teclado y contraste.',
        'baja',
        FALSE,
        CURRENT_DATE - 230,
        date_trunc('day', NOW()) - INTERVAL '250 days' + INTERVAL '14 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'demo@nextask.local',
        'Personal',
        'Planificar versión anual',
        'Organizar objetivos y entregables del año.',
        'media',
        TRUE,
        CURRENT_DATE - 320,
        date_trunc('day', NOW()) - INTERVAL '330 days' + INTERVAL '8 hours',
        date_trunc('day', NOW()) - INTERVAL '325 days' + INTERVAL '10 hours'
    ),

    -- -----------------------------------------------------
    -- Ana Torres
    -- -----------------------------------------------------
    (
        'ana@nextask.local',
        'Marketing',
        'Crear campaña de lanzamiento',
        'Preparar contenido y segmentación.',
        'alta',
        TRUE,
        CURRENT_DATE,
        date_trunc('day', NOW()) - INTERVAL '3 days' + INTERVAL '9 hours',
        date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '14 hours'
    ),
    (
        'ana@nextask.local',
        'Marketing',
        'Reunión con cliente',
        'Presentar avances y recopilar feedback.',
        'media',
        TRUE,
        CURRENT_DATE - 8,
        date_trunc('day', NOW()) - INTERVAL '10 days' + INTERVAL '11 hours',
        date_trunc('day', NOW()) - INTERVAL '9 days' + INTERVAL '12 hours'
    ),
    (
        'ana@nextask.local',
        'Marketing',
        'Analizar métricas semanales',
        'Revisar conversión y rendimiento de campañas.',
        'media',
        FALSE,
        CURRENT_DATE + 2,
        date_trunc('day', NOW()) - INTERVAL '8 days' + INTERVAL '8 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'ana@nextask.local',
        'Marketing',
        'Preparar piezas de campaña',
        'Coordinar diseños pendientes.',
        'alta',
        FALSE,
        CURRENT_DATE - 2,
        date_trunc('day', NOW()) - INTERVAL '15 days' + INTERVAL '13 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'ana@nextask.local',
        'Equipo',
        'Actualizar calendario editorial',
        'Sincronizar fechas con el equipo.',
        'baja',
        TRUE,
        CURRENT_DATE - 20,
        date_trunc('day', NOW()) - INTERVAL '22 days' + INTERVAL '15 hours',
        date_trunc('day', NOW()) - INTERVAL '21 days' + INTERVAL '16 hours'
    ),
    (
        'ana@nextask.local',
        'Marketing',
        'Preparar informe mensual',
        'Consolidar resultados y recomendaciones.',
        'alta',
        TRUE,
        CURRENT_DATE - 29,
        date_trunc('day', NOW()) - INTERVAL '31 days' + INTERVAL '17 hours',
        date_trunc('day', NOW()) - INTERVAL '30 days' + INTERVAL '18 hours'
    ),
    (
        'ana@nextask.local',
        'Marketing',
        'Encuesta de clientes',
        'Analizar respuestas de satisfacción.',
        'media',
        TRUE,
        CURRENT_DATE - 47,
        date_trunc('day', NOW()) - INTERVAL '50 days' + INTERVAL '10 hours',
        date_trunc('day', NOW()) - INTERVAL '48 days' + INTERVAL '13 hours'
    ),
    (
        'ana@nextask.local',
        'Equipo',
        'Plan de contenidos trimestral',
        'Definir calendario para el siguiente trimestre.',
        'media',
        TRUE,
        CURRENT_DATE - 90,
        date_trunc('day', NOW()) - INTERVAL '95 days' + INTERVAL '14 hours',
        date_trunc('day', NOW()) - INTERVAL '92 days' + INTERVAL '17 hours'
    ),
    (
        'ana@nextask.local',
        'Marketing',
        'Revisión de campaña histórica',
        'Comparar desempeño contra campañas anteriores.',
        'baja',
        TRUE,
        CURRENT_DATE - 155,
        date_trunc('day', NOW()) - INTERVAL '160 days' + INTERVAL '9 hours',
        date_trunc('day', NOW()) - INTERVAL '157 days' + INTERVAL '11 hours'
    ),
    (
        'ana@nextask.local',
        'Equipo',
        'Planificación Q1',
        'Definir objetivos del siguiente periodo.',
        'alta',
        TRUE,
        CURRENT_DATE - 290,
        date_trunc('day', NOW()) - INTERVAL '300 days' + INTERVAL '16 hours',
        date_trunc('day', NOW()) - INTERVAL '295 days' + INTERVAL '18 hours'
    ),

    -- -----------------------------------------------------
    -- Carlos Ruiz
    -- -----------------------------------------------------
    (
        'carlos@nextask.local',
        'Desarrollo',
        'Corregir error de login',
        'Resolver fallo reportado en autenticación.',
        'alta',
        TRUE,
        CURRENT_DATE,
        date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '7 hours',
        date_trunc('day', NOW()) - INTERVAL '1 day' + INTERVAL '10 hours'
    ),
    (
        'carlos@nextask.local',
        'Soporte',
        'Responder ticket crítico',
        'Investigar incidencia reportada por soporte.',
        'alta',
        FALSE,
        CURRENT_DATE - 1,
        date_trunc('day', NOW()) - INTERVAL '2 days' + INTERVAL '6 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'carlos@nextask.local',
        'Desarrollo',
        'Revisar logs de producción',
        'Analizar eventos y errores recientes.',
        'media',
        TRUE,
        CURRENT_DATE - 5,
        date_trunc('day', NOW()) - INTERVAL '7 days' + INTERVAL '8 hours',
        date_trunc('day', NOW()) - INTERVAL '6 days' + INTERVAL '9 hours'
    ),
    (
        'carlos@nextask.local',
        'Desarrollo',
        'Actualizar endpoint de tareas',
        'Agregar nuevas validaciones al endpoint.',
        'media',
        FALSE,
        CURRENT_DATE + 4,
        date_trunc('day', NOW()) - INTERVAL '16 days' + INTERVAL '17 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'carlos@nextask.local',
        'Desarrollo',
        'Pruebas de regresión',
        'Ejecutar pruebas sobre funcionalidades críticas.',
        'alta',
        TRUE,
        CURRENT_DATE - 21,
        date_trunc('day', NOW()) - INTERVAL '23 days' + INTERVAL '13 hours',
        date_trunc('day', NOW()) - INTERVAL '22 days' + INTERVAL '15 hours'
    ),
    (
        'carlos@nextask.local',
        'Soporte',
        'Documentar incidencia',
        'Registrar causa raíz y solución.',
        'baja',
        TRUE,
        CURRENT_DATE - 27,
        date_trunc('day', NOW()) - INTERVAL '29 days' + INTERVAL '20 hours',
        date_trunc('day', NOW()) - INTERVAL '28 days' + INTERVAL '21 hours'
    ),
    (
        'carlos@nextask.local',
        'Desarrollo',
        'Migrar servicio interno',
        'Mover servicio a nueva configuración.',
        'alta',
        TRUE,
        CURRENT_DATE - 37,
        date_trunc('day', NOW()) - INTERVAL '40 days' + INTERVAL '12 hours',
        date_trunc('day', NOW()) - INTERVAL '38 days' + INTERVAL '18 hours'
    ),
    (
        'carlos@nextask.local',
        'Soporte',
        'Revisar alertas antiguas',
        'Depurar alertas pendientes.',
        'baja',
        FALSE,
        CURRENT_DATE - 20,
        date_trunc('day', NOW()) - INTERVAL '60 days' + INTERVAL '11 hours',
        NULL::TIMESTAMPTZ
    ),
    (
        'carlos@nextask.local',
        'Desarrollo',
        'Auditar permisos API',
        'Validar autorización entre recursos de usuarios.',
        'alta',
        TRUE,
        CURRENT_DATE - 80,
        date_trunc('day', NOW()) - INTERVAL '85 days' + INTERVAL '9 hours',
        date_trunc('day', NOW()) - INTERVAL '82 days' + INTERVAL '12 hours'
    ),
    (
        'carlos@nextask.local',
        'Desarrollo',
        'Mantenimiento trimestral',
        'Actualizar componentes y revisar métricas.',
        'media',
        TRUE,
        CURRENT_DATE - 185,
        date_trunc('day', NOW()) - INTERVAL '190 days' + INTERVAL '8 hours',
        date_trunc('day', NOW()) - INTERVAL '187 days' + INTERVAL '13 hours'
    )
)
INSERT INTO tareas (
    usuario_id,
    categoria_id,
    titulo,
    descripcion,
    prioridad,
    completada,
    fecha_vencimiento,
    creado_en,
    completada_en,
    actualizado_en
)
SELECT
    u.id,
    c.id,
    d.titulo,
    d.descripcion,
    d.prioridad,
    d.completada,
    d.fecha_vencimiento,
    d.creado_en,
    d.completada_en,
    COALESCE(d.completada_en, d.creado_en)
FROM datos_tareas d
JOIN usuarios u
    ON u.email = d.email
LEFT JOIN categorias c
    ON c.usuario_id = u.id
   AND c.nombre = d.categoria;


-- =========================================================
-- RELACIONES TAREA ↔ ETIQUETA
-- =========================================================

WITH relaciones (email, titulo, etiqueta) AS (
    VALUES
        ('demo@nextask.local',   'Preparar sustentación técnica',      'urgente'),
        ('demo@nextask.local',   'Preparar sustentación técnica',      'estudio'),
        ('demo@nextask.local',   'Documentar API',                     'backend'),
        ('demo@nextask.local',   'Corregir filtro de prioridades',     'backend'),
        ('demo@nextask.local',   'Diseñar esquema PostgreSQL',         'backend'),
        ('demo@nextask.local',   'Leer documentación de React Router', 'frontend'),
        ('demo@nextask.local',   'Leer documentación de React Router', 'estudio'),
        ('demo@nextask.local',   'Preparar retrospectiva',             'reunión'),
        ('demo@nextask.local',   'Optimizar consultas SQL',            'backend'),
        ('demo@nextask.local',   'Curso de seguridad web',             'estudio'),
        ('demo@nextask.local',   'Refactorizar módulo de autenticación','backend'),
        ('demo@nextask.local',   'Probar despliegue en staging',       'backend'),

        ('ana@nextask.local',    'Crear campaña de lanzamiento',       'campaña'),
        ('ana@nextask.local',    'Crear campaña de lanzamiento',       'urgente'),
        ('ana@nextask.local',    'Reunión con cliente',                'cliente'),
        ('ana@nextask.local',    'Reunión con cliente',                'reunión'),
        ('ana@nextask.local',    'Preparar piezas de campaña',         'campaña'),
        ('ana@nextask.local',    'Preparar piezas de campaña',         'urgente'),
        ('ana@nextask.local',    'Preparar informe mensual',           'cliente'),

        ('carlos@nextask.local', 'Corregir error de login',            'bug'),
        ('carlos@nextask.local', 'Corregir error de login',            'backend'),
        ('carlos@nextask.local', 'Responder ticket crítico',           'soporte'),
        ('carlos@nextask.local', 'Responder ticket crítico',           'urgente'),
        ('carlos@nextask.local', 'Actualizar endpoint de tareas',      'backend'),
        ('carlos@nextask.local', 'Pruebas de regresión',               'bug'),
        ('carlos@nextask.local', 'Documentar incidencia',              'soporte'),
        ('carlos@nextask.local', 'Auditar permisos API',               'backend')
)
INSERT INTO tarea_etiquetas (
    tarea_id,
    etiqueta_id,
    usuario_id
)
SELECT
    t.id,
    e.id,
    u.id
FROM relaciones r
JOIN usuarios u
    ON u.email = r.email
JOIN tareas t
    ON t.usuario_id = u.id
   AND t.titulo = r.titulo
JOIN etiquetas e
    ON e.usuario_id = u.id
   AND e.nombre = r.etiqueta;


COMMIT;


-- =========================================================
-- VALIDACIÓN RÁPIDA
-- =========================================================

SELECT 'usuarios' AS entidad, COUNT(*) AS cantidad FROM usuarios
UNION ALL
SELECT 'categorias', COUNT(*) FROM categorias
UNION ALL
SELECT 'etiquetas', COUNT(*) FROM etiquetas
UNION ALL
SELECT 'tareas', COUNT(*) FROM tareas
UNION ALL
SELECT 'tarea_etiquetas', COUNT(*) FROM tarea_etiquetas
ORDER BY entidad;
