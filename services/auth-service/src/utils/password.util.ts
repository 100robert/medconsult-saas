// ============================================
// UTILIDADES PARA MANEJO DE CONTRASEÑAS
// ============================================

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/**
 * Hashear una contraseña usando bcrypt
 * @param password - Contraseña en texto plano
 * @returns Contraseña hasheada
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Comparar una contraseña con su hash
 * @param password - Contraseña en texto plano
 * @param hashedPassword - Contraseña hasheada
 * @returns true si coinciden, false si no
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Validar fortaleza de contraseña
 * Requisitos:
 * - Mínimo 8 caracteres
 * - Al menos una mayúscula
 * - Al menos una minúscula
 * - Al menos un número
 * - Al menos un carácter especial
 * @param password - Contraseña a validar
 * @returns true si es válida, false si no
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra mayúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La contraseña debe contener al menos una letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('La contraseña debe contener al menos un número');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('La contraseña debe contener al menos un carácter especial');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generar un token aleatorio seguro
 * @param length - Longitud del token
 * @returns Token aleatorio
 */
export function generateRandomToken(length: number = 32): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return token;
}