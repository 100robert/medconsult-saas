// ============================================
// JEST SETUP - AUTH SERVICE
// ============================================

// Mock de Prisma Client
jest.mock('./src/config/database', () => ({
  prisma: {
    usuario: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    refreshToken: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    intentoLogin: {
      create: jest.fn(),
    },
    medico: {
      count: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  },
}));

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
