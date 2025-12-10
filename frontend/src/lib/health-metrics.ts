// ============================================
// API CLIENT PARA MÉTRICAS DE SALUD
// ============================================

import api from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface MetricaSalud {
  id: string;
  idPaciente: string;
  ritmoCardiaco?: number;
  presionSistolica?: number;
  presionDiastolica?: number;
  glucosa?: number;
  peso?: number;
  altura?: number;
  temperatura?: number;
  saturacionOxigeno?: number;
  notas?: string;
  fechaRegistro: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export interface CreateMetricaSaludDTO {
  // Solo estos campos pueden ser ingresados por el paciente
  // Los demás (ritmoCardiaco, presionArterial, glucosa) se calculan automáticamente
  peso?: number;
  altura?: number;
  temperatura?: number;
  saturacionOxigeno?: number;
  notas?: string;
  fechaRegistro?: string;
}

/**
 * Crear nueva métrica de salud
 */
export async function crearMetrica(data: CreateMetricaSaludDTO): Promise<MetricaSalud> {
  console.log('📤 Enviando request a:', `${API_URL}/metricas-salud`);
  console.log('📤 Datos a enviar:', data);
  
  try {
    const response = await api.post(`${API_URL}/metricas-salud`, data);
    console.log('✅ Respuesta recibida:', response.data);
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Error completo:', error);
    console.error('❌ Error tipo:', typeof error);
    console.error('❌ Error es AxiosError:', error?.isAxiosError);
    
    if (error?.isAxiosError) {
      console.error('❌ Error response:', error.response);
      console.error('❌ Error response data:', error.response?.data);
      console.error('❌ Error response status:', error.response?.status);
      console.error('❌ Error request:', error.request);
      console.error('❌ Error message:', error.message);
    } else {
      console.error('❌ Error response:', error?.response);
      console.error('❌ Error response data:', error?.response?.data);
      console.error('❌ Error response status:', error?.response?.status);
    }
    
    // Si el error no tiene la estructura esperada, crear uno nuevo con más información
    if (!error?.response && !error?.message) {
      const errorMessage = error?.request 
        ? 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
        : 'Error desconocido al guardar la métrica';
      const newError: any = new Error(errorMessage);
      newError.response = error?.response;
      newError.request = error?.request;
      newError.isAxiosError = error?.isAxiosError;
      throw newError;
    }
    
    // Re-lanzar el error para que el componente lo maneje
    throw error;
  }
}

/**
 * Obtener mis métricas de salud
 */
export async function obtenerMisMetricas(limit: number = 30): Promise<MetricaSalud[]> {
  const response = await api.get(`${API_URL}/metricas-salud/mis-metricas`, {
    params: { limit }
  });
  return response.data.data;
}

/**
 * Obtener la última métrica de salud
 */
export async function obtenerUltimaMetrica(): Promise<MetricaSalud | null> {
  const response = await api.get(`${API_URL}/metricas-salud/ultima`);
  return response.data.data;
}

/**
 * Actualizar métrica de salud
 */
export async function actualizarMetrica(id: string, data: Partial<CreateMetricaSaludDTO>): Promise<MetricaSalud> {
  const response = await api.put(`${API_URL}/metricas-salud/${id}`, data);
  return response.data.data;
}

/**
 * Eliminar métrica de salud
 */
export async function eliminarMetrica(id: string): Promise<void> {
  await api.delete(`${API_URL}/metricas-salud/${id}`);
}

