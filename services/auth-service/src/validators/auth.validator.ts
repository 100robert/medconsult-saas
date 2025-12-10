// ============================================
// VALIDADORES - AUTH SERVICE (usando Zod)
// ============================================
// ¿Por qué Zod?
// - Validación en tiempo de ejecución (runtime)
// - Inferencia automática de tipos TypeScript
// - Mensajes de error personalizables
// - Validaciones complejas fáciles de definir
// ============================================

import { z } from 'zod';
import { RolUsuario, Genero } from '@prisma/client';

// ============================================
// VALIDADOR: REGISTRO PÚBLICO DE USUARIO
// ============================================
// IMPORTANTE: El registro público SOLO permite crear PACIENTES
// Los MÉDICOS y ADMINS solo pueden ser creados por administradores
// después de pasar el proceso de verificación (entrevistas, CV, etc.)
// ============================================

export const registerSchema = z.object({
  correo: z
    .string({
      message: 'El correo es requerido',
    })
    .email('Formato de correo inválido')
    .toLowerCase() // Convertir a minúsculas automáticamente
    .trim(), // Eliminar espacios en blanco

  contrasena: z
    .string({
      message: 'La contraseña es requerida',
    })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Debe contener al menos un carácter especial'
    ),

  nombre: z
    .string({
      message: 'El nombre es requerido',
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
    .trim(),

  apellido: z
    .string({
      message: 'El apellido es requerido',
    })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras')
    .trim(),

  telefono: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido (usar formato internacional)')
    .optional()
    .or(z.literal('')), // Permitir string vacío como opcional

  fechaNacimiento: z
    .string()
    .refine((val) => {
      if (!val) return true; // Opcional
      const date = new Date(val);
      const now = new Date();
      const minDate = new Date('1900-01-01');
      return date <= now && date >= minDate;
    }, 'Fecha de nacimiento inválida')
    .optional()
    .or(z.literal('')),

  genero: z
    .enum([Genero.MASCULINO, Genero.FEMENINO, Genero.OTRO, Genero.PREFIERO_NO_DECIR])
    .optional(),

  // RESTRICCIÓN DE SEGURIDAD: El registro público solo permite PACIENTE
  // Si alguien intenta pasar MEDICO o ADMIN, será rechazado
  rol: z
    .enum([RolUsuario.PACIENTE, RolUsuario.MEDICO, RolUsuario.ADMIN])
    .optional()
    .default(RolUsuario.PACIENTE)
    .refine(
      (rol) => rol === RolUsuario.PACIENTE,
      {
        message: 'El registro público solo permite crear cuentas de paciente. Para cuentas de médico, contacte al administrador.',
      }
    ),
});

// ============================================
// VALIDADOR: LOGIN
// ============================================
// ¿Por qué validar el login?
// - Asegurar que se envíen credenciales
// - Formato correcto de email
// - Prevenir ataques de fuerza bruta con datos mal formados
// ============================================

export const loginSchema = z.object({
  correo: z
    .string({
      message: 'El correo es requerido',
    })
    .email('Formato de correo inválido')
    .toLowerCase()
    .trim(),

  contrasena: z
    .string({
      message: 'La contraseña es requerida',
    })
    .min(1, 'La contraseña no puede estar vacía'),
});

// ============================================
// VALIDADOR: REFRESH TOKEN
// ============================================
// ¿Por qué validar refresh tokens?
// - Asegurar que se envíe el token
// - Prevenir ataques con tokens vacíos o malformados
// ============================================

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({
      message: 'El refresh token es requerido',
    })
    .min(1, 'El refresh token no puede estar vacío'),
});

// ============================================
// VALIDADOR: RECUPERACIÓN DE CONTRASEÑA
// ============================================
// ¿Por qué validar?
// - Asegurar que el email sea válido antes de buscar en BD
// - Prevenir spam de emails a direcciones inválidas
// ============================================

export const forgotPasswordSchema = z.object({
  correo: z
    .string({
      message: 'El correo es requerido',
    })
    .email('Formato de correo inválido')
    .toLowerCase()
    .trim(),
});

// ============================================
// VALIDADOR: RESETEO DE CONTRASEÑA
// ============================================
// ¿Por qué validar?
// - Verificar token de recuperación
// - Asegurar que la nueva contraseña sea fuerte
// - Prevenir reseteos con contraseñas débiles
// ============================================

export const resetPasswordSchema = z.object({
  token: z
    .string({
      message: 'El token es requerido',
    })
    .min(1, 'El token no puede estar vacío'),

  nuevaContrasena: z
    .string({
      message: 'La nueva contraseña es requerida',
    })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Debe contener al menos un carácter especial'
    ),
});

// ============================================
// VALIDADOR: VERIFICACIÓN DE EMAIL
// ============================================
// ¿Por qué validar?
// - Asegurar que se envíe el token de verificación
// - Prevenir intentos de verificación sin token
// ============================================

export const verifyEmailSchema = z.object({
  token: z
    .string({
      message: 'El token es requerido',
    })
    .min(1, 'El token no puede estar vacío'),
});

// ============================================
// TIPOS INFERIDOS (TypeScript automático)
// ============================================
// Zod infiere automáticamente los tipos TypeScript
// Esto evita duplicar definiciones de tipos
// ============================================

// ============================================
// VALIDADOR: CREAR USUARIO POR ADMIN
// ============================================
// Este schema es para cuando un ADMIN crea usuarios
// (médicos, otros admins) después del proceso de verificación
// ============================================

export const adminCreateUserSchema = z.object({
  correo: z
    .string({
      message: 'El correo es requerido',
    })
    .email('Formato de correo inválido')
    .toLowerCase()
    .trim(),

  contrasena: z
    .string({
      message: 'La contraseña es requerida',
    })
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña es demasiado larga')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Debe contener al menos un carácter especial'
    ),

  nombre: z
    .string({
      message: 'El nombre es requerido',
    })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras')
    .trim(),

  apellido: z
    .string({
      message: 'El apellido es requerido',
    })
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido es demasiado largo')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El apellido solo puede contener letras')
    .trim(),

  telefono: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Formato de teléfono inválido (usar formato internacional)')
    .optional()
    .or(z.literal('')),

  // ADMIN puede crear cualquier tipo de usuario
  rol: z.enum([RolUsuario.PACIENTE, RolUsuario.MEDICO, RolUsuario.ADMIN], {
    message: 'Rol inválido. Debe ser: PACIENTE, MEDICO o ADMIN',
  }),

  // Opciones adicionales para admin
  correoVerificado: z.boolean().optional().default(true),
  activo: z.boolean().optional().default(true),

  // ============ CAMPOS ESPECÍFICOS PARA MÉDICO ============
  // Estos campos son REQUERIDOS cuando rol = MEDICO
  numeroLicencia: z
    .string()
    .min(3, 'El número de licencia debe tener al menos 3 caracteres')
    .max(50, 'El número de licencia es demasiado largo')
    .optional(),

  idEspecialidad: z
    .string()
    .uuid('ID de especialidad inválido')
    .optional(),

  precioPorConsulta: z
    .number()
    .min(0, 'El precio no puede ser negativo')
    .max(10000, 'El precio es demasiado alto')
    .optional(),

  moneda: z
    .string()
    .length(3, 'La moneda debe tener 3 caracteres (ej: PEN, USD)')
    .default('PEN')
    .optional(),

  duracionConsulta: z
    .number()
    .int('La duración debe ser un número entero')
    .min(15, 'La duración mínima es 15 minutos')
    .max(120, 'La duración máxima es 120 minutos')
    .default(30)
    .optional(),

  aniosExperiencia: z
    .number()
    .int('Los años de experiencia deben ser un número entero')
    .min(0, 'Los años de experiencia no pueden ser negativos')
    .max(70, 'Los años de experiencia son demasiados')
    .default(0)
    .optional(),

  biografia: z
    .string()
    .max(2000, 'La biografía es demasiado larga')
    .optional(),

  educacion: z
    .string()
    .max(1000, 'La educación es demasiado larga')
    .optional(),

  certificaciones: z
    .string()
    .max(1000, 'Las certificaciones son demasiado largas')
    .optional(),

  subespecialidades: z
    .string()
    .max(500, 'Las subespecialidades son demasiado largas')
    .optional(),

  idiomas: z
    .array(z.string())
    .default(['Español'])
    .optional(),
}).refine(
  (data) => {
    // Si el rol es MEDICO, los campos específicos de médico son obligatorios
    if (data.rol === 'MEDICO') {
      return data.numeroLicencia && data.idEspecialidad && data.precioPorConsulta !== undefined;
    }
    return true;
  },
  {
    message: 'Para crear un médico se requiere: número de licencia, especialidad y precio por consulta',
    path: ['rol'],
  }
);

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;