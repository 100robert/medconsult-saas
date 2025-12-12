const fs = require('fs');
const path = require('path');

const paths = [
    'services/auth-service/.env',
    'services/payments-service/.env',
    'gateway/.env'
];

console.log('🔍 Verificando JWT_SECRET en archivos .env...\n');

paths.forEach(relativePath => {
    const fullPath = path.resolve(process.cwd(), relativePath);
    console.log(`Checking: ${relativePath}`);

    if (!fs.existsSync(fullPath)) {
        console.log('   ❌ No existe el archivo');
        return;
    }

    try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const match = content.match(/JWT_SECRET=(.*)/);
        if (match) {
            const secret = match[1].trim();
            console.log(`   ✅ JWT_SECRET encontrado: "${secret}"`);
        } else {
            console.log('   ⚠️ No hay JWT_SECRET definido en el archivo');
        }
    } catch (e) {
        console.log(`   ❌ Error leyendo archivo: ${e.message}`);
    }
});
