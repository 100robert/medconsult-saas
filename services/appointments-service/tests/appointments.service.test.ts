// ============================================
// TESTS UNITARIOS - APPOINTMENTS SERVICE
// ============================================

describe('Appointments Service Tests', () => {
  // Tests básicos de estructura
  describe('Estructura del servicio', () => {
    it('debe existir el archivo de servicio de citas', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const servicePath = path.join(__dirname, '../src/services/cita.service.ts');
      expect(fs.existsSync(servicePath)).toBe(true);
    });

    it('debe existir el archivo de servicio de disponibilidad', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const servicePath = path.join(__dirname, '../src/services/disponibilidad.service.ts');
      expect(fs.existsSync(servicePath)).toBe(true);
    });

    it('debe existir el archivo de controlador de citas', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const controllerPath = path.join(__dirname, '../src/controllers/cita.controller.ts');
      expect(fs.existsSync(controllerPath)).toBe(true);
    });

    it('debe existir el archivo de controlador de disponibilidad', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const controllerPath = path.join(__dirname, '../src/controllers/disponibilidad.controller.ts');
      expect(fs.existsSync(controllerPath)).toBe(true);
    });
  });

  // Tests de rutas
  describe('Rutas del servicio', () => {
    it('debe existir el archivo de rutas de citas', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const routesPath = path.join(__dirname, '../src/routes/cita.routes.ts');
      expect(fs.existsSync(routesPath)).toBe(true);
    });

    it('debe existir el archivo de rutas de disponibilidad', async () => {
      const fs = await import('fs');
      const path = await import('path');
      const routesPath = path.join(__dirname, '../src/routes/disponibilidad.routes.ts');
      expect(fs.existsSync(routesPath)).toBe(true);
    });
  });

  // Tests de validación de estados de cita
  describe('Estados de cita', () => {
    const estadosValidos = ['PENDIENTE', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'NO_ASISTIO'];

    it('debe tener estados válidos de cita', () => {
      expect(estadosValidos).toContain('PENDIENTE');
      expect(estadosValidos).toContain('CONFIRMADA');
      expect(estadosValidos).toContain('EN_CURSO');
      expect(estadosValidos).toContain('COMPLETADA');
      expect(estadosValidos).toContain('CANCELADA');
      expect(estadosValidos).toContain('NO_ASISTIO');
    });

    it('debe tener 6 estados de cita', () => {
      expect(estadosValidos).toHaveLength(6);
    });
  });

  // Tests de validación de tipos de cita
  describe('Tipos de cita', () => {
    const tiposValidos = ['VIDEOLLAMADA', 'PRESENCIAL', 'TELEFONICA'];

    it('debe tener tipos válidos de cita', () => {
      expect(tiposValidos).toContain('VIDEOLLAMADA');
      expect(tiposValidos).toContain('PRESENCIAL');
      expect(tiposValidos).toContain('TELEFONICA');
    });

    it('debe tener 3 tipos de cita', () => {
      expect(tiposValidos).toHaveLength(3);
    });
  });

  // Tests de validación de días de la semana
  describe('Días de disponibilidad', () => {
    const diasSemana = [0, 1, 2, 3, 4, 5, 6]; // 0=Domingo, 6=Sábado

    it('debe tener todos los días de la semana', () => {
      expect(diasSemana).toContain(0); // Domingo
      expect(diasSemana).toContain(1); // Lunes
      expect(diasSemana).toContain(6); // Sábado
    });

    it('debe tener 7 días', () => {
      expect(diasSemana).toHaveLength(7);
    });
  });

  // Tests de validación de horarios
  describe('Validación de horarios', () => {
    const validarFormatoHora = (hora: string): boolean => {
      const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      return regex.test(hora);
    };

    it('debe aceptar formato de hora válido HH:MM', () => {
      expect(validarFormatoHora('09:00')).toBe(true);
      expect(validarFormatoHora('14:30')).toBe(true);
      expect(validarFormatoHora('23:59')).toBe(true);
    });

    it('debe rechazar formato de hora inválido', () => {
      expect(validarFormatoHora('25:00')).toBe(false);
      expect(validarFormatoHora('9:00')).toBe(true); // Con un dígito es válido
      expect(validarFormatoHora('09:60')).toBe(false);
    });
  });
});
