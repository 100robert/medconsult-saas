// ============================================
// TIPOS Y INTERFACES - APPOINTMENTS SERVICE
// ============================================

import { RolUsuario, DiaSemana, EstadoCita, CanceladaPor } from '@prisma/client';

// ============================================
// DTOs - DISPONIBILIDAD
// ============================================

export interface CreateDisponibilidadDTO {
  idMedico: string;
  diaSemana: DiaSemana;
  horaInicio: string; // "09:00"
  horaFin: string;    // "17:00"
}

export interface UpdateDisponibilidadDTO {
  horaInicio?: string;
  horaFin?: string;
  activo?: boolean;
}

export interface CreateFechaNoDisponibleDTO {
  idMedico: string;
  fecha: Date;
  motivo?: string;
}

// ============================================
// DTOs - CITA
// ============================================

export interface CreateCitaDTO {
  idPaciente: string;
  idMedico: string;
  idDisponibilidad: string;
  fechaHoraCita: Date;
  motivo?: string;
}

export interface UpdateCitaDTO {
  motivo?: string;
  notas?: string;
}

export interface CancelarCitaDTO {
  razonCancelacion: string;
  canceladaPor: CanceladaPor;
}

export interface ConfirmarCitaDTO {
  notas?: string;
}

// ============================================
// RESPONSES
// ============================================

export interface DisponibilidadResponse {
  id: string;
  idMedico: string;
  diaSemana: DiaSemana;
  horaInicio: string;
  horaFin: string;
  activo: boolean;
}

export interface SlotDisponibleResponse {
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  disponibilidadId: string;
}

export interface CitaResponse {
  id: string;
  idPaciente: string;
  idMedico: string;
  fechaHoraCita: Date;
  estado: EstadoCita;
  motivo: string | null;
  paciente?: {
    usuario: {
      nombre: string;
      apellido: string;
    };
  };
  medico?: {
    usuario: {
      nombre: string;
      apellido: string;
    };
    especialidad: {
      nombre: string;
    };
  };
}

// ============================================
// JWT PAYLOAD
// ============================================

export interface JWTPayload {
  userId: string;
  correo: string;
  rol: RolUsuario;
  iat?: number;
  exp?: number;
}

// ============================================
// FILTROS
// ============================================

export interface FiltrarCitasQuery {
  estado?: EstadoCita;
  fechaDesde?: Date;
  fechaHasta?: Date;
  page?: number;
  limit?: number;
}

// ============================================
// ERRORES
// ============================================

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(404, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso denegado') {
    super(403, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con recurso existente') {
    super(409, message);
  }
}
