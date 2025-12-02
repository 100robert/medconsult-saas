// ============================================
// CONTROLADOR DE CONSULTAS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { consultaService } from '../services/consulta.service';

class ConsultaController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const consulta = await consultaService.crear(req.body);
      res.status(201).json({ success: true, data: consulta });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const consulta = await consultaService.obtenerPorId(req.params.id);
      res.json({ success: true, data: consulta });
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const consulta = await consultaService.actualizar(req.params.id, req.body);
      res.json({ success: true, data: consulta });
    } catch (error) {
      next(error);
    }
  }

  async finalizar(req: Request, res: Response, next: NextFunction) {
    try {
      const consulta = await consultaService.finalizar(req.params.id, req.body);
      res.json({ success: true, data: consulta });
    } catch (error) {
      next(error);
    }
  }

  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const consulta = await consultaService.cancelar(req.params.id, req.body.motivo);
      res.json({ success: true, data: consulta });
    } catch (error) {
      next(error);
    }
  }

  async listarPorMedico(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const filtros = {
        estado: req.query.estado as any,
        fechaDesde: req.query.fechaDesde as any,
        fechaHasta: req.query.fechaHasta as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      };
      const resultado = await consultaService.listarPorMedico(idMedico, filtros);
      res.json({ success: true, ...resultado });
    } catch (error) {
      next(error);
    }
  }

  async listarPorPaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPaciente } = req.params;
      const filtros = {
        estado: req.query.estado as any,
        fechaDesde: req.query.fechaDesde as any,
        fechaHasta: req.query.fechaHasta as any,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 10
      };
      const resultado = await consultaService.listarPorPaciente(idPaciente, filtros);
      res.json({ success: true, ...resultado });
    } catch (error) {
      next(error);
    }
  }

  async obtenerEstadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      const idMedico = req.query.idMedico as string | undefined;
      const estadisticas = await consultaService.obtenerEstadisticas(idMedico);
      res.json({ success: true, data: estadisticas });
    } catch (error) {
      next(error);
    }
  }
}

export const consultaController = new ConsultaController();
