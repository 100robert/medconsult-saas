import { useAuthStore } from '../authStore';
import { act } from '@testing-library/react';

// Mock the auth library
jest.mock('@/lib/auth', () => ({
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    getProfile: jest.fn(),
}));

// Mock js-cookie
jest.mock('js-cookie', () => ({
    get: jest.fn(),
    set: jest.fn(),
    remove: jest.fn(),
}));

// Import mocked modules
import { login as mockLogin, logout as mockLogout, register as mockRegister, getProfile as mockGetProfile } from '@/lib/auth';
import Cookies from 'js-cookie';

describe('AuthStore', () => {
    // Reset store before each test
    beforeEach(() => {
        // Clear the store state
        const { getState } = useAuthStore;
        act(() => {
            useAuthStore.setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        });
        // Clear all mocks
        jest.clearAllMocks();
    });

    describe('Initial State', () => {
        it('should have correct initial state', () => {
            const state = useAuthStore.getState();

            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });
    });

    describe('login action', () => {
        it('should login successfully and set user', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                nombre: 'Test',
                apellido: 'User',
                rol: 'PACIENTE' as const,
                correoVerificado: true,
                activo: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
            };

            (mockLogin as jest.Mock).mockResolvedValue({ user: mockUser });

            await act(async () => {
                await useAuthStore.getState().login({
                    email: 'test@example.com',
                    password: 'password123',
                });
            });

            const state = useAuthStore.getState();
            expect(state.user).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBeNull();
        });

        it('should set error on login failure', async () => {
            (mockLogin as jest.Mock).mockRejectedValue({
                response: { data: { message: 'Credenciales inválidas' } },
            });

            await expect(
                act(async () => {
                    await useAuthStore.getState().login({
                        email: 'test@example.com',
                        password: 'wrongpassword',
                    });
                })
            ).rejects.toThrow('Credenciales inválidas');

            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.error).toBe('Credenciales inválidas');
        });

        it('should set isLoading to true during login', async () => {
            let loadingDuringRequest = false;

            (mockLogin as jest.Mock).mockImplementation(() => {
                loadingDuringRequest = useAuthStore.getState().isLoading;
                return Promise.resolve({ user: { id: '1' } });
            });

            await act(async () => {
                await useAuthStore.getState().login({
                    email: 'test@example.com',
                    password: 'password',
                });
            });

            expect(loadingDuringRequest).toBe(true);
        });
    });

    describe('logout action', () => {
        it('should clear user and authentication state', async () => {
            // First, set authenticated state
            act(() => {
                useAuthStore.setState({
                    user: { id: '1', email: 'test@example.com', nombre: 'Test', apellido: 'User', rol: 'PACIENTE', correoVerificado: true, activo: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
                    isAuthenticated: true,
                });
            });

            (mockLogout as jest.Mock).mockResolvedValue(undefined);

            await act(async () => {
                await useAuthStore.getState().logout();
            });

            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });

    describe('setUser action', () => {
        it('should set user and update isAuthenticated', () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                nombre: 'Test',
                apellido: 'User',
                rol: 'MEDICO' as const,
                correoVerificado: true,
                activo: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
            };

            act(() => {
                useAuthStore.getState().setUser(mockUser);
            });

            const state = useAuthStore.getState();
            expect(state.user).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);
        });

        it('should handle null user', () => {
            // First set a user
            act(() => {
                useAuthStore.getState().setUser({
                    id: '1',
                    email: 'test@example.com',
                    nombre: 'Test',
                    apellido: 'User',
                    rol: 'ADMIN',
                    correoVerificado: true,
                    activo: true,
                    createdAt: '2024-01-01T00:00:00Z',
                    updatedAt: '2024-01-01T00:00:00Z',
                });
            });

            // Then set to null
            act(() => {
                useAuthStore.getState().setUser(null);
            });

            const state = useAuthStore.getState();
            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
        });
    });

    describe('clearError action', () => {
        it('should clear error state', () => {
            // Set an error
            act(() => {
                useAuthStore.setState({ error: 'Some error' });
            });

            expect(useAuthStore.getState().error).toBe('Some error');

            // Clear it
            act(() => {
                useAuthStore.getState().clearError();
            });

            expect(useAuthStore.getState().error).toBeNull();
        });
    });

    describe('fetchProfile action', () => {
        it('should fetch and set user profile when token exists', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                nombre: 'Test',
                apellido: 'User',
                rol: 'PACIENTE' as const,
                correoVerificado: true,
                activo: true,
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
            };

            (Cookies.get as jest.Mock).mockReturnValue('valid-token');
            (mockGetProfile as jest.Mock).mockResolvedValue(mockUser);

            await act(async () => {
                await useAuthStore.getState().fetchProfile();
            });

            const state = useAuthStore.getState();
            expect(state.user).toEqual(mockUser);
            expect(state.isAuthenticated).toBe(true);
        });

        it('should not fetch profile when no token', async () => {
            (Cookies.get as jest.Mock).mockReturnValue(undefined);

            await act(async () => {
                await useAuthStore.getState().fetchProfile();
            });

            expect(mockGetProfile).not.toHaveBeenCalled();
            expect(useAuthStore.getState().isAuthenticated).toBe(false);
        });
    });
});
