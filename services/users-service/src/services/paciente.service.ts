// ============================================
// SERVICIO DE PACIENTES
// ============================================

import { prisma } from '../config/database';
import {
  CreatePacienteDTO,
  UpdatePacienteDTO,
  NotFoundError,
  ConflictError
} from '../types';

export class PacienteService {

  /**
   * Crear perfil de paciente
   */
  async crear(data: CreatePacienteDTO) {
    // Verificar si ya existe un paciente para este usuario
    const existente = await prisma.paciente.findUnique({
      where: { idUsuario: data.idUsuario }
    });

    if (existente) {
      throw new ConflictError('Ya existe un perfil de paciente para este usuario');
    }

    const paciente = await prisma.paciente.create({
      data: {
        idUsuario: data.idUsuario,
        fechaNacimiento: data.fechaNacimiento,
        genero: data.genero,
        direccion: data.direccion,
        ciudad: data.ciudad,
        pais: data.pais,
        grupoSanguineo: data.grupoSanguineo,
        alergias: data.alergias,
        condicionesCronicas: data.condicionesCronicas,
        medicamentosActuales: data.medicamentosActuales,
        contactoEmergencia: data.contactoEmergencia,
        telefonoEmergencia: data.telefonoEmergencia,
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
        }
      }
    });

    return paciente;
  }

  /**
   * Obtener paciente por ID
   */
  async obtenerPorId(id: string) {
    const paciente = await prisma.paciente.findUnique({
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
        }
      }
    });

    if (!paciente) {
      throw new NotFoundError('Paciente no encontrado');
    }

    return paciente;
  }

  /**
   * Obtener paciente por ID de usuario
   * Si no existe, crea automáticamente el perfil de paciente
   */
  async obtenerPorUsuarioId(idUsuario: string) {
    let paciente = await prisma.paciente.findUnique({
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
        }
      }
    });

    // Si el paciente no existe, crear perfil automáticamente
    if (!paciente) {
      console.log('⚠️ Paciente no encontrado, creando perfil automáticamente para usuario:', idUsuario);

      // Verificar que el usuario existe
      const usuario = await prisma.usuario.findUnique({
        where: { id: idUsuario }
      });

      if (!usuario) {
        throw new NotFoundError('Usuario no encontrado');
      }

      // Crear perfil de paciente automáticamente
      paciente = await prisma.paciente.create({
        data: {
          idUsuario: idUsuario,
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
          }
        }
      });

      console.log('✅ Perfil de paciente creado automáticamente:', paciente.id);
    }

    return paciente;
  }

  /**
   * Actualizar paciente
   */
  async actualizar(id: string, data: UpdatePacienteDTO) {
    const paciente = await prisma.paciente.findUnique({
      where: { id }
    });

    if (!paciente) {
      throw new NotFoundError('Paciente no encontrado');
    }

    const actualizado = await prisma.paciente.update({
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
        }
      }
    });

    return actualizado;
  }

  /**
   * Listar todos los pacientes (solo admin)
   */
  async listar(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [pacientes, total] = await Promise.all([
      prisma.paciente.findMany({
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
          }
        },
        orderBy: { fechaCreacion: 'desc' }
      }),
      prisma.paciente.count()
    ]);

    return {
      pacientes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  /**
   * Obtener historial médico resumido
   */
  async obtenerHistorial(id: string) {
    const paciente = await prisma.paciente.findUnique({
      where: { id },
      select: {
        alergias: true,
        condicionesCronicas: true,
        medicamentosActuales: true,
        grupoSanguineo: true,
        citas: {
          where: { estado: 'COMPLETADA' },
          take: 10,
          orderBy: { fechaHoraCita: 'desc' },
          include: {
            medico: {
              include: {
                usuario: { select: { nombre: true, apellido: true } },
                especialidad: { select: { nombre: true } }
              }
            },
            consulta: {
              select: {
                diagnostico: true,
                tratamiento: true,
                fechaInicio: true,
              }
            }
          }
        },
        recetas: {
          where: { estado: 'ACTIVA' },
          take: 5,
          orderBy: { fechaEmision: 'desc' },
          select: {
            id: true,
            medicamentos: true,
            fechaEmision: true,
            fechaVencimiento: true,
          }
        }
      }
    });

    if (!paciente) {
      throw new NotFoundError('Paciente no encontrado');
    }

    return paciente;
  }

  /**
   * Activar suscripción Pro para un paciente
   */
  async activarPro(idUsuario: string) {
    // Buscar paciente por ID de usuario
    let paciente = await prisma.paciente.findUnique({
      where: { idUsuario }
    });

    // Si no existe, crear el perfil
    if (!paciente) {
      paciente = await prisma.paciente.create({
        data: { idUsuario }
      });
    }

    // Actualizar a Pro
    const pacienteActualizado = await prisma.paciente.update({
      where: { id: paciente.id },
      data: { esPro: true },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
            correo: true,
          }
        }
      }
    });

    console.log('✅ Paciente actualizado a Pro:', pacienteActualizado.id);
    return pacienteActualizado;
  }

  /**
   * Verificar si un paciente es Pro
   */
  async esPro(idUsuario: string): Promise<boolean> {
    const paciente = await prisma.paciente.findUnique({
      where: { idUsuario },
      select: { esPro: true }
    });

    return paciente?.esPro || false;
  }
}

export const pacienteService = new PacienteService();

