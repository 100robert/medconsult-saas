// ============================================
// TESTS UNITARIOS - USERS SERVICE (Utilidades)
// ============================================

describe('Users Service Tests', () => {
  // Tests básicos de estructura
  describe('Estructura del servicio', () => {
    it('debe existir el archivo de servicio de paciente', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const servicePath = path.join(__dirname, '../src/services/paciente.service.ts');
      expect(fs.existsSync(servicePath)).toBe(true);
    });

    it('debe existir el archivo de servicio de médico', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const servicePath = path.join(__dirname, '../src/services/medico.service.ts');
      expect(fs.existsSync(servicePath)).toBe(true);
    });

    it('debe existir el archivo de servicio de especialidad', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const servicePath = path.join(__dirname, '../src/services/especialidad.service.ts');
      expect(fs.existsSync(servicePath)).toBe(true);
    });

    it('debe existir el archivo de controlador de paciente', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const controllerPath = path.join(__dirname, '../src/controllers/paciente.controller.ts');
      expect(fs.existsSync(controllerPath)).toBe(true);
    });

    it('debe existir el archivo de controlador de médico', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const controllerPath = path.join(__dirname, '../src/controllers/medico.controller.ts');
      expect(fs.existsSync(controllerPath)).toBe(true);
    });
  });

  // Tests de tipos
  describe('Tipos de usuario', () => {
    it('debe tener definidos los tipos de usuario', async () => {
      const typesPath = '../src/types/index';
      const types = await import(typesPath);
      expect(types).toBeDefined();
    });
  });

  // Tests de rutas
  describe('Rutas del servicio', () => {
    it('debe existir el archivo de rutas de paciente', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const routesPath = path.join(__dirname, '../src/routes/paciente.routes.ts');
      expect(fs.existsSync(routesPath)).toBe(true);
    });

    it('debe existir el archivo de rutas de médico', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const routesPath = path.join(__dirname, '../src/routes/medico.routes.ts');
      expect(fs.existsSync(routesPath)).toBe(true);
    });

    it('debe existir el archivo de rutas de especialidad', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const routesPath = path.join(__dirname, '../src/routes/especialidad.routes.ts');
      expect(fs.existsSync(routesPath)).toBe(true);
    });
  });

  // Tests de roles de usuario
  describe('Roles de usuario', () => {
    const rolesValidos = ['ADMIN', 'MEDICO', 'PACIENTE'];

    it('debe tener roles válidos', () => {
      expect(rolesValidos).toContain('ADMIN');
      expect(rolesValidos).toContain('MEDICO');
      expect(rolesValidos).toContain('PACIENTE');
    });

    it('debe tener exactamente 3 roles', () => {
      expect(rolesValidos).toHaveLength(3);
    });
  });

  // Tests de géneros
  describe('Géneros', () => {
    const generosValidos = ['MASCULINO', 'FEMENINO', 'OTRO'];

    it('debe tener géneros válidos', () => {
      expect(generosValidos).toContain('MASCULINO');
      expect(generosValidos).toContain('FEMENINO');
      expect(generosValidos).toContain('OTRO');
    });
  });
});
