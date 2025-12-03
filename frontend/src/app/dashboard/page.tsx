'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Bell,
  Star,
  Activity,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Stats según el rol
  const getStats = () => {
    if (user?.rol === 'ADMIN') {
      return [
        { label: 'Usuarios Totales', value: '1,234', icon: Users, change: '+12%', color: 'blue', gradient: 'from-blue-500 to-blue-600' },
        { label: 'Citas Hoy', value: '45', icon: Calendar, change: '+5%', color: 'green', gradient: 'from-emerald-500 to-teal-600' },
        { label: 'Ingresos del Mes', value: '$12,450', icon: CreditCard, change: '+18%', color: 'purple', gradient: 'from-purple-500 to-pink-600' },
        { label: 'Consultas Activas', value: '23', icon: FileText, change: '+8%', color: 'orange', gradient: 'from-orange-500 to-amber-600' },
      ];
    }

    if (user?.rol === 'MEDICO') {
      return [
        { label: 'Citas Hoy', value: '8', icon: Calendar, change: '', color: 'blue', gradient: 'from-blue-500 to-blue-600' },
        { label: 'Pacientes Totales', value: '156', icon: Users, change: '+3', color: 'green', gradient: 'from-emerald-500 to-teal-600' },
        { label: 'Consultas Pendientes', value: '5', icon: Clock, change: '', color: 'orange', gradient: 'from-orange-500 to-amber-600' },
        { label: 'Calificación', value: '4.8', icon: Star, change: '', color: 'purple', gradient: 'from-purple-500 to-pink-600' },
      ];
    }

    // PACIENTE
    return [
      { label: 'Próximas Citas', value: '2', icon: Calendar, change: '', color: 'blue', gradient: 'from-blue-500 to-blue-600' },
      { label: 'Consultas Realizadas', value: '12', icon: CheckCircle, change: '', color: 'green', gradient: 'from-emerald-500 to-teal-600' },
      { label: 'Médicos Favoritos', value: '3', icon: Users, change: '', color: 'purple', gradient: 'from-purple-500 to-pink-600' },
      { label: 'Pendientes de Pago', value: '1', icon: AlertCircle, change: '', color: 'orange', gradient: 'from-orange-500 to-amber-600' },
    ];
  };

  const stats = getStats();

  // Quick actions según el rol
  const getQuickActions = () => {
    if (user?.rol === 'ADMIN') {
      return [
        { label: 'Crear Usuario', href: '/dashboard/users/new', icon: Users, color: 'bg-blue-500' },
        { label: 'Ver Reportes', href: '/dashboard/reports', icon: FileText, color: 'bg-purple-500' },
        { label: 'Configuración', href: '/dashboard/settings', icon: TrendingUp, color: 'bg-emerald-500' },
      ];
    }

    if (user?.rol === 'MEDICO') {
      return [
        { label: 'Ver Agenda', href: '/dashboard/appointments', icon: Calendar, color: 'bg-blue-500' },
        { label: 'Mis Pacientes', href: '/dashboard/patients', icon: Users, color: 'bg-purple-500' },
        { label: 'Nueva Consulta', href: '/dashboard/consultations/new', icon: FileText, color: 'bg-emerald-500' },
      ];
    }

    return [
      { label: 'Agendar Cita', href: '/dashboard/appointments/new', icon: Calendar, color: 'bg-blue-500' },
      { label: 'Buscar Médicos', href: '/dashboard/doctors', icon: Users, color: 'bg-purple-500' },
      { label: 'Mis Consultas', href: '/dashboard/consultations', icon: FileText, color: 'bg-emerald-500' },
    ];
  };

  const quickActions = getQuickActions();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 text-white">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-purple-500/20 rounded-full translate-y-1/2 blur-2xl" />
        
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                <span>{getGreeting()}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">
                ¡Hola, {user?.nombre}!
              </h1>
              <p className="text-blue-100 max-w-md">
                {user?.rol === 'ADMIN' && 'Aquí tienes un resumen completo de la plataforma. Todo marcha excelente.'}
                {user?.rol === 'MEDICO' && 'Tu agenda de hoy está lista. Tienes pacientes esperando.'}
                {user?.rol === 'PACIENTE' && 'Gestiona tus citas y mantén tu salud al día.'}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Activity className="w-12 h-12" />
              </div>
            </div>
          </div>

          {/* Quick Stats in Banner */}
          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-200" />
              <span className="text-sm">3 notificaciones nuevas</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-200" />
              <span className="text-sm">Próxima cita: Hoy 10:00 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl" />
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
          <span className="text-sm text-gray-500">Accede rápidamente</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="group flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-2 border-transparent hover:border-blue-100 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{action.label}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas citas */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {user?.rol === 'MEDICO' ? 'Próximas Citas' : 'Mis Próximas Citas'}
              </h2>
              <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
                3 pendientes
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: user?.rol === 'MEDICO' ? 'María González' : 'Dr. Juan Pérez', time: 'Hoy, 10:00 AM', status: 'próxima', specialty: 'Cardiología' },
                { name: user?.rol === 'MEDICO' ? 'Carlos Ruiz' : 'Dra. Ana López', time: 'Mañana, 2:00 PM', status: 'confirmada', specialty: 'Dermatología' },
                { name: user?.rol === 'MEDICO' ? 'Laura Sánchez' : 'Dr. Miguel Torres', time: 'Vie, 9:00 AM', status: 'confirmada', specialty: 'Pediatría' },
              ].map((appointment, index) => (
                <div
                  key={index}
                  className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                        {appointment.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {index === 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.name}</p>
                      <p className="text-sm text-gray-500">{appointment.specialty} • {appointment.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    appointment.status === 'próxima' 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {appointment.status === 'próxima' ? 'Próxima' : 'Confirmada'}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/appointments"
              className="flex items-center justify-center gap-2 mt-6 py-3 text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-xl transition-colors"
            >
              Ver todas las citas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Actividad Reciente</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver todo
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { action: 'Consulta completada', desc: 'Con Dr. Pérez', time: 'Hace 2 horas', icon: CheckCircle, gradient: 'from-emerald-500 to-teal-600' },
                { action: 'Nueva cita agendada', desc: 'Dermatología', time: 'Hace 5 horas', icon: Calendar, gradient: 'from-blue-500 to-blue-600' },
                { action: 'Pago procesado', desc: '$50.00 USD', time: 'Ayer', icon: CreditCard, gradient: 'from-purple-500 to-pink-600' },
                { action: 'Receta generada', desc: 'Consulta #1234', time: 'Hace 2 días', icon: FileText, gradient: 'from-orange-500 to-amber-600' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{item.action}</p>
                      <p className="text-sm text-gray-500 truncate">{item.desc}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
