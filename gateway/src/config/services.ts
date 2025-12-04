// ============================================
// CONFIGURACIÓN DE SERVICIOS
// ============================================

export interface ServiceConfig {
  name: string;
  url: string;
  healthCheck: string;
  routes: string[];
  requiresAuth: boolean;
  allowedRoles?: string[];
}

export const services: Record<string, ServiceConfig> = {
  auth: {
    name: 'Auth Service',
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    healthCheck: '/health',
    routes: ['/auth'],
    requiresAuth: false, // Login y registro no requieren auth, pero rutas de admin sí (manejado internamente)
  },
  users: {
    name: 'Users Service',
    url: process.env.USERS_SERVICE_URL || 'http://localhost:3002',
    healthCheck: '/health',
    routes: ['/usuarios', '/pacientes', '/medicos', '/especialidades'],
    requiresAuth: true,
  },
  appointments: {
    name: 'Appointments Service',
    url: process.env.APPOINTMENTS_SERVICE_URL || 'http://localhost:3003',
    healthCheck: '/health',
    routes: ['/citas', '/disponibilidad'],
    requiresAuth: true,
  },
  consultations: {
    name: 'Consultations Service',
    url: process.env.CONSULTATIONS_SERVICE_URL || 'http://localhost:3004',
    healthCheck: '/health',
    routes: ['/consultas', '/recetas'],
    requiresAuth: true,
  },
  payments: {
    name: 'Payments Service',
    url: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3005',
    healthCheck: '/health',
    routes: ['/pagos'],
    requiresAuth: true,
  },
  notifications: {
    name: 'Notifications Service',
    url: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3006',
    healthCheck: '/health',
    routes: ['/notificaciones'],
    requiresAuth: true,
  },
  reviews: {
    name: 'Reviews Service',
    url: process.env.REVIEWS_SERVICE_URL || 'http://localhost:3007',
    healthCheck: '/health',
    routes: ['/resenas'],
    requiresAuth: false, // Algunas rutas son públicas
  },
  audit: {
    name: 'Audit Service',
    url: process.env.AUDIT_SERVICE_URL || 'http://localhost:3008',
    healthCheck: '/health',
    routes: ['/auditoria'],
    requiresAuth: true,
    allowedRoles: ['ADMIN'],
  },
};

// Rutas públicas que no requieren autenticación
export const publicRoutes = [
  '/auth/login',
  '/auth/registro',
  '/auth/refresh',
  '/auth/forgot-password',
  '/health',
  '/resenas/publicas',
  '/resenas/medico/:idMedico',
  '/resenas/medico/:idMedico/estadisticas',
  '/especialidades',
  '/medicos/publico',
];

// Función para obtener el servicio basado en la ruta
export function getServiceForRoute(path: string): ServiceConfig | null {
  for (const [, service] of Object.entries(services)) {
    for (const route of service.routes) {
      if (path.startsWith(route)) {
        return service;
      }
    }
  }
  return null;
}

// Verificar si una ruta es pública
export function isPublicRoute(path: string): boolean {
  return publicRoutes.some(route => {
    // Convertir parámetros de ruta a regex
    const regex = new RegExp('^' + route.replace(/:[^/]+/g, '[^/]+') + '(/.*)?$');
    return regex.test(path);
  });
}
