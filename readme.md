# ⚡ FieldOps Admin

<div align="center">

![FieldOps Dashboard](./docs/images/banner.png)

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js_20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Express](https://img.shields.io/badge/Express_4-000000?style=for-the-badge&logo=express&logoColor=white)

<br/>

> **Panel de administración full-stack** para digitalizar la gestión de órdenes de trabajo,  
> técnicos e inventario en empresas B2B de servicios técnicos en campo.

<br/>

[📸 Demo Visual](#-demo-visual) &nbsp;·&nbsp; [🧠 Retos Técnicos](#-retos-técnicos-superados) &nbsp;·&nbsp; [🚀 Instalación](#-instalación-local) &nbsp;·&nbsp; [📡 API](#-api-reference)

</div>

---

## 🎯 El Problema Real que Resuelve

Las empresas B2B de servicios técnicos (mantenimiento industrial, HVAC, instalaciones eléctricas, telecomunicaciones) siguen operando con **órdenes de trabajo en papel**, **llamadas telefónicas para asignar técnicos** y **hojas de Excel para rastrear herramientas**. Esto genera fricciones operativas concretas y costosas:

| ❌ Problema operativo | 💥 Impacto en el negocio |
|---|---|
| Órdenes dispersas en papel o WhatsApp | Sin trazabilidad: nadie sabe el estado real de un trabajo |
| Asignación manual de técnicos | Colisiones: dos técnicos van al mismo lugar, o ninguno va |
| Inventario sin control de estado | Equipos "perdidos", en mal estado o en uso sin registro |
| Sin visibilidad para el administrador | Decisiones a ciegas, sin métricas de productividad |
| Control de acceso inexistente | Cualquiera puede modificar o borrar información crítica |

**FieldOps Admin** centraliza todo en un único panel web:  
un administrador crea una orden, asigna un técnico y reserva los equipos necesarios en menos de un minuto — los equipos quedan bloqueados para otras órdenes automáticamente.

---

## 📸 Demo Visual

### 🔐 Login — Autenticación con feedback inmediato

<!-- ═══════════════════════════════════════════════════════════════════
  💡 GIF SUGERIDO — Flujo de login completo:
     1. Escribe credenciales incorrectas → toast de error en rojo aparece
     2. Escribe credenciales correctas   → toast "Bienvenido, [nombre]" en verde
     3. Redirección animada al dashboard

  Cómo grabarlo:
    · Mac:     Kap (gratis)         → https://getkap.co
    · Windows: ScreenToGif (gratis) → https://www.screentogif.com
  
  Resolución recomendada: 1024×640px, 15fps, loop activado
  Guardar en: ./docs/gifs/01-login.gif
  Descomentar la línea de abajo cuando esté listo:
═══════════════════════════════════════════════════════════════════ -->
<!-- ![Login Demo](./docs/gifs/01-login.gif) -->

```
[ Pendiente: GIF del flujo de login con toast de error y toast de bienvenida ]
```

---

### 📊 Dashboard — Métricas cargadas desde la base de datos

<!-- ═══════════════════════════════════════════════════════════════════
  💡 CAPTURA DE PANTALLA — El dashboard con las 4 tarjetas animadas
  y datos reales. Asegúrate de tener órdenes, técnicos y equipos
  cargados antes de tomar la captura para que los números no sean 0.

  Resolución recomendada: 1440×900px
  Guardar en: ./docs/images/02-dashboard.png
═══════════════════════════════════════════════════════════════════ -->
<!-- ![Dashboard](./docs/images/02-dashboard.png) -->

```
[ Pendiente: Captura del dashboard con métricas reales ]
```

---

### 📋 Crear Orden — Selección múltiple de equipos

<!-- ═══════════════════════════════════════════════════════════════════
  💡 GIF SUGERIDO — Este es el flujo más representativo del proyecto:
     1. Click en "Nueva Orden" → modal se abre con animación de rebote
     2. Escribe el título de la orden
     3. Selecciona una fecha programada
     4. Elige un técnico del dropdown
     5. Marca y desmarca varios equipos con los checkboxes visuales
        (el contador "X equipos seleccionados" se actualiza en tiempo real)
     6. Click en "Crear Orden" → spinner → toast de éxito → orden en la tabla

  Guardar en: ./docs/gifs/03-crear-orden.gif
═══════════════════════════════════════════════════════════════════ -->
<!-- ![Crear Orden](./docs/gifs/03-crear-orden.gif) -->

```
[ Pendiente: GIF de creación de orden con selección múltiple de equipos ]
```

---

### 🔄 Inventario — Estado en tiempo real tras asignar una orden

<!-- ═══════════════════════════════════════════════════════════════════
  💡 GIF SUGERIDO — Muestra el efecto en cadena más valioso del sistema:
     1. Inventario: un equipo muestra badge "Disponible" (verde)
     2. Crea una nueva orden asignando ese equipo
     3. Vuelves al inventario: el mismo equipo ahora muestra "Asignado" (azul)
  
  Esto demuestra consistencia de datos entre módulos.
  Guardar en: ./docs/gifs/04-estado-inventario.gif
═══════════════════════════════════════════════════════════════════ -->
<!-- ![Estado Inventario](./docs/gifs/04-estado-inventario.gif) -->

```
[ Pendiente: GIF mostrando cómo un equipo pasa de "Disponible" a "Asignado" ]
```

---

### 🔔 Sistema de Notificaciones Personalizado

<!-- ═══════════════════════════════════════════════════════════════════
  💡 CAPTURA DE PANTALLA — Muestra los 4 tipos de toast al mismo tiempo.
  Puedes dispararlos temporalmente añadiendo 4 llamadas en un useEffect:
    toast.success('Guardado', { title: 'Éxito' });
    toast.error('Error de conexión', { title: 'Error' });
    toast.warning('Sin permisos', { title: 'Atención' });
    toast.info('Sesión activa');

  Guardar en: ./docs/images/05-toasts.png
═══════════════════════════════════════════════════════════════════ -->
<!-- ![Toast System](./docs/images/05-toasts.png) -->

```
[ Pendiente: Captura con los 4 tipos de toast (success, error, warning, info) ]
```

---

## 🧠 Retos Técnicos Superados

Esta sección documenta los problemas de ingeniería más relevantes del proyecto.  
Es el punto que más valoran los reclutadores técnicos: no solo que funcionó, sino **por qué se tomó cada decisión**.

---

### Reto 1 · Relación N:M entre Órdenes y Equipos

**El problema conceptual**

Una orden puede necesitar múltiples equipos, y un equipo puede haber estado en múltiples órdenes a lo largo del tiempo. Esto es, por definición, una relación **Muchos a Muchos (N:M)**. La solución canónica en SQL es una **tabla intermedia**:

```sql
-- Solución clásica con tabla intermedia
CREATE TABLE orden_equipo (
  id_orden   INTEGER REFERENCES ordenes(id),
  id_equipo  INTEGER REFERENCES equipos(id),
  PRIMARY KEY (id_orden, id_equipo)
);
```

**La decisión tomada**

Se optó por usar el tipo nativo `INTEGER[]` de PostgreSQL para almacenar los IDs de equipos directamente en la fila de la orden:

```sql
CREATE TABLE ordenes (
  id                    SERIAL PRIMARY KEY,
  titulo                VARCHAR(200),
  estado                VARCHAR(50),
  fecha_programa        DATE,
  id_usuario            INTEGER REFERENCES usuarios(id),
  equipos_seleccionados INTEGER[] DEFAULT '{}'
  -- Ejemplo real: {1, 3, 7}
);
```

**¿Por qué?**

En el dominio de FieldOps, la asignación de equipos es un dato **perteneciente a la orden en ese instante** — una "foto" de qué herramientas se despacharon. No se necesita consultar "dame todas las órdenes en que participó el equipo #3" desde el inventario. Las consultas van siempre en una dirección: desde la orden hacia los equipos.

Esto simplificó las queries de lectura eliminando JOINs innecesarios y redujo la complejidad del modelo a dos tablas.

**El trade-off honesto**

Si el sistema creciera y necesitara consultas inversas frecuentes (historial por equipo, reportes de uso), una tabla intermedia sería más eficiente. Para el alcance actual, el array de PostgreSQL fue la solución pragmática y correcta.

---

### Reto 2 · Sistema de notificaciones Toast sin dependencias externas

**El problema**

La app necesitaba notificaciones (toasts) accesibles desde cualquier componente: formularios dentro de modales, páginas completas, el propio header. La solución estándar es `react-toastify`, pero eso añade una dependencia externa con estilos que compiten con el tema oscuro personalizado de FieldOps.

**La solución: React Context + patrón Provider**

Se implementó un sistema completo usando solo las APIs nativas de React:

```jsx
// FieldOpsToast.jsx — arquitectura simplificada

// 1. Contexto global
const ToastContext = createContext(null);

// 2. Provider en la raíz (App.jsx)
export function FieldOpsToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const addToast = useCallback(({ type, title, message, duration }) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, type, title, message, duration }]);
  }, []);

  // useMemo evita recrear el objeto en cada render de App.jsx
  // y previene re-renders en cascada de todos los consumidores
  const toast = useMemo(() => ({
    success: (msg, opts) => addToast({ type: 'success', message: msg, ...opts }),
    error:   (msg, opts) => addToast({ type: 'error',   message: msg, ...opts }),
    warning: (msg, opts) => addToast({ type: 'warning', message: msg, ...opts }),
    info:    (msg, opts) => addToast({ type: 'info',    message: msg, ...opts }),
  }), [addToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Portal fuera del árbol de páginas, siempre visible */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        {toasts.map(t => <Toast key={t.id} toast={t} onRemove={removeToast} />)}
      </div>
    </ToastContext.Provider>
  );
}

// 3. Consumo en cualquier componente — una sola línea
export const useFieldOpsToast = () => useContext(ToastContext);
```

**El detalle más interesante: la barra de progreso**

La barra de conteo regresivo de cada toast se implementó con CSS puro — sin `setInterval`, sin lógica de tiempo en JavaScript:

```css
@keyframes fieldops-progress {
  from { width: 100%; }
  to   { width: 0%; }
}
```

```jsx
// La duración del CSS animation coincide exactamente con el setTimeout del JS
<span
  className="absolute bottom-0 left-0 h-0.5 bg-emerald-500"
  style={{ animation: `fieldops-progress ${duration}ms linear forwards` }}
/>
```

El navegador maneja la animación en el hilo de composición (GPU), sin bloquear el hilo principal de JavaScript.

---

### Reto 3 · Evitar la doble asignación de equipos

**El problema**

Si un administrador puede asignar cualquier equipo a cualquier orden, nada impide que el mismo taladro aparezca en dos órdenes activas simultáneamente — reproduciendo exactamente el problema de coordinación que FieldOps busca eliminar.

**La solución en el formulario de creación**

El componente `CrearOrdenes` filtra los equipos disponibles antes de mostrarlos:

```javascript
const equiposPermitidos = equipos.filter(equipo => {
  // ✅ Disponible → siempre mostrar
  if (equipo.estado === 'Disponible') return true;

  // ✅ Al EDITAR: mostrar los ya asignados a esta misma orden
  //    (el admin puede quitarlos, pero los ve para no perder contexto)
  if (ordenExistente?.equipos_seleccionados?.includes(equipo.id)) return true;

  // ❌ Asignado a otra orden o en Mantenimiento → ocultar
  return false;
});
```

**El resultado**

La lista de equipos es siempre un reflejo fiel del inventario real en ese instante. El administrador no puede seleccionar algo que ya está comprometido, haciendo la interfaz consistente con el estado de la base de datos.

---

### Reto 4 · Autenticación stateless con JWT en SPA

**El flujo completo**

```
Frontend                        Backend (Express)
────────                        ──────────────────
POST /auth/login ─────────────► bcrypt.compare(password, hash_bd)
  { correo, contrasena }         jwt.sign({ id, ocupacion }, SECRET)
                                ◄── { token, nombre, ocupacion }

localStorage.setItem('token')

GET /usuarios ────────────────► middleware verifyToken:
  Authorization: Bearer <JWT>     const decoded = jwt.verify(token, SECRET)
                                  req.usuario = decoded
                                  next()  ←  si válido
                                  res.401 ←  si expirado o inválido
                                ◄── [ ...usuarios ]
```

**Protección de rutas en el frontend**

```jsx
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  // replace=true elimina la ruta del historial del navegador.
  // Sin esto, el usuario puede volver atrás con "←" después de cerrar sesión
  // y ver páginas privadas en caché del navegador.
  if (!token) return <Navigate to="/" replace />;
  return children;
};
```

---

## 🏛️ Arquitectura del Sistema

```
┌───────────────────────────────────────────────────┐
│                  CLIENTE (SPA)                    │
│         React 18 · Vite · TailwindCSS             │
│                                                   │
│  Pages/      Components/        api/              │
│  Dashboard   FieldOpsToast  ─►  Auth.js           │
│  Usuarios    CrearUsuarios  ─►  Usuarios.js        │
│  Equipos     CrearEquipos   ─►  Equipos.js         │
│  Ordenes     CrearOrdenes   ─►  Ordenes.js         │
│  Perfil      ProtectedRoute                       │
└─────────────────────┬─────────────────────────────┘
                      │  HTTP REST · Bearer JWT
┌─────────────────────▼─────────────────────────────┐
│               SERVIDOR (REST API)                 │
│             Node.js 20 · Express 4                │
│                                                   │
│  verifyToken → checkRole → controller → query     │
│                                                   │
│  /auth/login       bcrypt + jwt.sign()            │
│  /dashboard        COUNT + agregaciones SQL        │
│  /usuarios         CRUD + bcrypt en passwords      │
│  /equipos          CRUD + gestión de estados       │
│  /ordenes          CRUD + actualizar estado equipo │
└─────────────────────┬─────────────────────────────┘
                      │  node-postgres (pool)
┌─────────────────────▼─────────────────────────────┐
│                PostgreSQL 16                       │
│                                                   │
│  usuarios       equipos         ordenes           │
│  ──────────     ──────────      ─────────────     │
│  id (PK)        id (PK)         id (PK)           │
│  nombre         nombre          titulo            │
│  correo UNIQUE  marca           estado            │
│  contrasena     estado          fecha_programa    │
│  ocupacion      condicion       id_usuario (FK)   │
│                 fecha_mantto    equipos[] INT[]    │
└───────────────────────────────────────────────────┘
```

---

## 🛠 Stack Tecnológico

| Capa | Tecnología | Por qué se eligió |
|---|---|---|
| ⚛️ React 18 | Frontend | Hooks + Context para estado global sin Redux |
| ⚡ Vite 5 | Build tool | HMR instantáneo, build optimizado |
| 🌊 TailwindCSS 3.4 | Estilos | Utilitarios sin archivos CSS externos |
| 🔀 React Router 6 | Routing | Rutas protegidas y navegación SPA |
| 🟢 Node.js 20 | Backend | Runtime async, ideal para APIs REST |
| 🚂 Express 4 | Framework | Minimalista, fácil de capas |
| 🔑 JWT | Auth | Stateless, sin sesiones en servidor |
| 🐘 PostgreSQL 16 | DB | Arrays nativos para la relación N:M |
| 🔒 bcrypt | Seguridad | Hash de contraseñas con salt automático |

---

## 📦 Requisitos Previos

```bash
node --version    # v20.x.x o superior
npm --version     # v9.x.x o superior
psql --version    # PostgreSQL 14 o superior
git --version     # 2.x.x
```

---

## 🚀 Instalación Local

```bash
# 1. Clonar
git clone https://github.com/tu-usuario/fieldops.git
cd fieldops

# 2. Dependencias
cd backend  && npm install
cd ../frontend && npm install

# 3. Variables de entorno
cd ../backend
cp .env.example .env
# → Edita .env con tus datos de PostgreSQL y JWT_SECRET

# 4. Base de datos
psql -U postgres -c "CREATE DATABASE fieldops_db;"
psql -U postgres -d fieldops_db -f database/schema.sql
psql -U postgres -d fieldops_db -f database/seed.sql   # datos de prueba

# 5. Levantar
# Terminal 1:
cd backend  && npm run dev    # → http://localhost:3000
# Terminal 2:
cd frontend && npm run dev    # → http://localhost:5173
```

**Credenciales de prueba:**

```
👑 Administrador  →  admin@fieldops.com   /  Admin123!
👷 Técnico        →  tecnico@fieldops.com /  Tecnico123!
```

---

## 🗄️ Base de Datos

### Schema

```sql
CREATE TABLE usuarios (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100)        NOT NULL,
    correo      VARCHAR(150) UNIQUE NOT NULL,
    contrasena  VARCHAR(255)        NOT NULL,
    ocupacion   VARCHAR(50)         NOT NULL
);

CREATE TABLE equipos (
    id           SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    marca        VARCHAR(100) NOT NULL,
    estado       VARCHAR(50)  NOT NULL DEFAULT 'Disponible',
    condicion    VARCHAR(50)  NOT NULL DEFAULT 'Nuevo',
    fecha_mantto DATE
);

CREATE TABLE ordenes (
    id                    SERIAL PRIMARY KEY,
    titulo                VARCHAR(200) NOT NULL,
    estado                VARCHAR(50)  NOT NULL DEFAULT 'Pendiente',
    fecha_programa        DATE,
    id_usuario            INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    equipos_seleccionados INTEGER[]    DEFAULT '{}'
);
```

---

## 🔧 Variables de Entorno

**`/backend/.env`**
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fieldops_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

JWT_SECRET=clave_secreta_aleatoria_minimo_32_caracteres
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:5173
```

**`/frontend/.env`**
```env
VITE_API_URL=http://localhost:3000
```

---

## 🛡️ Roles y Permisos

| Acción | 👑 Admin | 👷 Técnico |
|---|:---:|:---:|
| Ver Dashboard | ✅ | ✅ |
| CRUD Usuarios | ✅ | ❌ |
| Ver Inventario | ✅ | ✅ |
| CRUD Equipos | ✅ | ❌ |
| Ver Órdenes | ✅ | ✅ |
| Crear / Eliminar Órdenes | ✅ | ❌ |
| Actualizar estado de Órdenes | ✅ | ✅ |
| Ver Perfil propio | ✅ | ✅ |

---

## 📡 API Reference

Todas las rutas (excepto `/auth/login`) requieren:
```
Authorization: Bearer <JWT_TOKEN>
```

```http
POST   /auth/login           → { token, nombre, ocupacion }
GET    /dashboard/metricas   → { totalOrdenes, completadas, ... }

GET    /usuarios
POST   /usuarios             (Admin)
PUT    /usuarios/:id         (Admin)
DELETE /usuarios/:id         (Admin)

GET    /equipos
POST   /equipos              (Admin)
PUT    /equipos/:id
DELETE /equipos/:id          (Admin)

GET    /ordenes
POST   /ordenes              (Admin)
PUT    /ordenes/:id
DELETE /ordenes/:id          (Admin)
```

---

## 📄 Licencia

MIT © FieldOps Team

---

<div align="center">

**¿Encontraste algo útil? Dale una ⭐ al repo.**

![Estado](https://img.shields.io/badge/Estado-En%20desarrollo-f59e0b?style=flat-square&logo=github)

</div>