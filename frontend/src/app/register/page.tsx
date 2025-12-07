'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Heart, 
  ArrowRight, 
  Shield, 
  CheckCircle2,
  Sparkles,
  Stethoscope,
  Clock,
  Award,
  Calendar,
  Users
} from 'lucide-react';
import { Button, Input, Alert } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';

const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  fechaNacimiento: z.string().optional(),
  genero: z.enum(['MASCULINO', 'FEMENINO', 'OTRO', 'PREFIERO_NO_DECIR']).optional(),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Debe contener al menos un carácter especial (!@#$%^&*()_+-=[]{}|;:,.<>?)'
    ),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Debes aceptar los términos y condiciones',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, acceptTerms, ...registerData } = data;
      await registerUser({
        email: registerData.email,
        password: registerData.password,
        nombre: registerData.nombre,
        apellido: registerData.apellido,
        fechaNacimiento: registerData.fechaNacimiento || undefined,
        genero: registerData.genero || undefined,
      });
      router.push('/dashboard');
    } catch (err) {
      // Error handled by store
    }
  };

  const benefits = [
    { icon: Stethoscope, text: 'Acceso a 500+ especialistas' },
    { icon: Shield, text: 'Datos 100% encriptados' },
    { icon: Clock, text: 'Atención 24/7 disponible' },
    { icon: Award, text: 'Médicos certificados' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Solid Teal Background */}
      <div className="absolute inset-0 bg-teal-600" />
      
      {/* Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Info */}
          <motion.div 
            className="hidden lg:block text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-3 mb-12"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/30 shadow-glow-green">
                <Heart className="w-7 h-7 text-white animate-heartbeat" />
              </div>
              <span className="text-2xl font-bold">MedConsult</span>
            </motion.div>

            {/* Tagline */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">100% Seguro y Confiable</span>
            </motion.div>

            <motion.h1 
              className="text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Únete a miles de
              <br />
              <span className="text-teal-100">
                pacientes felices
              </span>
            </motion.h1>

            <motion.p 
              className="text-xl text-white/80 mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Crea tu cuenta gratuita y comienza a cuidar tu salud con los mejores especialistas del país.
            </motion.p>

            {/* Benefits */}
            <motion.div 
              className="grid grid-cols-2 gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20"
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <benefit.icon className="w-5 h-5 text-teal-200" />
                  <span className="text-sm font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonial */}
            <motion.div 
              className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-white/90 italic mb-4">
                "Registrarme fue super fácil y en minutos ya tenía mi primera cita agendada. ¡Excelente servicio!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-lg">
                  MR
                </div>
                <div>
                  <div className="font-semibold">María Rodríguez</div>
                  <div className="text-sm text-white/60">Paciente desde 2024</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Register Form */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <div className="glass-card-light p-6 max-w-md mx-auto">
              {/* Mobile Logo */}
              <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">MedConsult</span>
              </Link>

              {/* Header */}
              <div className="mb-4">
                <motion.h2 
                  className="text-xl font-bold text-gray-900"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Crear tu cuenta 🎉
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-sm mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Regístrate como paciente para comenzar
                </motion.p>
              </div>

              {/* Error Alert */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                  >
                    <Alert variant="error" onClose={clearError} className="mb-3">
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Input
                      label="Nombre"
                      placeholder="Juan"
                      variant="glass-light"
                      leftIcon={<User className="w-5 h-5" />}
                      error={errors.nombre?.message}
                      {...register('nombre')}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Input
                      label="Apellido"
                      placeholder="Pérez"
                      variant="glass-light"
                      error={errors.apellido?.message}
                      {...register('apellido')}
                    />
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <Input
                    label="Email"
                    type="email"
                    placeholder="tu@email.com"
                    variant="glass-light"
                    leftIcon={<Mail className="w-5 h-5" />}
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </motion.div>

                {/* Fecha de Nacimiento y Género */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.57 }}
                  >
                    <Input
                      label="Fecha de nacimiento"
                      type="date"
                      variant="glass-light"
                      leftIcon={<Calendar className="w-5 h-5" />}
                      error={errors.fechaNacimiento?.message}
                      {...register('fechaNacimiento')}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.57 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Género
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        {...register('genero')}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Seleccionar</option>
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMENINO">Femenino</option>
                        <option value="OTRO">Otro</option>
                        <option value="PREFIERO_NO_DECIR">Prefiero no decir</option>
                      </select>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Input
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    variant="glass-light"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none hover:text-teal-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    error={errors.password?.message}
                    helperText="Mín. 8 caracteres, mayúscula, minúscula, número y carácter especial"
                    {...register('password')}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                >
                  <Input
                    label="Confirmar Contraseña"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    variant="glass-light"
                    leftIcon={<Lock className="w-5 h-5" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="focus:outline-none hover:text-teal-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    }
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword')}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-1"
                      {...register('acceptTerms')}
                    />
                    <span className="ml-3 text-sm text-gray-600">
                      Acepto los{' '}
                      <Link href="/terms" className="text-teal-600 hover:text-teal-700 font-semibold">
                        términos y condiciones
                      </Link>{' '}
                      y la{' '}
                      <Link href="/privacy" className="text-teal-600 hover:text-teal-700 font-semibold">
                        política de privacidad
                      </Link>
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="text-sm text-red-500 mt-1">{errors.acceptTerms.message}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 }}
                >
                  <Button
                    type="submit"
                    className="w-full !bg-teal-600 hover:!bg-teal-700"
                    size="lg"
                    isLoading={isLoading}
                    rightIcon={!isLoading && <ArrowRight className="w-5 h-5" />}
                  >
                    Crear Cuenta
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <motion.div 
                className="relative my-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 rounded-full">O regístrate con</span>
                </div>
              </motion.div>

              {/* Social Registration */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95 }}
              >
                <motion.button 
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/80 border-2 border-gray-100 rounded-2xl hover:bg-white hover:border-gray-200 hover:shadow-lg transition-all font-medium text-gray-700"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Registrarse con Google
                </motion.button>
              </motion.div>

              {/* Login link */}
              <motion.p 
                className="mt-4 text-center text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href="/login"
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Inicia sesión
                </Link>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
