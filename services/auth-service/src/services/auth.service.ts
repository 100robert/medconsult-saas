// ============================================
// AUTH SERVICE - LÓGICA DE NEGOCIO
// ============================================
// Este servicio contiene TODA la lógica de autenticación:
// - Registro de usuarios
// - Login
// - Refresh tokens
// - Recuperación de contraseña
// - Verificación de email
// 
// ¿Por qué separarlo?
// - Reutilizable desde diferentes controllers
// - Fácil de testear (sin depender de HTTP)
// - Mantiene los controllers limpios
// ============================================

import { prisma } from '../config/database';
import {
  hashPassword,
  comparePassword,
  generateRandomToken,
} from '../utils/password.util';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiration,
} from '../utils/jwt.util';
import {
  RegisterDTO,
  LoginDTO,
  RefreshTokenDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  VerifyEmailDTO,
  AuthResponse,
  MessageResponse,
  UserData,
  ConflictError,
  AuthenticationError,
  NotFoundError,
  ValidationError,
} from '../types';

// ============================================
// CLASE: AuthService
// ============================================
// Patrón: Service Layer
// Contiene métodos para cada operación de autenticación
// ============================================

export class AuthService {
  // ==========================================
  // MÉTODO: REGISTRO DE USUARIO
  // ==========================================
  // ¿Qué hace?
  // 1. Verifica que el email no exista
  // 2. Hashea la contraseña (bcrypt)
  // 3. Crea el usuario en la BD
  // 4. Genera token de verificación
  // 5. Genera JWT tokens
  // 6. (Opcional) Envía email de verificación
  // ==========================================

  async register(data: RegisterDTO): Promise<AuthResponse> {
    // 1. Verificar si el email ya está registrado
    const existeUsuario = await prisma.usuario.findUnique({
      where: { correo: data.correo },
    });

    if (existeUsuario) {
      throw new ConflictError('El correo ya está registrado');
    }

    // 2. Hashear contraseña (bcrypt con 12 rondas)
    const hashContrasena = await hashPassword(data.contrasena);

    // 3. Generar token de verificación de email
    const tokenVerificacion = generateRandomToken(32);

    // 4. Crear usuario en la base de datos
    const usuario = await prisma.usuario.create({
      data: {
        correo: data.correo,
        hashContrasena,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        rol: data.rol,
        tokenVerificacion,
        correoVerificado: false, // Requiere verificación
        activo: true,
      },
    });

    // 5. Generar tokens JWT
    const accessToken = generateAccessToken({
      userId: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    const refreshToken = generateRefreshToken({
      userId: usuario.id,
      tokenId: generateRandomToken(16),
    });

    // 6. Guardar refresh token en BD
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        idUsuario: usuario.id,
        expiraEn: getRefreshTokenExpiration(),
        esRevocado: false,
      },
    });

    // 7. TODO: Enviar email de verificación
    // await this.sendVerificationEmail(usuario.correo, tokenVerificacion);

    // 8. Preparar respuesta (sin exponer datos sensibles)
    const userData: UserData = {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      correoVerificado: usuario.correoVerificado,
      activo: usuario.activo,
      imagenPerfil: usuario.imagenPerfil,
      telefono: usuario.telefono,
    };

    return {
      success: true,
      message: 'Usuario registrado exitosamente. Por favor verifica tu email.',
      data: {
        usuario: userData,
        accessToken,
        refreshToken,
      },
    };
  }

  // ==========================================
  // MÉTODO: LOGIN
  // ==========================================
  // ¿Qué hace?
  // 1. Busca el usuario por email
  // 2. Verifica que esté activo
  // 3. Compara contraseña (bcrypt)
  // 4. Registra el intento (éxito o fallo)
  // 5. Genera nuevos JWT tokens
  // 6. Actualiza último acceso
  // ==========================================

  async login(
    data: LoginDTO,
    ip?: string,
    userAgent?: string
  ): Promise<AuthResponse> {
    // 1. Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { correo: data.correo },
    });

    // 2. Si no existe o contraseña incorrecta
    if (!usuario) {
      // Registrar intento fallido
      await this.registrarIntentoLogin(
        data.correo,
        null,
        false,
        'Usuario no encontrado',
        ip,
        userAgent
      );
      throw new AuthenticationError('Credenciales inválidas');
    }

    // 3. Verificar que el usuario esté activo
    if (!usuario.activo) {
      await this.registrarIntentoLogin(
        data.correo,
        usuario.id,
        false,
        'Cuenta inactiva',
        ip,
        userAgent
      );
      throw new AuthenticationError('Cuenta inactiva. Contacta a soporte.');
    }

    // 4. Comparar contraseña
    const contrasenaValida = await comparePassword(
      data.contrasena,
      usuario.hashContrasena
    );

    if (!contrasenaValida) {
      await this.registrarIntentoLogin(
        data.correo,
        usuario.id,
        false,
        'Contraseña incorrecta',
        ip,
        userAgent
      );
      throw new AuthenticationError('Credenciales inválidas');
    }

    // 5. Login exitoso - Generar tokens
    const accessToken = generateAccessToken({
      userId: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    const tokenId = generateRandomToken(16);
    const refreshToken = generateRefreshToken({
      userId: usuario.id,
      tokenId,
    });

    // 6. Guardar refresh token
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        idUsuario: usuario.id,
        expiraEn: getRefreshTokenExpiration(),
        esRevocado: false,
        direccionIP: ip,
        agenteUsuario: userAgent,
      },
    });

    // 7. Actualizar último acceso
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() },
    });

    // 8. Registrar intento exitoso
    await this.registrarIntentoLogin(
      data.correo,
      usuario.id,
      true,
      'Login exitoso',
      ip,
      userAgent
    );

    // 9. Preparar respuesta
    const userData: UserData = {
      id: usuario.id,
      correo: usuario.correo,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      rol: usuario.rol,
      correoVerificado: usuario.correoVerificado,
      activo: usuario.activo,
      imagenPerfil: usuario.imagenPerfil,
      telefono: usuario.telefono,
    };

    return {
      success: true,
      message: 'Login exitoso',
      data: {
        usuario: userData,
        accessToken,
        refreshToken,
      },
    };
  }

  // ==========================================
  // MÉTODO: REFRESH TOKEN
  // ==========================================
  // ¿Qué hace?
  // 1. Verifica que el refresh token sea válido
  // 2. Busca el token en BD
  // 3. Verifica que no esté revocado
  // 4. Genera nuevo access token
  // 5. (Opcional) Rota el refresh token
  // ==========================================

  async refreshToken(data: RefreshTokenDTO): Promise<AuthResponse> {
    // 1. Verificar y decodificar el refresh token
    let payload;
    try {
      payload = verifyRefreshToken(data.refreshToken);
    } catch (error) {
      throw new AuthenticationError('Refresh token inválido o expirado');
    }

    // 2. Buscar el token en la base de datos
    const tokenDB = await prisma.refreshToken.findUnique({
      where: { token: data.refreshToken },
      include: { usuario: true },
    });

    if (!tokenDB) {
      throw new AuthenticationError('Refresh token no encontrado');
    }

    // 3. Verificar que no esté revocado
    if (tokenDB.esRevocado) {
      throw new AuthenticationError('Refresh token revocado');
    }

    // 4. Verificar que no haya expirado
    if (new Date() > tokenDB.expiraEn) {
      throw new AuthenticationError('Refresh token expirado');
    }

    // 5. Verificar que el usuario siga activo
    if (!tokenDB.usuario.activo) {
      throw new AuthenticationError('Cuenta inactiva');
    }

    // 6. Generar nuevo access token
    const accessToken = generateAccessToken({
      userId: tokenDB.usuario.id,
      correo: tokenDB.usuario.correo,
      rol: tokenDB.usuario.rol,
    });

    // 7. Preparar respuesta
    const userData: UserData = {
      id: tokenDB.usuario.id,
      correo: tokenDB.usuario.correo,
      nombre: tokenDB.usuario.nombre,
      apellido: tokenDB.usuario.apellido,
      rol: tokenDB.usuario.rol,
      correoVerificado: tokenDB.usuario.correoVerificado,
      activo: tokenDB.usuario.activo,
      imagenPerfil: tokenDB.usuario.imagenPerfil,
      telefono: tokenDB.usuario.telefono,
    };

    return {
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        usuario: userData,
        accessToken,
        refreshToken: data.refreshToken, // Mantener el mismo refresh token
      },
    };
  }

  // ==========================================
  // MÉTODO: OLVIDÉ MI CONTRASEÑA
  // ==========================================
  // ¿Qué hace?
  // 1. Busca el usuario por email
  // 2. Genera token de recuperación
  // 3. Guarda el token en BD con expiración
  // 4. Envía email con el link de recuperación
  // ==========================================

  async forgotPassword(data: ForgotPasswordDTO): Promise<MessageResponse> {
    // 1. Buscar usuario
    const usuario = await prisma.usuario.findUnique({
      where: { correo: data.correo },
    });

    // Por seguridad, siempre retornar el mismo mensaje
    // (no revelar si el email existe o no)
    const mensaje =
      'Si el correo existe, recibirás un email con instrucciones para recuperar tu contraseña';

    if (!usuario) {
      return {
        success: true,
        message: mensaje,
      };
    }

    // 2. Generar token de recuperación
    const tokenRecuperacion = generateRandomToken(32);

    // 3. Calcular expiración (1 hora)
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    // 4. Guardar token en BD
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        tokenRecuperacion,
        expirationTokenRecuperacion: expiracion,
      },
    });

    // 5. TODO: Enviar email con el link
    // const link = `${FRONTEND_URL}/reset-password?token=${tokenRecuperacion}`;
    // await this.sendPasswordResetEmail(usuario.correo, link);

    return {
      success: true,
      message: mensaje,
    };
  }

  // ==========================================
  // MÉTODO: RESETEAR CONTRASEÑA
  // ==========================================
  // ¿Qué hace?
  // 1. Verifica que el token exista y no haya expirado
  // 2. Hashea la nueva contraseña
  // 3. Actualiza la contraseña en BD
  // 4. Elimina el token de recuperación
  // 5. Revoca todos los refresh tokens (seguridad)
  // ==========================================

  async resetPassword(data: ResetPasswordDTO): Promise<MessageResponse> {
    // 1. Buscar usuario por token
    const usuario = await prisma.usuario.findFirst({
      where: {
        tokenRecuperacion: data.token,
        expirationTokenRecuperacion: {
          gte: new Date(), // Token no expirado
        },
      },
    });

    if (!usuario) {
      throw new ValidationError('Token inválido o expirado');
    }

    // 2. Hashear nueva contraseña
    const hashContrasena = await hashPassword(data.nuevaContrasena);

    // 3. Actualizar contraseña y limpiar tokens
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        hashContrasena,
        tokenRecuperacion: null,
        expirationTokenRecuperacion: null,
      },
    });

    // 4. Revocar todos los refresh tokens (seguridad)
    await prisma.refreshToken.updateMany({
      where: { idUsuario: usuario.id },
      data: { esRevocado: true },
    });

    return {
      success: true,
      message: 'Contraseña actualizada exitosamente',
    };
  }

  // ==========================================
  // MÉTODO: VERIFICAR EMAIL
  // ==========================================
  // ¿Qué hace?
  // 1. Busca el usuario por token de verificación
  // 2. Marca el email como verificado
  // 3. Elimina el token
  // ==========================================

  async verifyEmail(data: VerifyEmailDTO): Promise<MessageResponse> {
    // 1. Buscar usuario por token
    const usuario = await prisma.usuario.findFirst({
      where: {
        tokenVerificacion: data.token,
      },
    });

    if (!usuario) {
      throw new ValidationError('Token de verificación inválido');
    }

    // 2. Si ya está verificado
    if (usuario.correoVerificado) {
      return {
        success: true,
        message: 'El correo ya estaba verificado',
      };
    }

    // 3. Marcar como verificado
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        correoVerificado: true,
        tokenVerificacion: null,
      },
    });

    return {
      success: true,
      message: 'Email verificado exitosamente',
    };
  }
// ==========================================
// MÉTODO: LOGOUT
// ==========================================
async logout(refreshToken: string): Promise<MessageResponse> {
  // Buscar y revocar el token
  const token = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (token) {
    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { esRevocado: true },
    });
  }

  return {
    success: true,
    message: 'Sesión cerrada exitosamente',
  };
}

  // ==========================================
  // MÉTODO: CREAR USUARIO POR ADMIN
  // ==========================================
  // Este método es para cuando un ADMIN crea usuarios
  // (médicos, otros admins) después del proceso de verificación
  // NO genera tokens de sesión (el usuario debe hacer login)
  // ==========================================

  async adminCreateUser(data: {
    correo: string;
    contrasena: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    rol: 'PACIENTE' | 'MEDICO' | 'ADMIN';
    correoVerificado?: boolean;
    activo?: boolean;
  }): Promise<{ success: boolean; message: string; data: { usuario: UserData } }> {
    // 1. Verificar si el email ya está registrado
    const existeUsuario = await prisma.usuario.findUnique({
      where: { correo: data.correo },
    });

    if (existeUsuario) {
      throw new ConflictError('El correo ya está registrado');
    }

    // 2. Hashear contraseña
    const hashContrasena = await hashPassword(data.contrasena);

    // 3. Crear usuario en la base de datos
    const usuario = await prisma.usuario.create({
      data: {
        correo: data.correo,
        hashContrasena,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono || null,
        rol: data.rol,
        correoVerificado: data.correoVerificado ?? true, // Admin puede pre-verificar
        activo: data.activo ?? true,
        tokenVerificacion: null, // No necesita verificación si admin lo crea
      },
    });

    // 4. Retornar datos del usuario creado (sin tokens, debe hacer login)
    return {
      success: true,
      message: `Usuario ${data.rol} creado exitosamente. El usuario debe iniciar sesión con sus credenciales.`,
      data: {
        usuario: {
          id: usuario.id,
          correo: usuario.correo,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          rol: usuario.rol,
          correoVerificado: usuario.correoVerificado,
          activo: usuario.activo,
        },
      },
    };
  }

  // ==========================================
  // MÉTODO: OBTENER PERFIL
  // ==========================================
  // Obtiene los datos del usuario autenticado
  // ==========================================

  async getProfile(userId: string): Promise<{ success: boolean; data: { usuario: UserData } }> {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    return {
      success: true,
      data: {
        usuario: {
          id: usuario.id,
          correo: usuario.correo,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          telefono: usuario.telefono,
          rol: usuario.rol,
          correoVerificado: usuario.correoVerificado,
          activo: usuario.activo,
          fechaNacimiento: usuario.fechaNacimiento,
          genero: usuario.genero,
          imagenPerfil: usuario.imagenPerfil,
        },
      },
    };
  }

  // ==========================================
  // MÉTODO: ACTUALIZAR PERFIL
  // ==========================================
  // Actualiza los datos del usuario autenticado
  // ==========================================

  async updateProfile(
    userId: string,
    data: {
      nombre?: string;
      apellido?: string;
      telefono?: string;
      fechaNacimiento?: Date;
      genero?: string;
      imagenPerfil?: string;
    }
  ): Promise<{ success: boolean; data: { usuario: UserData } }> {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new NotFoundError('Usuario no encontrado');
    }

    // Actualizar solo los campos proporcionados
    const usuarioActualizado = await prisma.usuario.update({
      where: { id: userId },
      data: {
        ...(data.nombre && { nombre: data.nombre }),
        ...(data.apellido && { apellido: data.apellido }),
        ...(data.telefono !== undefined && { telefono: data.telefono }),
        ...(data.fechaNacimiento && { fechaNacimiento: data.fechaNacimiento }),
        ...(data.genero && { genero: data.genero as any }),
        ...(data.imagenPerfil !== undefined && { imagenPerfil: data.imagenPerfil }),
      },
    });

    return {
      success: true,
      data: {
        usuario: {
          id: usuarioActualizado.id,
          correo: usuarioActualizado.correo,
          nombre: usuarioActualizado.nombre,
          apellido: usuarioActualizado.apellido,
          telefono: usuarioActualizado.telefono,
          rol: usuarioActualizado.rol,
          correoVerificado: usuarioActualizado.correoVerificado,
          activo: usuarioActualizado.activo,
          fechaNacimiento: usuarioActualizado.fechaNacimiento,
          genero: usuarioActualizado.genero,
          imagenPerfil: usuarioActualizado.imagenPerfil,
        },
      },
    };
  }

  // ==========================================
  // MÉTODO AUXILIAR: REGISTRAR INTENTO DE LOGIN
  // ==========================================
  // ¿Para qué?
  // - Auditoría de seguridad
  // - Detectar ataques de fuerza bruta
  // - Cumplimiento normativo (HIPAA)
  // ==========================================

  private async registrarIntentoLogin(
    correo: string,
    idUsuario: string | null,
    exitoso: boolean,
    razon: string,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    await prisma.intentoLogin.create({
      data: {
        correo,
        idUsuario,
        exitoso,
        razon,
        direccionIP: ip || 'unknown',
        agenteUsuario: userAgent,
      },
    });
  }
}

// ==========================================
// EXPORTAR INSTANCIA ÚNICA (Singleton)
// ==========================================
// Usamos una única instancia para toda la app
// ==========================================

export const authService = new AuthService();