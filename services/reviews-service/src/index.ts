// ============================================
// REVIEWS SERVICE - PUNTO DE ENTRADA
// ============================================

import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { checkDatabaseConnection, disconnectDatabase, prisma } from './config/database';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import resenaRoutes from './routes/resena.routes';

const app: Application = express();
const PORT = process.env.PORT || 3007;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// MIDDLEWARES
// ============================================

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'http://localhost:5173',
];

// CORS - Permitir todas las solicitudes (el gateway es el punto de entrada)
app.use(
  cors({
    origin: true, // Permitir todos los orígenes (las solicitudes vienen del gateway)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id', 'X-User-Email', 'X-User-Role'],
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
    service: 'reviews-service',
    environment: NODE_ENV,
    uptime: process.uptime(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'MedConsult Reviews Service API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      resenas: '/resenas',
    },
  });
});

// ============================================
// RUTAS
// ============================================

// DEBUG: Endpoint temporal para probar sin autenticación
app.get('/debug/resenas/:idUsuario', async (req, res): Promise<void> => {
  try {
    const { idUsuario } = req.params;
    console.log('🔍 DEBUG - Buscando reseñas para usuario:', idUsuario);

    // Buscar médico por idUsuario
    const medico = await prisma.medico.findUnique({
      where: { idUsuario }
    });

    console.log('🔍 DEBUG - Médico encontrado:', medico ? medico.id : 'NO');

    if (!medico) {
      res.json({ success: true, data: [], message: 'Médico no encontrado' });
      return;
    }

    // Buscar reseñas del médico
    const resenas = await prisma.resena.findMany({
      where: { idMedico: medico.id },
      include: {
        paciente: {
          include: {
            usuario: { select: { nombre: true, apellido: true } }
          }
        }
      }
    });

    console.log('🔍 DEBUG - Reseñas encontradas:', resenas.length);

    res.json({ success: true, data: resenas, total: resenas.length });
  } catch (error: any) {
    console.error('❌ DEBUG - Error:', error.message);
    res.status(500).json({ success: false, error: error.message, stack: error.stack });
  }
});

app.use('/resenas', resenaRoutes);

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
      console.log(`✅ Reviews Service corriendo en modo ${NODE_ENV}`);
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
