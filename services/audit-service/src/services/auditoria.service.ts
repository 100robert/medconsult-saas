// ============================================
// SERVICIO DE AUDITORÍA
// ============================================

import { prisma } from '../config/database';
import { AccionAuditoria } from '@prisma/client';
import { 
  CreateAuditoriaDTO,
  AuditoriaFilters,
  EstadisticasAuditoria,
  NotFoundError
} from '../types';

export class AuditoriaService {
  
  /**
   * Registrar evento de auditoría
   */
  async registrar(data: CreateAuditoriaDTO) {
    const registro = await prisma.registroAuditoria.create({
      data: {
        idUsuario: data.idUsuario,
        accion: data.accion,
        tipoEntidad: data.tipoEntidad,
        idEntidad: data.idEntidad,
        valorAnterior: data.valorAnterior,
        valorNuevo: data.valorNuevo,
        direccionIP: data.direccionIP,
        agenteUsuario: data.agenteUsuario,
      },
      include: {
        usuario: {
          select: { correo: true, nombre: true, apellido: true, rol: true }
        }
      }
    });

    return registro;
  }

  /**
   * Obtener registro por ID
   */
  async obtenerPorId(id: string) {
    const registro = await prisma.registroAuditoria.findUnique({
      where: { id },
      include: {
        usuario: {
          select: { correo: true, nombre: true, apellido: true, rol: true }
        }
      }
    });

    if (!registro) {
      throw new NotFoundError('Registro de auditoría no encontrado');
    }

    return registro;
  }

  /**
   * Buscar registros de auditoría
   */
  async buscar(filtros: AuditoriaFilters = {}) {
    const { idUsuario, accion, tipoEntidad, fechaDesde, fechaHasta, busqueda, page = 1, limit = 50 } = filtros;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (idUsuario) where.idUsuario = idUsuario;
    if (accion) where.accion = accion;
    if (tipoEntidad) where.tipoEntidad = tipoEntidad;
    if (fechaDesde || fechaHasta) {
      where.fechaAccion = {};
      if (fechaDesde) where.fechaAccion.gte = fechaDesde;
      if (fechaHasta) where.fechaAccion.lte = fechaHasta;
    }
    if (busqueda) {
      where.OR = [
        { tipoEntidad: { contains: busqueda, mode: 'insensitive' } },
        { idEntidad: { contains: busqueda } },
      ];
    }

    const [registros, total] = await Promise.all([
      prisma.registroAuditoria.findMany({
        where,
        include: {
          usuario: {
            select: { correo: true, nombre: true, apellido: true, rol: true }
          }
        },
        orderBy: { fechaAccion: 'desc' },
        skip,
        take: limit,
      }),
      prisma.registroAuditoria.count({ where })
    ]);

    return {
      data: registros,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener registros de un usuario
   */
  async obtenerPorUsuario(idUsuario: string, filtros: AuditoriaFilters = {}) {
    return this.buscar({ ...filtros, idUsuario });
  }

  /**
   * Obtener registros de una entidad específica
   */
  async obtenerPorEntidad(tipoEntidad: string, idEntidad?: string, filtros: AuditoriaFilters = {}) {
    const where: AuditoriaFilters = { tipoEntidad, ...filtros };
    if (idEntidad) {
      return this.buscar({ ...where, busqueda: idEntidad });
    }
    return this.buscar(where);
  }

  /**
   * Obtener estadísticas de auditoría
   */
  async obtenerEstadisticas(fechaDesde?: Date, fechaHasta?: Date): Promise<EstadisticasAuditoria> {
    const where: any = {};
    if (fechaDesde || fechaHasta) {
      where.fechaAccion = {};
      if (fechaDesde) where.fechaAccion.gte = fechaDesde;
      if (fechaHasta) where.fechaAccion.lte = fechaHasta;
    }

    const [total, porAccion, porTipoEntidad] = await Promise.all([
      prisma.registroAuditoria.count({ where }),
      prisma.registroAuditoria.groupBy({
        by: ['accion'],
        where,
        _count: true,
        orderBy: { _count: { accion: 'desc' } }
      }),
      prisma.registroAuditoria.groupBy({
        by: ['tipoEntidad'],
        where,
        _count: true,
        orderBy: { _count: { tipoEntidad: 'desc' } },
        take: 10
      })
    ]);

    // Actividad de los últimos 7 días
    const hace7Dias = new Date();
    hace7Dias.setDate(hace7Dias.getDate() - 7);

    const actividadReciente = await prisma.$queryRaw<{ fecha: Date; cantidad: bigint }[]>`
      SELECT DATE("fechaAccion") as fecha, COUNT(*) as cantidad
      FROM "registros_auditoria"
      WHERE "fechaAccion" >= ${hace7Dias}
      GROUP BY DATE("fechaAccion")
      ORDER BY fecha DESC
    `;

    return {
      totalRegistros: total,
      porAccion: porAccion.map(p => ({
        accion: p.accion,
        cantidad: p._count
      })),
      porTipoEntidad: porTipoEntidad.map(p => ({
        tipoEntidad: p.tipoEntidad,
        cantidad: p._count
      })),
      actividadReciente: actividadReciente.map(a => ({
        fecha: a.fecha.toISOString().split('T')[0],
        cantidad: Number(a.cantidad)
      }))
    };
  }

  /**
   * Limpiar registros antiguos
   */
  async limpiarAntiguos(diasRetencion: number = 365) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - diasRetencion);

    const resultado = await prisma.registroAuditoria.deleteMany({
      where: {
        fechaAccion: { lt: fechaLimite }
      }
    });

    return {
      eliminados: resultado.count,
      fechaLimite
    };
  }

  /**
   * Exportar registros (para cumplimiento)
   */
  async exportar(filtros: AuditoriaFilters = {}) {
    const { idUsuario, accion, tipoEntidad, fechaDesde, fechaHasta } = filtros;

    const where: any = {};
    if (idUsuario) where.idUsuario = idUsuario;
    if (accion) where.accion = accion;
    if (tipoEntidad) where.tipoEntidad = tipoEntidad;
    if (fechaDesde || fechaHasta) {
      where.fechaAccion = {};
      if (fechaDesde) where.fechaAccion.gte = fechaDesde;
      if (fechaHasta) where.fechaAccion.lte = fechaHasta;
    }

    const registros = await prisma.registroAuditoria.findMany({
      where,
      include: {
        usuario: {
          select: { correo: true, nombre: true, apellido: true, rol: true }
        }
      },
      orderBy: { fechaAccion: 'asc' },
    });

    return registros;
  }

  // ============================================
  // MÉTODOS HELPER PARA OTROS MICROSERVICIOS
  // ============================================

  /**
   * Registrar visualización
   */
  async registrarVer(idUsuario: string, tipoEntidad: string, idEntidad: string, ip?: string, userAgent?: string) {
    return this.registrar({
      idUsuario,
      accion: AccionAuditoria.VER,
      tipoEntidad,
      idEntidad,
      direccionIP: ip,
      agenteUsuario: userAgent,
    });
  }

  /**
   * Registrar creación
   */
  async registrarCreacion(idUsuario: string, tipoEntidad: string, idEntidad: string, valorNuevo: any, ip?: string) {
    return this.registrar({
      idUsuario,
      accion: AccionAuditoria.CREAR,
      tipoEntidad,
      idEntidad,
      valorNuevo,
      direccionIP: ip,
    });
  }

  /**
   * Registrar actualización
   */
  async registrarActualizacion(idUsuario: string, tipoEntidad: string, idEntidad: string, valorAnterior: any, valorNuevo: any, ip?: string) {
    return this.registrar({
      idUsuario,
      accion: AccionAuditoria.ACTUALIZAR,
      tipoEntidad,
      idEntidad,
      valorAnterior,
      valorNuevo,
      direccionIP: ip,
    });
  }

  /**
   * Registrar eliminación
   */
  async registrarEliminacion(idUsuario: string, tipoEntidad: string, idEntidad: string, valorAnterior: any, ip?: string) {
    return this.registrar({
      idUsuario,
      accion: AccionAuditoria.ELIMINAR,
      tipoEntidad,
      idEntidad,
      valorAnterior,
      direccionIP: ip,
    });
  }
}

export const auditoriaService = new AuditoriaService();
