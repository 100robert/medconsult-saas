'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
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
  Heart,
  Droplets,
  Thermometer,
  Scale,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { GlassCard } from '@/components/ui';
import { getMisCitas } from '@/lib/appointments';
import { getMisConsultas } from '@/lib/consultations';

// Health data for charts
const healthData = [
  { day: 'Lun', heartRate: 72, pressure: 120, steps: 8500 },
  { day: 'Mar', heartRate: 75, pressure: 118, steps: 10200 },
  { day: 'Mie', heartRate: 68, pressure: 122, steps: 7800 },
  { day: 'Jue', heartRate: 71, pressure: 119, steps: 9100 },
  { day: 'Vie', heartRate: 73, pressure: 117, steps: 11500 },
  { day: 'Sab', heartRate: 69, pressure: 121, steps: 6200 },
  { day: 'Dom', heartRate: 70, pressure: 120, steps: 5400 },
];

const appointmentData = [
  { month: 'Ene', citas: 12 },
  { month: 'Feb', citas: 19 },
  { month: 'Mar', citas: 15 },
  { month: 'Abr', citas: 22 },
  { month: 'May', citas: 28 },
  { month: 'Jun', citas: 25 },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    proximasCitas: 0,
    citasHoy: 0,
    consultasRealizadas: 0,
    citasPendientes: 0,
    proximaCita: null as any,
  });

  // Redirigir ADMIN y MEDICO a sus dashboards específicos
  useEffect(() => {
    if (user?.rol === 'ADMIN') {
      router.replace('/dashboard/admin');
      return;
    }
    if (user?.rol === 'MEDICO') {
      router.replace('/dashboard/medico');
      return;
    }
  }, [user?.rol, router]);

  // Cargar datos reales (solo para PACIENTE)
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id || user?.rol !== 'PACIENTE') return;
      
      setLoading(true);
      try {
        const [citas, consultas] = await Promise.all([
          getMisCitas().catch(() => []),
          getMisConsultas().catch(() => []),
        ]);

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        // Citas de hoy
        const citasHoy = citas.filter((c: any) => {
          const fechaCita = new Date(c.fechaHoraCita || c.fecha);
          return fechaCita >= hoy && fechaCita < manana && c.estado !== 'CANCELADA';
        });

        // Próximas citas (futuras, no canceladas)
        const proximasCitas = citas.filter((c: any) => {
          const fechaCita = new Date(c.fechaHoraCita || c.fecha);
          return fechaCita >= hoy && c.estado !== 'CANCELADA' && c.estado !== 'COMPLETADA';
        });

        // Citas pendientes de confirmación
        const citasPendientes = citas.filter((c: any) => 
          c.estado === 'PROGRAMADA' || c.estado === 'PENDIENTE'
        );

        // Consultas completadas
        const consultasCompletadas = consultas.filter((c: any) => 
          c.estado === 'COMPLETADA'
        );

        // Próxima cita
        const proximaCita = proximasCitas.sort((a: any, b: any) => 
          new Date(a.fechaHoraCita || a.fecha).getTime() - new Date(b.fechaHoraCita || b.fecha).getTime()
        )[0];

        setDashboardData({
          proximasCitas: proximasCitas.length,
          citasHoy: citasHoy.length,
          consultasRealizadas: consultasCompletadas.length,
          citasPendientes: citasPendientes.length,
          proximaCita,
        });
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user?.id]);

  // Stats según el rol
  const getStats = () => {
    if (user?.rol === 'ADMIN') {
      return [
        { label: 'Usuarios Totales', value: '1,234', icon: Users, change: '+12%', color: 'bg-teal-600' },
        { label: 'Citas Hoy', value: String(dashboardData.citasHoy), icon: Calendar, change: '', color: 'bg-emerald-600' },
        { label: 'Ingresos del Mes', value: 'S/. 12,450', icon: CreditCard, change: '+18%', color: 'bg-slate-600' },
        { label: 'Consultas Activas', value: String(dashboardData.consultasRealizadas), icon: FileText, change: '', color: 'bg-amber-500' },
      ];
    }

    if (user?.rol === 'MEDICO') {
      return [
        { label: 'Citas Hoy', value: String(dashboardData.citasHoy), icon: Calendar, change: '', color: 'bg-teal-600' },
        { label: 'Pacientes Totales', value: '156', icon: Users, change: '+3', color: 'bg-emerald-600' },
        { label: 'Consultas Pendientes', value: String(dashboardData.citasPendientes), icon: Clock, change: '', color: 'bg-amber-500' },
        { label: 'Calificación', value: '4.8', icon: Star, change: '', color: 'bg-slate-600' },
      ];
    }

    // PACIENTE
    return [
      { label: 'Próximas Citas', value: String(dashboardData.proximasCitas), icon: Calendar, change: '', color: 'bg-teal-600' },
      { label: 'Consultas Realizadas', value: String(dashboardData.consultasRealizadas), icon: CheckCircle, change: '', color: 'bg-emerald-600' },
      { label: 'Citas Pendientes', value: String(dashboardData.citasPendientes), icon: Clock, change: '', color: 'bg-slate-600' },
      { label: 'Citas Hoy', value: String(dashboardData.citasHoy), icon: AlertCircle, change: '', color: 'bg-amber-500' },
    ];
  };

  const stats = getStats();

  // Health Metrics for patient
  const healthMetrics = [
    { label: 'Ritmo Cardíaco', value: '72', unit: 'bpm', icon: Heart, color: 'bg-rose-500', status: 'Normal' },
    { label: 'Presión Arterial', value: '120/80', unit: 'mmHg', icon: Activity, color: 'bg-teal-500', status: 'Óptima' },
    { label: 'Glucosa', value: '95', unit: 'mg/dL', icon: Droplets, color: 'bg-slate-500', status: 'Normal' },
    { label: 'Peso', value: '70', unit: 'kg', icon: Scale, color: 'bg-emerald-500', status: 'IMC: 22.5' },
  ];

  // Quick actions según el rol
  const getQuickActions = () => {
    if (user?.rol === 'ADMIN') {
      return [
        { label: 'Crear Usuario', href: '/dashboard/users/new', icon: Users, color: 'bg-teal-600' },
        { label: 'Ver Reportes', href: '/dashboard/reports', icon: FileText, color: 'bg-slate-600' },
        { label: 'Configuración', href: '/dashboard/settings', icon: TrendingUp, color: 'bg-emerald-600' },
      ];
    }

    if (user?.rol === 'MEDICO') {
      return [
        { label: 'Ver Agenda', href: '/dashboard/appointments', icon: Calendar, color: 'bg-teal-600' },
        { label: 'Mis Pacientes', href: '/dashboard/patients', icon: Users, color: 'bg-slate-600' },
        { label: 'Nueva Consulta', href: '/dashboard/consultations/new', icon: FileText, color: 'bg-emerald-600' },
      ];
    }

    return [
      { label: 'Agendar Cita', href: '/dashboard/appointments/new', icon: Calendar, color: 'bg-teal-600' },
      { label: 'Buscar Médicos', href: '/dashboard/doctors', icon: Users, color: 'bg-slate-600' },
      { label: 'Mis Consultas', href: '/dashboard/consultations', icon: FileText, color: 'bg-emerald-600' },
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div
        className="max-w-7xl mx-auto space-y-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Welcome Banner */}
        <motion.div variants={item}>
          <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 to-emerald-600 rounded-3xl p-8 text-white shadow-xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-emerald-500/20 rounded-full translate-y-1/2 blur-2xl" />
            
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <motion.div 
                    className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{getGreeting()}</span>
                  </motion.div>
                  <motion.h1 
                    className="text-4xl font-bold mb-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    ¡Hola, {user?.nombre || 'Usuario'}!
                  </motion.h1>
                  <motion.p 
                    className="text-white/80 max-w-md text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {user?.rol === 'ADMIN' && 'Aquí tienes un resumen completo de la plataforma.'}
                    {user?.rol === 'MEDICO' && 'Tu agenda de hoy está lista. Tienes pacientes esperando.'}
                    {user?.rol === 'PACIENTE' && 'Gestiona tus citas y mantén tu salud al día.'}
                    {!user?.rol && 'Bienvenido a tu panel de control.'}
                  </motion.p>
                </div>
                <motion.div 
                  className="hidden md:block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-28 h-28 bg-white/15 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 animate-float">
                    <Activity className="w-14 h-14" />
                  </div>
                </motion.div>
              </div>

              {/* Quick Stats in Banner */}
              <motion.div 
                className="flex items-center gap-6 mt-8 pt-6 border-t border-white/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Bell className="w-5 h-5" />
                  <span className="text-sm">{dashboardData.citasPendientes} cita(s) pendiente(s)</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">
                    {dashboardData.proximaCita 
                      ? `Próxima: ${new Date(dashboardData.proximaCita.fechaHoraCita || dashboardData.proximaCita.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} ${new Date(dashboardData.proximaCita.fechaHoraCita || dashboardData.proximaCita.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`
                      : 'Sin citas próximas'
                    }
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={container}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div key={index} variants={item}>
                <GlassCard
                  variant="light"
                  className="group cursor-pointer"
                  glow={index === 0}
                  glowColor="blue"
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
                    <motion.div 
                      className={`p-4 rounded-2xl ${stat.color} shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Health Metrics for Patients */}
        {user?.rol === 'PACIENTE' && (
          <motion.div variants={item}>
            <GlassCard variant="light" size="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Métricas de Salud
                </h2>
                <span className="text-sm text-gray-500">Última actualización: Hoy</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {healthMetrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <motion.div
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/50"
                      whileHover={{ scale: 1.02, y: -4 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2.5 rounded-xl ${metric.color} shadow-lg`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                        <span className="text-sm text-gray-500">{metric.unit}</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-medium mt-1 block">{metric.status}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Heart Rate Chart */}
              <div className="bg-white/50 rounded-2xl p-6 border border-white/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ritmo Cardíaco Semanal</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                    <YAxis stroke="#9ca3af" fontSize={12} domain={[60, 90]} />
                    <Tooltip 
                      contentStyle={{ 
                        background: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '12px',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="heartRate" 
                      stroke="#2E6CFD" 
                      strokeWidth={3}
                      fill="#2E6CFD" 
                      fillOpacity={0.2}
                    /> 
                    
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div variants={item}>
          <GlassCard variant="light">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Acciones Rápidas</h2>
              <span className="text-sm text-gray-500">Accede rápidamente</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <motion.div
                      className="group flex items-center justify-between p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 cursor-pointer"
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${action.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900">{action.label}</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Próximas citas */}
          <motion.div variants={item}>
            <GlassCard variant="light" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">
                  {user?.rol === 'MEDICO' ? 'Próximas Citas' : 'Mis Próximas Citas'}
                </h2>
                <span className="px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-full">
                  3 pendientes
                </span>
              </div>
              <div className="space-y-4">
                {[
                  { name: user?.rol === 'MEDICO' ? 'María González' : 'Dr. Juan Pérez', time: 'Hoy, 10:00 AM', status: 'próxima', specialty: 'Cardiología' },
                  { name: user?.rol === 'MEDICO' ? 'Carlos Ruiz' : 'Dra. Ana López', time: 'Mañana, 2:00 PM', status: 'confirmada', specialty: 'Dermatología' },
                  { name: user?.rol === 'MEDICO' ? 'Laura Sánchez' : 'Dr. Miguel Torres', time: 'Vie, 9:00 AM', status: 'confirmada', specialty: 'Pediatría' },
                ].map((appointment, index) => (
                  <motion.div
                    key={index}
                    className="group flex items-center justify-between p-4 bg-white/50 hover:bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 transition-all cursor-pointer"
                    whileHover={{ scale: 1.01, x: 4 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {appointment.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {index === 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.name}</p>
                        <p className="text-sm text-gray-500">{appointment.specialty} • {appointment.time}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                      appointment.status === 'próxima' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {appointment.status === 'próxima' ? 'Próxima' : 'Confirmada'}
                    </span>
                  </motion.div>
                ))}
              </div>
              <Link href="/dashboard/appointments">
                <motion.div
                  className="flex items-center justify-center gap-2 mt-6 py-3 text-teal-600 hover:text-emerald-600 font-semibold hover:bg-white/50 rounded-xl transition-colors"
                  whileHover={{ scale: 1.02 }}
                >
                  Ver todas las citas
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </GlassCard>
          </motion.div>

          {/* Actividad reciente / Chart */}
          <motion.div variants={item}>
            <GlassCard variant="light" className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Resumen de Citas</h2>
                <button className="text-sm text-teal-600 hover:text-emerald-600 font-semibold transition-colors">
                  Ver detalles
                </button>
              </div>
              
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={appointmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <Bar dataKey="citas" fill="#0D9488" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              {/* Activity List */}
              <div className="mt-6 space-y-3">
                {[
                  { action: 'Consulta completada', desc: 'Con Dr. Pérez', time: 'Hace 2h', icon: CheckCircle, color: 'bg-emerald-500' },
                  { action: 'Nueva cita agendada', desc: 'Dermatología', time: 'Hace 5h', icon: Calendar, color: 'bg-teal-600' },
                ].map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-white/40 rounded-xl"
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.6)' }}
                    >
                      <div className={`p-2 rounded-lg ${activity.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400">{activity.time}</span>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
