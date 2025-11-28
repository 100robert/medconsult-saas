// ============================================
// UTILIDADES PARA MANEJO DE JWT
// ============================================

import jwt, { SignOptions } from 'jsonwebtoken';
import { JWTPayload, RefreshTokenPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '30d';

/**
 * Generar Access Token (JWT)
 */
export function generateAccessToken(payload: JWTPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRATION as any,
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * Generar Refresh Token
 */
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = {
    expiresIn: JWT_REFRESH_EXPIRATION as any,
  };
  
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
}

/**
 * Verificar y decodificar Access Token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

/**
 * Verificar y decodificar Refresh Token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error) {
    throw new Error('Refresh token inválido o expirado');
  }
}

/**
 * Decodificar token sin verificar
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Calcular fecha de expiración del refresh token
 */
export function getRefreshTokenExpiration(): Date {
  const expirationString = JWT_REFRESH_EXPIRATION;
  const match = expirationString.match(/^(\d+)([dhms])$/);

  if (!match) {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  let milliseconds = 0;

  switch (unit) {
    case 'd':
      milliseconds = value * 24 * 60 * 60 * 1000;
      break;
    case 'h':
      milliseconds = value * 60 * 60 * 1000;
      break;
    case 'm':
      milliseconds = value * 60 * 1000;
      break;
    case 's':
      milliseconds = value * 1000;
      break;
  }

  return new Date(Date.now() + milliseconds);
}