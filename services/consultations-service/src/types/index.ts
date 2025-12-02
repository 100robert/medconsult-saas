// ============================================
// TIPOS Y DTOs - CONSULTATIONS SERVICE
// ============================================

import { RolUsuario, EstadoConsulta, TipoConsulta, EstadoReceta } from '@prisma/client';

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
// DTOs DE CONSULTA
// ============================================

export interface CreateConsultaDTO {
  idCita: string;
  tipoConsulta?: TipoConsulta;
  notas?: string;
}

export interface UpdateConsultaDTO {
  notas?: string;
  diagnostico?: string;
  tratamiento?: string;
  requiereSeguimiento?: boolean;
  fechaSeguimiento?: Date;
}

export interface FinalizarConsultaDTO {
  diagnostico?: string;
  tratamiento?: string;
  notas?: string;
  requiereSeguimiento?: boolean;
  fechaSeguimiento?: Date;
}

// ============================================
// DTOs DE RECETA
// ============================================

export interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion?: string;
  instrucciones?: string;
}

export interface CreateRecetaDTO {
  idConsulta: string;
  idMedico: string;
  idPaciente: string;
  medicamentos: Medicamento[];
  instrucciones?: string;
  duracionTratamiento?: string;
  notas?: string;
  fechaVencimiento?: Date;
}

export interface UpdateRecetaDTO {
  medicamentos?: Medicamento[];
  instrucciones?: string;
  duracionTratamiento?: string;
  notas?: string;
  fechaVencimiento?: Date;
  estado?: EstadoReceta;
}

// ============================================
// FILTROS
// ============================================

export interface ConsultaFilters {
  estado?: EstadoConsulta;
  fechaDesde?: Date;
  fechaHasta?: Date;
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

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con el estado actual') {
    super(message, 409);
  }
}
