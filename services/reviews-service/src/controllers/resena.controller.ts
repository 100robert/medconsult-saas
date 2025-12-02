// ============================================
// CONTROLADOR DE RESEÑAS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { resenaService } from '../services/resena.service';
import { EstadoResena } from '@prisma/client';

export class ResenaController {

  /**
   * POST /resenas
   * Crear reseña
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      // Obtener ID del paciente desde el usuario autenticado
      const idPaciente = req.body.idPaciente || req.user!.userId;
      const resena = await resenaService.crear(idPaciente, req.body);

      res.status(201).json({
        success: true,
        message: 'Reseña creada exitosamente',
        data: resena
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /resenas/:id
   * Obtener reseña por ID
   */
  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resena = await resenaService.obtenerPorId(id);

      res.json({
        success: true,
        data: resena
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /resenas/:id
   * Actualizar reseña
   */
  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idPaciente = req.user!.userId;
      const resena = await resenaService.actualizar(id, idPaciente, req.body);

      res.json({
        success: true,
        message: 'Reseña actualizada exitosamente',
        data: resena
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /resenas/:id
   * Eliminar reseña
   */
  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const idPaciente = req.user!.userId;
      const esAdmin = req.user!.rol === 'ADMIN';

      await resenaService.eliminar(id, idPaciente, esAdmin);

      res.json({
        success: true,
        message: 'Reseña eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /resenas/:id/util
   * Marcar reseña como útil
   */
  async marcarUtil(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const resena = await resenaService.marcarUtil(id);

      res.json({
        success: true,
        message: 'Reseña marcada como útil',
        data: resena
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /resenas/:id/estado
   * Cambiar estado de reseña (moderación - admin)
   */
  async cambiarEstado(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      
      if (!Object.values(EstadoResena).includes(estado)) {
        res.status(400).json({
          success: false,
          message: 'Estado inválido'
        });
        return;
      }

      const resena = await resenaService.cambiarEstado(id, estado);

      res.json({
        success: true,
        message: 'Estado actualizado exitosamente',
        data: resena
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /resenas/medico/:idMedico
   * Obtener reseñas de un médico
   */
  async obtenerPorMedico(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const filtros = {
        calificacionMin: req.query.min ? parseInt(req.query.min as string) : undefined,
        calificacionMax: req.query.max ? parseInt(req.query.max as string) : undefined,
        soloConComentario: req.query.comentarios === 'true',
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const resultado = await resenaService.obtenerPorMedico(idMedico, filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /resenas/medico/:idMedico/estadisticas
   * Obtener estadísticas de reseñas de un médico
   */
  async obtenerEstadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const estadisticas = await resenaService.obtenerEstadisticasMedico(idMedico);

      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /resenas/paciente/:idPaciente
   * Obtener reseñas de un paciente
   */
  async obtenerPorPaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPaciente } = req.params;
      const filtros = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const resultado = await resenaService.obtenerPorPaciente(idPaciente, filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /resenas/publicas
   * Obtener reseñas públicas para landing
   */
  async obtenerPublicas(req: Request, res: Response, next: NextFunction) {
    try {
      const limite = parseInt(req.query.limite as string) || 10;
      const resenas = await resenaService.obtenerResenasPublicas(limite);

      res.json({
        success: true,
        data: resenas
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /resenas/pendientes
   * Obtener reseñas pendientes de moderación (admin)
   */
  async obtenerPendientes(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const resultado = await resenaService.obtenerPendientes(page, limit);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

export const resenaController = new ResenaController();
