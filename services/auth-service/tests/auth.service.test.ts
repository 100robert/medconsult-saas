import { AuthService } from '../src/services/auth.service';
import { prisma } from '../src/config/database';
import * as passwordUtils from '../src/utils/password.util';
import * as jwtUtils from '../src/utils/jwt.util';
import { ConflictError, AuthenticationError } from '../src/types';

// Mock explicit modules
jest.mock('../src/utils/password.util');
jest.mock('../src/utils/jwt.util');
jest.mock('../src/config/database', () => ({
  prisma: {
    usuario: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
    },
    paciente: {
      findUnique: jest.fn(),
    },
    medico: {
      findUnique: jest.fn(),
    },
    intentoLogin: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));




describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerData = {
      correo: 'test@example.com',
      contrasena: 'Password123!',
      nombre: 'Test',
      apellido: 'User',
      rol: 'PACIENTE' as const,
    };

    it('should register a new user successfully', async () => {
      // Mocks
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);
      (passwordUtils.hashPassword as jest.Mock).mockResolvedValue('hashed_password');
      (prisma.usuario.create as jest.Mock).mockResolvedValue({
        id: 'user_id',
        ...registerData,
        hashContrasena: 'hashed_password',
        correoVerificado: false,
        activo: true,
      });
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('access_token');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh_token');
      (prisma.refreshToken.create as jest.Mock).mockResolvedValue({});

      const result = await authService.register(registerData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.usuario.correo).toBe(registerData.correo);
      expect(result.data?.accessToken).toBe('access_token');
      expect(prisma.usuario.create).toHaveBeenCalled();
    });


    it('should throw ConflictError if email already exists', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ id: 'existing_id' });

      await expect(authService.register(registerData)).rejects.toThrow('El correo ya está registrado');
    });

  });

  describe('login', () => {
    const loginData = {
      correo: 'test@example.com',
      contrasena: 'Password123!',
    };

    const mockUser = {
      id: 'user_id',
      correo: 'test@example.com',
      hashContrasena: '$2b$10$hashed_password',

      rol: 'PACIENTE' as const,
      activo: true,
      nombre: 'Test',
      apellido: 'User',
      correoVerificado: true,
    };

    it('should login successfully with correct credentials', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(true);
      (prisma.paciente.findUnique as jest.Mock).mockResolvedValue({ id: 'paciente_id' });
      (jwtUtils.generateAccessToken as jest.Mock).mockReturnValue('access_token');
      (jwtUtils.generateRefreshToken as jest.Mock).mockReturnValue('refresh_token');

      const result = await authService.login(loginData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.accessToken).toBe('access_token');
      expect(result.data?.usuario.pacienteId).toBe('paciente_id');
    });


    it('should throw AuthenticationError for non-existent user', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow('Credenciales inválidas');
    });


    it('should throw AuthenticationError for incorrect password', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (passwordUtils.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow('Credenciales inválidas');
    });


    it('should throw AuthenticationError for inactive user', async () => {
      (prisma.usuario.findUnique as jest.Mock).mockResolvedValue({ ...mockUser, activo: false });

      await expect(authService.login(loginData)).rejects.toThrow('Cuenta inactiva. Contacta a soporte.');
    });

  });
});
