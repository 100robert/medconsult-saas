// ============================================
// RUTAS DE PACIENTES
// ============================================

import { Router } from 'express';
import { pacienteController } from '../controllers/paciente.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// Crear perfil de paciente
router.post('/', authenticate, authorize('PACIENTE'), (req, res, next) => {
  pacienteController.crear(req, res, next);
});

// Obtener mi perfil
router.get('/me', authenticate, authorize('PACIENTE'), (req, res, next) => {
  pacienteController.obtenerMiPerfil(req, res, next);
});

// Actualizar mi perfil
router.put('/me', authenticate, authorize('PACIENTE'), (req, res, next) => {
  pacienteController.actualizarMiPerfil(req, res, next);
});

// Obtener mi historial médico
router.get('/me/historial', authenticate, authorize('PACIENTE'), (req, res, next) => {
  pacienteController.obtenerMiHistorial(req, res, next);
});

// ============================================
// RUTAS DE ADMIN
// ============================================

// Listar todos los pacientes
router.get('/', authenticate, authorize('ADMIN'), (req, res, next) => {
  pacienteController.listar(req, res, next);
});

// Obtener paciente por ID
router.get('/:id', authenticate, authorize('ADMIN', 'MEDICO'), (req, res, next) => {
  pacienteController.obtenerPorId(req, res, next);
});

// Actualizar paciente por ID
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) => {
  pacienteController.actualizar(req, res, next);
});

export default router;
