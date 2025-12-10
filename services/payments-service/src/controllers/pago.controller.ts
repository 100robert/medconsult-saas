// ============================================
// CONTROLADOR DE PAGOS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { pagoService } from '../services/pago.service';
import { EstadoPago, MetodoPago } from '@prisma/client';

export class PagoController {

  /**
   * POST /pagos
   * Crear pago pendiente
   */
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const pago = await pagoService.crear(req.body);

      res.status(201).json({
        success: true,
        message: 'Pago creado exitosamente',
        data: pago
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pagos/:id
   * Obtener pago por ID
   */
  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pago = await pagoService.obtenerPorId(id);

      res.json({
        success: true,
        data: pago
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pagos/transaccion/:ref
   * Obtener pago por ID de transacción
   */
  async obtenerPorTransaccion(req: Request, res: Response, next: NextFunction) {
    try {
      const { ref } = req.params;
      const pago = await pagoService.obtenerPorTransaccion(ref);

      res.json({
        success: true,
        data: pago
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /pagos/:id/procesar
   * Procesar pago
   */
  async procesar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pago = await pagoService.procesar(id, req.body);

      res.json({
        success: true,
        message: 'Pago procesado exitosamente',
        data: pago
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /pagos/:id/reembolsar
   * Reembolsar pago
   */
  async reembolsar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pago = await pagoService.reembolsar(id, req.body);

      res.json({
        success: true,
        message: 'Reembolso procesado exitosamente',
        data: pago
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /pagos/:id/cancelar
   * Cancelar pago
   */
  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pago = await pagoService.cancelar(id, req.body.motivo);

      res.json({
        success: true,
        message: 'Pago cancelado',
        data: pago
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pagos/paciente/:idPaciente
   * Obtener pagos de un paciente
   */
  async obtenerPorPaciente(req: Request, res: Response, next: NextFunction) {
    try {
      const { idPaciente } = req.params;
      const filtros = {
        estado: req.query.estado as EstadoPago | undefined,
        metodoPago: req.query.metodo as MetodoPago | undefined,
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const resultado = await pagoService.obtenerPorPaciente(idPaciente, filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pagos/medico/:idMedico
   * Obtener pagos de un médico
   */
  async obtenerPorMedico(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const filtros = {
        estado: req.query.estado as EstadoPago | undefined,
        metodoPago: req.query.metodo as MetodoPago | undefined,
        fechaDesde: req.query.desde ? new Date(req.query.desde as string) : undefined,
        fechaHasta: req.query.hasta ? new Date(req.query.hasta as string) : undefined,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const resultado = await pagoService.obtenerPorMedico(idMedico, filtros);

      res.json({
        success: true,
        ...resultado
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pagos/resumen
   * Obtener resumen de pagos
   */
  async obtenerResumen(req: Request, res: Response, next: NextFunction) {
    try {
      const idMedico = req.query.medico as string | undefined;
      const fechaDesde = req.query.desde ? new Date(req.query.desde as string) : undefined;
      const fechaHasta = req.query.hasta ? new Date(req.query.hasta as string) : undefined;

      const resumen = await pagoService.obtenerResumen(idMedico, fechaDesde, fechaHasta);

      res.json({
        success: true,
        data: resumen
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pagos/admin/comisiones
   * Obtener resumen de comisiones de la plataforma (solo Admin)
   */
  async obtenerComisionesAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const fechaDesde = req.query.desde ? new Date(req.query.desde as string) : undefined;
      const fechaHasta = req.query.hasta ? new Date(req.query.hasta as string) : undefined;

      const resumen = await pagoService.obtenerResumenComisiones(fechaDesde, fechaHasta);

      res.json({
        success: true,
        data: resumen
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pagos/medico/ganancias/:idMedico
   * Obtener desglose de ganancias del médico
   */
  async obtenerGananciasMedico(req: Request, res: Response, next: NextFunction) {
    try {
      const { idMedico } = req.params;
      const fechaDesde = req.query.desde ? new Date(req.query.desde as string) : undefined;
      const fechaHasta = req.query.hasta ? new Date(req.query.hasta as string) : undefined;

      const ganancias = await pagoService.obtenerGananciasMedico(idMedico, fechaDesde, fechaHasta);

      res.json({
        success: true,
        data: ganancias
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /pagos/me/ganancias
   * Obtener ganancias del médico autenticado
   */
  async obtenerMisGanancias(req: Request, res: Response, next: NextFunction) {
    try {
      // El idMedico viene del token JWT
      const idMedico = (req as any).user?.medicoId;

      if (!idMedico) {
        return res.status(400).json({
          success: false,
          message: 'No se encontró información del médico'
        });
      }

      const fechaDesde = req.query.desde ? new Date(req.query.desde as string) : undefined;
      const fechaHasta = req.query.hasta ? new Date(req.query.hasta as string) : undefined;

      const ganancias = await pagoService.obtenerGananciasMedico(idMedico, fechaDesde, fechaHasta);

      return res.json({
        success: true,
        data: ganancias
      });
    } catch (error) {
      return next(error);
    }
  }
}

export const pagoController = new PagoController();
