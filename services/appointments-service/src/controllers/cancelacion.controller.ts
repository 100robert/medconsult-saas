// ============================================
// CONTROLADOR DE CANCELACIÓN DE CITAS
// ============================================

import { Request, Response, NextFunction } from 'express';
import { citaService } from '../services/cita.service';
import { cancelacionService } from '../services/cancelacion.service';

class CancelacionController {
    /**
     * PATCH /citas/:id/cancelar
     * Cancelar una cita y procesar reembolso automáticamente
     */
    async cancelarCita(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const { motivo } = req.body;
            const user = (req as any).user;
            const userRole = user?.rol;

            // Determinar quién cancela
            let canceladoPor: 'PACIENTE' | 'MEDICO' | 'SISTEMA' = 'PACIENTE';
            if (userRole === 'MEDICO') {
                canceladoPor = 'MEDICO';
            } else if (userRole === 'ADMIN') {
                canceladoPor = 'SISTEMA';
            }

            // Usar cancelacionService que SÍ procesa reembolsos
            const resultado = await cancelacionService.cancelarCita(
                id,
                canceladoPor,
                motivo || 'Cancelado por el usuario'
            );

            if (!resultado.exito) {
                res.status(400).json({
                    success: false,
                    message: resultado.mensaje
                });
                return;
            }

            res.json({
                success: true,
                message: 'Cita cancelada exitosamente',
                data: {
                    cita: resultado.cita,
                    reembolso: {
                        porcentaje: resultado.porcentajeReembolso,
                        monto: resultado.montoReembolso,
                        descripcion: resultado.mensaje
                    }
                }
            });
        } catch (error: any) {
            console.error('❌ Error al cancelar cita:', error.message);

            if (error.name === 'NotFoundError') {
                res.status(404).json({ success: false, message: error.message });
                return;
            }
            if (error.name === 'ValidationError') {
                res.status(400).json({ success: false, message: error.message });
                return;
            }
            if (error.name === 'ForbiddenError') {
                res.status(403).json({ success: false, message: error.message });
                return;
            }

            next(error);
        }
    }

    /**
     * GET /citas/:id/info-cancelacion
     * Obtener información de reembolso antes de cancelar
     */
    async obtenerInfoCancelacion(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            // Obtener la cita usando el servicio existente
            const cita = await citaService.obtenerPorId(id);

            if (!cita) {
                res.status(404).json({ success: false, message: 'Cita no encontrada' });
                return;
            }

            // Calcular reembolso
            const ahora = new Date();
            const fechaCita = new Date(cita.fechaHoraCita);
            const horasRestantes = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

            let porcentaje = 0;
            let descripcion = '';

            if (horasRestantes >= 24) {
                porcentaje = 95;
                descripcion = 'Reembolso completo (95% - menos 5% tarifa de procesamiento)';
            } else if (horasRestantes >= 2) {
                porcentaje = 50;
                descripcion = 'Reembolso parcial (50% - cancelación con menos de 24 horas)';
            } else {
                porcentaje = 0;
                descripcion = 'Sin reembolso (cancelación con menos de 2 horas de anticipación)';
            }

            res.json({
                success: true,
                data: {
                    porcentajeReembolso: porcentaje,
                    montoReembolso: 0,
                    descripcion: descripcion,
                    fechaCita: fechaCita,
                    horasRestantes: Math.max(0, horasRestantes)
                }
            });
        } catch (error: any) {
            console.error('❌ Error en obtenerInfoCancelacion:', error.message);
            res.status(500).json({
                success: false,
                message: error.message || 'Error al obtener información de cancelación'
            });
        }
    }

    /**
     * POST /citas/procesar-noshows
     * Ejecutar el procesamiento automático de no-shows (solo admin/sistema)
     */
    async procesarNoShows(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // TODO: Implementar procesamiento de no-shows
            res.json({
                success: true,
                message: 'Funcionalidad de no-shows pendiente de implementación',
                data: { citasProcesadas: 0, noShowsPaciente: 0, noShowsMedico: 0 }
            });
        } catch (error) {
            next(error);
        }
    }
}

export const cancelacionController = new CancelacionController();
