# 📅 Appointments Service

El **Appointments Service** gestiona todo el ciclo de vida de las citas médicas: agendamiento, disponibilidad de médicos, cancelaciones, reprogramaciones y políticas de reembolso.

## 🏗️ Arquitectura

*   **Controller**: Maneja endpoints HTTP para citas, disponibilidad y cancelaciones.
*   **Service**: Lógica de negocio (validación de horarios, cálculo de reembolsos, actualización de estados).
*   **Database**: PostgreSQL con Prisma ORM.

## 📦 Stack Tecnológico

*   **Runtime**: Node.js + TypeScript
*   **ORM**: Prisma
*   **Validación**: Zod

## 🗄️ Modelos de Datos

### Cita (`citas`)
*   `id`: UUID
*   `idPaciente`, `idMedico`: Referencias a usuarios
*   `fechaHoraCita`: DateTime de la cita
*   `estado`: `PROGRAMADA`, `CONFIRMADA`, `COMPLETADA`, `CANCELADA`
*   `tipo`: `PRESENCIAL`, `VIDEOCONSULTA`
*   `razonCancelacion`, `canceladaPor`: Datos de cancelación

### Disponibilidad (`disponibilidades`)
*   `idMedico`: Referencia al médico
*   `diaSemana`: `LUNES`, `MARTES`, etc.
*   `horaInicio`, `horaFin`: Horario disponible
*   `activo`: Si está habilitado

### FechaNoDisponible (`fechas_no_disponibles`)
*   Bloqueo de días específicos (vacaciones, eventos).

## 🌐 API Reference

### Gestión de Citas

| Método | Endpoint | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/citas` | Crear nueva cita | Paciente |
| `GET` | `/citas` | Listar citas del usuario | Usuario |
| `GET` | `/citas/:id` | Obtener detalles de cita | Usuario |
| `PATCH` | `/citas/:id/cancelar` | Cancelar cita (con reembolso según tiempo) | Usuario |
| `PATCH` | `/citas/:id/reprogramar` | Cambiar fecha/hora de cita | Paciente |
| `PATCH` | `/citas/:id/confirmar` | Confirmar cita (Médico) | Médico |

### Disponibilidad

| Método | Endpoint | Descripción |
| --- | --- | --- |
| `GET` | `/disponibilidad/medico/:idMedico` | Obtener horarios de un médico |
| `GET` | `/disponibilidad/slots` | Ver slots disponibles por fecha |
| `POST` | `/disponibilidad` | Crear horario (Médico) |
| `DELETE` | `/disponibilidad/:id` | Eliminar horario |

## 🔄 Lógica de Reembolso

El servicio implementa políticas automáticas de reembolso según el tiempo de anticipación:

*   **> 24 horas**: 95% de reembolso
*   **2-24 horas**: 50% de reembolso
*   **< 2 horas**: 0% de reembolso (sin reembolso)

El cálculo se realiza en `CancelacionService.calcularReembolso()` y actualiza automáticamente el estado del pago asociado.

## 🚀 Ejecución

```bash
cd services/appointments-service
npm install
npm run dev
```

Puerto por defecto: `3002`
