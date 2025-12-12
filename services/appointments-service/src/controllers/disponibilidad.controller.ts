// ============================================
// CONTROLADOR DE DISPONIBILIDAD
// ============================================

import { Request, Response, NextFunction } from 'express';
import { disponibilidadService } from '../services/disponibilidad.service';

export class DisponibilidadController {

  /**
   * POST /disponibilidades
   * Crear horario de disponibilidad
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      // Obtener el ID del médico desde el usuario autenticado
      const disponibilidad = await disponibilidadService.crear({
        idMedico: req.body.idMedico,
        ...req.body
      });

      res.status(201).json({
        success: true,
        message: 'Horario de disponibilidad creado exitosamente',
        data: disponibilidad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /disponibilidades/multiples
   * Crear múltiples horarios de disponibilidad
   */
  async crearMultiples(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico, horarios, reemplazarExistentes } = req.body;

      let creados;

      if (reemplazarExistentes) {
        // Reemplazar todos los horarios existentes
        creados = await disponibilidadService.reemplazarHorarios(idMedico, horarios || []);
      } else {
        // Solo agregar nuevos (comportamiento anterior)
        creados = await disponibilidadService.crearMultiples(idMedico, horarios || []);
      }

      res.status(201).json({
        success: true,
        message: reemplazarExistentes
          ? `Se actualizó el horario con ${creados.length} bloques de disponibilidad`
          : `Se crearon ${creados.length} horarios de disponibilidad`,
        data: creados
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /disponibilidades/me
   * Obtener MIS disponibilidades (para el médico autenticado)
   */
  async obtenerMiDisponibilidad(req: Request, res: Response, next: NextFunction) {
    try {
      // Obtener el medicoId del usuario autenticado
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no autenticado'
        });
      }

      // El medicoId puede venir directamente del token o necesitamos buscarlo
      let medicoId = user.medicoId;

      // Si no viene en el token, buscar por userId
      if (!medicoId && user.userId) {
        const { prisma } = await import('../config/database');
        const medico = await prisma.medico.findFirst({
          where: { idUsuario: user.userId },
          select: { id: true }
        });

        if (medico) {
          medicoId = medico.id;
        }
      }

      if (!medicoId) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró el perfil de médico para este usuario'
        });
      }

      const disponibilidades = await disponibilidadService.obtenerPorMedico(medicoId, false);

      return res.json({
        success: true,
        data: {
          disponibilidades
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  /**
   * GET /disponibilidades/medico/:idMedico
   * Obtener disponibilidades de un médico
   */
  async obtenerPorMedico(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const soloActivos = req.query.todos !== 'true';

      const disponibilidades = await disponibilidadService.obtenerPorMedico(idMedico, soloActivos);

      res.json({
        success: true,
        data: disponibilidades
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /disponibilidades/medico/:idMedico/slots
   * Obtener slots disponibles para agendar cita
   */
  async obtenerSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const fechaDesde = req.query.desde
        ? new Date(req.query.desde as string)
        : new Date();
      const fechaHasta = req.query.hasta
        ? new Date(req.query.hasta as string)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 días por defecto
      const duracion = parseInt(req.query.duracion as string) || 30;

      const slots = await disponibilidadService.obtenerSlotsDisponibles(
        idMedico,
        fechaDesde,
        fechaHasta,
        duracion
      );

      res.json({
        success: true,
        data: slots
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /disponibilidades/:id
   * Actualizar disponibilidad
   */
  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const disponibilidad = await disponibilidadService.actualizar(id, req.body);

      res.json({
        success: true,
        message: 'Disponibilidad actualizada exitosamente',
        data: disponibilidad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /disponibilidades/:id
   * Eliminar disponibilidad
   */
  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await disponibilidadService.eliminar(id);

      res.json({
        success: true,
        message: 'Disponibilidad eliminada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /disponibilidades/fechas-no-disponibles
   * Agregar fecha no disponible
   */
  async agregarFechaNoDisponible(req: Request, res: Response, next: NextFunction) {
    try {
      const fecha = await disponibilidadService.agregarFechaNoDisponible({
        idMedico: req.body.idMedico,
        fecha: new Date(req.body.fecha),
        motivo: req.body.motivo,
      });

      res.status(201).json({
        success: true,
        message: 'Fecha no disponible agregada',
        data: fecha
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /disponibilidades/medico/:idMedico/fechas-no-disponibles
   * Obtener fechas no disponibles
   */
  async obtenerFechasNoDisponibles(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const desde = req.query.desde ? new Date(req.query.desde as string) : undefined;

      const fechas = await disponibilidadService.obtenerFechasNoDisponibles(idMedico, desde);

      res.json({
        success: true,
        data: fechas
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /disponibilidades/fechas-no-disponibles/:id
   * Eliminar fecha no disponible
   */
  async eliminarFechaNoDisponible(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await disponibilidadService.eliminarFechaNoDisponible(id);

      res.json({
        success: true,
        message: 'Fecha no disponible eliminada'
      });
    } catch (error) {
      next(error);
    }
  }
}

export const disponibilidadController = new DisponibilidadController();
