// ============================================
// SERVICIO DE DISPONIBILIDAD
// ============================================

import { prisma } from '../config/database';
import { DiaSemana } from '@prisma/client';
import { 
  CreateDisponibilidadDTO, 
  UpdateDisponibilidadDTO,
  CreateFechaNoDisponibleDTO,
  NotFoundError,
  ConflictError,
  ValidationError
} from '../types';

export class DisponibilidadService {
  
  /**
   * Crear horario de disponibilidad
   */
  async crear(data: CreateDisponibilidadDTO) {
    // Verificar que no exista el mismo horario
    const existente = await prisma.disponibilidad.findFirst({
      where: {
        idMedico: data.idMedico,
        diaSemana: data.diaSemana,
        horaInicio: data.horaInicio,
      }
    });

    if (existente) {
      throw new ConflictError('Ya existe un horario para este día y hora');
    }

    // Validar formato de horas
    if (!this.validarFormatoHora(data.horaInicio) || !this.validarFormatoHora(data.horaFin)) {
      throw new ValidationError('Formato de hora inválido. Use HH:MM');
    }

    // Validar que horaInicio < horaFin
    if (data.horaInicio >= data.horaFin) {
      throw new ValidationError('La hora de inicio debe ser menor que la hora de fin');
    }

    const disponibilidad = await prisma.disponibilidad.create({
      data: {
        idMedico: data.idMedico,
        diaSemana: data.diaSemana,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
      }
    });

    return disponibilidad;
  }

  /**
   * Crear múltiples horarios de disponibilidad
   */
  async crearMultiples(idMedico: string, horarios: Omit<CreateDisponibilidadDTO, 'idMedico'>[]) {
    const creados = [];

    for (const horario of horarios) {
      try {
        const disponibilidad = await this.crear({
          idMedico,
          ...horario
        });
        creados.push(disponibilidad);
      } catch (error) {
        // Continuar con los demás si uno falla
        console.error(`Error creando horario: ${error}`);
      }
    }

    return creados;
  }

  /**
   * Obtener disponibilidades de un médico
   */
  async obtenerPorMedico(idMedico: string, soloActivos: boolean = true) {
    const where = soloActivos 
      ? { idMedico, activo: true }
      : { idMedico };

    const disponibilidades = await prisma.disponibilidad.findMany({
      where,
      orderBy: [
        { diaSemana: 'asc' },
        { horaInicio: 'asc' }
      ]
    });

    return disponibilidades;
  }

  /**
   * Actualizar disponibilidad
   */
  async actualizar(id: string, data: UpdateDisponibilidadDTO) {
    const disponibilidad = await prisma.disponibilidad.findUnique({
      where: { id }
    });

    if (!disponibilidad) {
      throw new NotFoundError('Disponibilidad no encontrada');
    }

    if (data.horaInicio && !this.validarFormatoHora(data.horaInicio)) {
      throw new ValidationError('Formato de hora de inicio inválido');
    }

    if (data.horaFin && !this.validarFormatoHora(data.horaFin)) {
      throw new ValidationError('Formato de hora de fin inválido');
    }

    const actualizada = await prisma.disponibilidad.update({
      where: { id },
      data: {
        ...data,
        fechaActualizacion: new Date(),
      }
    });

    return actualizada;
  }

  /**
   * Eliminar disponibilidad
   */
  async eliminar(id: string) {
    const disponibilidad = await prisma.disponibilidad.findUnique({
      where: { id }
    });

    if (!disponibilidad) {
      throw new NotFoundError('Disponibilidad no encontrada');
    }

    await prisma.disponibilidad.delete({
      where: { id }
    });

    return { message: 'Disponibilidad eliminada exitosamente' };
  }

  /**
   * Agregar fecha no disponible (vacaciones, etc.)
   */
  async agregarFechaNoDisponible(data: CreateFechaNoDisponibleDTO) {
    const existente = await prisma.fechaNoDisponible.findFirst({
      where: {
        idMedico: data.idMedico,
        fecha: data.fecha,
      }
    });

    if (existente) {
      throw new ConflictError('Esta fecha ya está marcada como no disponible');
    }

    const fechaNoDisponible = await prisma.fechaNoDisponible.create({
      data: {
        idMedico: data.idMedico,
        fecha: data.fecha,
        motivo: data.motivo,
      }
    });

    return fechaNoDisponible;
  }

  /**
   * Obtener fechas no disponibles de un médico
   */
  async obtenerFechasNoDisponibles(idMedico: string, desde?: Date) {
    const where: any = { idMedico };
    
    if (desde) {
      where.fecha = { gte: desde };
    }

    const fechas = await prisma.fechaNoDisponible.findMany({
      where,
      orderBy: { fecha: 'asc' }
    });

    return fechas;
  }

  /**
   * Eliminar fecha no disponible
   */
  async eliminarFechaNoDisponible(id: string) {
    const fecha = await prisma.fechaNoDisponible.findUnique({
      where: { id }
    });

    if (!fecha) {
      throw new NotFoundError('Fecha no disponible no encontrada');
    }

    await prisma.fechaNoDisponible.delete({
      where: { id }
    });

    return { message: 'Fecha no disponible eliminada' };
  }

  /**
   * Obtener slots disponibles para un médico en un rango de fechas
   */
  async obtenerSlotsDisponibles(
    idMedico: string, 
    fechaDesde: Date, 
    fechaHasta: Date,
    duracionConsulta: number = 30
  ) {
    // Obtener disponibilidades del médico
    const disponibilidades = await this.obtenerPorMedico(idMedico);

    // Obtener fechas no disponibles
    const fechasNoDisponibles = await this.obtenerFechasNoDisponibles(idMedico, fechaDesde);
    const fechasNoDispSet = new Set(
      fechasNoDisponibles.map(f => f.fecha.toISOString().split('T')[0])
    );

    // Obtener citas existentes en el rango
    const citasExistentes = await prisma.cita.findMany({
      where: {
        idMedico,
        fechaHoraCita: {
          gte: fechaDesde,
          lte: fechaHasta,
        },
        estado: { in: ['PROGRAMADA', 'CONFIRMADA'] }
      },
      select: {
        fechaHoraCita: true,
        idDisponibilidad: true,
      }
    });

    const citasSet = new Set(
      citasExistentes.map(c => c.fechaHoraCita.toISOString())
    );

    // Generar slots disponibles
    const slots: any[] = [];
    const diasSemana: DiaSemana[] = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

    let fecha = new Date(fechaDesde);
    
    while (fecha <= fechaHasta) {
      const fechaStr = fecha.toISOString().split('T')[0];
      
      // Saltar si es fecha no disponible
      if (fechasNoDispSet.has(fechaStr)) {
        fecha.setDate(fecha.getDate() + 1);
        continue;
      }

      const diaSemana = diasSemana[fecha.getDay()];

      // Buscar disponibilidades para este día
      const disponibilidadesDia = disponibilidades.filter(d => d.diaSemana === diaSemana);

      for (const disp of disponibilidadesDia) {
        // Generar slots según la duración de consulta
        const [horaInicioH, horaInicioM] = disp.horaInicio.split(':').map(Number);
        const [horaFinH, horaFinM] = disp.horaFin.split(':').map(Number);

        let slotInicio = horaInicioH * 60 + horaInicioM;
        const finMinutos = horaFinH * 60 + horaFinM;

        while (slotInicio + duracionConsulta <= finMinutos) {
          const slotHora = Math.floor(slotInicio / 60);
          const slotMinuto = slotInicio % 60;
          
          const fechaHoraSlot = new Date(fecha);
          fechaHoraSlot.setHours(slotHora, slotMinuto, 0, 0);

          // Verificar si el slot está ocupado
          if (!citasSet.has(fechaHoraSlot.toISOString())) {
            slots.push({
              fecha: fechaStr,
              horaInicio: `${String(slotHora).padStart(2, '0')}:${String(slotMinuto).padStart(2, '0')}`,
              horaFin: `${String(Math.floor((slotInicio + duracionConsulta) / 60)).padStart(2, '0')}:${String((slotInicio + duracionConsulta) % 60).padStart(2, '0')}`,
              fechaHora: fechaHoraSlot,
              disponibilidadId: disp.id,
            });
          }

          slotInicio += duracionConsulta;
        }
      }

      fecha.setDate(fecha.getDate() + 1);
    }

    return slots;
  }

  /**
   * Validar formato de hora HH:MM
   */
  private validarFormatoHora(hora: string): boolean {
    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return regex.test(hora);
  }
}

export const disponibilidadService = new DisponibilidadService();
