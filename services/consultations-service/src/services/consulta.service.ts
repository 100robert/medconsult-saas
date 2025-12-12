// ============================================
// SERVICIO DE CONSULTAS
// ============================================

import { prisma } from '../config/database';
import { EstadoConsulta, EstadoCita, TipoConsulta } from '@prisma/client';
import {
  CreateConsultaDTO,
  UpdateConsultaDTO,
  FinalizarConsultaDTO,
  ConsultaFilters,
  NotFoundError,
  ConflictError
} from '../types';

export class ConsultaService {

  /**
   * Crear consulta a partir de una cita
   */
  async crear(data: CreateConsultaDTO) {
    const cita = await prisma.cita.findUnique({
      where: { id: data.idCita },
      include: { consulta: true }
    });

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    if (cita.estado !== EstadoCita.CONFIRMADA) {
      throw new ConflictError('La cita debe estar confirmada para crear una consulta');
    }

    if (cita.consulta) {
      throw new ConflictError('Ya existe una consulta para esta cita');
    }

    const consulta = await prisma.consulta.create({
      data: {
        idCita: data.idCita,
        fechaInicio: new Date(),
        tipoConsulta: data.tipoConsulta || TipoConsulta.VIDEO,
        notas: data.notas,
        estado: EstadoConsulta.EN_PROGRESO,
      },
      include: {
        cita: {
          include: {
            paciente: {
              include: { usuario: { select: { correo: true, nombre: true, apellido: true } } }
            },
            medico: {
              include: {
                usuario: { select: { correo: true, nombre: true, apellido: true } },
                especialidad: true
              }
            }
          }
        },
        recetas: true
      }
    });

    return consulta;
  }

  /**
   * Obtener consulta por ID
   */
  async obtenerPorId(id: string) {
    const consulta = await prisma.consulta.findUnique({
      where: { id },
      include: {
        cita: {
          include: {
            paciente: {
              include: { usuario: { select: { correo: true, nombre: true, apellido: true } } }
            },
            medico: {
              include: {
                usuario: { select: { correo: true, nombre: true, apellido: true } },
                especialidad: true
              }
            }
          }
        },
        recetas: true,
      }
    });

    if (!consulta) {
      throw new NotFoundError('Consulta no encontrada');
    }

    return consulta;
  }

  /**
   * Obtener consulta por ID de Cita
   * Usado para que los pacientes puedan unirse a la sala de videollamada
   */
  async obtenerPorIdCita(idCita: string) {
    const consulta = await prisma.consulta.findUnique({
      where: { idCita },
      include: {
        cita: {
          include: {
            paciente: {
              include: { usuario: { select: { correo: true, nombre: true, apellido: true } } }
            },
            medico: {
              include: {
                usuario: { select: { correo: true, nombre: true, apellido: true } },
                especialidad: true
              }
            }
          }
        },
        recetas: true,
      }
    });

    if (!consulta) {
      throw new NotFoundError('No hay una consulta activa para esta cita. El médico aún no ha iniciado la consulta.');
    }

    return consulta;
  }

  /**
   * Actualizar consulta
   */
  async actualizar(id: string, data: UpdateConsultaDTO) {
    const consulta = await prisma.consulta.findUnique({ where: { id } });

    if (!consulta) {
      throw new NotFoundError('Consulta no encontrada');
    }

    if (consulta.estado === EstadoConsulta.COMPLETADA) {
      throw new ConflictError('No se puede modificar una consulta completada');
    }

    return prisma.consulta.update({
      where: { id },
      data: {
        notas: data.notas,
        diagnostico: data.diagnostico,
        tratamiento: data.tratamiento,
        requiereSeguimiento: data.requiereSeguimiento,
        fechaSeguimiento: data.fechaSeguimiento,
      },
      include: {
        cita: {
          include: {
            paciente: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } },
            medico: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } }
          }
        },
        recetas: true
      }
    });
  }

  /**
   * Finalizar consulta
   */
  async finalizar(id: string, data: FinalizarConsultaDTO) {
    const consulta = await prisma.consulta.findUnique({
      where: { id },
      include: { cita: true }
    });

    if (!consulta) {
      throw new NotFoundError('Consulta no encontrada');
    }

    if (consulta.estado === EstadoConsulta.COMPLETADA) {
      throw new ConflictError('La consulta ya está completada');
    }

    const fechaFin = new Date();
    const duracion = Math.round((fechaFin.getTime() - consulta.fechaInicio.getTime()) / 60000);

    const consultaActualizada = await prisma.consulta.update({
      where: { id },
      data: {
        fechaFin,
        duracion,
        diagnostico: data.diagnostico,
        tratamiento: data.tratamiento,
        notas: data.notas,
        requiereSeguimiento: data.requiereSeguimiento || false,
        fechaSeguimiento: data.fechaSeguimiento,
        estado: EstadoConsulta.COMPLETADA
      },
      include: {
        cita: {
          include: {
            paciente: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } },
            medico: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } }
          }
        },
        recetas: true
      }
    });

    await prisma.cita.update({
      where: { id: consulta.idCita },
      data: { estado: EstadoCita.COMPLETADA }
    });

    return consultaActualizada;
  }

  /**
   * Cancelar consulta
   */
  async cancelar(id: string, motivo?: string) {
    const consulta = await prisma.consulta.findUnique({
      where: { id },
      include: { cita: true }
    });

    if (!consulta) {
      throw new NotFoundError('Consulta no encontrada');
    }

    if (consulta.estado === EstadoConsulta.COMPLETADA) {
      throw new ConflictError('No se puede cancelar una consulta completada');
    }

    const consultaActualizada = await prisma.consulta.update({
      where: { id },
      data: {
        estado: EstadoConsulta.CANCELADA,
        notas: motivo ? `CANCELADA: ${motivo}` : consulta.notas
      },
      include: {
        cita: {
          include: {
            paciente: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } },
            medico: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } }
          }
        }
      }
    });

    await prisma.cita.update({
      where: { id: consulta.idCita },
      data: { estado: EstadoCita.CANCELADA }
    });

    return consultaActualizada;
  }

  /**
   * Listar consultas de un médico
   */
  async listarPorMedico(idMedico: string, filtros: ConsultaFilters = {}) {
    const { estado, fechaDesde, fechaHasta, page = 1, limit = 10 } = filtros;

    const where: any = { cita: { idMedico } };
    if (estado) where.estado = estado;
    if (fechaDesde || fechaHasta) {
      where.fechaInicio = {};
      if (fechaDesde) where.fechaInicio.gte = new Date(fechaDesde);
      if (fechaHasta) where.fechaInicio.lte = new Date(fechaHasta);
    }

    const [consultas, total] = await Promise.all([
      prisma.consulta.findMany({
        where,
        include: {
          cita: {
            include: {
              paciente: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } }
            }
          },
          recetas: true
        },
        orderBy: { fechaInicio: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.consulta.count({ where })
    ]);

    return {
      data: consultas,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  /**
   * Listar consultas de un paciente
   */
  async listarPorPaciente(idPaciente: string, filtros: ConsultaFilters = {}) {
    const { estado, fechaDesde, fechaHasta, page = 1, limit = 10 } = filtros;

    const where: any = { cita: { idPaciente } };
    if (estado) where.estado = estado;
    if (fechaDesde || fechaHasta) {
      where.fechaInicio = {};
      if (fechaDesde) where.fechaInicio.gte = new Date(fechaDesde);
      if (fechaHasta) where.fechaInicio.lte = new Date(fechaHasta);
    }

    const [consultas, total] = await Promise.all([
      prisma.consulta.findMany({
        where,
        include: {
          cita: {
            include: {
              medico: {
                include: {
                  usuario: { select: { correo: true, nombre: true, apellido: true } },
                  especialidad: true
                }
              }
            }
          },
          recetas: true
        },
        orderBy: { fechaInicio: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.consulta.count({ where })
    ]);

    return {
      data: consultas,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  /**
   * Obtener estadísticas
   */
  async obtenerEstadisticas(idMedico?: string) {
    const whereBase: any = idMedico ? { cita: { idMedico } } : {};

    const [total, enProgreso, completadas, canceladas] = await Promise.all([
      prisma.consulta.count({ where: whereBase }),
      prisma.consulta.count({ where: { ...whereBase, estado: EstadoConsulta.EN_PROGRESO } }),
      prisma.consulta.count({ where: { ...whereBase, estado: EstadoConsulta.COMPLETADA } }),
      prisma.consulta.count({ where: { ...whereBase, estado: EstadoConsulta.CANCELADA } })
    ]);

    return {
      total, enProgreso, completadas, canceladas,
      tasaCompletacion: total > 0 ? ((completadas / total) * 100).toFixed(2) : '0'
    };
  }

  /**
   * Obtener consultas por usuario autenticado
   */
  async obtenerPorUsuario(idUsuario: string, rol: string, filtros: ConsultaFilters = {}) {
    const { estado, fechaDesde, fechaHasta, page = 1, limit = 10 } = filtros;

    let where: any = {};

    // Buscar según el rol del usuario
    if (rol === 'MEDICO') {
      const medico = await prisma.medico.findUnique({
        where: { idUsuario },
        select: { id: true }
      });

      if (!medico) {
        return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }

      where.cita = { idMedico: medico.id };
    } else {
      const paciente = await prisma.paciente.findUnique({
        where: { idUsuario },
        select: { id: true }
      });

      if (!paciente) {
        return { data: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }

      where.cita = { idPaciente: paciente.id };
    }

    if (estado) where.estado = estado;
    if (fechaDesde || fechaHasta) {
      where.fechaInicio = {};
      if (fechaDesde) where.fechaInicio.gte = new Date(fechaDesde);
      if (fechaHasta) where.fechaInicio.lte = new Date(fechaHasta);
    }

    const [consultas, total] = await Promise.all([
      prisma.consulta.findMany({
        where,
        include: {
          cita: {
            include: {
              paciente: {
                include: { usuario: { select: { correo: true, nombre: true, apellido: true, imagenPerfil: true } } }
              },
              medico: {
                include: {
                  usuario: { select: { correo: true, nombre: true, apellido: true, imagenPerfil: true } },
                  especialidad: true
                }
              }
            }
          },
          recetas: true
        },
        orderBy: { fechaInicio: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.consulta.count({ where })
    ]);

    return {
      data: consultas,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }
}

export const consultaService = new ConsultaService();
