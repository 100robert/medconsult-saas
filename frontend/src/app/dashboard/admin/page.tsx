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
  FileText
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { getAdminStats, AdminStats, getAllUsers, User } from '@/lib/admin';

interface DashboardStats {
  totalUsuarios: number;
  totalMedicos: number;
  totalPacientes: number;
  medicosPendientes: number;
  usuariosActivos: number;
  usuariosInactivos: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
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

  useEffect(() => {
    if (user?.rol !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Obtener estadísticas del backend
      const [statsData, usersResponse] = await Promise.all([
        getAdminStats(),
        getAllUsers({ limit: 5 })
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

      // Por ahora, médicos pendientes de ejemplo
      // TODO: Crear endpoint para obtener médicos pendientes de verificación
      setPendingDoctors([]);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsuarios.toLocaleString(),
      icon: Users,
      color: 'bg-blue-500',
      trend: '',
      trendUp: true,
    },
    {
      title: 'Médicos',
      value: stats.totalMedicos.toLocaleString(),
      icon: Stethoscope,
      color: 'bg-emerald-500',
      trend: '',
      trendUp: true,
    },
    {
      title: 'Pacientes',
      value: stats.totalPacientes.toLocaleString(),
      icon: UserCheck,
      color: 'bg-violet-500',
      trend: '',
      trendUp: true,
    },
    {
      title: 'Médicos Pendientes',
      value: stats.medicosPendientes.toLocaleString(),
      icon: Clock,
      color: 'bg-amber-500',
      trend: '',
      trendUp: false,
      alert: stats.medicosPendientes > 0,
    },
    {
      title: 'Usuarios Activos',
      value: stats.usuariosActivos.toLocaleString(),
      icon: CheckCircle2,
      color: 'bg-cyan-500',
      trend: '',
      trendUp: true,
    },
    {
      title: 'Usuarios Inactivos',
      value: stats.usuariosInactivos.toLocaleString(),
      icon: UserX,
      color: 'bg-red-500',
      trend: '',
      trendUp: false,
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
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
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-emerald-500/20 rounded-full translate-y-1/2 blur-2xl" />
          <div className="absolute top-1/2 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-1/2 blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div>
                <motion.div
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Shield className="w-4 h-4 text-teal-400" />
                  <span>Panel de Administración</span>
                </motion.div>
                <motion.h1
                  className="text-4xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {getGreeting()}, {user?.nombre || 'Admin'}!
                </motion.h1>
                <motion.p
                  className="text-white/70 max-w-md text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Aquí tienes el resumen completo de la plataforma MedConsult.
                </motion.p>
              </div>
              <motion.div
                className="hidden md:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-28 h-28 bg-gradient-to-br from-teal-500/30 to-emerald-500/30 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20">
                  <Activity className="w-14 h-14 text-teal-400" />
                </div>
              </motion.div>
            </div>

            {/* Quick Stats in Banner */}
            <motion.div
              className="flex flex-wrap items-center gap-4 mt-8 pt-6 border-t border-white/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-sm">{stats.totalUsuarios} usuarios registrados</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
                <span className="text-sm">{stats.totalMedicos} médicos activos</span>
              </div>
              {stats.medicosPendientes > 0 && (
                <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-500/30">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-amber-200">{stats.medicosPendientes} pendiente(s) de verificar</span>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="flex flex-wrap gap-3 mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={() => router.push('/dashboard/users')}
                className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white rounded-xl transition-colors text-sm font-medium"
              >
                <Users className="w-4 h-4" />
                Gestionar Usuarios
              </button>
              <button
                onClick={() => router.push('/dashboard/reports')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium backdrop-blur-sm"
              >
                <FileText className="w-4 h-4" />
                Ver Reportes
              </button>
              <button
                onClick={() => router.push('/dashboard/settings')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium backdrop-blur-sm"
              >
                <Settings className="w-4 h-4" />
                Configuración
              </button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-white rounded-xl p-6 shadow-sm border ${card.alert ? 'border-amber-300' : 'border-gray-100'} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              {card.trend && (
                <div className={`flex items-center gap-1 text-sm font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {card.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {card.trend}
                </div>
              )}
              {card.alert && (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Médicos Pendientes de Aprobación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Médicos Pendientes</h2>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                {pendingDoctors.length} pendientes
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingDoctors.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-2" />
                <p>No hay médicos pendientes de aprobación</p>
              </div>
            ) : (
              pendingDoctors.map((doctor) => (
                <div key={doctor.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{doctor.nombre}</p>
                        <p className="text-sm text-gray-500">{doctor.especialidad}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
                        Aprobar
                      </button>
                      <button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors">
                        Rechazar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {pendingDoctors.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => router.push('/dashboard/doctors?status=pending')}
                className="text-teal-600 text-sm font-medium hover:text-teal-700"
              >
                Ver todos los pendientes →
              </button>
            </div>
          )}
        </div>

        {/* Usuarios Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Usuarios Recientes</h2>
              <button
                onClick={() => router.push('/dashboard/users')}
                className="text-teal-600 text-sm font-medium hover:text-teal-700"
              >
                Ver todos
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.rol === 'MEDICO' ? 'bg-emerald-100' : 'bg-blue-100'
                      }`}>
                      {user.rol === 'MEDICO' ? (
                        <Stethoscope className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Users className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.nombre} {user.apellido}</p>
                      <p className="text-sm text-gray-500">{user.correo}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.rol === 'MEDICO'
                      ? 'bg-emerald-100 text-emerald-700'
                      : user.rol === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                    {user.rol}
                  </span>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No hay usuarios recientes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Actividad de la Plataforma</h2>
          <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
            <option>Este año</option>
          </select>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Gráfico de actividad</p>
            <p className="text-sm">Integrar con librería de gráficos (Chart.js, Recharts)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
