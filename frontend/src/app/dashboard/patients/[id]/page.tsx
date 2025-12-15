'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Activity,
    FileText,
    Clock,
    ChevronLeft,
    Pill,
    Stethoscope,
    Droplet,
    AlertTriangle,
    Heart
} from 'lucide-react';
import { Button } from '@/components/ui';
import { getPacienteById, getHistorialPaciente, type Paciente } from '@/lib/medico';
import { useAuthStore } from '@/store/authStore';

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuthStore();
    const [patient, setPatient] = useState<Paciente | null>(null);
    const [consultations, setConsultations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                console.log('🔍 [PatientDetail] Fetching data for patient ID:', id);

                const [patientData, historyData] = await Promise.all([
                    getPacienteById(id),
                    getHistorialPaciente(id)
                ]);

                console.log('🔍 [PatientDetail] Patient data:', patientData);
                console.log('🔍 [PatientDetail] History data:', historyData);

                setPatient(patientData);
                setConsultations(historyData);
            } catch (error) {
                console.error('Error fetching patient details:', error);
            } finally {
                setLoading(false);
            }
        }

        if (user?.rol === 'MEDICO') {
            fetchData();
        } else {
            router.push('/dashboard');
        }
    }, [id, user, router]);

    const calculateAge = (birthDate?: string) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    };

    const formatDate = (date?: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatShortDate = (date?: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Paciente no encontrado</h2>
                <Button variant="outline" onClick={() => router.back()}>
                    Volver
                </Button>
            </div>
        );
    }

    // Extract recetas activas (can be array or number)
    const recetasActivas = Array.isArray(patient.recetasActivas) ? patient.recetasActivas : [];

    return (
        <div className="space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-gray-500 hover:text-gray-900">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Volver
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">Detalles del Paciente</h1>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {patient.nombre[0]}{patient.apellido[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{patient.nombre} {patient.apellido}</h2>
                            <div className="mt-1 flex flex-col gap-1 text-gray-500 text-sm">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {patient.email}
                                </div>
                                {patient.telefono && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        {patient.telefono}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Patient Info Grid */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Edad</p>
                            <p className="font-semibold text-gray-900">{calculateAge(patient.fechaNacimiento)} años</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Género</p>
                            <p className="font-semibold text-gray-900">{patient.genero || 'No especificado'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase flex items-center gap-1">
                                <Droplet className="w-3 h-3" /> Grupo
                            </p>
                            <p className="font-semibold text-red-600">{patient.grupoSanguineo || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Consultas</p>
                            <p className="font-semibold text-gray-900">{consultations.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Próxima Cita</p>
                            <p className="font-semibold text-teal-600">
                                {patient.proximaCita ? formatShortDate(patient.proximaCita) : 'Sin cita'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Alergias y Condiciones */}
                {(patient.alergias || patient.condicionesCronicas) && (
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {patient.alergias && (
                            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-red-700 uppercase">Alergias</p>
                                    <p className="text-sm text-red-800">{patient.alergias}</p>
                                </div>
                            </div>
                        )}
                        {patient.condicionesCronicas && (
                            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                <Heart className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-medium text-amber-700 uppercase">Condiciones Crónicas</p>
                                    <p className="text-sm text-amber-800">{patient.condicionesCronicas}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Two Column Layout for History and Prescriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Consultations History - 2/3 width */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-teal-600" />
                        Historial de Consultas
                    </h3>

                    {consultations.length > 0 ? (
                        <div className="space-y-3">
                            {consultations.map((consultation) => (
                                <div key={consultation.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                                    {/* Header */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${consultation.tipoConsulta === 'VIDEO' ? 'bg-blue-50 text-blue-600' :
                                                consultation.tipoConsulta === 'CHAT' ? 'bg-green-50 text-green-600' :
                                                    'bg-gray-50 text-gray-600'
                                                }`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {formatDate(consultation.fechaInicio)}
                                                    <span className="text-gray-400">-</span>
                                                    <span className="text-sm text-gray-500">
                                                        {consultation.tipoConsulta === 'VIDEO' ? 'Videoconsulta' :
                                                            consultation.tipoConsulta === 'CHAT' ? 'Chat' : 'Presencial'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${consultation.estado === 'COMPLETADA' ? 'bg-green-100 text-green-700' :
                                            consultation.estado === 'CANCELADA' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                            {consultation.estado}
                                        </span>
                                    </div>

                                    {/* Diagnosis & Treatment */}
                                    <div className="mt-3 space-y-2">
                                        {consultation.diagnostico && (
                                            <div className="p-3 bg-gray-50 rounded-lg">
                                                <p className="text-xs font-medium text-gray-500 uppercase mb-1">Diagnóstico</p>
                                                <p className="text-sm text-gray-800">{consultation.diagnostico}</p>
                                            </div>
                                        )}
                                        {consultation.tratamiento && (
                                            <div className="p-3 bg-teal-50 rounded-lg">
                                                <p className="text-xs font-medium text-teal-600 uppercase mb-1">Tratamiento</p>
                                                <p className="text-sm text-teal-800">{consultation.tratamiento}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* perscripción durante la consulta */}
                                    {consultation.recetas && consultation.recetas.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-1 text-xs text-purple-600 font-medium">
                                                <Pill className="w-3.5 h-3.5" />
                                                {consultation.recetas.length} {consultation.recetas.length === 1 ? 'receta' : 'recetas'}
                                            </div>
                                        </div>
                                    )}

                                    {/* Follow-up */}
                                    {consultation.requiereSeguimiento && consultation.fechaSeguimiento && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex items-center gap-2 text-sm text-amber-600">
                                                <Clock className="w-4 h-4" />
                                                Seguimiento: {formatDate(consultation.fechaSeguimiento)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500">No hay consultas registradas aún.</p>
                        </div>
                    )}
                </div>

                {/* Active Prescriptions - 1/3 width */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Pill className="w-5 h-5 text-purple-600" />
                        Recetas Activas
                    </h3>

                    {recetasActivas.length > 0 ? (
                        <div className="space-y-3">
                            {recetasActivas.map((receta: any) => (
                                <div key={receta.id} className="bg-white rounded-xl shadow-sm border border-purple-100 p-4">
                                    <div className="space-y-2">
                                        {/* Medicamentos */}
                                        {receta.medicamentos && Array.isArray(receta.medicamentos) && receta.medicamentos.map((med: any, idx: number) => (
                                            <div key={idx} className="flex items-start gap-2">
                                                <Pill className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {med.nombre || med.medicamento || 'Medicamento'}
                                                    </p>
                                                    {(med.dosis || med.frecuencia) && (
                                                        <p className="text-xs text-gray-500">
                                                            {med.dosis} {med.frecuencia && `- ${med.frecuencia}`}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {/* Instrucciones */}
                                        {receta.instrucciones && (
                                            <p className="text-xs text-gray-500 mt-2 italic">{receta.instrucciones}</p>
                                        )}
                                        {/* Vencimiento */}
                                        {receta.fechaVencimiento && (
                                            <div className="mt-2 pt-2 border-t border-purple-50">
                                                <p className="text-xs text-purple-600">
                                                    Vence: {formatShortDate(receta.fechaVencimiento)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <Pill className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Sin recetas activas</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
