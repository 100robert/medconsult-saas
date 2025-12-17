# 🎨 Frontend - MedConsult SaaS

Aplicación web construida con **Next.js 14** (App Router), diseñada para ofrecer una experiencia fluida a Pacientes, Médicos y Administradores.

## 🏗️ Arquitectura

*   **Framework**: Next.js 14 con App Router
*   **Lenguaje**: TypeScript
*   **Estilos**: Tailwind CSS
*   **Estado Global**: Zustand (`authStore`)
*   **HTTP Client**: Axios (wrapper en `lib/api.ts`)
*   **Gráficos**: Recharts

## 📂 Estructura de Carpetas

```
frontend/
├── src/
│   ├── app/                  # Rutas de Next.js (App Router)
│   │   ├── dashboard/        # Dashboard principal
│   │   │   ├── appointments/ # Gestión de citas
│   │   │   ├── payments/     # Historial de pagos
│   │   │   ├── reports/      # Reportes (Admin)
│   │   │   └── medico/       # Vistas específicas de médico
│   │   ├── auth/             # Login, Register
│   │   └── layout.tsx        # Layout principal
│   │
│   ├── components/           # Componentes reutilizables
│   │   ├── ui/               # Componentes base (Button, Input)
│   │   └── ...
│   │
│   ├── lib/                  # Utilidades y lógica de negocio
│   │   ├── api.ts            # Cliente HTTP configurado
│   │   ├── auth.ts           # Funciones de autenticación
│   │   ├── appointments.ts   # Lógica de citas
│   │   └── payments.ts       # Lógica de pagos
│   │
│   └── store/                # Gestión de estado (Zustand)
│       └── authStore.ts      # Estado de autenticación
│
└── public/                   # Assets estáticos
```

## 🎨 Sistema de Diseño

### Paleta de Colores
*   **Primario**: Teal (`teal-600`, `teal-700`)
*   **Secundario**: Emerald, Blue
*   **Neutrales**: Gray (50-900)

### Componentes UI
Todos en `src/components/ui/`:
*   `Button`: Variantes (primary, secondary, outline, ghost)
*   `Input`: Campos de formulario con validación
*   `Card`: Contenedores de información

## 🔐 Autenticación

Sistema de autenticación con JWT:
*   **Access Token**: Almacenado en localStorage (expira en 15min)
*   **Refresh Token**: Usado para renovar el access token
*   **Store**: `authStore` (Zustand) mantiene el usuario actual

Flujo:
1. Login → Recibe tokens
2. Cada request incluye `Authorization: Bearer [token]`
3. Si 401 → Intenta refresh
4. Si falla → Logout automático

## 📱 Flujos Clave

### Agendamiento de Cita (Paciente)
1. `dashboard/appointments/new`
2. Seleccionar médico → Fecha → Hora
3. Confirmar y pagar
4. Redirección a boleta de venta

### Videoconsulta
1. Usuario accede a `dashboard/consultations/[id]`
2. Integración con Jitsi Meet (WebRTC)
3. Médico puede agregar notas, diagnóstico y receta

### Dashboard Admin
*   Gráficos de actividad (Recharts)
*   Gestión de usuarios
*   Aprobación de médicos
*   Estadísticas globales

## 🚀 Ejecución

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

```bash
npm run test
```

## 📦 Build de Producción

```bash
npm run build
npm start
```

## 🔧 Variables de Entorno

Crear archivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📄 Convenciones de Código

*   Componentes en PascalCase
*   Archivos de utilidad en camelCase
*   CSS: Tailwind (evitar CSS custom salvo excepciones)
*   Tipos: Definidos en `lib/*.ts` o en el propio archivo
