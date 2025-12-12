import { useState, useEffect } from 'react';
import { Star, X, User, Calendar, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui';
import { Review, getReviewsByDoctor } from '@/lib/reviews';
import { Doctor } from '@/lib/doctors';

interface DoctorReviewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    doctor: Doctor | null;
    onRateClick: () => void; // Function to open the Rate Form
}

export function DoctorReviewsModal({ isOpen, onClose, doctor, onRateClick }: DoctorReviewsModalProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && doctor) {
            loadReviews();
        }
    }, [isOpen, doctor]);

    const loadReviews = async () => {
        if (!doctor) return;
        setLoading(true);
        try {
            const data = await getReviewsByDoctor(doctor.id);
            setReviews(data);
        } catch (error) {
            console.error('Error loading reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !doctor) return null;

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            Dr. {doctor.usuario.nombre} {doctor.usuario.apellido}
                        </h3>
                        <p className="text-teal-600 font-medium">{doctor.especialidad?.nombre}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Stats Content */}
                <div className="p-6 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-2xl p-4 min-w-[120px]">
                            <span className="text-4xl font-bold text-gray-900">{Number(doctor.calificacionPromedio).toFixed(1)}</span>
                            <div className="flex gap-1 my-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= Number(doctor.calificacionPromedio)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-gray-500">{doctor.totalResenas} reseñas</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 mb-2">
                                Las reseñas son verificadas de pacientes que han completado citas con este médico.
                            </p>
                            <Button onClick={onRateClick} variant="primary" className="shadow-lg">
                                Escribir mi reseña
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-900">Aún no hay reseñas</h4>
                            <p className="text-gray-500 mt-1">Sé el primero en calificar a este médico.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold">
                                                {review.anonima ? (
                                                    <User className="w-5 h-5" />
                                                ) : (
                                                    'P' // O iniciales si vinieran en el DTO
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {review.anonima ? 'Paciente Anónimo' : 'Paciente Verificado'}
                                                </p>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-3 h-3 ${star <= review.calificacion
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-300'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(review.fechaCreacion).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {review.comentario && (
                                        <p className="text-gray-700 leading-relaxed text-sm">
                                            {review.comentario}
                                        </p>
                                    )}

                                    {/* Respuesta del médico */}
                                    {review.respuesta && (
                                        <div className="mt-4 pl-4 border-l-2 border-teal-200">
                                            <p className="text-xs font-bold text-teal-700 mb-1">Respuesta del Doctor:</p>
                                            <p className="text-sm text-gray-600">{review.respuesta}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
