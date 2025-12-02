// ============================================
// AUTH MIDDLEWARE - VERIFICACIÓN DE JWT
// ============================================
// Este middleware protege rutas que requieren autenticación.
//
// ¿Cómo funciona?
// 1. Extrae el token del header Authorization
// 2. Verifica que sea válido (firma y expiración)
// 3. Decodifica el payload (userId, rol, etc.)
// 4. Adjunta la info del usuario a req.user
// 5. Permite continuar o rechaza con 401
//
// Uso:
// router.get('/perfil', authMiddleware, controller.getPerfil)
//                       ↑ Este middleware se ejecuta primero
// ============================================

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { AuthenticationError, JWTPayload } from '../types';

/**
 * Extender la interfaz Request de Express
 * para incluir la información del usuario autenticado
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Middleware de autenticación
 * 
 * ¿Qué verifica?
 * - Que exista el header Authorization
 * - Que tenga formato: "Bearer TOKEN_AQUI"
 * - Que el token sea válido y no haya expirado
 * - Que el usuario asociado exista y esté activo
 * 
 * Si todo está bien: req.user contiene { userId, correo, rol }
 * Si falla: retorna 401 Unauthorized
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - Next function
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // ==========================================
    // 1. EXTRAER TOKEN DEL HEADER
    // ==========================================
    // Formato esperado: "Authorization: Bearer eyJhbGc..."
    // ==========================================
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AuthenticationError('Token no proporcionado');
    }

    // Verificar que tenga el formato "Bearer TOKEN"
    if (!authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Formato de token inválido. Debe ser: Bearer {token}');
    }

    // Extraer el token (quitar "Bearer ")
    const token = authHeader.substring(7);

    if (!token) {
      throw new AuthenticationError('Token vacío');
    }

    // ==========================================
    // 2. VERIFICAR Y DECODIFICAR TOKEN
    // ==========================================
    // Esto verifica:
    // - Firma válida (no fue modificado)
    // - No expirado
    // - Formato correcto
    // ==========================================
    
    const payload = verifyAccessToken(token);

    // ==========================================
    // 3. ADJUNTAR USUARIO AL REQUEST
    // ==========================================
    // Ahora cualquier middleware/controller posterior
    // puede acceder a req.user
    // ==========================================
    
    req.user = payload;

    // ==========================================
    // 4. CONTINUAR A LA SIGUIENTE CAPA
    // ==========================================
    
    next();
    
  } catch (error) {
    // Si el token es inválido o expiró
    if (error instanceof Error && error.message.includes('expirado')) {
      return next(new AuthenticationError('Token expirado. Por favor, renueva tu sesión.'));
    }
    
    next(new AuthenticationError('Token inválido'));
  }
}

/**
 * Middleware para verificar roles específicos
 * 
 * ¿Para qué sirve?
 * - Proteger rutas que solo ciertos roles pueden acceder
 * - Ejemplo: Solo médicos pueden crear recetas
 * 
 * Uso:
 * router.post('/recetas', authMiddleware, requireRole(['MEDICO']), controller.crearReceta)
 * 
 * @param roles - Array de roles permitidos
 * @returns Middleware function
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verificar que el usuario esté autenticado primero
    if (!req.user) {
      return next(new AuthenticationError('Usuario no autenticado'));
    }

    // Verificar que tenga el rol necesario
    if (!roles.includes(req.user.rol)) {
      return next(
        new AuthenticationError(
          `Acceso denegado. Se requiere uno de estos roles: ${roles.join(', ')}`
        )
      );
    }

    next();
  };
}

/**
 * Middleware opcional de autenticación
 * 
 * ¿Cuándo usarlo?
 * - Rutas que funcionan CON o SIN autenticación
 * - Ejemplo: Listar médicos (público, pero si estás logueado muestra favoritos)
 * 
 * Si hay token válido: req.user se llena
 * Si no hay token o es inválido: req.user = undefined (pero continúa)
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - Next function
 */
export async function optionalAuthMiddleware(
  req: Request,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);
      req.user = payload;
    }

    next();
  } catch (error) {
    // Si el token es inválido, simplemente continuar sin usuario
    next();
  }
}