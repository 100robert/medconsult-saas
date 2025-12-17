'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Video, MapPin, User, Search, Filter, Plus, MoreVertical, ChevronRight, CalendarDays, CheckCircle2, XCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui';
import { getMisCitas, cancelarCita, reprogramarCita, getAvailableSlots, type Appointment, type Medico, type Slot } from '@/lib/appointments';
import { toast } from 'sonner';
import api from '@/lib/api';

// Interfaz para info de reembolso
interface RefundInfo {
  porcentajeReembolso: number;
  montoReembolso: number;
  descripcion: string;
  horasRestantes: number;
}

function getSpecialtyName(medico?: Medico): string {
  if (!medico?.especialidad) return 'Consulta General';
  if (typeof medico.especialidad === 'string') return medico.especialidad;
  return medico.especialidad.nombre || 'Consulta General';
}

function safeDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // If dateStr is likely "YYYY-MM-DD", parse as local date to avoid UTC confusion
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
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

  // Estado para modal de cancelación
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancellingAppointment, setCancellingAppointment] = useState<Appointment | null>(null);
  const [refundInfo, setRefundInfo] = useState<RefundInfo | null>(null);
  const [loadingRefundInfo, setLoadingRefundInfo] = useState(false);
  const [cancellingInProgress, setCancellingInProgress] = useState(false);

  // Estado para reprogramación
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [reschedulingInProgress, setReschedulingInProgress] = useState(false);

  // Estado para confirmación de reembolso exitoso
  const [refundSuccessModal, setRefundSuccessModal] = useState(false);
  const [refundSuccessData, setRefundSuccessData] = useState<{
    porcentaje: number;
    monto: number;
    descripcion: string;
  } | null>(null);

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

  // Abrir modal de cancelación y calcular info de reembolso localmente
  const openCancelModal = (appointment: Appointment) => {
    setCancellingAppointment(appointment);
    setCancelModalOpen(true);
    setLoadingRefundInfo(false);

    // Calcular reembolso localmente (mismas reglas que el backend)
    const fechaCita = new Date(appointment.fecha);
    const ahora = new Date();
    const horasRestantes = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    let porcentaje = 0;
    let descripcion = '';

    if (horasRestantes >= 24) {
      porcentaje = 95;
      descripcion = 'Reembolso completo (95% - menos 5% tarifa de procesamiento)';
    } else if (horasRestantes >= 2) {
      porcentaje = 50;
      descripcion = 'Reembolso parcial (50% - cancelación con menos de 24 horas)';
    } else {
      porcentaje = 0;
      descripcion = 'Sin reembolso (cancelación con menos de 2 horas de anticipación)';
    }

    setRefundInfo({
      porcentajeReembolso: porcentaje,
      montoReembolso: 0, // No tenemos el monto desde el frontend
      descripcion: descripcion,
      horasRestantes: Math.max(0, horasRestantes)
    });
  };

  // Verificar si se puede reprogramar (política de 3 horas)
  const canReschedule = (appointment: Appointment) => {
    const fechaCita = new Date(appointment.fecha + 'T' + appointment.horaInicio);
    const ahora = new Date();
    const diffMs = fechaCita.getTime() - ahora.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours >= 3;
  };

  // Abrir modal de reprogramación
  const openRescheduleModal = (appointment: Appointment) => {
    setReschedulingAppointment(appointment);
    setRescheduleModalOpen(true);
    setNewDate('');
    setAvailableSlots([]);
    setSelectedSlot(null);
  };

  // Manejar cambio de fecha para reprogramación
  const handleDateChange = async (date: string) => {
    setNewDate(date);
    setSelectedSlot(null);
    if (!reschedulingAppointment?.medico?.id) return;

    setLoadingSlots(true);
    try {
      const slots = await getAvailableSlots(reschedulingAppointment.medico.id, date);
      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error cargando slots:', err);
      toast.error('Error al cargar horarios disponibles');
    } finally {
      setLoadingSlots(false);
    }
  };

  // Confirmar reprogramación
  const confirmReschedule = async () => {
    if (!reschedulingAppointment || !selectedSlot) return;

    setReschedulingInProgress(true);
    try {
      // Necesitamos ID de disponibilidad y la nueva fecha completa ISO
      // selectedSlot.fechaHora ya viene en formato ISO correcto esperamos

      await reprogramarCita(
        reschedulingAppointment.id,
        selectedSlot.fechaHora,
        selectedSlot.disponibilidadId
      );

      toast.success('Cita reprogramada exitosamente');

      // Actualizar lista
      setAppointments(prev =>
        prev.map(apt => {
          if (apt.id === reschedulingAppointment.id) {
            // Actualizar fecha y hora visibles
            const [fecha, hora] = selectedSlot.fechaHora.split('T');
            return {
              ...apt,
              fecha: fecha,
              horaInicio: hora.substring(0, 5)
            };
          }
          return apt;
        })
      );

      setRescheduleModalOpen(false);
      setReschedulingAppointment(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al reprogramar la cita');
    } finally {
      setReschedulingInProgress(false);
    }
  };

  // Cerrar modal de cancelación
  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setCancellingAppointment(null);
    setRefundInfo(null);
  };

  // Confirmar cancelación
  const confirmCancellation = async () => {
    if (!cancellingAppointment) return;

    setCancellingInProgress(true);
    try {
      const response = await api.patch(`/citas/${cancellingAppointment.id}/cancelar`, {
        motivo: 'Cancelado por el usuario'
      });

      const data = response.data.data;

      // Actualizar la lista local
      setAppointments(prev =>
        prev.map(apt => apt.id === cancellingAppointment.id ? { ...apt, estado: 'CANCELADA' } : apt)
      );

      // Cerrar modal de cancelación
      closeCancelModal();

      // Mostrar modal de confirmación de reembolso
      if (data?.reembolso) {
        setRefundSuccessData({
          porcentaje: data.reembolso.porcentaje,
          monto: data.reembolso.monto || 0,
          descripcion: data.reembolso.descripcion
        });
        setRefundSuccessModal(true);
      } else {
        toast.info('Cita cancelada exitosamente.');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al cancelar la cita');
    } finally {
      setCancellingInProgress(false);
    }
  };

  // Función para unirse a la videoconsulta
  const handleJoinConsultation = async (citaId: string, appointment: Appointment) => {
    try {
      setJoiningConsultation(citaId);

      // Buscar si ya existe una consulta para esta cita
      try {
        const response = await api.get(`/consultas/cita/${citaId}`);
        const consulta = response.data.data || response.data;

        if (consulta && consulta.id) {
          toast.success('Conectando a la sala de videoconsulta...');
          router.push(`/dashboard/consultations/${consulta.id}`);
          return;
        }
      } catch (getError: any) {
        // Si es 404, significa que no existe la consulta
        if (getError.response?.status === 404) {
          // Si es médico, crear la consulta automáticamente
          if (user?.rol === 'MEDICO') {
            toast.info('Iniciando consulta...');
            try {
              // Determinar el tipo de consulta basado en el tipo de cita
              const tipoConsulta = ((appointment.tipo as string) === 'VIDEOCONSULTA' || (appointment.tipo as string) === 'VIRTUAL')
                ? 'VIDEO'
                : 'PRESENCIAL';

              const createResponse = await api.post('/consultas', {
                idCita: citaId,
                tipoConsulta: tipoConsulta,
                notas: ''
              });

              const nuevaConsulta = createResponse.data.data || createResponse.data;

              if (nuevaConsulta && nuevaConsulta.id) {
                toast.success('Consulta iniciada. Conectando a la sala...');
                router.push(`/dashboard/consultations/${nuevaConsulta.id}`);
                return;
              }
            } catch (createError: any) {
              console.error('Error creando consulta:', createError);
              toast.error(createError.response?.data?.message || 'Error al iniciar la consulta');
              return;
            }
          } else {
            // Si es paciente, mostrar mensaje de espera
            toast.error('El médico aún no ha iniciado la consulta. Por favor espera.');
            return;
          }
        } else {
          throw getError;
        }
      }
    } catch (error: any) {
      console.error('Error uniéndose a consulta:', error);
      toast.error('Error al conectar con la consulta');
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
                                onClick={() => handleJoinConsultation(appointment.id, appointment)}
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
                            {(appointment.estado === 'PROGRAMADA' || appointment.estado === 'PENDIENTE' || appointment.estado === 'CONFIRMADA') && (
                              <button
                                onClick={() => openCancelModal(appointment)}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm"
                              >
                                Cancelar cita
                              </button>
                            )}
                            {(appointment.estado === 'PROGRAMADA' || appointment.estado === 'CONFIRMADA') && canReschedule(appointment) && (
                              <button
                                onClick={() => openRescheduleModal(appointment)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm ml-2"
                              >
                                Reprogramar
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

      {/* Modal de Cancelación */}
      {cancelModalOpen && cancellingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Cancelar Cita</h3>
              <button
                onClick={closeCancelModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 text-sm">
                  ¿Estás seguro de que deseas cancelar esta cita?
                </p>
              </div>

              {/* Info de la cita */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Médico:</span> Dr. {cancellingAppointment.medico?.usuario?.nombre || cancellingAppointment.medico?.nombre} {cancellingAppointment.medico?.usuario?.apellido || cancellingAppointment.medico?.apellido}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Fecha:</span> {new Date(cancellingAppointment.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Hora:</span> {cancellingAppointment.horaInicio}
                </p>
              </div>

              {/* Info de reembolso */}
              {loadingRefundInfo ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                  <span className="ml-2 text-gray-500">Calculando reembolso...</span>
                </div>
              ) : refundInfo && (
                <div className={`rounded-xl p-4 ${refundInfo.porcentajeReembolso > 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <span className="flex items-center justify-center w-5 h-5 text-green-600 font-bold text-base">
                        S/
                      </span>
                    </div>
                    <span className={`font-semibold ${refundInfo.porcentajeReembolso > 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                      Reembolso: {refundInfo.porcentajeReembolso}%
                    </span>
                  </div>
                  <p className={`text-sm ${refundInfo.porcentajeReembolso > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    {refundInfo.descripcion}
                  </p>
                  {refundInfo.montoReembolso > 0 && (
                    <p className="text-sm text-emerald-700 mt-1">
                      <span className="font-medium">Monto a reembolsar:</span> S/ {refundInfo.montoReembolso.toFixed(2)}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Tiempo restante: {Math.floor(refundInfo.horasRestantes)} horas
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-5 border-t bg-gray-50 rounded-b-2xl">
              <button
                onClick={closeCancelModal}
                disabled={cancellingInProgress}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                Volver
              </button>
              <button
                onClick={confirmCancellation}
                disabled={cancellingInProgress || loadingRefundInfo}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {cancellingInProgress ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Cancelando...
                  </>
                ) : (
                  'Confirmar Cancelación'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Reembolso */}
      {refundSuccessModal && refundSuccessData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            {/* Contenido */}
            <div className="p-8 text-center">
              {/* Icono de éxito */}
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Cita Cancelada!
              </h3>

              <p className="text-gray-600 mb-6">
                Tu cita ha sido cancelada exitosamente
              </p>

              {/* Información de reembolso */}
              {refundSuccessData.porcentaje > 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <span className="text-emerald-600 font-bold">S/</span>
                    </div>
                    <span className="text-emerald-800 font-semibold text-lg">
                      Reembolso Aprobado
                    </span>
                  </div>

                  <div className="text-3xl font-bold text-emerald-700 mb-2">
                    {refundSuccessData.porcentaje}%
                  </div>

                  {refundSuccessData.monto > 0 && (
                    <p className="text-emerald-700 font-medium mb-2">
                      Monto: S/. {refundSuccessData.monto.toFixed(2)}
                    </p>
                  )}

                  <p className="text-emerald-600 text-sm">
                    {refundSuccessData.descripcion}
                  </p>

                  <div className="mt-4 pt-4 border-t border-emerald-200">
                    <p className="text-emerald-700 text-sm">
                      💳 El reembolso se procesará a tu método de pago original en <strong>3-5 días hábiles</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-800 font-semibold">
                      Sin Reembolso
                    </span>
                  </div>
                  <p className="text-amber-700 text-sm">
                    {refundSuccessData.descripcion}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setRefundSuccessModal(false);
                  setRefundSuccessData(null);
                }}
                className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reprogramación */}
      {
        rescheduleModalOpen && reschedulingAppointment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b flex-shrink-0">
                <h3 className="text-lg font-semibold text-gray-900">Reprogramar Cita</h3>
                <button
                  onClick={() => setRescheduleModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 overflow-y-auto">
                {/* Info Actual */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm font-medium mb-1">Cita Actual:</p>
                  <div className="text-sm text-blue-700">
                    <p>Fecha: {new Date(reschedulingAppointment.fecha).toLocaleDateString('es-ES')}</p>
                    <p>Hora: {reschedulingAppointment.horaInicio}</p>
                    <p>Dr. {reschedulingAppointment.medico?.usuario?.nombre || reschedulingAppointment.medico?.nombre} {reschedulingAppointment.medico?.usuario?.apellido || reschedulingAppointment.medico?.apellido}</p>
                  </div>
                </div>

                {/* Selector de Nueva Fecha */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selecciona Nueva Fecha
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={newDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>

                {/* Selector de Slots */}
                {newDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horarios Disponibles
                    </label>
                    {loadingSlots ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                      </div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => {
                          const isSelected = selectedSlot?.disponibilidadId === slot.disponibilidadId && selectedSlot?.horaInicio === slot.horaInicio;
                          return (
                            <button
                              key={`${slot.disponibilidadId}-${slot.horaInicio}`}
                              onClick={() => setSelectedSlot(slot)}
                              className={`px-2 py-2 text-sm rounded-lg border transition-all ${isSelected
                                ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-teal-300 hover:bg-teal-50'
                                }`}
                            >
                              {slot.horaInicio.substring(0, 5)}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-2 bg-gray-50 rounded-lg">
                        No hay horarios disponibles para esta fecha.
                      </p>
                    )}
                  </div>
                )}

              </div>

              {/* Footer */}
              <div className="flex gap-3 p-5 border-t bg-gray-50 rounded-b-2xl flex-shrink-0">
                <button
                  onClick={() => setRescheduleModalOpen(false)}
                  disabled={reschedulingInProgress}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmReschedule}
                  disabled={!selectedSlot || reschedulingInProgress}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {reschedulingInProgress ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : (
                    'Confirmar Cambio'
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}

