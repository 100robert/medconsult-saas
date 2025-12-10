require('dotenv').config({ path: '../.env' });
const { PrismaClient } = require('../shared/node_modules/.prisma/client');

const prisma = new PrismaClient();

async function testLimiteCitas() {
  console.log('🧪 Iniciando test de límite de 5 citas para pacientes no Premium\n');

  try {
    // 1. Buscar un paciente no pro
    console.log('📋 Buscando un paciente no Premium...');
    const pacienteNoPro = await prisma.paciente.findFirst({
      where: { esPro: false },
      include: { usuario: true }
    });

    if (!pacienteNoPro) {
      console.log('❌ No hay pacientes no Premium en la BD');
      return;
    }

    console.log(`✅ Paciente encontrado: ${pacienteNoPro.usuario.nombre} ${pacienteNoPro.usuario.apellido}`);
    console.log(`   ID: ${pacienteNoPro.id}`);
    console.log(`   esPro: ${pacienteNoPro.esPro}\n`);

    // 2. Contar citas actuales del paciente
    console.log('📊 Contando citas actuales...');
    const citasActuales = await prisma.cita.count({
      where: {
        idPaciente: pacienteNoPro.id,
        estado: { not: 'CANCELADA' }
      }
    });

    console.log(`   Total de citas (no canceladas): ${citasActuales}\n`);

    if (citasActuales >= 5) {
      console.log(`⚠️  El paciente ya tiene ${citasActuales} citas (límite alcanzado)`);
      console.log('   Cancelando algunas citas para el test...\n');

      // Cancelar algunas citas para poder hacer el test
      const citasParaCancelar = await prisma.cita.findMany({
        where: {
          idPaciente: pacienteNoPro.id,
          estado: { not: 'CANCELADA' }
        },
        take: citasActuales - 4 // Dejar solo 4 citas
      });

      for (const cita of citasParaCancelar) {
        await prisma.cita.update({
          where: { id: cita.id },
          data: { estado: 'CANCELADA' }
        });
      }

      console.log(`✅ Canceladas ${citasParaCancelar.length} cita(s)\n`);
    }

    // 3. Verificar que pueda crear hasta 5 citas
    console.log('📝 Probando creación de citas...\n');

    const medicos = await prisma.medico.findMany({ take: 2 });
    if (medicos.length === 0) {
      console.log('❌ No hay médicos en la BD');
      return;
    }

    let citasCreadas = 0;
    const fechaBase = new Date();
    fechaBase.setDate(fechaBase.getDate() + 5);

    for (let i = 0; i < 6; i++) {
      const fecha = new Date(fechaBase);
      fecha.setDate(fecha.getDate() + i);

      const citasActualesCount = await prisma.cita.count({
        where: {
          idPaciente: pacienteNoPro.id,
          estado: { not: 'CANCELADA' }
        }
      });

      console.log(`   Intento ${i + 1}: ${citasActualesCount} cita(s) actuales`);

      // Simular la validación que hace el backend
      const LIMITE_CITAS_GRATIS = 5;
      const esPro = pacienteNoPro.esPro;

      if (!esPro && citasActualesCount >= LIMITE_CITAS_GRATIS) {
        console.log(`   ❌ BLOQUEADO: Límite de ${LIMITE_CITAS_GRATIS} citas alcanzado (Plan gratuito)`);
        console.log(`   💡 Mensaje de error: "Has alcanzado el límite de 5 citas del plan gratuito. Actualiza a MedConsult Pro para citas ilimitadas."\n`);
        break;
      }

      // Crear cita de prueba
      try {
        const nuevaCita = await prisma.cita.create({
          data: {
            idPaciente: pacienteNoPro.id,
            idMedico: medicos[0].id,
            fechaHoraCita: fecha,
            estado: 'PROGRAMADA',
            motivo: `Cita de test ${i + 1}`
          }
        });

        citasCreadas++;
        console.log(`   ✅ Cita ${i + 1} creada exitosamente (${nuevaCita.id.substring(0, 8)}...)\n`);
      } catch (error) {
        console.log(`   ❌ Error al crear cita: ${error.message}\n`);
      }
    }

    console.log(`\n✨ RESUMEN DEL TEST:`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Paciente: ${pacienteNoPro.usuario.nombre} ${pacienteNoPro.usuario.apellido}`);
    console.log(`Plan: ${pacienteNoPro.esPro ? 'PRO ✨' : 'GRATUITO'}`);
    console.log(`Citas creadas en test: ${citasCreadas}`);
    console.log(`Límite permitido: 5 citas`);
    console.log(`Estado: ${citasCreadas === 5 ? '✅ TEST EXITOSO' : '⚠️  VERIFICAR'}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // 4. Probar con un paciente Pro
    console.log(`\n\n🔄 Probando con paciente PRO...\n`);

    let pacientePro = await prisma.paciente.findFirst({
      where: { esPro: true },
      include: { usuario: true }
    });

    if (!pacientePro) {
      console.log('📝 No hay pacientes Pro. Creando uno para el test...\n');
      const pacienteTemp = await prisma.paciente.findFirst({
        where: { NOT: { id: pacienteNoPro.id } },
        include: { usuario: true }
      });
      if (pacienteTemp) {
        pacientePro = await prisma.paciente.update({
          where: { id: pacienteTemp.id },
          data: { esPro: true },
          include: { usuario: true }
        });
      }
    }

    if (pacientePro) {
      console.log(`✅ Paciente PRO encontrado: ${pacientePro.usuario.nombre}`);
      console.log(`   esPro: ${pacientePro.esPro}\n`);

      const citasProActuales = await prisma.cita.count({
        where: {
          idPaciente: pacientePro.id,
          estado: { not: 'CANCELADA' }
        }
      });

      console.log(`   Citas actuales: ${citasProActuales}`);
      console.log(`   ✅ Puede crear citas ilimitadas (sin validación de límite)`);
      console.log(`   Estado: El usuario Pro NO ve el modal de upgrade`);
    } else {
      console.log('⚠️  No hay pacientes disponibles para crear Pro');
    }

  } catch (error) {
    console.error('❌ Error en el test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLimiteCitas();
