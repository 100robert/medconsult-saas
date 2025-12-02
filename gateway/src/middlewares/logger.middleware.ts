// ============================================
// MIDDLEWARE DE LOGGING
// ============================================

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para logging de requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log al recibir la petición
  console.log(`➡️  ${new Date().toISOString()} | ${req.method} ${req.originalUrl}`);
  
  // Capturar cuando termine la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : res.statusCode >= 300 ? '🟡' : '🟢';
    
    console.log(
      `${statusColor} ${new Date().toISOString()} | ${req.method} ${req.originalUrl} | ` +
      `${res.statusCode} | ${duration}ms | ${req.ip || 'unknown'}`
    );
  });
  
  next();
};

/**
 * Middleware para agregar headers de seguridad adicionales
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Agregar headers de seguridad
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Remover header que expone información del servidor
  res.removeHeader('X-Powered-By');
  
  next();
};

/**
 * Middleware para agregar request ID
 */
export const requestId = (req: Request, res: Response, next: NextFunction): void => {
  const id = req.headers['x-request-id'] as string || 
             `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-Id', id);
  
  next();
};
