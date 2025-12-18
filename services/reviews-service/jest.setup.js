jest.mock('./src/config/database', () => ({
    prisma: {
        resena: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
            aggregate: jest.fn(),
            groupBy: jest.fn(),
        },
        cita: {
            findUnique: jest.fn(),
        },
        medico: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

afterEach(() => {
    jest.clearAllMocks();
});
