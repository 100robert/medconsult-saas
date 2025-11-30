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
import { RolUsuario } from '../generated/prisma/enums';

// ============================================
// VALIDADOR: REGISTRO DE USUARIO
// ============================================
// ¿Por qué validar el registro?
// - Evitar emails inválidos (formato incorrecto)
// - Asegurar contraseñas fuertes (seguridad)
// - Verificar que todos los campos requeridos estén presentes
// - Prevenir inyección de datos maliciosos
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

  rol: z.enum([RolUsuario.PACIENTE, RolUsuario.MEDICO, RolUsuario.ADMIN], {
    message: 'Rol inválido. Debe ser: PACIENTE, MEDICO o ADMIN',
  }),
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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;