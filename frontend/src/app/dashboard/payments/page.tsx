'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  TrendingUp,
  AlertCircle,
  Percent,
  Wallet
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { getMisPagos, getMisGanancias, type Payment, type GananciasMedico } from '@/lib/payments';

export default function PaymentsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estado para ganancias del médico
  const [ganancias, setGanancias] = useState<GananciasMedico | null>(null);

  const [stats, setStats] = useState({
    totalIngresos: 0,
    pagosCompletados: 0,
    pagosPendientes: 0,
    reembolsos: 0
  });

  useEffect(() => {
    if (user) {
      fetchPayments();
    }
  }, [user]);

  const fetchPayments = async () => {
    if (!user) return;

    try {
      setLoading(true);

      let data: Payment[] = [];

      if (user.rol === 'ADMIN') {
        // Simular datos para Admin ya que no tenemos endpoint de "listar todo" aún
        data = [
          {
            id: 'PAY-001',
            idPaciente: 'p1', idMedico: 'm1',
            paciente: { nombre: 'María', apellido: 'González', email: 'maria@email.com' },
            medico: { nombre: 'Dr. Carlos', apellido: 'Méndez' },
            monto: 150,
            estado: 'COMPLETADO',
            metodoPago: 'Tarjeta de Crédito',
            fecha: '2025-12-04',
            concepto: 'Consulta de Cardiología',
            creadoEn: '', actualizadoEn: ''
          },
          {
            id: 'PAY-002',
            idPaciente: 'p2', idMedico: 'm2',
            paciente: { nombre: 'Juan', apellido: 'Pérez', email: 'juan@email.com' },
            medico: { nombre: 'Dra. María', apellido: 'García' },
            monto: 100,
            estado: 'COMPLETADO',
            metodoPago: 'Mercado Pago',
            fecha: '2025-12-04',
            concepto: 'Consulta General',
            creadoEn: '', actualizadoEn: ''
          },
        ];
      } else {
        // Cargar datos reales de la API
        data = await getMisPagos(user);

        // Si es médico, también cargar el desglose de ganancias
        if (user.rol === 'MEDICO') {
          const gananciasMedico = await getMisGanancias();
          setGanancias(gananciasMedico);
        }
      }

      setPayments(data);

      // Calcular estadísticas
      setStats({
        totalIngresos: data.reduce((acc, curr) => curr.estado === 'COMPLETADO' ? acc + Number(curr.monto) : acc, 0),
        pagosCompletados: data.filter(p => p.estado === 'COMPLETADO').length,
        pagosPendientes: data.filter(p => p.estado === 'PENDIENTE').length,
        reembolsos: data.filter(p => p.estado === 'REEMBOLSADO').length,
      });

    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Generar CSV
    const headers = ['ID', 'Paciente', 'Médico', 'Concepto', 'Monto', 'Estado', 'Fecha'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(p => [
        p.id,
        `"${p.paciente?.nombre || ''} ${p.paciente?.apellido || ''}"`,
        `"${p.medico?.nombre || ''} ${p.medico?.apellido || ''}"`,
        `"${p.concepto}"`,
        p.monto,
        p.estado,
        new Date(p.fecha).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `pagos_medconsult_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleViewDetail = (payment: Payment) => {
    alert(`Detalle del Pago\n\nID: ${payment.id}\nConcepto: ${payment.concepto}\nMonto: S/. ${payment.monto}\nEstado: ${payment.estado}\nFecha: ${new Date(payment.fecha).toLocaleString()}`);
  };

  const getStatusConfig = (estado: string) => {
    const config = {
      COMPLETADO: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, label: 'Completado' },
      PENDIENTE: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock, label: 'Pendiente' },
      FALLIDO: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, label: 'Fallido' },
      REEMBOLSADO: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Banknote, label: 'Reembolsado' },
    };
    return config[estado as keyof typeof config] || config.PENDIENTE;
  };

  const filteredPayments = payments.filter(p => {
    const searchLower = searchTerm.toLowerCase();

    const pacienteNombre = p.paciente?.nombre || '';
    const pacienteApellido = p.paciente?.apellido || '';
    const medicoNombre = p.medico?.nombre || '';
    const medicoApellido = p.medico?.apellido || '';

    const matchesSearch = searchTerm === '' ||
      pacienteNombre.toLowerCase().includes(searchLower) ||
      pacienteApellido.toLowerCase().includes(searchLower) ||
      medicoNombre.toLowerCase().includes(searchLower) ||
      medicoApellido.toLowerCase().includes(searchLower) ||
      p.id.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus === 'all' || p.estado === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Títulos según rol
  const getPageTitle = () => {
    switch (user?.rol) {
      case 'ADMIN': return 'Gestión de Pagos';
      case 'MEDICO': return 'Mis Ingresos';
      case 'PACIENTE': return 'Mis Pagos';
      default: return 'Pagos';
    }
  };

  const getPageSubtitle = () => {
    switch (user?.rol) {
      case 'ADMIN': return 'Administra todos los pagos de la plataforma';
      case 'MEDICO': return 'Consulta el historial de tus ingresos y pagos pendientes';
      case 'PACIENTE': return 'Historial de pagos de tus consultas médicas';
      default: return 'Detalle de pagos';
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
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-500 mt-1">{getPageSubtitle()}</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exportar Historial
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <span className="flex items-center justify-center w-5 h-5 text-green-600 font-bold text-base">
                S/
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">S/. {stats.totalIngresos.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Total {user?.rol === 'PACIENTE' ? 'Pagado' : 'Ingresos'}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.pagosCompletados}</p>
              <p className="text-sm text-gray-500">Pagos Exitosos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.pagosPendientes}</p>
              <p className="text-sm text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Banknote className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{stats.reembolsos}</p>
              <p className="text-sm text-gray-500">Reembolsos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de Ganancias - Solo para Médicos */}
      {user?.rol === 'MEDICO' && ganancias && (
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-6 h-6" />
            <h2 className="text-xl font-bold">Desglose de Ganancias</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Ingresos Brutos */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-white/80 text-sm mb-1">Ingresos Brutos</p>
              <p className="text-2xl font-bold">S/. {ganancias.ingresosBrutos.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1">Total cobrado a pacientes</p>
            </div>

            {/* Comisión Plataforma */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Percent className="w-4 h-4 text-amber-300" />
                <p className="text-white/80 text-sm">Comisión Plataforma</p>
              </div>
              <p className="text-2xl font-bold text-amber-300">- S/. {ganancias.comisionRetenida.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1">{ganancias.porcentajeComision}% del total</p>
            </div>

            {/* Ingresos Netos */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <p className="text-white/80 text-sm mb-1">Ingresos Netos</p>
              <p className="text-3xl font-bold text-emerald-200">S/. {ganancias.ingresosNetos.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1">Lo que recibes</p>
            </div>

            {/* Consultas Realizadas */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-white/80 text-sm mb-1">Consultas Realizadas</p>
              <p className="text-2xl font-bold">{ganancias.cantidadConsultas}</p>
              <p className="text-xs text-white/60 mt-1">
                Pendientes: {ganancias.pendientes.cantidad} (S/. {ganancias.pendientes.monto.toLocaleString()})
              </p>
            </div>
          </div>

          <p className="text-xs text-white/60 mt-4 text-center">
            💡 MedConsult retiene un {ganancias.porcentajeComision}% de comisión por cada consulta completada
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            <option value="COMPLETADO">Completados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="FALLIDO">Fallidos</option>
            <option value="REEMBOLSADO">Reembolsados</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pago</th>
                {user?.rol !== 'MEDICO' && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                )}
                {user?.rol !== 'PACIENTE' && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Método</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((payment) => {
                  const statusConfig = getStatusConfig(payment.estado);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="font-mono text-sm text-gray-900" title={payment.id}>
                          #{payment.id.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      {user?.rol !== 'MEDICO' && (
                        <td className="px-4 py-4">
                          <span className="text-gray-900 font-medium">{payment.medico?.nombre} {payment.medico?.apellido}</span>
                        </td>
                      )}
                      {user?.rol !== 'PACIENTE' && (
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{payment.paciente?.nombre} {payment.paciente?.apellido}</p>
                            <p className="text-xs text-gray-500">{payment.paciente?.email}</p>
                          </div>
                        </td>
                      )}

                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">{payment.concepto}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-gray-900">S/. {payment.monto}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          {payment.metodoPago}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(payment.fecha).toLocaleDateString('es-ES')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleViewDetail(payment)}
                          className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No se encontraron pagos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredPayments.length)} de {filteredPayments.length} pagos
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
