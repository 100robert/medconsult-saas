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
      console.log('🔐 verifyToken - Headers:', req.headers.authorization ? 'Token presente' : 'Sin token');
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ verifyToken - No hay Authorization header válido');
        res.status(401).json({ success: false, error: 'Token no proporcionado' });
        return;
      }

      const token = authHeader.split(' ')[1];

      if (!token) {
        console.log('❌ verifyToken - Token vacío');
        res.status(401).json({ success: false, error: 'Token no proporcionado' });
        return;
      }

      console.log('🔐 verifyToken - Token recibido (primeros 20 chars):', token.substring(0, 20) + '...');
      console.log('🔐 verifyToken - JWT_SECRET usado (primeros 20 chars):', JWT_SECRET.substring(0, 20) + '...');

      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      console.log('✅ verifyToken - Token decodificado:', JSON.stringify(decoded));

      req.user = decoded;
      next();
    } catch (error: any) {
      console.error('❌ verifyToken - Error:', error.name, error.message);

      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ success: false, error: 'Token inválido' });
        return;
      }
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ success: false, error: 'Token expirado' });
        return;
      }

      // Error genérico - devolver 401 en lugar de 500
      res.status(401).json({ success: false, error: 'Error de autenticación: ' + error.message });
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
