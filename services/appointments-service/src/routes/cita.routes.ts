// ============================================
// RUTAS DE CITAS
// ============================================

import { Router } from 'express';
import { citaController } from '../controllers/cita.controller';
import { cancelacionController } from '../controllers/cancelacion.controller';
import { noShowController } from '../controllers/noshow.controller';
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

// ========== RUTAS ESPECÍFICAS PRIMERO ==========
// (deben ir antes de /:id para que Express las matchee correctamente)

// Obtener mis citas (basado en el token del usuario autenticado)
router.get('/mis-citas',
  authMiddleware.verifyToken,
  citaController.obtenerMisCitas
);

// Procesar no-shows automáticamente (solo admin/sistema)
router.post('/procesar-noshows',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  cancelacionController.procesarNoShows
);

// Obtener citas de un paciente
router.get('/paciente/:idPaciente',
  authMiddleware.verifyToken,
  citaController.obtenerPorPaciente
);

// Obtener detalle de paciente (incluye próxima cita)
router.get('/paciente/:idPaciente/detalle',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.obtenerDetallePaciente
);

// Obtener citas del día para un médico
router.get('/medico/:idMedico/hoy',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.obtenerCitasHoy
);

// Obtener pacientes únicos de un médico
router.get('/medico/:idMedico/pacientes',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.obtenerPacientes
);

// Obtener citas recientes (Admin Dashboard)
router.get('/admin/recent',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  citaController.obtenerCitasRecientes
);

// Obtener citas de un médico
router.get('/medico/:idMedico',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.obtenerPorMedico
);

// ========== RUTA GENÉRICA AL FINAL ==========
// Obtener información de reembolso antes de cancelar
router.get('/:id/info-cancelacion',
  authMiddleware.verifyToken,
  cancelacionController.obtenerInfoCancelacion
);

// Obtener cita por ID (debe ir después de las rutas específicas)
router.get('/:id',
  authMiddleware.verifyToken,
  citaController.obtenerPorId
);

// Confirmar cita (médicos)
router.patch('/:id/confirmar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  citaController.confirmar
);

// Cancelar cita con cálculo automático de reembolso (pacientes, médicos y admins)
router.patch('/:id/cancelar',
  authMiddleware.verifyToken,
  cancelacionController.cancelarCita
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

// Reprogramar cita (pacientes)
router.patch('/:id/reprogramar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['PACIENTE', 'ADMIN']),
  citaController.reprogramar
);

// ========== RUTAS DE NO-SHOW ==========

// Registrar conexión a sala de videollamada
router.post('/:id/registrar-conexion',
  authMiddleware.verifyToken,
  noShowController.registrarConexion
);

// Reportar que la otra parte no se presentó
router.post('/:id/reportar-noshow',
  authMiddleware.verifyToken,
  noShowController.reportarNoShow
);

// Obtener estado de conexión de una cita
router.get('/:id/estado-conexion',
  authMiddleware.verifyToken,
  noShowController.obtenerEstadoConexion
);

// Procesar no-shows automáticamente (solo admin)
router.post('/procesar-noshows',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  noShowController.procesarNoShows
);

export default router;
