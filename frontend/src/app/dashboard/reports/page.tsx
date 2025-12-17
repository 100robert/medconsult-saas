'use client';

import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Download,
  Calendar,
  Users,
  Stethoscope,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { getReportsData, type ReportData } from '@/lib/admin';

export default function ReportsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [reportData, setReportData] = useState<ReportData>({
    ingresos: { actual: 0, anterior: 0, variacion: 0 },
    citas: { total: 0, completadas: 0, canceladas: 0 },
    usuarios: { nuevos: 0, activos: 0, medicos: 0 },
    especialidades: [],
    graphData: []
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
      const data = await getReportsData(period as 'week' | 'month' | 'quarter' | 'year');
      setReportData(data);
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
        {/* INGRESOS */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-green-100 rounded-xl">
              <span className="flex items-center justify-center w-5 h-5 text-green-600 font-bold text-base">
                S/
              </span>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${reportData.ingresos.variacion >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {reportData.ingresos.variacion >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(reportData.ingresos.variacion)}%
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">S/ {reportData.ingresos.actual.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Ingresos totales</p>
          <p className="text-xs text-gray-400 mt-2">vs S/ {reportData.ingresos.anterior.toLocaleString()} periodo anterior</p>
        </div>

        {/* CITAS */}
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

        {/* USUARIOS */}
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

        {/* MÉDICOS */}
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
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingresos por Período</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportData.graphData}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `S/${value}`}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#0d9488"
                  fillOpacity={1}
                  fill="url(#colorIngresos)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Appointments Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas por Día</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.graphData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                  dataKey="citas"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
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
              {reportData.especialidades.length > 0 ? (
                reportData.especialidades.map((esp, index) => {
                  const totalIngresos = reportData.especialidades.reduce((acc, e) => acc + e.ingresos, 0);
                  const percentage = totalIngresos > 0 ? Math.round((esp.ingresos / totalIngresos) * 100) : 0;
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
                      <td className="px-6 py-4 text-gray-700">S/ {esp.ingresos.toLocaleString()}</td>
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
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay datos disponibles para el periodo seleccionado
                  </td>
                </tr>
              )}
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
