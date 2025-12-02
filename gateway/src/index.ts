// ============================================
// API GATEWAY - MEDCONSULT SAAS
// ============================================
// Punto de entrada principal del Gateway
// Actúa como proxy inverso y capa de seguridad
// ============================================

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Importar middlewares
import { generalLimiter } from './middlewares/rateLimiter.middleware';
import { requestLogger } from './middlewares/logger.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Importar rutas
import routes from './routes';

// ============================================
// CONFIGURACIÓN
// ============================================

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES GLOBALES
// ============================================

// Seguridad con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate Limiting global
app.use(generalLimiter);

// Logger de requests
app.use(requestLogger);

// Morgan para logs en consola
app.use(morgan('combined'));

// ============================================
// HEALTH CHECK DEL GATEWAY
// ============================================

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// ============================================
// RUTAS API
// ============================================

app.use('/api', routes);

// ============================================
// RUTA RAÍZ
// ============================================

app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'MedConsult API Gateway',
    version: '1.0.0',
    description: 'Plataforma de telemedicina SaaS',
    documentation: '/api/docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      citas: '/api/citas',
      consultas: '/api/consultas',
      pagos: '/api/pagos',
      notificaciones: '/api/notificaciones',
      resenas: '/api/resenas',
      auditoria: '/api/auditoria'
    }
  });
});

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// INICIAR SERVIDOR
// ============================================

const server = app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║                                                            ║');
  console.log('║   🏥  MEDCONSULT API GATEWAY                               ║');
  console.log('║                                                            ║');
  console.log(`║   🚀  Servidor corriendo en puerto ${PORT}                     ║`);
  console.log(`║   📍  URL: http://localhost:${PORT}                           ║`);
  console.log('║                                                            ║');
  console.log('║   📌  Endpoints disponibles:                               ║');
  console.log('║       • /health          - Estado del Gateway              ║');
  console.log('║       • /api/health/services - Estado de servicios         ║');
  console.log('║       • /api/auth        - Autenticación                   ║');
  console.log('║       • /api/usuarios    - Gestión de usuarios             ║');
  console.log('║       • /api/citas       - Gestión de citas                ║');
  console.log('║       • /api/consultas   - Consultas médicas               ║');
  console.log('║       • /api/pagos       - Procesamiento de pagos          ║');
  console.log('║       • /api/notificaciones - Notificaciones               ║');
  console.log('║       • /api/resenas     - Sistema de reseñas              ║');
  console.log('║       • /api/auditoria   - Logs de auditoría               ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
});

// ============================================
// MANEJO DE CIERRE GRACEFUL
// ============================================

process.on('SIGTERM', () => {
  console.log('\n⚠️  Señal SIGTERM recibida. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️  Señal SIGINT recibida. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

export default app;
