const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), 'services/payments-service/.env');
try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log(content);
} catch (e) {
    console.error(e.message);
}
