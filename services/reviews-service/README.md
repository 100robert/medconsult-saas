# ⭐ Reviews Service

El **Reviews Service** gestiona las reseñas y calificaciones de médicos. Permite a pacientes dejar comentarios después de una consulta y a médicos responder.

## 🏗️ Arquitectura

*   **Controller**: Endpoints para crear, listar y aprobar reseñas.
*   **Service**: Lógica de negocio (validación de reseñas, cálculo de promedio de calificaciones).
*   **Database**: PostgreSQL con Prisma ORM.

## 📦 Stack Tecnológico

*   **Runtime**: Node.js + TypeScript
*   **ORM**: Prisma

## 🗄️ Modelos de Datos

### Resena (`resenas`)
*   `id`: UUID
*   `idMedico`, `idPaciente`, `idCita`: Referencias
*   `calificacion`: 1-5 estrellas
*   `comentario`: Texto de la reseña
*   `respuesta`: Respuesta del médico (opcional)
*   `estado`: `PENDIENTE`, `APROBADA`, `RECHAZADA`
*   `anonima`: Si se oculta el nombre del paciente
*   `verificada`: Si es de una cita real

## 🌐 API Reference

| Método | Endpoint | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/resenas` | Crear nueva reseña | Paciente |
| `GET` | `/resenas/medico/:id` | Listar reseñas de un médico | Público |
| `POST` | `/resenas/:id/responder` | Médico responde a reseña | Médico |
| `PATCH` | `/resenas/:id/aprobar` | Aprobar reseña (moderación) | Admin |

## ⚙️ Lógica de Negocio

*   Las reseñas están vinculadas a citas completadas.
*   Solo se puede dejar **1 reseña por cita**.
*   El promedio de calificaciones del médico se actualiza automáticamente.
*   Puede haber moderación (estado `PENDIENTE` → `APROBADA`).

## 🚀 Ejecución

```bash
cd services/reviews-service
npm install
npm run dev
```

Puerto por defecto: `3004`
