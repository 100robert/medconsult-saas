import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Rutas que NO deben activar el refresh token automático
    const publicRoutes = ['/auth/login', '/auth/register', '/auth/refresh-token'];
    const isPublicRoute = originalRequest.url && publicRoutes.some(route => 
      originalRequest.url?.includes(route)
    );
    
    // Si el error es 401, no es una ruta pública, y no es un retry, intentar refresh token
    if (error.response?.status === 401 && !originalRequest._retry && !isPublicRoute) {
      originalRequest._retry = true;
      
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            refreshToken,
          });
          
          // La respuesta del backend tiene estructura: { success, message, data: { usuario, accessToken, refreshToken } }
          const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;
          
          // Guardar nuevos tokens
          Cookies.set('accessToken', accessToken, { expires: 1 }); // 1 día
          Cookies.set('refreshToken', newRefreshToken, { expires: 7 }); // 7 días
          
          // Reintentar la request original
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          // Si falla el refresh, limpiar tokens y redirigir a login
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          // Solo redirigir si no estamos ya en la página de login
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
