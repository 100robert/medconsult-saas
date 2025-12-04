'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Users,
  Stethoscope,
  Activity,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function ReportsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [reportData, setReportData] = useState({
    ingresos: { actual: 45680, anterior: 38500, variacion: 18.6 },
    citas: { total: 342, completadas: 298, canceladas: 44 },
    usuarios: { nuevos: 89, activos: 1180, medicos: 45 },
    especialidades: [
      { nombre: 'Medicina General', citas: 120, ingresos: 12000 },
      { nombre: 'Cardiología', citas: 85, ingresos: 17000 },
      { nombre: 'Dermatología', citas: 65, ingresos: 9750 },
      { nombre: 'Pediatría', citas: 45, ingresos: 4500 },
      { nombre: 'Traumatología', citas: 27, ingresos: 5400 },
    ]
  });

  useEffect(() => {
    if (user?.rol !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchReportData();
  }, [user, router, period]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      // Los datos ya están en el estado inicial
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-500 mt-1">Análisis detallado del rendimiento de la plataforma</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
            <option value="quarter">Este trimestre</option>
            <option value="year">Este año</option>
          </select>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${reportData.ingresos.variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {reportData.ingresos.variacion >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(reportData.ingresos.variacion)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">${reportData.ingresos.actual.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Ingresos totales</p>
          <p className="text-xs text-gray-400 mt-2">vs ${reportData.ingresos.anterior.toLocaleString()} periodo anterior</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{reportData.citas.total}</p>
          <p className="text-sm text-gray-500 mt-1">Citas totales</p>
          <div className="flex gap-4 mt-2">
            <span className="text-xs text-green-600">{reportData.citas.completadas} completadas</span>
            <span className="text-xs text-red-600">{reportData.citas.canceladas} canceladas</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-violet-100 rounded-xl">
              <Users className="w-6 h-6 text-violet-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{reportData.usuarios.nuevos}</p>
          <p className="text-sm text-gray-500 mt-1">Nuevos usuarios</p>
          <p className="text-xs text-gray-400 mt-2">{reportData.usuarios.activos} usuarios activos</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-teal-100 rounded-xl">
              <Stethoscope className="w-6 h-6 text-teal-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{reportData.usuarios.medicos}</p>
          <p className="text-sm text-gray-500 mt-1">Médicos activos</p>
          <p className="text-xs text-gray-400 mt-2">En la plataforma</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Período</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Gráfico de ingresos</p>
              <p className="text-sm">Integrar con Recharts o Chart.js</p>
            </div>
          </div>
        </div>

        {/* Appointments Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas por Día</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Gráfico de citas</p>
              <p className="text-sm">Integrar con Recharts o Chart.js</p>
            </div>
          </div>
        </div>
      </div>

      {/* Especialidades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Rendimiento por Especialidad</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Especialidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Citas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ingresos</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% del Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reportData.especialidades.map((esp, index) => {
                const totalIngresos = reportData.especialidades.reduce((acc, e) => acc + e.ingresos, 0);
                const percentage = Math.round((esp.ingresos / totalIngresos) * 100);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                          <Stethoscope className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="font-medium text-gray-900">{esp.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{esp.citas}</td>
                    <td className="px-6 py-4 text-gray-700">${esp.ingresos.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[100px]">
                          <div 
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Exportar Reportes</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reporte de Ingresos (PDF)
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reporte de Citas (Excel)
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reporte de Usuarios (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
