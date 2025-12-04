'use client';

import { useState, useEffect } from 'react';
import { 
  Star,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Filter,
  TrendingUp,
  User
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  paciente: {
    nombre: string;
    apellido: string;
  };
  calificacion: number;
  comentario: string;
  fecha: string;
  respuesta?: string;
}

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [filterRating, setFilterRating] = useState<string>('all');

  useEffect(() => {
    if (user?.rol !== 'MEDICO') {
      router.push('/dashboard');
      return;
    }
    fetchReviews();
  }, [user, router]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockReviews: Review[] = [
        {
          id: '1',
          paciente: { nombre: 'María', apellido: 'González' },
          calificacion: 5,
          comentario: 'Excelente atención, muy profesional y amable. Me explicó todo con detalle y me sentí muy cómoda durante la consulta.',
          fecha: '2025-12-01',
          respuesta: 'Muchas gracias María, fue un gusto atenderla. ¡La esperamos en su próximo control!'
        },
        {
          id: '2',
          paciente: { nombre: 'Juan', apellido: 'Pérez' },
          calificacion: 4,
          comentario: 'Buen médico, muy atento. La espera fue un poco larga pero valió la pena.',
          fecha: '2025-11-28',
        },
        {
          id: '3',
          paciente: { nombre: 'Ana', apellido: 'Rodríguez' },
          calificacion: 5,
          comentario: 'Increíble experiencia. El doctor se tomó el tiempo necesario para responder todas mis dudas.',
          fecha: '2025-11-25',
        },
        {
          id: '4',
          paciente: { nombre: 'Carlos', apellido: 'López' },
          calificacion: 5,
          comentario: 'Muy recomendado. Puntual, profesional y muy claro en sus explicaciones.',
          fecha: '2025-11-20',
        },
        {
          id: '5',
          paciente: { nombre: 'Laura', apellido: 'Fernández' },
          calificacion: 3,
          comentario: 'La consulta estuvo bien pero sentí que fue un poco apresurada.',
          fecha: '2025-11-15',
        },
      ];
      
      setReviews(mockReviews);
      const avg = mockReviews.reduce((acc, r) => acc + r.calificacion, 0) / mockReviews.length;
      setAverageRating(Math.round(avg * 10) / 10);
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(r => {
    if (filterRating === 'all') return true;
    return r.calificacion === Number(filterRating);
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.calificacion === rating).length,
    percentage: reviews.length > 0 
      ? Math.round((reviews.filter(r => r.calificacion === rating).length / reviews.length) * 100)
      : 0
  }));

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Reseñas</h1>
        <p className="text-gray-500 mt-1">Opiniones de tus pacientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-gray-900">{averageRating}</p>
              <div className="flex items-center gap-1 mt-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Calificación promedio</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-gray-900">{reviews.length}</p>
              <p className="text-sm text-gray-500 mt-2">Total de reseñas</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-gray-900">
                {reviews.filter(r => r.calificacion >= 4).length}
              </p>
              <p className="text-sm text-gray-500 mt-2">Reseñas positivas</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <ThumbsUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Calificaciones</h2>
        <div className="space-y-3">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-20">
                <span className="text-sm font-medium text-gray-700">{rating}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 w-16 text-right">{count} ({percentage}%)</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="all">Todas las calificaciones</option>
          <option value="5">5 estrellas</option>
          <option value="4">4 estrellas</option>
          <option value="3">3 estrellas</option>
          <option value="2">2 estrellas</option>
          <option value="1">1 estrella</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-medium">
                  {review.paciente.nombre[0]}{review.paciente.apellido[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {review.paciente.nombre} {review.paciente.apellido}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.calificacion)}</div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.fecha).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.comentario}</p>

            {review.respuesta ? (
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-teal-500">
                <p className="text-sm font-medium text-gray-700 mb-1">Tu respuesta:</p>
                <p className="text-sm text-gray-600">{review.respuesta}</p>
              </div>
            ) : (
              <button className="text-sm text-teal-600 font-medium hover:text-teal-700">
                Responder a esta reseña
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Star className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No hay reseñas con esta calificación</p>
        </div>
      )}
    </div>
  );
}
