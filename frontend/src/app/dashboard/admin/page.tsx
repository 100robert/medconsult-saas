'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  Shield,
  Settings,
  FileText,
  CreditCard,
  CalendarCheck,
  DollarSign
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { getAdminStats, AdminStats, getAllUsers, User, getPlatformActivity, type PlatformActivity, type ActivitySummary, getMedicosPendientes } from '@/lib/admin';
import {
  BarChart,
  Bar,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalUsuarios: 0,
    totalMedicos: 0,
    totalPacientes: 0,
    medicosPendientes: 0,
    usuariosActivos: 0,
    usuariosInactivos: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<ActivitySummary>({
    citasHoy: 0,
    citasSemana: 0,
    consultasCompletadas: 0,
    ingresosMes: 0,
    activities: [],
    graphData: []
  });

  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    if (user?.rol !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, router, timeRange]); // Add timeRange dependency

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsData, usersResponse, activityResponse, pendingDocs] = await Promise.all([
        getAdminStats(),
        getAllUsers({ limit: 5 }),
        getPlatformActivity(timeRange),
        getMedicosPendientes()
      ]);

      setStats({
        totalUsuarios: statsData.totalUsuarios || 0,
        totalMedicos: statsData.totalMedicos || 0,
        totalPacientes: statsData.totalPacientes || 0,
        medicosPendientes: statsData.medicosPendientes || 0,
        usuariosActivos: statsData.usuariosActivos || 0,
        usuariosInactivos: statsData.usuariosInactivos || 0,
      });

      setRecentUsers(usersResponse.usuarios);
      setActivityData(activityResponse);
      setPendingDoctors(pendingDocs);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'cita': return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'consulta': return <Stethoscope className="w-4 h-4 text-blue-600" />;
      case 'pago': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'registro': return <Users className="w-4 h-4 text-violet-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'cita': return 'bg-teal-100';
      case 'consulta': return 'bg-blue-100';
      case 'pago': return 'bg-emerald-100';
      case 'registro': return 'bg-violet-100';
      default: return 'bg-gray-100';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'CONFIRMADA': { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmada' },
      'PROGRAMADA': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Programada' },
      'COMPLETADA': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Completada' },
      'CANCELADA': { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelada' },
      'COMPLETADO': { bg: 'bg-green-100', text: 'text-green-700', label: 'Completado' },
      'PENDIENTE': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pendiente' },
    };
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl text-xs">
          <p className="font-bold text-gray-900 mb-1">{label}</p>
          <div className="space-y-1">
            <p className="text-teal-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Citas: {payload[0].value}
            </p>
            <p className="text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Ingresos: S/ {payload[1].value}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    // ... (loading state)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-black/5 rounded-full blur-2xl -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            {getGreeting()}, Admin
          </h1>
          <p className="text-teal-50 opacity-90 text-lg max-w-xl">
            Aquí tienes un resumen de la actividad de MedConsult. Tienes {stats.medicosPendientes} médicos esperando verificación.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Usuarios</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalUsuarios}</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            {stats.medicosPendientes > 0 && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {stats.medicosPendientes} pendientes
              </span>
            )}
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Médicos</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalMedicos}</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-violet-50 text-violet-600 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
              Activos: {stats.usuariosActivos}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Pacientes</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalPacientes}</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Ingresos Mes</h3>
          <p className="text-2xl font-bold text-gray-900">S/ {activityData.ingresosMes.toFixed(0)}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Actividad de la Plataforma */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-teal-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Actividad de la Plataforma</h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setTimeRange('30d')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === '30d' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      30 Días
                    </button>
                    <button
                      onClick={() => setTimeRange('90d')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === '90d' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Trimestre
                    </button>
                    <button
                      onClick={() => setTimeRange('1y')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === '1y' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                      Año
                    </button>
                  </div>
                  <button
                    onClick={fetchDashboardData}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Actualizar"
                  >
                    <RefreshCw className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-100 bg-gray-50">
              {/* ... (Stats content same as before) ... */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-teal-600 mb-1">
                  <CalendarCheck className="w-5 h-5" />
                  <span className="text-2xl font-bold">{activityData.citasHoy}</span>
                </div>
                <p className="text-sm text-gray-500">Citas hoy</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                  <Calendar className="w-5 h-5" />
                  <span className="text-2xl font-bold">{activityData.citasSemana}</span>
                </div>
                <p className="text-sm text-gray-500">Citas esta semana</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-emerald-600 mb-1">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-2xl font-bold">{activityData.consultasCompletadas}</span>
                </div>
                <p className="text-sm text-gray-500">Consultas completadas</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-violet-600 mb-1">
                  <DollarSign className="w-5 h-5" />
                  <span className="text-2xl font-bold">S/ {activityData.ingresosMes.toFixed(0)}</span>
                </div>
                <p className="text-sm text-gray-500">Ingresos del mes</p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="p-6 h-80">
              {activityData.graphData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={activityData.graphData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      dy={10}
                      interval={timeRange === '30d' ? 2 : 1}
                    />
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar
                      yAxisId="left"
                      dataKey="citas"
                      name="Citas"
                      fill="#0d9488"
                      radius={[4, 4, 0, 0]}
                      barSize={timeRange === '1y' ? 20 : 8}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="ingresos"
                      name="Ingresos (S/)"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <BarChart3 className="w-12 h-12 mb-2 opacity-20" />
                  <p>No hay datos suficientes para mostrar la gráfica</p>
                </div>
              )}
            </div>

            {/* Recent Activity List (Optional / Secondary) */}
            <div className="border-t border-gray-100">
              <div className="px-6 py-4 bg-gray-50/50">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Actividad Reciente</h3>
                <div className="space-y-3">
                  {activityData.activities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getActivityBgColor(activity.type).replace('bg-', 'bg-').replace('-100', '-500')}`}></div>
                        <span className="text-gray-700 truncate max-w-[200px]">{activity.description}</span>
                      </div>
                      <span className="text-gray-400 text-xs">{formatRelativeTime(activity.timestamp)}</span>
                    </div>
                  ))}
                  {activityData.activities.length === 0 && (
                    <p className="text-gray-500 text-xs text-center py-2">No hay actividad reciente</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Pending Doctors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Médicos Pendientes</h3>
              {pendingDoctors.length > 0 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  {pendingDoctors.length} nuevos
                </span>
              )}
            </div>

            <div className="space-y-4">
              {pendingDoctors.slice(0, 3).map((doctor: any) => (
                <div key={doctor.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-50">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                    {doctor.usuario?.nombre?.[0] || 'D'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Dr. {doctor.usuario?.nombre} {doctor.usuario?.apellido}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{doctor.especialidad?.nombre || 'General'}</p>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/admin/doctors')}
                    className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {pendingDoctors.length === 0 && (
                <div className="text-center py-6 text-gray-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No hay solicitudes pendientes</p>
                </div>
              )}

              {pendingDoctors.length > 3 && (
                <button
                  onClick={() => router.push('/dashboard/admin/doctors')}
                  className="w-full text-center text-xs text-teal-600 font-medium hover:text-teal-700 mt-2"
                >
                  Ver todos ({pendingDoctors.length})
                </button>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Usuarios Recientes</h3>
            <div className="space-y-4">
              {recentUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold">
                      {user.nombre[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</p>
                      <p className="text-xs text-gray-500">{user.rol}</p>
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${user.activo ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
