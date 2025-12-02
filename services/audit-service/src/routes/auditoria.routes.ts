// ============================================
// RUTAS DE AUDITORÍA
// ============================================

import { Router } from 'express';
import { auditoriaController } from '../controllers/auditoria.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ========== RUTAS PROTEGIDAS (SOLO ADMIN) ==========

// Registrar evento de auditoría (interno, desde otros servicios)
router.post('/',
  authMiddleware.verifyToken,
  auditoriaController.registrar
);

// Buscar registros de auditoría
router.get('/',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  auditoriaController.buscar
);

// Obtener estadísticas
router.get('/estadisticas',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  auditoriaController.obtenerEstadisticas
);

// Exportar registros
router.get('/exportar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  auditoriaController.exportar
);

// Limpiar registros antiguos
router.delete('/limpiar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  auditoriaController.limpiar
);

// Obtener registros de un usuario
router.get('/usuario/:idUsuario',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  auditoriaController.obtenerPorUsuario
);

// Obtener registros de una entidad
router.get('/entidad/:tipoEntidad',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  auditoriaController.obtenerPorEntidad
);

// Obtener registro por ID
router.get('/:id',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  auditoriaController.obtenerPorId
);

export default router;
