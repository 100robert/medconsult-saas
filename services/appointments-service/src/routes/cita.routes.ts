// ============================================
// RUTAS DE CITAS
// ============================================

import { Router } from 'express';
import { citaController } from '../controllers/cita.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ========== RUTAS PROTEGIDAS ==========
// Todas las rutas de citas requieren autenticación

// Crear cita (pacientes)
router.post('/',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['PACIENTE', 'ADMIN']),
  citaController.crear
);

// Obtener cita por ID
router.get('/:id',
  authMiddleware.verifyToken,
  citaController.obtenerPorId
);

// Obtener citas de un paciente
router.get('/paciente/:idPaciente',
  authMiddleware.verifyToken,
  citaController.obtenerPorPaciente
);

// Obtener citas de un médico
router.get('/medico/:idMedico',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.obtenerPorMedico
);

// Obtener citas del día para un médico
router.get('/medico/:idMedico/hoy',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.obtenerCitasHoy
);

// Confirmar cita (médicos)
router.patch('/:id/confirmar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.confirmar
);

// Cancelar cita (pacientes, médicos y admins)
router.patch('/:id/cancelar',
  authMiddleware.verifyToken,
  citaController.cancelar
);

// Completar cita (médicos)
router.patch('/:id/completar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.completar
);

// Actualizar notas de cita (médicos)
router.put('/:id/notas',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.actualizarNotas
);

export default router;
