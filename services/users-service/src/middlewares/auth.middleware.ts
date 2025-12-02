// ============================================
// MIDDLEWARE DE AUTENTICACIÓN - USERS SERVICE
// ============================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, UnauthorizedError, ForbiddenError } from '../types';
import { RolUsuario } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de acceso requerido');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError('Token inválido'));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new UnauthorizedError('Token expirado'));
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
