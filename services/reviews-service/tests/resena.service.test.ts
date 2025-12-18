import { ResenaService } from '../src/services/resena.service';
import { prisma } from '../src/config/database';
import { EstadoCita, EstadoResena } from '@prisma/client';

describe('ResenaService', () => {
    let resenaService: ResenaService;

    beforeEach(() => {
        resenaService = new ResenaService();
        jest.clearAllMocks();
    });

    describe('crear', () => {
        const idPaciente = 'paciente-123';
        const createData = {
            idCita: 'cita-123',
            calificacion: 5,
            comentario: 'Excelente servicio',
            anonima: false
        };

        const mockCita = {
            id: 'cita-123',
            idPaciente: 'paciente-123',
            idMedico: 'medico-123',
            estado: EstadoCita.COMPLETADA,
            resena: null
        };

        it('should create a review for a completed appointment', async () => {
            (prisma.cita.findUnique as jest.Mock).mockResolvedValue(mockCita);
            (prisma.resena.create as jest.Mock).mockResolvedValue({ id: 'resena-123', ...createData });
            (prisma.resena.aggregate as jest.Mock).mockResolvedValue({ _avg: { calificacion: 5 } });
            (prisma.medico.update as jest.Mock).mockResolvedValue({});

            const result = await resenaService.crear(idPaciente, createData);

            expect(result.id).toBe('resena-123');
            expect(prisma.resena.create).toHaveBeenCalled();
            expect(prisma.medico.update).toHaveBeenCalled();
        });

        it('should throw ConflictError if appointment is not completed', async () => {
            (prisma.cita.findUnique as jest.Mock).mockResolvedValue({ ...mockCita, estado: EstadoCita.PROGRAMADA });

            await expect(resenaService.crear(idPaciente, createData)).rejects.toThrow();
        });

        it('should throw ConflictError if review already exists', async () => {
            (prisma.cita.findUnique as jest.Mock).mockResolvedValue({ ...mockCita, resena: { id: 'old-resena' } });

            await expect(resenaService.crear(idPaciente, createData)).rejects.toThrow();
        });

        it('should throw ValidationError if rating is out of range', async () => {
            (prisma.cita.findUnique as jest.Mock).mockResolvedValue(mockCita);

            await expect(resenaService.crear(idPaciente, { ...createData, calificacion: 6 })).rejects.toThrow();
        });
    });

    describe('obtenerEstadisticasMedico', () => {
        it('should return 0 if no reviews exist', async () => {
            (prisma.resena.aggregate as jest.Mock).mockResolvedValue({ _avg: { calificacion: null } });
            (prisma.resena.count as jest.Mock).mockResolvedValue(0);
            (prisma.resena.groupBy as jest.Mock).mockResolvedValue([]);
            (prisma.resena.findMany as jest.Mock).mockResolvedValue([]);

            const result = await resenaService.obtenerEstadisticasMedico('medico-123');

            expect(result.promedioCalificacion).toBe(0);
            expect(result.totalResenas).toBe(0);
        });
    });
});
