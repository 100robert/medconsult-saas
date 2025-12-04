'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  DollarSign, 
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
  RefreshCw
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { getAdminStats, AdminStats, getAllUsers, User } from '@/lib/admin';

interface DashboardStats extends AdminStats {
  ingresosAyer: number;
  consultasActivas: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsuarios: 0,
    totalMedicos: 0,
    totalPacientes: 0,
    medicosPendientes: 0,
    citasHoy: 0,
    citasSemana: 0,
    ingresosMes: 0,
    ingresosAyer: 0,
    consultasActivas: 0,
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
        ...statsData,
        ingresosAyer: 0, // Este dato vendría de otro endpoint
        consultasActivas: 0, // Este dato vendría de otro endpoint
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
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Médicos Activos',
      value: stats.totalMedicos.toLocaleString(),
      icon: Stethoscope,
      color: 'bg-emerald-500',
      trend: '+5%',
      trendUp: true,
    },
    {
      title: 'Pacientes',
      value: stats.totalPacientes.toLocaleString(),
      icon: UserCheck,
      color: 'bg-violet-500',
      trend: '+18%',
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
      title: 'Citas Hoy',
      value: stats.citasHoy.toLocaleString(),
      icon: Calendar,
      color: 'bg-cyan-500',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Ingresos del Mes',
      value: `$${stats.ingresosMes.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+22%',
      trendUp: true,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-500 mt-1">Bienvenido, {user?.nombre}. Aquí está el resumen de hoy.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => router.push('/dashboard/users')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            Gestionar Usuarios
          </button>
        </div>
      </div>

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
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.rol === 'MEDICO' ? 'bg-emerald-100' : 'bg-blue-100'
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
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.rol === 'MEDICO' 
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
