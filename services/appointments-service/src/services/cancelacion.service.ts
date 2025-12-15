// ============================================
// SERVICIO DE CANCELACIÓN DE CITAS
// ============================================

import { prisma } from '../config/database';
import { EstadoCita, EstadoPago, CanceladaPor } from '.prisma/client';

interface ResultadoCancelacion {
    exito: boolean;
    mensaje: string;
    porcentajeReembolso: number;
    montoReembolso: number;
    cita?: any;
}

interface ResultadoNoShow {
    citasProcesadas: number;
    noShowsPaciente: number;
    noShowsMedico: number;
}

class CancelacionService {
    /**
     * Calcula el porcentaje de reembolso según el tiempo restante antes de la cita
     * 
     * Reglas:
     * - > 24 horas: 95% (100% menos 5% tarifa de procesamiento)
     * - 2-24 horas: 50%
     * - < 2 horas: 0%
     */
    calcularReembolso(fechaCita: Date): { porcentaje: number; descripcion: string } {
        const ahora = new Date();
        const horasRestantes = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

        console.log('🔍 CÁLCULO REEMBOLSO:');
        console.log('   - Fecha cita:', fechaCita);
        console.log('   - Fecha ahora:', ahora);
        console.log('   - Horas restantes:', horasRestantes);

        if (horasRestantes >= 24) {
            console.log('   - Resultado: 95% (más de 24h)');
            return {
                porcentaje: 95,
                descripcion: 'Reembolso completo (95% - menos 5% tarifa de procesamiento)'
            };
        } else if (horasRestantes >= 2) {
            console.log('   - Resultado: 50% (entre 2-24h)');
            return {
                porcentaje: 50,
                descripcion: 'Reembolso parcial (50% - cancelación con menos de 24 horas)'
            };
        } else {
            console.log('   - Resultado: 0% (menos de 2h)');
            return {
                porcentaje: 0,
                descripcion: 'Sin reembolso (cancelación con menos de 2 horas de anticipación)'
            };
        }
    }

    /**
     * Cancela una cita y procesa el reembolso correspondiente
     */
    async cancelarCita(
        idCita: string,
        canceladoPor: 'PACIENTE' | 'MEDICO' | 'SISTEMA',
        motivo?: string
    ): Promise<ResultadoCancelacion> {
        // 1. Obtener la cita con su pago
        const cita = await prisma.cita.findUnique({
            where: { id: idCita },
            include: {
                pago: true,
                medico: { include: { usuario: true } },
                paciente: { include: { usuario: true } }
            }
        });

        if (!cita) {
            return {
                exito: false,
                mensaje: 'Cita no encontrada',
                porcentajeReembolso: 0,
                montoReembolso: 0
            };
        }

        // 2. Verificar que la cita pueda ser cancelada
        if (cita.estado === EstadoCita.CANCELADA ||
            cita.estado === EstadoCita.COMPLETADA ||
            cita.estado === EstadoCita.NO_SHOW_PACIENTE ||
            cita.estado === EstadoCita.NO_SHOW_MEDICO) {
            return {
                exito: false,
                mensaje: `La cita no puede ser cancelada porque ya está en estado: ${cita.estado}`,
                porcentajeReembolso: 0,
                montoReembolso: 0
            };
        }

        // 3. Calcular el reembolso
        const { porcentaje, descripcion } = this.calcularReembolso(cita.fechaHoraCita);
        let montoReembolso = 0;

        // 4. Actualizar la cita
        const citaActualizada = await prisma.cita.update({
            where: { id: idCita },
            data: {
                estado: EstadoCita.CANCELADA,
                razonCancelacion: motivo || descripcion,
                fechaCancelacion: new Date(),
                canceladaPor: canceladoPor as CanceladaPor
            },
            include: {
                pago: true,
                medico: { include: { usuario: true } },
                paciente: { include: { usuario: true } }
            }
        });

        // 5. Procesar el reembolso si hay pago
        if (cita.pago) {
            montoReembolso = Number(cita.pago.monto) * (porcentaje / 100);

            await prisma.pago.update({
                where: { id: cita.pago.id },
                data: {
                    estado: porcentaje > 0 ? EstadoPago.REEMBOLSADO : EstadoPago.COMPLETADO,
                    montoReembolsado: montoReembolso,
                    porcentajeReembolso: porcentaje,
                    razonReembolso: `${canceladoPor}: ${motivo || descripcion}`
                }
            });
        }

        return {
            exito: true,
            mensaje: descripcion,
            porcentajeReembolso: porcentaje,
            montoReembolso: montoReembolso,
            cita: citaActualizada
        };
    }

    /**
     * Obtiene información de reembolso para una cita (sin cancelarla)
     * Útil para mostrar al usuario antes de confirmar la cancelación
     */
    async obtenerInfoReembolso(idCita: string) {
        console.log('🔍 obtenerInfoReembolso - Buscando cita:', idCita);

        try {
            const cita = await prisma.cita.findUnique({
                where: { id: idCita },
                include: { pago: true }
            });

            console.log('🔍 Cita encontrada:', cita ? 'SÍ' : 'NO');

            if (!cita) {
                throw new Error('Cita no encontrada');
            }

            console.log('🔍 Fecha de cita:', cita.fechaHoraCita);

            const { porcentaje, descripcion } = this.calcularReembolso(cita.fechaHoraCita);
            const montoReembolso = cita.pago ? Number(cita.pago.monto) * (porcentaje / 100) : 0;

            const resultado = {
                porcentajeReembolso: porcentaje,
                montoReembolso: montoReembolso,
                descripcion: descripcion,
                fechaCita: cita.fechaHoraCita,
                horasRestantes: Math.max(0, (cita.fechaHoraCita.getTime() - new Date().getTime()) / (1000 * 60 * 60))
            };

            console.log('🔍 Resultado del cálculo:', resultado);
            return resultado;
        } catch (error: any) {
            console.error('❌ Error en obtenerInfoReembolso:', error.message);
            console.error('❌ Stack:', error.stack);
            throw error;
        }
    }

    /**
     * Procesa automáticamente los no-shows
     * Busca citas que pasaron hace más de 15 minutos sin iniciar consulta
     */
    async procesarNoShows(): Promise<ResultadoNoShow> {
        const ahora = new Date();
        const hace15Min = new Date(ahora.getTime() - 15 * 60 * 1000);

        // Buscar citas confirmadas que pasaron hace más de 15 minutos
        const citasPasadas = await prisma.cita.findMany({
            where: {
                estado: EstadoCita.CONFIRMADA,
                fechaHoraCita: { lt: hace15Min },
                consulta: null // Sin consulta iniciada
            },
            include: {
                pago: true,
                medico: true,
                paciente: true
            }
        });

        let noShowsPaciente = 0;
        let noShowsMedico = 0;

        for (const cita of citasPasadas) {
            // Por defecto, asumimos que el paciente no se presentó
            // En un sistema real, verificaríamos logs de conexión
            const estadoNoShow = EstadoCita.NO_SHOW_PACIENTE;

            // Actualizar la cita
            await prisma.cita.update({
                where: { id: cita.id },
                data: {
                    estado: estadoNoShow,
                    razonCancelacion: 'No show automático - 15 minutos sin conexión'
                }
            });

            // Si es no-show del paciente, el médico cobra completo
            if (estadoNoShow === EstadoCita.NO_SHOW_PACIENTE) {
                noShowsPaciente++;

                if (cita.pago) {
                    await prisma.pago.update({
                        where: { id: cita.pago.id },
                        data: {
                            estado: EstadoPago.COMPLETADO,
                            porcentajeReembolso: 0,
                            razonReembolso: 'No show del paciente - sin reembolso'
                        }
                    });
                }
            } else {
                // No-show del médico: reembolso completo al paciente
                noShowsMedico++;

                if (cita.pago) {
                    await prisma.pago.update({
                        where: { id: cita.pago.id },
                        data: {
                            estado: EstadoPago.REEMBOLSADO,
                            montoReembolsado: cita.pago.monto,
                            porcentajeReembolso: 100,
                            razonReembolso: 'No show del médico - reembolso completo'
                        }
                    });
                }
            }
        }

        return {
            citasProcesadas: citasPasadas.length,
            noShowsPaciente,
            noShowsMedico
        };
    }
}

export const cancelacionService = new CancelacionService();
