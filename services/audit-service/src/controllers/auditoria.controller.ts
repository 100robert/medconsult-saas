// ============================================
// CONTROLADOR DE AUDITORÍA
// ============================================

import { Request, Response, NextFunction } from 'express';
import { auditoriaService } from '../services/auditoria.service';
import { AccionAuditoria } from '@prisma/client';

export class AuditoriaController {

  /**
   * POST /auditoria
   * Registrar evento de auditoría
   */
  async registrar(req: Request, res: Response, next: NextFunction) {
    try {
      // Agregar IP y User-Agent del request
      const data = {
        ...req.body,
        direccionIP: req.ip || req.headers['x-forwarded-for'] as string,
        agenteUsuario: req.headers['user-agent'],
      };

      const registro = await auditoriaService.registrar(data);

      res.status(201).json({
        success: true,
        message: 'Evento registrado exitosamente',
        data: registro
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auditoria/:id
   * Obtener registro por ID
   */
  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const registro = await auditoriaService.obtenerPorId(id);

      res.json({
        success: true,
        data: registro
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auditoria
   * Buscar registros de auditoría
   */
  async buscar(req: Request, res: Response, next: NextFunction) {
    try {
      const filtros = {
        idUsuario: req.query.usuario as string | undefined,
        accion: req.query.accion as AccionAuditoria | undefined,
        tipoEntidad: req.query.entidad as string | undefined,
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        busqueda: req.query.q as string | undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const resultado = await auditoriaService.buscar(filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auditoria/usuario/:idUsuario
   * Obtener registros de un usuario
   */
  async obtenerPorUsuario(req: Request, res: Response, next: NextFunction) {
    try {
      const { idUsuario } = req.params;
      const filtros = {
        accion: req.query.accion as AccionAuditoria | undefined,
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const resultado = await auditoriaService.obtenerPorUsuario(idUsuario, filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auditoria/entidad/:tipoEntidad
   * Obtener registros de una entidad
   */
  async obtenerPorEntidad(req: Request, res: Response, next: NextFunction) {
    try {
      const { tipoEntidad } = req.params;
      const idEntidad = req.query.id as string | undefined;
      const filtros = {
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 50,
      };

      const resultado = await auditoriaService.obtenerPorEntidad(tipoEntidad, idEntidad, filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auditoria/estadisticas
   * Obtener estadísticas de auditoría
   */
  async obtenerEstadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaDesde = req.query.desde ? new Date(req.query.desde as string) : undefined;
      const fechaHasta = req.query.hasta ? new Date(req.query.hasta as string) : undefined;

      const estadisticas = await auditoriaService.obtenerEstadisticas(fechaDesde, fechaHasta);

      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /auditoria/limpiar
   * Limpiar registros antiguos
   */
  async limpiar(req: Request, res: Response, next: NextFunction) {
    try {
      const diasRetencion = parseInt(req.query.dias as string) || 365;
      const resultado = await auditoriaService.limpiarAntiguos(diasRetencion);

      res.json({
        success: true,
        message: `Se eliminaron ${resultado.eliminados} registros anteriores a ${resultado.fechaLimite.toISOString()}`,
        data: resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auditoria/exportar
   * Exportar registros
   */
  async exportar(req: Request, res: Response, next: NextFunction) {
    try {
      const filtros = {
        idUsuario: req.query.usuario as string | undefined,
        accion: req.query.accion as AccionAuditoria | undefined,
        tipoEntidad: req.query.entidad as string | undefined,
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
      };

      const registros = await auditoriaService.exportar(filtros);

      // Por ahora devolvemos JSON, pero podría ser CSV
      res.json({
        success: true,
        total: registros.length,
        data: registros
      });
    } catch (error) {
      next(error);
    }
  }
}

export const auditoriaController = new AuditoriaController();
