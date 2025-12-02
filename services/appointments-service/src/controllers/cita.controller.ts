// ============================================
// CONTROLADOR DE CITAS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { citaService } from '../services/cita.service';
import { EstadoCita } from '@prisma/client';

export class CitaController {

  /**
   * POST /citas
   * Crear una nueva cita
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const cita = await citaService.crear({
        ...req.body,
        fechaHoraCita: new Date(req.body.fechaHoraCita),
      });

      res.status(201).json({
        success: true,
        message: 'Cita creada exitosamente',
        data: cita
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /citas/:id
   * Obtener cita por ID
   */
  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cita = await citaService.obtenerPorId(id);

      res.json({
        success: true,
        data: cita
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /citas/paciente/:idPaciente
   * Obtener citas de un paciente
   */
  async obtenerPorPaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPaciente } = req.params;
      const filtros = {
        estado: req.query.estado as EstadoCita | undefined,
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const resultado = await citaService.obtenerPorPaciente(idPaciente, filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /citas/medico/:idMedico
   * Obtener citas de un médico
   */
  async obtenerPorMedico(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const filtros = {
        estado: req.query.estado as EstadoCita | undefined,
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const resultado = await citaService.obtenerPorMedico(idMedico, filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /citas/medico/:idMedico/hoy
   * Obtener citas del día para un médico
   */
  async obtenerCitasHoy(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const citas = await citaService.obtenerCitasHoy(idMedico);

      res.json({
        success: true,
        data: citas
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /citas/:id/confirmar
   * Confirmar cita
   */
  async confirmar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cita = await citaService.confirmar(id, req.body.notas);

      res.json({
        success: true,
        message: 'Cita confirmada exitosamente',
        data: cita
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /citas/:id/cancelar
   * Cancelar cita
   */
  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cita = await citaService.cancelar(
        id, 
        req.body, 
        req.user!.userId, 
        req.user!.rol
      );

      res.json({
        success: true,
        message: 'Cita cancelada exitosamente',
        data: cita
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /citas/:id/completar
   * Marcar cita como completada
   */
  async completar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cita = await citaService.completar(id);

      res.json({
        success: true,
        message: 'Cita completada exitosamente',
        data: cita
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /citas/:id/notas
   * Actualizar notas de la cita
   */
  async actualizarNotas(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const cita = await citaService.actualizarNotas(id, req.body);

      res.json({
        success: true,
        message: 'Notas actualizadas exitosamente',
        data: cita
      });
    } catch (error) {
      next(error);
    }
  }
}

export const citaController = new CitaController();
