// ============================================
// RUTAS DE DISPONIBILIDAD
// ============================================

import { Router } from 'express';
import { disponibilidadController } from '../controllers/disponibilidad.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ========== RUTAS PÚBLICAS ==========
// Obtener slots disponibles de un médico (para agendar citas)
router.get('/medico/:idMedico/slots',
  disponibilidadController.obtenerSlots
);

// ========== RUTAS PROTEGIDAS ==========

// Obtener MIS disponibilidades (para el médico autenticado)
// IMPORTANTE: Esta ruta debe ir ANTES de /medico/:idMedico para evitar conflictos
router.get('/me',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO']),
  disponibilidadController.obtenerMiDisponibilidad
);

// Obtener disponibilidades de un médico
router.get('/medico/:idMedico',
  authMiddleware.verifyToken,
  disponibilidadController.obtenerPorMedico
);

// Obtener fechas no disponibles de un médico
router.get('/medico/:idMedico/fechas-no-disponibles',
  authMiddleware.verifyToken,
  disponibilidadController.obtenerFechasNoDisponibles
);

// Crear horario de disponibilidad (solo médicos y admins)
router.post('/',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  disponibilidadController.crear
);

// Crear múltiples horarios (solo médicos y admins)
router.post('/multiples',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  disponibilidadController.crearMultiples
);

// Agregar fecha no disponible (solo médicos y admins)
router.post('/fechas-no-disponibles',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  disponibilidadController.agregarFechaNoDisponible
);

// Actualizar disponibilidad (solo médicos y admins)
router.put('/:id',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  disponibilidadController.actualizar
);

// Eliminar disponibilidad (solo médicos y admins)
router.delete('/:id',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  disponibilidadController.eliminar
);

// Eliminar fecha no disponible
router.delete('/fechas-no-disponibles/:id',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  disponibilidadController.eliminarFechaNoDisponible
);

export default router;
