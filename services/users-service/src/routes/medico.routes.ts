// ============================================
// RUTAS DE MÉDICOS
// ============================================

import { Router } from 'express';
import { medicoController } from '../controllers/medico.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Buscar médicos con filtros
router.get('/buscar', (req, res, next) => {
  medicoController.buscar(req, res, next);
});

// Obtener médico por ID (perfil público)
router.get('/:id', (req, res, next) => {
  medicoController.obtenerPorId(req, res, next);
});

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// Crear perfil de médico
router.post('/', authenticate, authorize('MEDICO'), (req, res, next) => {
  medicoController.crear(req, res, next);
});

// Obtener mi perfil
router.get('/me/perfil', authenticate, authorize('MEDICO'), (req, res, next) => {
  medicoController.obtenerMiPerfil(req, res, next);
});

// Actualizar mi perfil
router.put('/me', authenticate, authorize('MEDICO'), (req, res, next) => {
  medicoController.actualizarMiPerfil(req, res, next);
});

// ============================================
// RUTAS DE ADMIN
// ============================================

// Listar todos los médicos
router.get('/', authenticate, authorize('ADMIN'), (req, res, next) => {
  medicoController.listar(req, res, next);
});

// Verificar/cambiar estado de médico
router.patch('/:id/verificar', authenticate, authorize('ADMIN'), (req, res, next) => {
  medicoController.verificar(req, res, next);
});

// Actualizar médico por ID
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) => {
  medicoController.actualizar(req, res, next);
});

export default router;
