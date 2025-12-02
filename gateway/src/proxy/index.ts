// ============================================
// CONFIGURACIÓN DE PROXY
// ============================================

import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { IncomingMessage, ServerResponse, ClientRequest } from 'http';
import { services } from '../config/services';

/**
 * Crear opciones de proxy para un servicio
 */
function createProxyOptions(serviceUrl: string, serviceName: string): Options {
  return {
    target: serviceUrl,
    changeOrigin: true,
    pathRewrite: (path, req) => {
      // Remover el prefijo /api si existe
      return path.replace(/^\/api/, '');
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
          proxyReq.setHeader('X-User-Id', expressReq.user.userId);
          proxyReq.setHeader('X-User-Email', expressReq.user.email);
          proxyReq.setHeader('X-User-Role', expressReq.user.rol);
        }

        // Pasar request ID
        if (req.headers['x-request-id']) {
          proxyReq.setHeader('X-Request-Id', req.headers['x-request-id'] as string);
        }

        // Pasar IP original
        const clientIp = req.headers['x-forwarded-for'] || expressReq.ip;
        proxyReq.setHeader('X-Forwarded-For', clientIp as string);

        console.log(`🔀 Proxy: ${req.method} ${expressReq.originalUrl || req.url} → ${serviceUrl}${req.url}`);
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

// Crear proxies para cada servicio
export const authProxy = createProxyMiddleware(
  createProxyOptions(services.auth.url, services.auth.name)
);

export const usersProxy = createProxyMiddleware(
  createProxyOptions(services.users.url, services.users.name)
);

export const appointmentsProxy = createProxyMiddleware(
  createProxyOptions(services.appointments.url, services.appointments.name)
);

export const consultationsProxy = createProxyMiddleware(
  createProxyOptions(services.consultations.url, services.consultations.name)
);

export const paymentsProxy = createProxyMiddleware(
  createProxyOptions(services.payments.url, services.payments.name)
);

export const notificationsProxy = createProxyMiddleware(
  createProxyOptions(services.notifications.url, services.notifications.name)
);

export const reviewsProxy = createProxyMiddleware(
  createProxyOptions(services.reviews.url, services.reviews.name)
);

export const auditProxy = createProxyMiddleware(
  createProxyOptions(services.audit.url, services.audit.name)
);
