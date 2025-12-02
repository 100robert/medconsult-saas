// ============================================
// CONTROLADOR DE NOTIFICACIONES
// ============================================

import { Request, Response, NextFunction } from 'express';
import { notificacionService } from '../services/notificacion.service';
import { TipoNotificacion, EstadoNotificacion } from '@prisma/client';

class NotificacionController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const notificacion = await notificacionService.crear(req.body);
      res.status(201).json({ success: true, data: notificacion });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const notificacion = await notificacionService.obtenerPorId(req.params.id);
      res.json({ success: true, data: notificacion });
    } catch (error) {
      next(error);
    }
  }

  async listarPorUsuario(req: Request, res: Response, next: NextFunction) {
    try {
      const { idUsuario } = req.params;
      const filtros = {
        tipo: req.query.tipo as TipoNotificacion | undefined,
        estado: req.query.estado as EstadoNotificacion | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20
      };
      const resultado = await notificacionService.listarPorUsuario(idUsuario, filtros);
      res.json({ success: true, ...resultado });
    } catch (error) {
      next(error);
    }
  }

  async marcarEnviada(req: Request, res: Response, next: NextFunction) {
    try {
      const notificacion = await notificacionService.marcarEnviada(req.params.id);
      res.json({ success: true, data: notificacion });
    } catch (error) {
      next(error);
    }
  }

  async marcarFallida(req: Request, res: Response, next: NextFunction) {
    try {
      const notificacion = await notificacionService.marcarFallida(req.params.id);
      res.json({ success: true, data: notificacion });
    } catch (error) {
      next(error);
    }
  }

  async reintentarEnvio(req: Request, res: Response, next: NextFunction) {
    try {
      const notificacion = await notificacionService.reintentarEnvio(req.params.id);
      res.json({ success: true, data: notificacion });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPendientes(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const notificaciones = await notificacionService.obtenerPendientes(limit);
      res.json({ success: true, data: notificaciones });
    } catch (error) {
      next(error);
    }
  }

  async obtenerEstadisticas(req: Request, res: Response, next: NextFunction) {
    try {
      const idUsuario = req.query.idUsuario as string | undefined;
      const estadisticas = await notificacionService.obtenerEstadisticas(idUsuario);
      res.json({ success: true, data: estadisticas });
    } catch (error) {
      next(error);
    }
  }

  async enviarCorreo(req: Request, res: Response, next: NextFunction) {
    try {
      const notificacion = await notificacionService.enviarCorreo(req.params.id);
      res.json({ success: true, data: notificacion });
    } catch (error) {
      next(error);
    }
  }

  async enviarSMS(req: Request, res: Response, next: NextFunction) {
    try {
      const notificacion = await notificacionService.enviarSMS(req.params.id);
      res.json({ success: true, data: notificacion });
    } catch (error) {
      next(error);
    }
  }
}

export const notificacionController = new NotificacionController();
