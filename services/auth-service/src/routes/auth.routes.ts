// ============================================
// AUTH ROUTES - DEFINICIÓN DE ENDPOINTS
// ============================================
// Este archivo define todos los endpoints relacionados con autenticación.
//
// Estructura de una ruta:
// router.METHOD('/path', middleware1, middleware2, controller.method)
//
// Orden de ejecución:
// 1. Middleware de rate limiting (prevenir spam)
// 2. Middleware de validación (opcional, ya lo hacemos en controller)
// 3. Controller (lógica HTTP)
// 4. Service (lógica de negocio)
//
// ¿Por qué usar Router de Express?
// - Modularidad: Cada módulo tiene sus propias rutas
// - Prefijos automáticos: /auth/register, /auth/login, etc.
// - Fácil agregar middlewares a grupos de rutas
// ============================================

import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

// Crear instancia del router
const router = Router();

// ============================================
// RUTAS PÚBLICAS (No requieren autenticación)
// ============================================
// Estas rutas están disponibles para cualquier usuario,
// incluso si no está logueado.
// ============================================

/**
 * @route   POST /auth/register
 * @desc    Registrar nuevo usuario (paciente o médico)
 * @access  Public
 * @body    { correo, contrasena, nombre, apellido, telefono?, rol }
 * @returns { success, message, data: { usuario, accessToken, refreshToken } }
 * 
 * Ejemplo de uso desde el cliente:
 * ```
 * fetch('http://localhost:3001/auth/register', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     correo: 'juan@example.com',
 *     contrasena: 'MiPass123!',
 *     nombre: 'Juan',
 *     apellido: 'Pérez',
 *     rol: 'PACIENTE'
 *   })
 * })
 * ```
 */
router.post('/register', authController.register.bind(authController));

/**
 * @route   POST /auth/login
 * @desc    Iniciar sesión
 * @access  Public
 * @body    { correo, contrasena }
 * @returns { success, message, data: { usuario, accessToken, refreshToken } }
 * 
 * ¿Por qué usar .bind()?
 * - Asegura que 'this' dentro del método apunte correctamente a authController
 * - Sin .bind(), 'this' sería undefined en algunos contextos
 * 
 * Ejemplo:
 * ```
 * fetch('http://localhost:3001/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     correo: 'juan@example.com',
 *     contrasena: 'MiPass123!'
 *   })
 * })
 * ```
 */
router.post('/login', authController.login.bind(authController));

/**
 * @route   POST /auth/refresh-token
 * @desc    Renovar access token usando refresh token
 * @access  Public (pero requiere refresh token válido)
 * @body    { refreshToken }
 * @returns { success, message, data: { usuario, accessToken, refreshToken } }
 * 
 * ¿Cuándo usar este endpoint?
 * - Cuando el access token expira (ej: cada 15 minutos)
 * - El frontend detecta error 401 y llama a este endpoint
 * - Obtiene nuevo access token sin que el usuario tenga que re-loguearse
 * 
 * Flujo típico:
 * 1. Access token expira
 * 2. API retorna 401
 * 3. Frontend llama /refresh-token con el refresh token guardado
 * 4. Obtiene nuevo access token
 * 5. Reintenta la petición original
 */
router.post(
  '/refresh-token',
  authController.refreshToken.bind(authController)
);

/**
 * @route   POST /auth/forgot-password
 * @desc    Solicitar reseteo de contraseña
 * @access  Public
 * @body    { correo }
 * @returns { success, message }
 * 
 * ¿Qué sucede internamente?
 * 1. Se genera un token único de recuperación
 * 2. Se guarda en BD con expiración de 1 hora
 * 3. Se envía email con link: 
 *    https://tuapp.com/reset-password?token=abc123xyz
 * 4. Usuario hace clic y es redirigido al formulario
 * 5. Envía nueva contraseña con el token
 * 
 * Nota: Siempre retorna mensaje genérico (seguridad)
 */
router.post(
  '/forgot-password',
  authController.forgotPassword.bind(authController)
);

/**
 * @route   POST /auth/reset-password
 * @desc    Establecer nueva contraseña
 * @access  Public (pero requiere token válido)
 * @body    { token, nuevaContrasena }
 * @returns { success, message }
 * 
 * Importante:
 * - El token solo es válido por 1 hora
 * - Después de usarlo, se elimina (un solo uso)
 * - Todos los refresh tokens se revocan (seguridad)
 * - El usuario debe volver a hacer login
 */
router.post(
  '/reset-password',
  authController.resetPassword.bind(authController)
);

/**
 * @route   POST /auth/verify-email
 * @desc    Verificar email del usuario
 * @access  Public (pero requiere token válido)
 * @body    { token }
 * @query   ?token=abc123 (alternativa al body)
 * @returns { success, message }
 * 
 * ¿Por qué verificar emails?
 * - Asegurar que el usuario tiene acceso al correo
 * - Prevenir cuentas falsas o spam
 * - Cumplir regulaciones (GDPR, HIPAA)
 * - Algunas funciones pueden requerir email verificado
 * 
 * El token se envía por email al registrarse:
 * https://tuapp.com/verify-email?token=abc123xyz
 */
router.post(
  '/verify-email',
  authController.verifyEmail.bind(authController)
);

// También permitir verificación por GET (para links de email)
router.get(
  '/verify-email',
  authController.verifyEmail.bind(authController)
);

/**
 * @route   POST /auth/logout
 * @desc    Cerrar sesión (revocar refresh token)
 * @access  Public (pero se espera que el usuario esté logueado)
 * @body    { refreshToken }
 * @returns { success, message }
 * 
 * ¿Qué hace el logout?
 * 1. Revoca el refresh token en BD
 * 2. El cliente debe:
 *    - Eliminar accessToken del memoria/localStorage
 *    - Eliminar refreshToken del localStorage
 *    - Redirigir al login
 * 
 * Nota: El access token sigue siendo válido hasta que expire
 * (no hay forma de invalidarlo sin una blacklist)
 */
router.post('/logout', authController.logout.bind(authController));

// ============================================
// RUTAS PROTEGIDAS (Requieren autenticación)
// ============================================
// Estas rutas requieren que el usuario esté logueado
// y tenga el rol adecuado.
// ============================================

import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

/**
 * @route   POST /auth/admin/create-user
 * @desc    Crear usuario (médico/admin) - SOLO ADMINISTRADORES
 * @access  Private (requiere rol ADMIN)
 * @body    { correo, contrasena, nombre, apellido, telefono?, rol, correoVerificado?, activo? }
 * @returns { success, message, data: { usuario } }
 * 
 * ¿Cuándo usar este endpoint?
 * - Después de que un médico pase el proceso de verificación
 *   (entrevistas, revisión de CV, certificados, etc.)
 * - Para crear nuevos administradores
 * 
 * IMPORTANTE:
 * - Los pacientes se registran públicamente en /auth/register
 * - Los médicos/admins SOLO se crean por este endpoint
 * - Esto asegura que solo personal verificado acceda como médico
 */
router.post(
  '/admin/create-user',
  authMiddleware,
  requireRole(['ADMIN']),
  authController.adminCreateUser.bind(authController)
);

/**
 * @route   GET /auth/me
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 * @returns { success, data: { usuario } }
 */
router.get(
  '/me',
  authMiddleware,
  authController.getProfile.bind(authController)
);

/**
 * @route   GET /auth/profile
 * @desc    Obtener perfil del usuario autenticado (alias de /me)
 * @access  Private
 * @returns { success, data: { usuario } }
 */
router.get(
  '/profile',
  authMiddleware,
  authController.getProfile.bind(authController)
);

/**
 * @route   PUT /auth/profile
 * @desc    Actualizar perfil del usuario autenticado
 * @access  Private
 * @body    { nombre?, apellido?, telefono?, fechaNacimiento?, genero?, imagenPerfil? }
 * @returns { success, data: { usuario } }
 */
router.put(
  '/profile',
  authMiddleware,
  authController.updateProfile.bind(authController)
);

/**
 * @route   GET /auth/admin/users
 * @desc    Listar todos los usuarios (solo admin)
 * @access  Private (ADMIN)
 * @query   { rol?, activo?, page?, limit? }
 * @returns { success, usuarios, total, page, totalPages }
 */
router.get(
  '/admin/users',
  authMiddleware,
  requireRole(['ADMIN']),
  authController.getAllUsers.bind(authController)
);

/**
 * @route   PATCH /auth/admin/users/:id/status
 * @desc    Activar/desactivar un usuario (solo admin)
 * @access  Private (ADMIN)
 * @body    { activo: boolean }
 * @returns { success, message, data }
 */
router.patch(
  '/admin/users/:id/status',
  authMiddleware,
  requireRole(['ADMIN']),
  authController.updateUserStatus.bind(authController)
);

/**
 * @route   GET /auth/admin/stats
 * @desc    Obtener estadísticas del sistema (solo admin)
 * @access  Private (ADMIN)
 * @returns { success, data: { totalUsuarios, totalMedicos, ... } }
 */
router.get(
  '/admin/stats',
  authMiddleware,
  requireRole(['ADMIN']),
  authController.getAdminStats.bind(authController)
);

// ============================================
// EXPORTAR ROUTER
// ============================================
export default router;