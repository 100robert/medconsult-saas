import api from './api';

export type TipoCita = 'VIDEOCONSULTA' | 'PRESENCIAL';
export type EstadoCita = 'PROGRAMADA' | 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';

export interface Medico {
  id: string;
  nombre: string;
  apellido: string;
  especialidad?: string | { nombre: string };
  usuario?: {
    nombre: string;
    apellido: string;
  };
}

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  usuario?: {
    nombre: string;
    apellido: string;
  };
}

export interface Appointment {
  id: string;
  idPaciente: string;
  idMedico: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: TipoCita;
  estado: EstadoCita;
  motivo: string;
  notas?: string;
  medico?: Medico;
  paciente?: Paciente;
  creadoEn: string;
  actualizadoEn: string;
}

export interface CreateAppointmentData {
  idMedico: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: TipoCita;
  motivo: string;
}

// Interfaz para respuestas del backend
interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Obtener mis citas (usuario autenticado)
export async function getMisCitas(): Promise<Appointment[]> {
  try {
    const response = await api.get<any>('/citas/mis-citas');
    console.log('📋 Respuesta raw de mis-citas:', response.data);
    const citasRaw = response.data.citas || response.data.data || [];
    console.log('📋 Citas raw extraídas:', citasRaw);

    // Mapear campos del backend al formato esperado por el frontend
    const citasMapped = citasRaw.map((cita: any) => {
      // El backend devuelve fechaHoraCita, necesitamos extraer fecha y hora
      let fecha = cita.fecha;
      let horaInicio = cita.horaInicio;

      if (cita.fechaHoraCita) {
        const fechaHora = new Date(cita.fechaHoraCita);
        fecha = fechaHora.toISOString().split('T')[0]; // "2025-12-09"
        horaInicio = fechaHora.toTimeString().slice(0, 5); // "09:00"
      }

      return {
        ...cita,
        fecha,
        horaInicio,
        horaFin: cita.horaFin || '', // Puede no venir del backend
      };
    });

    console.log('📋 Citas mapeadas:', citasMapped);
    return citasMapped;
  } catch (error: any) {
    console.error('Error al obtener mis citas:', error?.response?.status, error?.message);
    return [];
  }
}

// Obtener citas del paciente actual (legacy - usa ID específico)
export async function getMisicitasPaciente(idPaciente: string): Promise<Appointment[]> {
  try {
    const response = await api.get<BackendResponse<{ citas: Appointment[] }>>(
      `/citas/paciente/${idPaciente}`
    );
    return response.data.data?.citas || [];
  } catch (error: any) {
    console.error('Error al obtener citas del paciente:', error);
    // Si es 404 o no hay citas, devolver array vacío
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
}

// Obtener citas del médico
export async function getCitasMedico(idMedico: string): Promise<Appointment[]> {
  try {
    const response = await api.get<BackendResponse<{ citas: Appointment[] }>>(
      `/citas/medico/${idMedico}`
    );
    return response.data.data?.citas || [];
  } catch (error: any) {
    console.error('Error al obtener citas del médico:', error);
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
}

// Obtener cita por ID
export async function getCitaById(id: string): Promise<Appointment> {
  const response = await api.get<BackendResponse<{ cita: Appointment }>>(
    `/citas/${id}`
  );
  return response.data.data.cita;
}

// Crear nueva cita
export async function createCita(data: CreateAppointmentData): Promise<Appointment> {
  // Verificar si el usuario es Pro (simulación con localStorage)
  const isPro = typeof window !== 'undefined' && localStorage.getItem('medconsult_pro') === 'true';

  const response = await api.post<BackendResponse<Appointment>>(
    '/citas',
    data,
    {
      headers: {
        'X-MedConsult-Pro': isPro ? 'true' : 'false'
      }
    }
  );
  console.log('Respuesta createCita:', response.data);
  return response.data.data;
}

// Confirmar cita (médico)
export async function confirmarCita(id: string): Promise<Appointment> {
  const response = await api.patch<BackendResponse<{ cita: Appointment }>>(
    `/citas/${id}/confirmar`
  );
  return response.data.data.cita;
}

// Cancelar cita
export async function cancelarCita(id: string, motivo?: string): Promise<Appointment> {
  const response = await api.patch<BackendResponse<{ cita: Appointment }>>(
    `/citas/${id}/cancelar`,
    { motivo }
  );
  return response.data.data.cita;
}

// Completar cita (médico)
export async function completarCita(id: string): Promise<Appointment> {
  const response = await api.patch<BackendResponse<{ cita: Appointment }>>(
    `/citas/${id}/completar`
  );
  return response.data.data.cita;
}

// Actualizar notas de cita (médico)
export async function actualizarNotasCita(id: string, notas: string): Promise<Appointment> {
  const response = await api.put<BackendResponse<{ cita: Appointment }>>(
    `/citas/${id}/notas`,
    { notas }
  );
  return response.data.data.cita;
}

// Obtener slots disponibles
export interface Slot {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  fechaHora: string;
  disponibilidadId: string;
}

export async function getAvailableSlots(
  idMedico: string,
  fecha: string
): Promise<Slot[]> {
  try {
    const response = await api.get<BackendResponse<Slot[]>>(
      `/disponibilidades/medico/${idMedico}/slots`,
      {
        params: {
          desde: fecha,
          hasta: fecha
        }
      }
    );
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error al obtener slots:', error);
    return [];
  }
}
