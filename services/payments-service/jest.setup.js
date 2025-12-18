// Mock de Prisma Client
jest.mock('./src/config/database', () => ({
    prisma: {
        pago: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
            aggregate: jest.fn(),
            groupBy: jest.fn(),
        },
        cita: {
            findUnique: jest.fn(),
        },
        paciente: {
            findUnique: jest.fn(),
        },
        medico: {
            findUnique: jest.fn(),
        },
        $transaction: jest.fn((cb) => cb(jest.requireMock('./src/config/database').prisma)),
        $queryRaw: jest.fn().mockResolvedValue([]),
    },
}));

afterEach(() => {
    jest.clearAllMocks();
});
