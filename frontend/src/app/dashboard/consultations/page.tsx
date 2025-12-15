'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Search, Calendar, Clock, ChevronRight,
  Loader2, User, FileText, Pill, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui';
import { getMisPacientes, getMisConsultas, type PacienteAtendido, type Consulta } from '@/lib/consultations';
import { useAuthStore } from '@/store/authStore';

export default function ConsultationsPage() {
  const { user } = useAuthStore();
  const [pacientes, setPacientes] = useState<PacienteAtendido[]>([]);
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const isMedico = user?.rol === 'MEDICO';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        if (isMedico && user?.medicoId) {
          // Para médicos: obtener lista de pacientes atendidos
          const data = await getMisPacientes(user.medicoId);
          setPacientes(data);
        } else {
          // Para pacientes: mostrar sus consultas
          const data = await getMisConsultas();
          setConsultas(data);
        }
      } catch (err: any) {
        console.error('Error al cargar datos:', err);
        setError(err.response?.data?.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, isMedico]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const calcularEdad = (fechaNacimiento?: string) => {
    if (!fechaNacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  // Filtrar pacientes por búsqueda
  const pacientesFiltrados = pacientes.filter((paciente) => {
    const nombreCompleto = `${paciente.nombre} ${paciente.apellido}`.toLowerCase();
    return nombreCompleto.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // VISTA PARA MÉDICOS: Lista de pacientes atendidos
  // ============================================
  if (isMedico) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Historial de Atenciones</h1>
            <p className="text-gray-600 mt-1">
              Consulta el historial clínico de tus pacientes
            </p>
          </div>
          <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-lg">
            <Users className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-teal-700">{pacientes.length}</span>
            <span className="text-teal-600">pacientes atendidos</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Pacientes List */}
        {pacientesFiltrados.length > 0 ? (
          <div className="space-y-3">
            {pacientesFiltrados.map((paciente) => {
              const edad = calcularEdad(paciente.fechaNacimiento);

              return (
                <div
                  key={paciente.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-teal-200 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {paciente.nombre.charAt(0)}{paciente.apellido.charAt(0)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {paciente.nombre} {paciente.apellido}
                          </h3>
                          {edad && (
                            <span className="text-sm text-gray-500">
                              {edad} años
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {paciente.totalConsultas} {paciente.totalConsultas === 1 ? 'consulta' : 'consultas'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Última: {formatDate(paciente.ultimaConsulta)}
                          </span>
                        </div>

                        {paciente.proximaCita && (
                          <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Próxima cita: {formatDate(paciente.proximaCita)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link href={`/dashboard/patients/${paciente.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                        className="group-hover:bg-teal-50 group-hover:border-teal-300 group-hover:text-teal-700"
                      >
                        Ver Historial
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : searchTerm ? (
          /* No results for search */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No se encontraron pacientes</h3>
            <p className="text-gray-500 mt-1">
              No hay pacientes que coincidan con "{searchTerm}"
            </p>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Sin pacientes atendidos</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              Cuando atiendas tus primeras consultas, tus pacientes aparecerán aquí.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // VISTA PARA PACIENTES: Lista de sus consultas
  // ============================================
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Historial Médico</h1>
          <p className="text-gray-600 mt-1">
            Revisa el historial de tus consultas médicas
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {consultas.length > 0 ? (
        <div className="space-y-4">
          {consultas.map((consulta) => (
            <div
              key={consulta.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-teal-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      Dr. {consulta.cita.medico.usuario.nombre} {consulta.cita.medico.usuario.apellido}
                    </h3>
                    <p className="text-sm text-teal-600 font-medium">
                      {consulta.cita.medico.especialidad?.nombre || 'Medicina General'}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(consulta.fechaInicio)}
                      </span>
                    </div>

                    {consulta.diagnostico && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700">Diagnóstico:</p>
                        <p className="text-sm text-gray-600">{consulta.diagnostico}</p>
                      </div>
                    )}

                    {consulta.recetas && consulta.recetas.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
                        <Pill className="w-4 h-4" />
                        <span>{consulta.recetas.length} receta(s)</span>
                      </div>
                    )}
                  </div>
                </div>

                <Link href={`/dashboard/consultations/${consulta.id}`}>
                  <Button variant="outline" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                    Ver Detalle
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Sin consultas</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Tu historial médico aparecerá aquí después de tus primeras consultas.
          </p>
          <Link href="/dashboard/appointments">
            <Button variant="primary" className="mt-6">
              Ver Mis Citas
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
