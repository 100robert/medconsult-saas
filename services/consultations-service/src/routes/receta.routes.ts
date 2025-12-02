// ============================================
// RUTAS DE RECETAS
// ============================================

import { Router } from 'express';
import { recetaController } from '../controllers/receta.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Crear receta (médicos)
router.post('/',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  recetaController.crear
);

// Obtener receta por ID
router.get('/:id',
  authMiddleware.verifyToken,
  recetaController.obtenerPorId
);

// Listar recetas por consulta
router.get('/consulta/:idConsulta',
  authMiddleware.verifyToken,
  recetaController.listarPorConsulta
);

// Listar recetas por paciente
router.get('/paciente/:idPaciente',
  authMiddleware.verifyToken,
  recetaController.listarPorPaciente
);

// Listar recetas por médico
router.get('/medico/:idMedico',
  authMiddleware.verifyToken,
  recetaController.listarPorMedico
);

// Actualizar receta
router.put('/:id',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  recetaController.actualizar
);

// Cancelar receta
router.post('/:id/cancelar',
  authMiddleware.verifyToken,
  authMiddleware.requireRoles(['MEDICO', 'ADMIN']),
  recetaController.cancelar
);

export default router;
