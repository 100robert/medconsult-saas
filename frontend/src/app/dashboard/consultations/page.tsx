'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, Loader2, User, Calendar, Stethoscope, Pill, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { getMisConsultas, type Consulta } from '@/lib/consultations';
import { useAuthStore } from '@/store/authStore';

const estadoConfig = {
  EN_PROGRESO: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Clock,
    label: 'En Progreso',
    solidColor: 'bg-blue-500'
  },
  COMPLETADA: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle2,
    label: 'Completada',
    solidColor: 'bg-emerald-500'
  },
  CANCELADA: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
    label: 'Cancelada',
    solidColor: 'bg-red-500'
  },
};

export default function ConsultationsPage() {
  const { user } = useAuthStore();
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    async function fetchConsultas() {
      setLoading(true);
      setError(null);

      try {
        const data = await getMisConsultas();
        setConsultas(data);
      } catch (err: any) {
        console.error('Error al cargar consultas:', err);
        setError(err.response?.data?.message || 'Error al cargar las consultas');
        setConsultas([]);
      } finally {
        setLoading(false);
      }
    }

    fetchConsultas();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredConsultas = consultas.filter((consulta) => {
    if (filterStatus === 'all') return true;
    return consulta.estado === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando consultas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Consultas</h1>
          <p className="text-gray-600 mt-1">
            Historial de consultas médicas realizadas
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                ? 'bg-teal-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {status === 'all' ? 'Todas' : estadoConfig[status as keyof typeof estadoConfig]?.label || status}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Consultas List */}
      {filteredConsultas.length > 0 ? (
        <div className="space-y-4">
          {filteredConsultas.map((consulta) => {
            const config = estadoConfig[consulta.estado] || estadoConfig.EN_PROGRESO;
            const IconEstado = config.icon;

            // Determinar qué mostrar según el rol
            const isMedico = user?.rol === 'MEDICO';
            const titulo = isMedico
              ? `${consulta.cita.paciente.usuario.nombre} ${consulta.cita.paciente.usuario.apellido}`
              : `Dr. ${consulta.cita.medico.usuario.nombre} ${consulta.cita.medico.usuario.apellido}`;

            const subtitulo = isMedico
              ? 'Paciente'
              : (consulta.cita.medico.especialidad?.nombre || 'Medicina General');

            const AvatarIcon = isMedico ? User : Stethoscope;

            return (
              <div
                key={consulta.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${isMedico ? 'bg-blue-100' : 'bg-teal-100'
                      }`}>
                      <AvatarIcon className={`w-7 h-7 ${isMedico ? 'text-blue-600' : 'text-teal-600'
                        }`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-gray-900">
                          {titulo}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                          <IconEstado className="w-3 h-3" />
                          {config.label}
                        </span>
                      </div>

                      <p className={`text-sm font-medium mt-0.5 ${isMedico ? 'text-gray-500' : 'text-teal-600'
                        }`}>
                        {subtitulo}
                      </p>

                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(consulta.fechaInicio)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(consulta.fechaInicio)}
                        </span>
                        {consulta.duracion && (
                          <span className="text-gray-400">
                            ({consulta.duracion} min)
                          </span>
                        )}
                      </div>

                      {/* Diagnóstico y tratamiento */}
                      {consulta.diagnostico && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                          <p className="text-sm text-gray-600">{consulta.diagnostico}</p>
                        </div>
                      )}

                      {/* Recetas */}
                      {consulta.recetas && consulta.recetas.length > 0 && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
                          <Pill className="w-4 h-4" />
                          <span>{consulta.recetas.length} receta(s) emitida(s)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/consultations/${consulta.id}`}>
                      <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                        Ver Detalle
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No tienes consultas</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Las consultas aparecerán aquí una vez que tengas citas confirmadas y el médico inicie la consulta.
          </p>
          <Link href="/dashboard/appointments">
            <Button variant="primary" className="mt-6">
              Ver Mis Citas
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      {consultas.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">
              {consultas.filter(c => c.estado === 'EN_PROGRESO').length}
            </p>
            <p className="text-sm text-blue-700">En Progreso</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {consultas.filter(c => c.estado === 'COMPLETADA').length}
            </p>
            <p className="text-sm text-emerald-700">Completadas</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-gray-600">
              {consultas.length}
            </p>
            <p className="text-sm text-gray-700">Total</p>
          </div>
        </div>
      )}
    </div>
  );
}
