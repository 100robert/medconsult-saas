// ============================================
// CONTROLADOR DE CITAS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { citaService } from '../services/cita.service';
import { EstadoCita } from '@prisma/client';
import { prisma } from '../config/database';

export class CitaController {

  /**
   * POST /citas
   * Crear una nueva cita
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      // Obtener el ID del paciente basado en el usuario autenticado
      // El JWT puede tener 'userId' o 'id' dependiendo de cómo se generó
      const idUsuario = req.user?.userId;

      if (!idUsuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // Buscar el perfil de paciente del usuario
      const paciente = await prisma.paciente.findUnique({
        where: { idUsuario }
      });

      if (!paciente) {
        return res.status(404).json({
          success: false,
          message: 'Perfil de paciente no encontrado. Contacte al administrador.'
        });
      }

      // Construir fechaHoraCita desde fecha y horaInicio
      let fechaHoraCita: Date;
      if (req.body.fechaHoraCita) {
        fechaHoraCita = new Date(req.body.fechaHoraCita);
      } else if (req.body.fecha && req.body.horaInicio) {
        // Formato: "2025-12-05" + "09:00" -> "2025-12-05T09:00:00"
        fechaHoraCita = new Date(`${req.body.fecha}T${req.body.horaInicio}:00`);
      } else {
        return res.status(400).json({
          success: false,
          message: 'Se requiere fecha y hora de la cita'
        });
      }

      // Verificar si el usuario es Pro (simulación desde header del frontend)
      const headerValue = req.headers['x-medconsult-pro'];
      const isPro = headerValue === 'true';

      console.log('🔍 CREAR CITA - Header recibido:', headerValue);
      console.log('🔍 CREAR CITA - isPro calculado:', isPro);
      console.log('🔍 CREAR CITA - Paciente ID:', paciente.id);

      const cita = await citaService.crear({
        ...req.body,
        idPaciente: paciente.id,
        fechaHoraCita,
        isPro, // Pasar flag de Pro al servicio
      });

      return res.status(201).json({
        success: true,
        message: 'Cita creada exitosamente',
        data: cita
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /citas/mis-citas
   * Obtener citas del usuario autenticado
   */
  async obtenerMisCitas(req: Request, res: Response, next: NextFunction) {
    try {
      const idUsuario = req.user?.userId;
      const rol = req.user?.rol || 'PACIENTE'; // Default a PACIENTE si no viene

      console.log('📋 obtenerMisCitas - Usuario:', { idUsuario, rol, user: req.user });

      if (!idUsuario) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      const filtros = {
        estado: req.query.estado as EstadoCita | undefined,
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const resultado = await citaService.obtenerPorUsuario(idUsuario, rol!, filtros);

      return res.json({
        success: true,
        citas: resultado.citas,
        pagination: resultado.pagination
      });
    } catch (error) {
      return next(error);
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

      return res.json({
        success: true,
        data: cita
      });
    } catch (error) {
      return next(error);
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

      return res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      return next(error);
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

      return res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      return next(error);
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

      return res.json({
        success: true,
        data: citas
      });
    } catch (error) {
      return next(error);
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

      return res.json({
        success: true,
        message: 'Cita confirmada exitosamente',
        data: cita
      });
    } catch (error) {
      return next(error);
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

      return res.json({
        success: true,
        message: 'Cita cancelada exitosamente',
        data: cita
      });
    } catch (error) {
      return next(error);
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

      return res.json({
        success: true,
        message: 'Cita completada exitosamente',
        data: cita
      });
    } catch (error) {
      return next(error);
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

      return res.json({
        success: true,
        message: 'Notas actualizadas exitosamente',
        data: cita
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const citaController = new CitaController();
