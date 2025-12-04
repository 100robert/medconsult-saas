// ============================================
// TIPOS Y INTERFACES - AUTH SERVICE
// ============================================

import { RolUsuario } from '@prisma/client';

// ============================================
// DTOs (Data Transfer Objects)
// ============================================

export interface RegisterDTO {
  correo: string;
  contrasena: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol: RolUsuario;
}

export interface LoginDTO {
  correo: string;
  contrasena: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface ForgotPasswordDTO {
  correo: string;
}

export interface ResetPasswordDTO {
  token: string;
  nuevaContrasena: string;
}

export interface VerifyEmailDTO {
  token: string;
}

// ============================================
// RESPONSES
// ============================================

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    usuario: UserData;
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserData {
  id: string;
  correo: string;
  nombre: string;
  apellido: string;
  rol: RolUsuario;
  correoVerificado: boolean;
  activo: boolean;
  imagenPerfil?: string | null;
  telefono?: string | null;
  fechaNacimiento?: Date | null;
  genero?: string | null;
}

export interface MessageResponse {
  success: boolean;
  message: string;
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

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}

// ============================================
// REQUEST EXTENSIONS
// ============================================

export interface AuthRequest {
  user?: JWTPayload;
  ip?: string;
  userAgent?: string;
}

/// ============================================
// ERROR TYPES
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

export class AuthenticationError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(401, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con recurso existente') {
    super(409, message);
  }
}