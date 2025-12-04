'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Calendar, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button, Input, Alert, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { updateProfile } from '@/lib/auth';

const profileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  telefono: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  genero: z.enum(['MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR', '']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      apellido: user?.apellido || '',
      telefono: user?.telefono || '',
      fechaNacimiento: user?.fechaNacimiento?.split('T')[0] || '',
      genero: (user?.genero as 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'PREFIERO_NO_DECIR' | '') || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await updateProfile({
        ...data,
        genero: data.genero || undefined,
      });
      setUser(updatedUser);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">Gestiona tu información personal</p>
      </div>

      {/* Avatar Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                {user?.imagenPerfil ? (
                  <img
                    src={user.imagenPerfil}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-blue-600" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.nombre} {user?.apellido}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                {user?.rol}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>
            Actualiza tu información de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert variant="success" onClose={() => setSuccess(false)} className="mb-4">
              Perfil actualizado correctamente
            </Alert>
          )}

          {error && (
            <Alert variant="error" onClose={() => setError(null)} className="mb-4">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                placeholder="Juan"
                leftIcon={<User className="w-5 h-5" />}
                error={errors.nombre?.message}
                {...register('nombre')}
              />

              <Input
                label="Apellido"
                placeholder="Pérez"
                error={errors.apellido?.message}
                {...register('apellido')}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={user?.email}
              disabled
              leftIcon={<Mail className="w-5 h-5" />}
              helperText="El email no puede ser modificado"
            />

            <Input
              label="Teléfono"
              type="tel"
              placeholder="+1 234 567 8900"
              leftIcon={<Phone className="w-5 h-5" />}
              error={errors.telefono?.message}
              {...register('telefono')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fecha de Nacimiento"
                type="date"
                leftIcon={<Calendar className="w-5 h-5" />}
                error={errors.fechaNacimiento?.message}
                {...register('fechaNacimiento')}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  {...register('genero')}
                >
                  <option value="">Seleccionar</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" isLoading={isLoading}>
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
