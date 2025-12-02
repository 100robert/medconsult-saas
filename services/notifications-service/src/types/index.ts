// ============================================
// TIPOS Y DTOs - NOTIFICATIONS SERVICE
// ============================================

import { RolUsuario, TipoNotificacion, EstadoNotificacion } from '@prisma/client';

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
// DTOs DE NOTIFICACIÓN
// ============================================

export interface CreateNotificacionDTO {
  idUsuario: string;
  tipo: TipoNotificacion;
  asunto?: string;
  mensaje: string;
  destinatario?: string;
}

// ============================================
// FILTROS
// ============================================

export interface NotificacionFilters {
  tipo?: TipoNotificacion;
  estado?: EstadoNotificacion;
  page?: number;
  limit?: number;
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
