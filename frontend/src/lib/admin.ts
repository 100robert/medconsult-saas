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
    const response = await api.get<any>('/medicos?estado=PENDIENTE');
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

export async function createUser(data: CreateUserData): Promise<{ success: boolean; user?: User; error?: string; errors?: Array<{ campo: string; mensaje: string }> }> {
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

export async function updateUser(id: string, data: UpdateUserData): Promise<{ success: boolean; user?: User; error?: string; errors?: Array<{ campo: string; mensaje: string }> }> {
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

// ============ ACTIVIDAD DE LA PLATAFORMA ============

export interface PlatformActivity {
  id: string;
  type: 'cita' | 'consulta' | 'pago' | 'registro' | 'resena';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  amount?: number;
  status?: string;
}

// ... (interfaces previous)

export interface GraphDataPoint {
  name: string; // Fecha o Mes
  citas: number;
  ingresos: number;
  fullDate: string; // Para sorting y key única
}

export interface ActivitySummary {
  citasHoy: number;
  citasSemana: number;
  consultasCompletadas: number;
  ingresosMes: number;
  activities: PlatformActivity[];
  graphData: GraphDataPoint[];
}

export async function getPlatformActivity(range: '30d' | '90d' | '1y' = '30d'): Promise<ActivitySummary> {
  try {
    // Calcular fechas según rango
    const now = new Date();
    const startDate = new Date();
    let limit = 100; // Default limit

    if (range === '30d') {
      startDate.setDate(now.getDate() - 30);
      limit = 300; // Intentar traer suficientes registros para 30 días
    } else if (range === '90d') {
      startDate.setDate(now.getDate() - 90);
      limit = 1000;
    } else {
      startDate.setFullYear(now.getFullYear() - 1);
      limit = 5000;
    }

    // Obtener datos del sistema (con límites más altos para tener historial)
    const [citasResponse, pagosResponse] = await Promise.all([
      api.get<any>(`/citas/admin/recent?limit=${limit}`).catch(() => ({ data: { data: [] } })),
      api.get<any>(`/pagos/admin/recent?limit=${limit}`).catch(() => ({ data: { data: [] } }))
    ]);

    const citas = citasResponse.data?.data || citasResponse.data || [];
    const pagos = pagosResponse.data?.data || pagosResponse.data || [];

    // --- Procesar Actividades Recientes (Feed) ---
    const activities: PlatformActivity[] = [];

    if (Array.isArray(citas)) {
      citas.slice(0, 20).forEach((cita: any) => { // Solo las 20 más recientes para el feed
        const pacienteNombre = cita.paciente?.usuario?.nombre || cita.paciente?.nombre || 'Paciente';
        const medicoNombre = cita.medico?.usuario?.nombre || cita.medico?.nombre || 'Médico';

        activities.push({
          id: cita.id,
          type: 'cita',
          title: 'Nueva cita programada',
          description: `${pacienteNombre} con Dr. ${medicoNombre}`,
          timestamp: cita.fechaCreacion || cita.fechaHoraCita || new Date().toISOString(),
          status: cita.estado
        });
      });
    }

    if (Array.isArray(pagos)) {
      pagos.slice(0, 20).forEach((pago: any) => {
        activities.push({
          id: pago.id,
          type: 'pago',
          title: 'Pago recibido',
          description: `S/ ${Number(pago.monto || 0).toFixed(2)}`,
          timestamp: pago.fechaPago || pago.fechaCreacion || new Date().toISOString(),
          amount: Number(pago.monto || 0),
          status: pago.estado
        });
      });
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const inicioDeSemana = new Date(hoy);
    inicioDeSemana.setDate(hoy.getDate() - hoy.getDay()); // Domingo
    const finDeSemana = new Date(inicioDeSemana);
    finDeSemana.setDate(finDeSemana.getDate() + 7);

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    let citasHoy = 0;
    let citasSemana = 0;
    let consultasCompletadas = 0;
    let ingresosMes = 0;

    if (Array.isArray(citas)) {
      citas.forEach((cita: any) => {
        const fechaCita = new Date(cita.fechaHoraCita || cita.fechaCreacion);

        // Citas Hoy: Entre hoy 00:00 y mañana 00:00
        if (fechaCita >= hoy && fechaCita < manana) citasHoy++;

        // Citas Semana: Entre inicio semana y fin semana
        if (fechaCita >= inicioDeSemana && fechaCita < finDeSemana) citasSemana++;

        if (cita.estado === 'COMPLETADA') consultasCompletadas++;
      });
    }

    if (Array.isArray(pagos)) {
      pagos.forEach((pago: any) => {
        const fechaPago = new Date(pago.fechaPago || pago.fechaCreacion);
        if (fechaPago >= inicioMes && (pago.estado === 'COMPLETADO' || pago.estado === 'APROBADO')) {
          ingresosMes += Number(pago.monto) || 0;
        }
      });
    }

    // --- Generar Datos para la Gráfica ---
    // Agrupar por fecha o mes según el rango
    const graphMap = new Map<string, { citas: number; ingresos: number; date: Date }>();

    // Inicializar el mapa con todos los puntos del rango para que no queden huecos
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      let key = '';
      if (range === '1y') {
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        key = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear().toString().substr(-2)}`; // Ene 24
      } else {
        key = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`; // 15/12
      }

      if (!graphMap.has(key)) {
        graphMap.set(key, { citas: 0, ingresos: 0, date: new Date(currentDate) });
      }

      // Avanzar
      if (range === '1y') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Llenar con datos de Citas
    if (Array.isArray(citas)) {
      citas.forEach((cita: any) => {
        const date = new Date(cita.fechaHoraCita || cita.fechaCreacion);
        if (date >= startDate && date <= now) {
          let key = '';
          if (range === '1y') {
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
          } else {
            key = `${date.getDate()}/${date.getMonth() + 1}`;
          }

          if (graphMap.has(key)) {
            const entry = graphMap.get(key)!;
            entry.citas += 1;
          }
        }
      });
    }

    // Llenar con datos de Pagos
    if (Array.isArray(pagos)) {
      pagos.forEach((pago: any) => {
        const date = new Date(pago.fechaPago || pago.fechaCreacion);
        if (date >= startDate && date <= now && (pago.estado === 'COMPLETADO' || pago.estado === 'APROBADO')) {
          let key = '';
          if (range === '1y') {
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
          } else {
            key = `${date.getDate()}/${date.getMonth() + 1}`;
          }

          if (graphMap.has(key)) {
            const entry = graphMap.get(key)!;
            entry.ingresos += Number(pago.monto) || 0;
          }
        }
      });
    }

    // Convertir mapa a array
    const graphData: GraphDataPoint[] = Array.from(graphMap.entries()).map(([name, data]) => ({
      name,
      citas: data.citas,
      ingresos: data.ingresos,
      fullDate: data.date.toISOString()
    }));

    return {
      citasHoy,
      citasSemana,
      consultasCompletadas,
      ingresosMes,
      activities: activities.slice(0, 10),
      graphData
    };

  } catch (error: any) {
    console.error('Error al obtener actividad de plataforma:', error);
    return {
      citasHoy: 0,
      citasSemana: 0,
      consultasCompletadas: 0,
      ingresosMes: 0,
      activities: [],
      graphData: []
    };
  }
}
