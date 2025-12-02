// ============================================
// TIPOS Y DTOs - REVIEWS SERVICE
// ============================================

import { RolUsuario } from '@prisma/client';

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
// DTOs DE RESEÑA
// ============================================

export interface CreateResenaDTO {
  idCita: string;
  calificacion: number; // 1-5
  comentario?: string;
  anonima?: boolean;
}

export interface UpdateResenaDTO {
  calificacion?: number;
  comentario?: string;
}

// ============================================
// FILTROS
// ============================================

export interface ResenaFilters {
  calificacionMin?: number;
  calificacionMax?: number;
  soloConComentario?: boolean;
  fechaDesde?: Date;
  fechaHasta?: Date;
  page?: number;
  limit?: number;
}

// ============================================
// ESTADÍSTICAS
// ============================================

export interface EstadisticasResenas {
  promedioCalificacion: number;
  totalResenas: number;
  distribucion: {
    estrellas: number;
    cantidad: number;
    porcentaje: number;
  }[];
  ultimasResenas: any[];
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

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con el estado actual') {
    super(message, 409);
  }
}
