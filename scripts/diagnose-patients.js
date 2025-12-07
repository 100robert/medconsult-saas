// Script para diagnosticar problemas con pacientes
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function diagnosePatients() {
  console.log('🔍 Diagnóstico de pacientes...\n');

  try {
    // 1. Obtener todos los pacientes
    const pacientes = await prisma.usuario.findMany({
      where: { rol: 'PACIENTE' },
      select: {
        id: true,
        correo: true,
        nombre: true,
        apellido: true,
        rol: true,
        activo: true,
        correoVerificado: true,
        hashContrasena: true,
        fechaCreacion: true,
      },
      take: 10, // Solo los primeros 10
    });

    console.log(`📊 Total de pacientes encontrados: ${pacientes.length}\n`);

    if (pacientes.length === 0) {
      console.log('⚠️  No hay pacientes en la base de datos');
      return;
    }

    // 2. Verificar cada paciente
    for (const paciente of pacientes) {
      console.log(`\n👤 Paciente: ${paciente.nombre} ${paciente.apellido}`);
      console.log(`   Email: ${paciente.correo}`);
      console.log(`   ID: ${paciente.id}`);
      console.log(`   Activo: ${paciente.activo}`);
      console.log(`   Email verificado: ${paciente.correoVerificado}`);
      console.log(`   Fecha creación: ${paciente.fechaCreacion}`);
      
      // Verificar formato del hash
      const hashValido = paciente.hashContrasena && 
                        paciente.hashContrasena.startsWith('$2');
      
      console.log(`   Hash válido: ${hashValido ? '✅' : '❌'}`);
      
      if (hashValido) {
        // Intentar verificar con contraseña común
        const testPasswords = ['Password123!', 'password', '123456', 'admin'];
        let passwordMatch = false;
        
        for (const testPwd of testPasswords) {
          try {
            const match = await bcrypt.compare(testPwd, paciente.hashContrasena);
            if (match) {
              console.log(`   ⚠️  Contraseña encontrada: "${testPwd}"`);
              passwordMatch = true;
              break;
            }
          } catch (error) {
            console.log(`   ❌ Error al comparar: ${error.message}`);
          }
        }
        
        if (!passwordMatch) {
          console.log(`   ℹ️  Contraseña no coincide con las comunes probadas`);
        }
      } else {
        console.log(`   ❌ Hash inválido: ${paciente.hashContrasena?.substring(0, 20)}...`);
      }
    }

    // 3. Comparar con otros roles
    console.log('\n\n📊 Comparación con otros roles:\n');
    
    const medicos = await prisma.usuario.findMany({
      where: { rol: 'MEDICO' },
      select: {
        correo: true,
        activo: true,
        hashContrasena: true,
      },
      take: 3,
    });

    const admins = await prisma.usuario.findMany({
      where: { rol: 'ADMIN' },
      select: {
        correo: true,
        activo: true,
        hashContrasena: true,
      },
      take: 3,
    });

    console.log(`Médicos: ${medicos.length}`);
    medicos.forEach(m => {
      const hashOk = m.hashContrasena?.startsWith('$2');
      console.log(`  - ${m.correo}: activo=${m.activo}, hash=${hashOk ? '✅' : '❌'}`);
    });

    console.log(`\nAdmins: ${admins.length}`);
    admins.forEach(a => {
      const hashOk = a.hashContrasena?.startsWith('$2');
      console.log(`  - ${a.correo}: activo=${a.activo}, hash=${hashOk ? '✅' : '❌'}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

diagnosePatients();

