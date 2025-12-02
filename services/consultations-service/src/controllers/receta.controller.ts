// ============================================
// CONTROLADOR DE RECETAS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { recetaService } from '../services/receta.service';
import { EstadoReceta } from '@prisma/client';

class RecetaController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const receta = await recetaService.crear(req.body);
      res.status(201).json({ success: true, data: receta });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const receta = await recetaService.obtenerPorId(req.params.id);
      res.json({ success: true, data: receta });
    } catch (error) {
      next(error);
    }
  }

  async listarPorConsulta(req: Request, res: Response, next: NextFunction) {
    try {
      const recetas = await recetaService.listarPorConsulta(req.params.idConsulta);
      res.json({ success: true, data: recetas });
    } catch (error) {
      next(error);
    }
  }

  async listarPorPaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPaciente } = req.params;
      const estado = req.query.estado as EstadoReceta | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const resultado = await recetaService.listarPorPaciente(idPaciente, estado, page, limit);
      res.json({ success: true, ...resultado });
    } catch (error) {
      next(error);
    }
  }

  async listarPorMedico(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const estado = req.query.estado as EstadoReceta | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const resultado = await recetaService.listarPorMedico(idMedico, estado, page, limit);
      res.json({ success: true, ...resultado });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const receta = await recetaService.actualizar(req.params.id, req.body);
      res.json({ success: true, data: receta });
    } catch (error) {
      next(error);
    }
  }

  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const receta = await recetaService.cancelar(req.params.id);
      res.json({ success: true, data: receta });
    } catch (error) {
      next(error);
    }
  }
}

export const recetaController = new RecetaController();
