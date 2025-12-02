// ============================================
// RUTAS DE CONSULTAS
// ============================================

import { Router } from 'express';
import { consultaController } from '../controllers/consulta.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Crear consulta (médicos)
router.post('/',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  consultaController.crear
);

// Obtener consulta por ID
router.get('/:id',
  authMiddleware.verifyToken,
  consultaController.obtenerPorId
);

// Actualizar consulta
router.put('/:id',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  consultaController.actualizar
);

// Finalizar consulta
router.post('/:id/finalizar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  consultaController.finalizar
);

// Cancelar consulta
router.post('/:id/cancelar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  consultaController.cancelar
);

// Listar consultas por médico
router.get('/medico/:idMedico',
  authMiddleware.verifyToken,
  consultaController.listarPorMedico
);

// Listar consultas por paciente
router.get('/paciente/:idPaciente',
  authMiddleware.verifyToken,
  consultaController.listarPorPaciente
);

// Obtener estadísticas
router.get('/estadisticas/resumen',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  consultaController.obtenerEstadisticas
);

export default router;
