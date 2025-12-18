import { CancelacionService } from '../src/services/cancelacion.service';
import { prisma } from '../src/config/database';

describe('CancelacionService', () => {
  let cancelacionService: CancelacionService;

  beforeEach(() => {
    jest.clearAllMocks();
    cancelacionService = new CancelacionService();
  });


  describe('calcularReembolso', () => {
    it('should return 95% refund for cancellations > 24 hours before', () => {
      const fechaCita = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours from now

      const result = cancelacionService.calcularReembolso(fechaCita);

      expect(result.porcentaje).toBe(95);
      expect(result.descripcion).toContain('95%');
    });

    it('should return 50% refund for cancellations between 2-24 hours before', () => {
      const fechaCita = new Date(Date.now() + 12 * 60 * 60 * 1000); // 12 hours from now

      const result = cancelacionService.calcularReembolso(fechaCita);

      expect(result.porcentaje).toBe(50);
      expect(result.descripcion).toContain('50%');
    });

    it('should return 0% refund for cancellations < 2 hours before', () => {
      const fechaCita = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

      const result = cancelacionService.calcularReembolso(fechaCita);

      expect(result.porcentaje).toBe(0);
      expect(result.descripcion).toContain('Sin reembolso');
    });

    it('should handle exact 24 hour boundary', () => {
      const fechaCita = new Date(Date.now() + 24 * 60 * 60 * 1000); // Exactly 24 hours

      const result = cancelacionService.calcularReembolso(fechaCita);

      expect(result.porcentaje).toBe(95);
    });

    it('should handle exact 2 hour boundary', () => {
      const fechaCita = new Date(Date.now() + 2 * 60 * 60 * 1000); // Exactly 2 hours

      const result = cancelacionService.calcularReembolso(fechaCita);

      expect(result.porcentaje).toBe(50);
    });
  });
});
