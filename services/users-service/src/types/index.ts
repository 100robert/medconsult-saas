// ============================================
// TIPOS Y INTERFACES - USERS SERVICE
// ============================================

import { RolUsuario, Genero, EstadoMedico } from '@prisma/client';

// ============================================
// DTOs - PACIENTE
// ============================================

export interface CreatePacienteDTO {
  idUsuario: string;
  fechaNacimiento?: Date;
  genero?: Genero;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  grupoSanguineo?: string;
  alergias?: string;
  condicionesCronicas?: string;
  medicamentosActuales?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
}

export interface UpdatePacienteDTO {
  fechaNacimiento?: Date;
  genero?: Genero;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  grupoSanguineo?: string;
  alergias?: string;
  condicionesCronicas?: string;
  medicamentosActuales?: string;
  contactoEmergencia?: string;
  telefonoEmergencia?: string;
}

// ============================================
// DTOs - MÉDICO
// ============================================

export interface CreateMedicoDTO {
  idUsuario: string;
  numeroLicencia: string;
  idEspecialidad: string;
  subespecialidades?: string;
  aniosExperiencia?: number;
  biografia?: string;
  educacion?: string;
  certificaciones?: string;
  idiomas?: string[];
  precioPorConsulta: number;
  moneda?: string;
  duracionConsulta?: number;
}

export interface UpdateMedicoDTO {
  subespecialidades?: string;
  aniosExperiencia?: number;
  biografia?: string;
  educacion?: string;
  certificaciones?: string;
  idiomas?: string[];
  precioPorConsulta?: number;
  moneda?: string;
  duracionConsulta?: number;
  aceptaNuevosPacientes?: boolean;
}

export interface VerificarMedicoDTO {
  estado: EstadoMedico;
}

// ============================================
// DTOs - ESPECIALIDAD
// ============================================

export interface CreateEspecialidadDTO {
  nombre: string;
  descripcion?: string;
  icono?: string;
}

export interface UpdateEspecialidadDTO {
  nombre?: string;
  descripcion?: string;
  icono?: string;
  activa?: boolean;
}

// ============================================
// RESPONSES
// ============================================

export interface PacienteResponse {
  id: string;
  idUsuario: string;
  fechaNacimiento: Date | null;
  genero: Genero | null;
  direccion: string | null;
  ciudad: string | null;
  pais: string | null;
  grupoSanguineo: string | null;
  usuario?: {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
    imagenPerfil: string | null;
  };
}

export interface MedicoResponse {
  id: string;
  idUsuario: string;
  numeroLicencia: string;
  especialidad: {
    id: string;
    nombre: string;
  };
  subespecialidades: string | null;
  aniosExperiencia: number;
  biografia: string | null;
  precioPorConsulta: number;
  moneda: string;
  duracionConsulta: number;
  calificacionPromedio: number;
  totalResenas: number;
  totalConsultas: number;
  estado: EstadoMedico;
  aceptaNuevosPacientes: boolean;
  usuario?: {
    nombre: string;
    apellido: string;
    correo: string;
    telefono: string | null;
    imagenPerfil: string | null;
  };
}

export interface EspecialidadResponse {
  id: string;
  nombre: string;
  descripcion: string | null;
  icono: string | null;
  activa: boolean;
  totalMedicos?: number;
}

// ============================================
// JWT PAYLOAD (para verificar tokens)
// ============================================

export interface JWTPayload {
  userId: string;
  correo: string;
  rol: RolUsuario;
  iat?: number;
  exp?: number;
}

// ============================================
// FILTROS Y PAGINACIÓN
// ============================================

export interface BuscarMedicosQuery {
  especialidad?: string;
  ciudad?: string;
  pais?: string;
  calificacionMinima?: number;
  precioMinimo?: number;
  precioMaximo?: number;
  idioma?: string;
  aceptaNuevosPacientes?: boolean;
  page?: number;
  limit?: number;
  ordenarPor?: 'calificacion' | 'precio' | 'experiencia';
  orden?: 'asc' | 'desc';
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
