'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Video, MapPin, User, Search, Filter, Plus, MoreVertical, ChevronRight, CalendarDays, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui';
import { getMisCitas, cancelarCita, type Appointment, type Medico } from '@/lib/appointments';
import { toast } from 'sonner';
import api from '@/lib/api';

function getSpecialtyName(medico?: Medico): string {
  if (!medico?.especialidad) return 'Consulta General';
  if (typeof medico.especialidad === 'string') return medico.especialidad;
  return medico.especialidad.nombre || 'Consulta General';
}

function safeDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

const estadoConfig = {
  PROGRAMADA: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertCircle,
    solidColor: 'bg-amber-500'
  },
  PENDIENTE: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: AlertCircle,
    solidColor: 'bg-amber-500'
  },
  CONFIRMADA: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    solidColor: 'bg-emerald-500'
  },
  COMPLETADA: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    icon: CheckCircle2,
    solidColor: 'bg-slate-500'
  },
  CANCELADA: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
    solidColor: 'bg-red-500'
  },
};

const estadoLabels = {
  PROGRAMADA: 'Programada',
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

export default function AppointmentsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [joiningConsultation, setJoiningConsultation] = useState<string | null>(null);

  // Cargar citas del backend
  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      setError(null);

      try {
        const citas = await getMisCitas();
        setAppointments(citas);
      } catch (err: any) {
        console.error('Error al cargar citas:', err);
        setError(err.response?.data?.message || 'Error al cargar las citas');
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  // Función para cancelar cita
  const handleCancelAppointment = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) return;

    try {
      await cancelarCita(id);
      // Actualizar la lista local
      setAppointments(prev =>
        prev.map(apt => apt.id === id ? { ...apt, estado: 'CANCELADA' } : apt)
      );
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al cancelar la cita');
    }
  };

  // Función para unirse a la videoconsulta
  const handleJoinConsultation = async (citaId: string) => {
    try {
      setJoiningConsultation(citaId);

      // Buscar si ya existe una consulta para esta cita
      const response = await api.get(`/consultas/cita/${citaId}`);
      const consulta = response.data.data || response.data;

      if (consulta && consulta.id) {
        toast.success('Conectando a la sala de videoconsulta...');
        router.push(`/dashboard/consultations/${consulta.id}`);
      } else {
        toast.error('El médico aún no ha iniciado la consulta');
      }
    } catch (error: any) {
      console.error('Error uniéndose a consulta:', error);
      if (error.response?.status === 404) {
        toast.error('El médico aún no ha iniciado la consulta. Por favor espera.');
      } else {
        toast.error('Error al conectar con la consulta');
      }
    } finally {
      setJoiningConsultation(null);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const searchLower = searchTerm.toLowerCase();

    // Extracción segura para búsqueda
    const medicoNombre = apt.medico?.usuario?.nombre || apt.medico?.nombre || '';
    const medicoApellido = apt.medico?.usuario?.apellido || apt.medico?.apellido || '';
    const pacienteNombre = apt.paciente?.nombre || '';
    const pacienteApellido = apt.paciente?.apellido || '';
    const motivo = apt.motivo || '';

    const matchesSearch = searchTerm === '' ||
      medicoNombre.toLowerCase().includes(searchLower) ||
      medicoApellido.toLowerCase().includes(searchLower) ||
      pacienteNombre.toLowerCase().includes(searchLower) ||
      pacienteApellido.toLowerCase().includes(searchLower) ||
      motivo.toLowerCase().includes(searchLower);

    const matchesFilter = filterStatus === 'all' || apt.estado === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const upcomingAppointments = filteredAppointments.filter(
    (apt) => apt.estado === 'CONFIRMADA' || apt.estado === 'PROGRAMADA' || apt.estado === 'PENDIENTE'
  );
  const pastAppointments = filteredAppointments.filter(
    (apt) => apt.estado === 'COMPLETADA' || apt.estado === 'CANCELADA'
  );

  // Stats
  const stats = [
    { label: 'Total', value: appointments.length, solidColor: 'bg-teal-600' },
    { label: 'Confirmadas', value: appointments.filter(a => a.estado === 'CONFIRMADA').length, solidColor: 'bg-emerald-500' },
    { label: 'Pendientes', value: appointments.filter(a => a.estado === 'PROGRAMADA' || a.estado === 'PENDIENTE').length, solidColor: 'bg-amber-500' },
    { label: 'Completadas', value: appointments.filter(a => a.estado === 'COMPLETADA').length, solidColor: 'bg-slate-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-50 text-teal-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
            <CalendarDays className="w-4 h-4" />
            Gestión de citas
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.rol === 'MEDICO' ? 'Mis Citas' : 'Mis Citas'}
          </h1>
          <p className="text-gray-600 mt-1">
            Administra y gestiona todas tus citas médicas
          </p>
        </div>
        {user?.rol === 'PACIENTE' && (
          <Link href="/dashboard/appointments/new">
            <Button
              variant="primary"
              className="shadow-lg"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nueva Cita
            </Button>
          </Link>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando citas...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <XCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p className="text-red-700">{error}</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </Button>
        </div>
      )}

      {/* Content - only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl ${stat.solidColor} flex items-center justify-center`}>
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar citas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'PROGRAMADA', 'CONFIRMADA', 'PENDIENTE', 'COMPLETADA', 'CANCELADA'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filterStatus === status
                      ? 'bg-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    {status === 'all' ? 'Todas' : estadoLabels[status as keyof typeof estadoLabels]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          {upcomingAppointments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Próximas Citas
              </h2>
              <div className="grid gap-4">
                {upcomingAppointments.map((appointment, index) => {
                  const config = estadoConfig[appointment.estado];
                  const StatusIcon = config.icon;
                  return (
                    <div
                      key={appointment.id}
                      className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${config.solidColor} flex items-center justify-center text-white font-bold shadow-lg flex-shrink-0`}>
                              {user?.rol === 'MEDICO'
                                ? `${appointment.paciente?.nombre?.[0] || ''}${appointment.paciente?.apellido?.[0] || ''}`
                                : `${appointment.medico?.usuario?.nombre?.[0] || appointment.medico?.nombre?.[0] || 'D'}${appointment.medico?.usuario?.apellido?.[0] || appointment.medico?.apellido?.[0] || 'r'}`}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {user?.rol === 'MEDICO'
                                  ? `${appointment.paciente?.nombre} ${appointment.paciente?.apellido}`
                                  : `Dr. ${appointment.medico?.usuario?.nombre || appointment.medico?.nombre || ''} ${appointment.medico?.usuario?.apellido || appointment.medico?.apellido || ''}`}
                              </h3>
                              {user?.rol !== 'MEDICO' && (
                                <p className="text-blue-600 font-medium text-sm">
                                  {getSpecialtyName(appointment.medico)}
                                </p>
                              )}
                              <p className="text-gray-600 mt-1">{appointment.motivo}</p>
                              <div className="flex flex-wrap gap-3 mt-3">
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-600">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  {safeDate(appointment.fecha) ? safeDate(appointment.fecha)!.toLocaleDateString('es-ES', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                  }) : 'Fecha inválida'}
                                </div>
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg text-sm text-gray-600">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  {appointment.horaInicio}
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${((appointment.tipo as string) === 'VIDEOCONSULTA' || (appointment.tipo as string) === 'VIRTUAL')
                                  ? 'bg-purple-50 text-purple-600'
                                  : 'bg-blue-50 text-blue-600'
                                  }`}>
                                  {((appointment.tipo as string) === 'VIDEOCONSULTA' || (appointment.tipo as string) === 'VIRTUAL') ? (
                                    <>
                                      <Video className="w-4 h-4" />
                                      Videoconsulta
                                    </>
                                  ) : (
                                    <>
                                      <MapPin className="w-4 h-4" />
                                      Presencial
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text} border ${config.border}`}>
                              <StatusIcon className="w-4 h-4" />
                              {estadoLabels[appointment.estado]}
                            </span>
                            {appointment.estado === 'CONFIRMADA' && ((appointment.tipo as string) === 'VIDEOCONSULTA' || (appointment.tipo as string) === 'VIRTUAL') && (
                              <Button
                                variant="primary"
                                size="sm"
                                className="shadow-lg"
                                onClick={() => handleJoinConsultation(appointment.id)}
                                disabled={joiningConsultation === appointment.id}
                              >
                                {joiningConsultation === appointment.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Conectando...
                                  </>
                                ) : (
                                  <>
                                    <Video className="w-4 h-4 mr-2" />
                                    Unirse
                                  </>
                                )}
                              </Button>
                            )}
                            {(appointment.estado === 'PROGRAMADA' || appointment.estado === 'PENDIENTE') && (
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-colors"
                                title="Cancelar cita"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`h-1 ${config.solidColor}`} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Past Appointments */}
          {pastAppointments.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Historial</h2>
              <div className="grid gap-4">
                {pastAppointments.map((appointment) => {
                  const config = estadoConfig[appointment.estado];
                  const StatusIcon = config.icon;
                  return (
                    <div key={appointment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 opacity-75 hover:opacity-100 transition-opacity">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 font-bold flex-shrink-0">
                            {user?.rol === 'MEDICO'
                              ? `${appointment.paciente?.nombre?.[0] || ''}${appointment.paciente?.apellido?.[0] || ''}`
                              : `${appointment.medico?.usuario?.nombre?.[0] || appointment.medico?.nombre?.[0] || 'D'}${appointment.medico?.usuario?.apellido?.[0] || appointment.medico?.apellido?.[0] || 'r'}`}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {user?.rol === 'MEDICO'
                                ? `${appointment.paciente?.nombre} ${appointment.paciente?.apellido}`
                                : `Dr. ${appointment.medico?.usuario?.nombre || appointment.medico?.nombre || ''} ${appointment.medico?.usuario?.apellido || appointment.medico?.apellido || ''}`}
                            </h3>
                            {/* Especialidad también para historial si es paciente */}
                            {user?.rol !== 'MEDICO' && (
                              <p className="text-sm text-gray-500">
                                {getSpecialtyName(appointment.medico)}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">{appointment.motivo}</p>
                            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(appointment.fecha).toLocaleDateString('es-ES')}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.horaInicio}
                              </div>
                            </div>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                          <StatusIcon className="w-4 h-4" />
                          {estadoLabels[appointment.estado]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredAppointments.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No hay citas</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                {searchTerm || filterStatus !== 'all'
                  ? 'No se encontraron citas con los filtros seleccionados'
                  : 'Aún no tienes citas programadas'}
              </p>
              {user?.rol === 'PACIENTE' && (
                <Link href="/dashboard/appointments/new">
                  <Button variant="primary" className="mt-6 shadow-lg">
                    Agendar Primera Cita
                  </Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
