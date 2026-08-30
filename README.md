# NexTask

Aplicación web full-stack para gestión de tareas desarrollada como solución al reto técnico de **Fracttal**.

NexTask permite a cada usuario administrar sus tareas, categorías y etiquetas dentro de un espacio privado, con autenticación JWT, filtros avanzados, una interfaz responsive y varias funcionalidades bonus orientadas a mejorar la experiencia de uso.

## Características principales

- Registro, inicio y cierre de sesión.
- Persistencia de sesión mediante JWT.
- Rutas protegidas en el frontend.
- CRUD completo de tareas.
- Completar e incompletar tareas.
- CRUD completo de categorías.
- Creación y consulta de etiquetas.
- Asignación y eliminación de etiquetas en tareas.
- Búsqueda por título y descripción.
- Filtrado por:
  - estado de completado;
  - categoría;
  - prioridad;
  - rango de fecha de vencimiento;
  - etiquetas.
- Ordenamiento por:
  - fecha de creación;
  - fecha de vencimiento;
  - prioridad;
  - título.
- Diseño responsive para desktop, tablet y móvil.
- Estados de carga y manejo de errores.
- Validación de formularios.
- Actualizaciones optimistas en operaciones apropiadas.
- Manejo global de errores en backend.
- Error Boundary en React.
- Manejo de expiración de sesión.

## Funcionalidades bonus implementadas

De las funcionalidades opcionales propuestas en el reto, NexTask implementa cuatro:

- **Tema claro / oscuro**, con persistencia de preferencia.
- **Dashboard de estadísticas**, con total de tareas, pendientes, completadas y vencidas.
- **Exportación de tareas a CSV y JSON**.
- **Atajos de teclado** para acciones frecuentes.

### Atajos disponibles

| Tecla | Acción |
|---|---|
| `N` | Abrir o cerrar el formulario de nueva tarea |
| `F` | Abrir o cerrar los filtros |
| `/` | Abrir los filtros y enfocar el campo de búsqueda |
| `Esc` | Cerrar formulario, filtros y menú de exportación |

Los atajos de letras no se ejecutan mientras el usuario está escribiendo dentro de un `input`, `textarea`, `select` o elemento editable.

---

## Stack tecnológico

### Frontend

- React
- Vite
- React Router
- Axios
- Context API
- CSS Modules
- Lucide React

### Backend

- Node.js
- Express
- PostgreSQL
- `pg`
- JWT (`jsonwebtoken`)
- bcrypt
- Zod
- Helmet
- CORS
- Morgan
- express-rate-limit
- dotenv

### Base de datos

- PostgreSQL
- Constraints e índices
- Relaciones mediante claves foráneas
- Triggers para actualización automática de timestamps
- Seed reproducible con datos útiles para pruebas funcionales y analíticas

### Infraestructura y despliegue

- Docker
- Docker Compose
- Nginx
- AWS Lightsail
- HTTPS con Let's Encrypt
- GitHub Actions para CI/CD

---

## Arquitectura general

```text
┌─────────────────────────────┐
│       React + Vite          │
│                             │
│ Componentes                 │
│ Custom Hooks                │
│ Context API                 │
│ Axios                       │
└──────────────┬──────────────┘
               │ HTTP / JSON
               │ Authorization: Bearer JWT
               ▼
┌─────────────────────────────┐
│      Node.js + Express      │
│                             │
│ Routes                      │
│ Middlewares                 │
│ Controllers                 │
│ Services                    │
│ Validators                  │
└──────────────┬──────────────┘
               │
               │ Consultas parametrizadas
               ▼
┌─────────────────────────────┐
│         PostgreSQL          │
│                             │
│ usuarios                    │
│ categorias                  │
│ tareas                      │
│ etiquetas                   │
│ tarea_etiquetas             │
└─────────────────────────────┘
```

El backend se organiza por responsabilidades. Las rutas definen el endpoint y su pipeline, los middlewares ejecutan validaciones y autenticación, los controllers manejan la capa HTTP y los services concentran la lógica de negocio y acceso a datos.

---

## Estructura del proyecto

```text
NexTask/
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   └── app.js
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── server.js
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── componentes/
│   │   │   ├── Auth/
│   │   │   ├── Categoria/
│   │   │   ├── Comunes/
│   │   │   ├── Etiqueta/
│   │   │   ├── Layout/
│   │   │   └── Tarea/
│   │   ├── contexto/
│   │   ├── hooks/
│   │   ├── servicios/
│   │   └── utils/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── docs/
│   ├── API.md
│   └── consultas-bi.sql
│
├── docker-compose.yml
└── README.md
```

---

## Modelo de datos

NexTask utiliza cinco tablas principales:

```text
usuarios
categorias
tareas
etiquetas
tarea_etiquetas
```

Relaciones principales:

```text
usuarios 1 ─── N categorias
usuarios 1 ─── N tareas
usuarios 1 ─── N etiquetas

categorias 1 ─── N tareas

tareas N ─── M etiquetas
           │
           └── tarea_etiquetas
```

### Decisiones relevantes

- Cada tarea, categoría y etiqueta pertenece a un usuario.
- Una tarea puede existir sin categoría.
- Tareas y etiquetas se relacionan mediante una tabla intermedia.
- Las relaciones incluyen el usuario para reforzar el aislamiento entre cuentas.
- Se almacena `completada_en` para permitir análisis de productividad y tiempos de resolución.
- Se almacena `ultimo_login_en` para soportar consultas de actividad y retención.
- Los campos utilizados frecuentemente en filtros y ordenamientos cuentan con índices.
- `actualizado_en` se mantiene mediante triggers de PostgreSQL.

---

## Seguridad

NexTask implementa varias capas de seguridad:

### Autenticación JWT

Después de un login válido, el backend entrega un token firmado. El frontend lo incluye automáticamente en las peticiones protegidas:

```http
Authorization: Bearer <token>
```

El JWT tiene una duración limitada y el frontend valida la sesión mediante:

```http
GET /api/auth/perfil
```

Cuando una sesión expira, la aplicación limpia el token y redirige nuevamente al login.

### Contraseñas

Las contraseñas no se almacenan en texto plano. Se guardan como hashes generados con bcrypt.

### Aislamiento entre usuarios

Las operaciones sobre recursos propios siempre utilizan también el usuario autenticado:

```sql
WHERE id = $1
  AND usuario_id = $2
```

Conocer el ID de una tarea, categoría o etiqueta de otro usuario no concede acceso al recurso.

### Consultas parametrizadas

Los valores enviados por el cliente se pasan a PostgreSQL como parámetros:

```js
pool.query(
  'SELECT * FROM tareas WHERE usuario_id = $1',
  [usuarioId]
);
```

Esto evita concatenar directamente datos del cliente dentro de las consultas y ayuda a prevenir SQL Injection.

### Validación

Zod valida `body`, parámetros de ruta y query strings antes de ejecutar la lógica de negocio.

También se incluyen:

- Helmet;
- CORS;
- rate limiting;
- logging HTTP con Morgan;
- manejo centralizado de errores;
- códigos de estado HTTP apropiados.

---

# Instalación local

## Requisitos

Antes de iniciar se necesita:

- Node.js
- npm
- PostgreSQL
- Git

Los comandos de PostgreSQL asumen que `psql` está disponible desde la terminal.

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/ArleyCalderon/NexTask.git
cd NexTask
```

---

## 2. Crear la base de datos

Desde PostgreSQL se puede crear una base y un rol dedicado:

```sql
CREATE ROLE nextask_app
WITH LOGIN PASSWORD 'TU_PASSWORD';

CREATE DATABASE nextask
OWNER nextask_app;
```

> No se recomienda utilizar el superusuario `postgres` como usuario de la aplicación.

---

## 3. Crear el esquema

Desde la raíz del proyecto:

```bash
psql -v ON_ERROR_STOP=1 -U nextask_app -d nextask -f database/schema.sql
```

El script crea las tablas, relaciones, restricciones, índices y triggers necesarios.

> `schema.sql` elimina primero las tablas del proyecto para permitir reconstruir el entorno durante desarrollo. No debe ejecutarse de esa forma sobre una base de producción con información real.

---

## 4. Cargar datos de ejemplo

```bash
psql -v ON_ERROR_STOP=1 -U nextask_app -d nextask -f database/seed.sql
```

El seed contiene:

- varios usuarios;
- categorías;
- etiquetas;
- tareas distribuidas a lo largo del tiempo;
- prioridades baja, media y alta;
- tareas pendientes y completadas;
- vencimientos pasados y futuros;
- tareas con y sin categoría;
- relaciones muchos-a-muchos con etiquetas.

Las fechas se generan de manera relativa con `NOW()` y `CURRENT_DATE`, por lo que los escenarios siguen siendo útiles aunque el seed se ejecute en otra fecha.

La contraseña de las cuentas demo incluidas en el seed es:

```text
Demo123!
```

Los correos disponibles pueden consultarse directamente en `database/seed.sql`.

> El seed comienza con `TRUNCATE ... RESTART IDENTITY CASCADE`, por lo que está pensado exclusivamente para desarrollo y demostración.

---

# Configuración del backend

## 5. Instalar dependencias

```bash
cd backend
npm ci
```

Si no se dispone de `package-lock.json`, puede utilizarse:

```bash
npm install
```

---

## 6. Variables de entorno del backend

Crea `backend/.env` tomando como referencia `backend/.env.example`.

Configuración local típica:

```env
PORT=3000

DB_HOST=localhost
DB_NAME=nextask
DB_USER=nextask_app
DB_PASSWORD=TU_PASSWORD

JWT_SECRET=UNA_CLAVE_LARGA_Y_SEGURA
```

El archivo `.env` contiene secretos locales y **no debe versionarse**.

---

## 7. Ejecutar el backend

```bash
npm run dev
```

La API queda disponible normalmente en:

```text
http://localhost:3000
```

Health check:

```http
GET http://localhost:3000/api/health
```

Este endpoint valida tanto que Express esté activo como que PostgreSQL responda correctamente.

---

# Configuración del frontend

## 8. Instalar dependencias

En otra terminal:

```bash
cd frontend
npm ci
```

---

## 9. Variable de entorno del frontend

Crea `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Las variables expuestas a Vite deben comenzar por `VITE_`.

Si se modifica el `.env` mientras Vite está ejecutándose, es necesario reiniciar el servidor de desarrollo.

---

## 10. Ejecutar el frontend

```bash
npm run dev
```

Vite utiliza normalmente:

```text
http://localhost:5173
```

---

## URLs locales

| Servicio | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:3000` |
| API | `http://localhost:3000/api` |
| Health check | `http://localhost:3000/api/health` |

---

# API

Todas las rutas de tareas, categorías y etiquetas están protegidas mediante JWT.

## Autenticación

```http
POST /api/auth/registro
POST /api/auth/login
GET  /api/auth/perfil
```

## Tareas

```http
GET    /api/tareas
POST   /api/tareas
PUT    /api/tareas/:id
DELETE /api/tareas/:id
PATCH  /api/tareas/:id/completar
```

## Categorías

```http
GET    /api/categorias
POST   /api/categorias
PUT    /api/categorias/:id
DELETE /api/categorias/:id
```

Al eliminar una categoría, las tareas asociadas **no se eliminan**. El backend ejecuta una transacción que desvincula primero las tareas (`categoria_id = NULL`) y luego elimina la categoría.

## Etiquetas

```http
GET  /api/etiquetas
POST /api/etiquetas
```

## Relación tarea-etiqueta

```http
POST   /api/tareas/:id/etiquetas/:etiquetaId
DELETE /api/tareas/:id/etiquetas/:etiquetaId
```

Una tarea puede tener varias etiquetas y una misma etiqueta puede pertenecer a varias tareas.

---

# Filtros de tareas

`GET /api/tareas` acepta los siguientes query parameters:

| Parámetro | Descripción |
|---|---|
| `completada` | Filtra por estado de completado |
| `categoria` | Filtra por ID de categoría |
| `prioridad` | Filtra por `baja`, `media` o `alta` |
| `fecha_vencimiento` | Filtra por rango de vencimiento |
| `busqueda` | Busca en título y descripción |
| `etiquetas` | Filtra por etiquetas |
| `ordenar` | `creado_en`, `fecha_vencimiento`, `prioridad` o `titulo` |
| `direccion` | `asc` o `desc` |

Ejemplo:

```http
GET /api/tareas?prioridad=alta&completada=false&ordenar=fecha_vencimiento&direccion=asc
```

Los filtros son validados antes de formar la consulta y los valores continúan siendo parametrizados en PostgreSQL.

---

# Frontend

## Autenticación y sesión

El frontend utiliza Context API para compartir:

```text
usuario
login()
registro()
logout()
```

El JWT se conserva en `localStorage` y Axios lo incorpora automáticamente mediante un interceptor.

Al recargar la aplicación, `GET /auth/perfil` reconstruye el estado del usuario.

---

## Custom hooks

La lógica de acceso a datos se separó de los componentes visuales mediante hooks personalizados, entre ellos:

```text
useAuth
useTareas
useCategorias
useEtiquetas
useTema
useEstadisticasTareas
```

Esto permite mantener los componentes enfocados en presentación e interacción.

---

## Actualizaciones optimistas

Operaciones apropiadas, como cambiar el estado de una tarea, actualizan primero la interfaz y posteriormente confirman la operación contra la API.

Conceptualmente:

```text
Acción del usuario
       ↓
Actualizar estado local
       ↓
Request al backend
       ↓
¿Funcionó?
├── Sí → conservar
└── No → rollback
```

Esto mejora la percepción de velocidad sin perder manejo de errores.

---

## Dashboard de estadísticas

El dashboard muestra información global del usuario:

- total de tareas;
- pendientes;
- completadas;
- vencidas;
- porcentaje de progreso.

Las estadísticas se calculan utilizando todas las tareas del usuario y son independientes de los filtros aplicados a la lista visible.

Las mutaciones sobre tareas notifican al módulo de estadísticas para mantener los valores sincronizados.

---

## Tema claro y oscuro

La preferencia se administra mediante un contexto específico de tema y se persiste en `localStorage`.

El cambio está disponible tanto en las vistas autenticadas como en login y registro.

---

## Exportación

Desde la lista de tareas pueden exportarse todos los datos del usuario a:

```text
CSV
JSON
```

La exportación no depende de los filtros activos en pantalla: siempre genera un archivo con el conjunto completo de tareas del usuario.

Los archivos incluyen la fecha en su nombre:

```text
nextask_tareas_YYYY-MM-DD.csv
nextask_tareas_YYYY-MM-DD.json
```

El CSV se genera con codificación UTF-8 para conservar correctamente caracteres como tildes y `ñ`.

---

## Responsive

La interfaz fue diseñada y probada en resoluciones de escritorio, tablet y móvil.

Entre los ajustes responsive se incluyen:

- navegación adaptada;
- tarjetas de tareas en dos columnas en pantallas amplias;
- una columna en móvil;
- dashboard de estadísticas 2 × 2 en pantallas pequeñas;
- formularios adaptables;
- categorías en grilla;
- etiquetas con `flex-wrap`;
- ocultamiento de pistas visuales de atajos en móvil para reducir ruido.

---

# Decisiones técnicas destacadas

## 1. Aislamiento por usuario desde backend

La seguridad no depende de que el frontend oculte información. Cada consulta de recursos privados aplica también el ID extraído del JWT.

## 2. Categorías eliminables sin perder tareas

Eliminar una categoría organiza datos, pero no debe eliminar el recurso principal. Por eso se utiliza una transacción:

```text
BEGIN
↓
validar categoría y usuario
↓
UPDATE tareas SET categoria_id = NULL
↓
DELETE categoría
↓
COMMIT
```

Ante un error se ejecuta `ROLLBACK`.

## 3. Relación muchos-a-muchos segura

`tarea_etiquetas` modela la relación N:M. Su clave primaria evita relaciones duplicadas y las claves foráneas refuerzan que los recursos pertenezcan al mismo usuario.

## 4. Backend como fuente de filtros

Los filtros se ejecutan en PostgreSQL y no descargando todas las tareas para filtrarlas posteriormente en React. Esto reduce transferencia innecesaria de datos y mantiene las reglas de consulta en el servidor.

## 5. Respuesta de tareas enriquecida

`GET /api/tareas` entrega información necesaria para la interfaz, como categoría y etiquetas, evitando realizar una petición adicional por cada tarea.

## 6. Catálogo de etiquetas cargado una vez

El catálogo disponible se consulta en el componente padre y se distribuye mediante props a los items de tarea. Esto evita el patrón:

```text
20 tareas
→ 20 requests idénticos a /etiquetas
```

---

# Scripts útiles

### Backend

```bash
cd backend
npm ci
npm run dev
```

### Frontend

```bash
cd frontend
npm ci
npm run dev
npm run build
```

### Reconstruir base de datos de desarrollo

```bash
psql -v ON_ERROR_STOP=1 -U nextask_app -d nextask -f database/schema.sql
psql -v ON_ERROR_STOP=1 -U nextask_app -d nextask -f database/seed.sql
```

---

# Consideraciones de desarrollo

- `.env` no debe subirse al repositorio.
- `.env.example` sí debe versionarse.
- `node_modules` no debe versionarse.
- `package-lock.json` sí debe versionarse para instalaciones reproducibles.
- `database/schema.sql` y `database/seed.sql` permiten reconstruir el entorno de datos.
- El seed está diseñado para desarrollo/demo y elimina los datos existentes antes de insertar los escenarios de prueba.

---

# Cumplimiento del reto

## Backend

- [x] JWT
- [x] Registro, login y perfil protegido
- [x] CRUD de tareas
- [x] Completar/incompletar
- [x] CRUD de categorías
- [x] Crear/listar etiquetas
- [x] Asignar/quitar etiquetas
- [x] Filtros obligatorios
- [x] Búsqueda
- [x] Ordenamiento
- [x] Validación
- [x] Manejo global de errores
- [x] Variables de entorno
- [x] Logging
- [x] Rate limiting
- [x] Consultas parametrizadas
- [x] Códigos HTTP apropiados
- [x] Helmet y CORS

## Frontend

- [x] React
- [x] React Router
- [x] `useState`
- [x] `useEffect`
- [x] `useContext`
- [x] Custom hooks
- [x] Context API
- [x] CSS Modules
- [x] Responsive
- [x] Loading states
- [x] Error states
- [x] Validación de formularios
- [x] Actualizaciones optimistas
- [x] Error Boundary

## Bonus

- [x] Tema oscuro/claro
- [x] Dashboard de estadísticas
- [x] Exportación CSV/JSON
- [x] Atajos de teclado
- [ ] Drag and drop
- [ ] WebSockets
- [ ] Operaciones en lote

---

---

# Documentación adicional

La documentación técnica complementaria del proyecto se encuentra en la carpeta `docs/`.

## Documentación de la API

La descripción detallada de endpoints, parámetros, cuerpos de petición, respuestas y códigos HTTP está disponible en:

[`docs/API.md`](docs/API.md)

## Consultas de Inteligencia de Negocio

Las 10 consultas SQL solicitadas en el reto, junto con su pregunta de negocio, formato de salida esperado y ejemplos de resultados, están disponibles en:

[`docs/consultas-bi.sql`](docs/consultas-bi.sql)

---

# Datos de demostración

El archivo `database/seed.sql` incluye usuarios, categorías, etiquetas y tareas preparadas para probar las distintas funcionalidades de NexTask.

Usuarios demo disponibles:

```text
demo@nextask.local
ana@nextask.local
carlos@nextask.local
```

Contraseña para las tres cuentas:

```text
Demo123!
```

> El seed está diseñado exclusivamente para desarrollo y demostración. Su ejecución reinicia los datos mediante `TRUNCATE ... RESTART IDENTITY CASCADE`.

---

# Despliegue

NexTask cuenta con un entorno temporal de demostración desplegado en **AWS Lightsail**.

## Demo pública

```text
https://52.45.175.70
```

La infraestructura de producción utilizada para la prueba técnica incluye:

- Ubuntu 24.04 LTS;
- Docker y Docker Compose;
- PostgreSQL 17;
- Node.js + Express para la API;
- React compilado con Vite;
- Nginx como servidor web y reverse proxy;
- HTTPS mediante un certificado TLS de Let's Encrypt;
- firewall de AWS Lightsail y UFW en el servidor.

Arquitectura del despliegue:

```text
Internet
   │
   ▼
AWS Lightsail
   │
   ▼
Nginx :80 / :443
   ├── React
   │
   └── /api
         │
         ▼
    Node.js / Express :3000
         │
         ▼
     PostgreSQL :5432
```

Solo Nginx publica puertos hacia Internet. El backend y PostgreSQL permanecen dentro de la red privada de Docker Compose.

> La instancia y la URL de demostración fueron creadas específicamente para la evaluación técnica y pueden dejar de estar disponibles después de finalizar el proceso.

---

# CI/CD

El repositorio incluye un pipeline de integración y despliegue continuo mediante **GitHub Actions**.

El workflow se ejecuta automáticamente después de cada `push` a la rama `main`.

Flujo:

```text
Push a main
    │
    ▼
GitHub Actions
    │
    ├── Instala dependencias del backend
    ├── Valida sintaxis del backend
    ├── Instala dependencias del frontend
    ├── Ejecuta lint
    ├── Compila el frontend
    │
    ▼
Deploy
    │
    ├── Conexión SSH con AWS Lightsail
    ├── Sincronización con main
    ├── Reconstrucción con Docker Compose
    └── Health check HTTPS
```

El despliegue solamente comienza si las validaciones de CI finalizan correctamente.

Workflow:

[`/.github/workflows/deploy.yml`](.github/workflows/deploy.yml)

---

# Repositorio

Código fuente:

```text
https://github.com/ArleyCalderon/NexTask
```

Clonar el proyecto:

```bash
git clone https://github.com/ArleyCalderon/NexTask.git
cd NexTask
```

---

# Estado del proyecto

NexTask implementa los requerimientos funcionales principales del reto y varias funcionalidades bonus.

Como cierre técnico se validaron:

- autenticación JWT y rutas protegidas;
- CRUD de tareas y categorías;
- gestión de etiquetas;
- filtros, búsqueda y ordenamiento;
- aislamiento de datos por usuario;
- validaciones y manejo de errores;
- dashboard de estadísticas;
- exportación CSV y JSON;
- tema claro y oscuro;
- diseño responsive;
- build de producción;
- documentación de API;
- 10 consultas de Inteligencia de Negocio;
- despliegue público con HTTPS;
- pipeline CI/CD;
- despliegue automático en AWS Lightsail;
- health check posterior al despliegue.

---

# Autor

**Arley Calderón**

Proyecto desarrollado como solución al reto técnico Full-Stack de **Fracttal**.

