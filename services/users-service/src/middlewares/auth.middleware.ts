// ============================================
// MIDDLEWARE DE AUTENTICACIÓN - USERS SERVICE
// ============================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, UnauthorizedError, ForbiddenError } from '../types';
import { RolUsuario } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-abc123xyz';

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware para verificar token JWT
 * Prioriza headers del gateway, luego verifica token directamente
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    // ==========================================
    // OPCIÓN 1: Usar headers del gateway (si están presentes)
    // ==========================================
    const userIdFromHeader = req.headers['x-user-id'] as string;
    const userEmailFromHeader = req.headers['x-user-email'] as string;
    const userRoleFromHeader = req.headers['x-user-role'] as string;

    if (userIdFromHeader && userRoleFromHeader) {
      // Gateway ya verificó el token, usar la info de los headers
      req.user = {
        userId: userIdFromHeader,
        email: userEmailFromHeader || '',
        rol: userRoleFromHeader as RolUsuario,
      };
      return next();
    }

    // ==========================================
    // OPCIÓN 2: Verificar token directamente
    // ==========================================
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de acceso requerido');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Normalizar el payload (el JWT puede usar 'correo' o 'email')
      req.user = {
        userId: decoded.userId || decoded.id,
        email: decoded.correo || decoded.email || '',
        rol: decoded.rol as RolUsuario,
        iat: decoded.iat,
        exp: decoded.exp,
      };
      
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError(`Token inválido: ${jwtError.message}`));
      } else if (jwtError instanceof jwt.TokenExpiredError) {
        next(new UnauthorizedError('Token expirado'));
      } else {
        next(jwtError);
      }
    }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(error);
    }
  }
}

/**
 * Middleware para verificar roles
 */
export function authorize(...roles: RolUsuario[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('No autenticado');
    }

    if (!roles.includes(req.user.rol)) {
      throw new ForbiddenError('No tienes permisos para esta acción');
    }

    next();
  };
}

/**
 * Middleware para verificar que el usuario es el propietario del recurso
 */
export function isOwnerOrAdmin(userIdParam: string = 'id') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('No autenticado');
    }

    const resourceUserId = req.params[userIdParam];

    if (req.user.rol === 'ADMIN' || req.user.userId === resourceUserId) {
      next();
    } else {
      throw new ForbiddenError('No tienes permisos para acceder a este recurso');
    }
  };
}
