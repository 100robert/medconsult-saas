import api from './api';

export type EstadoConsulta = 'EN_PROGRESO' | 'COMPLETADA' | 'CANCELADA';
export type TipoConsulta = 'CHAT' | 'VIDEO' | 'HIBRIDA';

export interface Receta {
  id: string;
  medicamentos: any[];
  instrucciones?: string;
  duracionTratamiento?: string;
  fechaEmision: string;
  estado: string;
}

export interface Consulta {
  id: string;
  idCita: string;
  fechaInicio: string;
  fechaFin?: string;
  duracion?: number;
  tipoConsulta: TipoConsulta;
  notas?: string;
  diagnostico?: string;
  tratamiento?: string;
  requiereSeguimiento: boolean;
  fechaSeguimiento?: string;
  estado: EstadoConsulta;
  cita: {
    id: string;
    fechaHoraCita: string;
    motivo?: string;
    paciente: {
      id: string;
      usuario: {
        nombre: string;
        apellido: string;
        correo: string;
        imagenPerfil?: string;
      };
    };
    medico: {
      id: string;
      usuario: {
        nombre: string;
        apellido: string;
        correo: string;
        imagenPerfil?: string;
      };
      especialidad?: {
        nombre: string;
      };
    };
  };
  recetas: Receta[];
  creadoEn: string;
  actualizadoEn: string;
}

interface ConsultasResponse {
  success: boolean;
  data: Consulta[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Obtener mis consultas (usuario autenticado)
export async function getMisConsultas(): Promise<Consulta[]> {
  try {
    const response = await api.get<ConsultasResponse>('/consultas/mis-consultas');
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error al obtener mis consultas:', error?.message || error);
    // Devolver array vacío en cualquier error para no romper la UI
    return [];
  }
}

// Obtener consulta por ID
export async function getConsultaById(id: string): Promise<Consulta> {
  const response = await api.get<{ success: boolean; data: Consulta }>(`/consultas/${id}`);
  return response.data.data;
}

// Obtener estadísticas de consultas
export async function getEstadisticasConsultas(): Promise<{
  total: number;
  enProgreso: number;
  completadas: number;
  canceladas: number;
  tasaCompletacion: string;
}> {
  const response = await api.get<{ success: boolean; data: any }>('/consultas/estadisticas/resumen');
  return response.data.data;
}

// ============================================
// HISTORIAL DE ATENCIONES (para médicos)
// ============================================

export interface PacienteAtendido {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  ultimaConsulta: string;
  totalConsultas: number;
  proximaCita?: string;
  imagenPerfil?: string;
  // Nuevos campos según diseño
  ultimoDiagnostico?: string;
  ultimoTratamiento?: string;
  recetasActivas?: number;
}

// Obtener pacientes atendidos por el médico (para historial)
export async function getMisPacientes(idMedico: string): Promise<PacienteAtendido[]> {
  try {
    const response = await api.get<{ success: boolean; data: PacienteAtendido[] }>(
      `/citas/medico/${idMedico}/pacientes`
    );
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error al obtener pacientes:', error?.message || error);
    return [];
  }
}

// Obtener historial de consultas de un paciente específico
export async function getHistorialPaciente(idPaciente: string): Promise<Consulta[]> {
  try {
    const response = await api.get<ConsultasResponse>(`/consultas/paciente/${idPaciente}`);
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error al obtener historial del paciente:', error?.message || error);
    return [];
  }
}
