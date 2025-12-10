// ============================================
// CONTROLADOR DE MÉTRICAS DE SALUD
// ============================================

import { Request, Response, NextFunction } from 'express';
import { metricaSaludService } from '../services/metrica-salud.service';

export class MetricaSaludController {

  /**
   * POST /metricas-salud
   * Crear nueva métrica de salud
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('📥 Request recibido para crear métrica:', {
        userId: req.user?.userId,
        body: req.body
      });

      if (!req.user?.userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const data = {
        idUsuario: req.user.userId,
        ...req.body
      };

      const metrica = await metricaSaludService.crear(data);

      res.status(201).json({
        success: true,
        message: 'Métrica de salud registrada exitosamente',
        data: metrica
      });
    } catch (error: any) {
      console.error('❌ Error en controlador crear métrica:', error);
      next(error);
    }
  }

  /**
   * GET /metricas-salud/mis-metricas
   * Obtener mis métricas de salud
   */
  async obtenerMisMetricas(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const metricas = await metricaSaludService.obtenerPorPaciente(
        req.user!.userId,
        limit
      );

      res.status(200).json({
        success: true,
        data: metricas
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /metricas-salud/ultima
   * Obtener la última métrica de salud
   */
  async obtenerUltima(req: Request, res: Response, next: NextFunction) {
    try {
      const metrica = await metricaSaludService.obtenerUltima(req.user!.userId);

      res.status(200).json({
        success: true,
        data: metrica || null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /metricas-salud/:id
   * Actualizar métrica de salud
   */
  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const metrica = await metricaSaludService.actualizar(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Métrica actualizada exitosamente',
        data: metrica
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /metricas-salud/:id
   * Eliminar métrica de salud
   */
  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await metricaSaludService.eliminar(req.params.id);

      res.status(200).json({
        success: true,
        message: resultado.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export const metricaSaludController = new MetricaSaludController();

