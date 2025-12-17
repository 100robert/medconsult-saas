# 🔐 Auth Service

El **Auth Service** es el microservicio encargado de la autenticación, autorización y gestión de usuarios en MedConsult SaaS. Gestiona el ciclo de vida de las cuentas, tokens JWT, y roles de usuario.

## 🏗️ Arquitectura

Este servicio sigue el patrón **Controller-Service-Repository** (vía Prisma).

*   **Controller**: Maneja las peticiones HTTP, valida datos con Zod y llama al servicio.
*   **Service**: Contiene la lógica de negocio (hashing de contraseñas, generación de tokens, gestión de perfiles).
*   **Database**: PostgreSQL gestionado con Prisma ORM.

## 📦 Stack Tecnológico

*   **Runtime**: Node.js
*   **Framework**: Express (interno dentro de la arquitectura de servicios)
*   **Lenguaje**: TypeScript
*   **ORM**: Prisma
*   **Validación**: Zod
*   **Seguridad**: bcrypt (hashing), jsonwebtoken (JWT)

## 🗄️ Modelos de Datos Clave

### Usuario (`usuarios`)
La entidad base para todos los usuarios.
*   `id`: UUID
*   `correo`: Email único
*   `rol`: `ADMIN`, `MEDICO`, `PACIENTE`
*   `activo`: Estado de la cuenta

### Paciente (`pacientes`)
Perfil extendido para pacientes.
*   Vinculado 1:1 con Usuario.
*   Datos médicos básicos (alergias, tipo sangre).
*   `esPro`: Indicador de suscripción Premium.

### Médico (`medicos`)
Perfil extendido para profesionales.
*   Vinculado 1:1 con Usuario.
*   `especialidad`, `precioPorConsulta`, `CMP` (Licencia).
*   `estado`: `PENDIENTE`, `VERIFICADO`, `RECHAZADO`.

## 🌐 API Reference

### Autenticación Pública

| Método | Endpoint | Descripción | Body Requerido |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Registro de nuevo usuario | `email`, `password`, `nombre`, `apellido`, `rol` |
| `POST` | `/auth/login` | Inicio de sesión | `email`, `password` |
| `POST` | `/auth/refresh-token` | Renovar Access Token | `refreshToken` |
| `POST` | `/auth/forgot-password` | Solicitar reseteo contraseña | `email` |
| `POST` | `/auth/reset-password` | Resetear contraseña con token | `token`, `newPassword` |

### Perfil (Requiere Auth)

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/auth/me` | Obtener perfil del usuario actual |
| `PUT` | `/auth/profile` | Actualizar datos del perfil |
| `POST` | `/auth/change-password` | Cambiar contraseña |

### Administración (Requiere Rol ADMIN)

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/auth/admin/users` | Listar todos los usuarios (parámetros: `page`, `limit`, `rol`) |
| `PATCH` | `/auth/admin/users/:id/status` | Activar/Desactivar usuario |
| `GET` | `/auth/admin/stats` | Estadísticas globales de usuarios |
| `POST` | `/auth/admin/create-user` | Crear usuario manualmente (ej. Médico) |

## 🚀 Instalación y Ejecución

1.  **Configurar Variables de Entorno**
    Crear archivo `.env` en la raíz del servicio:
    ```env
    PORT=3001
    DATABASE_URL="postgresql://..."
    JWT_SECRET="tu_secreto_seguro"
    JWT_REFRESH_SECRET="tu_otro_secreto"
    ```

2.  **Instalar Dependencias**
    ```bash
    npm install
    ```

3.  **Ejecutar**
    ```bash
    npm run dev
    ```

## 🧪 Testing

Ejecutar tests unitarios con Jest:
```bash
npm run test
```
