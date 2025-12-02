// ============================================
// SERVICIO DE RECETAS
// ============================================

import { prisma } from '../config/database';
import { EstadoReceta } from '@prisma/client';
import { 
  CreateRecetaDTO,
  UpdateRecetaDTO,
  NotFoundError,
  ConflictError
} from '../types';

export class RecetaService {
  
  /**
   * Crear receta
   */
  async crear(data: CreateRecetaDTO) {
    const consulta = await prisma.consulta.findUnique({ where: { id: data.idConsulta } });
    if (!consulta) throw new NotFoundError('Consulta no encontrada');

    const medico = await prisma.medico.findUnique({ where: { id: data.idMedico } });
    if (!medico) throw new NotFoundError('Médico no encontrado');

    const paciente = await prisma.paciente.findUnique({ where: { id: data.idPaciente } });
    if (!paciente) throw new NotFoundError('Paciente no encontrado');

    const receta = await prisma.receta.create({
      data: {
        idConsulta: data.idConsulta,
        idMedico: data.idMedico,
        idPaciente: data.idPaciente,
        medicamentos: data.medicamentos as any,
        instrucciones: data.instrucciones,
        duracionTratamiento: data.duracionTratamiento,
        notas: data.notas,
        fechaVencimiento: data.fechaVencimiento,
        estado: EstadoReceta.ACTIVA
      },
      include: {
        consulta: true,
        medico: {
          include: { 
            usuario: { select: { correo: true, nombre: true, apellido: true } },
            especialidad: true
          }
        },
        paciente: {
          include: { usuario: { select: { correo: true, nombre: true, apellido: true } } }
        }
      }
    });

    return receta;
  }

  /**
   * Obtener receta por ID
   */
  async obtenerPorId(id: string) {
    const receta = await prisma.receta.findUnique({
      where: { id },
      include: {
        consulta: true,
        medico: {
          include: { 
            usuario: { select: { correo: true, nombre: true, apellido: true } },
            especialidad: true
          }
        },
        paciente: {
          include: { usuario: { select: { correo: true, nombre: true, apellido: true } } }
        }
      }
    });

    if (!receta) throw new NotFoundError('Receta no encontrada');
    return receta;
  }

  /**
   * Listar recetas de una consulta
   */
  async listarPorConsulta(idConsulta: string) {
    return prisma.receta.findMany({
      where: { idConsulta },
      include: {
        medico: {
          include: { 
            usuario: { select: { correo: true, nombre: true, apellido: true } },
            especialidad: true
          }
        }
      },
      orderBy: { fechaEmision: 'desc' }
    });
  }

  /**
   * Listar recetas de un paciente
   */
  async listarPorPaciente(idPaciente: string, estado?: EstadoReceta, page = 1, limit = 10) {
    const where: any = { idPaciente };
    if (estado) where.estado = estado;

    const [recetas, total] = await Promise.all([
      prisma.receta.findMany({
        where,
        include: {
          consulta: true,
          medico: {
            include: { 
              usuario: { select: { correo: true, nombre: true, apellido: true } },
              especialidad: true
            }
          }
        },
        orderBy: { fechaEmision: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.receta.count({ where })
    ]);

    return {
      data: recetas,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  /**
   * Listar recetas emitidas por un médico
   */
  async listarPorMedico(idMedico: string, estado?: EstadoReceta, page = 1, limit = 10) {
    const where: any = { idMedico };
    if (estado) where.estado = estado;

    const [recetas, total] = await Promise.all([
      prisma.receta.findMany({
        where,
        include: {
          consulta: true,
          paciente: {
            include: { usuario: { select: { correo: true, nombre: true, apellido: true } } }
          }
        },
        orderBy: { fechaEmision: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.receta.count({ where })
    ]);

    return {
      data: recetas,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
    };
  }

  /**
   * Actualizar receta
   */
  async actualizar(id: string, data: UpdateRecetaDTO) {
    const receta = await prisma.receta.findUnique({ where: { id } });
    if (!receta) throw new NotFoundError('Receta no encontrada');

    if (receta.estado !== EstadoReceta.ACTIVA) {
      throw new ConflictError('Solo se pueden modificar recetas activas');
    }

    return prisma.receta.update({
      where: { id },
      data: {
        medicamentos: data.medicamentos as any,
        instrucciones: data.instrucciones,
        duracionTratamiento: data.duracionTratamiento,
        notas: data.notas,
        fechaVencimiento: data.fechaVencimiento,
        estado: data.estado
      },
      include: {
        consulta: true,
        medico: {
          include: { 
            usuario: { select: { correo: true, nombre: true, apellido: true } },
            especialidad: true
          }
        },
        paciente: {
          include: { usuario: { select: { correo: true, nombre: true, apellido: true } } }
        }
      }
    });
  }

  /**
   * Cancelar receta
   */
  async cancelar(id: string) {
    const receta = await prisma.receta.findUnique({ where: { id } });
    if (!receta) throw new NotFoundError('Receta no encontrada');

    if (receta.estado !== EstadoReceta.ACTIVA) {
      throw new ConflictError('Solo se pueden cancelar recetas activas');
    }

    return prisma.receta.update({
      where: { id },
      data: { estado: EstadoReceta.CANCELADA },
      include: {
        consulta: true,
        medico: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } },
        paciente: { include: { usuario: { select: { correo: true, nombre: true, apellido: true } } } }
      }
    });
  }

  /**
   * Marcar recetas vencidas
   */
  async marcarVencidas() {
    const result = await prisma.receta.updateMany({
      where: {
        estado: EstadoReceta.ACTIVA,
        fechaVencimiento: { lte: new Date() }
      },
      data: { estado: EstadoReceta.VENCIDA }
    });
    return { recetasVencidas: result.count };
  }
}

export const recetaService = new RecetaService();
