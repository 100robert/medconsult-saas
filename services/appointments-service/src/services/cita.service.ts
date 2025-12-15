// ============================================
// SERVICIO DE CITAS
// ============================================

import { prisma } from '../config/database';
import { EstadoCita, CanceladaPor, Prisma } from '.prisma/client';
import {
  CreateCitaDTO,
  UpdateCitaDTO,
  CancelarCitaDTO,
  FiltrarCitasQuery,
  NotFoundError,
  ConflictError,
  ValidationError,
  ForbiddenError
} from '../types';

export class CitaService {

  /**
   * Crear una nueva cita
   */
  async crear(data: CreateCitaDTO) {
    // Verificar que el médico existe y acepta pacientes
    const medico = await prisma.medico.findUnique({
      where: { id: data.idMedico },
      select: {
        estado: true,
        aceptaNuevosPacientes: true,
        duracionConsulta: true,
        precioPorConsulta: true,
        moneda: true,
      }
    });

    if (!medico) {
      throw new NotFoundError('Médico no encontrado');
    }

    if (medico.estado !== 'VERIFICADO') {
      throw new ValidationError('El médico no está verificado');
    }

    if (!medico.aceptaNuevosPacientes) {
      throw new ValidationError('El médico no acepta nuevos pacientes');
    }

    // Verificar que el paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id: data.idPaciente }
    });

    if (!paciente) {
      throw new NotFoundError('Paciente no encontrado');
    }

    // POLITICA DE NEGOCIO: Límite de 5 citas POR MES para cuentas gratuitas
    // Si el usuario es Pro (simulado desde frontend), no aplicamos el límite

    // Calcular inicio y fin del mes actual
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    const finMes = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const totalCitasMesActual = await prisma.cita.count({
      where: {
        idPaciente: data.idPaciente,
        estado: { not: 'CANCELADA' }, // Contamos solo citas no canceladas
        fechaHoraCita: {
          gte: inicioMes,
          lte: finMes
        }
      }
    });

    const LIMITE_CITAS_GRATIS = 5;

    // Solo aplicar límite si NO es Pro
    if (!data.isPro && totalCitasMesActual >= LIMITE_CITAS_GRATIS) {
      throw new ValidationError(`Has alcanzado el límite de ${LIMITE_CITAS_GRATIS} citas por mes del plan gratuito. Actualiza a MedConsult Pro para citas ilimitadas.`);
    }

    console.log(`📊 Límite de citas - Paciente: ${data.idPaciente}, Mes actual: ${totalCitasMesActual}/${LIMITE_CITAS_GRATIS}, Es Pro: ${data.isPro}`);

    // Validar que la fecha no esté marcada como NO DISPONIBLE
    const fechaCita = new Date(data.fechaHoraCita);
    const fechaSoloDia = new Date(fechaCita);
    fechaSoloDia.setHours(0, 0, 0, 0);

    const fechaBloqueada = await prisma.fechaNoDisponible.findFirst({
      where: {
        idMedico: data.idMedico,
        fecha: fechaSoloDia
      }
    });

    if (fechaBloqueada) {
      throw new ValidationError(`El médico no está disponible en esta fecha: ${fechaBloqueada.motivo || 'Motivo no especificado'}`);
    }

    // Identificar día de la semana y hora para validar disponibilidad horaria
    const diasSemana = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
    const diaCita = diasSemana[fechaCita.getDay()] as any; // Cast to DiaSemana
    const horaCita = `${String(fechaCita.getHours()).padStart(2, '0')}:${String(fechaCita.getMinutes()).padStart(2, '0')}`;
    const minutosCita = fechaCita.getHours() * 60 + fechaCita.getMinutes();

    // Validar cobertura de disponibilidad (Si se provee ID, se valida ese específico. Si no, se busca uno que cubra)
    if (data.idDisponibilidad) {
      const disponibilidad = await prisma.disponibilidad.findUnique({
        where: { id: data.idDisponibilidad }
      });

      if (!disponibilidad || !disponibilidad.activo) {
        throw new NotFoundError('Disponibilidad no encontrada o no activa');
      }

      // Validar que la hora coincida con el rango de la disponibilidad seleccionada
      // Esto es extra seguridad por si mandan un ID válido pero una hora fuera de rango
      const [inicioH, inicioM] = disponibilidad.horaInicio.split(':').map(Number);
      const [finH, finM] = disponibilidad.horaFin.split(':').map(Number);
      const inicioMin = inicioH * 60 + inicioM;
      const finMin = finH * 60 + finM;

      if (minutosCita < inicioMin || minutosCita >= finMin) { // >= finMin porque la cita no puede empezar a la hora de cierre exacta si dura algo, pero asumimos simple inicio
        throw new ValidationError('La hora de la cita no corresponde a la disponibilidad seleccionada');
      }

      // Verificar conflictos (lógica existente)
      const citaExistente = await prisma.cita.findFirst({
        where: {
          idDisponibilidad: data.idDisponibilidad,
          fechaHoraCita: data.fechaHoraCita,
          estado: { in: ['PROGRAMADA', 'CONFIRMADA'] }
        }
      });

      if (citaExistente) {
        throw new ConflictError('Ya existe una cita programada para este horario');
      }
    } else {
      // Si no envían idDisponibilidad, DEBEMOS verificar que exista ALGUNA disponibilidad activa que cubra este horario
      console.log('DEBUG CITA:', { diaCita, horaCita, idMedico: data.idMedico });
      const disponibilidadCubierta = await prisma.disponibilidad.findFirst({
        where: {
          idMedico: data.idMedico,
          diaSemana: diaCita,
          activo: true,
          horaInicio: { lte: horaCita },
          horaFin: { gt: horaCita } // La hora de inicio de la cita debe ser estrictamente menor a la hora de fin del turno
        }
      });
      console.log('DEBUG DISPONIBILIDAD:', disponibilidadCubierta);

      if (!disponibilidadCubierta) {
        throw new ValidationError('El médico no tiene disponibilidad activa para este horario');
      }

      // Asignar el ID de disponibilidad encontrado a la cita para mantener la consistencia
      data.idDisponibilidad = disponibilidadCubierta.id;

      // Verificar conflictos generales
      const citaExistente = await prisma.cita.findFirst({
        where: {
          idMedico: data.idMedico,
          fechaHoraCita: data.fechaHoraCita,
          estado: { in: ['PROGRAMADA', 'CONFIRMADA'] }
        }
      });

      if (citaExistente) {
        throw new ConflictError('Ya existe una cita programada para este horario');
      }
    }

    // Verificar que la fecha no sea en el pasado
    if (new Date(data.fechaHoraCita) < new Date()) {
      throw new ValidationError('No se puede agendar una cita en el pasado');
    }

    // Crear la cita usando connect para las relaciones
    // REGLA DE NEGOCIO: Las citas se crean automáticamente como CONFIRMADAS
    // porque el pago se procesa ANTES de crear la cita. Si llega aquí, ya está pagada.
    const citaData: any = {
      paciente: { connect: { id: data.idPaciente } },
      medico: { connect: { id: data.idMedico } },
      fechaHoraCita: data.fechaHoraCita,
      motivo: data.motivo,
      tipo: data.tipo, // <-- Nuevo campo tipo
      estado: 'CONFIRMADA', // Automáticamente confirmada (pago ya procesado)
    };

    // Solo conectar disponibilidad si existe
    if (data.idDisponibilidad) {
      citaData.disponibilidad = { connect: { id: data.idDisponibilidad } };
    }

    const cita = await prisma.cita.create({
      data: citaData,
      include: {
        paciente: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true, correo: true }
            }
          }
        },
        medico: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true }
            },
            especialidad: {
              select: { nombre: true }
            }
          }
        }
      }
    });

    return this._formatCitaResponse(cita);
  }

  /**
   * Obtener cita por ID
   */
  async obtenerPorId(id: string) {
    const cita = await prisma.cita.findUnique({
      where: { id },
      include: {
        paciente: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true, correo: true, telefono: true }
            }
          }
        },
        medico: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true }
            },
            especialidad: {
              select: { nombre: true }
            }
          }
        },
        consulta: true,
        pago: true,
      }
    });

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    return this._formatCitaResponse(cita);
  }

  /**
   * Obtener citas del usuario autenticado (busca por idUsuario)
   */
  async obtenerPorUsuario(idUsuario: string, rol: string, filtros: FiltrarCitasQuery) {
    const { estado, fechaDesde, fechaHasta, page = 1, limit = 50 } = filtros;  // Aumentado a 50
    const skip = (page - 1) * limit;

    console.log('🔍 obtenerPorUsuario - Buscando citas para:', { idUsuario, rol });

    let where: Prisma.CitaWhereInput = {};

    // Buscar según el rol del usuario
    if (rol === 'MEDICO') {
      // Buscar el perfil del médico
      const medico = await prisma.medico.findUnique({
        where: { idUsuario },
        select: { id: true }
      });

      console.log('🔍 Médico encontrado:', medico);

      if (!medico) {
        console.log('❌ No se encontró perfil de médico para idUsuario:', idUsuario);
        return { citas: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }

      where.idMedico = medico.id;
    } else {
      // Buscar el perfil del paciente
      const paciente = await prisma.paciente.findUnique({
        where: { idUsuario },
        select: { id: true }
      });

      console.log('🔍 Paciente encontrado:', paciente);

      if (!paciente) {
        console.log('❌ No se encontró perfil de paciente para idUsuario:', idUsuario);
        return { citas: [], pagination: { page, limit, total: 0, totalPages: 0 } };
      }

      where.idPaciente = paciente.id;
    }

    if (estado) {
      where.estado = estado;
    }

    if (fechaDesde || fechaHasta) {
      where.fechaHoraCita = {};
      if (fechaDesde) where.fechaHoraCita.gte = fechaDesde;
      if (fechaHasta) where.fechaHoraCita.lte = fechaHasta;
    }

    const [citas, total] = await Promise.all([
      prisma.cita.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaCreacion: 'desc' },  // Ordenar por fecha de creación más reciente
        include: {
          paciente: {
            include: {
              usuario: {
                select: { nombre: true, apellido: true, imagenPerfil: true, correo: true }
              }
            }
          },
          medico: {
            include: {
              usuario: {
                select: { nombre: true, apellido: true, imagenPerfil: true }
              },
              especialidad: {
                select: { nombre: true }
              }
            }
          }
        }
      }),
      prisma.cita.count({ where })
    ]);



    // Mapear resultados para incluir campos formateados que espera el frontend
    const citasFormateadas = citas.map(cita => this._formatCitaResponse(cita));

    return {
      citas: citasFormateadas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obtener citas de un paciente
   */
  async obtenerPorPaciente(idPaciente: string, filtros: FiltrarCitasQuery) {
    const { estado, fechaDesde, fechaHasta, page = 1, limit = 10 } = filtros;
    const skip = (page - 1) * limit;

    const where: Prisma.CitaWhereInput = { idPaciente };

    if (estado) {
      where.estado = estado;
    }

    if (fechaDesde || fechaHasta) {
      where.fechaHoraCita = {};
      if (fechaDesde) where.fechaHoraCita.gte = fechaDesde;
      if (fechaHasta) where.fechaHoraCita.lte = fechaHasta;
    }

    const [citas, total] = await Promise.all([
      prisma.cita.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaHoraCita: 'desc' },
        include: {
          medico: {
            include: {
              usuario: {
                select: { nombre: true, apellido: true, imagenPerfil: true }
              },
              especialidad: {
                select: { nombre: true }
              }
            }
          }
        }
      }),
      prisma.cita.count({ where })
    ]);

    return {
      citas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Obtener citas de un médico
   */
  async obtenerPorMedico(idMedico: string, filtros: FiltrarCitasQuery) {
    const { estado, fechaDesde, fechaHasta, page = 1, limit = 10 } = filtros;
    const skip = (page - 1) * limit;

    const where: Prisma.CitaWhereInput = { idMedico };

    if (estado) {
      where.estado = estado;
    }

    if (fechaDesde || fechaHasta) {
      where.fechaHoraCita = {};
      if (fechaDesde) where.fechaHoraCita.gte = fechaDesde;
      if (fechaHasta) where.fechaHoraCita.lte = fechaHasta;
    }

    const [citas, total] = await Promise.all([
      prisma.cita.findMany({
        where,
        skip,
        take: limit,
        orderBy: { fechaHoraCita: 'asc' },
        include: {
          paciente: {
            include: {
              usuario: {
                select: { nombre: true, apellido: true, imagenPerfil: true, telefono: true }
              }
            }
          }
        }
      }),
      prisma.cita.count({ where })
    ]);

    return {
      citas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Confirmar cita
   * NOTA: Este método es ahora idempotente - si la cita ya está confirmada, simplemente retorna éxito.
   * Con el nuevo flujo, las citas se crean automáticamente como CONFIRMADAS después del pago.
   */
  async confirmar(id: string, notas?: string) {
    const cita = await prisma.cita.findUnique({
      where: { id }
    });

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    // Si ya está confirmada, retornar la cita sin error (idempotente)
    if (cita.estado === 'CONFIRMADA') {
      return prisma.cita.findUnique({
        where: { id },
        include: {
          paciente: { include: { usuario: { select: { nombre: true, apellido: true, correo: true } } } },
          medico: { include: { usuario: { select: { nombre: true, apellido: true } }, especialidad: { select: { nombre: true } } } }
        }
      });
    }

    // Solo se puede confirmar desde PROGRAMADA (por compatibilidad con citas existentes)
    if (cita.estado !== 'PROGRAMADA') {
      throw new ValidationError(`No se puede confirmar una cita con estado ${cita.estado}`);
    }

    const actualizada = await prisma.cita.update({
      where: { id },
      data: {
        estado: 'CONFIRMADA',
        notas,
        fechaActualizacion: new Date(),
      },
      include: {
        paciente: {
          include: {
            usuario: { select: { nombre: true, apellido: true, correo: true } }
          }
        },
        medico: {
          include: {
            usuario: { select: { nombre: true, apellido: true } },
            especialidad: { select: { nombre: true } }
          }
        }
      }
    });

    return actualizada;
  }

  /**
   * Cancelar cita
   */
  async cancelar(id: string, data: CancelarCitaDTO, userId: string, userRol: string) {
    const cita = await prisma.cita.findUnique({
      where: { id },
      include: {
        paciente: { select: { idUsuario: true } },
        medico: { select: { idUsuario: true } }
      }
    });

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    // Verificar permisos
    const esPaciente = cita.paciente.idUsuario === userId;
    const esMedico = cita.medico.idUsuario === userId;
    const esAdmin = userRol === 'ADMIN';

    if (!esPaciente && !esMedico && !esAdmin) {
      throw new ForbiddenError('No tienes permisos para cancelar esta cita');
    }

    if (cita.estado === 'COMPLETADA') {
      throw new ValidationError('No se puede cancelar una cita completada');
    }

    if (cita.estado === 'CANCELADA') {
      throw new ValidationError('La cita ya está cancelada');
    }

    const actualizada = await prisma.cita.update({
      where: { id },
      data: {
        estado: 'CANCELADA',
        razonCancelacion: data.razonCancelacion,
        canceladaPor: data.canceladaPor,
        fechaCancelacion: new Date(),
        fechaActualizacion: new Date(),
      }
    });

    return actualizada;
  }

  /**
   * Completar cita (cuando se inicia la consulta)
   */
  async completar(id: string) {
    const cita = await prisma.cita.findUnique({
      where: { id }
    });

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    if (cita.estado !== 'CONFIRMADA') {
      throw new ValidationError('Solo se pueden completar citas confirmadas');
    }

    const actualizada = await prisma.cita.update({
      where: { id },
      data: {
        estado: 'COMPLETADA',
        fechaActualizacion: new Date(),
      }
    });

    // Incrementar contador de consultas del médico
    await prisma.medico.update({
      where: { id: cita.idMedico },
      data: {
        totalConsultas: { increment: 1 }
      }
    });

    return actualizada;
  }

  /**
   * Actualizar notas de la cita
   */
  async actualizarNotas(id: string, data: UpdateCitaDTO) {
    const cita = await prisma.cita.findUnique({
      where: { id }
    });

    if (!cita) {
      throw new NotFoundError('Cita no encontrada');
    }

    const actualizada = await prisma.cita.update({
      where: { id },
      data: {
        ...data,
        fechaActualizacion: new Date(),
      }
    });

    return actualizada;
  }

  /**
   * Obtener próximas citas del día (para dashboard de médico)
   */
  async obtenerCitasHoy(idMedico: string) {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const citas = await prisma.cita.findMany({
      where: {
        idMedico,
        fechaHoraCita: {
          gte: hoy,
          lt: manana,
        },
        estado: { in: ['PROGRAMADA', 'CONFIRMADA'] }
      },
      orderBy: { fechaHoraCita: 'asc' },
      include: {
        paciente: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true, imagenPerfil: true }
            }
          }
        }
      }
    });

    return citas.map(c => this._formatCitaResponse(c));
  }
  /**
   * Obtener pacientes únicos de un médico con estadísticas
   */
  async obtenerPacientesPorMedico(idMedico: string) {
    // 1. Obtener IDs de pacientes únicos y sus estadísticas básicas (total citas, última cita)
    const statsPacientes = await prisma.cita.groupBy({
      by: ['idPaciente'],
      where: {
        idMedico,
        estado: { not: 'CANCELADA' }
      },
      _count: {
        id: true
      },
      _max: {
        fechaHoraCita: true
      },
      orderBy: {
        _max: {
          fechaHoraCita: 'desc'
        }
      }
    });

    // 2. Obtener detalles de cada paciente
    // Usamos Promise.all para enriquecer los datos
    const pacientesEnriquecidos = await Promise.all(
      statsPacientes.map(async (stat) => {
        const paciente = await prisma.paciente.findUnique({
          where: { id: stat.idPaciente },
          include: {
            usuario: {
              select: {
                nombre: true,
                apellido: true,
                correo: true, // Email
                telefono: true,
                imagenPerfil: true,
                genero: true,
                fechaNacimiento: true,
              }
            }
          }
        });

        if (!paciente) return null;

        // Calcular próxima cita si existe
        const proximaCita = await prisma.cita.findFirst({
          where: {
            idMedico,
            idPaciente: stat.idPaciente,
            estado: { in: ['PROGRAMADA', 'CONFIRMADA'] },
            fechaHoraCita: { gt: new Date() }
          },
          orderBy: { fechaHoraCita: 'asc' },
          select: { fechaHoraCita: true }
        });

        // Obtener última consulta con diagnóstico
        const ultimaConsulta = await prisma.consulta.findFirst({
          where: {
            cita: {
              idMedico,
              idPaciente: stat.idPaciente,
            },
            estado: 'COMPLETADA'
          },
          orderBy: { fechaInicio: 'desc' },
          select: {
            diagnostico: true,
            tratamiento: true,
            fechaInicio: true
          }
        });

        // Contar recetas activas
        const recetasActivas = await prisma.receta.count({
          where: {
            idPaciente: stat.idPaciente,
            idMedico,
            estado: 'ACTIVA',
            OR: [
              { fechaVencimiento: null },
              { fechaVencimiento: { gte: new Date() } }
            ]
          }
        });

        return {
          id: paciente.id,
          nombre: paciente.usuario.nombre,
          apellido: paciente.usuario.apellido,
          email: paciente.usuario.correo,
          telefono: paciente.usuario.telefono || paciente.telefonoEmergencia, // Fallback
          fechaNacimiento: paciente.usuario.fechaNacimiento || paciente.fechaNacimiento,
          genero: paciente.usuario.genero || paciente.genero,
          ultimaConsulta: stat._max.fechaHoraCita,
          totalConsultas: stat._count.id,
          proximaCita: proximaCita?.fechaHoraCita || null,
          imagenPerfil: paciente.usuario.imagenPerfil,
          // Nuevos campos
          ultimoDiagnostico: ultimaConsulta?.diagnostico || null,
          ultimoTratamiento: ultimaConsulta?.tratamiento || null,
          recetasActivas: recetasActivas,
        };
      })
    );

    // Filtrar nulos y retornar
    return pacientesEnriquecidos.filter(p => p !== null);
  }
  /**
   * Obtener detalle de paciente con próxima cita
   */
  async obtenerDetallePaciente(idPaciente: string) {
    const paciente = await prisma.paciente.findUnique({
      where: { id: idPaciente },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
            telefono: true,
            imagenPerfil: true,
            genero: true,
            fechaNacimiento: true,
          }
        }
      }
    });

    if (!paciente) {
      throw new NotFoundError('Paciente no encontrado');
    }

    // Calcular próxima cita
    const proximaCita = await prisma.cita.findFirst({
      where: {
        idPaciente: idPaciente,
        estado: { in: ['PROGRAMADA', 'CONFIRMADA'] },
        fechaHoraCita: { gt: new Date() }
      },
      orderBy: { fechaHoraCita: 'asc' },
      select: { fechaHoraCita: true }
    });

    // Obtener recetas activas del paciente
    const recetasActivas = await prisma.receta.findMany({
      where: {
        idPaciente,
        estado: 'ACTIVA',
        OR: [
          { fechaVencimiento: null },
          { fechaVencimiento: { gte: new Date() } }
        ]
      },
      select: {
        id: true,
        medicamentos: true,
        instrucciones: true,
        fechaVencimiento: true,
        fechaEmision: true
      }
    });

    return {
      id: paciente.id,
      nombre: paciente.usuario.nombre,
      apellido: paciente.usuario.apellido,
      email: paciente.usuario.correo,
      telefono: paciente.usuario.telefono || paciente.telefonoEmergencia,
      fechaNacimiento: paciente.usuario.fechaNacimiento || paciente.fechaNacimiento,
      genero: paciente.usuario.genero || paciente.genero,
      imagenPerfil: paciente.usuario.imagenPerfil,
      proximaCita: proximaCita?.fechaHoraCita || null,
      recetasActivas
    };
  }

  /**
   * Obtener citas recientes (Admin Dashboard)
   */
  async obtenerCitasRecientes(limit: number) {
    const citas = await prisma.cita.findMany({
      take: limit,
      orderBy: { fechaCreacion: 'desc' }, // Ordenar por fecha de creación (feed de actividad)
      include: {
        paciente: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true, imagenPerfil: true }
            }
          }
        },
        medico: {
          include: {
            usuario: {
              select: { nombre: true, apellido: true }
            },
            especialidad: {
              select: { nombre: true }
            }
          }
        }
      }
    });

    return citas.map(c => this._formatCitaResponse(c));
  }




  // Helper para formatear cita y aplanar estructuras
  private _formatCitaResponse(cita: any): any {
    const fecha = cita.fechaHoraCita instanceof Date
      ? cita.fechaHoraCita.toISOString().split('T')[0]
      : new Date(cita.fechaHoraCita).toISOString().split('T')[0];

    const horaInicio = cita.fechaHoraCita instanceof Date
      ? cita.fechaHoraCita.toISOString().split('T')[1].substring(0, 5)
      : new Date(cita.fechaHoraCita).toISOString().split('T')[1].substring(0, 5);

    // Calcular hora fin (30 min después)
    const fechaFin = new Date(cita.fechaHoraCita);
    fechaFin.setMinutes(fechaFin.getMinutes() + 30);
    const horaFin = fechaFin.toISOString().split('T')[1].substring(0, 5);

    const citaObj: any = {
      ...cita,
      fecha,
      horaInicio,
      horaFin
    };

    // Aplanar datos del paciente si existen
    if (citaObj.paciente && citaObj.paciente.usuario) {
      citaObj.paciente = {
        ...citaObj.paciente,
        nombre: citaObj.paciente.usuario.nombre,
        apellido: citaObj.paciente.usuario.apellido,
        imagenPerfil: citaObj.paciente.usuario.imagenPerfil,
        correo: citaObj.paciente.usuario.correo
      };
    }

    // Aplanar datos del médico si existen
    if (citaObj.medico && citaObj.medico.usuario) {
      citaObj.medico = {
        ...citaObj.medico,
        nombre: citaObj.medico.usuario.nombre,
        apellido: citaObj.medico.usuario.apellido,
        imagenPerfil: citaObj.medico.usuario.imagenPerfil,
        especialidad: citaObj.medico.especialidad
      };
    }

    return citaObj;
  }
}

export const citaService = new CitaService();
