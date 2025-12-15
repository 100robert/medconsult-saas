// ============================================
// CONTROLADOR DE NO-SHOWS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { noShowService } from '../services/noshow.service';

class NoShowController {
    /**
     * POST /citas/:id/registrar-conexion
     * Registrar que un usuario se conectó a la sala de videollamada
     */
    async registrarConexion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            const userId = user?.userId;
            const userRole = user?.rol;

            const tipoUsuario = userRole === 'MEDICO' ? 'MEDICO' : 'PACIENTE';

            const resultado = await noShowService.registrarConexion(id, tipoUsuario, userId);

            if (!resultado.exito) {
                res.status(400).json({
                    success: false,
                    message: resultado.mensaje
                });
                return;
            }

            res.json({
                success: true,
                message: resultado.mensaje,
                data: resultado.cita
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /citas/:id/reportar-noshow
     * Reportar que la otra parte no se presentó
     */
    async reportarNoShow(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = (req as any).user;
            const userId = user?.userId;
            const userRole = user?.rol;

            const resultado = await noShowService.reportarNoShow(id, userId, userRole);

            if (!resultado.exito) {
                res.status(400).json({
                    success: false,
                    message: resultado.mensaje
                });
                return;
            }

            res.json({
                success: true,
                message: resultado.mensaje,
                data: resultado.cita
            });
        } catch (error: any) {
            console.error('❌ Error al reportar no-show:', error.message);
            next(error);
        }
    }

    /**
     * POST /citas/procesar-noshows
     * Ejecutar procesamiento automático de no-shows (solo admin)
     */
    async procesarNoShows(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const resultado = await noShowService.procesarNoShows();

            res.json({
                success: true,
                message: `Se procesaron ${resultado.citasProcesadas} citas`,
                data: resultado
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /citas/:id/estado-conexion
     * Obtener el estado de conexión de una cita
     */
    async obtenerEstadoConexion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            const estado = await noShowService.obtenerEstadoConexion(id);

            res.json({
                success: true,
                data: estado
            });
        } catch (error: any) {
            if (error.message === 'Cita no encontrada') {
                res.status(404).json({
                    success: false,
                    message: 'Cita no encontrada'
                });
                return;
            }
            next(error);
        }
    }
}

export const noShowController = new NoShowController();
