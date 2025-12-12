// ============================================
// SERVICIO DE MÉDICOS
// ============================================

import { prisma } from '../config/database';
import { Prisma, EstadoMedico } from '.prisma/client';
import {
  CreateMedicoDTO,
  UpdateMedicoDTO,
  BuscarMedicosQuery,
  NotFoundError,
  ConflictError
} from '../types';

export class MedicoService {

  /**
   * Crear perfil de médico
   */
  async crear(data: CreateMedicoDTO) {
    // Verificar si ya existe un médico para este usuario
    const existentePorUsuario = await prisma.medico.findUnique({
      where: { idUsuario: data.idUsuario }
    });

    if (existentePorUsuario) {
      throw new ConflictError('Ya existe un perfil de médico para este usuario');
    }

    // Verificar si la licencia ya está registrada
    const existentePorLicencia = await prisma.medico.findUnique({
      where: { numeroLicencia: data.numeroLicencia }
    });

    if (existentePorLicencia) {
      throw new ConflictError('El número de licencia ya está registrado');
    }

    // Verificar que la especialidad existe
    const especialidad = await prisma.especialidad.findUnique({
      where: { id: data.idEspecialidad }
    });

    if (!especialidad) {
      throw new NotFoundError('Especialidad no encontrada');
    }

    const medico = await prisma.medico.create({
      data: {
        idUsuario: data.idUsuario,
        numeroLicencia: data.numeroLicencia,
        idEspecialidad: data.idEspecialidad,
        subespecialidades: data.subespecialidades,
        aniosExperiencia: data.aniosExperiencia || 0,
        biografia: data.biografia,
        educacion: data.educacion,
        certificaciones: data.certificaciones,
        idiomas: data.idiomas || ['Español'],
        precioPorConsulta: data.precioPorConsulta,
        moneda: data.moneda || 'USD',
        duracionConsulta: data.duracionConsulta || 30,
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
            telefono: true,
            imagenPerfil: true,
          }
        },
        especialidad: {
          select: {
            id: true,
            nombre: true,
          }
        }
      }
    });

    return medico;
  }

  /**
   * Obtener médico por ID
   */
  async obtenerPorId(id: string) {
    const medico = await prisma.medico.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
            telefono: true,
            imagenPerfil: true,
          }
        },
        especialidad: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          }
        },
        disponibilidades: {
          where: { activo: true },
          orderBy: { diaSemana: 'asc' }
        }
      }
    });

    if (!medico) {
      throw new NotFoundError('Médico no encontrado');
    }

    return medico;
  }

  /**
   * Obtener médico por ID de usuario
   */
  async obtenerPorUsuarioId(idUsuario: string) {
    const medico = await prisma.medico.findUnique({
      where: { idUsuario },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
            telefono: true,
            imagenPerfil: true,
          }
        },
        especialidad: {
          select: {
            id: true,
            nombre: true,
          }
        }
      }
    });

    if (!medico) {
      throw new NotFoundError('Médico no encontrado');
    }

    return medico;
  }

  /**
   * Actualizar médico
   */
  async actualizar(id: string, data: UpdateMedicoDTO) {
    const medico = await prisma.medico.findUnique({
      where: { id }
    });

    if (!medico) {
      throw new NotFoundError('Médico no encontrado');
    }

    const actualizado = await prisma.medico.update({
      where: { id },
      data: {
        ...data,
        fechaActualizacion: new Date(),
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
            telefono: true,
            imagenPerfil: true,
          }
        },
        especialidad: {
          select: {
            id: true,
            nombre: true,
          }
        }
      }
    });

    return actualizado;
  }

  /**
   * Verificar/cambiar estado de médico (solo admin)
   */
  async verificar(id: string, estado: EstadoMedico) {
    const medico = await prisma.medico.findUnique({
      where: { id }
    });

    if (!medico) {
      throw new NotFoundError('Médico no encontrado');
    }

    const actualizado = await prisma.medico.update({
      where: { id },
      data: {
        estado,
        fechaActualizacion: new Date(),
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
          }
        },
        especialidad: {
          select: { nombre: true }
        }
      }
    });

    return actualizado;
  }

  /**
   * Buscar médicos con filtros
   */
  async buscar(query: BuscarMedicosQuery) {
    const {
      especialidad,
      ciudad,
      pais,
      calificacionMinima,
      precioMinimo,
      precioMaximo,
      idioma,
      aceptaNuevosPacientes = true,
      page = 1,
      limit = 10,
      ordenarPor = 'calificacion',
      orden = 'desc'
    } = query;

    const skip = (page - 1) * limit;

    // Construir condiciones de filtro
    const where: Prisma.MedicoWhereInput = {
      estado: 'VERIFICADO',
      aceptaNuevosPacientes,
    };

    if (especialidad) {
      where.especialidad = {
        nombre: { contains: especialidad, mode: 'insensitive' }
      };
    }

    if (calificacionMinima) {
      where.calificacionPromedio = { gte: calificacionMinima };
    }

    if (precioMinimo || precioMaximo) {
      where.precioPorConsulta = {};
      if (precioMinimo) where.precioPorConsulta.gte = precioMinimo;
      if (precioMaximo) where.precioPorConsulta.lte = precioMaximo;
    }

    if (idioma) {
      where.idiomas = { has: idioma };
    }

    if (ciudad || pais) {
      where.usuario = {};
      // Nota: ciudad y pais están en Paciente, no en Usuario
      // Para filtrar por ubicación del médico, necesitaríamos agregar esos campos
    }

    // Ordenamiento
    const orderByMap: Record<string, Prisma.MedicoOrderByWithRelationInput> = {
      calificacion: { calificacionPromedio: orden },
      precio: { precioPorConsulta: orden },
      experiencia: { aniosExperiencia: orden },
    };

    const orderBy = orderByMap[ordenarPor] || { calificacionPromedio: 'desc' };

    const [medicos, total] = await Promise.all([
      prisma.medico.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          usuario: {
            select: {
              nombre: true,
              apellido: true,
              imagenPerfil: true,
            }
          },
          especialidad: {
            select: {
              id: true,
              nombre: true,
            }
          }
        }
      }),
      prisma.medico.count({ where })
    ]);

    return {
      medicos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Listar todos los médicos (admin)
   */
  async listar(page: number = 1, limit: number = 10, estado?: EstadoMedico) {
    const skip = (page - 1) * limit;

    const where: Prisma.MedicoWhereInput = {};
    if (estado) {
      where.estado = estado;
    }

    const [medicos, total] = await Promise.all([
      prisma.medico.findMany({
        where,
        skip,
        take: limit,
        include: {
          usuario: {
            select: {
              nombre: true,
              apellido: true,
              correo: true,
              telefono: true,
              imagenPerfil: true,
              activo: true,
            }
          },
          especialidad: {
            select: {
              id: true,
              nombre: true,
            }
          }
        },
        orderBy: { fechaCreacion: 'desc' }
      }),
      prisma.medico.count({ where })
    ]);

    return {
      medicos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Actualizar calificación promedio (llamado después de nueva reseña)
   */
  async actualizarCalificacion(id: string) {
    const resultado = await prisma.resena.aggregate({
      where: {
        idMedico: id,
        estado: 'APROBADA'
      },
      _avg: { calificacion: true },
      _count: { calificacion: true }
    });

    await prisma.medico.update({
      where: { id },
      data: {
        calificacionPromedio: resultado._avg.calificacion || 0,
        totalResenas: resultado._count.calificacion,
      }
    });
  }
  /**
   * Obtener estadísticas del médico (Dashboard)
   */
  async obtenerEstadisticas(idUsuario: string) {
    const medico = await this.obtenerPorUsuarioId(idUsuario);
    const idMedico = medico.id;

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      citasPendientes,
      consultasCompletadas,
      pacientesUnicos,
      ingresos
    ] = await Promise.all([
      // Citas Pendientes (Programadas o Confirmadas que aún no ocurren)
      prisma.cita.count({
        where: {
          idMedico,
          estado: { in: ['PROGRAMADA', 'CONFIRMADA'] },
          fechaHoraCita: { gte: now }
        }
      }),
      // Consultas Completadas Total
      prisma.cita.count({
        where: {
          idMedico,
          estado: 'COMPLETADA'
        }
      }),
      // Pacientes Totales (Unique)
      prisma.cita.findMany({
        where: { idMedico },
        select: { idPaciente: true },
        distinct: ['idPaciente']
      }),
      // Ingresos Mes Actual
      prisma.pago.aggregate({
        where: {
          idMedico,
          estado: 'COMPLETADO',
          fechaCreacion: {
            gte: startOfMonth,
            lte: endOfMonth
          }
        },
        _sum: { montoMedico: true }
      })
    ]);

    return {
      citasPendientes,
      consultasCompletadas,
      pacientesTotales: pacientesUnicos.length,
      ingresosMes: ingresos._sum.montoMedico || 0,
      calificacion: medico.calificacionPromedio
    };
  }
}

export const medicoService = new MedicoService();

