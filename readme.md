# ⚡ FieldOps Admin — Sistema de Gestión de Operaciones de Campo

<div align="center">

![FieldOps Banner](https://img.shields.io/badge/FieldOps-v1.0.0-38bdf8?style=for-the-badge&logo=lightning&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20+-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/Licencia-MIT-10b981?style=for-the-badge)

**Panel de administración B2B para empresas de servicios técnicos y mantenimiento en campo.**

[🚀 Demo](#) · [📖 Documentación](#arquitectura) · [🐛 Reportar Bug](#) · [💡 Sugerir Feature](#)

</div>

---

## 📋 Tabla de Contenidos

- [¿Qué problema resuelve?](#-qué-problema-resuelve)
- [Características principales](#-características-principales)
- [Arquitectura del sistema](#️-arquitectura-del-sistema)
- [Stack tecnológico](#-stack-tecnológico)
- [Requisitos previos](#-requisitos-previos)
- [Instalación local](#-instalación-local)
- [Configuración de la base de datos](#️-configuración-de-la-base-de-datos)
- [Variables de entorno](#-variables-de-entorno)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Módulos del sistema](#-módulos-del-sistema)
- [Roles y permisos](#-roles-y-permisos)
- [Diseño y UI](#-diseño-y-ui)
- [API Reference](#-api-reference)
- [Contribuir](#-contribuir)

---

## 🎯 ¿Qué problema resuelve?

Las empresas B2B de servicios técnicos (mantenimiento industrial, telecomunicaciones, instalaciones eléctricas, HVAC, etc.) enfrentan tres problemas críticos en sus operaciones diarias:

| ❌ Problema | ✅ Cómo FieldOps lo resuelve |
|---|---|
| Órdenes de trabajo dispersas en papel o Excel | Panel centralizado con trazabilidad completa de cada orden |
| Sin visibilidad de qué técnico está disponible | Dashboard en tiempo real con métricas de técnicos activos |
| Inventario de herramientas descontrolado | Módulo de inventario con estados y fechas de mantenimiento |
| Asignaciones manuales propensas a errores | Asignación directa de equipos y técnicos por orden de trabajo |
| Sin control de acceso por rol | Sistema de roles Administrador / Técnico con permisos diferenciados |

FieldOps centraliza la gestión de **órdenes de trabajo**, **técnicos**, e **inventario de equipos** en un único panel web, eliminando la fricción operativa y dando visibilidad completa a los administradores.

---

## ✨ Características principales

### 📊 Dashboard de métricas
- Resumen en tiempo real de órdenes totales, completadas y pendientes
- Conteo de técnicos activos
- Equipos actualmente en estado de mantenimiento

### 👥 Gestión de usuarios
- CRUD completo de técnicos y administradores
- Control de acceso por rol (solo admins crean/editan/eliminan)
- Autenticación con JWT almacenado de forma segura

### 📦 Inventario de equipos
- Registro de herramientas y maquinaria con marca, estado y condición
- Estados semánticos: `Disponible` · `En uso` · `Mantenimiento` · `Dañado`
- Fecha programada de mantenimiento por equipo

### 📋 Órdenes de trabajo
- Creación y asignación de órdenes a técnicos
- Selección múltiple de equipos por orden (solo disponibles)
- Estados de orden: `Pendiente` · `Activa` · `Completada` · `Cancelada`
- Fecha programada con formato legible

### 🔔 Sistema de notificaciones
- Toast notifications 100% personalizadas (sin dependencias externas)
- Colores semánticos por tipo: éxito, error, advertencia, info
- Animaciones de entrada/salida con barra de progreso

### 🎨 UI/UX
- Tema oscuro consistente en toda la aplicación
- Animaciones de entrada escalonadas en tablas y tarjetas
- Modales de confirmación para operaciones destructivas
- Estados de carga con spinners contextuales
- Tablas vacías con mensajes ilustrativos

---

## 🏛️ Arquitectura del sistema

FieldOps sigue una arquitectura **cliente-servidor desacoplada** (SPA + REST API):

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (SPA)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │               React 18 + Vite                        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │  Pages   │ │Components│ │  API lib │            │   │
│  │  │Dashboard │ │Formularios│ │ /api/*   │            │   │
│  │  │Usuarios  │ │Modales   │ │ fetch()  │            │   │
│  │  │Equipos   │ │Toast     │ │  + JWT   │            │   │
│  │  │Ordenes   │ │Protected │ └──────────┘            │   │
│  │  └──────────┘ └──────────┘                         │   │
│  └─────────────────────────────────────────────────────┘   │
│                    TailwindCSS + CSS Animations              │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST (JSON)
                             │ Authorization: Bearer <JWT>
┌────────────────────────────▼────────────────────────────────┐
│                     SERVIDOR (REST API)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Node.js + Express                       │   │
│  │                                                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │   │
│  │  │  Routes  │  │Middlewares│  │   Controllers    │  │   │
│  │  │/auth     │  │verifyJWT │  │  Lógica negocio  │  │   │
│  │  │/usuarios │  │roleCheck │  │  Queries SQL     │  │   │
│  │  │/equipos  │  │errorHndlr│  │                  │  │   │
│  │  │/ordenes  │  └──────────┘  └──────────────────┘  │   │
│  │  │/dashboard│                                       │   │
│  │  └──────────┘                                       │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │ pg / node-postgres
┌────────────────────────────▼────────────────────────────────┐
│                    BASE DE DATOS                             │
│              PostgreSQL 16                                   │
│  ┌───────────┐  ┌───────────┐  ┌─────────────────────┐    │
│  │ usuarios  │  │  equipos  │  │       ordenes        │    │
│  │    id     │  │    id     │  │         id           │    │
│  │  nombre   │  │  nombre   │  │       titulo         │    │
│  │  correo   │  │   marca   │  │       estado         │    │
│  │ contrasena│  │  estado   │  │   fecha_programa      │    │
│  │ ocupacion │  │ condicion │  │    id_usuario (FK)   │    │
│  └───────────┘  │fecha_mantto│  │ equipos_seleccionados│   │
│                 └───────────┘  └─────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de autenticación

```
Usuario           Frontend              Backend              DB
   │                  │                     │                  │
   │── login() ──────►│                     │                  │
   │                  │── POST /auth/login ─►│                  │
   │                  │                     │── SELECT user ──►│
   │                  │                     │◄── user data ────│
   │                  │                     │                  │
   │                  │◄── { token, nombre, ocupacion }        │
   │                  │                     │                  │
   │                  │── localStorage ─────►│                  │
   │                  │   token, nombre,    │                  │
   │                  │   ocupacion         │                  │
   │                  │                     │                  │
   │  [Rutas protegidas]                    │                  │
   │                  │── GET /recursos ────►│                  │
   │                  │   Authorization:    │                  │
   │                  │   Bearer <JWT>      │── verifyJWT ────►│
```

---

## 🛠 Stack tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| ⚛️ React | 18 | Framework UI con Hooks |
| ⚡ Vite | 5 | Bundler y dev server |
| 🌊 TailwindCSS | 3.4 | Estilos utilitarios |
| 🔀 React Router DOM | 6 | Enrutamiento SPA |
| 🎨 CSS Animations | nativo | Transiciones y microinteracciones |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| 🟢 Node.js | 20+ | Runtime del servidor |
| 🚂 Express | 4 | Framework HTTP REST |
| 🔑 JSON Web Tokens | — | Autenticación stateless |
| 🐘 node-postgres (pg) | — | Cliente PostgreSQL |
| 🔒 bcrypt | — | Hash de contraseñas |

### Base de datos
| Tecnología | Versión | Uso |
|---|---|---|
| 🐘 PostgreSQL | 16 | Base de datos relacional principal |

---

## 📦 Requisitos previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

```
✅ Node.js v20 o superior     →  https://nodejs.org
✅ npm v9 o superior          →  incluido con Node.js
✅ PostgreSQL v14 o superior  →  https://www.postgresql.org/download
✅ Git                        →  https://git-scm.com
```

Verifica tus versiones:

```bash
node --version    # v20.x.x
npm --version     # 9.x.x o superior
psql --version    # psql (PostgreSQL) 14.x o superior
git --version     # git version 2.x.x
```

---

## 🚀 Instalación local

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/fieldops.git
cd fieldops
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Instalar dependencias del frontend

```bash
cd ../frontend
npm install
```

### 4. Configurar variables de entorno

```bash
# En la carpeta /backend
cp .env.example .env
```

Edita el archivo `.env` con tus valores (ver sección [Variables de entorno](#-variables-de-entorno)).

### 5. Inicializar la base de datos

```bash
# Crea la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE fieldops_db;"

# Ejecuta el script de inicialización
psql -U postgres -d fieldops_db -f database/schema.sql

# (Opcional) Cargar datos de prueba
psql -U postgres -d fieldops_db -f database/seed.sql
```

### 6. Iniciar los servidores

**Backend** (en una terminal):
```bash
cd backend
npm run dev
# ✅ Servidor corriendo en http://localhost:3000
```

**Frontend** (en otra terminal):
```bash
cd frontend
npm run dev
# ✅ App corriendo en http://localhost:5173
```

### 7. Acceder a la aplicación

Abre tu navegador en **http://localhost:5173**

Credenciales de prueba (si ejecutaste `seed.sql`):

```
👤 Administrador
   Email:     admin@fieldops.com
   Contraseña: Admin123!

👷 Técnico
   Email:     tecnico@fieldops.com
   Contraseña: Tecnico123!
```

---

## 🗄️ Configuración de la base de datos

### Schema completo

```sql
-- ============================================
-- FieldOps Database Schema v1.0
-- ============================================

-- Tabla de usuarios (técnicos y administradores)
CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100)        NOT NULL,
    correo      VARCHAR(150) UNIQUE NOT NULL,
    contrasena  VARCHAR(255)        NOT NULL,  -- bcrypt hash
    ocupacion   VARCHAR(50)         NOT NULL   -- 'Administrador' | 'Técnico'
);

-- Tabla de equipos / inventario
CREATE TABLE equipos (
    id           SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    marca        VARCHAR(100) NOT NULL,
    estado       VARCHAR(50)  NOT NULL DEFAULT 'Disponible',
    -- 'Disponible' | 'En uso' | 'Mantenimiento' | 'Dañado'
    condicion    VARCHAR(50)  NOT NULL DEFAULT 'Nuevo',
    -- 'Nuevo' | 'Buena' | 'Regular' | 'Mala' | 'Dañado'
    fecha_mantto DATE
);

-- Tabla de órdenes de trabajo
CREATE TABLE ordenes (
    id                    SERIAL PRIMARY KEY,
    titulo                VARCHAR(200) NOT NULL,
    estado                VARCHAR(50)  NOT NULL DEFAULT 'Pendiente',
    -- 'Pendiente' | 'Activa' | 'Completada' | 'Cancelada'
    fecha_programa        DATE,
    id_usuario            INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    equipos_seleccionados INTEGER[]    DEFAULT '{}'
    -- Array de IDs de equipos asignados a esta orden
);
```

### Datos de prueba (seed.sql)

```sql
-- Usuario administrador
INSERT INTO usuarios (nombre, correo, contrasena, ocupacion)
VALUES (
    'Admin FieldOps',
    'admin@fieldops.com',
    '$2b$10$...hash_de_Admin123!...',  -- bcrypt hash
    'Administrador'
);

-- Usuario técnico
INSERT INTO usuarios (nombre, correo, contrasena, ocupacion)
VALUES (
    'Carlos Ramírez',
    'tecnico@fieldops.com',
    '$2b$10$...hash_de_Tecnico123!...',
    'Técnico'
);

-- Equipos de ejemplo
INSERT INTO equipos (nombre, marca, estado, condicion, fecha_mantto) VALUES
    ('Multímetro Digital',  'Fluke',   'Disponible',    'Buena',   '2025-06-01'),
    ('Taladro Percutor',    'Dewalt',  'Disponible',    'Buena',   '2025-07-15'),
    ('Llave Torquimétrica', 'Stanley', 'Mantenimiento', 'Regular', '2025-05-20'),
    ('Nivel Láser',         'Bosch',   'Disponible',    'Nuevo',   '2025-12-01');

-- Orden de trabajo de ejemplo
INSERT INTO ordenes (titulo, estado, fecha_programa, id_usuario, equipos_seleccionados)
VALUES (
    'Revisión eléctrica planta norte',
    'Activa',
    '2025-08-10',
    2,
    '{1, 2}'
);
```

### Diagrama Entidad-Relación

```
┌─────────────────┐       ┌─────────────────────┐
│    USUARIOS      │       │       ORDENES        │
├─────────────────┤       ├─────────────────────┤
│ 🔑 id (PK)      │◄──────│ 🔑 id (PK)          │
│    nombre       │  1:N  │    titulo           │
│    correo       │       │    estado           │
│    contrasena   │       │    fecha_programa   │
│    ocupacion    │       │    id_usuario (FK)  │
└─────────────────┘       │    equipos_selec[]  │
                          └─────────────────────┘
                                    │
                          (array de IDs)
                                    │
                          ┌─────────▼───────────┐
                          │       EQUIPOS        │
                          ├─────────────────────┤
                          │ 🔑 id (PK)          │
                          │    nombre           │
                          │    marca            │
                          │    estado           │
                          │    condicion        │
                          │    fecha_mantto     │
                          └─────────────────────┘
```

---

## 🔧 Variables de entorno

### Backend (`/backend/.env`)

```env
# ── Servidor ──────────────────────────────────
PORT=3000
NODE_ENV=development

# ── Base de datos ─────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fieldops_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_aqui

# ── Autenticación JWT ─────────────────────────
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
JWT_EXPIRES_IN=24h

# ── CORS ──────────────────────────────────────
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`/frontend/.env`)

```env
# URL base de la API
VITE_API_URL=http://localhost:3000
```

> ⚠️ **Nunca subas el archivo `.env` a Git.** Asegúrate de que `.env` esté en tu `.gitignore`.

---

## 📁 Estructura del proyecto

```
fieldops/
│
├── 📁 frontend/                  # Aplicación React (SPA)
│   ├── 📁 src/
│   │   ├── 📁 api/               # Capa de llamadas HTTP
│   │   │   ├── Auth.js           # login()
│   │   │   ├── Usuarios.js       # CRUD usuarios
│   │   │   ├── Equipos.js        # CRUD equipos
│   │   │   └── Ordenes.js        # CRUD órdenes
│   │   │
│   │   ├── 📁 components/        # Componentes reutilizables
│   │   │   ├── ProtectedRoute.jsx    # Guardia de rutas
│   │   │   ├── FieldOpsToast.jsx     # Sistema de notificaciones
│   │   │   ├── CrearUsuarios.jsx     # Formulario CRUD usuario
│   │   │   ├── CrearEquipos.jsx      # Formulario CRUD equipo
│   │   │   └── CrearOrdenes.jsx      # Formulario CRUD orden
│   │   │
│   │   ├── 📁 Pages/             # Vistas / páginas completas
│   │   │   ├── Login.jsx         # Pantalla de autenticación
│   │   │   ├── Dashboard.jsx     # Panel de métricas
│   │   │   ├── Usuarios.jsx      # Gestión de usuarios
│   │   │   ├── Equipos.jsx       # Inventario
│   │   │   ├── Ordenes.jsx       # Órdenes de trabajo
│   │   │   └── Perfil.jsx        # Perfil de usuario
│   │   │
│   │   ├── App.jsx               # Router principal + ToastProvider
│   │   ├── App.css               # Estilos globales
│   │   └── main.jsx              # Entry point
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── 📁 backend/                   # API REST Node.js
│   ├── 📁 routes/
│   │   ├── auth.js               # POST /auth/login
│   │   ├── usuarios.js           # CRUD /usuarios
│   │   ├── equipos.js            # CRUD /equipos
│   │   ├── ordenes.js            # CRUD /ordenes
│   │   └── dashboard.js          # GET /dashboard/metricas
│   │
│   ├── 📁 middleware/
│   │   ├── verifyToken.js        # Validación JWT
│   │   └── checkRole.js          # Verificación de rol
│   │
│   ├── 📁 db/
│   │   └── connection.js         # Pool de conexiones PostgreSQL
│   │
│   ├── server.js                 # Entry point Express
│   ├── .env.example
│   └── package.json
│
├── 📁 database/
│   ├── schema.sql                # Definición de tablas
│   └── seed.sql                  # Datos de prueba
│
└── README.md
```

---

## 🧩 Módulos del sistema

### 🔐 Autenticación
- Login con correo y contraseña
- Contraseñas hasheadas con `bcrypt`
- Token JWT firmado con expiración configurable
- Rutas protegidas en el frontend con `ProtectedRoute`
- Redirección automática al login si el token expira

### 📊 Dashboard
- Endpoint `GET /dashboard/metricas` agrega datos en tiempo real
- Métricas: total de órdenes, completadas, pendientes, técnicos activos, equipos en mantenimiento
- Tarjetas animadas con entrada escalonada

### 👥 Usuarios
- `GET /usuarios` — lista todos los usuarios
- `POST /usuarios` — crea nuevo usuario (solo Admin)
- `PUT /usuarios/:id` — edita usuario (solo Admin)
- `DELETE /usuarios/:id` — elimina usuario (solo Admin)

### 📦 Equipos
- `GET /equipos` — lista inventario completo
- `POST /equipos` — registra nuevo equipo (solo Admin)
- `PUT /equipos/:id` — actualiza datos del equipo
- `DELETE /equipos/:id` — elimina equipo (solo Admin)
- Al asignarse a una orden, el estado cambia a `Asignado`

### 📋 Órdenes
- `GET /ordenes` — lista todas las órdenes
- `POST /ordenes` — crea orden y asigna equipos (solo Admin)
- `PUT /ordenes/:id` — actualiza estado y datos
- `DELETE /ordenes/:id` — elimina orden (solo Admin)
- Al crear, solo muestra equipos con estado `Disponible`

---

## 🛡️ Roles y permisos

| Acción | 👑 Administrador | 👷 Técnico |
|---|:---:|:---:|
| Ver Dashboard | ✅ | ✅ |
| Ver usuarios | ✅ | ✅ |
| Crear / Editar / Eliminar usuarios | ✅ | ❌ |
| Ver inventario | ✅ | ✅ |
| Crear / Editar / Eliminar equipos | ✅ | ❌ |
| Ver órdenes | ✅ | ✅ |
| Crear / Eliminar órdenes | ✅ | ❌ |
| Editar estado de órdenes | ✅ | ✅ |
| Ver perfil propio | ✅ | ✅ |

---

## 🎨 Diseño y UI

FieldOps utiliza un sistema de diseño oscuro cohesivo construido con TailwindCSS y animaciones CSS puras.

### Paleta de colores

```
Fondo principal    →  gray-900  (#111827)
Fondo de tarjetas  →  gray-800  (#1F2937)
Fondo elevado      →  gray-950  (#030712)

Acento primario    →  sky-500   (#0EA5E9)   — Dashboard, Login
Acento secundario  →  indigo-500 (#6366F1)  — Órdenes, gradientes
Éxito / Activo     →  emerald-500 (#10B981) — Nav activa, Equipos
Advertencia        →  amber-500  (#F59E0B)  — Editar, warnings
Peligro            →  rose-500   (#F43F5E)  — Eliminar, errores
Información        →  sky-400    (#38BDF8)  — Métricas, info
```

### Sistema de notificaciones (FieldOpsToast)

Reemplaza `react-toastify` con un sistema propio sin dependencias externas:

```jsx
import { useFieldOpsToast } from '../components/FieldOpsToast';

const MiComponente = () => {
  const toast = useFieldOpsToast();

  // Tipos disponibles
  toast.success('Operación exitosa', { title: '¡Listo!' });
  toast.error('Algo salió mal', { title: 'Error' });
  toast.warning('Acceso restringido', { title: 'Atención' });
  toast.info('Sesión cerrada');

  // Con duración personalizada (ms)
  toast.success('Guardado', { duration: 6000 });
};
```

### Convenciones de animación

Las animaciones CSS están inyectadas dinámicamente por página para evitar conflictos:

```css
/* Entrada de página */
.fo-page-in    { animation: fo-fade-up 0.4s ease both; }

/* Entrada de tarjetas con delay escalonado */
.fo-card:nth-child(1) { animation-delay: 0.05s; }
.fo-card:nth-child(2) { animation-delay: 0.15s; }

/* Entrada de filas de tabla */
.fo-table-row  { animation: fo-row-in 0.3s ease both; }

/* Entrada de modales */
.fo-modal-in   { animation: fo-modal-in 0.3s cubic-bezier(0.34,1.4,0.64,1) both; }
```

---

## 📡 API Reference

Todas las rutas (excepto `/auth/login`) requieren el header:

```
Authorization: Bearer <JWT_TOKEN>
```

### Auth

```http
POST /auth/login
Content-Type: application/json

{
  "correo": "admin@fieldops.com",
  "contrasena": "Admin123!"
}

→ 200 OK
{
  "token": "eyJhbGc...",
  "nombre": "Admin FieldOps",
  "ocupacion": "Administrador"
}
```

### Dashboard

```http
GET /dashboard/metricas

→ 200 OK
{
  "totalOrdenes": 12,
  "ordenesCompletadas": 5,
  "ordenesPendientes": 4,
  "tecnicosActivos": 3,
  "equiposMantenimiento": 2
}
```

### Usuarios

```http
GET    /usuarios          → Lista todos los usuarios
POST   /usuarios          → Crea usuario  (Admin)
PUT    /usuarios/:id      → Actualiza usuario  (Admin)
DELETE /usuarios/:id      → Elimina usuario  (Admin)
```

### Equipos

```http
GET    /equipos           → Lista inventario completo
POST   /equipos           → Registra equipo  (Admin)
PUT    /equipos/:id       → Actualiza equipo
DELETE /equipos/:id       → Elimina equipo  (Admin)
```

### Órdenes

```http
GET    /ordenes           → Lista todas las órdenes
POST   /ordenes           → Crea orden  (Admin)
PUT    /ordenes/:id       → Actualiza orden
DELETE /ordenes/:id       → Elimina orden  (Admin)
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor sigue este flujo:

```bash
# 1. Haz un fork del repositorio
# 2. Crea una rama para tu feature
git checkout -b feature/nueva-funcionalidad

# 3. Haz tus cambios y commitea
git commit -m "feat: agrega nueva funcionalidad"

# 4. Sube tu rama
git push origin feature/nueva-funcionalidad

# 5. Abre un Pull Request
```

### Convenciones de commits

```
feat:     nueva funcionalidad
fix:      corrección de bug
style:    cambios de estilos / UI
refactor: refactorización sin cambios funcionales
docs:     cambios en documentación
chore:    tareas de mantenimiento
```

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Ve el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

Hecho con ⚡ por **Yerson Fabian Garzon Rodriguez**

![Visitors](https://img.shields.io/badge/Estado-En%20desarrollo-f59e0b?style=flat-square)
![Made with Love](https://img.shields.io/badge/Hecho%20con-❤️-rose?style=flat-square)

</div>