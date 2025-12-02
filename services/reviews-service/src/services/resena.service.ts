// ============================================
// SERVICIO DE RESEÑAS
// ============================================

import { prisma } from '../config/database';
import { EstadoCita, EstadoResena } from '@prisma/client';
import { 
  CreateResenaDTO,
  UpdateResenaDTO,
  ResenaFilters,
  EstadisticasResenas,
  NotFoundError,
  ConflictError,
  ValidationError,
  ForbiddenError
} from '../types';

export class ResenaService {
  
  /**
   * Crear reseña
   */
  async crear(idPaciente: string, data: CreateResenaDTO) {
    // Verificar que la cita existe y pertenece al paciente
    const cita = await prisma.cita.findUnique({
      where: { id: data.idCita },
      include: { resena: true }
    });

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    if (cita.idPaciente !== idPaciente) {
      throw new ForbiddenError('No puedes crear una reseña para esta cita');
    }

    if (cita.estado !== EstadoCita.COMPLETADA) {
      throw new ConflictError('Solo puedes reseñar citas completadas');
    }

    if (cita.resena) {
      throw new ConflictError('Ya existe una reseña para esta cita');
    }

    // Validar calificación
    if (data.calificacion < 1 || data.calificacion > 5) {
      throw new ValidationError('La calificación debe estar entre 1 y 5');
    }

    const resena = await prisma.resena.create({
      data: {
        idCita: data.idCita,
        idPaciente,
        idMedico: cita.idMedico,
        calificacion: data.calificacion,
        comentario: data.comentario,
        anonima: data.anonima ?? false,
      },
      include: {
        paciente: {
          include: { 
            usuario: { 
              select: { nombre: true, apellido: true } 
            } 
          }
        },
        medico: {
          include: { 
            usuario: { select: { nombre: true, apellido: true } },
            especialidad: true
          }
        }
      }
    });

    // Actualizar promedio del médico
    await this.actualizarPromedioMedico(cita.idMedico);

    return resena;
  }

  /**
   * Obtener reseña por ID
   */
  async obtenerPorId(id: string) {
    const resena = await prisma.resena.findUnique({
      where: { id },
      include: {
        paciente: {
          include: { 
            usuario: { 
              select: { nombre: true, apellido: true } 
            } 
          }
        },
        medico: {
          include: { 
            usuario: { select: { nombre: true, apellido: true } },
            especialidad: true
          }
        },
        cita: true
      }
    });

    if (!resena) {
      throw new NotFoundError('Reseña no encontrada');
    }

    return resena;
  }

  /**
   * Actualizar reseña
   */
  async actualizar(id: string, idPaciente: string, data: UpdateResenaDTO) {
    const resena = await prisma.resena.findUnique({
      where: { id }
    });

    if (!resena) {
      throw new NotFoundError('Reseña no encontrada');
    }

    if (resena.idPaciente !== idPaciente) {
      throw new ForbiddenError('No puedes editar esta reseña');
    }

    if (data.calificacion && (data.calificacion < 1 || data.calificacion > 5)) {
      throw new ValidationError('La calificación debe estar entre 1 y 5');
    }

    const actualizada = await prisma.resena.update({
      where: { id },
      data: {
        calificacion: data.calificacion,
        comentario: data.comentario,
      }
    });

    // Actualizar promedio si cambió la calificación
    if (data.calificacion) {
      await this.actualizarPromedioMedico(resena.idMedico);
    }

    return actualizada;
  }

  /**
   * Eliminar reseña
   */
  async eliminar(id: string, idPaciente: string, esAdmin: boolean = false) {
    const resena = await prisma.resena.findUnique({
      where: { id }
    });

    if (!resena) {
      throw new NotFoundError('Reseña no encontrada');
    }

    if (!esAdmin && resena.idPaciente !== idPaciente) {
      throw new ForbiddenError('No puedes eliminar esta reseña');
    }

    await prisma.resena.delete({
      where: { id }
    });

    // Actualizar promedio del médico
    await this.actualizarPromedioMedico(resena.idMedico);

    return { message: 'Reseña eliminada exitosamente' };
  }

  /**
   * Marcar reseña como útil
   */
  async marcarUtil(id: string) {
    const resena = await prisma.resena.findUnique({
      where: { id }
    });

    if (!resena) {
      throw new NotFoundError('Reseña no encontrada');
    }

    const actualizada = await prisma.resena.update({
      where: { id },
      data: {
        cuantasUtilesIndican: resena.cuantasUtilesIndican + 1,
      }
    });

    return actualizada;
  }

  /**
   * Cambiar estado de reseña (moderación)
   */
  async cambiarEstado(id: string, estado: EstadoResena) {
    const resena = await prisma.resena.findUnique({
      where: { id }
    });

    if (!resena) {
      throw new NotFoundError('Reseña no encontrada');
    }

    const actualizada = await prisma.resena.update({
      where: { id },
      data: { estado }
    });

    return actualizada;
  }

  /**
   * Obtener reseñas de un médico
   */
  async obtenerPorMedico(idMedico: string, filtros: ResenaFilters = {}) {
    const { calificacionMin, calificacionMax, soloConComentario, fechaDesde, fechaHasta, page = 1, limit = 10 } = filtros;
    const skip = (page - 1) * limit;

    const where: any = { 
      idMedico,
      estado: EstadoResena.APROBADA // Solo mostrar aprobadas públicamente
    };

    if (calificacionMin) where.calificacion = { gte: calificacionMin };
    if (calificacionMax) where.calificacion = { ...where.calificacion, lte: calificacionMax };
    if (soloConComentario) where.comentario = { not: null };
    if (fechaDesde || fechaHasta) {
      where.fechaCreacion = {};
      if (fechaDesde) where.fechaCreacion.gte = fechaDesde;
      if (fechaHasta) where.fechaCreacion.lte = fechaHasta;
    }

    const [resenas, total] = await Promise.all([
      prisma.resena.findMany({
        where,
        include: {
          paciente: {
            include: { 
              usuario: { 
                select: { nombre: true, apellido: true } 
              } 
            }
          }
        },
        orderBy: { fechaCreacion: 'desc' },
        skip,
        take: limit,
      }),
      prisma.resena.count({ where })
    ]);

    // Ocultar nombre del paciente si es anónima
    const resenasFormateadas = resenas.map(r => ({
      ...r,
      paciente: r.anonima ? null : r.paciente
    }));

    return {
      data: resenasFormateadas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener reseñas de un paciente
   */
  async obtenerPorPaciente(idPaciente: string, filtros: ResenaFilters = {}) {
    const { page = 1, limit = 10 } = filtros;
    const skip = (page - 1) * limit;

    const [resenas, total] = await Promise.all([
      prisma.resena.findMany({
        where: { idPaciente },
        include: {
          medico: {
            include: { 
              usuario: { select: { nombre: true, apellido: true } },
              especialidad: true
            }
          },
          cita: true
        },
        orderBy: { fechaCreacion: 'desc' },
        skip,
        take: limit,
      }),
      prisma.resena.count({ where: { idPaciente } })
    ]);

    return {
      data: resenas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener estadísticas de un médico
   */
  async obtenerEstadisticasMedico(idMedico: string): Promise<EstadisticasResenas> {
    const whereAprobadas = { idMedico, estado: EstadoResena.APROBADA };

    const [promedio, total, distribucion, ultimas] = await Promise.all([
      prisma.resena.aggregate({
        where: whereAprobadas,
        _avg: { calificacion: true }
      }),
      prisma.resena.count({ where: whereAprobadas }),
      prisma.resena.groupBy({
        by: ['calificacion'],
        where: whereAprobadas,
        _count: true
      }),
      prisma.resena.findMany({
        where: whereAprobadas,
        include: {
          paciente: {
            include: { 
              usuario: { 
                select: { nombre: true, apellido: true } 
              } 
            }
          }
        },
        orderBy: { fechaCreacion: 'desc' },
        take: 5
      })
    ]);

    // Formatear distribución
    const distribucionFormateada = [1, 2, 3, 4, 5].map(estrellas => {
      const encontrado = distribucion.find(d => d.calificacion === estrellas);
      const cantidad = encontrado?._count ?? 0;
      return {
        estrellas,
        cantidad,
        porcentaje: total > 0 ? Math.round((cantidad / total) * 100) : 0
      };
    });

    // Ocultar nombre si es anónima
    const ultimasFormateadas = ultimas.map(r => ({
      ...r,
      paciente: r.anonima ? null : r.paciente
    }));

    return {
      promedioCalificacion: promedio._avg.calificacion ?? 0,
      totalResenas: total,
      distribucion: distribucionFormateada,
      ultimasResenas: ultimasFormateadas
    };
  }

  /**
   * Actualizar promedio de calificación del médico
   */
  private async actualizarPromedioMedico(idMedico: string) {
    const promedio = await prisma.resena.aggregate({
      where: { idMedico, estado: EstadoResena.APROBADA },
      _avg: { calificacion: true }
    });

    await prisma.medico.update({
      where: { id: idMedico },
      data: {
        calificacionPromedio: promedio._avg.calificacion ?? 0,
      }
    });
  }

  /**
   * Obtener reseñas públicas recientes (para landing)
   */
  async obtenerResenasPublicas(limite: number = 10) {
    const resenas = await prisma.resena.findMany({
      where: {
        calificacion: { gte: 4 }, // Solo reseñas positivas
        comentario: { not: null },
        anonima: false,
        estado: EstadoResena.APROBADA
      },
      include: {
        paciente: {
          include: { 
            usuario: { 
              select: { nombre: true, apellido: true } 
            } 
          }
        },
        medico: {
          include: { 
            usuario: { select: { nombre: true, apellido: true } },
            especialidad: true
          }
        }
      },
      orderBy: { fechaCreacion: 'desc' },
      take: limite
    });

    return resenas;
  }

  /**
   * Obtener reseñas pendientes de moderación
   */
  async obtenerPendientes(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [resenas, total] = await Promise.all([
      prisma.resena.findMany({
        where: { estado: EstadoResena.PENDIENTE },
        include: {
          paciente: {
            include: { 
              usuario: { 
                select: { nombre: true, apellido: true } 
              } 
            }
          },
          medico: {
            include: { 
              usuario: { select: { nombre: true, apellido: true } },
              especialidad: true
            }
          }
        },
        orderBy: { fechaCreacion: 'asc' },
        skip,
        take: limit,
      }),
      prisma.resena.count({ where: { estado: EstadoResena.PENDIENTE } })
    ]);

    return {
      data: resenas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
}

export const resenaService = new ResenaService();
