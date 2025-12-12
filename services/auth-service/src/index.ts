// ============================================
// AUTH SERVICE - PUNTO DE ENTRADA
// ============================================
// Este archivo inicializa y configura toda la aplicación.
//
// Orden de inicialización:
// 1. Variables de entorno (.env)
// 2. Configuraciones de seguridad (helmet, cors)
// 3. Middlewares de parsing (json, urlencoded)
// 4. Logging de requests (morgan)
// 5. Rate limiting
// 6. Conexión a base de datos
// 7. Rutas de la aplicación
// 8. Manejo de errores
// 9. Inicio del servidor
// ============================================

import 'dotenv/config'; // Cargar variables de entorno PRIMERO
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkDatabaseConnection, disconnectDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { generalRateLimiter } from './middlewares/rateLimiter.middleware';

// ============================================
// CONFIGURACIÓN INICIAL
// ============================================

const app: Application = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// 1. MIDDLEWARES DE SEGURIDAD
// ============================================

/**
 * Helmet: Protege la app de vulnerabilidades web conocidas
 * - Establece headers HTTP de seguridad
 * - Previene XSS, clickjacking, etc.
 * - Oculta que usamos Express
 */
app.use(helmet());

/**
 * CORS: Controla qué dominios pueden acceder a la API
 * 
 * ¿Por qué configurar CORS?
 * - Por defecto, navegadores bloquean peticiones entre diferentes dominios
 * - Necesitamos permitir que nuestro frontend acceda al backend
 * 
 * Desarrollo: http://localhost:3000, http://localhost:5173 (React/Vite)
 * Producción: https://tuapp.com
 */
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:3010',
  'http://localhost:5173',
];


// esto hace que el backend pueda recibir peticiones de otros dominios
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (como Postman, curl, o proxy del gateway)
      if (!origin) return callback(null, true);

      // Permitir orígenes en la lista
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // En desarrollo, permitir todo para facilitar pruebas
        if (process.env.NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('No permitido por CORS'));
        }
      }
    },
    credentials: true, // Permitir cookies y headers de autenticación
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ============================================
// 2. MIDDLEWARES DE PARSING
// ============================================

/**
 * express.json(): Parsear body JSON
 * - Convierte req.body de string JSON a objeto JavaScript
 * - Límite de 10mb para prevenir DoS
 */
app.use(express.json({ limit: '10mb' }));

/**
 * express.urlencoded(): Parsear formularios HTML
 * - Para cuando el frontend envía application/x-www-form-urlencoded
 */
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// 3. LOGGING DE REQUESTS
// ============================================

/**
 * Morgan: Logger de peticiones HTTP
 * 
 * Formatos:
 * - 'dev': Colorido para desarrollo
 * - 'combined': Formato Apache estándar para producción
 * 
 * Ejemplo de log:
 * POST /auth/login 200 45ms
 */
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// 4. RATE LIMITING
// ============================================

/**
 * Aplicar rate limiting a TODAS las rutas
 * - 100 requests por 15 minutos por IP
 * - Previene abuso de la API
 */
app.use(generalRateLimiter);

// ============================================
// 5. HEALTH CHECK
// ============================================

/**
 * Endpoint para verificar que el servidor está vivo
 * 
 * Uso:
 * - Monitoreo (UptimeRobot, Pingdom)
 * - Load balancers
 * - CI/CD pipelines
 * 
 * GET /health
 * Respuesta: { status: 'ok', timestamp, service, environment }
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'auth-service',
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

/**
 * Endpoint raíz
 * GET /
 */
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'MedConsult Auth Service API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      docs: '/api-docs (TODO)',
    },
  });
});

// ============================================
// 6. RUTAS DE LA APLICACIÓN
// ============================================

/**
 * Registrar todas las rutas de autenticación
 * Prefijo: /auth
 * 
 * Endpoints disponibles:
 * - POST /auth/register
 * - POST /auth/login
 * - POST /auth/refresh-token
 * - POST /auth/forgot-password
 * - POST /auth/reset-password
 * - POST /auth/verify-email
 * - GET  /auth/verify-email
 * - POST /auth/logout
 */
app.use('/auth', authRoutes);

// TODO: Agregar más rutas cuando creemos otros microservicios
// app.use('/users', userRoutes);
// app.use('/appointments', appointmentRoutes);

// ============================================
// 7. MANEJO DE ERRORES
// ============================================

/**
 * Manejo de rutas no encontradas (404)
 * - Debe ir DESPUÉS de todas las rutas definidas
 * - Cualquier ruta no registrada llega aquí
 */
app.use(notFoundHandler);

/**
 * Manejo centralizado de errores
 * - Captura TODOS los errores de la app
 * - Debe ir al FINAL de todos los middlewares
 * - Tiene 4 parámetros (err, req, res, next)
 */
app.use(errorHandler);

// ============================================
// 8. INICIALIZACIÓN DEL SERVIDOR
// ============================================

/**
 * Función asíncrona para iniciar el servidor
 * 
 * Pasos:
 * 1. Verificar conexión a base de datos
 * 2. Iniciar servidor HTTP
 * 3. Configurar manejo de señales (SIGTERM, SIGINT)
 */
async function startServer() {
  try {
    // ==========================================
    // 1. VERIFICAR CONEXIÓN A BASE DE DATOS
    // ==========================================
    console.log('🔄 Verificando conexión a base de datos...');
    const dbConnected = await checkDatabaseConnection();

    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1); // Salir con error
    }

    // ==========================================
    // 2. INICIAR SERVIDOR HTTP
    // ==========================================
    const server = app.listen(PORT, () => {
      console.log('\n🚀 ============================================');
      console.log(`✅ Auth Service corriendo en modo ${NODE_ENV}`);
      console.log(`✅ Servidor escuchando en puerto ${PORT}`);
      console.log(`✅ URL: http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log('🚀 ============================================\n');
    });

    // ==========================================
    // 3. MANEJO GRACEFUL SHUTDOWN
    // ==========================================
    // Cuando se cierra la app (Ctrl+C, docker stop, etc.)
    // Cerrar conexiones de forma limpia
    // ==========================================

    /**
     * Función para cerrar gracefully
     * - Cierra el servidor HTTP
     * - Desconecta Prisma
     * - Sale del proceso
     */
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Señal ${signal} recibida. Cerrando servidor...`);

      // Cerrar servidor HTTP (no aceptar nuevas conexiones)
      server.close(async () => {
        console.log('✅ Servidor HTTP cerrado');

        // Desconectar Prisma
        try {
          await disconnectDatabase();
          console.log('✅ Conexión a base de datos cerrada');
        } catch (error) {
          console.error('❌ Error al cerrar base de datos:', error);
        }

        console.log('👋 Proceso terminado correctamente');
        process.exit(0);
      });

      // Si después de 10 segundos no se cerró, forzar
      setTimeout(() => {
        console.error('❌ No se pudo cerrar gracefully. Forzando salida...');
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Manejar errores no capturados
    process.on('uncaughtException', (error) => {
      console.error('❌ Excepción no capturada:', error);
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('❌ Promesa rechazada no manejada:', reason);
      gracefulShutdown('unhandledRejection');
    });

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// ============================================
// 9. INICIAR LA APLICACIÓN
// ============================================

startServer();

// ============================================
// EXPORTAR APP (para testing)
// ============================================
export default app;