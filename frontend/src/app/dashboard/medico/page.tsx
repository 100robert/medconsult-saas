'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  TrendingUp,
  Video,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Activity,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMedicoStats, MedicoStats, confirmarCita } from '@/lib/medico';
import { getMisCitas } from '@/lib/appointments';
import { toast } from 'sonner';

interface TodayAppointment {
  id: string;
  paciente: {
    nombre: string;
    apellido: string;
  };
  horaInicio: string;
  horaFin: string;
  tipo: 'VIDEOCONSULTA' | 'PRESENCIAL';
  estado: string;
  motivo: string;
}

export default function DoctorDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<MedicoStats>({
    citasHoy: 0,
    citasPendientes: 0,
    pacientesTotales: 0,
    calificacion: 0,
    ingresosMes: 0,
    consultasCompletadas: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<TodayAppointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar rol (protección adicional al middleware/layout)
    if (user && user.rol !== 'MEDICO') {
      router.replace('/dashboard');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Intentar obtener estadísticas del backend
      // Si el endpoint no está listo, calcularemos algunas estadísticas básicas
      const backendStats = await getMedicoStats();

      // Obtener todas las citas para cálculos manuales si es necesario
      const allAppointments = await getMisCitas();

      // Filtrar citas de hoy
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Importante: Asegurar que comparamos fechas locales correctamente o usar string directo
      // Aquí asumimos que la fecha viene en formato YYYY-MM-DD
      const appointmentsToday = allAppointments.filter(app => {
        // Manejar diferentes formatos de fecha si es necesario
        // getMisCitas devuelve appointment.fecha como string ISO probablemente
        const appDate = typeof app.fecha === 'string' ? app.fecha.split('T')[0] : '';
        return appDate === todayStr;
      });

      // Calcular estadísticas fallback si el backend devuelve ceros (indicador de "no implementado" o "sin datos")
      const pendingApps = allAppointments.filter(a => a.estado === 'PENDIENTE' || a.estado === 'PROGRAMADA').length;
      const completedApps = allAppointments.filter(a => a.estado === 'COMPLETADA').length;

      // Calcular pacientes únicos
      const uniquePatients = new Set(allAppointments.map(a => a.idPaciente)).size;

      setStats({
        citasHoy: appointmentsToday.length,
        citasPendientes: pendingApps,
        pacientesTotales: backendStats.pacientesTotales || uniquePatients,
        calificacion: backendStats.calificacion || 0, // Esto debería venir del backend idealmente
        ingresosMes: backendStats.ingresosMes || 0,
        consultasCompletadas: completedApps,
      });

      // Mapear citas de hoy para la vista
      const mappedAppointments: TodayAppointment[] = appointmentsToday.map(apt => ({
        id: apt.id,
        paciente: {
          nombre: apt.paciente?.nombre || 'Paciente',
          apellido: apt.paciente?.apellido || 'Desconocido'
        },
        horaInicio: apt.horaInicio,
        horaFin: apt.horaFin,
        tipo: apt.tipo,
        estado: apt.estado,
        motivo: apt.motivo,
      }));

      // Ordenar por hora
      mappedAppointments.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

      setTodayAppointments(mappedAppointments);

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      toast.error('Error al cargar datos del panel');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarCita = async (id: string) => {
    try {
      const success = await confirmarCita(id);
      if (success) {
        toast.success('Cita confirmada exitosamente');
        // Actualizar lista localmente
        setTodayAppointments(prev => prev.map(app =>
          app.id === id ? { ...app, estado: 'CONFIRMADA' } : app
        ));
        // Actualizar contador
        setStats(prev => ({ ...prev, citasPendientes: Math.max(0, prev.citasPendientes - 1) }));
      } else {
        toast.error('No se pudo confirmar la cita');
      }
    } catch (error) {
      console.error('Error al confirmar cita:', error);
      toast.error('Ocurrió un error al confirmar la cita');
    }
  };

  const handleIniciarConsulta = (id: string) => {
    router.push(`/dashboard/consultations/${id}`);
  };

  const getEstadoConfig = (estado: string) => {
    const config = {
      PENDIENTE: { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertCircle },
      PROGRAMADA: { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertCircle },
      CONFIRMADA: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
      COMPLETADA: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle2 },
      CANCELADA: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };
    return config[estado as keyof typeof config] || config.PENDIENTE;
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          <p className="text-gray-500 font-medium">Cargando tu panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Hola, Dr. {user?.apellido || user?.nombre}!
          </h1>
          <p className="text-gray-500 mt-1">
            Tienes <span className="font-semibold text-teal-600">{stats.citasHoy} citas</span> programadas para hoy
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/schedule"
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Gestionar Horario
          </Link>
          <Link
            href="/dashboard/appointments"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Ver Agenda
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-100 rounded-xl">
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.citasHoy}</p>
              <p className="text-sm text-gray-500">Citas hoy</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.citasPendientes}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pacientesTotales}</p>
              <p className="text-sm text-gray-500">Pacientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 transition-transform hover:scale-[1.02]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-100 rounded-xl">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.calificacion || '-'}</p>
              <p className="text-sm text-gray-500">Calificación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Agenda de Hoy</h2>
              <span className="text-sm text-gray-500 capitalize">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {todayAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Sin citas hoy</h3>
                <p className="text-gray-500 mt-1">Disfruta de tu día libre o revisa citas pendientes.</p>
                <Link href="/dashboard/appointments" className="mt-4 inline-block text-teal-600 font-medium hover:underline">
                  Ver calendario completo
                </Link>
              </div>
            ) : (
              todayAppointments.map((apt) => {
                const estadoConfig = getEstadoConfig(apt.estado);
                const EstadoIcon = estadoConfig.icon;
                const currentTime = getCurrentTimeSlot();
                const isPast = apt.horaFin < currentTime;

                return (
                  <div
                    key={apt.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${isPast ? 'bg-gray-50/50' : ''}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Time */}
                      <div className="flex sm:flex-col items-center sm:min-w-[70px] gap-2 sm:gap-0">
                        <p className={`font-semibold text-lg ${isPast ? 'text-gray-500' : 'text-gray-900'}`}>
                          {apt.horaInicio}
                        </p>
                        <p className="text-xs text-gray-500 hidden sm:block">{apt.horaFin}</p>
                        <span className="sm:hidden text-gray-400">-</span>
                        <p className="text-sm text-gray-500 sm:hidden">{apt.horaFin}</p>
                      </div>

                      {/* Divider (Hidden on mobile) */}
                      <div className={`hidden sm:block w-1 h-14 rounded-full ${isPast ? 'bg-gray-300' : 'bg-teal-500'}`}></div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900 text-lg">
                            {apt.paciente.nombre} {apt.paciente.apellido}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${estadoConfig.bg} ${estadoConfig.text}`}>
                            <EstadoIcon className="w-3 h-3" />
                            {apt.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{apt.motivo}</p>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${apt.tipo === 'VIDEOCONSULTA' ? 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded' : 'text-gray-600 bg-gray-100 px-2 py-0.5 rounded'
                            }`}>
                            {apt.tipo === 'VIDEOCONSULTA' ? (
                              <Video className="w-3.5 h-3.5" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5" />
                            )}
                            {apt.tipo === 'VIDEOCONSULTA' ? 'Videoconsulta' : 'Presencial'}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-2 sm:mt-0 self-end sm:self-center">
                        {(apt.estado === 'PENDIENTE' || apt.estado === 'PROGRAMADA') && !isPast && (
                          <button
                            onClick={() => handleConfirmarCita(apt.id)}
                            className="px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                          >
                            Confirmar
                          </button>
                        )}
                        {apt.estado === 'CONFIRMADA' && apt.tipo === 'VIDEOCONSULTA' && !isPast && (
                          <button
                            onClick={() => handleIniciarConsulta(apt.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Video className="w-4 h-4" />
                            Iniciar
                          </button>
                        )}
                        <Link href={`/dashboard/appointments/${apt.id}`}>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowRight className="w-5 h-5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Stats Summary - Financial */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Mensual</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Consultas</span>
                </div>
                <span className="font-bold text-gray-900">{stats.consultasCompletadas}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="p-2 bg-white rounded-md shadow-sm">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Ingresos Est.</span>
                </div>
                <span className="font-bold text-green-700">S/. {stats.ingresosMes.toLocaleString()}</span>
              </div>
            </div>
            <Link href="/dashboard/payments" className="block mt-4 text-center text-sm text-teal-600 font-medium hover:underline">
              Ver reporte financiero completo
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/patients"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ver mis pacientes</span>
              </Link>
              <Link
                href="/dashboard/schedule"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
              >
                <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                  <Clock className="w-4 h-4 text-teal-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Cambiar disponibilidad</span>
              </Link>
              <Link
                href="/dashboard/reviews"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200"
              >
                <div className="p-2 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ver mis reseñas</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
