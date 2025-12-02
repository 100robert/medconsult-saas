// ============================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ============================================

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para rutas no encontradas
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    error: 'NOT_FOUND',
    availableRoutes: [
      '/health',
      '/api/auth/*',
      '/api/usuarios/*',
      '/api/pacientes/*',
      '/api/medicos/*',
      '/api/citas/*',
      '/api/consultas/*',
      '/api/pagos/*',
      '/api/notificaciones/*',
      '/api/resenas/*',
      '/api/auditoria/*',
    ]
  });
};

/**
 * Middleware global de manejo de errores
 */
export const errorHandler = (
  err: Error & { statusCode?: number; isOperational?: boolean },
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    message: err.isOperational ? err.message : 'Error interno del servidor',
    error: statusCode === 500 ? 'INTERNAL_ERROR' : 'ERROR',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.message 
    })
  });
};

/**
 * Middleware para manejar errores de proxy
 */
export const proxyErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ Proxy Error:', {
    message: err.message,
    target: req.originalUrl,
    timestamp: new Date().toISOString()
  });

  res.status(503).json({
    success: false,
    message: 'Servicio temporalmente no disponible',
    error: 'SERVICE_UNAVAILABLE',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};
