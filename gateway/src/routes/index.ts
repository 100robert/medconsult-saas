// ============================================
// RUTAS DEL GATEWAY
// ============================================

import { Router, Request, Response } from 'express';
import { services } from '../config/services';
import {
  authProxy,
  usersProxy,
  appointmentsProxy,
  consultationsProxy,
  paymentsProxy,
  notificationsProxy,
  reviewsProxy,
  auditProxy
} from '../proxy';
import { authMiddleware, requireRoles } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// ============================================
// HEALTH CHECK DE TODOS LOS SERVICIOS
// ============================================

router.get('/health/services', async (req: Request, res: Response) => {
  const healthChecks: Record<string, any> = {};
  
  for (const [key, service] of Object.entries(services)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${service.url}${service.healthCheck}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeout);
      
      healthChecks[key] = {
        name: service.name,
        status: response.ok ? 'healthy' : 'unhealthy',
        statusCode: response.status,
        url: service.url
      };
    } catch (error) {
      healthChecks[key] = {
        name: service.name,
        status: 'unreachable',
        error: (error as Error).message,
        url: service.url
      };
    }
  }

  const allHealthy = Object.values(healthChecks).every(h => h.status === 'healthy');

  res.status(allHealthy ? 200 : 503).json({
    success: allHealthy,
    timestamp: new Date().toISOString(),
    gateway: 'healthy',
    services: healthChecks
  });
});

// ============================================
// RUTAS DE AUTENTICACIÓN (Rate limited)
// ============================================

router.use('/auth', authLimiter, authProxy);

// ============================================
// RUTAS DE USUARIOS (Requieren auth)
// ============================================

router.use('/usuarios', authMiddleware, usersProxy);
router.use('/pacientes', authMiddleware, usersProxy);
router.use('/medicos', authMiddleware, usersProxy);
router.use('/especialidades', usersProxy); // Público
router.use('/metricas-salud', authMiddleware, usersProxy);

// ============================================
// RUTAS DE CITAS (Requieren auth)
// ============================================

router.use('/citas', authMiddleware, appointmentsProxy);
router.use('/disponibilidad', authMiddleware, appointmentsProxy);

// ============================================
// RUTAS DE CONSULTAS (Requieren auth)
// ============================================

router.use('/consultas', authMiddleware, consultationsProxy);
router.use('/recetas', authMiddleware, consultationsProxy);

// ============================================
// RUTAS DE PAGOS (Requieren auth)
// ============================================

router.use('/pagos', authMiddleware, paymentsProxy);

// ============================================
// RUTAS DE NOTIFICACIONES (Requieren auth)
// ============================================

router.use('/notificaciones', authMiddleware, notificationsProxy);

// ============================================
// RUTAS DE RESEÑAS (Algunas públicas)
// ============================================

router.use('/resenas', reviewsProxy); // El servicio maneja auth internamente

// ============================================
// RUTAS DE AUDITORÍA (Solo admin)
// ============================================

router.use('/auditoria', 
  authMiddleware, 
  requireRoles(['ADMIN']), 
  auditProxy
);

export default router;
