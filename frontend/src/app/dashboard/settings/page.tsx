'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Lock,
  User,
  Bell,
  Shield,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Save,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Alert, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { changePassword, updateProfile } from '@/lib/auth';
import { toast } from 'sonner';

// --- Esquemas de Validación ---

const profileSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  apellido: z.string().min(2, 'El apellido es obligatorio'),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// --- Componente Principal ---

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // --- Forms Hooks ---

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      telefono: user?.telefono || '',
      fechaNacimiento: user?.fechaNacimiento || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // --- Handlers ---

  const onUpdateProfile = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // Llamada al backend
      const updatedUser = await updateProfile(data);

      // Actualizar estado global
      setUser({ ...user!, ...updatedUser });

      toast.success('Perfil actualizado correctamente');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      toast.success('Contraseña actualizada correctamente');
      passwordForm.reset();
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Helpers ---

  const renderTabButton = (id: string, label: string, icon: any) => {
    const Icon = icon;
    const isActive = activeTab === id;

    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
            ? 'bg-teal-50 text-teal-700 shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
      >
        <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
        {label}
      </button>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-2">Administra tu cuenta y preferencias</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de Navegación */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {renderTabButton('profile', 'Mi Perfil', User)}
            {renderTabButton('security', 'Seguridad', Shield)}
            {renderTabButton('notifications', 'Notificaciones', Bell)}
            <div className="pt-4 mt-4 border-t border-gray-100">
              {renderTabButton('danger', 'Zona de Peligro', Trash2)}
            </div>
          </nav>
        </div>

        {/* Contenido Principal */}
        <div className="flex-1 space-y-6">

          {/* --- TAB: PERFIL --- */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tu información básica de identificación</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                  {/* Email (Read Only) */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-200 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Correo Electrónico</p>
                      <p className="text-gray-900 font-medium">{user?.email}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                      Verificado
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nombre"
                      placeholder="Tu nombre"
                      {...profileForm.register('nombre')}
                      error={profileForm.formState.errors.nombre?.message}
                    />
                    <Input
                      label="Apellido"
                      placeholder="Tu apellido"
                      {...profileForm.register('apellido')}
                      error={profileForm.formState.errors.apellido?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Teléfono"
                      placeholder="+51 999 999 999"
                      leftIcon={<Phone className="w-4 h-4" />}
                      {...profileForm.register('telefono')}
                      error={profileForm.formState.errors.telefono?.message}
                    />
                    <Input
                      label="Fecha de Nacimiento"
                      type="date"
                      {...profileForm.register('fechaNacimiento')}
                      error={profileForm.formState.errors.fechaNacimiento?.message}
                    />
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      Guardar Cambios
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* --- TAB: SEGURIDAD --- */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Contraseña y Seguridad</CardTitle>
                    <CardDescription>Gestiona el acceso seguro a tu cuenta</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6 max-w-lg">

                  <Input
                    label="Contraseña Actual"
                    type={showPasswords.current ? 'text' : 'password'}
                    placeholder="••••••••"
                    leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="focus:outline-none text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    error={passwordForm.formState.errors.currentPassword?.message}
                    {...passwordForm.register('currentPassword')}
                  />

                  <div className="space-y-4 pt-2">
                    <Input
                      label="Nueva Contraseña"
                      type={showPasswords.new ? 'text' : 'password'}
                      placeholder="••••••••"
                      leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="focus:outline-none text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                      error={passwordForm.formState.errors.newPassword?.message}
                      {...passwordForm.register('newPassword')}
                    />

                    <Input
                      label="Confirmar Nueva Contraseña"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      leftIcon={<Lock className="w-5 h-5 text-gray-400" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="focus:outline-none text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                      error={passwordForm.formState.errors.confirmPassword?.message}
                      {...passwordForm.register('confirmPassword')}
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
                    <p className="font-semibold mb-1">Requisitos de la contraseña:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Mínimo 8 caracteres</li>
                      <li>Al menos una letra mayúscula</li>
                      <li>Al menos una letra minúscula</li>
                      <li>Al menos un número</li>
                    </ul>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      variant="primary"
                    >
                      Actualizar Contraseña
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* --- TAB: NOTIFICACIONES --- */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Bell className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <CardTitle>Preferencias de Notificaciones</CardTitle>
                    <CardDescription>Elige cómo y cuándo quieres que te contactemos</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      title: 'Notificaciones por Correo',
                      description: 'Recibe resúmenes de tus citas y actualizaciones importantes a tu email.',
                      defaultChecked: true
                    },
                    {
                      title: 'Recordatorios de Citas',
                      description: 'Te avisaremos 1 hora antes de cada consulta médica.',
                      defaultChecked: true
                    },
                    {
                      title: 'Novedades y Promociones',
                      description: 'Entérate de nuevas funcionalidades y descuentos especiales.',
                      defaultChecked: false
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="pr-8">
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  ))}

                  <div className="flex justify-end pt-4">
                    <Button variant="secondary" onClick={() => toast.success('Preferencias guardadas')}>
                      Guardar Preferencias
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* --- TAB: DANGER ZONE --- */}
          {activeTab === 'danger' && (
            <Card className="border-red-100 overflow-hidden">
              <CardHeader className="bg-red-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-red-700">Zona de Peligro</CardTitle>
                    <CardDescription className="text-red-600/80">Acciones destructivas e irreversibles</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 border border-red-100 rounded-xl bg-red-50/30">
                  <div>
                    <h4 className="font-semibold text-gray-900">Eliminar cuenta permanentemente</h4>
                    <p className="text-sm text-gray-500 mt-1 max-w-md">
                      Al eliminar tu cuenta, todos tus datos, historial médico y configuraciones serán borrados de nuestros servidores y no podrán ser recuperados.
                    </p>
                  </div>
                  <Button variant="danger">
                    Eliminar Cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}
