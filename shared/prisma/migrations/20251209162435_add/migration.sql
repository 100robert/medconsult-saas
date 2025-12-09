-- CreateEnum
CREATE TYPE "TipoCita" AS ENUM ('PRESENCIAL', 'VIDEOCONSULTA');

-- DropForeignKey
ALTER TABLE "citas" DROP CONSTRAINT "citas_idDisponibilidad_fkey";

-- DropIndex
DROP INDEX "citas_idDisponibilidad_fechaHoraCita_key";

-- AlterTable
ALTER TABLE "citas" ADD COLUMN     "tipo" "TipoCita" NOT NULL DEFAULT 'VIDEOCONSULTA',
ALTER COLUMN "idDisponibilidad" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pacientes" ADD COLUMN     "esPro" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "resenas" ADD COLUMN     "fechaRespuesta" TIMESTAMP(3),
ADD COLUMN     "respuesta" TEXT;

-- CreateTable
CREATE TABLE "metricas_salud" (
    "id" UUID NOT NULL,
    "idPaciente" UUID NOT NULL,
    "ritmoCardiaco" INTEGER,
    "presionSistolica" INTEGER,
    "presionDiastolica" INTEGER,
    "glucosa" DECIMAL(5,2),
    "peso" DECIMAL(5,2),
    "altura" DECIMAL(3,2),
    "temperatura" DECIMAL(4,2),
    "saturacionOxigeno" DECIMAL(5,2),
    "notas" TEXT,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metricas_salud_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "metricas_salud_idPaciente_idx" ON "metricas_salud"("idPaciente");

-- CreateIndex
CREATE INDEX "metricas_salud_fechaRegistro_idx" ON "metricas_salud"("fechaRegistro");

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_idDisponibilidad_fkey" FOREIGN KEY ("idDisponibilidad") REFERENCES "disponibilidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metricas_salud" ADD CONSTRAINT "metricas_salud_idPaciente_fkey" FOREIGN KEY ("idPaciente") REFERENCES "pacientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
