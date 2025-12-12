// ============================================
// PAYMENTS SERVICE - PUNTO DE ENTRADA
// ============================================

import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkDatabaseConnection, disconnectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import pagoRoutes from './routes/pago.routes';

const app: Application = express();
const PORT = process.env.PORT || 3005;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// MIDDLEWARES
// ============================================

app.use(helmet());

// En desarrollo, permitir todas las solicitudes (el gateway maneja CORS)
// En producción, se configuraría de forma más restrictiva
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',  // Gateway
  'http://localhost:3010',  // Frontend
  'http://localhost:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origin (como las de server-to-server/curl/postman/gateway)
      if (!origin) {
        return callback(null, true);
      }
      // Permitir orígenes en la lista
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // En desarrollo, permitir localhost con cualquier puerto
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        return callback(null, true);
      }
      // Rechazar otros orígenes
      console.warn(`CORS: Origen no permitido: ${origin}`);
      callback(new Error('No permitido por CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Email', 'X-User-Role', 'X-Request-Id'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'payments-service',
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'MedConsult Payments Service API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      pagos: '/pagos',
    },
  });
});

// ============================================
// RUTAS
// ============================================

app.use('/pagos', pagoRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

app.use(notFoundHandler);
app.use(errorHandler);

// ============================================
// INICIALIZACIÓN
// ============================================

async function startServer() {
  try {
    console.log('🔄 Verificando conexión a base de datos...');
    const dbConnected = await checkDatabaseConnection();

    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }

    const server = app.listen(PORT, () => {
      console.log('\n🚀 ============================================');
      console.log(`✅ Payments Service corriendo en modo ${NODE_ENV}`);
      console.log(`✅ Servidor escuchando en puerto ${PORT}`);
      console.log(`✅ URL: http://localhost:${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log('🚀 ============================================\n');
    });

    const gracefulShutdown = async (signal: string) => {
      console.log(`\n🛑 Señal ${signal} recibida. Cerrando servidor...`);
      server.close(async () => {
        console.log('✅ Servidor HTTP cerrado');
        try {
          await disconnectDatabase();
          console.log('✅ Conexión a base de datos cerrada');
        } catch (error) {
          console.error('❌ Error al cerrar base de datos:', error);
        }
        console.log('👋 Proceso terminado correctamente');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('❌ No se pudo cerrar gracefully. Forzando salida...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

export default app;
