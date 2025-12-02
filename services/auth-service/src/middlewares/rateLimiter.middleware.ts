// ============================================
// RATE LIMITER MIDDLEWARE
// ============================================
// Limita el número de peticiones por IP/usuario
// para prevenir:
// - Ataques de fuerza bruta (intentos de login)
// - Spam de registro
// - Abuso de API
// - DoS (Denial of Service)
//
// Estrategia: Ventana deslizante (Sliding Window)
// Ejemplo: Máximo 100 requests por IP cada 15 minutos
// ============================================

import rateLimit from 'express-rate-limit';

/**
 * Rate limiter general para toda la API
 * 
 * Límite: 100 requests por 15 minutos por IP
 * 
 * ¿Qué pasa si se excede?
 * - Retorna 429 Too Many Requests
 * - Incluye headers con info:
 *   X-RateLimit-Limit: 100
 *   X-RateLimit-Remaining: 50
 *   X-RateLimit-Reset: 1640000000
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: {
    success: false,
    message: 'Demasiadas peticiones. Por favor, intenta más tarde.',
  },
  standardHeaders: true, // Retorna headers RateLimit-*
  legacyHeaders: false, // Desactiva headers X-RateLimit-*
  validate: { xForwardedForHeader: false },
});

/**
 * Rate limiter estricto para autenticación
 * 
 * Límite: 5 intentos por 15 minutos por IP
 * 
 * ¿Por qué más estricto?
 * - Login y registro son objetivos de ataques
 * - 5 intentos fallidos = posible fuerza bruta
 * - Protege cuentas de usuarios
 * 
 * Uso:
 * router.post('/login', authRateLimiter, controller.login)
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Solo 5 intentos
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación. Por favor, espera 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Contar incluso si fue exitoso
});

/**
 * Rate limiter para recuperación de contraseña
 * 
 * Límite: 3 intentos por hora por IP
 * 
 * ¿Por qué tan estricto?
 * - Prevenir spam de emails de recuperación
 * - Evitar abuso del servicio de email
 * - Un usuario legítimo no necesita más de 3 intentos
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: {
    success: false,
    message: 'Demasiadas solicitudes de recuperación. Por favor, espera 1 hora.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});