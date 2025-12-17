# 💳 Payments Service

El **Payments Service** gestiona todo el procesamiento de pagos, comisiones de la plataforma, reembolsos y facturación en MedConsult.

## 🏗️ Arquitectura

*   **Controller**: Endpoints para crear, listar y gestionar pagos.
*   **Service**: Lógica de negocio (cálculo de comisiones, procesamiento simulado, reembolsos).
*   **Database**: PostgreSQL con Prisma ORM.

## 📦 Stack Tecnológico

*   **Runtime**: Node.js + TypeScript
*   **ORM**: Prisma
*   **Gateway de Pago**: Simulado (listo para integración con Culqi/Stripe)

## 🗄️ Modelos de Datos

### Pago (`pagos`)
*   `id`: UUID
*   `idCita`: Referencia a la cita asociada
*   `idPaciente`, `idMedico`: Referencias
*   `monto`: Monto total pagado
*   `comisionPlataforma`: Comisión del 30%
*   `montoMedico`: Lo que recibe el médico (70%)
*   `estado`: `PENDIENTE`, `COMPLETADO`, `FALLIDO`, `REEMBOLSADO`
*   `metodoPago`: `TARJETA`, `BILLETERA`, `TRANSFERENCIA`
*   `montoReembolsado`, `porcentajeReembolso`: Datos de reembolso

## 🌐 API Reference

| Método | Endpoint | Descripción | Autenticación |
| --- | --- | --- | --- |
| `POST` | `/pagos` | Procesar nuevo pago | Paciente |
| `GET` | `/pagos` | Listar pagos del usuario | Usuario |
| `GET` | `/pagos/:id` | Detalles de un pago | Usuario |
| `POST` | `/pagos/:id/reembolsar` | Ejecutar reembolso manual | Admin |
| `GET` | `/pagos/ganancias/medico/:id` | Ver ganancias de médico | Médico/Admin |

## 💰 Comisión de Plataforma

Sistema de comisión automática:
*   **30%** para MedConsult
*   **70%** para el médico

Ejemplo: Si la consulta cuesta S/. 100:
*   Médico recibe: S/. 70
*   Plataforma: S/. 30

## 🔄 Reembolsos

Los reembolsos se gestionan automáticamente cuando se cancela una cita:
1. El `appointments-service` calcula el % de reembolso según el tiempo.
2. El `payments-service` actualiza el pago a estado `REEMBOLSADO`.
3. Se guarda `montoReembolsado` y `porcentajeReembolso`.

**Nota**: En producción, se debe integrar con el gateway de pagos real para devolver el dinero a la tarjeta del paciente.

## 🚀 Ejecución

```bash
cd services/payments-service
npm install
npm run dev
```

Puerto por defecto: `3003`
