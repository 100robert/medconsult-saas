'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  DollarSign,
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
  TrendingUp
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface Payment {
  id: string;
  paciente: {
    nombre: string;
    apellido: string;
    email: string;
  };
  medico: {
    nombre: string;
    apellido: string;
  };
  monto: number;
  estado: 'COMPLETADO' | 'PENDIENTE' | 'FALLIDO' | 'REEMBOLSADO';
  metodoPago: string;
  fecha: string;
  concepto: string;
}

export default function PaymentsAdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [stats, setStats] = useState({
    totalIngresos: 45680,
    pagosCompletados: 298,
    pagosPendientes: 12,
    reembolsos: 5
  });

  useEffect(() => {
    if (user?.rol !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchPayments();
  }, [user, router]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockPayments: Payment[] = [
        {
          id: 'PAY-001',
          paciente: { nombre: 'María', apellido: 'González', email: 'maria@email.com' },
          medico: { nombre: 'Dr. Carlos', apellido: 'Méndez' },
          monto: 150,
          estado: 'COMPLETADO',
          metodoPago: 'Tarjeta de Crédito',
          fecha: '2025-12-04',
          concepto: 'Consulta de Cardiología'
        },
        {
          id: 'PAY-002',
          paciente: { nombre: 'Juan', apellido: 'Pérez', email: 'juan@email.com' },
          medico: { nombre: 'Dra. María', apellido: 'García' },
          monto: 100,
          estado: 'COMPLETADO',
          metodoPago: 'Mercado Pago',
          fecha: '2025-12-04',
          concepto: 'Consulta General'
        },
        {
          id: 'PAY-003',
          paciente: { nombre: 'Ana', apellido: 'Rodríguez', email: 'ana@email.com' },
          medico: { nombre: 'Dr. Roberto', apellido: 'López' },
          monto: 200,
          estado: 'PENDIENTE',
          metodoPago: 'Transferencia',
          fecha: '2025-12-03',
          concepto: 'Consulta de Dermatología'
        },
        {
          id: 'PAY-004',
          paciente: { nombre: 'Carlos', apellido: 'López', email: 'carlos@email.com' },
          medico: { nombre: 'Dr. Carlos', apellido: 'Méndez' },
          monto: 150,
          estado: 'FALLIDO',
          metodoPago: 'Tarjeta de Débito',
          fecha: '2025-12-02',
          concepto: 'Consulta de Cardiología'
        },
        {
          id: 'PAY-005',
          paciente: { nombre: 'Laura', apellido: 'Fernández', email: 'laura@email.com' },
          medico: { nombre: 'Dra. María', apellido: 'García' },
          monto: 100,
          estado: 'REEMBOLSADO',
          metodoPago: 'Tarjeta de Crédito',
          fecha: '2025-12-01',
          concepto: 'Consulta General - Cancelada'
        },
      ];
      
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoading(false);
    }
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
    const matchesSearch = searchTerm === '' ||
      p.paciente.nombre.toLowerCase().includes(searchLower) ||
      p.paciente.apellido.toLowerCase().includes(searchLower) ||
      p.id.toLowerCase().includes(searchLower);
    
    const matchesStatus = filterStatus === 'all' || p.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Pagos</h1>
          <p className="text-gray-500 mt-1">Administra todos los pagos de la plataforma</p>
        </div>
        <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-green-100 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">${stats.totalIngresos.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Ingresos totales</p>
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
              <p className="text-sm text-gray-500">Completados</p>
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por paciente o ID..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paciente</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPayments.map((payment) => {
                const statusConfig = getStatusConfig(payment.estado);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm text-gray-900">{payment.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.paciente.nombre} {payment.paciente.apellido}</p>
                        <p className="text-sm text-gray-500">{payment.paciente.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-gray-700">{payment.medico.nombre} {payment.medico.apellido}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{payment.concepto}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-gray-900">${payment.monto}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(payment.fecha).toLocaleDateString('es-ES')}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </div>
    </div>
  );
}
