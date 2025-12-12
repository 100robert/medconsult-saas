// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isPublicRoute } from '../config/services';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-abc123xyz';

export interface JWTPayload {
  userId: string;
  email?: string; // Campo opcional, puede venir como 'correo'
  correo?: string; // Campo del JWT del auth-service
  rol: string;
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

/**
 * Middleware que verifica el token JWT
 * Agrega el usuario decodificado a req.user si es válido
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const path = req.path;
  const fullUrl = req.originalUrl;

  console.log(`🔐 [AUTH] Procesando: ${req.method} ${fullUrl}`);

  // Si es una ruta pública, continuar sin verificar
  if (isPublicRoute(path)) {
    console.log(`🔐 [AUTH] Ruta pública, saltando verificación: ${path}`);
    return next();
  }

  // Obtener el token del header
  const authHeader = req.headers.authorization;
  console.log(`🔐 [AUTH] Header Authorization presente: ${!!authHeader}`);
  if (authHeader) {
    console.log(`🔐 [AUTH] Longitud del header: ${authHeader.length}`);
    console.log(`🔐 [AUTH] Primeros 20 caracteres: ${authHeader.substring(0, 20)}...`);
  }

  if (!authHeader) {
    console.log(`❌ [AUTH] NO_TOKEN - Header Authorization no encontrado`);
    res.status(401).json({
      success: false,
      message: 'Token de autenticación requerido',
      error: 'NO_TOKEN'
    });
    return;
  }

  // Verificar formato Bearer
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log(`❌ [AUTH] INVALID_FORMAT - Formato incorrecto: parts=${parts.length}, prefix=${parts[0]}`);
    res.status(401).json({
      success: false,
      message: 'Formato de token inválido. Use: Bearer <token>',
      error: 'INVALID_FORMAT'
    });
    return;
  }

  const token = parts[1];
  console.log(`🔐 [AUTH] Token extraído, longitud: ${token.length}`);
  console.log(`🔐 [AUTH] Token (primeros 50 chars): ${token.substring(0, 50)}...`);
  console.log(`🔐 [AUTH] JWT_SECRET usado: ${JWT_SECRET.substring(0, 20)}...`);

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log(`✅ [AUTH] Token verificado exitosamente`);
    console.log(`✅ [AUTH] Decoded payload:`, JSON.stringify(decoded, null, 2));

    // Normalizar el payload (el JWT puede usar 'correo' o 'email')
    req.user = {
      userId: decoded.userId || decoded.id,
      email: decoded.correo || decoded.email,
      correo: decoded.correo || decoded.email,
      rol: decoded.rol,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    console.log(`✅ [AUTH] Usuario asignado a req.user:`, JSON.stringify(req.user, null, 2));

    // Continuar al siguiente middleware
    next();
  } catch (error: any) {
    console.log(`❌ [AUTH] Error al verificar token:`, error.message);
    console.log(`❌ [AUTH] Tipo de error:`, error.constructor.name);

    if (error instanceof jwt.TokenExpiredError) {
      console.log(`❌ [AUTH] TOKEN_EXPIRED - Token expiró en: ${error.expiredAt}`);
      res.status(401).json({
        success: false,
        message: 'Token expirado',
        error: 'TOKEN_EXPIRED'
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      console.log(`❌ [AUTH] INVALID_TOKEN - JWT Error: ${error.message}`);
      res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: 'INVALID_TOKEN'
      });
      return;
    }

    console.log(`❌ [AUTH] AUTH_ERROR - Error no manejado:`, error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar token',
      error: 'AUTH_ERROR'
    });
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const requireRoles = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'No autenticado',
        error: 'NOT_AUTHENTICATED'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.rol)) {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para acceder a este recurso',
        error: 'FORBIDDEN',
        requiredRoles: allowedRoles,
        yourRole: req.user.rol
      });
      return;
    }

    next();
  };
};
