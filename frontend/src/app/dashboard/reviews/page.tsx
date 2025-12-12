'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Filter,
  Send,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { getMisResenas, responderResena, Review } from '@/lib/medico';
import { toast } from 'sonner';

export default function ReviewsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [filterRating, setFilterRating] = useState<string>('all');

  // State for replying
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (user && user.rol !== 'MEDICO') {
      router.push('/dashboard');
      return;
    }

    if (user) {
      fetchReviews();
    }
  }, [user, router]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getMisResenas();
      setReviews(data);

      if (data.length > 0) {
        const avg = data.reduce((acc, r) => acc + r.calificacion, 0) / data.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      toast.error('Error al cargar las reseñas');
    } finally {
      setLoading(false);
    }
  };

  const handleStartReply = (id: string) => {
    setReplyingId(id);
    setReplyText('');
  };

  const handleCancelReply = () => {
    setReplyingId(null);
    setReplyText('');
  };

  const handleSubmitReply = async (id: string) => {
    if (!replyText.trim()) return;

    try {
      setSubmittingReply(true);
      const success = await responderResena(id, replyText);

      if (success) {
        toast.success('Respuesta enviada correctamente');
        // Update local state
        setReviews(prev => prev.map(r =>
          r.id === id ? { ...r, respuesta: replyText } : r
        ));
        handleCancelReply();
      } else {
        toast.error('No se pudo enviar la respuesta');
      }
    } catch (error) {
      toast.error('Error al enviar la respuesta');
    } finally {
      setSubmittingReply(false);
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
                  {review.paciente ? (
                    `${review.paciente.nombre?.[0] || 'P'}${review.paciente.apellido?.[0] || 'A'}`
                  ) : (
                    'AN'
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {review.paciente
                      ? `${review.paciente.nombre} ${review.paciente.apellido}`
                      : 'Paciente Anónimo'
                    }
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(review.calificacion)}</div>
                    <span className="text-sm text-gray-500">
                      {new Date(review.creadoEn || new Date()).toLocaleDateString('es-ES')}
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
            ) : replyingId === review.id ? (
              <div className="space-y-3 mt-4 animate-in fade-in slide-in-from-top-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Escribe tu respuesta al paciente..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent min-h-[100px]"
                  disabled={submittingReply}
                />
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCancelReply}
                    className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    disabled={submittingReply}
                  >
                    <X className="w-4 h-4" /> Cancelar
                  </button>
                  <button
                    onClick={() => handleSubmitReply(review.id)}
                    disabled={!replyText.trim() || submittingReply}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReply ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Enviar respuesta
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleStartReply(review.id)}
                className="text-sm text-teal-600 font-medium hover:text-teal-700"
              >
                Responder a esta reseña
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Star className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {reviews.length === 0 ? 'No tienes reseñas todavía' : 'No hay reseñas con esta calificación'}
          </p>
        </div>
      )}
    </div>
  );
}
