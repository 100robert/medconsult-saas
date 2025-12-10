// ============================================
// RUTAS DE MÉTRICAS DE SALUD
// ============================================

import { Router } from 'express';
import { metricaSaludController } from '../controllers/metrica-salud.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================

// Crear nueva métrica de salud
router.post(
  '/',
  authenticate,
  authorize('PACIENTE'),
  (req, res, next) => metricaSaludController.crear(req, res, next)
);

// Obtener mis métricas de salud
router.get(
  '/mis-metricas',
  authenticate,
  authorize('PACIENTE'),
  (req, res, next) => metricaSaludController.obtenerMisMetricas(req, res, next)
);

// Obtener última métrica
router.get(
  '/ultima',
  authenticate,
  authorize('PACIENTE'),
  (req, res, next) => metricaSaludController.obtenerUltima(req, res, next)
);

// Actualizar métrica
router.put(
  '/:id',
  authenticate,
  authorize('PACIENTE'),
  (req, res, next) => metricaSaludController.actualizar(req, res, next)
);

// Eliminar métrica
router.delete(
  '/:id',
  authenticate,
  authorize('PACIENTE'),
  (req, res, next) => metricaSaludController.eliminar(req, res, next)
);

export default router;

