-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR');

-- CreateEnum
CREATE TYPE "EstadoMedico" AS ENUM ('PENDIENTE', 'VERIFICADO', 'RECHAZADO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO');

-- CreateEnum
CREATE TYPE "EstadoCita" AS ENUM ('PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "CanceladaPor" AS ENUM ('PACIENTE', 'MEDICO', 'SISTEMA');

-- CreateEnum
CREATE TYPE "TipoConsulta" AS ENUM ('CHAT', 'VIDEO', 'HIBRIDA');

-- CreateEnum
CREATE TYPE "EstadoConsulta" AS ENUM ('EN_PROGRESO', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoReceta" AS ENUM ('ACTIVA', 'VENCIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('TARJETA', 'BILLETERA', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "EstadoResena" AS ENUM ('APROBADA', 'PENDIENTE', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "TipoNotificacion" AS ENUM ('CORREO', 'SMS', 'EN_APP');

-- CreateEnum
CREATE TYPE "EstadoNotificacion" AS ENUM ('PENDIENTE', 'ENVIADA', 'FALLIDA');

-- CreateEnum
CREATE TYPE "AccionAuditoria" AS ENUM ('VER', 'CREAR', 'ACTUALIZAR', 'ELIMINAR');

-- CreateTable
CREATE TABLE "pacientes" (
    "id" UUID NOT NULL,
    "idUsuario" UUID NOT NULL,
    "fechaNacimiento" DATE,
    "genero" "Genero",
    "direccion" TEXT,
    "ciudad" VARCHAR(100),
    "pais" VARCHAR(100),
    "grupoSanguineo" VARCHAR(5),
    "alergias" TEXT,
    "condicionesCronicas" TEXT,
    "medicamentosActuales" TEXT,
    "contactoEmergencia" VARCHAR(255),
    "telefonoEmergencia" VARCHAR(20),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pacientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicos" (
    "id" UUID NOT NULL,
    "idUsuario" UUID NOT NULL,
    "numeroLicencia" VARCHAR(50) NOT NULL,
    "idEspecialidad" UUID NOT NULL,
    "subespecialidades" TEXT,
    "aniosExperiencia" INTEGER NOT NULL DEFAULT 0,
    "biografia" TEXT,
    "educacion" TEXT,
    "certificaciones" TEXT,
    "idiomas" TEXT[] DEFAULT ARRAY['Español']::TEXT[],
    "precioPorConsulta" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "duracionConsulta" INTEGER NOT NULL DEFAULT 30,
    "calificacionPromedio" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "totalResenas" INTEGER NOT NULL DEFAULT 0,
    "totalConsultas" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoMedico" NOT NULL DEFAULT 'PENDIENTE',
    "aceptaNuevosPacientes" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "especialidades" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "icono" VARCHAR(50),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "especialidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disponibilidades" (
    "id" UUID NOT NULL,
    "idMedico" UUID NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horaInicio" VARCHAR(5) NOT NULL,
    "horaFin" VARCHAR(5) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disponibilidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fechas_no_disponibles" (
    "id" UUID NOT NULL,
    "idMedico" UUID NOT NULL,
    "fecha" DATE NOT NULL,
    "motivo" VARCHAR(255),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fechas_no_disponibles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "citas" (
    "id" UUID NOT NULL,
    "idPaciente" UUID NOT NULL,
    "idMedico" UUID NOT NULL,
    "idDisponibilidad" UUID NOT NULL,
    "fechaHoraCita" TIMESTAMP(3) NOT NULL,
    "estado" "EstadoCita" NOT NULL DEFAULT 'PROGRAMADA',
    "motivo" TEXT,
    "notas" TEXT,
    "razonCancelacion" TEXT,
    "fechaCancelacion" TIMESTAMP(3),
    "canceladaPor" "CanceladaPor",
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "citas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" UUID NOT NULL,
    "idCita" UUID NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "duracion" INTEGER,
    "tipoConsulta" "TipoConsulta" NOT NULL,
    "notas" TEXT,
    "diagnostico" TEXT,
    "tratamiento" TEXT,
    "requiereSeguimiento" BOOLEAN NOT NULL DEFAULT false,
    "fechaSeguimiento" TIMESTAMP(3),
    "estado" "EstadoConsulta" NOT NULL DEFAULT 'EN_PROGRESO',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recetas" (
    "id" UUID NOT NULL,
    "idConsulta" UUID NOT NULL,
    "idMedico" UUID NOT NULL,
    "idPaciente" UUID NOT NULL,
    "medicamentos" JSONB NOT NULL,
    "instrucciones" TEXT,
    "duracionTratamiento" VARCHAR(100),
    "notas" TEXT,
    "fechaEmision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaVencimiento" TIMESTAMP(3),
    "estado" "EstadoReceta" NOT NULL DEFAULT 'ACTIVA',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" UUID NOT NULL,
    "idCita" UUID NOT NULL,
    "idPaciente" UUID NOT NULL,
    "idMedico" UUID NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "comisionPlataforma" DECIMAL(10,2) NOT NULL,
    "montoMedico" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'USD',
    "metodoPago" "MetodoPago" NOT NULL,
    "idTransaccion" VARCHAR(255) NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "montoReembolsado" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "razonReembolso" TEXT,
    "fechaProcesamiento" TIMESTAMP(3),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resenas" (
    "id" UUID NOT NULL,
    "idMedico" UUID NOT NULL,
    "idPaciente" UUID NOT NULL,
    "idCita" UUID NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "anonima" BOOLEAN NOT NULL DEFAULT false,
    "cuantasUtilesIndican" INTEGER NOT NULL DEFAULT 0,
    "verificada" BOOLEAN NOT NULL DEFAULT true,
    "estado" "EstadoResena" NOT NULL DEFAULT 'PENDIENTE',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resenas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" UUID NOT NULL,
    "idUsuario" UUID NOT NULL,
    "tipo" "TipoNotificacion" NOT NULL,
    "asunto" VARCHAR(255),
    "mensaje" TEXT NOT NULL,
    "destinatario" VARCHAR(255),
    "estado" "EstadoNotificacion" NOT NULL DEFAULT 'PENDIENTE',
    "intentosReenvio" INTEGER NOT NULL DEFAULT 0,
    "fechaEnvio" TIMESTAMP(3),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registros_auditoria" (
    "id" UUID NOT NULL,
    "idUsuario" UUID NOT NULL,
    "accion" "AccionAuditoria" NOT NULL,
    "tipoEntidad" VARCHAR(50) NOT NULL,
    "idEntidad" UUID,
    "valorAnterior" JSONB,
    "valorNuevo" JSONB,
    "direccionIP" VARCHAR(45),
    "agenteUsuario" TEXT,
    "fechaAccion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registros_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pacientes_idUsuario_key" ON "pacientes"("idUsuario");

-- CreateIndex
CREATE INDEX "pacientes_idUsuario_idx" ON "pacientes"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "medicos_idUsuario_key" ON "medicos"("idUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "medicos_numeroLicencia_key" ON "medicos"("numeroLicencia");

-- CreateIndex
CREATE INDEX "medicos_idEspecialidad_idx" ON "medicos"("idEspecialidad");

-- CreateIndex
CREATE INDEX "medicos_calificacionPromedio_idx" ON "medicos"("calificacionPromedio");

-- CreateIndex
CREATE INDEX "medicos_estado_idx" ON "medicos"("estado");

-- CreateIndex
CREATE INDEX "medicos_aceptaNuevosPacientes_idx" ON "medicos"("aceptaNuevosPacientes");

-- CreateIndex
CREATE UNIQUE INDEX "especialidades_nombre_key" ON "especialidades"("nombre");

-- CreateIndex
CREATE INDEX "especialidades_nombre_idx" ON "especialidades"("nombre");

-- CreateIndex
CREATE INDEX "especialidades_activa_idx" ON "especialidades"("activa");

-- CreateIndex
CREATE INDEX "disponibilidades_idMedico_idx" ON "disponibilidades"("idMedico");

-- CreateIndex
CREATE INDEX "disponibilidades_diaSemana_idx" ON "disponibilidades"("diaSemana");

-- CreateIndex
CREATE INDEX "disponibilidades_activo_idx" ON "disponibilidades"("activo");

-- CreateIndex
CREATE UNIQUE INDEX "disponibilidades_idMedico_diaSemana_horaInicio_key" ON "disponibilidades"("idMedico", "diaSemana", "horaInicio");

-- CreateIndex
CREATE INDEX "fechas_no_disponibles_idMedico_idx" ON "fechas_no_disponibles"("idMedico");

-- CreateIndex
CREATE INDEX "fechas_no_disponibles_fecha_idx" ON "fechas_no_disponibles"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "fechas_no_disponibles_idMedico_fecha_key" ON "fechas_no_disponibles"("idMedico", "fecha");

-- CreateIndex
CREATE INDEX "citas_idPaciente_idx" ON "citas"("idPaciente");

-- CreateIndex
CREATE INDEX "citas_idMedico_idx" ON "citas"("idMedico");

-- CreateIndex
CREATE INDEX "citas_fechaHoraCita_idx" ON "citas"("fechaHoraCita");

-- CreateIndex
CREATE INDEX "citas_estado_idx" ON "citas"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "citas_idDisponibilidad_fechaHoraCita_key" ON "citas"("idDisponibilidad", "fechaHoraCita");

-- CreateIndex
CREATE UNIQUE INDEX "consultas_idCita_key" ON "consultas"("idCita");

-- CreateIndex
CREATE INDEX "consultas_fechaInicio_idx" ON "consultas"("fechaInicio");

-- CreateIndex
CREATE INDEX "consultas_estado_idx" ON "consultas"("estado");

-- CreateIndex
CREATE INDEX "recetas_idConsulta_idx" ON "recetas"("idConsulta");

-- CreateIndex
CREATE INDEX "recetas_idMedico_idx" ON "recetas"("idMedico");

-- CreateIndex
CREATE INDEX "recetas_idPaciente_idx" ON "recetas"("idPaciente");

-- CreateIndex
CREATE INDEX "recetas_fechaVencimiento_idx" ON "recetas"("fechaVencimiento");

-- CreateIndex
CREATE INDEX "recetas_estado_idx" ON "recetas"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_idCita_key" ON "pagos"("idCita");

-- CreateIndex
CREATE INDEX "pagos_idPaciente_idx" ON "pagos"("idPaciente");

-- CreateIndex
CREATE INDEX "pagos_idMedico_idx" ON "pagos"("idMedico");

-- CreateIndex
CREATE INDEX "pagos_estado_idx" ON "pagos"("estado");

-- CreateIndex
CREATE INDEX "pagos_fechaProcesamiento_idx" ON "pagos"("fechaProcesamiento");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_idCita_key" ON "resenas"("idCita");

-- CreateIndex
CREATE INDEX "resenas_idMedico_idx" ON "resenas"("idMedico");

-- CreateIndex
CREATE INDEX "resenas_calificacion_idx" ON "resenas"("calificacion");

-- CreateIndex
CREATE INDEX "resenas_fechaCreacion_idx" ON "resenas"("fechaCreacion");

-- CreateIndex
CREATE UNIQUE INDEX "resenas_idMedico_idPaciente_idCita_key" ON "resenas"("idMedico", "idPaciente", "idCita");

-- CreateIndex
CREATE INDEX "notificaciones_idUsuario_idx" ON "notificaciones"("idUsuario");

-- CreateIndex
CREATE INDEX "notificaciones_estado_idx" ON "notificaciones"("estado");

-- CreateIndex
CREATE INDEX "notificaciones_fechaCreacion_idx" ON "notificaciones"("fechaCreacion");

-- CreateIndex
CREATE INDEX "registros_auditoria_idUsuario_idx" ON "registros_auditoria"("idUsuario");

-- CreateIndex
CREATE INDEX "registros_auditoria_idEntidad_idx" ON "registros_auditoria"("idEntidad");

-- CreateIndex
CREATE INDEX "registros_auditoria_fechaAccion_idx" ON "registros_auditoria"("fechaAccion");

-- CreateIndex
CREATE INDEX "registros_auditoria_accion_idx" ON "registros_auditoria"("accion");

-- CreateIndex
CREATE INDEX "registros_auditoria_tipoEntidad_idx" ON "registros_auditoria"("tipoEntidad");

-- AddForeignKey
ALTER TABLE "pacientes" ADD CONSTRAINT "pacientes_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicos" ADD CONSTRAINT "medicos_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicos" ADD CONSTRAINT "medicos_idEspecialidad_fkey" FOREIGN KEY ("idEspecialidad") REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disponibilidades" ADD CONSTRAINT "disponibilidades_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "medicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fechas_no_disponibles" ADD CONSTRAINT "fechas_no_disponibles_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "medicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "medicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_idDisponibilidad_fkey" FOREIGN KEY ("idDisponibilidad") REFERENCES "disponibilidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_idCita_fkey" FOREIGN KEY ("idCita") REFERENCES "citas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_idConsulta_fkey" FOREIGN KEY ("idConsulta") REFERENCES "consultas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_idCita_fkey" FOREIGN KEY ("idCita") REFERENCES "citas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_idMedico_fkey" FOREIGN KEY ("idMedico") REFERENCES "medicos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resenas" ADD CONSTRAINT "resenas_idCita_fkey" FOREIGN KEY ("idCita") REFERENCES "citas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registros_auditoria" ADD CONSTRAINT "registros_auditoria_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
