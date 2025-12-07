'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Scale, Thermometer, Save, Loader2, Activity, Info } from 'lucide-react';
import { crearMetrica, CreateMetricaSaludDTO } from '@/lib/health-metrics';
import { GlassCard } from '@/components/ui';

interface HealthMetricsFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function HealthMetricsForm({ onClose, onSuccess }: HealthMetricsFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMetricaSaludDTO>({
    peso: undefined,
    altura: undefined,
    temperatura: undefined,
    saturacionOxigeno: undefined,
    notas: '',
  });

  const handleChange = (field: keyof CreateMetricaSaludDTO, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Limpiar datos: eliminar campos undefined, null o vacíos
      const cleanedData: CreateMetricaSaludDTO = {};

      if (formData.peso !== undefined && formData.peso !== null) {
        cleanedData.peso = Number(formData.peso);
      }
      if (formData.altura !== undefined && formData.altura !== null) {
        cleanedData.altura = Number(formData.altura);
      }
      if (formData.temperatura !== undefined && formData.temperatura !== null) {
        cleanedData.temperatura = Number(formData.temperatura);
      }
      if (formData.saturacionOxigeno !== undefined && formData.saturacionOxigeno !== null) {
        cleanedData.saturacionOxigeno = Number(formData.saturacionOxigeno);
      }
      if (formData.notas && formData.notas.trim() !== '') {
        cleanedData.notas = formData.notas.trim();
      }

      // Validar que al menos un campo esté lleno
      if (Object.keys(cleanedData).length === 0) {
        setError('Por favor, ingresa al menos una métrica');
        setLoading(false);
        return;
      }

      console.log('Enviando datos:', cleanedData);
      const resultado = await crearMetrica(cleanedData);
      console.log('✅ Métrica guardada exitosamente:', resultado);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error al guardar métricas:', err);
      console.error('Tipo de error:', typeof err);
      console.error('Error completo:', JSON.stringify(err, null, 2));
      console.error('Error keys:', Object.keys(err || {}));

      let errorMessage = 'Error al guardar las métricas. Por favor, intenta de nuevo.';

      // Intentar extraer el mensaje de error de diferentes formas
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.response?.data) {
        errorMessage = typeof err.response.data === 'string'
          ? err.response.data
          : JSON.stringify(err.response.data);
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.toString) {
        errorMessage = err.toString();
      }

      console.error('Mensaje de error final:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard variant="light" size="lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Registrar Métricas de Salud</h2>
              <p className="text-sm text-gray-500 mt-1">
                Ingresa tus datos básicos. El ritmo cardíaco, presión arterial y glucosa se calcularán automáticamente.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Info sobre cálculos automáticos */}
          <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-teal-800">
                <p className="font-medium mb-1">Cálculos automáticos:</p>
                <ul className="list-disc list-inside space-y-1 text-teal-700">
                  <li>Ritmo cardíaco: Se calcula basado en tu edad y datos anteriores</li>
                  <li>Presión arterial: Se estima según tu perfil y valores normales</li>
                  <li>Glucosa: Se calcula considerando tu IMC y edad</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Peso */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-5 h-5 text-emerald-500" />
                  <label className="text-sm font-medium text-gray-700">Peso</label>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={formData.peso || ''}
                  onChange={(e) => handleChange('peso', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="kg"
                  className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Altura */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-5 h-5 text-emerald-500" />
                  <label className="text-sm font-medium text-gray-700">Altura</label>
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={formData.altura || ''}
                  onChange={(e) => handleChange('altura', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="metros"
                  className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Temperatura */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-5 h-5 text-amber-500" />
                  <label className="text-sm font-medium text-gray-700">Temperatura Corporal</label>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={formData.temperatura || ''}
                  onChange={(e) => handleChange('temperatura', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="°C (ej: 36.5)"
                  className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">Normal: 36.1°C - 37.2°C</p>
              </div>

              {/* Saturación de Oxígeno */}
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <label className="text-sm font-medium text-gray-700">Saturación de Oxígeno</label>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={formData.saturacionOxigeno || ''}
                  onChange={(e) => handleChange('saturacionOxigeno', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="% (ej: 98)"
                  className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">Normal: 95% - 100%</p>
              </div>
            </div>

            {/* Notas */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Notas (opcional)</label>
              <textarea
                value={formData.notas || ''}
                onChange={(e) => handleChange('notas', e.target.value)}
                placeholder="Agrega cualquier observación adicional..."
                rows={3}
                className="w-full px-3 py-2 bg-white/80 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/50">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white/60 hover:bg-white/80 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Guardar Métricas
                  </>
                )}
              </button>
            </div>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}

