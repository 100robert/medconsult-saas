// ============================================
// RUTAS DE NOTIFICACIONES
// ============================================

import { Router } from 'express';
import { notificacionController } from '../controllers/notificacion.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Crear notificación
router.post('/',
  authMiddleware.verifyToken,
  notificacionController.crear
);

// Obtener notificación por ID
router.get('/:id',
  authMiddleware.verifyToken,
  notificacionController.obtenerPorId
);

// Listar notificaciones de un usuario
router.get('/usuario/:idUsuario',
  authMiddleware.verifyToken,
  notificacionController.listarPorUsuario
);

// Obtener notificaciones pendientes (admin)
router.get('/pendientes/lista',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  notificacionController.obtenerPendientes
);

// Obtener estadísticas
router.get('/estadisticas/resumen',
  authMiddleware.verifyToken,
  notificacionController.obtenerEstadisticas
);

// Marcar como enviada
router.post('/:id/enviada',
  authMiddleware.verifyToken,
  notificacionController.marcarEnviada
);

// Marcar como fallida
router.post('/:id/fallida',
  authMiddleware.verifyToken,
  notificacionController.marcarFallida
);

// Reintentar envío
router.post('/:id/reintentar',
  authMiddleware.verifyToken,
  notificacionController.reintentarEnvio
);

// Enviar correo
router.post('/:id/enviar-correo',
  authMiddleware.verifyToken,
  notificacionController.enviarCorreo
);

// Enviar SMS
router.post('/:id/enviar-sms',
  authMiddleware.verifyToken,
  notificacionController.enviarSMS
);

export default router;
