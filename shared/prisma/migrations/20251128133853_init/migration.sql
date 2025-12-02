-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('PACIENTE', 'MEDICO', 'ADMIN');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "correo" VARCHAR(255) NOT NULL,
    "hashContrasena" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20),
    "imagenPerfil" TEXT,
    "rol" "RolUsuario" NOT NULL,
    "correoVerificado" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "ultimoAcceso" TIMESTAMP(3),
    "tokenVerificacion" VARCHAR(255),
    "tokenRecuperacion" VARCHAR(255),
    "expirationTokenRecuperacion" TIMESTAMP(3),
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "idUsuario" UUID NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "esRevocado" BOOLEAN NOT NULL DEFAULT false,
    "direccionIP" VARCHAR(45),
    "agenteUsuario" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "intentos_login" (
    "id" UUID NOT NULL,
    "correo" VARCHAR(255) NOT NULL,
    "idUsuario" UUID,
    "exitoso" BOOLEAN NOT NULL,
    "direccionIP" VARCHAR(45) NOT NULL,
    "agenteUsuario" TEXT,
    "razon" TEXT,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intentos_login_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_tokenVerificacion_key" ON "usuarios"("tokenVerificacion");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_tokenRecuperacion_key" ON "usuarios"("tokenRecuperacion");

-- CreateIndex
CREATE INDEX "usuarios_correo_idx" ON "usuarios"("correo");

-- CreateIndex
CREATE INDEX "usuarios_rol_idx" ON "usuarios"("rol");

-- CreateIndex
CREATE INDEX "usuarios_activo_idx" ON "usuarios"("activo");

-- CreateIndex
CREATE INDEX "usuarios_correoVerificado_idx" ON "usuarios"("correoVerificado");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_token_idx" ON "refresh_tokens"("token");

-- CreateIndex
CREATE INDEX "refresh_tokens_idUsuario_idx" ON "refresh_tokens"("idUsuario");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiraEn_idx" ON "refresh_tokens"("expiraEn");

-- CreateIndex
CREATE INDEX "refresh_tokens_esRevocado_idx" ON "refresh_tokens"("esRevocado");

-- CreateIndex
CREATE INDEX "intentos_login_correo_idx" ON "intentos_login"("correo");

-- CreateIndex
CREATE INDEX "intentos_login_fecha_idx" ON "intentos_login"("fecha");

-- CreateIndex
CREATE INDEX "intentos_login_exitoso_idx" ON "intentos_login"("exitoso");

-- CreateIndex
CREATE INDEX "intentos_login_direccionIP_idx" ON "intentos_login"("direccionIP");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intentos_login" ADD CONSTRAINT "intentos_login_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
