import api from './api';

export interface Especialidad {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface Doctor {
  id: string;
  idUsuario: string;
  numeroLicencia: string;
  especialidad: Especialidad;
  biografia?: string;
  aniosExperiencia: number;
  precioPorConsulta: number;
  duracionConsulta: number;
  calificacionPromedio: number;
  totalResenas: number;
  estado: string;
  aceptaNuevosPacientes: boolean;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono?: string;
    imagenPerfil?: string;
  };
}

export interface BuscarMedicosParams {
  especialidad?: string;
  calificacionMinima?: number;
  precioMinimo?: number;
  precioMaximo?: number;
  aceptaNuevosPacientes?: boolean;
  page?: number;
  limit?: number;
  ordenarPor?: 'calificacion' | 'precio' | 'experiencia';
  orden?: 'asc' | 'desc';
}

export interface BuscarMedicosResponse {
  success: boolean;
  medicos: Doctor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Buscar médicos con filtros
export async function buscarMedicos(params: BuscarMedicosParams = {}): Promise<Doctor[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.especialidad) queryParams.append('especialidad', params.especialidad);
    if (params.calificacionMinima) queryParams.append('calificacionMinima', params.calificacionMinima.toString());
    if (params.precioMinimo) queryParams.append('precioMinimo', params.precioMinimo.toString());
    if (params.precioMaximo) queryParams.append('precioMaximo', params.precioMaximo.toString());
    if (params.aceptaNuevosPacientes !== undefined) queryParams.append('aceptaNuevosPacientes', params.aceptaNuevosPacientes.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.ordenarPor) queryParams.append('ordenarPor', params.ordenarPor);
    if (params.orden) queryParams.append('orden', params.orden);

    const url = `/medicos/buscar${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<BuscarMedicosResponse>(url);
    
    return response.data.medicos || [];
  } catch (error: any) {
    console.error('Error al buscar médicos:', error);
    return [];
  }
}

// Obtener médico por ID
export async function getMedicoById(id: string): Promise<Doctor | null> {
  try {
    const response = await api.get<{ success: boolean; data: Doctor }>(`/medicos/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error al obtener médico:', error);
    return null;
  }
}

// Obtener todas las especialidades
export async function getEspecialidades(): Promise<Especialidad[]> {
  try {
    const response = await api.get<{ success: boolean; data: Especialidad[] }>('/especialidades');
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error al obtener especialidades:', error);
    return [];
  }
}
