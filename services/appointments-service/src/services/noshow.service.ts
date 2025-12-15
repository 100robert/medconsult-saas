// ============================================
// SERVICIO DE NO-SHOWS
// Detección y gestión de citas no atendidas
// ============================================

import { prisma } from '../config/database';
import { EstadoCita, CanceladaPor } from '.prisma/client';

interface ResultadoNoShow {
    exito: boolean;
    mensaje: string;
    cita?: any;
}

interface ResultadoProcesamiento {
    citasProcesadas: number;
    noShowsPaciente: number;
    noShowsMedico: number;
    noShowsAmbos: number;
}

class NoShowService {
    // Tiempo de gracia después de la hora de la cita (15 minutos)
    private readonly TIEMPO_GRACIA_MINUTOS = 15;

    /**
     * Registrar que un usuario se conectó a la sala de videollamada
     */
    async registrarConexion(
        idCita: string,
        tipoUsuario: 'MEDICO' | 'PACIENTE',
        userId: string
    ): Promise<ResultadoNoShow> {
        const cita = await prisma.cita.findUnique({
            where: { id: idCita },
            include: {
                medico: { select: { idUsuario: true } },
                paciente: { select: { idUsuario: true } }
            }
        });

        if (!cita) {
            return { exito: false, mensaje: 'Cita no encontrada' };
        }

        // Verificar que el usuario es parte de esta cita
        const esMedico = cita.medico.idUsuario === userId;
        const esPaciente = cita.paciente.idUsuario === userId;

        if (!esMedico && !esPaciente) {
            return { exito: false, mensaje: 'No tienes permiso para esta cita' };
        }

        // Actualizar el estado de conexión
        const updateData: any = {};
        if (esMedico || tipoUsuario === 'MEDICO') {
            updateData.medicoConectado = true;
            updateData.horaConexionMedico = new Date();
        }
        if (esPaciente || tipoUsuario === 'PACIENTE') {
            updateData.pacienteConectado = true;
            updateData.horaConexionPaciente = new Date();
        }

        const citaActualizada = await prisma.cita.update({
            where: { id: idCita },
            data: updateData
        });

        console.log(`📡 [NoShow] Conexión registrada - Cita: ${idCita}, Usuario: ${tipoUsuario}`);

        return {
            exito: true,
            mensaje: 'Conexión registrada exitosamente',
            cita: citaActualizada
        };
    }

    /**
     * Reportar que la otra parte no se presentó
     * Solo puede reportar quien SÍ se conectó
     */
    async reportarNoShow(
        idCita: string,
        userId: string,
        userRole: string
    ): Promise<ResultadoNoShow> {
        const cita = await prisma.cita.findUnique({
            where: { id: idCita },
            include: {
                medico: { select: { idUsuario: true, usuario: { select: { nombre: true } } } },
                paciente: { select: { idUsuario: true, usuario: { select: { nombre: true } } } }
            }
        });

        if (!cita) {
            return { exito: false, mensaje: 'Cita no encontrada' };
        }

        // Verificar que la cita está en estado válido para reportar no-show
        if (cita.estado !== 'PROGRAMADA' && cita.estado !== 'CONFIRMADA') {
            return { exito: false, mensaje: 'La cita no está en un estado válido para reportar no-show' };
        }

        // Verificar que ha pasado el tiempo de gracia
        const ahora = new Date();
        const fechaCita = new Date(cita.fechaHoraCita);
        const minutosTranscurridos = (ahora.getTime() - fechaCita.getTime()) / (1000 * 60);

        if (minutosTranscurridos < this.TIEMPO_GRACIA_MINUTOS) {
            return {
                exito: false,
                mensaje: `Debes esperar ${Math.ceil(this.TIEMPO_GRACIA_MINUTOS - minutosTranscurridos)} minutos más antes de reportar no-show`
            };
        }

        // Determinar quién está reportando
        const esMedico = cita.medico.idUsuario === userId;
        const esPaciente = cita.paciente.idUsuario === userId;

        if (!esMedico && !esPaciente && userRole !== 'ADMIN') {
            return { exito: false, mensaje: 'No tienes permiso para esta acción' };
        }

        // Verificar que quien reporta SÍ se conectó
        if (esMedico && !cita.medicoConectado) {
            return { exito: false, mensaje: 'No puedes reportar no-show sin haberte conectado a la sala' };
        }
        if (esPaciente && !cita.pacienteConectado) {
            return { exito: false, mensaje: 'No puedes reportar no-show sin haberte conectado a la sala' };
        }

        // Determinar el estado y quién reporta
        let nuevoEstado: EstadoCita;
        let reportadoPor: CanceladaPor;

        if (esMedico) {
            // El médico reporta que el paciente no se presentó
            if (cita.pacienteConectado) {
                return { exito: false, mensaje: 'El paciente sí se conectó a la sala' };
            }
            nuevoEstado = 'NO_SHOW_PACIENTE' as EstadoCita;
            reportadoPor = 'MEDICO';
        } else if (esPaciente) {
            // El paciente reporta que el médico no se presentó
            if (cita.medicoConectado) {
                return { exito: false, mensaje: 'El médico sí se conectó a la sala' };
            }
            nuevoEstado = 'NO_SHOW_MEDICO' as EstadoCita;
            reportadoPor = 'PACIENTE';
        } else {
            // Admin puede reportar según la evidencia
            if (!cita.medicoConectado && !cita.pacienteConectado) {
                nuevoEstado = 'NO_SHOW_PACIENTE' as EstadoCita; // Default
            } else if (!cita.pacienteConectado) {
                nuevoEstado = 'NO_SHOW_PACIENTE' as EstadoCita;
            } else {
                nuevoEstado = 'NO_SHOW_MEDICO' as EstadoCita;
            }
            reportadoPor = 'SISTEMA';
        }

        const citaActualizada = await prisma.cita.update({
            where: { id: idCita },
            data: {
                estado: nuevoEstado,
                reportadoPor: reportadoPor,
                noShowProcesado: true
            }
        });

        console.log(`⚠️ [NoShow] Reportado - Cita: ${idCita}, Estado: ${nuevoEstado}, Por: ${reportadoPor}`);

        return {
            exito: true,
            mensaje: `No-show reportado exitosamente. La cita ha sido marcada como ${nuevoEstado}`,
            cita: citaActualizada
        };
    }

    /**
     * Procesar automáticamente las citas no atendidas
     * Ejecutar como cron job o manualmente por admin
     */
    async procesarNoShows(): Promise<ResultadoProcesamiento> {
        const ahora = new Date();
        const tiempoGracia = new Date(ahora.getTime() - this.TIEMPO_GRACIA_MINUTOS * 60 * 1000);

        // Buscar citas que:
        // 1. Ya pasó su hora + tiempo de gracia
        // 2. Estado es PROGRAMADA o CONFIRMADA
        // 3. No se ha procesado el no-show aún
        // 4. No tienen consulta asociada
        const citasSinAtender = await prisma.cita.findMany({
            where: {
                fechaHoraCita: { lt: tiempoGracia },
                estado: { in: ['PROGRAMADA', 'CONFIRMADA'] },
                noShowProcesado: false,
                consulta: null
            },
            include: {
                medico: { select: { idUsuario: true } },
                paciente: { select: { idUsuario: true } }
            }
        });

        let noShowsPaciente = 0;
        let noShowsMedico = 0;
        let noShowsAmbos = 0;

        for (const cita of citasSinAtender) {
            let nuevoEstado: EstadoCita;

            if (!cita.medicoConectado && !cita.pacienteConectado) {
                // Ninguno se conectó - marcar como no-show de paciente por defecto
                // (el médico puede disputar esto)
                nuevoEstado = 'NO_SHOW_PACIENTE' as EstadoCita;
                noShowsAmbos++;
            } else if (!cita.pacienteConectado) {
                nuevoEstado = 'NO_SHOW_PACIENTE' as EstadoCita;
                noShowsPaciente++;
            } else if (!cita.medicoConectado) {
                nuevoEstado = 'NO_SHOW_MEDICO' as EstadoCita;
                noShowsMedico++;
            } else {
                // Ambos se conectaron pero no hay consulta
                // Esto es raro, dejamos como está para revisión manual
                continue;
            }

            await prisma.cita.update({
                where: { id: cita.id },
                data: {
                    estado: nuevoEstado,
                    reportadoPor: 'SISTEMA',
                    noShowProcesado: true
                }
            });

            console.log(`🔄 [NoShow Auto] Cita ${cita.id} marcada como ${nuevoEstado}`);
        }

        const resultado: ResultadoProcesamiento = {
            citasProcesadas: citasSinAtender.length,
            noShowsPaciente,
            noShowsMedico,
            noShowsAmbos
        };

        console.log(`📊 [NoShow] Procesamiento completado:`, resultado);

        return resultado;
    }

    /**
     * Obtener el estado de conexión de una cita
     */
    async obtenerEstadoConexion(idCita: string): Promise<any> {
        const cita = await prisma.cita.findUnique({
            where: { id: idCita },
            select: {
                id: true,
                medicoConectado: true,
                pacienteConectado: true,
                horaConexionMedico: true,
                horaConexionPaciente: true,
                reportadoPor: true,
                noShowProcesado: true,
                estado: true,
                fechaHoraCita: true
            }
        });

        if (!cita) {
            throw new Error('Cita no encontrada');
        }

        // Calcular si ya pasó el tiempo de gracia
        const ahora = new Date();
        const fechaCita = new Date(cita.fechaHoraCita);
        const minutosTranscurridos = (ahora.getTime() - fechaCita.getTime()) / (1000 * 60);
        const puedeReportarNoShow = minutosTranscurridos >= this.TIEMPO_GRACIA_MINUTOS;

        return {
            ...cita,
            puedeReportarNoShow,
            minutosTranscurridos: Math.floor(minutosTranscurridos),
            minutosRestantesParaReportar: Math.max(0, Math.ceil(this.TIEMPO_GRACIA_MINUTOS - minutosTranscurridos))
        };
    }
}

export const noShowService = new NoShowService();
