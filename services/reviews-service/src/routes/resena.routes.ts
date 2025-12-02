// ============================================
// RUTAS DE RESEÑAS
// ============================================

import { Router } from 'express';
import { resenaController } from '../controllers/resena.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ========== RUTAS PÚBLICAS ==========

// Obtener reseñas públicas (para landing page)
router.get('/publicas', resenaController.obtenerPublicas);

// Obtener reseñas de un médico (público)
router.get('/medico/:idMedico', resenaController.obtenerPorMedico);

// Obtener estadísticas de un médico (público)
router.get('/medico/:idMedico/estadisticas', resenaController.obtenerEstadisticas);

// ========== RUTAS PROTEGIDAS ==========

// Crear reseña (solo pacientes)
router.post('/',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['PACIENTE', 'ADMIN']),
  resenaController.crear
);

// Obtener reseña por ID
router.get('/:id',
  authMiddleware.verifyToken,
  resenaController.obtenerPorId
);

// Actualizar reseña (solo el paciente que la creó)
router.put('/:id',
  authMiddleware.verifyToken,
  resenaController.actualizar
);

// Eliminar reseña
router.delete('/:id',
  authMiddleware.verifyToken,
  resenaController.eliminar
);

// Marcar reseña como útil
router.post('/:id/util',
  authMiddleware.verifyToken,
  resenaController.marcarUtil
);

// Cambiar estado de reseña (moderación - solo admin)
router.patch('/:id/estado',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  resenaController.cambiarEstado
);

// Obtener reseñas pendientes de moderación (admin)
router.get('/admin/pendientes',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  resenaController.obtenerPendientes
);

// Obtener reseñas de un paciente
router.get('/paciente/:idPaciente',
  authMiddleware.verifyToken,
  resenaController.obtenerPorPaciente
);

export default router;
