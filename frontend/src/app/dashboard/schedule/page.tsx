'use client';

import { useState, useEffect } from 'react';
import {
  Clock,
  Plus,
  Trash2,
  Save,
  Calendar,
  Check,
  X,
  AlertCircle,
  Info,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { getMiPerfilMedico, getMiDisponibilidad, Disponibilidad } from '@/lib/medico';
import api from '@/lib/api';
import { toast } from 'sonner';

interface TimeSlot {
  inicio: string;
  fin: string;
}

interface DaySchedule {
  activo: boolean;
  slots: TimeSlot[];
}

interface WeekSchedule {
  [key: string]: DaySchedule;
}

const diasSemana = [
  { key: 'lunes', label: 'Lunes', backendKey: 'LUNES' },
  { key: 'martes', label: 'Martes', backendKey: 'MARTES' },
  { key: 'miercoles', label: 'Miércoles', backendKey: 'MIERCOLES' },
  { key: 'jueves', label: 'Jueves', backendKey: 'JUEVES' },
  { key: 'viernes', label: 'Viernes', backendKey: 'VIERNES' },
  { key: 'sabado', label: 'Sábado', backendKey: 'SABADO' },
  { key: 'domingo', label: 'Domingo', backendKey: 'DOMINGO' },
];

const horasDisponibles = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

// Crear schedule vacío por defecto
const emptySchedule: WeekSchedule = {
  lunes: { activo: false, slots: [] },
  martes: { activo: false, slots: [] },
  miercoles: { activo: false, slots: [] },
  jueves: { activo: false, slots: [] },
  viernes: { activo: false, slots: [] },
  sabado: { activo: false, slots: [] },
  domingo: { activo: false, slots: [] },
};

export default function SchedulePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [schedule, setSchedule] = useState<WeekSchedule>(emptySchedule);
  const [duracionCita, setDuracionCita] = useState(30);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [medicoId, setMedicoId] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos reales del backend
  useEffect(() => {
    if (user?.rol !== 'MEDICO') {
      router.push('/dashboard');
      return;
    }

    async function cargarDatos() {
      setLoadingData(true);
      setError(null);

      try {
        // 1. Obtener el perfil del médico para obtener su ID
        const perfil = await getMiPerfilMedico();
        if (!perfil) {
          setError('No se pudo cargar el perfil del médico');
          setLoadingData(false);
          return;
        }

        setMedicoId(perfil.id);
        setDuracionCita(perfil.duracionConsulta || 30);

        // 2. Obtener la disponibilidad actual
        const disponibilidades = await getMiDisponibilidad();

        console.log('📅 Disponibilidades cargadas:', disponibilidades);

        // 3. Convertir las disponibilidades del backend al formato del frontend
        const newSchedule: WeekSchedule = { ...emptySchedule };

        // Mapeo de backend key a frontend key
        const backendToFrontendDay: { [key: string]: string } = {
          'LUNES': 'lunes',
          'MARTES': 'martes',
          'MIERCOLES': 'miercoles',
          'JUEVES': 'jueves',
          'VIERNES': 'viernes',
          'SABADO': 'sabado',
          'DOMINGO': 'domingo',
        };

        // Inicializar todos los días como vacíos
        Object.keys(newSchedule).forEach(day => {
          newSchedule[day] = { activo: false, slots: [] };
        });

        // Procesar disponibilidades del backend
        disponibilidades.forEach((disp: any) => {
          // El backend puede enviar diaSemana como string o número
          let frontendDay: string;

          if (typeof disp.diaSemana === 'string') {
            frontendDay = backendToFrontendDay[disp.diaSemana] || disp.diaSemana.toLowerCase();
          } else {
            // Si es número (0-6), convertir
            const daysArray = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
            frontendDay = daysArray[disp.diaSemana] || 'lunes';
          }

          if (newSchedule[frontendDay] && disp.activo) {
            newSchedule[frontendDay].activo = true;
            newSchedule[frontendDay].slots.push({
              inicio: disp.horaInicio,
              fin: disp.horaFin
            });
          }
        });

        setSchedule(newSchedule);
        console.log('📅 Schedule convertido:', newSchedule);

      } catch (err: any) {
        console.error('Error cargando disponibilidad:', err);
        setError('Error al cargar la disponibilidad. Por favor, recarga la página.');
      } finally {
        setLoadingData(false);
      }
    }

    cargarDatos();
  }, [user, router]);

  const toggleDay = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        activo: !prev[day].activo,
        slots: prev[day].activo ? [] : [{ inicio: '09:00', fin: '17:00' }]
      }
    }));
  };

  const addSlot = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...prev[day].slots, { inicio: '09:00', fin: '17:00' }]
      }
    }));
  };

  const removeSlot = (day: string, index: number) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.filter((_, i) => i !== index)
      }
    }));
  };

  const updateSlot = (day: string, index: number, field: 'inicio' | 'fin', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day].slots.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const handleSave = async () => {
    if (!medicoId) {
      toast.error('No se encontró el ID del médico');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Convertir el schedule del frontend al formato del backend
      const disponibilidades: Array<{
        idMedico: string;
        diaSemana: string;
        horaInicio: string;
        horaFin: string;
        activo: boolean;
      }> = [];

      // Mapeo de frontend key a backend key
      const frontendToBackendDay: { [key: string]: string } = {
        'lunes': 'LUNES',
        'martes': 'MARTES',
        'miercoles': 'MIERCOLES',
        'jueves': 'JUEVES',
        'viernes': 'VIERNES',
        'sabado': 'SABADO',
        'domingo': 'DOMINGO',
      };

      // Procesar cada día
      Object.entries(schedule).forEach(([day, daySchedule]) => {
        if (daySchedule.activo && daySchedule.slots.length > 0) {
          daySchedule.slots.forEach(slot => {
            disponibilidades.push({
              idMedico: medicoId,
              diaSemana: frontendToBackendDay[day],
              horaInicio: slot.inicio,
              horaFin: slot.fin,
              activo: true
            });
          });
        }
      });

      console.log('📤 Enviando horarios al backend:', disponibilidades);

      // Enviar al backend usando el endpoint de múltiples disponibilidades
      const response = await api.post('/disponibilidades/multiples', {
        idMedico: medicoId,
        horarios: disponibilidades, // El backend espera 'horarios' no 'disponibilidades'
        reemplazarExistentes: true // Indica que debe reemplazar las disponibilidades existentes
      });

      console.log('✅ Respuesta del backend:', response.data);

      setSaved(true);
      toast.success('¡Horario guardado correctamente!');
      setTimeout(() => setSaved(false), 3000);

    } catch (err: any) {
      console.error('Error al guardar:', err);
      const errorMsg = err.response?.data?.message || 'Error al guardar el horario';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mi Horario</h1>
          <p className="text-gray-500 mt-1">Configura tu disponibilidad para recibir citas</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando...
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              ¡Guardado!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800">
            Los pacientes podrán agendar citas dentro de los horarios que configures aquí.
            <strong> Los cambios se guardan en tiempo real en el sistema.</strong>
          </p>
        </div>
      </div>

      {/* Duración de cita */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración General</h2>
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Duración de cada cita:</label>
          <select
            value={duracionCita}
            onChange={(e) => setDuracionCita(Number(e.target.value))}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={45}>45 minutos</option>
            <option value={60}>1 hora</option>
          </select>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Horario Semanal</h2>
          <p className="text-sm text-gray-500 mt-1">Activa los días que trabajas y configura los horarios disponibles</p>
        </div>

        <div className="divide-y divide-gray-100">
          {diasSemana.map(({ key, label }) => (
            <div key={key} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Day toggle */}
                <div className="flex items-center gap-3 sm:w-40">
                  <button
                    onClick={() => toggleDay(key)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${schedule[key].activo ? 'bg-teal-600' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${schedule[key].activo ? 'left-7' : 'left-1'
                        }`}
                    />
                  </button>
                  <span className={`font-medium ${schedule[key].activo ? 'text-gray-900' : 'text-gray-400'}`}>
                    {label}
                  </span>
                </div>

                {/* Time slots */}
                {schedule[key].activo ? (
                  <div className="flex-1 space-y-3">
                    {schedule[key].slots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2 flex-wrap">
                        <select
                          value={slot.inicio}
                          onChange={(e) => updateSlot(key, index, 'inicio', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          {horasDisponibles.map(hora => (
                            <option key={hora} value={hora}>{hora}</option>
                          ))}
                        </select>
                        <span className="text-gray-500">a</span>
                        <select
                          value={slot.fin}
                          onChange={(e) => updateSlot(key, index, 'fin', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        >
                          {horasDisponibles.map(hora => (
                            <option key={hora} value={hora}>{hora}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeSlot(key, index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addSlot(key)}
                      className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar bloque horario
                    </button>
                  </div>
                ) : (
                  <div className="flex-1">
                    <span className="text-sm text-gray-400 italic">No disponible</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa</h2>
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map(({ key, label }) => (
            <div key={key} className="text-center">
              <p className="text-xs font-medium text-gray-500 mb-2">{label.slice(0, 3)}</p>
              <div className={`h-24 rounded-lg ${schedule[key].activo ? 'bg-teal-50' : 'bg-gray-50'}`}>
                {schedule[key].activo && schedule[key].slots.map((slot, i) => (
                  <div key={i} className="text-xs text-teal-700 p-1">
                    {slot.inicio}-{slot.fin}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
