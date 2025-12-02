// ============================================
// MIDDLEWARE DE RATE LIMITING
// ============================================

import rateLimit from 'express-rate-limit';

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutos
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

/**
 * Rate limiter general para todas las rutas
 */
export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Demasiadas peticiones desde esta IP, intente de nuevo más tarde',
    error: 'RATE_LIMIT_EXCEEDED',
    retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000 / 60) + ' minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Usar el keyGenerator por defecto que maneja IPv6 correctamente
  validate: { xForwardedForHeader: false }
});

/**
 * Rate limiter estricto para rutas de autenticación
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Solo 10 intentos de login por ventana
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intente de nuevo en 15 minutos',
    error: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});

/**
 * Rate limiter para operaciones sensibles
 */
export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Solo 5 operaciones sensibles por hora
  message: {
    success: false,
    message: 'Límite de operaciones sensibles alcanzado, intente de nuevo más tarde',
    error: 'SENSITIVE_RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }
});
