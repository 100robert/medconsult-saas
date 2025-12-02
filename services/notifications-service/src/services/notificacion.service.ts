// ============================================
// SERVICIO DE NOTIFICACIONES
// ============================================

import { prisma } from '../config/database';
import { TipoNotificacion, EstadoNotificacion } from '@prisma/client';
import { 
  CreateNotificacionDTO,
  NotificacionFilters,
  NotFoundError
} from '../types';

export class NotificacionService {
  
  /**
   * Crear notificación
   */
  async crear(data: CreateNotificacionDTO) {
    const notificacion = await prisma.notificacion.create({
      data: {
        idUsuario: data.idUsuario,
        tipo: data.tipo,
        asunto: data.asunto,
        mensaje: data.mensaje,
        destinatario: data.destinatario,
        estado: EstadoNotificacion.PENDIENTE
      },
      include: {
        usuario: { select: { correo: true, nombre: true, apellido: true } }
      }
    });

    return notificacion;
  }

  /**
   * Obtener notificación por ID
   */
  async obtenerPorId(id: string) {
    const notificacion = await prisma.notificacion.findUnique({
      where: { id },
      include: {
        usuario: { select: { correo: true, nombre: true, apellido: true } }
      }
    });

    if (!notificacion) {
      throw new NotFoundError('Notificación no encontrada');
    }

    return notificacion;
  }

  /**
   * Listar notificaciones de un usuario
   */
  async listarPorUsuario(idUsuario: string, filtros: NotificacionFilters = {}) {
    const { tipo, estado, page = 1, limit = 20 } = filtros;

    const where: any = { idUsuario };
    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;

    const [notificaciones, total] = await Promise.all([
      prisma.notificacion.findMany({
        where,
        orderBy: { fechaCreacion: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.notificacion.count({ where })
    ]);

    return {
      data: notificaciones,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  /**
   * Marcar notificación como enviada
   */
  async marcarEnviada(id: string) {
    const notificacion = await prisma.notificacion.findUnique({ where: { id } });
    if (!notificacion) throw new NotFoundError('Notificación no encontrada');

    return prisma.notificacion.update({
      where: { id },
      data: {
        estado: EstadoNotificacion.ENVIADA,
        fechaEnvio: new Date()
      }
    });
  }

  /**
   * Marcar notificación como fallida
   */
  async marcarFallida(id: string) {
    const notificacion = await prisma.notificacion.findUnique({ where: { id } });
    if (!notificacion) throw new NotFoundError('Notificación no encontrada');

    return prisma.notificacion.update({
      where: { id },
      data: {
        estado: EstadoNotificacion.FALLIDA,
        intentosReenvio: { increment: 1 }
      }
    });
  }

  /**
   * Reintentar envío de notificación fallida
   */
  async reintentarEnvio(id: string) {
    const notificacion = await prisma.notificacion.findUnique({ where: { id } });
    if (!notificacion) throw new NotFoundError('Notificación no encontrada');

    if (notificacion.estado !== EstadoNotificacion.FALLIDA) {
      throw new Error('Solo se pueden reintentar notificaciones fallidas');
    }

    return prisma.notificacion.update({
      where: { id },
      data: {
        estado: EstadoNotificacion.PENDIENTE,
        intentosReenvio: { increment: 1 }
      }
    });
  }

  /**
   * Obtener notificaciones pendientes para envío
   */
  async obtenerPendientes(limit = 100) {
    return prisma.notificacion.findMany({
      where: { estado: EstadoNotificacion.PENDIENTE },
      orderBy: { fechaCreacion: 'asc' },
      take: limit,
      include: {
        usuario: { select: { correo: true, telefono: true } }
      }
    });
  }

  /**
   * Obtener estadísticas de notificaciones
   */
  async obtenerEstadisticas(idUsuario?: string) {
    const whereBase: any = idUsuario ? { idUsuario } : {};

    const [total, pendientes, enviadas, fallidas] = await Promise.all([
      prisma.notificacion.count({ where: whereBase }),
      prisma.notificacion.count({ where: { ...whereBase, estado: EstadoNotificacion.PENDIENTE } }),
      prisma.notificacion.count({ where: { ...whereBase, estado: EstadoNotificacion.ENVIADA } }),
      prisma.notificacion.count({ where: { ...whereBase, estado: EstadoNotificacion.FALLIDA } })
    ]);

    const porTipo = await prisma.notificacion.groupBy({
      by: ['tipo'],
      where: whereBase,
      _count: { id: true }
    });

    return {
      total,
      pendientes,
      enviadas,
      fallidas,
      porTipo: porTipo.map(t => ({ tipo: t.tipo, cantidad: t._count.id }))
    };
  }

  /**
   * Eliminar notificaciones antiguas
   */
  async limpiarAntiguos(diasAntiguedad = 30) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasAntiguedad);

    const result = await prisma.notificacion.deleteMany({
      where: {
        fechaCreacion: { lt: fechaLimite },
        estado: EstadoNotificacion.ENVIADA
      }
    });

    return { eliminadas: result.count };
  }

  /**
   * Enviar notificación por correo (simulado)
   */
  async enviarCorreo(id: string) {
    const notificacion = await this.obtenerPorId(id);
    
    if (notificacion.tipo !== TipoNotificacion.CORREO) {
      throw new Error('La notificación no es de tipo CORREO');
    }

    // TODO: Implementar envío real con servicio de email
    console.log(`📧 Enviando correo a ${notificacion.destinatario || notificacion.usuario.correo}`);
    console.log(`   Asunto: ${notificacion.asunto}`);
    console.log(`   Mensaje: ${notificacion.mensaje}`);

    return this.marcarEnviada(id);
  }

  /**
   * Enviar notificación por SMS (simulado)
   */
  async enviarSMS(id: string) {
    const notificacion = await this.obtenerPorId(id);
    
    if (notificacion.tipo !== TipoNotificacion.SMS) {
      throw new Error('La notificación no es de tipo SMS');
    }

    // TODO: Implementar envío real con Twilio o similar
    console.log(`📱 Enviando SMS a ${notificacion.destinatario}`);
    console.log(`   Mensaje: ${notificacion.mensaje}`);

    return this.marcarEnviada(id);
  }

  /**
   * Crear notificación de cita programada
   */
  async notificarCitaProgramada(idUsuario: string, datosCita: { medico: string; fecha: string; hora: string }) {
    return this.crear({
      idUsuario,
      tipo: TipoNotificacion.EN_APP,
      asunto: 'Cita Programada',
      mensaje: `Tu cita con ${datosCita.medico} ha sido programada para el ${datosCita.fecha} a las ${datosCita.hora}.`
    });
  }

  /**
   * Crear notificación de cita confirmada
   */
  async notificarCitaConfirmada(idUsuario: string, datosCita: { medico: string; fecha: string; hora: string }) {
    return this.crear({
      idUsuario,
      tipo: TipoNotificacion.EN_APP,
      asunto: 'Cita Confirmada',
      mensaje: `Tu cita con ${datosCita.medico} para el ${datosCita.fecha} a las ${datosCita.hora} ha sido confirmada.`
    });
  }

  /**
   * Crear notificación de recordatorio de cita
   */
  async notificarRecordatorioCita(idUsuario: string, datosCita: { medico: string; fecha: string; hora: string }) {
    return this.crear({
      idUsuario,
      tipo: TipoNotificacion.EN_APP,
      asunto: 'Recordatorio de Cita',
      mensaje: `Recuerda que tienes una cita con ${datosCita.medico} mañana ${datosCita.fecha} a las ${datosCita.hora}.`
    });
  }
}

export const notificacionService = new NotificacionService();
