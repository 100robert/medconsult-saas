// ============================================
// CONTROLADOR DE PACIENTES
// ============================================

import { Request, Response, NextFunction } from 'express';
import { pacienteService } from '../services/paciente.service';

export class PacienteController {

  /**
   * POST /pacientes
   * Crear perfil de paciente
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        idUsuario: req.user!.userId,
        ...req.body
      };

      const paciente = await pacienteService.crear(data);

      res.status(201).json({
        success: true,
        message: 'Perfil de paciente creado exitosamente',
        data: paciente
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pacientes/me
   * Obtener mi perfil de paciente
   */
  async obtenerMiPerfil(req: Request, res: Response, next: NextFunction) {
    try {
      const paciente = await pacienteService.obtenerPorUsuarioId(req.user!.userId);

      res.json({
        success: true,
        data: paciente
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pacientes/:id
   * Obtener paciente por ID
   */
  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const paciente = await pacienteService.obtenerPorId(id);

      res.json({
        success: true,
        data: paciente
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /pacientes/me
   * Actualizar mi perfil de paciente
   */
  async actualizarMiPerfil(req: Request, res: Response, next: NextFunction) {
    try {
      // Primero obtener el paciente por idUsuario
      const paciente = await pacienteService.obtenerPorUsuarioId(req.user!.userId);
      const actualizado = await pacienteService.actualizar(paciente.id, req.body);

      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente',
        data: actualizado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /pacientes/:id
   * Actualizar paciente por ID (admin)
   */
  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const actualizado = await pacienteService.actualizar(id, req.body);

      res.json({
        success: true,
        message: 'Paciente actualizado exitosamente',
        data: actualizado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pacientes
   * Listar todos los pacientes (admin)
   */
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const resultado = await pacienteService.listar(page, limit);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pacientes/me/historial
   * Obtener mi historial médico
   */
  async obtenerMiHistorial(req: Request, res: Response, next: NextFunction) {
    try {
      const paciente = await pacienteService.obtenerPorUsuarioId(req.user!.userId);
      const historial = await pacienteService.obtenerHistorial(paciente.id);

      res.json({
        success: true,
        data: historial
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /pacientes/me/pro
   * Activar suscripción Pro
   */
  async activarPro(req: Request, res: Response, next: NextFunction) {
    try {
      const paciente = await pacienteService.activarPro(req.user!.userId);

      res.json({
        success: true,
        message: '¡Bienvenido a MedConsult Pro!',
        data: {
          esPro: true,
          paciente
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pacientes/me/es-pro
   * Verificar si el paciente es Pro
   */
  async verificarPro(req: Request, res: Response, next: NextFunction) {
    try {
      const esPro = await pacienteService.esPro(req.user!.userId);

      res.json({
        success: true,
        data: { esPro }
      });
    } catch (error) {
      next(error);
    }
  }
}

export const pacienteController = new PacienteController();

