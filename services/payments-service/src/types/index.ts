// ============================================
// TIPOS Y DTOs - PAYMENTS SERVICE
// ============================================

import { RolUsuario, EstadoPago, MetodoPago } from '@prisma/client';

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
// DTOs DE PAGO
// ============================================

export interface CreatePagoDTO {
  idCita: string;
  monto: number;
  metodoPago?: MetodoPago;
  moneda?: string;
}

export interface ProcesarPagoDTO {
  metodoPago?: MetodoPago;
  datosMetodo?: {
    // Para tarjeta
    cardToken?: string;
    lastFour?: string;
    // Para transferencia
    bancoOrigen?: string;
    numeroReferencia?: string;
    // Para otros métodos
    comprobante?: string;
  };
}

export interface ReembolsoDTO {
  monto: number;
  motivo: string;
}

// ============================================
// FILTROS
// ============================================

export interface PagoFilters {
  estado?: EstadoPago;
  metodoPago?: MetodoPago;
  fechaDesde?: Date;
  fechaHasta?: Date;
  montoMin?: number;
  montoMax?: number;
  page?: number;
  limit?: number;
}

// ============================================
// RESPUESTAS
// ============================================

export interface ResumenPagos {
  totalRecaudado: number;
  totalPendiente: number;
  totalReembolsado: number;
  cantidadTransacciones: number;
  porMetodoPago: {
    metodo: MetodoPago;
    total: number;
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

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con el estado actual') {
    super(message, 409);
  }
}

export class PaymentError extends AppError {
  constructor(message: string = 'Error en el procesamiento del pago') {
    super(message, 402);
  }
}
