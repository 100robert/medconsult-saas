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
    Stethoscope
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
                const [patientData, historyData] = await Promise.all([
                    getPacienteById(id),
                    getHistorialPaciente(id)
                ]);

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
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 text-2xl font-bold">
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

                    {/* Detailed Stats / Info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 md:mt-0 p-4 bg-gray-50 rounded-lg">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Edad</p>
                            <p className="font-semibold text-gray-900">{calculateAge(patient.fechaNacimiento)} años</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Género</p>
                            <p className="font-semibold text-gray-900">{patient.genero || 'No especificado'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Consultas Totales</p>
                            <p className="font-semibold text-gray-900">{consultations.length}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase">Próxima Cita</p>
                            <p className="font-semibold text-teal-600">
                                {patient.proximaCita ? formatDate(patient.proximaCita) : 'No programada'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Consultations History */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-teal-600" />
                    Historial de Consultas
                </h3>

                {consultations.length > 0 ? (
                    consultations.map((consultation) => (
                        <div key={consultation.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">Consulta {consultation.tipoConsulta || 'General'}</p>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(consultation.fechaInicio)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(consultation.fechaInicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Stethoscope className="w-3 h-3" />
                                                Dr. {consultation.cita.medico.usuario.nombre} {consultation.cita.medico.usuario.apellido}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${consultation.estado === 'COMPLETADA' ? 'bg-green-100 text-green-700' :
                                        consultation.estado === 'CANCELADA' ? 'bg-red-100 text-red-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {consultation.estado}
                                    </span>
                                </div>
                            </div>

                            {consultation.diagnostico && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                                    <p className="text-sm text-gray-600 mt-1">{consultation.diagnostico}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Activity className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">No hay consultas registradas aún.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
