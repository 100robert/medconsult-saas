// ============================================
// CONTROLADOR DE ESPECIALIDADES
// ============================================

import { Request, Response, NextFunction } from 'express';
import { especialidadService } from '../services/especialidad.service';

export class EspecialidadController {

  /**
   * POST /especialidades
   * Crear especialidad (admin)
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const especialidad = await especialidadService.crear(req.body);

      res.status(201).json({
        success: true,
        message: 'Especialidad creada exitosamente',
        data: especialidad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /especialidades
   * Listar todas las especialidades (público)
   */
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const soloActivas = req.query.todas !== 'true';
      const especialidades = await especialidadService.listar(soloActivas);

      res.json({
        success: true,
        data: especialidades
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /especialidades/buscar
   * Buscar especialidades por nombre (público)
   */
  async buscar(req: Request, res: Response, next: NextFunction) {
    try {
      const termino = req.query.q as string || '';
      const especialidades = await especialidadService.buscar(termino);

      res.json({
        success: true,
        data: especialidades
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /especialidades/:id
   * Obtener especialidad por ID (público)
   */
  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const especialidad = await especialidadService.obtenerPorId(id);

      res.json({
        success: true,
        data: especialidad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /especialidades/:id
   * Actualizar especialidad (admin)
   */
  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const especialidad = await especialidadService.actualizar(id, req.body);

      res.json({
        success: true,
        message: 'Especialidad actualizada exitosamente',
        data: especialidad
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /especialidades/:id
   * Desactivar especialidad (admin)
   */
  async desactivar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await especialidadService.desactivar(id);

      res.json({
        success: true,
        message: 'Especialidad desactivada exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /especialidades/sembrar
   * Sembrar especialidades iniciales (admin)
   */
  async sembrar(req: Request, res: Response, next: NextFunction) {
    try {
      const resultado = await especialidadService.sembrarEspecialidades();

      res.status(201).json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }
}

export const especialidadController = new EspecialidadController();
