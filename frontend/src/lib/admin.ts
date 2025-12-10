import api from './api';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  rol: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  activo: boolean;
  correoVerificado: boolean;
  creadoEn: string;
}

export interface Medico {
  id: string;
  idUsuario: string;
  especialidadId: string;
  numeroLicencia: string;
  verificado: boolean;
  descripcion?: string;
  precioConsulta?: number;
  usuario?: User;
  especialidad?: {
    id: string;
    nombre: string;
  };
}

export interface AdminStats {
  totalUsuarios: number;
  totalMedicos: number;
  totalPacientes: number;
  medicosPendientes: number;
  usuariosActivos?: number;
  usuariosInactivos?: number;
  // Campos opcionales que vendrán de otros endpoints
  citasHoy?: number;
  citasSemana?: number;
  ingresosMes?: number;
}

// ============ USUARIOS (ADMIN) ============

export interface GetUsersParams {
  rol?: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  activo?: boolean;
  busqueda?: string;
  page?: number;
  limit?: number;
}

export interface GetUsersResponse {
  usuarios: User[];
  total: number;
  page: number;
  totalPages: number;
}

export async function getAllUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (params?.rol) queryParams.append('rol', params.rol);
    if (params?.activo !== undefined) queryParams.append('activo', String(params.activo));
    if (params?.busqueda) queryParams.append('busqueda', params.busqueda);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));

    const url = `/auth/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<any>(url);
    
    return {
      usuarios: response.data.data?.usuarios || response.data.usuarios || [],
      total: response.data.data?.total || response.data.total || 0,
      page: response.data.data?.page || response.data.page || 1,
      totalPages: response.data.data?.totalPages || response.data.totalPages || 1,
    };
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    return { usuarios: [], total: 0, page: 1, totalPages: 1 };
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await api.get<any>(`/usuarios/${id}`);
    return response.data.data?.usuario || response.data.usuario || null;
  } catch (error: any) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

export async function updateUserStatus(id: string, activo: boolean): Promise<boolean> {
  try {
    await api.patch(`/auth/admin/users/${id}/status`, { activo });
    return true;
  } catch (error: any) {
    console.error('Error al actualizar estado:', error);
    return false;
  }
}

// ============ MÉDICOS (ADMIN) ============

export async function getAllMedicos(): Promise<Medico[]> {
  try {
    const response = await api.get<any>('/medicos');
    return response.data.data?.medicos || response.data.medicos || [];
  } catch (error: any) {
    console.error('Error al obtener médicos:', error);
    return [];
  }
}

export async function getMedicosPendientes(): Promise<Medico[]> {
  try {
    const response = await api.get<any>('/medicos?verificado=false');
    return response.data.data?.medicos || response.data.medicos || [];
  } catch (error: any) {
    console.error('Error al obtener médicos pendientes:', error);
    return [];
  }
}

export async function verificarMedico(id: string, verificado: boolean): Promise<boolean> {
  try {
    await api.patch(`/medicos/${id}/verificar`, { verificado });
    return true;
  } catch (error: any) {
    console.error('Error al verificar médico:', error);
    return false;
  }
}

// ============ PACIENTES (ADMIN) ============

export async function getAllPacientes(): Promise<any[]> {
  try {
    const response = await api.get<any>('/pacientes');
    return response.data.data?.pacientes || response.data.pacientes || [];
  } catch (error: any) {
    console.error('Error al obtener pacientes:', error);
    return [];
  }
}

// ============ ESTADÍSTICAS (ADMIN) ============

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const response = await api.get<any>('/auth/admin/stats');
    return response.data.data || response.data || {
      totalUsuarios: 0,
      totalMedicos: 0,
      totalPacientes: 0,
      medicosPendientes: 0,
      citasHoy: 0,
      citasSemana: 0,
      ingresosMes: 0,
    };
  } catch (error: any) {
    console.error('Error al obtener estadísticas:', error);
    return {
      totalUsuarios: 0,
      totalMedicos: 0,
      totalPacientes: 0,
      medicosPendientes: 0,
      citasHoy: 0,
      citasSemana: 0,
      ingresosMes: 0,
    };
  }
}

// ============ ESPECIALIDADES ============

export interface Especialidad {
  id: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
}

export async function getEspecialidades(): Promise<Especialidad[]> {
  try {
    const response = await api.get<any>('/especialidades');
    // La respuesta es { success: true, data: [...] }
    // data es directamente el array de especialidades
    const data = response.data?.data;
    // Asegurar que siempre retorne un array
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error('Error al obtener especialidades:', error);
    return [];
  }
}

export async function createEspecialidad(data: Partial<Especialidad>): Promise<Especialidad | null> {
  try {
    const response = await api.post<any>('/especialidades', data);
    return response.data.data?.especialidad || response.data.especialidad || null;
  } catch (error: any) {
    console.error('Error al crear especialidad:', error);
    return null;
  }
}

export async function deleteEspecialidad(id: string): Promise<boolean> {
  try {
    await api.delete(`/especialidades/${id}`);
    return true;
  } catch (error: any) {
    console.error('Error al eliminar especialidad:', error);
    return false;
  }
}

// ============ CREAR USUARIO ============

export interface CreateUserData {
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol: 'PACIENTE' | 'MEDICO' | 'ADMIN';
  telefono?: string;
  correoVerificado?: boolean;
  activo?: boolean;
  // Campos específicos para médico
  numeroLicencia?: string;
  idEspecialidad?: string;
  precioPorConsulta?: number;
  moneda?: string;
  duracionConsulta?: number;
  aniosExperiencia?: number;
  biografia?: string;
  educacion?: string;
  certificaciones?: string;
  subespecialidades?: string;
  idiomas?: string[];
}

export async function createUser(data: CreateUserData): Promise<{ success: boolean; user?: User; error?: string; errors?: Array<{campo: string; mensaje: string}> }> {
  try {
    const response = await api.post<any>('/auth/admin/create-user', data);
    return { 
      success: true, 
      user: response.data.data?.usuario || response.data.usuario || response.data 
    };
  } catch (error: any) {
    console.error('Error al crear usuario:', error.response?.data);
    
    // Si hay errores de validación detallados
    const validationErrors = error.response?.data?.errors;
    if (validationErrors && Array.isArray(validationErrors)) {
      // Formatear errores para mostrar
      const formattedErrors = validationErrors.map((e: any) => ({
        campo: e.campo || e.path?.join('.') || 'desconocido',
        mensaje: e.mensaje || e.message || 'Error de validación'
      }));
      
      // Crear mensaje legible
      const errorMessage = formattedErrors.map((e: any) => `${e.campo}: ${e.mensaje}`).join('\n');
      
      return { 
        success: false, 
        error: errorMessage,
        errors: formattedErrors
      };
    }
    
    const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || 'Error al crear usuario';
    return { success: false, error: errorMessage };
  }
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    await api.delete(`/auth/admin/users/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || 'Error al eliminar usuario';
    return { success: false, error: errorMessage };
  }
}

// ============ ACTUALIZAR USUARIO ============

export interface UpdateUserData {
  nombre?: string;
  apellido?: string;
  correo?: string;
  telefono?: string;
  rol?: 'PACIENTE' | 'MEDICO' | 'ADMIN';
  activo?: boolean;
  correoVerificado?: boolean;
}

export async function updateUser(id: string, data: UpdateUserData): Promise<{ success: boolean; user?: User; error?: string; errors?: Array<{campo: string; mensaje: string}> }> {
  try {
    const response = await api.patch<any>(`/auth/admin/users/${id}`, data);
    return { 
      success: true, 
      user: response.data.data?.usuario || response.data.usuario || response.data 
    };
  } catch (error: any) {
    console.error('Error al actualizar usuario:', error.response?.data);
    
    // Si hay errores de validación detallados
    const validationErrors = error.response?.data?.errors;
    if (validationErrors && Array.isArray(validationErrors)) {
      const formattedErrors = validationErrors.map((e: any) => ({
        campo: e.campo || e.path?.join('.') || 'desconocido',
        mensaje: e.mensaje || e.message || 'Error de validación'
      }));
      const errorMessage = formattedErrors.map((e: any) => `${e.campo}: ${e.mensaje}`).join('\n');
      return { success: false, error: errorMessage, errors: formattedErrors };
    }
    
    const errorMessage = error.response?.data?.mensaje || error.response?.data?.message || 'Error al actualizar usuario';
    return { success: false, error: errorMessage };
  }
}
