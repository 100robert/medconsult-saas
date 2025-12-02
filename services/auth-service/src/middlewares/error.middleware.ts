// ============================================
// ERROR HANDLER MIDDLEWARE
// ============================================
// Este middleware captura TODOS los errores de la aplicación
// y los convierte en respuestas HTTP consistentes.
//
// ¿Por qué necesitamos un manejador de errores centralizado?
// 1. Respuestas consistentes (mismo formato siempre)
// 2. Logging centralizado (todos los errores en un lugar)
// 3. No exponer detalles internos en producción
// 4. Fácil integrar con servicios de monitoreo (Sentry, DataDog)
//
// Flujo:
// Controller → next(error) → Este middleware → Respuesta HTTP
// ============================================

import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError, AuthenticationError, NotFoundError } from '../types';
import { ZodError } from 'zod';

/**
 * Middleware para manejar errores de toda la aplicación
 * 
 * ¿Cómo funciona?
 * 1. Cualquier controller que haga next(error) llega aquí
 * 2. Identifica el tipo de error
 * 3. Retorna respuesta HTTP apropiada
 * 4. Logea el error (en desarrollo muestra stack trace)
 * 
 * @param err - Error capturado
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - Next function (no se usa, pero Express lo requiere)
 */
export function errorHandler(
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // ==========================================
  // 1. LOGGING DEL ERROR
  // ==========================================
  // En desarrollo: mostrar todo
  // En producción: solo errores operacionales
  // ==========================================
  
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error capturado:', {
      nombre: err.name,
      mensaje: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }

  // ==========================================
  // 2. ERRORES DE VALIDACIÓN (ZOD)
  // ==========================================
  // Si Zod lanza un error (aunque usamos safeParse, puede pasar)
  // ==========================================
  
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: err.issues.map((error) => ({
        campo: error.path.join('.'),
        mensaje: error.message,
      })),
    });
  }

  // ==========================================
  // 3. ERRORES PERSONALIZADOS (AppError)
  // ==========================================
  // Errores que nosotros lanzamos intencionalmente
  // Ejemplo: throw new AuthenticationError('Token inválido')
  // ==========================================
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // ==========================================
  // 4. ERRORES DE PRISMA
  // ==========================================
  // Prisma lanza códigos de error específicos
  // P2002 = Violación de unique constraint
  // P2025 = Registro no encontrado
  // ==========================================
  
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;

    // Violación de constraint único (email duplicado)
    if (prismaError.code === 'P2002') {
      const campo = prismaError.meta?.target?.[0] || 'campo';
      return res.status(409).json({
        success: false,
        message: `El ${campo} ya está en uso`,
      });
    }

    // Registro no encontrado
    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Recurso no encontrado',
      });
    }

    // Otros errores de Prisma
    return res.status(400).json({
      success: false,
      message: 'Error en la operación de base de datos',
      ...(process.env.NODE_ENV === 'development' && { 
        detalle: prismaError.message 
      }),
    });
  }

  // ==========================================
  // 5. ERRORES DE JWT
  // ==========================================
  // jsonwebtoken lanza errores específicos
  // ==========================================
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expirado',
    });
  }

  // ==========================================
  // 6. ERRORES NO MANEJADOS (500)
  // ==========================================
  // Cualquier otro error que no esperábamos
  // En producción: no exponer detalles
  // ==========================================
  
  console.error('❌ Error no manejado:', err);

  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Error interno del servidor'
      : err.message || 'Error desconocido',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack 
    }),
  });
}

/**
 * Middleware para manejar rutas no encontradas (404)
 * 
 * ¿Cuándo se ejecuta?
 * - Cuando ninguna ruta coincide con la petición
 * - Debe ir DESPUÉS de todas las rutas definidas
 * 
 * Ejemplo:
 * GET /api/usuarios/abc123 → 404 Not Found
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - Next function
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new NotFoundError(
    `Ruta no encontrada: ${req.method} ${req.path}`
  );
  next(error);
};