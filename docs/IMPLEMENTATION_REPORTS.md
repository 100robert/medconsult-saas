# Implementación de Reportes y Estadísticas (Admin Dashboard)

## 1. Visión General
Este documento detalla la implementación del módulo de "Reportes y Estadísticas" en el Panel de Administración. El objetivo principal fue reemplazar los datos simulados (mock data) con información real proveniente de la base de datos, permitiendo a los administradores visualizar el rendimiento financiero y operativo de la plataforma en tiempo real.

## 2. Arquitectura de la Solución

### Frontend
- **Página**: `frontend/src/app/dashboard/reports/page.tsx`
- **Lógica de Negocio**: `frontend/src/lib/admin.ts`
- **Visualización**: Se utiliza la librería `recharts` para gráficos de área (Ingresos) y barras (Citas).
- **Estado**: Gestión de estado local con `useState` y `useEffect` para cargas asíncronas.

### Backend
Se modificaron dos microservicios principales para exponer endpoints que permitan la extracción masiva de datos (con paginación y filtros) para el cálculo de estadísticas.

## 3. Cambios en Backend

### A. Payments Service (`services/payments-service`)
Se habilitó un endpoint para que los administradores puedan consultar el historial completo de transacciones.

- **Nuevo Endpoint**: `GET /pagos`
- **Controlador**: `PagoController.obtenerTodos`
- **Servicio**: `PagoService.obtenerTodos`
- **Acceso**: Restringido a rol `ADMIN`.
- **Uso**: Permite calcular los "Ingresos Totales", variaciones porcentuales y desglose por especialidad.

### B. Appointments Service (`services/appointments-service`)
Se añadió la capacidad de listar todas las citas del sistema para análisis estadístico.

- **Nuevo Endpoint**: `GET /citas`
- **Controlador**: `CitaController.obtenerTodas`
- **Servicio**: `CitaService.obtenerTodas`
- **Acceso**: Restringido a rol `ADMIN`.
- **Uso**: Permite contar "Total de Citas", tasas de completitud/cancelación y actividad diaria.

## 4. Implementación en Frontend

### Lógica de Agregación (`getReportsData`)
En `frontend/src/lib/admin.ts`, se implementó la función `getReportsData(period)`, que actúa como un agregador de datos.

1.  **Entradas**: Recibe un periodo (`week`, `month`, `quarter`, `year`).
2.  **Fetching**: Realiza peticiones paralelas a:
    *   `/citas` (citas actuales)
    *   `/pagos` (ingresos actuales)
    *   `/pagos` (ingresos del periodo anterior para calcular variación)
    *   `/auth/admin/users` (conteo de usuarios)
    *   `/medicos` (conteo de médicos)
    *   `/especialidades` (catálogo)
3.  **Procesamiento**:
    *   Calcula ingresos totales sumando montos de pagos `COMPLETADO`.
    *   Compara con el periodo anterior para obtener el porcentaje de variación.
    *   Agrupa citas e ingresos por día (o mes) para generar `graphData`.
    *   Agrupa ingresos por especialidad para el ranking de rendimiento.

### Interfaz de Usuario (`ReportsPage`)
- **Filtros de Tiempo**: selector para cambiar entre Semana, Mes, Trimestre y Año.
- **KPIs**: Tarjetas con indicadores clave (Ingresos, Citas, Usuarios, Médicos).
- **Gráficos**:
    - **Ingresos**: Gráfico de área (`AreaChart`) mostrando la tendencia financiera.
    - **Citas**: Gráfico de barras (`BarChart`) mostrando el volumen de atenciones.
- **Tabla Detallada**: Ranking de especialidades con desglose de citas, ingresos y % del total.

## 5. Seguridad
Todos los nuevos endpoints están protegidos por:
- `authMiddleware.verifyToken`: Valida que el usuario esté autenticado.
- `authMiddleware.requireRoles(['ADMIN'])`: Asegura que solo los administradores puedan acceder a esta data sensible.

## 6. Próximos Pasos (Opcional)
- Implementar la funcionalidad de los botones de "Exportar" (PDF, Excel, CSV) que actualmente son visuales.
- Optimizar las consultas de base de datos para realizar la agregación (SUM, COUNT, GROUP BY) directamente en el backend (Prisma Aggregate) en lugar de procesar arrays en memoria en el frontend, si el volumen de datos crece significativamente.
