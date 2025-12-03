import api from './api';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  direccion?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  fechaNacimiento?: string;
  genero?: string;
  direccion?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Login
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  
  // Guardar tokens en cookies
  Cookies.set('accessToken', response.data.accessToken, { expires: 1 });
  Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });
  
  return response.data;
}

// Registro (solo pacientes)
export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  
  // Guardar tokens en cookies
  Cookies.set('accessToken', response.data.accessToken, { expires: 1 });
  Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });
  
  return response.data;
}

// Logout
export async function logout(): Promise<void> {
  try {
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken });
    }
  } finally {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }
}

// Obtener perfil del usuario actual
export async function getProfile(): Promise<User> {
  const response = await api.get<User>('/auth/profile');
  return response.data;
}

// Actualizar perfil
export async function updateProfile(data: Partial<User>): Promise<User> {
  const response = await api.put<User>('/auth/profile', data);
  return response.data;
}

// Cambiar contraseña
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await api.post('/auth/change-password', { currentPassword, newPassword });
}

// Verificar si hay un token válido
export function isAuthenticated(): boolean {
  return !!Cookies.get('accessToken');
}

// Obtener el token actual
export function getAccessToken(): string | undefined {
  return Cookies.get('accessToken');
}
