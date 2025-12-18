import { PagoService } from '../src/services/pago.service';
import { prisma } from '../src/config/database';
import { EstadoPago, MetodoPago } from '@prisma/client';

describe('PagoService', () => {
    let pagoService: PagoService;

    beforeEach(() => {
        pagoService = new PagoService();
        jest.clearAllMocks();
    });

    describe('crear', () => {
        const createData = {
            idCita: 'cita-123',
            monto: 100,
            moneda: 'USD',
            metodoPago: MetodoPago.TARJETA
        };

        const mockCita = {
            id: 'cita-123',
            idPaciente: 'paciente-123',
            idMedico: 'medico-123',
            pago: null,
        };

        it('should create a payment with 30% commission', async () => {
            (prisma.cita.findUnique as jest.Mock).mockResolvedValue(mockCita);
            (prisma.pago.create as jest.Mock).mockResolvedValue({
                id: 'pago-123',
                ...createData,
                comisionPlataforma: 30,
                montoMedico: 70,
                estado: EstadoPago.COMPLETADO
            });

            const result = await pagoService.crear(createData);

            expect(result.comisionPlataforma).toBe(30);
            expect(result.montoMedico).toBe(70);
            expect(prisma.pago.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    comisionPlataforma: 30,
                    montoMedico: 70
                })
            }));
        });

        it('should throw ConflictError if payment already exists', async () => {
            (prisma.cita.findUnique as jest.Mock).mockResolvedValue({ ...mockCita, pago: { id: 'existing-pago' } });

            await expect(pagoService.crear(createData)).rejects.toThrow();
        });
    });

    describe('reembolsar', () => {
        const mockPago = {
            id: 'pago-123',
            monto: 100,
            estado: EstadoPago.COMPLETADO
        };

        it('should refund a completed payment', async () => {
            (prisma.pago.findUnique as jest.Mock).mockResolvedValue(mockPago);
            (prisma.pago.update as jest.Mock).mockResolvedValue({
                ...mockPago,
                estado: EstadoPago.REEMBOLSADO,
                montoReembolsado: 50
            });

            const result = await pagoService.reembolsar('pago-123', { monto: 50, motivo: 'Cancelación' });

            expect(result.estado).toBe(EstadoPago.REEMBOLSADO);
            expect(result.montoReembolsado).toBe(50);
        });

        it('should throw error if refund amount is greater than original amount', async () => {
            (prisma.pago.findUnique as jest.Mock).mockResolvedValue(mockPago);

            await expect(pagoService.reembolsar('pago-123', { monto: 150, motivo: 'Error' })).rejects.toThrow();
        });
    });
});
