-- ============================================================
-- NexTask - Consultas de Inteligencia de Negocio
-- Reto técnico Full-Stack - Fracttal
-- Autor: Arley Calderón
-- Motor: PostgreSQL
-- ============================================================
--
-- Este archivo contiene las 10 consultas BI solicitadas en el reto.
-- Cada bloque incluye:
--   1. Pregunta de negocio.
--   2. Consulta SQL.
--   3. Formato de salida esperado.
--   4. Ejemplo de resultado obtenido con el seed de demostración.
--
-- NOTA:
-- Los resultados de ejemplo dependen de la fecha de ejecución y del
-- contenido actual de la base de datos. El seed utiliza fechas relativas,
-- por lo que los valores pueden cambiar al reconstruir el entorno.
-- ============================================================


-- ============================================================
-- 1. ANÁLISIS DE PARTICIPACIÓN DE USUARIOS
-- ============================================================
-- Pregunta:
-- ¿Cuál es el promedio de tareas creadas por usuario en los últimos
-- 30 días y cómo se compara con los 30 días anteriores?
--
-- Formato esperado:
-- promedio_ultimos_30_dias
-- promedio_30_dias_anteriores
-- variacion_porcentual
--
-- Resultado de ejemplo:
-- 3.71 | 0.86 | 333.33
-- ============================================================

WITH tareas_por_usuario AS (
    SELECT
        u.id,
        u.nombre,

        COUNT(t.id) FILTER (
            WHERE t.creado_en >= NOW() - INTERVAL '30 days'
              AND t.creado_en < NOW()
        ) AS tareas_ultimos_30_dias,

        COUNT(t.id) FILTER (
            WHERE t.creado_en >= NOW() - INTERVAL '60 days'
              AND t.creado_en < NOW() - INTERVAL '30 days'
        ) AS tareas_30_dias_anteriores

    FROM usuarios u

    LEFT JOIN tareas t
        ON t.usuario_id = u.id
       AND t.creado_en >= NOW() - INTERVAL '60 days'
       AND t.creado_en < NOW()

    GROUP BY
        u.id,
        u.nombre
),

resumen AS (
    SELECT
        AVG(tareas_ultimos_30_dias)::NUMERIC
            AS promedio_ultimos_30_dias,

        AVG(tareas_30_dias_anteriores)::NUMERIC
            AS promedio_30_dias_anteriores

    FROM tareas_por_usuario
)

SELECT
    ROUND(
        promedio_ultimos_30_dias,
        2
    ) AS promedio_ultimos_30_dias,

    ROUND(
        promedio_30_dias_anteriores,
        2
    ) AS promedio_30_dias_anteriores,

    ROUND(
        (
            promedio_ultimos_30_dias
            - promedio_30_dias_anteriores
        )
        / NULLIF(
            promedio_30_dias_anteriores,
            0
        )
        * 100,
        2
    ) AS variacion_porcentual

FROM resumen;


-- ============================================================
-- 2. TENDENCIAS DE TASA DE COMPLETADO
-- ============================================================
-- Pregunta:
-- ¿Cuál es la tasa diaria de completado de tareas, desglosada por
-- prioridad, durante los últimos 90 días?
--
-- Interpretación:
-- Para cada fecha de creación y prioridad se calcula qué porcentaje
-- de las tareas creadas ese día se encuentran completadas.
--
-- Formato esperado:
-- fecha
-- prioridad
-- tareas_creadas
-- tareas_completadas
-- tasa_completado_porcentaje
--
-- Ejemplos obtenidos:
-- 2026-06-04 | alta  | 1 | 1 | 100.00
-- 2026-08-26 | alta  | 2 | 0 |   0.00
-- 2026-08-29 | media | 3 | 0 |   0.00
-- ============================================================

SELECT
    t.creado_en::date AS fecha,
    t.prioridad,
    COUNT(*) AS tareas_creadas,

    COUNT(*) FILTER (
        WHERE t.completada = TRUE
    ) AS tareas_completadas,

    ROUND(
        COUNT(*) FILTER (
            WHERE t.completada = TRUE
        )::numeric
        / NULLIF(COUNT(*), 0)
        * 100,
        2
    ) AS tasa_completado_porcentaje

FROM tareas t

WHERE t.creado_en >= CURRENT_DATE - INTERVAL '89 days'
  AND t.creado_en < CURRENT_DATE + INTERVAL '1 day'

GROUP BY
    t.creado_en::date,
    t.prioridad

ORDER BY
    fecha ASC,
    CASE t.prioridad
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        WHEN 'baja' THEN 3
    END;


-- ============================================================
-- 3. ANÁLISIS DE RENDIMIENTO POR CATEGORÍA
-- ============================================================
-- Pregunta:
-- ¿Qué categorías tienen las mayores tasas de completado y cuál es
-- el tiempo promedio de completado por categoría?
-- Identificar también categorías con menos de 5 tareas.
--
-- Formato esperado:
-- categoria_id
-- categoria
-- total_tareas
-- tareas_completadas
-- tasa_completado_porcentaje
-- tiempo_promedio_completado_horas
-- menos_de_5_tareas
--
-- Ejemplos obtenidos:
-- Trabajo     | 14 | 7 | 50.00  | 39.71 | No
-- Desarrollo  |  7 | 6 | 85.71  | 43.33 | No
-- Equipo      |  3 | 3 | 100.00 | 74.00 | Sí
-- ============================================================

SELECT
    c.id AS categoria_id,
    c.nombre AS categoria,
    COUNT(t.id) AS total_tareas,

    COUNT(t.id) FILTER (
        WHERE t.completada = TRUE
    ) AS tareas_completadas,

    ROUND(
        COALESCE(
            COUNT(t.id) FILTER (
                WHERE t.completada = TRUE
            )::numeric
            / NULLIF(COUNT(t.id), 0)
            * 100,
            0
        ),
        2
    ) AS tasa_completado_porcentaje,

    ROUND(
        AVG(
            EXTRACT(
                EPOCH FROM (
                    t.completada_en - t.creado_en
                )
            ) / 3600
        ) FILTER (
            WHERE t.completada = TRUE
              AND t.completada_en IS NOT NULL
        )::numeric,
        2
    ) AS tiempo_promedio_completado_horas,

    CASE
        WHEN COUNT(t.id) < 5
            THEN 'Sí'
        ELSE 'No'
    END AS menos_de_5_tareas

FROM categorias c

LEFT JOIN tareas t
    ON t.categoria_id = c.id
   AND t.usuario_id = c.usuario_id

GROUP BY
    c.id,
    c.nombre

ORDER BY
    total_tareas DESC,
    c.nombre ASC;


-- ============================================================
-- 4. HORAS DE MAYOR PRODUCTIVIDAD
-- ============================================================
-- Pregunta:
-- ¿En qué horas y días de la semana se crean y completan más tareas?
--
-- Formato esperado:
-- dia_semana
-- hora
-- tareas_creadas
-- tareas_completadas
-- actividad_total
--
-- Resultado destacado obtenido:
-- Sábado | 9 | 5 | 1 | 6
-- ============================================================

WITH actividad AS (
    SELECT
        'creacion' AS tipo,
        creado_en AS momento
    FROM tareas

    UNION ALL

    SELECT
        'completado' AS tipo,
        completada_en AS momento
    FROM tareas
    WHERE completada_en IS NOT NULL
),

resumen AS (
    SELECT
        EXTRACT(ISODOW FROM momento)::integer
            AS numero_dia,

        CASE EXTRACT(ISODOW FROM momento)::integer
            WHEN 1 THEN 'Lunes'
            WHEN 2 THEN 'Martes'
            WHEN 3 THEN 'Miércoles'
            WHEN 4 THEN 'Jueves'
            WHEN 5 THEN 'Viernes'
            WHEN 6 THEN 'Sábado'
            WHEN 7 THEN 'Domingo'
        END AS dia_semana,

        EXTRACT(HOUR FROM momento)::integer
            AS hora,

        COUNT(*) FILTER (
            WHERE tipo = 'creacion'
        ) AS tareas_creadas,

        COUNT(*) FILTER (
            WHERE tipo = 'completado'
        ) AS tareas_completadas

    FROM actividad

    GROUP BY
        EXTRACT(ISODOW FROM momento),
        EXTRACT(HOUR FROM momento)
)

SELECT
    dia_semana,
    hora,
    tareas_creadas,
    tareas_completadas,
    tareas_creadas + tareas_completadas
        AS actividad_total

FROM resumen

ORDER BY
    actividad_total DESC,
    tareas_completadas DESC,
    tareas_creadas DESC,
    numero_dia ASC,
    hora ASC;


-- ============================================================
-- 5. ANÁLISIS DE TAREAS VENCIDAS
-- ============================================================
-- Pregunta:
-- ¿Cuántas tareas vencidas existen por usuario y categoría y cuál
-- es el promedio de días que llevan vencidas?
--
-- Formato esperado:
-- usuario_id
-- usuario
-- categoria
-- tareas_vencidas
-- promedio_dias_vencidas
-- maximo_dias_vencida
--
-- Resultados de ejemplo:
-- Carlos Ruiz      | Soporte  | 2 | 11.50 | 21
-- Arley Calderón   | Trabajo  | 1 | 231.00 | 231
-- Ana Torres       | Marketing| 1 | 3.00 | 3
-- ============================================================

SELECT
    u.id AS usuario_id,
    u.nombre AS usuario,

    COALESCE(
        c.nombre,
        'Sin categoría'
    ) AS categoria,

    COUNT(t.id) AS tareas_vencidas,

    ROUND(
        AVG(
            CURRENT_DATE
            - t.fecha_vencimiento
        )::numeric,
        2
    ) AS promedio_dias_vencidas,

    MAX(
        CURRENT_DATE
        - t.fecha_vencimiento
    ) AS maximo_dias_vencida

FROM tareas t

JOIN usuarios u
    ON u.id = t.usuario_id

LEFT JOIN categorias c
    ON c.id = t.categoria_id
   AND c.usuario_id = t.usuario_id

WHERE t.completada = FALSE
  AND t.fecha_vencimiento IS NOT NULL
  AND t.fecha_vencimiento < CURRENT_DATE

GROUP BY
    u.id,
    u.nombre,
    c.id,
    c.nombre

ORDER BY
    tareas_vencidas DESC,
    promedio_dias_vencidas DESC,
    usuario ASC,
    categoria ASC;


-- ============================================================
-- 6. ANÁLISIS DE USO DE ETIQUETAS
-- ============================================================
-- Pregunta:
-- ¿Cuáles son las etiquetas más utilizadas y qué tasa de completado
-- tienen las tareas asociadas a cada etiqueta?
--
-- Formato esperado:
-- etiqueta
-- tareas_asociadas
-- tareas_completadas
-- tasa_completado_porcentaje
-- usuarios_que_la_utilizan
--
-- Ejemplos obtenidos:
-- backend | 9 | 7 | 77.78 | 2
-- urgente | 4 | 1 | 25.00 | 3
-- bug     | 2 | 2 | 100.00 | 1
-- ============================================================

SELECT
    e.nombre AS etiqueta,

    COUNT(DISTINCT te.tarea_id)
        AS tareas_asociadas,

    COUNT(DISTINCT te.tarea_id) FILTER (
        WHERE t.completada = TRUE
    ) AS tareas_completadas,

    ROUND(
        COUNT(DISTINCT te.tarea_id) FILTER (
            WHERE t.completada = TRUE
        )::numeric
        / NULLIF(
            COUNT(DISTINCT te.tarea_id),
            0
        )
        * 100,
        2
    ) AS tasa_completado_porcentaje,

    COUNT(DISTINCT t.usuario_id)
        AS usuarios_que_la_utilizan

FROM etiquetas e

JOIN tarea_etiquetas te
    ON te.etiqueta_id = e.id
   AND te.usuario_id = e.usuario_id

JOIN tareas t
    ON t.id = te.tarea_id
   AND t.usuario_id = te.usuario_id

GROUP BY
    e.nombre

ORDER BY
    tareas_asociadas DESC,
    tasa_completado_porcentaje DESC,
    etiqueta ASC;


-- ============================================================
-- 7. MÉTRICAS DE RETENCIÓN DE USUARIOS
-- ============================================================
-- Pregunta:
-- ¿Qué porcentaje de usuarios activos en una semana también estuvo
-- activo la semana siguiente durante las últimas 4 semanas?
--
-- Definición de actividad:
-- Un usuario se considera activo cuando crea o completa al menos una tarea.
--
-- Nota de diseño:
-- usuarios.ultimo_login_en almacena únicamente el último login y no un
-- historial de sesiones. Por eso la retención semanal se mide utilizando
-- actividad de tareas observable históricamente.
--
-- Formato esperado:
-- inicio_semana
-- usuarios_activos
-- usuarios_activos_semana_anterior
-- usuarios_retenidos
-- tasa_retencion_porcentaje
--
-- Resultado obtenido en las cuatro semanas:
-- 3 usuarios activos | 3 retenidos | 100.00 %
-- ============================================================

WITH semanas AS (
    SELECT
        generate_series(
            date_trunc('week', CURRENT_DATE) - INTERVAL '3 weeks',
            date_trunc('week', CURRENT_DATE),
            INTERVAL '1 week'
        )::date AS inicio_semana
),

actividad AS (
    SELECT DISTINCT
        usuario_id,
        date_trunc('week', creado_en)::date
            AS inicio_semana
    FROM tareas
    WHERE creado_en >=
        date_trunc('week', CURRENT_DATE)
        - INTERVAL '4 weeks'

    UNION

    SELECT DISTINCT
        usuario_id,
        date_trunc('week', completada_en)::date
            AS inicio_semana
    FROM tareas
    WHERE completada_en IS NOT NULL
      AND completada_en >=
        date_trunc('week', CURRENT_DATE)
        - INTERVAL '4 weeks'
),

resumen AS (
    SELECT
        s.inicio_semana,

        (
            SELECT COUNT(DISTINCT a.usuario_id)
            FROM actividad a
            WHERE a.inicio_semana = s.inicio_semana
        ) AS usuarios_activos,

        (
            SELECT COUNT(DISTINCT a.usuario_id)
            FROM actividad a
            WHERE a.inicio_semana = s.inicio_semana - 7
        ) AS usuarios_activos_semana_anterior,

        (
            SELECT COUNT(DISTINCT actual.usuario_id)
            FROM actividad actual
            JOIN actividad anterior
              ON anterior.usuario_id = actual.usuario_id
             AND anterior.inicio_semana = s.inicio_semana - 7
            WHERE actual.inicio_semana = s.inicio_semana
        ) AS usuarios_retenidos

    FROM semanas s
)

SELECT
    inicio_semana,
    usuarios_activos,
    usuarios_activos_semana_anterior,
    usuarios_retenidos,

    ROUND(
        usuarios_retenidos::numeric
        / NULLIF(
            usuarios_activos_semana_anterior,
            0
        )
        * 100,
        2
    ) AS tasa_retencion_porcentaje

FROM resumen

ORDER BY inicio_semana ASC;


-- ============================================================
-- 8. DISTRIBUCIÓN DE PRIORIDADES
-- ============================================================
-- Pregunta:
-- ¿Cómo se distribuyen las prioridades de las tareas entre usuarios
-- activos?
--
-- Definición de usuario activo:
-- Usuario cuyo ultimo_login_en ocurrió en los últimos 30 días.
--
-- Formato esperado:
-- prioridad
-- total_tareas
-- usuarios_con_tareas
-- porcentaje_distribucion
--
-- Resultado obtenido:
-- alta  | 16 | 3 | 37.21
-- media | 17 | 3 | 39.53
-- baja  | 10 | 3 | 23.26
-- ============================================================

WITH usuarios_activos AS (
    SELECT id
    FROM usuarios
    WHERE ultimo_login_en >= NOW() - INTERVAL '30 days'
),

distribucion AS (
    SELECT
        t.prioridad,
        COUNT(*) AS total_tareas,
        COUNT(DISTINCT t.usuario_id)
            AS usuarios_con_tareas

    FROM tareas t

    JOIN usuarios_activos ua
        ON ua.id = t.usuario_id

    GROUP BY
        t.prioridad
)

SELECT
    prioridad,
    total_tareas,
    usuarios_con_tareas,

    ROUND(
        total_tareas::numeric
        / NULLIF(
            SUM(total_tareas) OVER (),
            0
        )
        * 100,
        2
    ) AS porcentaje_distribucion

FROM distribucion

ORDER BY
    CASE prioridad
        WHEN 'alta' THEN 1
        WHEN 'media' THEN 2
        WHEN 'baja' THEN 3
    END;


-- ============================================================
-- 9. TENDENCIAS DE CREACIÓN DE TAREAS
-- ============================================================
-- Pregunta:
-- ¿Cuántas tareas se crean por mes durante el último año y cuál es
-- su tendencia de completado?
--
-- Interpretación:
-- Se agrupan las tareas por mes de creación y se calcula qué porcentaje
-- de las tareas creadas en cada mes se encuentra actualmente completado.
--
-- Formato esperado:
-- mes
-- tareas_creadas
-- tareas_completadas
-- tasa_completado_porcentaje
--
-- Resultados obtenidos:
-- 2026-06 | 3  | 2  | 66.67
-- 2026-07 | 8  | 7  | 87.50
-- 2026-08 | 24 | 10 | 41.67
-- ============================================================

WITH meses AS (
    SELECT
        generate_series(
            date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
            date_trunc('month', CURRENT_DATE),
            INTERVAL '1 month'
        )::date AS mes
),

resumen AS (
    SELECT
        m.mes,

        COUNT(t.id) AS tareas_creadas,

        COUNT(t.id) FILTER (
            WHERE t.completada = TRUE
        ) AS tareas_completadas

    FROM meses m

    LEFT JOIN tareas t
        ON date_trunc('month', t.creado_en)::date = m.mes

    GROUP BY
        m.mes
)

SELECT
    TO_CHAR(mes, 'YYYY-MM') AS mes,
    tareas_creadas,
    tareas_completadas,

    ROUND(
        tareas_completadas::numeric
        / NULLIF(tareas_creadas, 0)
        * 100,
        2
    ) AS tasa_completado_porcentaje

FROM resumen

ORDER BY mes ASC;


-- ============================================================
-- 10. TOP 10 % DE USUARIOS
-- ============================================================
-- Pregunta:
-- ¿Quiénes pertenecen al top 10 % de usuarios por tasa de completado
-- y cuál es su carga de trabajo simultánea promedio?
--
-- Definición de carga de trabajo:
-- Promedio de tareas que permanecieron abiertas por día durante
-- los últimos 90 días.
--
-- En conjuntos pequeños se garantiza al menos un usuario mediante
-- GREATEST(1, ...).
--
-- Formato esperado:
-- usuario_id
-- usuario
-- total_tareas
-- tareas_completadas
-- tasa_completado_porcentaje
-- carga_trabajo_promedio
-- posicion
--
-- Resultado obtenido:
-- 2 | Ana Torres | 10 | 8 | 80.00 | 0.38 | 1
-- ============================================================

WITH metricas_usuario AS (
    SELECT
        u.id AS usuario_id,
        u.nombre AS usuario,

        COUNT(t.id) AS total_tareas,

        COUNT(t.id) FILTER (
            WHERE t.completada = TRUE
        ) AS tareas_completadas,

        ROUND(
            COUNT(t.id) FILTER (
                WHERE t.completada = TRUE
            )::numeric
            / NULLIF(COUNT(t.id), 0)
            * 100,
            2
        ) AS tasa_completado_porcentaje

    FROM usuarios u

    JOIN tareas t
        ON t.usuario_id = u.id

    GROUP BY
        u.id,
        u.nombre
),

ranking AS (
    SELECT
        *,

        ROW_NUMBER() OVER (
            ORDER BY
                tasa_completado_porcentaje DESC,
                tareas_completadas DESC,
                total_tareas DESC,
                usuario_id ASC
        ) AS posicion,

        COUNT(*) OVER () AS total_usuarios

    FROM metricas_usuario
),

top_usuarios AS (
    SELECT *
    FROM ranking

    WHERE posicion <= GREATEST(
        1,
        CEIL(total_usuarios * 0.10)::integer
    )
),

dias AS (
    SELECT
        generate_series(
            CURRENT_DATE - INTERVAL '89 days',
            CURRENT_DATE,
            INTERVAL '1 day'
        )::date AS fecha
),

carga_diaria AS (
    SELECT
        tu.usuario_id,
        tu.usuario,
        tu.total_tareas,
        tu.tareas_completadas,
        tu.tasa_completado_porcentaje,
        tu.posicion,
        d.fecha,

        COUNT(t.id) AS tareas_abiertas

    FROM top_usuarios tu

    CROSS JOIN dias d

    LEFT JOIN tareas t
        ON t.usuario_id = tu.usuario_id
       AND t.creado_en::date <= d.fecha
       AND (
            t.completada_en IS NULL
            OR t.completada_en::date > d.fecha
       )

    GROUP BY
        tu.usuario_id,
        tu.usuario,
        tu.total_tareas,
        tu.tareas_completadas,
        tu.tasa_completado_porcentaje,
        tu.posicion,
        d.fecha
)

SELECT
    usuario_id,
    usuario,
    total_tareas,
    tareas_completadas,
    tasa_completado_porcentaje,

    ROUND(
        AVG(tareas_abiertas)::numeric,
        2
    ) AS carga_trabajo_promedio,

    posicion

FROM carga_diaria

GROUP BY
    usuario_id,
    usuario,
    total_tareas,
    tareas_completadas,
    tasa_completado_porcentaje,
    posicion

ORDER BY
    posicion ASC;


-- ============================================================
-- FIN
-- ============================================================
