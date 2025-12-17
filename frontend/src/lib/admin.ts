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
  ingresosAnio?: number; // Changed from ingresosMes
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
      ingresosAnio: 0, // Changed default
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
      ingresosAnio: 0,
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

export interface GraphDataPoint {
  name: string; // Fecha o Mes
  citas: number;
  ingresos: number;
  fullDate: string; // Para sorting y key única
}

export interface ActivitySummary {
  totalCitas: number;
  citasCanceladas: number;
  consultasCompletadas: number;
  totalIngresos: number;
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

    let totalCitas = 0;
    let citasCanceladas = 0;
    let consultasCompletadas = 0;
    let totalIngresos = 0;

    if (Array.isArray(citas)) {
      citas.forEach((cita: any) => {
        const fechaCita = new Date(cita.fechaHoraCita || cita.fechaCreacion);

        // Filtrar por el rango seleccionado
        if (fechaCita >= startDate && fechaCita <= now) {
          totalCitas++; // Contar todas las citas en el rango

          if (cita.estado === 'CANCELADA') {
            citasCanceladas++;
          }
          if (cita.estado === 'COMPLETADA') {
            consultasCompletadas++;
          }
        }
      });
    }

    if (Array.isArray(pagos)) {
      pagos.forEach((pago: any) => {
        const fechaPago = new Date(pago.fechaPago || pago.fechaCreacion);
        // Filtrar por el rango seleccionado
        if (fechaPago >= startDate && fechaPago <= now && (pago.estado === 'COMPLETADO' || pago.estado === 'APROBADO')) {
          totalIngresos += Number(pago.monto) || 0;
        }
      });
    }

    // --- Generar Datos para la Gráfica ---
    const graphMap = new Map<string, { citas: number; ingresos: number; date: Date }>();

    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      let key = '';
      if (range === '1y') {
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        key = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear().toString().substr(-2)}`;
      } else {
        key = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
      }

      if (!graphMap.has(key)) {
        graphMap.set(key, { citas: 0, ingresos: 0, date: new Date(currentDate) });
      }

      if (range === '1y') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

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

    const graphData: GraphDataPoint[] = Array.from(graphMap.entries()).map(([name, data]) => ({
      name,
      citas: data.citas,
      ingresos: data.ingresos,
      fullDate: data.date.toISOString()
    }));

    return {
      totalCitas,
      citasCanceladas,
      consultasCompletadas,
      totalIngresos,
      activities: activities.slice(0, 10),
      graphData
    };

  } catch (error: any) {
    console.error('Error al obtener actividad de plataforma:', error);
    return {
      totalCitas: 0,
      citasCanceladas: 0,
      consultasCompletadas: 0,
      totalIngresos: 0,
      activities: [],
      graphData: []
    };
  }
}
// ============ REPORTES (ADMIN) ============

export interface ReportData {
  ingresos: { actual: number; anterior: number; variacion: number };
  citas: { total: number; completadas: number; canceladas: number };
  usuarios: { nuevos: number; activos: number; medicos: number };
  especialidades: { nombre: string; citas: number; ingresos: number }[];
  graphData: GraphDataPoint[];
}

export async function getReportsData(period: 'week' | 'month' | 'quarter' | 'year'): Promise<ReportData> {
  try {
    const now = new Date();
    const startDate = new Date();
    const previousStartDate = new Date();
    const previousEndDate = new Date();

    // Configurar fechas
    if (period === 'week') {
      startDate.setDate(now.getDate() - 7);
      previousStartDate.setDate(startDate.getDate() - 7);
      previousEndDate.setDate(startDate.getDate());
    } else if (period === 'month') {
      startDate.setMonth(now.getMonth() - 1);
      previousStartDate.setMonth(startDate.getMonth() - 1);
      previousEndDate.setDate(startDate.getDate());
    } else if (period === 'quarter') {
      startDate.setMonth(now.getMonth() - 3);
      previousStartDate.setMonth(startDate.getMonth() - 3);
      previousEndDate.setDate(startDate.getDate());
    } else { // year
      startDate.setFullYear(now.getFullYear() - 1);
      previousStartDate.setFullYear(startDate.getFullYear() - 1);
      previousEndDate.setDate(startDate.getDate());
    }

    // Traer datos (limit alto para asegurar tener suficientes)
    const [citasResponse, pagosResponse, usersResponse, medicosResponse, especialidadesResponse, pagosPreviosResponse] = await Promise.all([
      api.get<any>(`/citas?limit=2000&desde=${startDate.toISOString()}`).catch(() => ({ data: { data: [] } })),
      api.get<any>(`/pagos?limit=2000&desde=${startDate.toISOString()}`).catch(() => ({ data: { data: [] } })),
      api.get<any>('/auth/admin/users').catch(() => ({ data: { data: { usuarios: [], total: 0 } } })),
      api.get<any>('/medicos').catch(() => ({ data: { data: { medicos: [] } } })),
      api.get<any>('/especialidades').catch(() => ({ data: { data: [] } })),
      api.get<any>(`/pagos?limit=2000&desde=${previousStartDate.toISOString()}&hasta=${previousEndDate.toISOString()}`).catch(() => ({ data: { data: [] } }))
    ]);

    const citas = citasResponse.data?.data || citasResponse.data || [];
    const pagos = pagosResponse.data?.data || pagosResponse.data || [];
    const usuarios = usersResponse.data?.data?.usuarios || usersResponse.data?.usuarios || [];
    const medicos = medicosResponse.data?.data?.medicos || medicosResponse.data?.medicos || [];
    const especialidades = especialidadesResponse.data?.data || especialidadesResponse.data || [];
    const pagosPrevios = pagosPreviosResponse.data?.data || pagosPreviosResponse.data || [];

    // --- Procesar Gráfica ---
    // Reutilizar lógica de admin dashboard
    const graphMap = new Map<string, { citas: number; ingresos: number; date: Date }>();
    const currentDate = new Date(startDate);
    const endDate = new Date(); // now

    // Iterar día por día (o mes por mes si es año)
    while (currentDate <= endDate) {
      let key = '';
      if (period === 'year') {
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        key = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear().toString().substr(-2)}`;
      } else {
        key = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
      }

      if (!graphMap.has(key)) {
        graphMap.set(key, { citas: 0, ingresos: 0, date: new Date(currentDate) });
      }

      if (period === 'year') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // Llenar datos de citas
    citas.forEach((c: any) => {
      const date = new Date(c.fechaHoraCita || c.fechaCreacion);
      if (date >= startDate && date <= endDate) {
        let key = '';
        if (period === 'year') {
          const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
          key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
        } else {
          key = `${date.getDate()}/${date.getMonth() + 1}`;
        }
        if (graphMap.has(key)) {
          graphMap.get(key)!.citas += 1;
        }
      }
    });

    // Llenar datos de pagos
    pagos.forEach((p: any) => {
      if (p.estado === 'COMPLETADO') {
        const date = new Date(p.fechaPago || p.fechaCreacion);
        if (date >= startDate && date <= endDate) {
          let key = '';
          if (period === 'year') {
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            key = `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
          } else {
            key = `${date.getDate()}/${date.getMonth() + 1}`;
          }
          if (graphMap.has(key)) {
            graphMap.get(key)!.ingresos += Number(p.monto) || 0;
          }
        }
      }
    });

    const graphData: GraphDataPoint[] = Array.from(graphMap.values()).map(data => {
      // Recalcular key para name is un poco redundante pero seguro
      let name = '';
      if (period === 'year') {
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        name = `${monthNames[data.date.getMonth()]} ${data.date.getFullYear().toString().substr(-2)}`;
      } else {
        name = `${data.date.getDate()}/${data.date.getMonth() + 1}`;
      }
      return {
        name,
        citas: data.citas,
        ingresos: data.ingresos,
        fullDate: data.date.toISOString()
      };
    });


    // 1. Ingresos (Totales)
    const ingresosActual = pagos
      .filter((p: any) => p.estado === 'COMPLETADO')
      .reduce((acc: number, curr: any) => acc + (Number(curr.monto) || 0), 0);

    const ingresosAnterior = pagosPrevios
      .filter((p: any) => p.estado === 'COMPLETADO')
      .reduce((acc: number, curr: any) => acc + (Number(curr.monto) || 0), 0);

    const variacion = ingresosAnterior === 0
      ? (ingresosActual > 0 ? 100 : 0)
      : ((ingresosActual - ingresosAnterior) / ingresosAnterior) * 100;

    // 2. Citas
    const citasTotal = citas.length;
    const citasCompletadas = citas.filter((c: any) => c.estado === 'COMPLETADA').length;
    const citasCanceladas = citas.filter((c: any) => c.estado === 'CANCELADA').length;

    // 3. Usuarios
    const totalUsuarios = usersResponse.data?.data?.total || usersResponse.data?.total || 0;
    const medicosActivos = medicos.length;
    // Nuevos usuarios en el periodo (aproximación basada en creadoEn si está disponible, sino 0)
    const nuevosUsuarios = usuarios.filter((u: any) => {
      if (!u.creadoEn) return false;
      return new Date(u.creadoEn) >= startDate;
    }).length;

    // 4. Especialidades (Top 5)
    // Mapear ingresos/citas por especialidad
    const mapEsp = new Map<string, { citas: number; ingresos: number, nombre: string }>();

    // Inicializar mapa
    especialidades.forEach((esp: any) => {
      mapEsp.set(esp.id, { nombre: esp.nombre, citas: 0, ingresos: 0 });
    });

    // Procesar Citas para conteo por especialidad
    citas.forEach((c: any) => {
      if (c.medico?.especialidad) {
        const espId = c.medico.especialidad.id;
        if (mapEsp.has(espId)) {
          const entry = mapEsp.get(espId)!;
          entry.citas++;
        }
      }
    });

    // Procesar Pagos para ingresos por especialidad
    pagos.forEach((p: any) => {
      if (p.estado === 'COMPLETADO' && p.medico?.especialidad) {
        const espNombre = p.medico.especialidad.nombre;
        for (const [key, val] of mapEsp.entries()) {
          if (val.nombre === espNombre) {
            val.ingresos += Number(p.monto) || 0;
            break;
          }
        }
      }
    });

    const statsEspecialidades = Array.from(mapEsp.values())
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5); // Top 5

    return {
      ingresos: {
        actual: ingresosActual,
        anterior: ingresosAnterior,
        variacion: Number(variacion.toFixed(1))
      },
      citas: {
        total: citasTotal,
        completadas: citasCompletadas,
        canceladas: citasCanceladas
      },
      usuarios: {
        nuevos: nuevosUsuarios,
        activos: totalUsuarios, // Usamos total como activos por ahora
        medicos: medicosActivos
      },
      especialidades: statsEspecialidades,
      graphData
    };

  } catch (error) {
    console.error('Error getting reports data', error);
    return {
      ingresos: { actual: 0, anterior: 0, variacion: 0 },
      citas: { total: 0, completadas: 0, canceladas: 0 },
      usuarios: { nuevos: 0, activos: 0, medicos: 0 },
      especialidades: [],
      graphData: []
    };
  }
}
