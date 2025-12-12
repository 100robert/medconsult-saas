'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  User,
  Calendar,
  FileText,
  Phone,
  Mail,
  ChevronRight,
  Activity,
  Clock,
  MoreVertical
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMiPerfilMedico, getMisPacientes, type Paciente } from '@/lib/medico';

export default function PatientsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.rol !== 'MEDICO') {
      router.push('/dashboard');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Obtener ID del médico
      const perfil = await getMiPerfilMedico();
      if (!perfil) {
        console.error('No se pudo obtener el perfil del médico');
        return;
      }

      // 2. Obtener pacientes
      const data = await getMisPacientes(perfil.id);
      setPatients(data);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const searchLower = searchTerm.toLowerCase();
    const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase();
    return searchTerm === '' ||
      nombreCompleto.includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower);
  });

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
          <h1 className="text-2xl font-bold text-gray-900">Mis Pacientes</h1>
          <p className="text-gray-500 mt-1">{patients.length} pacientes en total</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar paciente por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {patient.nombre[0]}{patient.apellido[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{patient.nombre} {patient.apellido}</h3>
                  {patient.fechaNacimiento && (
                    <p className="text-sm text-gray-500">{calculateAge(patient.fechaNacimiento)} años</p>
                  )}
                </div>
              </div>
              <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{patient.email}</span>
              </div>
              {patient.telefono && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{patient.telefono}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">{patient.totalConsultas}</p>
                  <p className="text-xs text-gray-500">Consultas</p>
                </div>
                {patient.ultimaConsulta && (
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(patient.ultimaConsulta).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-xs text-gray-500">Última</p>
                  </div>
                )}
              </div>
              <Link
                href={`/dashboard/patients/${patient.id}`}
                className="flex items-center gap-1 text-teal-600 text-sm font-medium hover:text-teal-700"
              >
                Ver historial
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {patient.proximaCita && (
              <div className="mt-3 p-2 bg-teal-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-teal-700">
                  <Clock className="w-4 h-4" />
                  <span>Próxima cita: {new Date(patient.proximaCita).toLocaleDateString('es-ES')}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <User className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No se encontraron pacientes</p>
        </div>
      )}
    </div>
  );
}
