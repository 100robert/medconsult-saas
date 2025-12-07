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

  // Si es una ruta pública, continuar sin verificar
  if (isPublicRoute(path)) {
    return next();
  }

  // Obtener el token del header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
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
    res.status(401).json({
      success: false,
      message: 'Formato de token inválido. Use: Bearer <token>',
      error: 'INVALID_FORMAT'
    });
    return;
  }

  const token = parts[1];

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Normalizar el payload (el JWT puede usar 'correo' o 'email')
    req.user = {
      userId: decoded.userId || decoded.id,
      email: decoded.correo || decoded.email,
      correo: decoded.correo || decoded.email,
      rol: decoded.rol,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    
    // Continuar al siguiente middleware
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expirado',
        error: 'TOKEN_EXPIRED'
      });
      return;
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Token inválido',
        error: 'INVALID_TOKEN'
      });
      return;
    }

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
