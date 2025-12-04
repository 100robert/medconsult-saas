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
  Activity
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

interface DoctorStats {
  citasHoy: number;
  citasPendientes: number;
  pacientesTotales: number;
  calificacion: number;
  ingresosMes: number;
  consultasCompletadas: number;
}

export default function DoctorDashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<DoctorStats>({
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
    if (user?.rol !== 'MEDICO') {
      router.push('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStats({
        citasHoy: 6,
        citasPendientes: 3,
        pacientesTotales: 124,
        calificacion: 4.8,
        ingresosMes: 8500,
        consultasCompletadas: 89,
      });

      setTodayAppointments([
        {
          id: '1',
          paciente: { nombre: 'María', apellido: 'González' },
          horaInicio: '09:00',
          horaFin: '09:30',
          tipo: 'VIDEOCONSULTA',
          estado: 'CONFIRMADA',
          motivo: 'Control mensual'
        },
        {
          id: '2',
          paciente: { nombre: 'Juan', apellido: 'Pérez' },
          horaInicio: '10:00',
          horaFin: '10:30',
          tipo: 'PRESENCIAL',
          estado: 'PENDIENTE',
          motivo: 'Primera consulta'
        },
        {
          id: '3',
          paciente: { nombre: 'Ana', apellido: 'Rodríguez' },
          horaInicio: '11:00',
          horaFin: '11:30',
          tipo: 'VIDEOCONSULTA',
          estado: 'CONFIRMADA',
          motivo: 'Seguimiento tratamiento'
        },
        {
          id: '4',
          paciente: { nombre: 'Carlos', apellido: 'López' },
          horaInicio: '14:00',
          horaFin: '14:30',
          tipo: 'PRESENCIAL',
          estado: 'PENDIENTE',
          motivo: 'Dolor de cabeza frecuente'
        },
      ]);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoConfig = (estado: string) => {
    const config = {
      PENDIENTE: { bg: 'bg-amber-100', text: 'text-amber-700', icon: AlertCircle },
      CONFIRMADA: { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CheckCircle2 },
      COMPLETADA: { bg: 'bg-gray-100', text: 'text-gray-700', icon: CheckCircle2 },
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">¡Buenos días, Dr. {user?.apellido}!</h1>
          <p className="text-gray-500 mt-1">
            Tienes <span className="font-semibold text-teal-600">{stats.citasHoy} citas</span> programadas para hoy
          </p>
        </div>
        <div className="flex gap-2">
          <Link 
            href="/dashboard/schedule"
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Gestionar Horario
          </Link>
          <Link 
            href="/dashboard/appointments"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
          >
            Ver Todas las Citas
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
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
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.citasPendientes}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
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
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-yellow-100 rounded-xl">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.calificacion}</p>
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
              <span className="text-sm text-gray-500">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {todayAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No tienes citas programadas para hoy</p>
              </div>
            ) : (
              todayAppointments.map((apt) => {
                const estadoConfig = getEstadoConfig(apt.estado);
                const EstadoIcon = estadoConfig.icon;
                const isPast = apt.horaFin < getCurrentTimeSlot();
                
                return (
                  <div 
                    key={apt.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${isPast ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Time */}
                      <div className="text-center min-w-[70px]">
                        <p className="font-semibold text-gray-900">{apt.horaInicio}</p>
                        <p className="text-xs text-gray-500">{apt.horaFin}</p>
                      </div>
                      
                      {/* Divider */}
                      <div className="w-1 h-14 bg-teal-500 rounded-full"></div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {apt.paciente.nombre} {apt.paciente.apellido}
                          </p>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${estadoConfig.bg} ${estadoConfig.text}`}>
                            <EstadoIcon className="w-3 h-3" />
                            {apt.estado}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{apt.motivo}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`inline-flex items-center gap-1 text-xs ${
                            apt.tipo === 'VIDEOCONSULTA' ? 'text-blue-600' : 'text-gray-600'
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
                      <div className="flex items-center gap-2">
                        {apt.estado === 'PENDIENTE' && (
                          <button className="px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">
                            Confirmar
                          </button>
                        )}
                        {apt.estado === 'CONFIRMADA' && apt.tipo === 'VIDEOCONSULTA' && (
                          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            Iniciar
                          </button>
                        )}
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </button>
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
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Este Mes</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm">Consultas completadas</span>
                </div>
                <span className="font-semibold text-gray-900">{stats.consultasCompletadas}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Ingresos</span>
                </div>
                <span className="font-semibold text-green-600">${stats.ingresosMes.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm">vs. mes anterior</span>
                </div>
                <span className="font-semibold text-green-600">+12%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-2">
              <Link 
                href="/dashboard/patients"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Ver mis pacientes</span>
              </Link>
              <Link 
                href="/dashboard/schedule"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                  <Clock className="w-4 h-4 text-teal-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Configurar disponibilidad</span>
              </Link>
              <Link 
                href="/dashboard/reviews"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
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
