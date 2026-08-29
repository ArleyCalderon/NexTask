# NexTask — Documentación de API

Documentación técnica de la API REST de **NexTask**, desarrollada con Node.js, Express y PostgreSQL.

> **Base local:** `http://localhost:3000/api`
>
> Todos los ejemplos utilizan datos ilustrativos. Los IDs y timestamps cambian según la base de datos.
>
> En los endpoints donde el frontend actual no depende del cuerpo de una respuesta de escritura, esta documentación especifica con certeza el código HTTP esperado y el efecto de la operación, evitando inventar una envoltura JSON que no sea necesaria para el contrato consumido.

---

# Índice

- [Convenciones generales](#convenciones-generales)
- [Autenticación](#autenticación)
- [Health check](#health-check)
- [Tareas](#tareas)
- [Filtros y ordenamiento de tareas](#filtros-y-ordenamiento-de-tareas)
- [Categorías](#categorías)
- [Etiquetas](#etiquetas)
- [Relación tarea-etiqueta](#relación-tarea-etiqueta)
- [Errores y códigos HTTP](#errores-y-códigos-http)
- [Seguridad y aislamiento](#seguridad-y-aislamiento)

---

# Convenciones generales

## Formato

La API recibe y devuelve JSON.

Para requests con body:

```http
Content-Type: application/json
```

Las rutas protegidas requieren:

```http
Authorization: Bearer <token>
```

---

## Autenticación

NexTask utiliza JWT.

Flujo:

```text
email + password
      ↓
POST /api/auth/login
      ↓
validación de credenciales
      ↓
JWT + usuario público
      ↓
Authorization: Bearer <token>
      ↓
endpoints protegidos
```

El token identifica al usuario autenticado. La contraseña solo se utiliza durante registro/login y se almacena mediante hash bcrypt.

---

## Formato de error de validación

Cuando Zod rechaza datos de `body`, `query` o `params`, la API utiliza una respuesta estructurada.

Ejemplo real documentado:

```json
{
  "error": "Datos de entrada inválidos",
  "detalles": [
    {
      "campo": "email",
      "mensaje": "El correo electrónico no es válido"
    }
  ]
}
```

Código habitual:

```http
400 Bad Request
```

---

# Health check

## GET `/api/health`

Comprueba que:

1. Express está funcionando.
2. PostgreSQL responde correctamente.

### Autenticación

No requerida.

### Request

```http
GET /api/health
```

### Respuesta

```http
200 OK
```

El endpoint realiza una consulta sencilla a PostgreSQL, por lo que no valida únicamente que el proceso de Node.js esté levantado.

---

# Autenticación

## POST `/api/auth/registro`

Registra un usuario nuevo.

### Autenticación

No requerida.

### Body

```json
{
  "nombre": "Arley Calderón",
  "email": "arley@ejemplo.com",
  "password": "Demo123!"
}
```

### Reglas relevantes

- `nombre` es obligatorio.
- El correo debe tener formato válido.
- El email se normaliza con `trim` y `lowercase`.
- El correo debe ser único ignorando mayúsculas/minúsculas.
- La contraseña se guarda como hash bcrypt, nunca en texto plano.

### Respuesta exitosa

```http
201 Created
```

El frontend consume la respuesta con esta estructura:

```json
{
  "token": "<jwt>",
  "usuario": {
    "id": 1,
    "nombre": "Arley Calderón",
    "email": "arley@ejemplo.com"
  }
}
```

El objeto público de usuario no expone `password_hash`.

### Posibles errores

#### Datos inválidos

```http
400 Bad Request
```

```json
{
  "error": "Datos de entrada inválidos",
  "detalles": [
    {
      "campo": "email",
      "mensaje": "El correo electrónico no es válido"
    }
  ]
}
```

#### Email duplicado

```http
409 Conflict
```

La API devuelve un mensaje de negocio controlado y no expone el error interno de PostgreSQL.

---

## POST `/api/auth/login`

Autentica un usuario existente.

### Autenticación

No requerida.

### Body

```json
{
  "email": "arley@ejemplo.com",
  "password": "Demo123!"
}
```

### Flujo

```text
buscar usuario por email
        ↓
bcrypt.compare()
        ↓
actualizar ultimo_login_en
        ↓
generar JWT
        ↓
devolver token + usuario público
```

### Respuesta exitosa

```http
200 OK
```

```json
{
  "token": "<jwt>",
  "usuario": {
    "id": 1,
    "nombre": "Arley Calderón",
    "email": "arley@ejemplo.com"
  }
}
```

### Credenciales incorrectas

```http
401 Unauthorized
```

```json
{
  "error": "Credenciales inválidas"
}
```

La respuesta no revela si el correo existe o si únicamente falló la contraseña.

---

## GET `/api/auth/perfil`

Obtiene el perfil del usuario identificado por el JWT.

### Autenticación

Requerida.

### Headers

```http
Authorization: Bearer <token>
```

### Request

```http
GET /api/auth/perfil
```

### Respuesta exitosa

```http
200 OK
```

El frontend consume:

```json
{
  "usuario": {
    "id": 1,
    "nombre": "Arley Calderón",
    "email": "arley@ejemplo.com"
  }
}
```

### Sin token

```http
401 Unauthorized
```

```json
{
  "error": "Token de autenticación requerido"
}
```

Un token inválido o expirado también impide acceder al recurso.

---

# Tareas

Todas las rutas de tareas están protegidas y solo operan sobre recursos del usuario autenticado.

Modelo principal:

```text
id
usuario_id
categoria_id
titulo
descripcion
prioridad
completada
fecha_vencimiento
completada_en
creado_en
actualizado_en
```

`GET /api/tareas` además entrega:

```text
categoria_nombre
categoria_color
etiquetas[]
```

---

## GET `/api/tareas`

Obtiene las tareas del usuario autenticado.

Admite filtros, búsqueda y ordenamiento.

### Autenticación

Requerida.

### Headers

```http
Authorization: Bearer <token>
```

### Request básico

```http
GET /api/tareas
```

### Respuesta exitosa

```http
200 OK
```

La estructura real consumida por el frontend es:

```json
{
  "tareas": [
    {
      "id": "6",
      "usuario_id": "1",
      "categoria_id": "3",
      "titulo": "Preparar sustentación técnica",
      "descripcion": "Repasar arquitectura, seguridad y decisiones de diseño.",
      "prioridad": "alta",
      "completada": false,
      "fecha_vencimiento": "2026-08-31T05:00:00.000Z",
      "creado_en": "2026-08-26T23:00:00.000Z",
      "actualizado_en": "2026-08-29T03:25:53.354Z",
      "completada_en": null,
      "categoria_nombre": "Trabajo",
      "categoria_color": "#2563EB",
      "etiquetas": [
        {
          "id": 1,
          "nombre": "estudio"
        },
        {
          "id": 5,
          "nombre": "urgente"
        }
      ]
    }
  ]
}
```

Una tarea sin categoría puede devolver:

```json
{
  "categoria_id": null,
  "categoria_nombre": null,
  "categoria_color": null
}
```

Una tarea sin etiquetas devuelve:

```json
{
  "etiquetas": []
}
```

---

## POST `/api/tareas`

Crea una tarea para el usuario autenticado.

### Autenticación

Requerida.

### Body

```json
{
  "titulo": "Documentar API",
  "descripcion": "Agregar ejemplos de request y response.",
  "prioridad": "media",
  "categoria_id": 3,
  "fecha_vencimiento": "2026-09-05"
}
```

### Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| `titulo` | string | Sí | Máximo 200 caracteres |
| `descripcion` | string/null | No | Descripción libre |
| `prioridad` | string | Sí | `baja`, `media` o `alta` |
| `categoria_id` | number/null | No | Categoría del mismo usuario |
| `fecha_vencimiento` | `YYYY-MM-DD`/null | No | Fecha de vencimiento |

El frontend envía explícitamente `null` cuando no existe descripción, categoría o fecha.

### Ejemplo sin categoría

```json
{
  "titulo": "Revisar documentación",
  "descripcion": null,
  "prioridad": "baja",
  "categoria_id": null,
  "fecha_vencimiento": null
}
```

### Respuesta exitosa

```http
201 Created
```

Tras crear la tarea, el frontend vuelve a consultar `GET /api/tareas` para sincronizar la representación completa con categoría y etiquetas.

### Reglas de negocio

- El título no puede estar vacío.
- El título está limitado a 200 caracteres.
- Solo se admiten prioridades `baja`, `media` y `alta`.
- La categoría es opcional.
- Si `categoria_id` se envía, debe existir y pertenecer al mismo usuario autenticado.
- La tarea se crea inicialmente como pendiente.

---

## PUT `/api/tareas/:id`

Actualiza los datos generales de una tarea.

### Autenticación

Requerida.

### Params

```text
id = entero positivo
```

Los IDs se validan antes de llegar a PostgreSQL.

### Ejemplo

```http
PUT /api/tareas/37
```

### Body

```json
{
  "titulo": "Documentar API completa",
  "descripcion": "Agregar requests, responses y códigos HTTP.",
  "prioridad": "alta",
  "categoria_id": 3,
  "fecha_vencimiento": "2026-09-03"
}
```

### Respuesta exitosa

```http
200 OK
```

El frontend recarga posteriormente el listado mediante `GET /api/tareas`.

### Errores relevantes

- `400` si los parámetros/body no son válidos.
- `404` si la tarea no es accesible para el usuario autenticado.
- Error de negocio si la categoría enviada no pertenece al usuario.

---

## DELETE `/api/tareas/:id`

Elimina una tarea.

### Autenticación

Requerida.

### Ejemplo

```http
DELETE /api/tareas/37
```

### Body

No requiere.

### Respuesta exitosa

```http
204 No Content
```

Las relaciones existentes en `tarea_etiquetas` se eliminan automáticamente mediante integridad referencial.

### Recurso inexistente/no accesible

```http
404 Not Found
```

La API no debe revelar recursos pertenecientes a otro usuario.

---

## PATCH `/api/tareas/:id/completar`

Alterna el estado de completado de una tarea.

### Autenticación

Requerida.

### Ejemplo

```http
PATCH /api/tareas/37/completar
```

### Body

No requiere.

### Comportamiento

```text
completada = false
        ↓
completada = true
completada_en = NOW()
```

Si ya estaba completada:

```text
completada = true
        ↓
completada = false
completada_en = NULL
```

Por tanto, este endpoint funciona como **toggle**.

### Respuesta exitosa

```http
200 OK
```

El frontend utiliza actualización optimista para reflejar el cambio inmediatamente y sincroniza nuevamente el listado cuando es necesario.

---

# Filtros y ordenamiento de tareas

`GET /api/tareas` permite combinar filtros.

## Parámetros disponibles

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `completada` | `false` | `true` o `false` |
| `categoria` | `3` | ID de categoría |
| `prioridad` | `alta` | `baja`, `media`, `alta` |
| `fecha_vencimiento` | `2026-08-01,2026-08-31` | Rango inclusivo |
| `busqueda` | `documentar` | Busca en título y descripción |
| `etiquetas` | `backend` | Nombre de etiqueta |
| `ordenar` | `fecha_vencimiento` | Campo permitido |
| `direccion` | `asc` | `asc` o `desc` |

Los filtros son opcionales y pueden combinarse.

---

## `completada`

```http
GET /api/tareas?completada=false
```

Devuelve tareas pendientes.

```http
GET /api/tareas?completada=true
```

Devuelve tareas completadas.

---

## `categoria`

```http
GET /api/tareas?categoria=3
```

Filtra por ID de categoría.

---

## `prioridad`

Valores permitidos:

```text
baja
media
alta
```

Ejemplo:

```http
GET /api/tareas?prioridad=alta
```

---

## `fecha_vencimiento`

Formato:

```text
YYYY-MM-DD,YYYY-MM-DD
```

Ejemplo:

```http
GET /api/tareas?fecha_vencimiento=2026-08-01,2026-08-31
```

La validación comprueba:

1. que existan las dos fechas;
2. que tengan formato `YYYY-MM-DD`;
3. que sean fechas reales;
4. que la inicial no sea posterior a la final.

Ejemplo real de error documentado:

```json
{
  "error": "Datos de entrada inválidos",
  "detalles": [
    {
      "campo": "fecha_vencimiento",
      "mensaje": "La fecha inicial no puede ser posterior a la fecha final"
    }
  ]
}
```

También se validó el caso de formato/fechas inválidas:

```json
{
  "error": "Datos de entrada inválidos",
  "detalles": [
    {
      "campo": "fecha_vencimiento",
      "mensaje": "La fecha de vencimiento debe tener dos fechas válidas YYYY-MM-DD,YYYY-MM-DD"
    }
  ]
}
```

---

## `busqueda`

Busca tanto en:

```text
titulo
descripcion
```

Ejemplo:

```http
GET /api/tareas?busqueda=postgresql
```

Conceptualmente utiliza búsqueda case-insensitive con PostgreSQL.

---

## `etiquetas`

El filtro recibe nombres de etiquetas.

Ejemplo:

```http
GET /api/tareas?etiquetas=backend
```

El frontend actual envía el `nombre` de la etiqueta seleccionada, no su ID.

---

## `ordenar`

Campos permitidos:

```text
creado_en
fecha_vencimiento
prioridad
titulo
```

Ejemplo:

```http
GET /api/tareas?ordenar=creado_en
```

Los nombres de columnas no se aceptan arbitrariamente. Se validan contra una lista permitida antes de construir SQL dinámico.

---

## `direccion`

Valores:

```text
asc
desc
```

Debe utilizarse junto con `ordenar`.

Ejemplo:

```http
GET /api/tareas?ordenar=titulo&direccion=asc
```

---

## Ejemplo combinado

```http
GET /api/tareas?prioridad=alta&completada=false&categoria=3&etiquetas=backend&ordenar=fecha_vencimiento&direccion=asc
```

---

# Categorías

Todas las rutas están protegidas.

Modelo:

```text
id
usuario_id
nombre
color
creado_en
actualizado_en
```

Un usuario no puede tener dos categorías con el mismo nombre ignorando mayúsculas/minúsculas.

---

## GET `/api/categorias`

Obtiene todas las categorías del usuario autenticado.

### Autenticación

Requerida.

### Request

```http
GET /api/categorias
```

### Respuesta exitosa

```http
200 OK
```

La colección contiene recursos con una estructura equivalente a:

```json
{
  "categorias": [
    {
      "id": 3,
      "usuario_id": 1,
      "nombre": "Trabajo",
      "color": "#2563EB",
      "creado_en": "2026-08-20T15:00:00.000Z",
      "actualizado_en": "2026-08-20T15:00:00.000Z"
    }
  ]
}
```

Los campos consumidos directamente por la UI son:

```text
id
nombre
color
```

---

## POST `/api/categorias`

Crea una categoría.

### Body

```json
{
  "nombre": "Universidad",
  "color": "#9333EA"
}
```

### Reglas

- `nombre` obligatorio.
- El color utiliza formato hexadecimal `#RRGGBB`.
- El nombre debe ser único para ese usuario ignorando mayúsculas/minúsculas.

### Respuesta exitosa

```http
201 Created
```

El frontend recarga el catálogo después de la operación.

### Nombre duplicado

```http
409 Conflict
```

Mensaje documentado:

```json
{
  "error": "Ya existe una categoría con ese nombre"
}
```

---

## PUT `/api/categorias/:id`

Actualiza nombre/color de una categoría.

### Ejemplo

```http
PUT /api/categorias/3
```

### Body

```json
{
  "nombre": "Trabajo",
  "color": "#2563EB"
}
```

### Respuesta exitosa

```http
200 OK
```

### Errores

- `400` para parámetros/body inválidos.
- `404` si la categoría no pertenece al usuario/no existe.
- `409` si el nuevo nombre entra en conflicto con otra categoría del mismo usuario.

---

## DELETE `/api/categorias/:id`

Elimina una categoría sin eliminar sus tareas.

### Ejemplo

```http
DELETE /api/categorias/3
```

### Respuesta exitosa

```http
204 No Content
```

### Comportamiento interno

La operación se ejecuta dentro de una transacción:

```text
BEGIN
  ↓
validar categoría + usuario
  ↓
UPDATE tareas
SET categoria_id = NULL
  ↓
DELETE categoria
  ↓
COMMIT
```

Si algo falla:

```text
ROLLBACK
```

Por diseño:

```text
Eliminar categoría ≠ eliminar tareas
```

Las tareas asociadas permanecen y pasan a estar sin categoría.

---

# Etiquetas

Las rutas de etiquetas están protegidas.

Modelo:

```text
id
usuario_id
nombre
creado_en
actualizado_en
```

El nombre es único por usuario ignorando mayúsculas/minúsculas.

---

## GET `/api/etiquetas`

Obtiene las etiquetas del usuario autenticado.

### Request

```http
GET /api/etiquetas
```

### Respuesta exitosa

```http
200 OK
```

Estructura consumida por el frontend:

```json
{
  "etiquetas": [
    {
      "id": 4,
      "nombre": "backend"
    },
    {
      "id": 5,
      "nombre": "urgente"
    }
  ]
}
```

---

## POST `/api/etiquetas`

Crea una etiqueta.

### Body

```json
{
  "nombre": "importante"
}
```

### Respuesta exitosa

```http
201 Created
```

El frontend vuelve a cargar el catálogo de etiquetas después de crearla.

### Posibles errores

- `400` si el nombre no es válido.
- `409 Conflict` si ya existe una etiqueta con el mismo nombre para el usuario.
- `401` si no existe una sesión válida.

---

# Relación tarea-etiqueta

Una tarea puede tener muchas etiquetas y una etiqueta puede pertenecer a muchas tareas.

La relación se almacena en:

```text
tarea_etiquetas
```

Clave primaria:

```text
(tarea_id, etiqueta_id)
```

Esto impide duplicar la misma etiqueta sobre una tarea.

Además, las claves foráneas incluyen `usuario_id`, reforzando que tarea y etiqueta pertenezcan al mismo usuario.

---

## POST `/api/tareas/:id/etiquetas/:etiquetaId`

Asigna una etiqueta existente a una tarea.

### Autenticación

Requerida.

### Ejemplo

```http
POST /api/tareas/37/etiquetas/4
```

### Body

No requiere.

### Respuesta exitosa

Operación exitosa de creación de relación.

El frontend no depende del body y posteriormente recarga las tareas para obtener el array `etiquetas` actualizado.

### Relación duplicada

```http
409 Conflict
```

Si la relación ya existe, no se crea una segunda vez.

### Seguridad

El backend valida que:

- la tarea pertenezca al usuario autenticado;
- la etiqueta pertenezca al usuario autenticado.

PostgreSQL vuelve a reforzar esa relación mediante claves foráneas compuestas.

---

## DELETE `/api/tareas/:id/etiquetas/:etiquetaId`

Quita una etiqueta de una tarea.

### Ejemplo

```http
DELETE /api/tareas/37/etiquetas/4
```

### Body

No requiere.

### Respuesta exitosa

Operación de eliminación de la relación exitosa.

El recurso `etiqueta` no se elimina: únicamente desaparece la relación con esa tarea.

### Recurso/relación no accesible

La API responde sin revelar recursos pertenecientes a otros usuarios.

---

# Errores y códigos HTTP

## Resumen

| Código | Uso en NexTask |
|---:|---|
| `200 OK` | Lecturas y actualizaciones exitosas |
| `201 Created` | Creación exitosa |
| `204 No Content` | Eliminaciones exitosas sin body |
| `400 Bad Request` | Validación, params/query inválidos o JSON mal formado |
| `401 Unauthorized` | Falta token, token inválido/expirado o credenciales incorrectas |
| `404 Not Found` | Recurso inexistente o no accesible |
| `409 Conflict` | Duplicados o conflictos de negocio |
| `429 Too Many Requests` | Rate limit excedido |
| `500 Internal Server Error` | Error inesperado no expuesto al cliente |

---

## 400 — Validación

```json
{
  "error": "Datos de entrada inválidos",
  "detalles": [
    {
      "campo": "prioridad",
      "mensaje": "<detalle de validación>"
    }
  ]
}
```

---

## 401 — Sin autenticación

Ejemplo confirmado:

```json
{
  "error": "Token de autenticación requerido"
}
```

Credenciales incorrectas:

```json
{
  "error": "Credenciales inválidas"
}
```

---

## 404 — Recursos privados

Los recursos se consultan siempre junto al usuario autenticado.

Conceptualmente:

```sql
WHERE id = $1
  AND usuario_id = $2
```

Así, un ID válido perteneciente a otro usuario no concede acceso.

---

## 409 — Conflictos

Ejemplo confirmado para categorías:

```json
{
  "error": "Ya existe una categoría con ese nombre"
}
```

También se usa conflicto al intentar duplicar relaciones tarea-etiqueta.

---

## 429 — Rate limiting

NexTask utiliza `express-rate-limit`.

Cuando un cliente supera el límite configurado, la API puede responder:

```http
429 Too Many Requests
```

---

## 500 — Error interno

Los errores inesperados se manejan de forma centralizada.

La API no debe exponer:

- stack traces;
- queries SQL internas;
- contraseñas;
- hashes;
- secretos JWT;
- detalles internos de PostgreSQL.

---

# Seguridad y aislamiento

## JWT

Las rutas protegidas obtienen la identidad del usuario desde el token verificado por el middleware.

El frontend añade automáticamente:

```http
Authorization: Bearer <token>
```

mediante un interceptor de Axios.

---

## Autenticación vs autorización

```text
Autenticación
→ ¿quién es el usuario?

Autorización
→ ¿puede operar este recurso?
```

El JWT autentica.

Las consultas con `usuario_id` autorizan.

---

## Aislamiento por usuario

Patrón fundamental:

```sql
WHERE id = $1
  AND usuario_id = $2
```

Esto aplica a tareas, categorías, etiquetas y relaciones.

---

## Consultas parametrizadas

Los valores del cliente no se concatenan directamente en SQL.

Ejemplo conceptual:

```js
pool.query(
  'SELECT * FROM tareas WHERE usuario_id = $1',
  [usuarioId]
);
```

Para elementos que no pueden parametrizarse como nombres de columnas de ordenamiento, NexTask valida primero contra listas permitidas:

```text
creado_en
fecha_vencimiento
prioridad
titulo
```

---

## Validación en varias capas

```text
Frontend
→ feedback temprano / UX

Zod en backend
→ contrato y seguridad de entrada

PostgreSQL
→ integridad relacional y constraints
```

El backend nunca confía únicamente en las validaciones del navegador.

---

# Resumen de endpoints

| Método | Endpoint | Auth | Descripción |
|---|---|:---:|---|
| GET | `/api/health` | No | Salud de API y PostgreSQL |
| POST | `/api/auth/registro` | No | Registrar usuario |
| POST | `/api/auth/login` | No | Iniciar sesión |
| GET | `/api/auth/perfil` | Sí | Perfil actual |
| GET | `/api/tareas` | Sí | Listar/filtrar tareas |
| POST | `/api/tareas` | Sí | Crear tarea |
| PUT | `/api/tareas/:id` | Sí | Actualizar tarea |
| DELETE | `/api/tareas/:id` | Sí | Eliminar tarea |
| PATCH | `/api/tareas/:id/completar` | Sí | Completar/incompletar |
| GET | `/api/categorias` | Sí | Listar categorías |
| POST | `/api/categorias` | Sí | Crear categoría |
| PUT | `/api/categorias/:id` | Sí | Actualizar categoría |
| DELETE | `/api/categorias/:id` | Sí | Eliminar categoría |
| GET | `/api/etiquetas` | Sí | Listar etiquetas |
| POST | `/api/etiquetas` | Sí | Crear etiqueta |
| POST | `/api/tareas/:id/etiquetas/:etiquetaId` | Sí | Asignar etiqueta |
| DELETE | `/api/tareas/:id/etiquetas/:etiquetaId` | Sí | Quitar etiqueta |

---

# Ejemplo de flujo completo

## 1. Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "arley@ejemplo.com",
  "password": "Demo123!"
}
```

Respuesta:

```json
{
  "token": "<jwt>",
  "usuario": {
    "id": 1,
    "nombre": "Arley Calderón",
    "email": "arley@ejemplo.com"
  }
}
```

## 2. Crear tarea

```http
POST /api/tareas
Authorization: Bearer <jwt>
Content-Type: application/json
```

```json
{
  "titulo": "Preparar entrega",
  "descripcion": "Revisar README y documentación",
  "prioridad": "alta",
  "categoria_id": 3,
  "fecha_vencimiento": "2026-09-01"
}
```

## 3. Listar pendientes

```http
GET /api/tareas?completada=false&ordenar=fecha_vencimiento&direccion=asc
Authorization: Bearer <jwt>
```

## 4. Completar

```http
PATCH /api/tareas/37/completar
Authorization: Bearer <jwt>
```

## 5. Asignar etiqueta

```http
POST /api/tareas/37/etiquetas/4
Authorization: Bearer <jwt>
```

## 6. Eliminar tarea

```http
DELETE /api/tareas/37
Authorization: Bearer <jwt>
```

Respuesta:

```http
204 No Content
```

---

# Notas de implementación

- Las tareas se enriquecen con categoría y etiquetas para evitar requests N+1 desde React.
- Los filtros se ejecutan en PostgreSQL, no descargando todas las tareas al navegador.
- `PATCH /completar` funciona como toggle y mantiene coherencia entre `completada` y `completada_en`.
- Eliminar una categoría conserva sus tareas mediante una transacción.
- La relación tarea-etiqueta aplica defensa en profundidad: validación de propiedad en Node.js y restricciones relacionales en PostgreSQL.
- Los IDs de params, filtros, fechas y campos de body se validan mediante Zod antes de llegar a la lógica de negocio.

---

# Autor

**Arley Calderón**

Documentación de la API de NexTask para el reto técnico Full-Stack de Fracttal.
