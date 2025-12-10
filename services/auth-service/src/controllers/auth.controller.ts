// ============================================
// AUTH CONTROLLER - MANEJO DE PETICIONES HTTP
// ============================================
// El controller es el intermediario entre las rutas HTTP y el service.
//
// Responsabilidades:
// 1. Recibir peticiones HTTP (req, res)
// 2. Extraer datos (body, params, query)
// 3. Validar datos con Zod schemas
// 4. Llamar al servicio correspondiente
// 5. Retornar respuestas HTTP con códigos apropiados
// 6. Manejar errores y convertirlos en respuestas HTTP
//
// NO debe contener lógica de negocio (eso va en services)
// ============================================

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  adminCreateUserSchema,
} from '../validators/auth.validator';

// ============================================
// CLASE: AuthController
// ============================================
// Contiene métodos para manejar cada endpoint de autenticación
// Cada método es un "handler" de Express
// ============================================

export class AuthController {
  // ==========================================
  // ENDPOINT: POST /auth/register
  // ==========================================
  // ¿Qué hace?
  // 1. Valida los datos del body con Zod
  // 2. Llama al service para registrar usuario
  // 3. Retorna 201 (Created) con los datos del usuario y tokens
  //
  // Códigos de respuesta:
  // - 201: Usuario creado exitosamente
  // - 400: Datos de entrada inválidos
  // - 409: Email ya registrado
  // - 500: Error del servidor
  // ==========================================

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validar datos de entrada con Zod
      const validacion = registerSchema.safeParse(req.body);

      if (!validacion.success) {
        // Datos inválidos → retornar errores de validación
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: validacion.error.issues.map((err) => ({
            campo: err.path.join('.'),
            mensaje: err.message,
          })),
        });
        return;
      }

      // 2. Llamar al service para crear usuario
      const resultado = await authService.register(validacion.data);

      // 3. Retornar respuesta exitosa (201 Created)
      res.status(201).json(resultado);
    } catch (error) {
      // 4. Pasar errores al middleware de manejo de errores
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: POST /auth/login
  // ==========================================
  // ¿Qué hace?
  // 1. Valida email y contraseña
  // 2. Extrae IP y User-Agent para auditoría
  // 3. Llama al service para autenticar
  // 4. Retorna 200 con tokens
  //
  // Códigos de respuesta:
  // - 200: Login exitoso
  // - 400: Datos inválidos
  // - 401: Credenciales incorrectas
  // - 500: Error del servidor
  // ==========================================

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validar datos de entrada
      const validacion = loginSchema.safeParse(req.body);

      if (!validacion.success) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: validacion.error.issues.map((err) => ({
            campo: err.path.join('.'),
            mensaje: err.message,
          })),
        });
        return;
      }

      // 2. Extraer información del request para auditoría
      const ip = req.ip || req.socket.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      // 3. Llamar al service
      const resultado = await authService.login(
        validacion.data,
        ip,
        userAgent
      );

      // 4. Retornar respuesta exitosa
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: POST /auth/refresh-token
  // ==========================================
  // ¿Qué hace?
  // 1. Valida que se envíe el refresh token
  // 2. Llama al service para renovar el access token
  // 3. Retorna nuevo access token
  //
  // ¿Por qué es importante?
  // - Los access tokens expiran rápido (ej: 15min)
  // - El refresh token permite obtener uno nuevo sin re-login
  // - Mejora la UX (usuario no tiene que loguearse cada 15min)
  //
  // Códigos de respuesta:
  // - 200: Token renovado
  // - 400: Datos inválidos
  // - 401: Refresh token inválido/expirado
  // ==========================================

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validar datos
      const validacion = refreshTokenSchema.safeParse(req.body);

      if (!validacion.success) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: validacion.error.issues.map((err) => ({
            campo: err.path.join('.'),
            mensaje: err.message,
          })),
        });
        return;
      }

      // 2. Renovar token
      const resultado = await authService.refreshToken(validacion.data);

      // 3. Retornar nuevo access token
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: POST /auth/forgot-password
  // ==========================================
  // ¿Qué hace?
  // 1. Valida el email
  // 2. Genera token de recuperación
  // 3. (TODO) Envía email con link de reseteo
  // 4. Retorna mensaje genérico (seguridad)
  //
  // ¿Por qué mensaje genérico?
  // - No revelar si el email existe (prevenir enumeración)
  // - Siempre: "Si el email existe, recibirás instrucciones"
  //
  // Códigos de respuesta:
  // - 200: Siempre (aunque el email no exista)
  // - 400: Email inválido
  // ==========================================

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validar email
      const validacion = forgotPasswordSchema.safeParse(req.body);

      if (!validacion.success) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: validacion.error.issues.map((err) => ({
            campo: err.path.join('.'),
            mensaje: err.message,
          })),
        });
        return;
      }
      // 2. Procesar solicitud
      const resultado = await authService.forgotPassword(validacion.data);

      // 3. Siempre retornar 200 (seguridad)
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: POST /auth/reset-password
  // ==========================================
  // ¿Qué hace?
  // 1. Valida token y nueva contraseña
  // 2. Verifica que token no haya expirado
  // 3. Actualiza la contraseña
  // 4. Revoca todos los refresh tokens (seguridad)
  //
  // ¿Por qué revocar tokens?
  // - Si alguien robó tus tokens, al cambiar contraseña pierden acceso
  //
  // Códigos de respuesta:
  // - 200: Contraseña actualizada
  // - 400: Token inválido/expirado
  // ==========================================

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validar datos
      const validacion = resetPasswordSchema.safeParse(req.body);

      if (!validacion.success) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: validacion.error.issues.map((err) => ({
            campo: err.path.join('.'),
            mensaje: err.message,
          })),
        });
        return;
      }

      // 2. Resetear contraseña
      const resultado = await authService.resetPassword(validacion.data);

      // 3. Retornar confirmación
      res.status(200).json(resultado);
      return;
    } catch (error) {
      next(error);
      return;
    }
  }

  // ==========================================
  // ENDPOINT: POST /auth/verify-email
  // ==========================================
  // ¿Qué hace?
  // 1. Valida el token de verificación
  // 2. Marca el email como verificado
  // 3. Permite al usuario acceder a funciones completas
  //
  // ¿Por qué verificar emails?
  // - Asegurar que el usuario tiene acceso al email
  // - Prevenir cuentas falsas
  // - Cumplir regulaciones (GDPR, HIPAA)
  //
  // Códigos de respuesta:
  // - 200: Email verificado
  // - 400: Token inválido
  // ==========================================

  async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validar token (puede venir en body o query)
      const token = req.body.token || req.query.token;

      const validacion = verifyEmailSchema.safeParse({ token });

      if (!validacion.success) {
        res.status(400).json({
          success: false,
          message: 'Token de verificación inválido',
          errors: validacion.error.issues.map((err) => ({
            campo: err.path.join('.'),
            mensaje: err.message,
          })),
        });
        return;
      }

      // 2. Verificar email
      const resultado = await authService.verifyEmail(validacion.data);

      // 3. Retornar confirmación
      res.status(200).json(resultado);
      return;
    } catch (error) {
      next(error);
      return;
    }
  }

  // ==========================================
  // ENDPOINT: POST /auth/logout
  // ==========================================
  // ¿Qué hace?
  // 1. Recibe el refresh token
  // 2. Lo marca como revocado en BD
  // 3. El cliente debe eliminar los tokens del storage
  //
  // ¿Por qué revocar el token?
  // - Invalidar la sesión en el servidor
  // - Prevenir uso del token después del logout
  //
  // Códigos de respuesta:
  // - 200: Logout exitoso
  // ==========================================

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token es requerido',
        });
        return;
      }

      // Revocar el refresh token
      await authService.logout(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logout exitoso',
      });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }

  // ==========================================
  // ENDPOINT: POST /auth/admin/create-user
  // ==========================================
  // ¿Qué hace?
  // 1. Verifica que el solicitante sea ADMIN
  // 2. Valida los datos del nuevo usuario
  // 3. Crea el usuario (médico, admin, etc.)
  //
  // IMPORTANTE: Este endpoint permite crear MÉDICOS y ADMINS
  // Solo puede ser usado por administradores después del proceso
  // de verificación (entrevistas, CV, certificados, etc.)
  // ==========================================

  async adminCreateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // 1. Validar datos de entrada
      const validacion = adminCreateUserSchema.safeParse(req.body);

      if (!validacion.success) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: validacion.error.issues.map((err) => ({
            campo: err.path.join('.'),
            mensaje: err.message,
          })),
        });
        return;
      }

      // 2. Llamar al service para crear usuario (sin generar tokens de login)
      const resultado = await authService.adminCreateUser(validacion.data);

      // 3. Retornar respuesta exitosa
      res.status(201).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: GET /auth/me
  // ==========================================
  // ¿Qué hace?
  // 1. Obtiene el usuario autenticado desde el token
  // 2. Retorna los datos del perfil
  // ==========================================

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // El middleware de auth ya validó el token y agregó user al request
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const resultado = await authService.getProfile(userId);
      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: PUT /auth/profile
  // ==========================================
  // ¿Qué hace?
  // 1. Obtiene el usuario autenticado desde el token
  // 2. Actualiza los datos del perfil
  // ==========================================

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const { nombre, apellido, telefono, fechaNacimiento, genero, imagenPerfil } = req.body;

      const resultado = await authService.updateProfile(userId, {
        nombre,
        apellido,
        telefono,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        genero,
        imagenPerfil,
      });

      res.status(200).json(resultado);
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: GET /auth/admin/users
  // ==========================================
  // Lista todos los usuarios (solo admin)
  // ==========================================

  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rol, activo, page = '1', limit = '50' } = req.query;

      const resultado = await authService.getAllUsers({
        rol: rol as string | undefined,
        activo: activo === 'true' ? true : activo === 'false' ? false : undefined,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });

      res.status(200).json({
        success: true,
        ...resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: PATCH /auth/admin/users/:id/status
  // ==========================================
  // Activar/desactivar un usuario (solo admin)
  // ==========================================

  async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { activo } = req.body;

      if (typeof activo !== 'boolean') {
        res.status(400).json({
          success: false,
          message: 'El campo activo debe ser un booleano',
        });
        return;
      }

      const resultado = await authService.updateUserStatus(id, activo);

      res.status(200).json({
        success: true,
        message: activo ? 'Usuario activado' : 'Usuario desactivado',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: GET /auth/admin/stats
  // ==========================================
  // Obtener estadísticas del sistema (solo admin)
  // ==========================================

  async getAdminStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await authService.getAdminStats();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: PATCH /auth/admin/users/:id
  // ==========================================
  // Actualizar datos de un usuario (solo admin)
  // ==========================================

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { nombre, apellido, correo, telefono, rol, activo, correoVerificado } = req.body;

      // Validaciones básicas
      const updateData: any = {};
      
      if (nombre !== undefined) {
        if (typeof nombre !== 'string' || nombre.trim().length < 2) {
          res.status(400).json({
            success: false,
            message: 'El nombre debe tener al menos 2 caracteres',
            errors: [{ campo: 'nombre', mensaje: 'El nombre debe tener al menos 2 caracteres' }]
          });
          return;
        }
        updateData.nombre = nombre.trim();
      }

      if (apellido !== undefined) {
        if (typeof apellido !== 'string' || apellido.trim().length < 2) {
          res.status(400).json({
            success: false,
            message: 'El apellido debe tener al menos 2 caracteres',
            errors: [{ campo: 'apellido', mensaje: 'El apellido debe tener al menos 2 caracteres' }]
          });
          return;
        }
        updateData.apellido = apellido.trim();
      }

      if (correo !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(correo)) {
          res.status(400).json({
            success: false,
            message: 'Formato de correo inválido',
            errors: [{ campo: 'correo', mensaje: 'Formato de correo inválido' }]
          });
          return;
        }
        updateData.correo = correo.toLowerCase().trim();
      }

      if (telefono !== undefined) {
        updateData.telefono = telefono || null;
      }

      if (rol !== undefined) {
        if (!['ADMIN', 'MEDICO', 'PACIENTE'].includes(rol)) {
          res.status(400).json({
            success: false,
            message: 'Rol inválido',
            errors: [{ campo: 'rol', mensaje: 'Rol debe ser ADMIN, MEDICO o PACIENTE' }]
          });
          return;
        }
        updateData.rol = rol;
      }

      if (activo !== undefined) {
        updateData.activo = Boolean(activo);
      }

      if (correoVerificado !== undefined) {
        updateData.correoVerificado = Boolean(correoVerificado);
      }

      const resultado = await authService.updateUser(id, updateData);

      res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  // ==========================================
  // ENDPOINT: DELETE /auth/admin/users/:id
  // ==========================================
  // Eliminar un usuario (solo admin)
  // ==========================================

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const adminId = (req as any).user?.userId;

      // No permitir auto-eliminación
      if (id === adminId) {
        res.status(400).json({
          success: false,
          message: 'No puedes eliminar tu propia cuenta',
        });
        return;
      }

      await authService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

// ==========================================
// EXPORTAR INSTANCIA ÚNICA
// ==========================================
// Creamos una única instancia del controller
// que será usada en las rutas
// ==========================================

export const authController = new AuthController();