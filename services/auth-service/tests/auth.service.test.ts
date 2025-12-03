// ============================================
// TESTS UNITARIOS - AUTH SERVICE (Validadores)
// ============================================

describe('Auth Validators', () => {
  // ==========================================
  // TESTS DEL SCHEMA DE REGISTRO
  // ==========================================
  describe('registerSchema', () => {
    let registerSchema: any;

    beforeAll(async () => {
      const module = await import('../src/validators/auth.validator');
      registerSchema = module.registerSchema;
    });

    it('debe validar un registro válido de paciente', () => {
      const validData = {
        correo: 'test@example.com',
        contrasena: 'Password123!',
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.rol).toBe('PACIENTE'); // Debe ser PACIENTE por defecto
      }
    });

    it('debe rechazar correo inválido', () => {
      const invalidData = {
        correo: 'correo-invalido',
        contrasena: 'Password123!',
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('debe rechazar contraseña sin mayúscula', () => {
      const weakPassword = {
        correo: 'test@example.com',
        contrasena: 'password123!',
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(weakPassword);
      expect(result.success).toBe(false);
    });

    it('debe rechazar contraseña sin número', () => {
      const weakPassword = {
        correo: 'test@example.com',
        contrasena: 'Password!',
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(weakPassword);
      expect(result.success).toBe(false);
    });

    it('debe rechazar contraseña sin carácter especial', () => {
      const weakPassword = {
        correo: 'test@example.com',
        contrasena: 'Password123',
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(weakPassword);
      expect(result.success).toBe(false);
    });

    it('debe rechazar contraseña muy corta', () => {
      const shortPassword = {
        correo: 'test@example.com',
        contrasena: 'Pa1!',
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(shortPassword);
      expect(result.success).toBe(false);
    });

    it('debe rechazar nombre muy corto', () => {
      const invalidData = {
        correo: 'test@example.com',
        contrasena: 'Password123!',
        nombre: 'J',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('debe rechazar nombre con números', () => {
      const invalidData = {
        correo: 'test@example.com',
        contrasena: 'Password123!',
        nombre: 'Juan123',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('debe rechazar rol MEDICO en registro público', () => {
      const medicoData = {
        correo: 'medico@example.com',
        contrasena: 'Password123!',
        nombre: 'Doctor',
        apellido: 'House',
        rol: 'MEDICO',
      };

      const result = registerSchema.safeParse(medicoData);
      expect(result.success).toBe(false);
    });

    it('debe rechazar rol ADMIN en registro público', () => {
      const adminData = {
        correo: 'admin@example.com',
        contrasena: 'Password123!',
        nombre: 'Admin',
        apellido: 'User',
        rol: 'ADMIN',
      };

      const result = registerSchema.safeParse(adminData);
      expect(result.success).toBe(false);
    });

    it('debe convertir correo a minúsculas', () => {
      const upperCaseEmail = {
        correo: 'TEST@EXAMPLE.COM',
        contrasena: 'Password123!',
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      const result = registerSchema.safeParse(upperCaseEmail);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.correo).toBe('test@example.com');
      }
    });

    it('debe permitir teléfono opcional', () => {
      const withPhone = {
        correo: 'test@example.com',
        contrasena: 'Password123!',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '+573001234567',
      };

      const result = registerSchema.safeParse(withPhone);
      expect(result.success).toBe(true);
    });

    it('debe validar formato de teléfono internacional', () => {
      // Teléfono que empieza con 0 es inválido según el regex
      const invalidPhone = {
        correo: 'test@example.com',
        contrasena: 'Password123!',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '0123456789', // Inválido: empieza con 0
      };

      const result = registerSchema.safeParse(invalidPhone);
      expect(result.success).toBe(false);
    });

    it('debe rechazar teléfono con letras', () => {
      const phoneWithLetters = {
        correo: 'test@example.com',
        contrasena: 'Password123!',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: 'abc123',
      };

      const result = registerSchema.safeParse(phoneWithLetters);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================
  // TESTS DEL SCHEMA DE LOGIN
  // ==========================================
  describe('loginSchema', () => {
    let loginSchema: any;

    beforeAll(async () => {
      const module = await import('../src/validators/auth.validator');
      loginSchema = module.loginSchema;
    });

    it('debe validar login válido', () => {
      const validLogin = {
        correo: 'test@example.com',
        contrasena: 'anypassword',
      };

      const result = loginSchema.safeParse(validLogin);
      expect(result.success).toBe(true);
    });

    it('debe rechazar correo inválido', () => {
      const invalidLogin = {
        correo: 'invalid-email',
        contrasena: 'password',
      };

      const result = loginSchema.safeParse(invalidLogin);
      expect(result.success).toBe(false);
    });

    it('debe rechazar contraseña vacía', () => {
      const emptyPassword = {
        correo: 'test@example.com',
        contrasena: '',
      };

      const result = loginSchema.safeParse(emptyPassword);
      expect(result.success).toBe(false);
    });

    it('debe rechazar sin correo', () => {
      const noEmail = {
        contrasena: 'password',
      };

      const result = loginSchema.safeParse(noEmail);
      expect(result.success).toBe(false);
    });
  });

  // ==========================================
  // TESTS DEL SCHEMA DE ADMIN CREATE USER
  // ==========================================
  describe('adminCreateUserSchema', () => {
    let adminCreateUserSchema: any;

    beforeAll(async () => {
      const module = await import('../src/validators/auth.validator');
      adminCreateUserSchema = module.adminCreateUserSchema;
    });

    it('debe permitir crear MEDICO', () => {
      const medicoData = {
        correo: 'medico@example.com',
        contrasena: 'Password123!',
        nombre: 'Doctor',
        apellido: 'House',
        rol: 'MEDICO',
      };

      const result = adminCreateUserSchema.safeParse(medicoData);
      expect(result.success).toBe(true);
    });

    it('debe permitir crear ADMIN', () => {
      const adminData = {
        correo: 'admin@example.com',
        contrasena: 'Password123!',
        nombre: 'Admin',
        apellido: 'User',
        rol: 'ADMIN',
      };

      const result = adminCreateUserSchema.safeParse(adminData);
      expect(result.success).toBe(true);
    });

    it('debe permitir crear PACIENTE', () => {
      const pacienteData = {
        correo: 'paciente@example.com',
        contrasena: 'Password123!',
        nombre: 'Paciente',
        apellido: 'Test',
        rol: 'PACIENTE',
      };

      const result = adminCreateUserSchema.safeParse(pacienteData);
      expect(result.success).toBe(true);
    });

    it('debe permitir pre-verificar correo', () => {
      const preVerified = {
        correo: 'medico@example.com',
        contrasena: 'Password123!',
        nombre: 'Doctor',
        apellido: 'House',
        rol: 'MEDICO',
        correoVerificado: true,
      };

      const result = adminCreateUserSchema.safeParse(preVerified);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.correoVerificado).toBe(true);
      }
    });
  });

  // ==========================================
  // TESTS DEL SCHEMA DE RESET PASSWORD
  // ==========================================
  describe('resetPasswordSchema', () => {
    let resetPasswordSchema: any;

    beforeAll(async () => {
      const module = await import('../src/validators/auth.validator');
      resetPasswordSchema = module.resetPasswordSchema;
    });

    it('debe validar reset password válido', () => {
      const validReset = {
        token: 'valid-token-123',
        nuevaContrasena: 'NewPassword123!',
      };

      const result = resetPasswordSchema.safeParse(validReset);
      expect(result.success).toBe(true);
    });

    it('debe rechazar contraseña débil', () => {
      const weakPassword = {
        token: 'valid-token-123',
        nuevaContrasena: '123',
      };

      const result = resetPasswordSchema.safeParse(weakPassword);
      expect(result.success).toBe(false);
    });

    it('debe rechazar token vacío', () => {
      const emptyToken = {
        token: '',
        nuevaContrasena: 'NewPassword123!',
      };

      const result = resetPasswordSchema.safeParse(emptyToken);
      expect(result.success).toBe(false);
    });
  });
});
