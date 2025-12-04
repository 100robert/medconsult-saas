// ============================================
// CONFIGURACIÓN DE PROXY
// ============================================

import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { IncomingMessage, ServerResponse, ClientRequest } from 'http';
import { services } from '../config/services';

/**
 * Crear opciones de proxy para un servicio
 * @param serviceUrl - URL base del servicio
 * @param serviceName - Nombre del servicio para logs
 * @param pathPrefix - Prefijo que se debe agregar a la ruta (ej: '/auth')
 */
function createProxyOptions(serviceUrl: string, serviceName: string, pathPrefix: string = ''): Options {
  return {
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Cuando Express monta con router.use('/auth', proxy), 
      // el path que llega al proxy es solo /login (sin /auth)
      // pero req.baseUrl contiene /auth
      // Necesitamos reconstruir la ruta completa para el servicio
      const expressReq = req as any;
      const baseUrl = expressReq.baseUrl || '';
      // baseUrl es /api/auth, necesitamos solo /auth
      const servicePrefix = baseUrl.replace(/^\/api/, '');
      const newPath = servicePrefix + path;
      console.log(`📝 PathRewrite: baseUrl=${baseUrl}, path=${path}, newPath=${newPath}`);
      return newPath;
    },
    on: {
      proxyReq: (proxyReq: ClientRequest, req: IncomingMessage, res: ServerResponse) => {
        const expressReq = req as any;
        
        // Pasar headers de autenticación
        if (req.headers.authorization) {
          proxyReq.setHeader('Authorization', req.headers.authorization);
        }
        
        // Pasar información del usuario si existe
        if (expressReq.user) {
          if (expressReq.user.userId) {
            proxyReq.setHeader('X-User-Id', expressReq.user.userId);
          }
          // El JWT usa 'correo' no 'email'
          if (expressReq.user.correo || expressReq.user.email) {
            proxyReq.setHeader('X-User-Email', expressReq.user.correo || expressReq.user.email);
          }
          if (expressReq.user.rol) {
            proxyReq.setHeader('X-User-Role', expressReq.user.rol);
          }
        }

        // Pasar request ID
        if (req.headers['x-request-id']) {
          proxyReq.setHeader('X-Request-Id', req.headers['x-request-id'] as string);
        }

        // Pasar IP original
        const clientIp = req.headers['x-forwarded-for'] || expressReq.ip;
        if (clientIp) {
          proxyReq.setHeader('X-Forwarded-For', clientIp as string);
        }

        // Calcular la ruta final
        const finalPath = pathPrefix + req.url;
        console.log(`🔀 Proxy: ${req.method} ${expressReq.originalUrl || req.url} → ${serviceUrl}${finalPath}`);
      },
      proxyRes: (proxyRes, req, res) => {
        // Agregar header indicando qué servicio respondió
        proxyRes.headers['X-Served-By'] = serviceName;
      },
      error: (err, req, res) => {
        console.error(`❌ Proxy Error [${serviceName}]:`, err.message);
        
        const serverRes = res as ServerResponse;
        if (serverRes && !serverRes.headersSent) {
          serverRes.writeHead(503, { 'Content-Type': 'application/json' });
          serverRes.end(JSON.stringify({
            success: false,
            message: `Servicio ${serviceName} no disponible`,
            error: 'SERVICE_UNAVAILABLE'
          }));
        }
      }
    },
    // Timeout de 30 segundos
    proxyTimeout: 30000,
    timeout: 30000,
  };
}

// Crear proxies para cada servicio con sus prefijos correctos
// Cuando el gateway monta router.use('/auth', authProxy), el path que llega
// al proxy INCLUYE el /auth del mount point. Entonces:
// - Request: /api/auth/login
// - Después del mount /auth: el path es /auth/login (el mount point se conserva)
// - Proxy recibe: /auth/login y lo envía tal cual
export const authProxy = createProxyMiddleware(
  createProxyOptions(services.auth.url, services.auth.name, '')
);

export const usersProxy = createProxyMiddleware(
  createProxyOptions(services.users.url, services.users.name, '')
);

export const appointmentsProxy = createProxyMiddleware(
  createProxyOptions(services.appointments.url, services.appointments.name, '')
);

export const consultationsProxy = createProxyMiddleware(
  createProxyOptions(services.consultations.url, services.consultations.name, '')
);

export const paymentsProxy = createProxyMiddleware(
  createProxyOptions(services.payments.url, services.payments.name, '')
);

export const notificationsProxy = createProxyMiddleware(
  createProxyOptions(services.notifications.url, services.notifications.name, '')
);

export const reviewsProxy = createProxyMiddleware(
  createProxyOptions(services.reviews.url, services.reviews.name, '')
);

export const auditProxy = createProxyMiddleware(
  createProxyOptions(services.audit.url, services.audit.name, '')
);
