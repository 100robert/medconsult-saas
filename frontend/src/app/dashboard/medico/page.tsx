'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Users,
  Banknote,
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
import { getMedicoStats, MedicoStats, confirmarCita, getMiPerfilMedico } from '@/lib/medico';
import { getMisCitas, Appointment } from '@/lib/appointments';
import { toast } from 'sonner';
import api from '@/lib/api';

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

  // Estados
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
    // Protección de ruta
    if (user && user.rol !== 'MEDICO') {
      router.replace('/dashboard');
      return;
    }

    if (user) {
      loadDashboard();
    }
  }, [user, router]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      // 1. Obtener perfil médico (asegura que existe y tenemos datos actualizados)
      const perfilMedico = await getMiPerfilMedico();
      if (!perfilMedico) {
        console.warn('No se pudo cargar el perfil médico');
      }

      // 2. Cargar estadísticas y citas en paralelo
      const [backendStats, allCitas] = await Promise.all([
        getMedicoStats().catch(err => {
          console.error('Error cargando stats:', err);
          return null;
        }),
        getMisCitas().catch(err => {
          console.error('Error cargando citas:', err);
          return [] as Appointment[];
        })
      ]);

      // 3. Procesar Citas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      console.log('🔍 MÉDICO DEBUG: Total citas recibidas:', allCitas.length);
      console.log('🔍 MÉDICO DEBUG: Estados:', allCitas.map(c => c.estado));

      // Citas de HOY
      const citasHoy = allCitas.filter(app => {
        if (!app.fecha) return false;
        const appFecha = new Date(app.fecha).toISOString().split('T')[0];
        return appFecha === todayStr && app.estado !== 'CANCELADA';
      });

      // Todas las citas próximas (no canceladas)
      const citasProximas = allCitas.filter(app => {
        if (!app.fecha) return false;
        const appFecha = new Date(app.fecha);
        return appFecha >= today && app.estado !== 'CANCELADA';
      });

      console.log('🔍 MÉDICO DEBUG: Citas de hoy:', citasHoy.length);
      console.log('🔍 MÉDICO DEBUG: Citas próximas:', citasProximas.length);

      // 4. Calcular estadísticas locales (fallback)
      const citasPendientesTotal = allCitas.filter(a => a.estado === 'PENDIENTE' || a.estado === 'PROGRAMADA').length;
      const consultasRealizadas = allCitas.filter(a => a.estado === 'COMPLETADA').length;
      const uniquePatients = new Set(allCitas.map(a => a.idPaciente)).size;

      // Combinar datos del backend con fallback
      setStats({
        citasHoy: citasHoy.length,
        citasPendientes: backendStats?.citasPendientes ?? citasPendientesTotal,
        pacientesTotales: backendStats?.pacientesTotales ?? uniquePatients,
        calificacion: backendStats?.calificacion ?? perfilMedico?.calificacionPromedio ?? 0,
        ingresosMes: backendStats?.ingresosMes ?? 0,
        consultasCompletadas: backendStats?.consultasCompletadas ?? consultasRealizadas,
      });

      // 5. Mapear citas próximas para la vista (mostrar próximas 5, no solo hoy)
      const citasParaMostrar = citasProximas.length > 0 ? citasProximas : citasHoy;

      // Debug: ver tipos de citas
      console.log('🔍 MÉDICO DEBUG: Tipos de citas:', citasParaMostrar.map(c => ({ id: c.id, tipo: c.tipo })));

      const citasMapeadas: TodayAppointment[] = citasParaMostrar.slice(0, 10).map(c => ({
        id: c.id,
        paciente: {
          nombre: c.paciente?.nombre || c.paciente?.usuario?.nombre || 'Paciente',
          apellido: c.paciente?.apellido || c.paciente?.usuario?.apellido || ''
        },
        horaInicio: c.horaInicio || new Date(c.fecha).toTimeString().slice(0, 5),
        horaFin: c.horaFin || '00:30',
        tipo: (c.tipo as any) || 'PRESENCIAL',
        estado: c.estado || 'PROGRAMADA',
        motivo: c.motivo || 'Consulta general'
      }));

      // Ordenar por fecha más próxima
      citasMapeadas.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

      console.log('🔍 MÉDICO DEBUG: Citas mapeadas finales:', citasMapeadas);
      setTodayAppointments(citasMapeadas);

    } catch (error) {
      console.error('Error loading doctor dashboard:', error);
      toast.error('Error al cargar la información del panel');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarCita = async (id: string) => {
    try {
      const ok = await confirmarCita(id);
      if (ok) {
        toast.success('Cita confirmada');
        // Actualizar UI optimista
        setTodayAppointments(prev => prev.map(c =>
          c.id === id ? { ...c, estado: 'CONFIRMADA' } : c
        ));
        setStats(prev => ({ ...prev, citasPendientes: Math.max(0, prev.citasPendientes - 1) }));
      } else {
        toast.error('No se pudo confirmar la cita');
      }
    } catch (error) {
      toast.error('Error de conexión');
    }
  };

  const handleIniciarConsulta = async (citaId: string) => {
    try {
      // Crear la consulta asociada a la cita
      const response = await api.post('/consultas', {
        idCita: citaId
      });

      const consulta = response.data.data || response.data;

      if (consulta && consulta.id) {
        toast.success('Iniciando video consulta...');
        router.push(`/dashboard/consultations/${consulta.id}`);
      } else {
        toast.error('Error al iniciar la consulta');
      }
    } catch (error: any) {
      console.error('Error iniciando consulta:', error);
      // Si la consulta ya existe, el backend podría devolverla
      if (error.response?.data?.data?.id) {
        router.push(`/dashboard/consultations/${error.response.data.data.id}`);
      } else {
        toast.error(error.response?.data?.message || 'Error al iniciar la consulta');
      }
    }
  };

  const getEstadoConfig = (estado: string) => {
    const config: Record<string, { bg: string; text: string; icon: any }> = {
      PENDIENTE: { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertCircle },
      PROGRAMADA: { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertCircle },
      CONFIRMADA: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
      COMPLETADA: { bg: 'bg-blue-100', text: 'text-blue-700', icon: CheckCircle2 },
      CANCELADA: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };
    return config[estado] || config['PENDIENTE'];
  };

  const getCurrentTimeSlot = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
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
            Tienes <span className="font-semibold text-teal-600">{todayAppointments.length} citas</span> para hoy
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/schedule"
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Clock className="w-4 h-4" />
            Horario
          </Link>
          <Link
            href="/dashboard/appointments"
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            <Calendar className="w-4 h-4" />
            Agenda
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard icon={Calendar} label="Citas hoy" value={stats.citasHoy} color="teal" />
        <StatsCard icon={AlertCircle} label="Pendientes" value={stats.citasPendientes} color="amber" />
        <StatsCard icon={Users} label="Pacientes" value={stats.pacientesTotales} color="blue" />
        <StatsCard icon={Star} label="Calificación" value={stats.calificacion || '-'} color="yellow" />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Citas</h2>
            <span className="text-sm text-gray-500">
              {todayAppointments.length} cita(s) programada(s)
            </span>
          </div>

          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {todayAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500">No hay citas próximas programadas</p>
              </div>
            ) : (
              todayAppointments.map((apt) => {
                const config = getEstadoConfig(apt.estado);
                const Icon = config.icon;
                const isPast = apt.horaFin < getCurrentTimeSlot();

                return (
                  <div key={apt.id} className={`p-4 transition-colors ${isPast ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Time */}
                      <div className="min-w-[70px] text-center sm:text-left">
                        <p className={`font-semibold ${isPast ? 'text-gray-400' : 'text-gray-900'}`}>{apt.horaInicio}</p>
                        <p className="text-xs text-gray-400">{apt.horaFin}</p>
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">
                            {apt.paciente.nombre} {apt.paciente.apellido}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                            <Icon className="w-3 h-3" />
                            {apt.estado}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            {apt.tipo === 'VIDEOCONSULTA' ? <Video className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            {apt.tipo === 'VIDEOCONSULTA' ? 'Online' : 'Presencial'}
                          </span>
                          <span>•</span>
                          <span className="truncate max-w-[200px]">{apt.motivo}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {apt.estado === 'PENDIENTE' && !isPast && (
                          <button
                            onClick={() => handleConfirmarCita(apt.id)}
                            className="px-3 py-1.5 bg-teal-600 text-white text-xs font-medium rounded-lg hover:bg-teal-700"
                          >
                            Confirmar
                          </button>
                        )}
                        {apt.estado === 'CONFIRMADA' && apt.tipo === 'VIDEOCONSULTA' && !isPast && (
                          <button
                            onClick={() => handleIniciarConsulta(apt.id)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 flex items-center gap-1"
                          >
                            <Video className="w-3 h-3" /> Iniciar
                          </button>
                        )}
                        <Link href={`/dashboard/appointments/${apt.id}`} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Completadas</span>
                </div>
                <span className="font-bold text-gray-900">{stats.consultasCompletadas}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Banknote className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Ingresos</span>
                </div>
                <span className="font-bold text-emerald-600">S/. {stats.ingresosMes}</span>
              </div>
            </div>
            <Link href="/dashboard/payments" className="block text-center mt-4 text-sm text-teal-600 font-medium hover:underline">
              Ver reporte completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponente para tarjetas de estadísticas
function StatsCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string | number, color: string }) {
  const colors: Record<string, string> = {
    teal: 'bg-teal-100 text-teal-600',
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color] || 'bg-gray-100 text-gray-600'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
