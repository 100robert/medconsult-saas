# 🏥 MedConsult SaaS - Plataforma de Telemedicina

MedConsult es una plataforma integral de telemedicina SaaS (Software as a Service) diseñada para conectar pacientes con médicos especialistas de manera rápida y segura. Permite agendar citas presenciales y virtuales, realizar videoconsultas, gestionar historiales médicos y procesar pagos en línea.

## 🚀 Características Principales

*   **Gestión de Citas**: Agendamiento inteligente con verificación de disponibilidad en tiempo real.
*   **Videoconsultas**: Consultas virtuales integradas directamente en la plataforma.
*   **Pagos y Facturación**: Procesamiento de pagos, generación de boletas electrónicas y gestión de reembolsos.
*   **Historial Médico**: Registro digital de atenciones, diagnósticos y recetas.
*   **Multi-Rol**: Interfaces personalizadas para Pacientes, Médicos y Administradores.
*   **Dashboard Interactivo**: Estadísticas, gráficos y métricas claves para cada usuario.

## 🏗️ Arquitectura

El proyecto sigue una arquitectura de **Microservicios** para el backend y una **SPA (Single Page Application)** para el frontend.

```mermaid
graph TD
    User[Usuario (Web/Mobile)] --> Frontend[Frontend (Next.js)]
    
    subgraph "Backend Services (NestJS)"
        Frontend --> API_Gateway[API Gateway / Nginx]
        API_Gateway --> Auth[Auth Service]
        API_Gateway --> Appointments[Appointments Service]
        API_Gateway --> Payments[Payments Service]
        API_Gateway --> Reviews[Reviews Service]
    end
    
    subgraph "Data Layer"
        Auth --> DB_Auth[(PostgreSQL Auth)]
        Appointments --> DB_Appt[(PostgreSQL Citas)]
        Payments --> DB_Pay[(PostgreSQL Pagos)]
        Reviews --> DB_Rev[(PostgreSQL Reseñas)]
    end
```

## 🛠️ Tecnologías

### Frontend
*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Lenguaje**: TypeScript
*   **Estilos**: Tailwind CSS
*   **UI Components**: Lucide React, Radix UI (base)
*   **Estado**: Zustand
*   **Gráficos**: Recharts

### Backend
*   **Framework**: [NestJS](https://nestjs.com/)
*   **Lenguaje**: TypeScript
*   **ORM**: Prisma
*   **Base de Datos**: PostgreSQL
*   **Validación**: Zod / Class-Validator

## 📂 Estructura del Proyecto

```bash
medconsult-saas/
├── frontend/               # Aplicación Next.js
│   ├── src/app/            # Rutas y páginas
│   ├── src/components/     # Componentes reutilizables
│   ├── src/lib/            # Utilidades y tipos
│   └── src/store/          # Gestión de estado (Zustand)
│
├── services/               # Microservicios Backend
│   ├── auth-service/       # Autenticación y Usuarios
│   ├── appointments-service/ # Citas y Disponibilidad
│   ├── payments-service/   # Pagos y Transacciones
│   └── reviews-service/    # Calificaciones
│
├── shared/                 # Código compartido (Tipos, DTOs)
└── scripts/                # Scripts de utilidad (start, seed, etc.)
```

## ⚡ Instalación y Ejecución

### Prerrequisitos
*   Node.js (v18+)
*   PostgreSQL
*   npm o yarn

### Pasos Iniciales

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/100robert/medconsult-saas.git
    cd medconsult-saas
    ```

2.  **Instalar dependencias globales**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno**
    Copia el archivo `.env.example` a `.env` en la raíz y en cada servicio si es necesario.
    *(Ver sección de configuración detallada en cada servicio)*

4.  **Iniciar Desarrollo (Todo en uno)**
    Este comando inicia el frontend y todos los microservicios backend en paralelo.
    ```bash
    npm run dev
    ```

### Scripts Disponibles

*   `npm run dev`: Inicia todo el entorno de desarrollo.
*   `npm run dev:frontend`: Inicia solo el frontend.
*   `npm run dev:backend`: Inicia todos los servicios backend.
*   `npm run seed`: Pobla la base de datos con datos de prueba.

## 🔐 Credenciales de Prueba (Seed)

Si ejecutaste el script de seed, puedes usar estos usuarios:

| Rol | Email | Contraseña |
| --- | --- | --- |
| **Admin** | admin@medconsult.com | `password123` |
| **Médico (Cardiología)** | juan.perez@medconsult.com | `password123` |
| **Paciente** | maria.garcia@gmail.com | `password123` |

## 🧪 Testing

Para ejecutar los tests unitarios:

```bash
npm run test
```

## 📄 Licencia

Este proyecto es propiedad privada de MedConsult S.A.C.

## 📚 Documentación Adicional

Para información más detallada de cada componente:

*   **[Auth Service](./services/auth-service/README.md)** - Autenticación y gestión de usuarios
*   **[Appointments Service](./services/appointments-service/README.md)** - Citas y disponibilidad
*   **[Payments Service](./services/payments-service/README.md)** - Pagos y comisiones
*   **[Reviews Service](./services/reviews-service/README.md)** - Reseñas y calificaciones
*   **[Frontend](./frontend/README.md)** - Aplicación web Next.js
*   **[Guía de Flujos](./FLUJOS.md)** - Flujos de usuario detallados

