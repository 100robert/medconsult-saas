'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Stethoscope,
  Calendar,
  TrendingUp,
  Activity,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  ArrowUpRight,
  Sparkles,
  Shield,
  CreditCard,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { getAdminStats, AdminStats, getAllUsers, User, getPlatformActivity, type PlatformActivity, type ActivitySummary, getMedicosPendientes } from '@/lib/admin';
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
    totalCitas: 0,
    citasCanceladas: 0,
    consultasCompletadas: 0,
    totalIngresos: 0,
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
  }, [user, router, timeRange]);

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

  const getPeriodLabel = () => {
    switch (timeRange) {
      case '30d': return '30 días';
      case '90d': return 'Trimestre';
      case '1y': return 'Año';
      default: return '';
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'cita': return 'bg-teal-50';
      case 'consulta': return 'bg-blue-50';
      case 'pago': return 'bg-emerald-50';
      case 'registro': return 'bg-violet-50';
      default: return 'bg-gray-50';
    }
  };

  // Custom Tooltip for Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-sm p-4 border border-gray-100 shadow-xl rounded-2xl text-xs">
          <p className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1">{label}</p>
          <div className="space-y-2">
            <p className="text-teal-600 flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span>
                Citas
              </span>
              <span className="font-semibold">{payload[0].value}</span>
            </p>
            <p className="text-emerald-600 flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                Ingresos
              </span>
              <span className="font-semibold">S/ {payload[1].value}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-teal-100 border-t-teal-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-teal-600"></div>
          </div>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl shadow-teal-900/10"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-teal-100 mb-2 text-sm font-medium tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Panel de Administración</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {getGreeting()}, <span className="text-teal-200">Admin</span>
          </h1>
          <p className="text-teal-50 text-lg md:text-xl font-light leading-relaxed opacity-90">
            Resumen en tiempo real de tu plataforma. Tienes <strong className="text-white font-semibold">{stats.medicosPendientes} solicitudes</strong> de médicos esperando tu aprobación.
          </p>
        </div>

        <div className="absolute right-8 bottom-8 hidden md:block opacity-20 transform rotate-12">
          <Activity className="w-32 h-32" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.15)" }}
          onClick={() => router.push('/dashboard/admin/users')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 cursor-pointer hover:border-blue-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3.5 bg-blue-50/80 text-blue-600 rounded-2xl group-hover:bg-blue-100 transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100/50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +12%
            </span>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1 group-hover:text-blue-600 transition-colors">Total Usuarios</h3>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalUsuarios}</p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.15)" }}
          onClick={() => router.push('/dashboard/admin/doctors')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 cursor-pointer hover:border-teal-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3.5 bg-teal-50/80 text-teal-600 rounded-2xl group-hover:bg-teal-100 transition-colors">
              <Stethoscope className="w-6 h-6" />
            </div>
            {stats.medicosPendientes > 0 ? (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-100/50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {stats.medicosPendientes} nuevos
              </span>
            ) : (
              <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100/50 px-2.5 py-1 rounded-full">
                Al día
              </span>
            )}
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1 group-hover:text-teal-600 transition-colors">Total Médicos</h3>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalMedicos}</p>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.15)" }}
          onClick={() => router.push('/dashboard/admin/patients')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 cursor-pointer hover:border-violet-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3.5 bg-violet-50/80 text-violet-600 rounded-2xl group-hover:bg-violet-100 transition-colors">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1 group-hover:text-violet-600 transition-colors">Total Pacientes</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{stats.totalPacientes}</p>
              <span className="text-sm text-gray-400 font-medium">Activos: {stats.usuariosActivos}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.15)" }}
          onClick={() => router.push('/dashboard/admin/finances')}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 transition-all duration-300 cursor-pointer hover:border-emerald-200 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3.5 bg-emerald-50/80 text-emerald-600 rounded-2xl group-hover:bg-emerald-100 transition-colors">
              <span className="flex items-center justify-center text-lg font-bold">S/</span>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100/50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +8%
            </span>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1 group-hover:text-emerald-600 transition-colors">Ingresos ({getPeriodLabel()})</h3>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">S/ {activityData.totalIngresos.toFixed(0)}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          {/* Actividad de la Plataforma */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600" />
                    Actividad de la Plataforma
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Comparativa de citas e ingresos por periodo</p>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200/50">
                  <button
                    onClick={() => setTimeRange('30d')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${timeRange === '30d' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    30 Días
                  </button>
                  <button
                    onClick={() => setTimeRange('90d')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${timeRange === '90d' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Trimestre
                  </button>
                  <button
                    onClick={() => setTimeRange('1y')}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${timeRange === '1y' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Año
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 bg-gray-50/30">
              <div className="p-6 text-center hover:bg-gray-50 transition-colors">
                <div className="text-2xl font-bold text-gray-900 mb-1">{activityData.totalCitas}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                  Citas ({getPeriodLabel()})
                </div>
              </div>
              <div className="p-6 text-center hover:bg-gray-50 transition-colors">
                <div className="text-2xl font-bold text-gray-900 mb-1">{activityData.citasCanceladas}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  Canceladas
                </div>
              </div>
              <div className="p-6 text-center hover:bg-gray-50 transition-colors">
                <div className="text-2xl font-bold text-gray-900 mb-1">{activityData.consultasCompletadas}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Completadas
                </div>
              </div>
              <div className="p-6 text-center hover:bg-gray-50 transition-colors">
                <div className="text-2xl font-bold text-gray-900 mb-1">S/ {activityData.totalIngresos.toFixed(0)}</div>
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                  Ingresos ({getPeriodLabel()})
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="p-8 h-[400px]">
              {activityData.graphData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={activityData.graphData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCitas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      style={{ fontSize: '11px', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                      dy={15}
                      interval={timeRange === '30d' ? 2 : 1}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#94a3b8"
                      style={{ fontSize: '11px', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#94a3b8"
                      style={{ fontSize: '11px', fontWeight: 500 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />

                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="citas"
                      name="Citas"
                      stroke="#0d9488"
                      strokeWidth={3}
                      fill="url(#colorCitas)"
                      activeDot={{ r: 6, fill: '#fff', stroke: '#0d9488', strokeWidth: 3 }}
                    />

                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="ingresos"
                      name="Ingresos (S/)"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#colorIngresos)" // Using same color for now, could be distinct
                      activeDot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 rounded-2xl border-2 border-dashed border-gray-100">
                  <div className="p-4 bg-gray-50 rounded-full mb-3">
                    <BarChart3 className="w-8 h-8 opacity-40" />
                  </div>
                  <p className="font-medium">No hay datos suficientes para mostrar la gráfica</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Pending Doctors */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                Médicos Pendientes
              </h3>
              {pendingDoctors.length > 0 && (
                <span className="flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                  {pendingDoctors.length}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {pendingDoctors.slice(0, 3).map((doctor: any) => (
                <div key={doctor.id} className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-gray-100 hover:border-gray-200 hover:shadow-sm">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center text-teal-700 font-bold text-lg shadow-inner">
                      {doctor.usuario?.nombre?.[0] || 'D'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 border-2 border-white rounded-full flex items-center justify-center">
                      <Clock className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      Dr. {doctor.usuario?.nombre} {doctor.usuario?.apellido}
                    </p>
                    <p className="text-xs text-gray-500 truncate font-medium">{doctor.especialidad?.nombre || 'General'}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Esperando desde hace 2h</p>
                  </div>

                  <button
                    onClick={() => router.push('/dashboard/admin/doctors')}
                    className="p-2 text-gray-300 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all"
                    title="Ver detalle"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {pendingDoctors.length === 0 && (
                <div className="text-center py-10 px-4 border-2 border-dashed border-gray-100 rounded-2xl">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">¡Todo al día!</p>
                  <p className="text-xs text-gray-500 mt-1">No hay solicitudes de médicos pendientes.</p>
                </div>
              )}

              {pendingDoctors.length > 3 && (
                <button
                  onClick={() => router.push('/dashboard/admin/doctors')}
                  className="w-full py-3 text-xs text-teal-600 font-semibold hover:bg-teal-50 rounded-xl transition-colors flex items-center justify-center gap-1 group"
                >
                  Ver los {pendingDoctors.length} pendientes
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Usuarios Recientes
              </h3>
            </div>

            <div className="space-y-1">
              {recentUsers.slice(0, 5).map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-default group">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${user.rol === 'MEDICO' ? 'bg-teal-100 text-teal-700' :
                      user.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                      {user.nombre[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-teal-700 transition-colors">{user.nombre} {user.apellido}</p>
                      <p className="text-[11px] text-gray-500 font-medium bg-gray-100 inline-block px-1.5 py-0.5 rounded text-center min-w-[50px] mt-0.5">
                        {user.rol === 'MEDICO' ? 'Médico' :
                          user.rol === 'PACIENTE' ? 'Paciente' :
                            user.rol}
                      </p>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${user.activo ? 'bg-emerald-500' : 'bg-gray-300'}`} title={user.activo ? 'Activo' : 'Inactivo'}></div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 text-xs text-gray-500 font-medium hover:text-gray-900 transition-colors border-t border-gray-100 pt-4">
              Ver directorio completo
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
