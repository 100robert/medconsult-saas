import api from './api';

export interface CreateReviewData {
    idMedico: string;
    idCita: string;
    calificacion: number;
    comentario?: string;
    anonima?: boolean;
}

export interface Review {
    id: string;
    idMedico: string;
    idPaciente: string;
    idCita: string;
    calificacion: number;
    comentario?: string;
    respuesta?: string;
    fechaRespuesta?: string;
    anonima: boolean;
    verificada: boolean;
    estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
    fechaCreacion: string;
}

export async function createReview(data: CreateReviewData): Promise<Review> {
    const response = await api.post<{ success: boolean; data: Review }>('/resenas', data);
    return response.data.data;
}

export async function getReviewsByDoctor(idMedico: string): Promise<Review[]> {
    try {
        const response = await api.get<{ success: boolean; data: Review[] }>(`/resenas/medico/${idMedico}`);
        return response.data.data;
    } catch (error) {
        return [];
    }
}

export async function getMyReviews(): Promise<Review[]> {
    try {
        // Asumiendo que existe un endpoint para obtener mis reseñas como paciente, 
        // si no existe, tendremos que filtrar las públicas o las de citas.
        // El backend tiene /resenas/paciente/:id, pero necesitamos el ID.
        // Por ahora, usaremos getMisCitas en el UI para verificar si ya comenté.
        return [];
    } catch (error) {
        return [];
    }
}
