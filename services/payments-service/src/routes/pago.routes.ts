// ============================================
// RUTAS DE PAGOS
// ============================================

import { Router } from 'express';
import { pagoController } from '../controllers/pago.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// ========== RUTAS PROTEGIDAS ==========

// Crear pago
router.post('/',
  authMiddleware.verifyToken,
  pagoController.crear
);

// Obtener resumen de pagos (admin y médicos)
router.get('/resumen',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  pagoController.obtenerResumen
);

// Obtener pago por ID
router.get('/:id',
  authMiddleware.verifyToken,
  pagoController.obtenerPorId
);

// Obtener pago por transacción
router.get('/transaccion/:ref',
  authMiddleware.verifyToken,
  pagoController.obtenerPorTransaccion
);

// Procesar pago
router.post('/:id/procesar',
  authMiddleware.verifyToken,
  pagoController.procesar
);

// Reembolsar pago (solo admin)
router.post('/:id/reembolsar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['ADMIN']),
  pagoController.reembolsar
);

// Cancelar pago
router.post('/:id/cancelar',
  authMiddleware.verifyToken,
  pagoController.cancelar
);

// Obtener pagos de un paciente
router.get('/paciente/:idPaciente',
  authMiddleware.verifyToken,
  pagoController.obtenerPorPaciente
);

// Obtener pagos de un médico
router.get('/medico/:idMedico',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  pagoController.obtenerPorMedico
);

export default router;
