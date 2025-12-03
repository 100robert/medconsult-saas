'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Star, Calendar, Clock, Video, MapPin, ChevronRight, Filter, Sparkles, Heart, Award, GraduationCap } from 'lucide-react';
import { Button, Input } from '@/components/ui';

interface Doctor {
  id: string;
  nombre: string;
  apellido: string;
  especialidad: string;
  calificacion: number;
  numReviews: number;
  precio: number;
  proximaDisponibilidad: string;
  avatar?: string;
  verificado: boolean;
  videoConsulta: boolean;
  experiencia: number;
}

// Mock doctors
const mockDoctors: Doctor[] = [
  {
    id: '1',
    nombre: 'Carlos',
    apellido: 'Mendoza',
    especialidad: 'Cardiología',
    calificacion: 4.9,
    numReviews: 124,
    precio: 50,
    proximaDisponibilidad: 'Hoy, 3:00 PM',
    verificado: true,
    videoConsulta: true,
    experiencia: 15,
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'García',
    especialidad: 'Dermatología',
    calificacion: 4.8,
    numReviews: 89,
    precio: 45,
    proximaDisponibilidad: 'Mañana, 10:00 AM',
    verificado: true,
    videoConsulta: true,
    experiencia: 12,
  },
  {
    id: '3',
    nombre: 'Pedro',
    apellido: 'Ramírez',
    especialidad: 'Medicina General',
    calificacion: 4.7,
    numReviews: 156,
    precio: 35,
    proximaDisponibilidad: 'Hoy, 5:00 PM',
    verificado: true,
    videoConsulta: false,
    experiencia: 8,
  },
  {
    id: '4',
    nombre: 'Ana',
    apellido: 'López',
    especialidad: 'Pediatría',
    calificacion: 4.9,
    numReviews: 203,
    precio: 40,
    proximaDisponibilidad: 'Mañana, 9:00 AM',
    verificado: true,
    videoConsulta: true,
    experiencia: 10,
  },
];

const especialidades = [
  'Todas',
  'Medicina General',
  'Cardiología',
  'Dermatología',
  'Pediatría',
  'Neurología',
  'Traumatología',
  'Ginecología',
  'Oftalmología',
];

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('Todas');

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.especialidad.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEspecialidad =
      selectedEspecialidad === 'Todas' || doctor.especialidad === selectedEspecialidad;

    return matchesSearch && matchesEspecialidad;
  });

  const getGradient = (index: number) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-amber-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            500+ especialistas
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Buscar Médicos</h1>
          <p className="text-gray-600 mt-1">
            Encuentra al especialista que necesitas y agenda tu cita
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-900 placeholder-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
            <select
              className="px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-700 font-medium cursor-pointer"
              value={selectedEspecialidad}
              onChange={(e) => setSelectedEspecialidad(e.target.value)}
            >
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>
                  {esp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Specialty Pills */}
        <div className="flex gap-2 flex-wrap mt-4">
          {especialidades.slice(0, 6).map((esp) => (
            <button
              key={esp}
              onClick={() => setSelectedEspecialidad(esp)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedEspecialidad === esp
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              {esp}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          <span className="font-semibold text-gray-900">{filteredDoctors.length}</span>{' '}
          {filteredDoctors.length === 1 ? 'médico encontrado' : 'médicos encontrados'}
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Ordenar por:</span>
          <select className="bg-transparent font-medium text-gray-700 cursor-pointer">
            <option>Relevancia</option>
            <option>Mejor calificados</option>
            <option>Precio: menor a mayor</option>
            <option>Disponibilidad</option>
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid gap-4">
        {filteredDoctors.map((doctor, index) => (
          <div 
            key={doctor.id} 
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-5">
                  {/* Avatar */}
                  <div className="relative">
                    <div className={`w-20 h-20 bg-gradient-to-br ${getGradient(index)} rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                      {doctor.nombre[0]}{doctor.apellido[0]}
                    </div>
                    {doctor.verificado && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                        <Award className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900">
                        Dr. {doctor.nombre} {doctor.apellido}
                      </h3>
                      {doctor.verificado && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                          Verificado
                        </span>
                      )}
                    </div>
                    <p className="text-blue-600 font-semibold mt-1">{doctor.especialidad}</p>
                    
                    {/* Badges */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">{doctor.calificacion}</span>
                        <span className="text-gray-500 text-sm">({doctor.numReviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <GraduationCap className="w-4 h-4" />
                        <span>{doctor.experiencia} años exp.</span>
                      </div>
                      {doctor.videoConsulta && (
                        <div className="flex items-center gap-1 bg-purple-50 text-purple-600 px-2 py-1 rounded-lg text-sm">
                          <Video className="w-4 h-4" />
                          <span className="font-medium">Video consulta</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Availability */}
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Próxima disponibilidad: <span className="font-medium text-emerald-600">{doctor.proximaDisponibilidad}</span></span>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex flex-col items-end gap-3 lg:min-w-[180px]">
                  <div className="text-right">
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ${doctor.precio}
                    </p>
                    <p className="text-sm text-gray-500">por consulta</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 border-2 border-gray-200 rounded-xl hover:border-red-200 hover:bg-red-50 transition-colors group">
                      <Heart className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                    <Link href={`/dashboard/appointments/new?doctorId=${doctor.id}`}>
                      <Button 
                        variant="gradient" 
                        className="shadow-lg shadow-blue-500/25"
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                      >
                        Agendar Cita
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hover accent */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDoctors.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-16 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No se encontraron médicos</h3>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Intenta con otros términos de búsqueda o cambia los filtros seleccionados
          </p>
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={() => {
              setSearchTerm('');
              setSelectedEspecialidad('Todas');
            }}
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
