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
  Info
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

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
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

const horasDisponibles = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return [`${hour}:00`, `${hour}:30`];
}).flat();

export default function SchedulePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [schedule, setSchedule] = useState<WeekSchedule>({
    lunes: { activo: true, slots: [{ inicio: '09:00', fin: '13:00' }, { inicio: '15:00', fin: '19:00' }] },
    martes: { activo: true, slots: [{ inicio: '09:00', fin: '13:00' }, { inicio: '15:00', fin: '19:00' }] },
    miercoles: { activo: true, slots: [{ inicio: '09:00', fin: '13:00' }, { inicio: '15:00', fin: '19:00' }] },
    jueves: { activo: true, slots: [{ inicio: '09:00', fin: '13:00' }, { inicio: '15:00', fin: '19:00' }] },
    viernes: { activo: true, slots: [{ inicio: '09:00', fin: '13:00' }] },
    sabado: { activo: false, slots: [] },
    domingo: { activo: false, slots: [] },
  });
  const [duracionCita, setDuracionCita] = useState(30);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.rol !== 'MEDICO') {
      router.push('/dashboard');
      return;
    }
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
    setLoading(true);
    try {
      // Aquí iría la llamada al API para guardar
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

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
          disabled={loading}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
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

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm text-blue-800">
            Los pacientes podrán agendar citas dentro de los horarios que configures aquí.
            Los cambios se aplicarán a partir de mañana.
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
        </div>
        
        <div className="divide-y divide-gray-100">
          {diasSemana.map(({ key, label }) => (
            <div key={key} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Day toggle */}
                <div className="flex items-center gap-3 sm:w-40">
                  <button
                    onClick={() => toggleDay(key)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      schedule[key].activo ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <span 
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        schedule[key].activo ? 'left-7' : 'left-1'
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
