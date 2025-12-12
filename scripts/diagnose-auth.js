// Script de diagnóstico sin dependencias externas (usa fetch nativo de Node 18+)

const GATEWAY_URL = 'http://localhost:3000/api';
const PAYMENTS_DIRECT_URL = 'http://localhost:3005';

async function diagnose() {
    console.log('🔍 Iniciando diagnóstico de autenticación...');

    try {
        // 1. LOGIN
        console.log('\n1️⃣ Intentando Login (Gateway)...');
        const loginRes = await fetch(`${GATEWAY_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: 'paciente1@gmail.com',
                contrasena: 'Password123!'
            })
        });

        if (!loginRes.ok) {
            throw new Error(`Login falló: ${loginRes.status} ${loginRes.statusText}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.data?.accessToken;

        if (!token) throw new Error('No se recibió accessToken');
        console.log('✅ Login exitoso. Token recibido.');

        // 2. GET PROFILE
        console.log('\n2️⃣ Obteniendo perfil de paciente...');
        const profileRes = await fetch(`${GATEWAY_URL}/pacientes/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!profileRes.ok) {
            console.error(`❌ Falló al obtener perfil: ${profileRes.status}`);
            const txt = await profileRes.text();
            console.log(txt);
            return;
        }

        const profileData = await profileRes.json();
        const pacienteId = profileData.data?.id;
        console.log(`✅ Perfil obtenido. ID Paciente: ${pacienteId}`);

        // 3. TEST PAYMENTS DIRECT
        console.log('\n3️⃣ Probando Microservicio Pagos DIRECTO (Puerto 3005)...');
        try {
            const directRes = await fetch(`${PAYMENTS_DIRECT_URL}/pagos/paciente/${pacienteId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (directRes.ok) {
                console.log('✅ Acceso Directo a Pagos: EXITOSO (200 OK)');
                const data = await directRes.json();
                console.log(`   Registros: ${data.data?.length || 0}`);
            } else {
                console.error(`❌ Acceso Directo a Pagos FALLÓ: ${directRes.status}`);
                console.log('   Response:', await directRes.text());
            }
        } catch (e) {
            console.error('❌ Error conectando directo a Pagos:', e.message);
        }

        // 4. TEST PAYMENTS VIA GATEWAY
        console.log('\n4️⃣ Probando Microservicio Pagos VÍA GATEWAY (Puerto 3000)...');
        const gatewayRes = await fetch(`${GATEWAY_URL}/pagos/paciente/${pacienteId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (gatewayRes.ok) {
            console.log('✅ Acceso Vía Gateway: EXITOSO (200 OK)');
            const data = await gatewayRes.json();
            console.log(`   Registros: ${data.data?.length || 0}`);
        } else {
            console.error(`❌ Acceso Vía Gateway FALLÓ: ${gatewayRes.status}`);
            console.log('   Response:', await gatewayRes.text());
            // Intentar leer headers si es posible
            try {
                console.log('   Headers:', JSON.stringify([...gatewayRes.headers.entries()]));
            } catch (e) { }
        }

    } catch (error) {
        console.error('⛔ Error en diagnóstico:', error.message);
        if (error.cause) console.error(error.cause);
    }
}

diagnose();
