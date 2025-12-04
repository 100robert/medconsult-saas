import api from './api';
import Cookies from 'js-cookie';

export type Genero = 'MASCULINO' | 'FEMENINO' | 'OTRO' | 'PREFIERO_NO_DECIR';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  telefono?: string;
  fechaNacimiento?: string;
  genero?: Genero;
  imagenPerfil?: string;
  correoVerificado: boolean;
  activo: boolean;
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
  fechaNacimiento?: string;
  genero?: Genero;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Interfaz para la respuesta real del backend
interface BackendAuthResponse {
  success: boolean;
  message: string;
  data: {
    usuario: {
      id: string;
      correo: string;
      nombre: string;
      apellido: string;
      rol: 'ADMIN' | 'MEDICO' | 'PACIENTE';
      telefono?: string | null;
      fechaNacimiento?: string | null;
      genero?: Genero | null;
      imagenPerfil?: string | null;
      correoVerificado: boolean;
      activo: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

// Función para transformar usuario del backend al frontend
function transformUser(backendUser: BackendAuthResponse['data']['usuario']): User {
  return {
    id: backendUser.id,
    email: backendUser.correo,
    nombre: backendUser.nombre,
    apellido: backendUser.apellido,
    rol: backendUser.rol,
    telefono: backendUser.telefono || undefined,
    fechaNacimiento: backendUser.fechaNacimiento || undefined,
    genero: backendUser.genero || undefined,
    imagenPerfil: backendUser.imagenPerfil || undefined,
    correoVerificado: backendUser.correoVerificado,
    activo: backendUser.activo,
    createdAt: '',
    updatedAt: '',
  };
}

// Login
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  // Transformar campos al formato que espera el backend
  const backendData = {
    correo: credentials.email,
    contrasena: credentials.password,
  };
  
  const response = await api.post<BackendAuthResponse>('/auth/login', backendData);
  
  // Guardar tokens en cookies
  Cookies.set('accessToken', response.data.data.accessToken, { expires: 1 });
  Cookies.set('refreshToken', response.data.data.refreshToken, { expires: 7 });
  
  return {
    user: transformUser(response.data.data.usuario),
    accessToken: response.data.data.accessToken,
    refreshToken: response.data.data.refreshToken,
  };
}

// Registro (solo pacientes)
export async function register(data: RegisterData): Promise<AuthResponse> {
  // Transformar campos al formato que espera el backend
  const backendData = {
    correo: data.email,
    contrasena: data.password,
    nombre: data.nombre,
    apellido: data.apellido,
    fechaNacimiento: data.fechaNacimiento || undefined,
    genero: data.genero || undefined,
  };
  
  const response = await api.post<BackendAuthResponse>('/auth/register', backendData);
  
  // Guardar tokens en cookies
  Cookies.set('accessToken', response.data.data.accessToken, { expires: 1 });
  Cookies.set('refreshToken', response.data.data.refreshToken, { expires: 7 });
  
  return {
    user: transformUser(response.data.data.usuario),
    accessToken: response.data.data.accessToken,
    refreshToken: response.data.data.refreshToken,
  };
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

// Interfaz para respuesta de perfil del backend
interface BackendProfileResponse {
  success: boolean;
  data: {
    usuario: BackendAuthResponse['data']['usuario'];
  };
}

// Obtener perfil del usuario actual
export async function getProfile(): Promise<User> {
  const response = await api.get<BackendProfileResponse>('/auth/profile');
  return transformUser(response.data.data.usuario);
}

// Actualizar perfil
export async function updateProfile(data: Partial<User>): Promise<User> {
  // Transformar campos al formato del backend
  const backendData = {
    nombre: data.nombre,
    apellido: data.apellido,
    telefono: data.telefono,
    fechaNacimiento: data.fechaNacimiento,
    genero: data.genero,
    imagenPerfil: data.imagenPerfil,
  };
  
  const response = await api.put<BackendProfileResponse>('/auth/profile', backendData);
  return transformUser(response.data.data.usuario);
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
