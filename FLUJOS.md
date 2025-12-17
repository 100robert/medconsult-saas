# 📚 Guía de Flujos - MedConsult SaaS

Esta guía describe los flujos de usuario más importantes del sistema.

---

## 🩺 Flujo 1: Agendamiento de Cita (Paciente)

### Paso a Paso

1.  **Acceder a Nueva Cita**
    *   Navegación: `Dashboard → Mis Citas → Nueva Cita`
    *   Ruta: `/dashboard/appointments/new`

2.  **Seleccionar Médico**
    *   Se muestran médicos verificados con:
        *   Especialidad
        *   Precio por consulta
        *   Calificación promedio
    *   Paciente selecciona uno

3.  **Elegir Fecha**
    *   Sistema consulta disponibilidad del médico
    *   Se muestran fechas con slots disponibles

4.  **Seleccionar Horario**
    *   Slots de 30 minutos
    *   Solo se muestran horarios libres en tiempo real

5.  **Tipo de Consulta**
    *   Videoconsulta (online)
    *   Presencial

6.  **Pago**
    *   Se procesa pago simulado
    *   Comisión 30% para plataforma

7.  **Confirmación**
    *   Se muestra boleta de venta electrónica
    *   Cita queda en estado `CONFIRMADA`

### Endpoints Involucrados
*   `GET /medicos` (auth-service)
*   `GET /disponibilidad/slots` (appointments-service)
*   `POST /citas` (appointments-service)
*   `POST /pagos` (payments-service)

---

## 🎥 Flujo 2: Videoconsulta

### Paso a Paso

1.  **Inicio de Sesión**
    *   Paciente o Médico accede con su cuenta
    *   10 minutos antes: botón "Unirse" se activa

2.  **Médico Inicia Consulta**
    *   `POST /consultas` (crea registro de consulta)
    *   Genera sala Jitsi con ID único

3.  **Paciente Se Une**
    *   Verifica que médico haya iniciado
    *   Entra a la misma sala

4.  **Durante la Consulta**
    *   Audio/Video WebRTC (Jitsi)
    *   Médico puede tomar notas en paralelo

5.  **Finalizar Consulta**
    *   Médico agrega:
        *   Diagnóstico
        *   Tratamiento
        *   Receta (opcional)
    *   Estado de cita → `COMPLETADA`

6.  **Post-Consulta**
    *   Paciente puede dejar reseña
    *   Médico recibe pago (70% del monto)

### Endpoints Involucrados
*   `POST /consultas` (appointments-service)
*   `GET /consultas/:id` (appointments-service)
*   `PATCH /consultas/:id/finalizar`
*   `POST /resenas` (reviews-service)

---

## 💳 Flujo 3: Cancelación y Reembolso

### Paso a Paso

1.  **Paciente Cancela Cita**
    *   Desde `Mis Citas → Cancelar`
    *   `PATCH /citas/:id/cancelar`

2.  **Cálculo de Reembolso Automático**
    *   **> 24h antes**: 95% de reembolso
    *   **2-24h antes**: 50%
    *   **< 2h antes**: 0%

3.  **Actualización de Pago**
    *   Estado del pago cambia a `REEMBOLSADO`
    *   Se guarda `montoReembolsado` y `porcentajeReembolso`

4.  **Notificación**
    *   Se muestra modal con detalles del reembolso
    *   "Tu reembolso se procesará en 3-5 días hábiles"

5.  **Admin Dashboard**
    *   Se refleja en reportes de reembolsos

### Lógica en Código
```typescript
// services/appointments-service/src/services/cancelacion.service.ts
calcularReembolso(fechaCita: Date): { porcentaje, descripcion } {
  const horasRestantes = ...;
  
  if (horasRestantes >= 24) return { porcentaje: 95, ... };
  if (horasRestantes >= 2) return { porcentaje: 50, ... };
  return { porcentaje: 0, ... };
}
```

---

## 👨‍⚕️ Flujo 4: Registro de Médico

### Paso a Paso

1.  **Envío de Solicitud**
    *   Médico completa formulario en `/auth/register`
    *   Sube documentos: CMP, título, CV

2.  **Revisión por Admin**
    *   Admin ve solicitud en Dashboard
    *   Verifica documentos y antecedentes

3.  **Aprobación/Rechazo**
    *   Admin actualiza estado del médico:
        *   `VERIFICADO` → Habilitado
        *   `RECHAZADO` → No puede atender

4.  **Configuración de Perfil**
    *   Médico VERIFICADO:
        *   Define horarios de atención
        *   Establece precio por consulta
        *   Completa biografía

5.  **Disponible para Pacientes**
    *   Aparece en listado de médicos
    *   Pacientes pueden agendar citas

### Endpoints Involucrados
*   `POST /auth/register` (rol: MEDICO)
*   `PATCH /medicos/:id/verificar` (admin)
*   `POST /disponibilidad` (médico)

---

## 📊 Flujo 5: Dashboard de Administrador

### Funcionalidades

1.  **Estadísticas Globales**
    *   Total usuarios (pacientes, médicos, admins)
    *   Ingresos mensuales
    *   Citas completadas

2.  **Gráficos**
    *   Actividad de citas (últimos 30 días)
    *   Ingresos por mes (año actual)
    *   Estadísticas por especialidad

3.  **Gestión de Usuarios**
    *   Listar, editar, activar/desactivar
    *   Aprobar médicos pendientes

4.  **Reportes**
    *   Exportación de datos (CSV)
    *   Comisiones de la plataforma

### Endpoints Involucrados
*   `GET /auth/admin/stats`
*   `GET /pagos/reporte/admin`
*   `GET /citas/estadisticas`
