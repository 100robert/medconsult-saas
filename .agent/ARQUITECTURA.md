# 🏥 MedConsult SaaS - Arquitectura Completa del Proyecto

## 📋 Tabla de Contenidos
1. [Visión General](#visión-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Backend](#arquitectura-del-backend)
4. [Arquitectura del Frontend](#arquitectura-del-frontend)
5. [Flujo de Comunicación](#flujo-de-comunicación)
6. [Cómo Ejecutar el Proyecto](#cómo-ejecutar-el-proyecto)
7. [Estructura de Directorios](#estructura-de-directorios)
8. [Endpoints Principales](#endpoints-principales)

---

## 🎯 Visión General

**MedConsult** es una plataforma SaaS de telemedicina que permite a pacientes conectarse con médicos especialistas de forma online. El proyecto utiliza una **arquitectura de microservicios** con un API Gateway como punto de entrada único.

### Arquitectura General:

```
┌─────────────┐
│   FRONTEND  │  (Next.js - Puerto 3010)
│  (Next.js)  │
└──────┬──────┘
       │
       │ HTTP/REST
       │
┌──────▼──────────────────────────────────────────────┐
│           API GATEWAY (Puerto 3000)                 │
│  - Rate Limiting                                    │
│  - Autenticación JWT                                │
│  - CORS                                             │
│  - Proxy a Microservicios                           │
└──────┬──────────────────────────────────────────────┘
       │
       │ Proxy HTTP
       │
┌──────┴─────────────────────────────────────────────┐
│              MICROSERVICIOS                        │
├────────────────────────────────────────────────────┤
│ 📌 Auth Service        (Puerto 3001)               │
│ 📌 Users Service       (Puerto 3002)               │
│ 📌 Appointments        (Puerto 3003)               │
│ 📌 Consultations       (Puerto 3004)               │
│ 📌 Payments            (Puerto 3005)               │
│ 📌 Notifications       (Puerto 3006)               │
│ 📌 Reviews             (Puerto 3007)               │
│ 📌 Audit               (Puerto 3008)               │
└────────────────────────────────────────────────────┘
       │
       │ Prisma ORM
       │
┌──────▼──────────────────────────────────────────────┐
│          INFRAESTRUCTURA (Docker Compose)           │
├─────────────────────────────────────────────────────┤
│ 🗄️  PostgreSQL         (Puerto 5432)               │
│ 🐰 RabbitMQ            (Puerto 5672, 15672)        │
│ 🔴 Redis               (Puerto 6379)               │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **Prisma ORM** - Acceso a base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación y autorización
- **bcryptjs** - Hash de contraseñas
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging de requests
- **Zod** - Validación de datos

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS 4** - Estilos
- **Axios** - Cliente HTTP
- **Zustand** - Estado global
- **React Hook Form** + **Zod** - Formularios
- **Framer Motion** - Animaciones
- **Recharts** - Gráficos
- **Lucide React** - Iconos
- **js-cookie** - Manejo de cookies

### Infraestructura
- **Docker Compose** - Orquestación de contenedores
- **PostgreSQL 17** - Base de datos
- **RabbitMQ 3.12** - Message broker
- **Redis 7** - Cache

---

## 🔧 Arquitectura del Backend

### 1. API Gateway (Puerto 3000)

**Ubicación**: `/gateway`

**Responsabilidades**:
- ✅ Punto de entrada único para todas las peticiones
- ✅ Autenticación y autorización (verificación JWT)
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuration
- ✅ Proxy/routing a microservicios
- ✅ Health checks de servicios

**Archivos clave**:
```
gateway/
├── src/
│   ├── index.ts              # Punto de entrada
│   ├── config/
│   │   └── services.ts       # Configuración de microservicios
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── rateLimiter.middleware.ts
│   │   └── error.middleware.ts
│   ├── proxy/
│   │   └── index.ts          # Proxies HTTP
│   └── routes/
│       └── index.ts          # Rutas del gateway
└── .env                      # Variables de entorno
```

**Configuración de servicios** (`services.ts`):
```typescript
export const services = {
  auth: {
    url: 'http://localhost:3001',
    healthCheck: '/health',
    routes: ['/auth'],
    requiresAuth: false
  },
  users: {
    url: 'http://localhost:3002',
    routes: ['/usuarios', '/pacientes', '/medicos'],
    requiresAuth: true
  },
  // ... más servicios
}
```

**Comando para ejecutar**:
```bash
cd gateway
npm run dev
```

---

### 2. Microservicios

Cada microservicio sigue la misma estructura y patrón:

#### 📌 Auth Service (Puerto 3001)

**Ubicación**: `/services/auth-service`

**Responsabilidades**:
- ✅ Registro de usuarios (solo pacientes)
- ✅ Login con JWT
- ✅ Refresh tokens
- ✅ Verificación de email
- ✅ Recuperación de contraseña
- ✅ Gestión de perfil

**Estructura**:
```
auth-service/
├── src/
│   ├── index.ts              # Inicialización del servicio
│   ├── config/
│   │   └── database.ts       # Conexión Prisma
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── services/
│   │   └── auth.service.ts   # Lógica de negocio
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── rateLimiter.middleware.ts
│   ├── routes/
│   │   └── auth.routes.ts
│   ├── validators/
│   │   └── auth.validator.ts # Validación Zod
│   └── utils/
│       └── jwt.utils.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

**Endpoints principales**:
- `POST /auth/register` - Registro de paciente
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh token
- `GET /auth/profile` - Obtener perfil
- `PUT /auth/profile` - Actualizar perfil

**Comando para ejecutar**:
```bash
cd services/auth-service
npm run dev
```

---

#### 📌 Users Service (Puerto 3002)

**Responsabilidades**:
- ✅ Gestión de usuarios (CRUD)
- ✅ Gestión de médicos
- ✅ Gestión de pacientes
- ✅ Especialidades médicas
- ✅ Disponibilidad de médicos

---

#### 📌 Appointments Service (Puerto 3003)

**Responsabilidades**:
- ✅ Crear/cancelar/reprogramar citas
- ✅ Consultar disponibilidad
- ✅ Historial de citas
- ✅ Estados de citas (PENDIENTE, CONFIRMADA, CANCELADA, etc.)

---

#### 📌 Consultations Service (Puerto 3004)

**Responsabilidades**:
- ✅ Gestión de consultas médicas
- ✅ Recetas médicas
- ✅ Diagnósticos
- ✅ Historial médico

---

#### 📌 Payments Service (Puerto 3005)

**Responsabilidades**:
- ✅ Procesamiento de pagos
- ✅ Historial de transacciones
- ✅ Facturación

---

#### 📌 Notifications Service (Puerto 3006)

**Responsabilidades**:
- ✅ Envío de notificaciones por email/SMS
- ✅ Recordatorios de citas
- ✅ Notificaciones push

---

#### 📌 Reviews Service (Puerto 3007)

**Responsabilidades**:
- ✅ Reseñas de médicos
- ✅ Calificaciones
- ✅ Comentarios

---

#### 📌 Audit Service (Puerto 3008)

**Responsabilidades**:
- ✅ Logs de auditoría (solo admin)
- ✅ Tracking de acciones

---

### 🔄 Ejecutar TODOS los servicios backend

**Desde la raíz del proyecto**:
```bash
npm run dev
```

Este comando ejecuta **concurrentemente** todos los microservicios usando `concurrently`.

**Para ejecutar solo gateway + auth**:
```bash
npm run dev:backend
```

---

## 🎨 Arquitectura del Frontend

**Ubicación**: `/frontend`

**Puerto**: 3010

**Framework**: Next.js 16 (App Router)

### Estructura de Directorios:

```
frontend/
├── src/
│   ├── app/                      # App Router (Next.js)
│   │   ├── page.tsx              # Landing page
│   │   ├── login/
│   │   │   └── page.tsx          # Página de login
│   │   ├── register/
│   │   │   └── page.tsx          # Página de registro
│   │   └── dashboard/            # Dashboard (protegido)
│   │       ├── layout.tsx        # Layout con sidebar
│   │       ├── page.tsx          # Dashboard principal
│   │       ├── appointments/     # Módulo de citas
│   │       ├── consultations/    # Módulo de consultas
│   │       ├── doctors/          # Módulo de doctores (admin)
│   │       ├── profile/          # Perfil de usuario
│   │       └── settings/         # Configuración
│   │
│   ├── components/               # Componentes reutilizables
│   │   └── ui/                   # Componentes UI básicos
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       └── Sidebar.tsx
│   │
│   ├── lib/                      # Utilidades y APIs
│   │   ├── api.ts                # Cliente Axios configurado
│   │   ├── auth.ts               # Funciones de autenticación
│   │   ├── appointments.ts       # API de citas
│   │   ├── consultations.ts      # API de consultas
│   │   └── doctors.ts            # API de doctores
│   │
│   └── store/                    # Estado global (Zustand)
│       └── useAuthStore.ts       # Store de autenticación
│
├── public/                       # Archivos estáticos
└── package.json
```

### 📡 Cliente API (`lib/api.ts`)

El frontend se comunica con el backend a través del **API Gateway** (puerto 3000).

**Configuración**:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Interceptores**:
- ✅ Agrega JWT token automáticamente a las peticiones
- ✅ Maneja refresh token en caso de 401
- ✅ Redirige a login si no hay sesión válida

### 🔐 Autenticación (`lib/auth.ts`)

**Funciones principales**:
```typescript
// Login
await login({ email, password })

// Registro
await register({ email, password, nombre, apellido })

// Logout
await logout()

// Obtener perfil
const user = await getProfile()

// Verificar si está autenticado
const isAuth = isAuthenticated()
```

**Cookies**:
- `accessToken` - Expira en 1 día
- `refreshToken` - Expira en 7 días

### 🎨 Sistema de Diseño

**TailwindCSS 4** con tema personalizado en `globals.css`:
- ✅ Paleta de colores custom
- ✅ Modo oscuro con glassmorphism
- ✅ Animaciones suaves
- ✅ Tipografía moderna (Inter font)

### Comando para ejecutar:
```bash
cd frontend
npm run dev
```

Se ejecuta en **http://localhost:3010**

---

## 🔄 Flujo de Comunicación

### 1. Flujo de Login

```
┌─────────┐         ┌──────────┐         ┌─────────┐
│ FRONTEND│         │ GATEWAY  │         │  AUTH   │
│(Next.js)│         │  :3000   │         │ :3001   │
└────┬────┘         └────┬─────┘         └────┬────┘
     │                   │                    │
     │ POST /api/auth/login                   │
     │ { email, password }                    │
     ├──────────────────►│                    │
     │                   │                    │
     │                   │ Proxy to           │
     │                   │ POST /auth/login   │
     │                   ├───────────────────►│
     │                   │                    │
     │                   │                    │ Verificar credenciales
     │                   │                    │ en PostgreSQL
     │                   │                    │
     │                   │ { user, tokens }   │
     │                   │◄───────────────────┤
     │                   │                    │
     │ { user, tokens }  │                    │
     │◄──────────────────┤                    │
     │                   │                    │
     │ Guardar tokens    │                    │
     │ en cookies        │                    │
     │                   │                    │
```

### 2. Flujo de Petición Autenticada

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│ FRONTEND│         │ GATEWAY  │         │ SERVICE  │
└────┬────┘         └────┬─────┘         └────┬─────┘
     │                   │                     │
     │ GET /api/citas    │                     │
     │ + JWT Token       │                     │
     ├──────────────────►│                     │
     │                   │                     │
     │                   │ Verificar JWT       │
     │                   │ (middleware)        │
     │                   │                     │
     │                   │ Proxy to            │
     │                   │ GET /citas          │
     │                   ├────────────────────►│
     │                   │                     │
     │                   │ { data }            │
     │                   │◄────────────────────┤
     │                   │                     │
     │ { data }          │                     │
     │◄──────────────────┤                     │
     │                   │                     │
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Todo junto (Recomendado)

**1. Iniciar infraestructura (Docker)**:
```bash
docker-compose up -d
```
Esto inicia PostgreSQL, RabbitMQ y Redis.

**2. Iniciar todos los servicios backend**:
```bash
npm run dev
```
Esto inicia el Gateway + 8 microservicios en paralelo.

**3. Iniciar frontend** (en otra terminal):
```bash
cd frontend
npm run dev
```

**Acceder a**:
- Frontend: http://localhost:3010
- Gateway: http://localhost:3000
- Auth Service: http://localhost:3001
- RabbitMQ Management: http://localhost:15672 (user: medconsult_user, pass: medconsult_password_dev)

---

### Opción 2: Individual

**Backend**:
```bash
# Gateway
cd gateway
npm run dev

# Auth Service
cd services/auth-service
npm run dev

# Otros servicios...
```

**Frontend**:
```bash
cd frontend
npm run dev
```

---

## 📁 Estructura de Directorios Principal

```
medconsult-saas/
├── frontend/               # Frontend Next.js
│   ├── src/
│   │   ├── app/           # Pages (Next.js App Router)
│   │   ├── components/    # Componentes React
│   │   ├── lib/           # APIs y utilidades
│   │   └── store/         # Estado global
│   └── package.json
│
├── gateway/               # API Gateway
│   ├── src/
│   │   ├── index.ts      # Entry point
│   │   ├── config/       # Configuración
│   │   ├── middlewares/  # Auth, CORS, Rate Limit
│   │   ├── proxy/        # HTTP proxies
│   │   └── routes/       # Rutas del gateway
│   └── package.json
│
├── services/             # 8 Microservicios
│   ├── auth-service/
│   ├── users-service/
│   ├── appointments-service/
│   ├── consultations-service/
│   ├── payments-service/
│   ├── notifications-service/
│   ├── reviews-service/
│   └── audit-service/
│
├── shared/               # Código compartido
│   ├── types/
│   └── utils/
│
├── infrastructure/       # Scripts de infraestructura
│
├── docker-compose.yml    # PostgreSQL, RabbitMQ, Redis
│
├── package.json          # Scripts root
└── tsconfig.json         # TypeScript config
```

---

## 🔗 Endpoints Principales

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Registro de paciente | ❌ |
| POST | `/auth/login` | Login | ❌ |
| POST | `/auth/refresh` | Refresh token | ❌ |
| GET | `/auth/profile` | Obtener perfil | ✅ |
| PUT | `/auth/profile` | Actualizar perfil | ✅ |
| POST | `/auth/logout` | Cerrar sesión | ✅ |

### 👤 Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/usuarios` | Listar usuarios | ✅ Admin |
| GET | `/usuarios/:id` | Obtener usuario | ✅ |
| PUT | `/usuarios/:id` | Actualizar usuario | ✅ |
| DELETE | `/usuarios/:id` | Eliminar usuario | ✅ Admin |

### 👨‍⚕️ Médicos (`/api/medicos`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/medicos` | Listar médicos | ✅ |
| POST | `/medicos` | Crear médico (admin) | ✅ Admin |
| GET | `/medicos/:id` | Obtener médico | ✅ |
| GET | `/medicos/:id/disponibilidad` | Ver disponibilidad | ✅ |

### 📅 Citas (`/api/citas`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/citas` | Listar citas | ✅ |
| POST | `/citas` | Crear cita | ✅ Paciente |
| GET | `/citas/:id` | Obtener cita | ✅ |
| PATCH | `/citas/:id` | Actualizar estado | ✅ |
| DELETE | `/citas/:id` | Cancelar cita | ✅ |

### 🩺 Consultas (`/api/consultas`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/consultas` | Listar consultas | ✅ |
| POST | `/consultas` | Crear consulta | ✅ Médico |
| GET | `/consultas/:id` | Obtener consulta | ✅ |

### 💳 Pagos (`/api/pagos`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/pagos` | Historial de pagos | ✅ |
| POST | `/pagos` | Crear pago | ✅ |
| GET | `/pagos/:id` | Obtener pago | ✅ |

### ⭐ Reseñas (`/api/resenas`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/resenas/medico/:id` | Reseñas de médico | ❌ |
| POST | `/resenas` | Crear reseña | ✅ Paciente |
| GET | `/resenas/:id` | Obtener reseña | ❌ |

---

## 🔒 Seguridad

### JWT Tokens
- **Access Token**: 1 hora de duración
- **Refresh Token**: 7 días
- Almacenados en **cookies httpOnly** (frontend)

### Rate Limiting
- **General**: 100 req / 15 min
- **Auth**: 5 req / 15 min (login, registro)

### Otros
- ✅ Helmet.js para headers seguros
- ✅ CORS configurado
- ✅ Passwords hasheados con bcrypt (10 rounds)
- ✅ Validación de datos con Zod
- ✅ SQL injection protegido por Prisma ORM

---

## 🧪 Testing

**Ejecutar tests**:
```bash
# Todos los tests
npm test

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Test específico de un servicio
npm run test:auth
```

---

## 📊 Base de Datos

**Motor**: PostgreSQL 17

**ORM**: Prisma

**Schemas**: Cada microservicio tiene su propio schema en `/prisma/schema.prisma`

**Conexión**:
```
postgresql://medconsult_user:medconsult_password_dev@localhost:5432/medconsult_db
```

**Comandos útiles**:
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Abrir Prisma Studio
npx prisma studio
```

---

## 🔧 Variables de Entorno

### Gateway (`.env`)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=tu_super_secreto
ALLOWED_ORIGINS=http://localhost:3010

# URLs de servicios
AUTH_SERVICE_URL=http://localhost:3001
USERS_SERVICE_URL=http://localhost:3002
# ... etc
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Cada Servicio (`.env`)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=tu_super_secreto
```

---

## 📚 Recursos Adicionales

- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Express Docs**: https://expressjs.com
- **Docker Compose**: https://docs.docker.com/compose

---

## 🎯 Próximos Pasos / TODOs

- [ ] Implementar WebSockets para consultas en tiempo real
- [ ] Agregar paginación en todas las listas
- [ ] Integración con pasarela de pago (Stripe)
- [ ] Tests E2E con Playwright
- [ ] CI/CD con GitHub Actions
- [ ] Deploy en AWS/GCP
- [ ] Configurar Redis para cache
- [ ] RabbitMQ para eventos asíncronos

---

**Última actualización**: 2025-12-04
