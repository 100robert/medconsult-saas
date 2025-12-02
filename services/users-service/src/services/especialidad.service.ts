// ============================================
// SERVICIO DE ESPECIALIDADES
// ============================================

import { prisma } from '../config/database';
import { 
  CreateEspecialidadDTO, 
  UpdateEspecialidadDTO, 
  NotFoundError,
  ConflictError 
} from '../types';

export class EspecialidadService {
  
  /**
   * Crear especialidad (solo admin)
   */
  async crear(data: CreateEspecialidadDTO) {
    // Verificar si ya existe
    const existente = await prisma.especialidad.findUnique({
      where: { nombre: data.nombre }
    });

    if (existente) {
      throw new ConflictError('Ya existe una especialidad con ese nombre');
    }

    const especialidad = await prisma.especialidad.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        icono: data.icono,
      }
    });

    return especialidad;
  }

  /**
   * Obtener especialidad por ID
   */
  async obtenerPorId(id: string) {
    const especialidad = await prisma.especialidad.findUnique({
      where: { id },
      include: {
        _count: {
          select: { medicos: true }
        }
      }
    });

    if (!especialidad) {
      throw new NotFoundError('Especialidad no encontrada');
    }

    return {
      ...especialidad,
      totalMedicos: especialidad._count.medicos,
    };
  }

  /**
   * Listar todas las especialidades
   */
  async listar(soloActivas: boolean = true) {
    const where = soloActivas ? { activa: true } : {};

    const especialidades = await prisma.especialidad.findMany({
      where,
      include: {
        _count: {
          select: { 
            medicos: {
              where: { estado: 'VERIFICADO' }
            } 
          }
        }
      },
      orderBy: { nombre: 'asc' }
    });

    return especialidades.map(esp => ({
      id: esp.id,
      nombre: esp.nombre,
      descripcion: esp.descripcion,
      icono: esp.icono,
      activa: esp.activa,
      totalMedicos: esp._count.medicos,
    }));
  }

  /**
   * Actualizar especialidad (solo admin)
   */
  async actualizar(id: string, data: UpdateEspecialidadDTO) {
    const especialidad = await prisma.especialidad.findUnique({
      where: { id }
    });

    if (!especialidad) {
      throw new NotFoundError('Especialidad no encontrada');
    }

    // Si cambia el nombre, verificar que no exista
    if (data.nombre && data.nombre !== especialidad.nombre) {
      const existente = await prisma.especialidad.findUnique({
        where: { nombre: data.nombre }
      });

      if (existente) {
        throw new ConflictError('Ya existe una especialidad con ese nombre');
      }
    }

    const actualizada = await prisma.especialidad.update({
      where: { id },
      data: {
        ...data,
        fechaActualizacion: new Date(),
      }
    });

    return actualizada;
  }

  /**
   * Desactivar especialidad (solo admin)
   */
  async desactivar(id: string) {
    const especialidad = await prisma.especialidad.findUnique({
      where: { id }
    });

    if (!especialidad) {
      throw new NotFoundError('Especialidad no encontrada');
    }

    const actualizada = await prisma.especialidad.update({
      where: { id },
      data: { 
        activa: false,
        fechaActualizacion: new Date(),
      }
    });

    return actualizada;
  }

  /**
   * Buscar especialidades por nombre
   */
  async buscar(termino: string) {
    const especialidades = await prisma.especialidad.findMany({
      where: {
        activa: true,
        nombre: {
          contains: termino,
          mode: 'insensitive'
        }
      },
      include: {
        _count: {
          select: { 
            medicos: {
              where: { estado: 'VERIFICADO' }
            } 
          }
        }
      },
      orderBy: { nombre: 'asc' },
      take: 10
    });

    return especialidades.map(esp => ({
      id: esp.id,
      nombre: esp.nombre,
      descripcion: esp.descripcion,
      icono: esp.icono,
      totalMedicos: esp._count.medicos,
    }));
  }

  /**
   * Sembrar especialidades iniciales
   */
  async sembrarEspecialidades() {
    const especialidadesIniciales = [
      { nombre: 'Medicina General', descripcion: 'Atención médica primaria y preventiva', icono: 'stethoscope' },
      { nombre: 'Pediatría', descripcion: 'Atención médica para niños y adolescentes', icono: 'baby' },
      { nombre: 'Ginecología', descripcion: 'Salud reproductiva femenina', icono: 'female' },
      { nombre: 'Cardiología', descripcion: 'Enfermedades del corazón y sistema cardiovascular', icono: 'heart' },
      { nombre: 'Dermatología', descripcion: 'Enfermedades de la piel', icono: 'hand' },
      { nombre: 'Neurología', descripcion: 'Sistema nervioso y cerebro', icono: 'brain' },
      { nombre: 'Psiquiatría', descripcion: 'Salud mental y trastornos psicológicos', icono: 'head-side-brain' },
      { nombre: 'Psicología', descripcion: 'Terapia y bienestar emocional', icono: 'comments' },
      { nombre: 'Traumatología', descripcion: 'Huesos, articulaciones y músculos', icono: 'bone' },
      { nombre: 'Oftalmología', descripcion: 'Enfermedades de los ojos', icono: 'eye' },
      { nombre: 'Otorrinolaringología', descripcion: 'Oídos, nariz y garganta', icono: 'ear' },
      { nombre: 'Endocrinología', descripcion: 'Sistema hormonal y metabólico', icono: 'vial' },
      { nombre: 'Gastroenterología', descripcion: 'Sistema digestivo', icono: 'stomach' },
      { nombre: 'Neumología', descripcion: 'Sistema respiratorio y pulmones', icono: 'lungs' },
      { nombre: 'Urología', descripcion: 'Sistema urinario y salud masculina', icono: 'male' },
      { nombre: 'Nutrición', descripcion: 'Alimentación y dietética', icono: 'apple-alt' },
    ];

    const creadas = [];

    for (const esp of especialidadesIniciales) {
      const existente = await prisma.especialidad.findUnique({
        where: { nombre: esp.nombre }
      });

      if (!existente) {
        const nueva = await prisma.especialidad.create({ data: esp });
        creadas.push(nueva);
      }
    }

    return {
      message: `Se crearon ${creadas.length} especialidades`,
      especialidades: creadas
    };
  }
}

export const especialidadService = new EspecialidadService();
