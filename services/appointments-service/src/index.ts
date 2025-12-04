// ============================================
// APPOINTMENTS SERVICE - PUNTO DE ENTRADA
// ============================================

import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkDatabaseConnection, disconnectDatabase } from './config/database';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import disponibilidadRoutes from './routes/disponibilidad.routes';
import citaRoutes from './routes/cita.routes';

const app: Application = express();
const PORT = process.env.PORT || 3003;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// MIDDLEWARES
// ============================================

app.use(helmet());

// CORS - Permitir todas las solicitudes (el gateway maneja la seguridad)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
    service: 'appointments-service',
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'MedConsult Appointments Service API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      disponibilidades: '/disponibilidades',
      citas: '/citas',
    },
  });
});

// ============================================
// RUTAS
// ============================================

app.use('/disponibilidades', disponibilidadRoutes);
app.use('/citas', citaRoutes);

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
      console.log(`✅ Appointments Service corriendo en modo ${NODE_ENV}`);
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
