// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload, UnauthorizedError, ForbiddenError } from '../types';
import { RolUsuario } from '@prisma/client';

// Usar el mismo secreto que auth-service
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-abc123xyz';

export class AuthMiddleware {
  /**
   * Verificar token JWT
   * Prioriza headers del gateway, luego verifica token directamente
   */
  verifyToken(req: Request, res: Response, next: NextFunction): void {
    try {
      // ==========================================
      // OPCIÓN 1: Usar headers del gateway (si están presentes)
      // ==========================================
      // El gateway ya verificó el token y pasó la info en headers
      const userIdFromHeader = req.headers['x-user-id'] as string;
      const userEmailFromHeader = req.headers['x-user-email'] as string;
      const userRoleFromHeader = req.headers['x-user-role'] as string;

      if (userIdFromHeader && userRoleFromHeader) {
        // Gateway ya verificó el token, usar la info de los headers
        req.user = {
          userId: userIdFromHeader,
          email: userEmailFromHeader || (req.headers['x-user-email'] as string) || '',
          rol: userRoleFromHeader as RolUsuario,
        };
        console.log('✅ Autenticación desde headers del gateway:', {
          userId: userIdFromHeader,
          rol: userRoleFromHeader,
        });
        return next();
      }

      // ==========================================
      // OPCIÓN 2: Verificar token directamente
      // ==========================================
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ Token no proporcionado en Authorization header');
        throw new UnauthorizedError('Token no proporcionado');
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        console.log('❌ Token vacío después de Bearer');
        throw new UnauthorizedError('Token no proporcionado');
      }

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
        
        console.log('✅ Token verificado directamente:', {
          userId: req.user.userId,
          rol: req.user.rol,
        });
        
        next();
      } catch (jwtError) {
        if (jwtError instanceof jwt.JsonWebTokenError) {
          console.log('❌ Error JWT:', jwtError.message);
          next(new UnauthorizedError(`Token inválido: ${jwtError.message}`));
          return;
        }
        if (jwtError instanceof jwt.TokenExpiredError) {
          console.log('❌ Token expirado');
          next(new UnauthorizedError('Token expirado'));
          return;
        }
        throw jwtError;
      }
    } catch (error) {
      // Si es un UnauthorizedError, pasarlo directamente
      if (error instanceof UnauthorizedError) {
        next(error);
        return;
      }
      
      // Otros errores
      console.error('❌ Error inesperado en verifyToken:', error);
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

  /**
   * Verificar que el usuario es médico
   */
  requireMedico(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      next(new UnauthorizedError('Usuario no autenticado'));
      return;
    }

    if (req.user.rol !== 'MEDICO' && req.user.rol !== 'ADMIN') {
      next(new ForbiddenError('Solo médicos pueden realizar esta acción'));
      return;
    }

    next();
  }
}

export const authMiddleware = new AuthMiddleware();
