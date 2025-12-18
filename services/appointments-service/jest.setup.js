// Mock de Prisma Client
jest.mock('./src/config/database', () => ({
    prisma: {
        cita: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        pago: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        disponibilidad: {
            findMany: jest.fn(),
        },
    },
}));

afterEach(() => {
    jest.clearAllMocks();
});
