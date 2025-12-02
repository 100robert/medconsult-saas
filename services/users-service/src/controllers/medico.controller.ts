// ============================================
// CONTROLADOR DE MÉDICOS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { medicoService } from '../services/medico.service';
import { EstadoMedico } from '@prisma/client';

export class MedicoController {

  /**
   * POST /medicos
   * Crear perfil de médico
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = {
        idUsuario: req.user!.userId,
        ...req.body
      };

      const medico = await medicoService.crear(data);

      res.status(201).json({
        success: true,
        message: 'Perfil de médico creado exitosamente. Pendiente de verificación.',
        data: medico
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /medicos/me
   * Obtener mi perfil de médico
   */
  async obtenerMiPerfil(req: Request, res: Response, next: NextFunction) {
    try {
      const medico = await medicoService.obtenerPorUsuarioId(req.user!.userId);

      res.json({
        success: true,
        data: medico
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /medicos/:id
   * Obtener médico por ID (público)
   */
  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const medico = await medicoService.obtenerPorId(id);

      res.json({
        success: true,
        data: medico
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /medicos/me
   * Actualizar mi perfil de médico
   */
  async actualizarMiPerfil(req: Request, res: Response, next: NextFunction) {
    try {
      const medico = await medicoService.obtenerPorUsuarioId(req.user!.userId);
      const actualizado = await medicoService.actualizar(medico.id, req.body);

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
   * PUT /medicos/:id
   * Actualizar médico por ID (admin)
   */
  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const actualizado = await medicoService.actualizar(id, req.body);

      res.json({
        success: true,
        message: 'Médico actualizado exitosamente',
        data: actualizado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /medicos/:id/verificar
   * Verificar/cambiar estado de médico (admin)
   */
  async verificar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { estado } = req.body as { estado: EstadoMedico };

      const medico = await medicoService.verificar(id, estado);

      res.json({
        success: true,
        message: `Médico ${estado.toLowerCase()} exitosamente`,
        data: medico
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /medicos/buscar
   * Buscar médicos con filtros (público)
   */
  async buscar(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        especialidad: req.query.especialidad as string,
        ciudad: req.query.ciudad as string,
        pais: req.query.pais as string,
        calificacionMinima: req.query.calificacionMinima 
          ? parseFloat(req.query.calificacionMinima as string) 
          : undefined,
        precioMinimo: req.query.precioMinimo 
          ? parseFloat(req.query.precioMinimo as string) 
          : undefined,
        precioMaximo: req.query.precioMaximo 
          ? parseFloat(req.query.precioMaximo as string) 
          : undefined,
        idioma: req.query.idioma as string,
        aceptaNuevosPacientes: req.query.aceptaNuevosPacientes !== 'false',
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        ordenarPor: (req.query.ordenarPor as 'calificacion' | 'precio' | 'experiencia') || 'calificacion',
        orden: (req.query.orden as 'asc' | 'desc') || 'desc',
      };

      const resultado = await medicoService.buscar(query);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /medicos
   * Listar todos los médicos (admin)
   */
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const estado = req.query.estado as EstadoMedico | undefined;

      const resultado = await medicoService.listar(page, limit, estado);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

export const medicoController = new MedicoController();
