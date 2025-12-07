'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Stethoscope,
  User,
  Heart,
  Search,
  Sparkles,
  Check,
  Clock,
  AlertCircle,
  UserPlus,
  CalendarCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface Notification {
  id: string;
  type: 'cita' | 'pago' | 'sistema' | 'usuario';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: 'calendar' | 'credit' | 'alert' | 'user' | 'check';
}

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, fetchProfile, logout, isLoading } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      fetchProfile().then(() => {
        // Profile fetched
      }).catch(() => {
        router.push('/login');
      });
    }
  }, [isAuthenticated, fetchProfile, router]);

  // Cargar notificaciones según el rol
  useEffect(() => {
    if (user?.rol) {
      const mockNotifications: Notification[] = user.rol === 'ADMIN' ? [
        { id: '1', type: 'usuario', title: 'Nuevo usuario registrado', message: 'María García se ha registrado como paciente', time: 'Hace 5 min', read: false, icon: 'user' },
        { id: '2', type: 'pago', title: 'Pago recibido', message: 'Pago de S/. 150 confirmado - Consulta #1234', time: 'Hace 30 min', read: false, icon: 'credit' },
        { id: '3', type: 'sistema', title: 'Reporte generado', message: 'El reporte mensual está listo para descargar', time: 'Hace 1 hora', read: true, icon: 'check' },
        { id: '4', type: 'usuario', title: 'Nuevo médico', message: 'Dr. Roberto López se ha unido a la plataforma', time: 'Hace 2 horas', read: true, icon: 'user' },
      ] : user.rol === 'MEDICO' ? [
        { id: '1', type: 'cita', title: 'Nueva cita programada', message: 'Juan Pérez - Mañana 10:00 AM', time: 'Hace 10 min', read: false, icon: 'calendar' },
        { id: '2', type: 'cita', title: 'Cita confirmada', message: 'Ana Rodríguez confirmó su cita del viernes', time: 'Hace 1 hora', read: false, icon: 'check' },
        { id: '3', type: 'sistema', title: 'Recordatorio', message: 'Tienes 3 citas pendientes para hoy', time: 'Hace 2 horas', read: true, icon: 'alert' },
      ] : [
        { id: '1', type: 'cita', title: 'Cita confirmada', message: 'Tu cita con Dr. Carlos Méndez ha sido confirmada', time: 'Hace 15 min', read: false, icon: 'check' },
        { id: '2', type: 'sistema', title: 'Recordatorio de cita', message: 'Tienes una cita mañana a las 10:00 AM', time: 'Hace 3 horas', read: false, icon: 'calendar' },
        { id: '3', type: 'pago', title: 'Pago procesado', message: 'Tu pago de S/. 100 ha sido confirmado', time: 'Ayer', read: true, icon: 'credit' },
      ];
      setNotifications(mockNotifications);
    }
  }, [user?.rol]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (icon: string) => {
    switch (icon) {
      case 'calendar': return <Calendar className="w-4 h-4 text-teal-600" />;
      case 'credit': return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'user': return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'check': return <CalendarCheck className="w-4 h-4 text-green-600" />;
      default: return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  // Menú según el rol
  const getMenuItems = () => {
    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ];

    if (user?.rol === 'ADMIN') {
      return [
        { href: '/dashboard/admin', label: 'Panel Admin', icon: LayoutDashboard },
        { href: '/dashboard/users', label: 'Usuarios', icon: Users },
        { href: '/dashboard/doctors', label: 'Médicos', icon: Stethoscope },
        { href: '/dashboard/appointments', label: 'Todas las Citas', icon: Calendar },
        { href: '/dashboard/payments', label: 'Pagos', icon: CreditCard },
        { href: '/dashboard/reports', label: 'Reportes', icon: FileText },
        { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
      ];
    }

    if (user?.rol === 'MEDICO') {
      return [
        { href: '/dashboard/medico', label: 'Mi Panel', icon: LayoutDashboard },
        { href: '/dashboard/appointments', label: 'Mis Citas', icon: Calendar },
        { href: '/dashboard/patients', label: 'Mis Pacientes', icon: Users },
        { href: '/dashboard/consultations', label: 'Consultas', icon: FileText },
        { href: '/dashboard/schedule', label: 'Mi Horario', icon: Calendar },
        { href: '/dashboard/reviews', label: 'Reseñas', icon: FileText },
        { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
      ];
    }

    // PACIENTE
    return [
      ...baseItems,
      { href: '/dashboard/appointments', label: 'Mis Citas', icon: Calendar },
      { href: '/dashboard/doctors', label: 'Buscar Médicos', icon: Stethoscope },
      { href: '/dashboard/consultations', label: 'Mis Consultas', icon: FileText },
      { href: '/dashboard/payments', label: 'Mis Pagos', icon: CreditCard },
      { href: '/dashboard/settings', label: 'Configuración', icon: Settings },
    ];
  };

  const menuItems = getMenuItems();

  if (!isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-600 mb-4">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-teal-600 border-t-transparent mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-teal-600">
              MedConsult
            </span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4">
          <div className="bg-teal-50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.nombre?.[0]}{user?.apellido?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  {user?.rol === 'ADMIN' ? 'Administrador' : user?.rol === 'MEDICO' ? 'Médico' : 'Paciente'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 pb-4 space-y-1">
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Menú Principal
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-teal-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <Sparkles className="w-4 h-4 ml-auto" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Pro Card - Solo para PACIENTE */}
        {user?.rol === 'PACIENTE' && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-teal-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">MedConsult Pro</span>
              </div>
              <p className="text-sm text-teal-100 mb-3">
                Accede a todas las funciones premium
              </p>
              <Link
                href="/dashboard/subscription"
                onClick={() => setSidebarOpen(false)}
                className="block w-full text-center py-2 bg-white text-teal-600 rounded-lg font-medium text-sm hover:bg-teal-50 transition-colors"
              >
                Actualizar ahora
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              {/* Search Bar */}
              <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-80">
                <Search className="w-5 h-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-none outline-none text-sm text-gray-600 placeholder-gray-400 w-full"
                />
                <kbd className="hidden lg:inline-flex px-2 py-1 text-xs font-medium text-gray-400 bg-white rounded border border-gray-200">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-teal-600" />
                          <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">
                              {unreadCount} nuevas
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-teal-600 hover:text-teal-700 font-medium"
                          >
                            Marcar todas como leídas
                          </button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No tienes notificaciones</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => markAsRead(notification.id)}
                              className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-teal-50/50' : ''
                                }`}
                            >
                              <div className="flex gap-3">
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${notification.icon === 'calendar' ? 'bg-teal-100' :
                                    notification.icon === 'credit' ? 'bg-emerald-100' :
                                      notification.icon === 'alert' ? 'bg-amber-100' :
                                        notification.icon === 'user' ? 'bg-blue-100' :
                                          'bg-green-100'
                                  }`}>
                                  {getNotificationIcon(notification.icon)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm ${!notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                                      {notification.title}
                                    </p>
                                    {!notification.read && (
                                      <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-0.5 truncate">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center justify-center gap-1"
                        >
                          <Settings className="w-4 h-4" />
                          Configurar notificaciones
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white font-medium text-sm shadow-lg">
                    {user?.nombre?.[0]}{user?.apellido?.[0]}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.nombre}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.nombre} {user?.apellido}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3 text-gray-400" />
                          Mi Perfil
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3 text-gray-400" />
                          Configuración
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8 bg-gray-50 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
