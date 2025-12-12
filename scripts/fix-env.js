const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), 'services/payments-service/.env');
const content = `# ============================================
# PAYMENTS SERVICE - VARIABLES DE ENTORNO
# ============================================

# Servidor
PORT=3005
NODE_ENV=development

# Base de datos
DATABASE_URL="postgresql://postgres:123456@localhost:5432/medconsult_db?schema=public"

# JWT (debe coincidir con auth-service)
JWT_SECRET=dev-secret-key-change-in-production-abc123xyz
JWT_EXPIRES_IN=15m

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3010,http://localhost:5173

# Configuración de pagos (placeholder para Stripe, PayPal, etc.)
# STRIPE_SECRET_KEY=sk_test_xxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxx
`;

try {
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✅ Payments Service .env actualizado correctamente');
} catch (e) {
    console.error('❌ Error actualizando .env:', e.message);
}
