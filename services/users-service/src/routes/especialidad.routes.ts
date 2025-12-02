// ============================================
// RUTAS DE ESPECIALIDADES
// ============================================

import { Router } from 'express';
import { especialidadController } from '../controllers/especialidad.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Listar todas las especialidades
router.get('/', (req, res, next) => {
  especialidadController.listar(req, res, next);
});

// Buscar especialidades
router.get('/buscar', (req, res, next) => {
  especialidadController.buscar(req, res, next);
});

// Obtener especialidad por ID
router.get('/:id', (req, res, next) => {
  especialidadController.obtenerPorId(req, res, next);
});

// ============================================
// RUTAS DE ADMIN
// ============================================

// Crear especialidad
router.post('/', authenticate, authorize('ADMIN'), (req, res, next) => {
  especialidadController.crear(req, res, next);
});

// Sembrar especialidades iniciales
router.post('/sembrar', authenticate, authorize('ADMIN'), (req, res, next) => {
  especialidadController.sembrar(req, res, next);
});

// Actualizar especialidad
router.put('/:id', authenticate, authorize('ADMIN'), (req, res, next) => {
  especialidadController.actualizar(req, res, next);
});

// Desactivar especialidad
router.delete('/:id', authenticate, authorize('ADMIN'), (req, res, next) => {
  especialidadController.desactivar(req, res, next);
});

export default router;
