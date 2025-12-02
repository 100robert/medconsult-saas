// ============================================
// TIPOS Y DTOs - AUDIT SERVICE
// ============================================

import { RolUsuario, AccionAuditoria } from '@prisma/client';

// ============================================
// TIPOS DE AUTENTICACIÓN
// ============================================

export interface JWTPayload {
  userId: string;
  email: string;
  rol: RolUsuario;
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// ============================================
// DTOs DE AUDITORÍA
// ============================================

export interface CreateAuditoriaDTO {
  idUsuario: string;
  accion: AccionAuditoria;
  tipoEntidad: string;        // Nombre de la entidad afectada (Usuario, Cita, Consulta, etc.)
  idEntidad?: string;         // ID del registro afectado
  valorAnterior?: Record<string, any>;  // Estado anterior (para updates/deletes)
  valorNuevo?: Record<string, any>;     // Estado nuevo (para creates/updates)
  direccionIP?: string;
  agenteUsuario?: string;
}

// ============================================
// FILTROS
// ============================================

export interface AuditoriaFilters {
  idUsuario?: string;
  accion?: AccionAuditoria;
  tipoEntidad?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  busqueda?: string;
  page?: number;
  limit?: number;
}

// ============================================
// ESTADÍSTICAS
// ============================================

export interface EstadisticasAuditoria {
  totalRegistros: number;
  porAccion: {
    accion: AccionAuditoria;
    cantidad: number;
  }[];
  porTipoEntidad: {
    tipoEntidad: string;
    cantidad: number;
  }[];
  actividadReciente: {
    fecha: string;
    cantidad: number;
  }[];
}

// ============================================
// ERRORES PERSONALIZADOS
// ============================================

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Datos inválidos') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(message, 403);
  }
}
