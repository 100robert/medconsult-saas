import api from './api';

export interface DisponibilidadSlot {
  inicio: string;
  fin: string;
}

export interface DisponibilidadDia {
  activo: boolean;
  slots: DisponibilidadSlot[];
}

export interface Disponibilidad {
  id?: string;
  idMedico: string;
  diaSemana: number; // 0-6 (Domingo-Sábado)
  horaInicio: string;
  horaFin: string;
  duracionCita: number;
  activo: boolean;
}

export interface MedicoStats {
  citasHoy: number;
  citasPendientes: number;
  pacientesTotales: number;
  calificacion: number;
  ingresosMes: number;
  consultasCompletadas: number;
}

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  ultimaConsulta?: string;
  totalConsultas: number;
  proximaCita?: string;
}


export interface Medico {
  id: string;
  idUsuario: string;
  numeroLicencia: string;
  idEspecialidad: string;
  subespecialidades: string[];
  aniosExperiencia: number;
  biografia: string;
  educacion: string[];
  certificaciones: string[];
  idiomas: string[];
  precioPorConsulta: number;
  moneda: string;
  duracionConsulta: number;
  calificacionPromedio: number;
  totalResenas: number;
  estado: 'PENDIENTE' | 'VERIFICADO' | 'RECHAZADO' | 'SUSPENDIDO';
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
    telefono?: string;
    imagenPerfil?: string;
  };
  especialidad?: {
    id: string;
    nombre: string;
  };
}

export interface Review {
  id: string;
  idPaciente: string;
  idMedico: string;
  calificacion: number;
  comentario: string;
  respuesta?: string;
  creadoEn: string;
  paciente?: {
    nombre: string;
    apellido: string;
  };
}

// ============ PERFIL MÉDICO ============

export async function getMiPerfilMedico(): Promise<Medico | null> {
  try {
    const response = await api.get<any>('/medicos/me/perfil');
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error al obtener perfil médico:', error);
    return null;
  }
}

export async function updateMiPerfilMedico(data: Partial<Medico>): Promise<Medico> {
  const response = await api.put<any>('/medicos/me', data);
  return response.data.data;
}


// ============ DISPONIBILIDAD ============

export async function getDisponibilidad(idMedico: string): Promise<Disponibilidad[]> {
  try {
    const response = await api.get<any>(`/disponibilidades/medico/${idMedico}`);
    return response.data.data?.disponibilidades || response.data.disponibilidades || [];
  } catch (error: any) {
    console.error('Error al obtener disponibilidad:', error);
    return [];
  }
}

export async function getMiDisponibilidad(): Promise<Disponibilidad[]> {
  try {
    const response = await api.get<any>('/disponibilidades/me');
    return response.data.data?.disponibilidades || response.data.disponibilidades || [];
  } catch (error: any) {
    console.error('Error al obtener mi disponibilidad:', error);
    return [];
  }
}

export async function guardarDisponibilidad(disponibilidades: Partial<Disponibilidad>[]): Promise<boolean> {
  try {
    await api.post('/disponibilidades', { disponibilidades });
    return true;
  } catch (error: any) {
    console.error('Error al guardar disponibilidad:', error);
    return false;
  }
}

export async function actualizarDisponibilidad(id: string, data: Partial<Disponibilidad>): Promise<boolean> {
  try {
    await api.patch(`/disponibilidades/${id}`, data);
    return true;
  } catch (error: any) {
    console.error('Error al actualizar disponibilidad:', error);
    return false;
  }
}

// ============ PACIENTES DEL MÉDICO ============

export async function getMisPacientes(): Promise<Paciente[]> {
  try {
    const response = await api.get<any>('/medicos/me/pacientes');
    return response.data.data?.pacientes || response.data.pacientes || [];
  } catch (error: any) {
    console.error('Error al obtener mis pacientes:', error);
    return [];
  }
}

export async function getPacienteById(id: string): Promise<Paciente | null> {
  try {
    const response = await api.get<any>(`/pacientes/${id}`);
    return response.data.data?.paciente || response.data.paciente || null;
  } catch (error: any) {
    console.error('Error al obtener paciente:', error);
    return null;
  }
}

export async function getHistorialPaciente(idPaciente: string): Promise<any[]> {
  try {
    const response = await api.get<any>(`/consultas/paciente/${idPaciente}`);
    return response.data.data?.consultas || response.data.consultas || [];
  } catch (error: any) {
    console.error('Error al obtener historial:', error);
    return [];
  }
}

// ============ ESTADÍSTICAS DEL MÉDICO ============

export async function getMedicoStats(): Promise<MedicoStats> {
  try {
    const response = await api.get<any>('/medicos/me/stats');
    return response.data.data || response.data;
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    return {
      citasHoy: 0,
      citasPendientes: 0,
      pacientesTotales: 0,
      calificacion: 0,
      ingresosMes: 0,
      consultasCompletadas: 0,
    };
  }
}

// ============ RESEÑAS ============

export async function getMisResenas(): Promise<Review[]> {
  try {
    const response = await api.get<any>('/resenas/medico/me');
    return response.data.data?.resenas || response.data.resenas || [];
  } catch (error: any) {
    console.error('Error al obtener reseñas:', error);
    return [];
  }
}

export async function responderResena(idResena: string, respuesta: string): Promise<boolean> {
  try {
    await api.patch(`/resenas/${idResena}/responder`, { respuesta });
    return true;
  } catch (error: any) {
    console.error('Error al responder reseña:', error);
    return false;
  }
}

// ============ CITAS DEL MÉDICO ============

export async function getCitasHoy(): Promise<any[]> {
  try {
    const response = await api.get<any>('/citas/medico/hoy');
    return response.data.data?.citas || response.data.citas || [];
  } catch (error: any) {
    console.error('Error al obtener citas de hoy:', error);
    return [];
  }
}

export async function confirmarCita(idCita: string): Promise<boolean> {
  try {
    await api.patch(`/citas/${idCita}/confirmar`);
    return true;
  } catch (error: any) {
    console.error('Error al confirmar cita:', error);
    return false;
  }
}

export async function completarCita(idCita: string): Promise<boolean> {
  try {
    await api.patch(`/citas/${idCita}/completar`);
    return true;
  } catch (error: any) {
    console.error('Error al completar cita:', error);
    return false;
  }
}
