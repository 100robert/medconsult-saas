// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, UnauthorizedError, ForbiddenError } from '../types';
import { RolUsuario } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-abc123xyz';

export class AuthMiddleware {
  /**
   * Verificar token JWT
   */
  verifyToken(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Token no proporcionado');
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        throw new UnauthorizedError('Token no proporcionado');
      }

      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError('Token inválido'));
        return;
      }
      if (error instanceof jwt.TokenExpiredError) {
        next(new UnauthorizedError('Token expirado'));
        return;
      }
      next(error);
    }
  }

  /**
   * Requerir roles específicos
   */
  requireRoles(roles: RolUsuario[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
        next(new UnauthorizedError('Usuario no autenticado'));
        return;
      }

      if (!roles.includes(req.user.rol)) {
        next(new ForbiddenError('No tiene permisos para esta acción'));
        return;
      }

      next();
    };
  }
}

export const authMiddleware = new AuthMiddleware();
