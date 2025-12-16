// ============================================
// SERVICIO DE DISPONIBILIDAD
// ============================================

import { prisma } from '../config/database';
import { DiaSemana } from '.prisma/client';
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
   * Reemplazar todos los horarios de disponibilidad de un médico
   * Elimina los existentes y crea los nuevos
   */
  async reemplazarHorarios(idMedico: string, horarios: Omit<CreateDisponibilidadDTO, 'idMedico'>[]) {
    // 1. Eliminar todos los horarios existentes del médico
    await prisma.disponibilidad.deleteMany({
      where: { idMedico }
    });

    console.log(`🗑️ Eliminados horarios anteriores del médico ${idMedico}`);

    // 2. Crear los nuevos horarios
    const creados = [];

    for (const horario of horarios) {
      try {
        const disponibilidad = await prisma.disponibilidad.create({
          data: {
            idMedico,
            diaSemana: horario.diaSemana,
            horaInicio: horario.horaInicio,
            horaFin: horario.horaFin,
            activo: horario.activo ?? true,
          }
        });
        creados.push(disponibilidad);
      } catch (error) {
        console.error(`Error creando horario: ${error}`);
      }
    }

    console.log(`✅ Creados ${creados.length} nuevos horarios para médico ${idMedico}`);

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

    console.log(`[DEBUG] Generando slots para médico ${idMedico} del ${fechaDesde.toISOString()} al ${fechaHasta.toISOString()}`);
    console.log(`[DEBUG] Citas existentes encontradas encontradas: ${citasExistentes.length}`);
    citasExistentes.forEach(c => console.log(`  - Cita: ${c.fechaHoraCita.toISOString()} Estado: ${(c as any).estado} ID: ${c.idDisponibilidad}`));

    while (fecha <= fechaHasta) {
      const fechaStr = fecha.toISOString().split('T')[0];

      // Saltar si es fecha no disponible
      if (fechasNoDispSet.has(fechaStr)) {
        fecha.setDate(fecha.getDate() + 1);
        continue;
      }

      const diaSemana = diasSemana[fecha.getUTCDay()];

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

          // Construct date using string to ensure it interprets as local time (matching appointment creation)
          // fechaStr is YYYY-MM-DD. slotHora/Minuto are local hours.
          // This creates "YYYY-MM-DDTHH:MM:00" which Date() parses as local time -> correct UTC
          const horaStr = `${String(slotHora).padStart(2, '0')}:${String(slotMinuto).padStart(2, '0')}`;
          const fechaHoraSlot = new Date(`${fechaStr}T${horaStr}:00`);

          // Verificar si el slot está ocupado usando superposición de intervalos (más robusto que comparación de strings)
          // Slot: [fechaHoraSlot, slotFin]
          // Verificar si el slot está ocupado usando superposición de intervalos
          // Implementamos chequeo doble para manejar discrepancias de Timezone (UTC vs Local -5)
          const slotInicioMs = fechaHoraSlot.getTime();
          const slotFinMs = slotInicioMs + (duracionConsulta * 60 * 1000);

          // Shift de 5 horas (18000000 ms) para alinear UTC server con Data Local (UTC-5)
          const TIMEZONE_OFFSET_MS = 5 * 60 * 60 * 1000;
          const slotInicioMsShifted = slotInicioMs + TIMEZONE_OFFSET_MS;
          const slotFinMsShifted = slotFinMs + TIMEZONE_OFFSET_MS;

          const isOccupied = citasExistentes.some(cita => {
            const citaInicioMs = cita.fechaHoraCita.getTime();
            // Asumimos que las citas duran lo mismo que la consulta programada o usamos un default
            const citaFinMs = citaInicioMs + (duracionConsulta * 60 * 1000);

            // 1. Chequeo Normal (Si server y DB están en misma zona)
            const overlapNormal = slotInicioMs < citaFinMs && slotFinMs > citaInicioMs;

            // 2. Chequeo Shifted (Si server es UTC y DB es Local/-5)
            // Esto corrige el caso donde slot 13:00 se genera como 13:00 UTC pero la cita es 18:00 UTC (13:00 Local)
            const overlapShifted = slotInicioMsShifted < citaFinMs && slotFinMsShifted > citaInicioMs;

            // DEBUG EXPLICITAMENTE PARA LAS 13:00
            if (horaStr === '13:00') {
              console.log(`[DEBUG 13:00] Comparando Slot ${fechaHoraSlot.toISOString()} vs Cita ${cita.fechaHoraCita.toISOString()}`);
              console.log(`    Normal: ${overlapNormal} | Shifted: ${overlapShifted}`);
              console.log(`   SlotMs: ${slotInicioMs} | CitaMs: ${citaInicioMs}`);
            }

            // Debug log solo si hay overlap para rastrear
            if (overlapNormal || overlapShifted) {
              console.log(`🔒 Conflicto detectado para slot ${horaStr}:`, {
                slot: fechaHoraSlot.toISOString(),
                cita: cita.fechaHoraCita.toISOString(),
                normal: overlapNormal,
                shifted: overlapShifted
              });
            }

            return overlapNormal || overlapShifted;
          });

          if (!isOccupied) {
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
