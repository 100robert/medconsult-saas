import api from './api';
import { User } from './auth';

export interface Payment {
    id: string;
    idPaciente: string;
    idMedico: string;
    idCita?: string;
    monto: number;
    estado: 'COMPLETADO' | 'PENDIENTE' | 'FALLIDO' | 'REEMBOLSADO';
    metodoPago: string;
    fecha: string;
    concepto: string;
    referencia?: string;
    paciente?: {
        nombre: string;
        apellido: string;
        email: string;
    };
    medico?: {
        nombre: string;
        apellido: string;
        especialidad?: string;
    };
    creadoEn: string;
    actualizadoEn: string;
}

export interface PaymentStats {
    totalIngresos: number;
    pagosCompletados: number;
    pagosPendientes: number;
    reembolsos: number;
}

// Obtener detalles del perfil asociado (Medico o Paciente) para obtener su ID
async function getProfileId(role: string): Promise<string | null> {
    try {
        if (role === 'PACIENTE') {
            const response = await api.get('/pacientes/me');
            return response.data.data?.id || response.data.id;
        } else if (role === 'MEDICO') {
            const response = await api.get('/medicos/me');
            return response.data.data?.id || response.data.id;
        }
    } catch (error) {
        console.error(`Error al obtener perfil de ${role}:`, error);
    }
    return null;
}

// Obtener mis pagos
export async function getMisPagos(user: User): Promise<Payment[]> {
    try {
        if (user.rol === 'ADMIN') {
            // Para admin, obtenemos todos (endpoint específico o resumen)
            // Como no hay endpoint de "listar todos" simple en las rutas, usaremos resumen o una lista vacía por ahora
            // O podemos intentar filtrar por fecha amplia.
            // Revisando las rutas, no hay un 'GET /' para listar todo sin filtros.
            // Usaremos un mock o una llamada segura.
            // INTENTO: obtenerResumen puede devolver datos, o lo simularemos si no.
            return [];
        }

        const profileId = await getProfileId(user.rol);
        if (!profileId) throw new Error('No se pudo identificar el perfil del usuario');

        let endpoint = '';
        if (user.rol === 'PACIENTE') {
            endpoint = `/pagos/paciente/${profileId}`;
        } else if (user.rol === 'MEDICO') {
            endpoint = `/pagos/medico/${profileId}`;
        }

        const response = await api.get<any>(endpoint);

        // La respuesta del controller es { success: true, pagos: [], total: ... } (según '...resultado')
        // O podría ser { success: true, data: [] }. Verifiquemos con cuidado.
        // Asumiremos que devuelve { pagos: [...] } en la rta.
        return response.data.data?.pagos || response.data.pagos || [];

    } catch (error) {
        console.error('Error al obtener mis pagos:', error);
        return [];
    }
}

// Obtener un pago por ID
export async function getPagoById(id: string): Promise<Payment | null> {
    try {
        const response = await api.get<{ success: boolean; data: Payment }>(`/pagos/${id}`);
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener pago:', error);
        return null;
    }
}

// Crear intención de pago
export async function createPago(data: Partial<Payment>): Promise<Payment> {
    const response = await api.post<{ success: boolean; data: Payment }>('/pagos', data);
    return response.data.data;
}

// Procesar pago (simulación)
export async function procesarPago(id: string, datosPago: any): Promise<Payment> {
    const response = await api.post<{ success: boolean; data: Payment }>(`/pagos/${id}/procesar`, datosPago);
    return response.data.data;
}

// Cancelar pago
export async function cancelarPago(id: string, motivo: string): Promise<Payment> {
    const response = await api.post<{ success: boolean; data: Payment }>(`/pagos/${id}/cancelar`, { motivo });
    return response.data.data;
}

// ============================================
// GANANCIAS (MÉDICO)
// ============================================

export interface GananciasMedico {
    ingresosBrutos: number;
    comisionRetenida: number;
    ingresosNetos: number;
    cantidadConsultas: number;
    porcentajeComision: number;
    pendientes: {
        monto: number;
        cantidad: number;
    };
    ultimosPagos: {
        id: string;
        fecha: string;
        montoBruto: number;
        comision: number;
        montoNeto: number;
        paciente: string;
        estado: string;
    }[];
}

// Obtener mis ganancias (médico autenticado)
export async function getMisGanancias(): Promise<GananciasMedico | null> {
    try {
        const response = await api.get<{ success: boolean; data: GananciasMedico }>('/pagos/me/ganancias');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener mis ganancias:', error);
        return null;
    }
}

// ============================================
// COMISIONES (ADMIN)
// ============================================

export interface ComisionesPlataforma {
    totalBruto: number;
    totalComisionPlataforma: number;
    totalPagadoMedicos: number;
    cantidadTransacciones: number;
    porcentajeComision: number;
    porMes: {
        mes: string;
        totalBruto: number;
        totalComision: number;
        totalMedicos: number;
        cantidad: number;
    }[];
}

// Obtener resumen de comisiones (solo admin)
export async function getComisionesPlataforma(): Promise<ComisionesPlataforma | null> {
    try {
        const response = await api.get<{ success: boolean; data: ComisionesPlataforma }>('/pagos/admin/comisiones');
        return response.data.data;
    } catch (error) {
        console.error('Error al obtener comisiones:', error);
        return null;
    }
}

