const { PrismaClient } = require('../services/auth-service/node_modules/.prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...\n');

  // Limpiar datos existentes (excepto admin)
  console.log('🧹 Limpiando datos anteriores...');
  await prisma.registroAuditoria.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.resena.deleteMany();
  await prisma.pago.deleteMany();
  await prisma.receta.deleteMany();
  await prisma.consulta.deleteMany();
  await prisma.cita.deleteMany();
  await prisma.fechaNoDisponible.deleteMany();
  await prisma.disponibilidad.deleteMany();
  await prisma.medico.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.intentoLogin.deleteMany();
  await prisma.usuario.deleteMany({ where: { rol: { not: 'ADMIN' } } });

  const hashPassword = await bcrypt.hash('Password123!', 10);

  // ============================================
  // ESPECIALIDADES (15)
  // ============================================
  console.log('📋 Creando especialidades...');
  const especialidades = await Promise.all([
    prisma.especialidad.upsert({ where: { nombre: 'Cardiología' }, update: {}, create: { nombre: 'Cardiología', descripcion: 'Enfermedades del corazón', icono: 'heart' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Dermatología' }, update: {}, create: { nombre: 'Dermatología', descripcion: 'Enfermedades de la piel', icono: 'user' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Pediatría' }, update: {}, create: { nombre: 'Pediatría', descripcion: 'Salud infantil', icono: 'baby' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Ginecología' }, update: {}, create: { nombre: 'Ginecología', descripcion: 'Salud de la mujer', icono: 'female' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Traumatología' }, update: {}, create: { nombre: 'Traumatología', descripcion: 'Lesiones musculoesqueléticas', icono: 'bone' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Neurología' }, update: {}, create: { nombre: 'Neurología', descripcion: 'Sistema nervioso', icono: 'brain' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Oftalmología' }, update: {}, create: { nombre: 'Oftalmología', descripcion: 'Salud visual', icono: 'eye' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Otorrinolaringología' }, update: {}, create: { nombre: 'Otorrinolaringología', descripcion: 'Oído, nariz y garganta', icono: 'ear' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Psiquiatría' }, update: {}, create: { nombre: 'Psiquiatría', descripcion: 'Salud mental', icono: 'brain' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Urología' }, update: {}, create: { nombre: 'Urología', descripcion: 'Sistema urinario', icono: 'kidney' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Gastroenterología' }, update: {}, create: { nombre: 'Gastroenterología', descripcion: 'Sistema digestivo', icono: 'stomach' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Endocrinología' }, update: {}, create: { nombre: 'Endocrinología', descripcion: 'Sistema hormonal', icono: 'thyroid' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Neumología' }, update: {}, create: { nombre: 'Neumología', descripcion: 'Sistema respiratorio', icono: 'lungs' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Medicina General' }, update: {}, create: { nombre: 'Medicina General', descripcion: 'Atención primaria', icono: 'stethoscope' } }),
    prisma.especialidad.upsert({ where: { nombre: 'Oncología' }, update: {}, create: { nombre: 'Oncología', descripcion: 'Tratamiento del cáncer', icono: 'ribbon' } }),
  ]);
  console.log(`   ✅ ${especialidades.length} especialidades creadas`);

  // ============================================
  // MÉDICOS (15)
  // ============================================
  console.log('👨‍⚕️ Creando médicos...');
  const medicosData = [
    { nombre: 'Carlos', apellido: 'García López', correo: 'dr.garcia@medconsult.com', licencia: 'MED-001', esp: 0, precio: 150, exp: 15 },
    { nombre: 'María', apellido: 'Rodríguez Pérez', correo: 'dra.rodriguez@medconsult.com', licencia: 'MED-002', esp: 1, precio: 120, exp: 10 },
    { nombre: 'Juan', apellido: 'Martínez Soto', correo: 'dr.martinez@medconsult.com', licencia: 'MED-003', esp: 2, precio: 100, exp: 8 },
    { nombre: 'Ana', apellido: 'Fernández Ruiz', correo: 'dra.fernandez@medconsult.com', licencia: 'MED-004', esp: 3, precio: 130, exp: 12 },
    { nombre: 'Roberto', apellido: 'López Vega', correo: 'dr.lopez@medconsult.com', licencia: 'MED-005', esp: 4, precio: 140, exp: 20 },
    { nombre: 'Laura', apellido: 'Sánchez Torres', correo: 'dra.sanchez@medconsult.com', licencia: 'MED-006', esp: 5, precio: 180, exp: 18 },
    { nombre: 'Miguel', apellido: 'Díaz Castro', correo: 'dr.diaz@medconsult.com', licencia: 'MED-007', esp: 6, precio: 110, exp: 7 },
    { nombre: 'Carmen', apellido: 'Moreno Jiménez', correo: 'dra.moreno@medconsult.com', licencia: 'MED-008', esp: 7, precio: 125, exp: 9 },
    { nombre: 'Pedro', apellido: 'Ramírez Ortiz', correo: 'dr.ramirez@medconsult.com', licencia: 'MED-009', esp: 8, precio: 160, exp: 14 },
    { nombre: 'Isabel', apellido: 'Herrera Luna', correo: 'dra.herrera@medconsult.com', licencia: 'MED-010', esp: 9, precio: 135, exp: 11 },
    { nombre: 'Francisco', apellido: 'Vargas Mendoza', correo: 'dr.vargas@medconsult.com', licencia: 'MED-011', esp: 10, precio: 145, exp: 16 },
    { nombre: 'Patricia', apellido: 'Castro Navarro', correo: 'dra.castro@medconsult.com', licencia: 'MED-012', esp: 11, precio: 155, exp: 13 },
    { nombre: 'Alberto', apellido: 'Reyes Silva', correo: 'dr.reyes@medconsult.com', licencia: 'MED-013', esp: 12, precio: 115, exp: 6 },
    { nombre: 'Lucía', apellido: 'Flores Ramos', correo: 'dra.flores@medconsult.com', licencia: 'MED-014', esp: 13, precio: 90, exp: 5 },
    { nombre: 'Eduardo', apellido: 'Guzmán Paredes', correo: 'dr.guzman@medconsult.com', licencia: 'MED-015', esp: 14, precio: 200, exp: 22 },
  ];

  const medicos = [];
  for (const m of medicosData) {
    const usuario = await prisma.usuario.create({
      data: {
        correo: m.correo,
        hashContrasena: hashPassword,
        nombre: m.nombre,
        apellido: m.apellido,
        telefono: `+51 9${Math.floor(10000000 + Math.random() * 90000000)}`,
        rol: 'MEDICO',
        correoVerificado: true,
        activo: true,
      }
    });
    const medico = await prisma.medico.create({
      data: {
        idUsuario: usuario.id,
        numeroLicencia: m.licencia,
        idEspecialidad: especialidades[m.esp].id,
        aniosExperiencia: m.exp,
        precioPorConsulta: m.precio,
        moneda: 'PEN',
        duracionConsulta: 30,
        calificacionPromedio: (4 + Math.random()).toFixed(2),
        estado: 'VERIFICADO',
        biografia: `Médico especialista con ${m.exp} años de experiencia.`,
      }
    });
    medicos.push(medico);
  }
  console.log(`   ✅ ${medicos.length} médicos creados`);

  // ============================================
  // PACIENTES (20)
  // ============================================
  console.log('🧑‍🤝‍🧑 Creando pacientes...');
  const pacientesData = [
    { nombre: 'José', apellido: 'Quispe Mamani' },
    { nombre: 'Rosa', apellido: 'Huamán Chávez' },
    { nombre: 'Luis', apellido: 'Condori Flores' },
    { nombre: 'María', apellido: 'Apaza Torres' },
    { nombre: 'Juan', apellido: 'Ccama Ticona' },
    { nombre: 'Elena', apellido: 'Mamani Ramos' },
    { nombre: 'Carlos', apellido: 'Puma Quispe' },
    { nombre: 'Ana', apellido: 'Choque Mendoza' },
    { nombre: 'Pedro', apellido: 'Hancco Vilca' },
    { nombre: 'Luz', apellido: 'Sulla Cáceres' },
    { nombre: 'Miguel', apellido: 'Turpo Paricahua' },
    { nombre: 'Carmen', apellido: 'Coila Mamani' },
    { nombre: 'Alberto', apellido: 'Huanca Quispe' },
    { nombre: 'Patricia', apellido: 'Larico Torres' },
    { nombre: 'Roberto', apellido: 'Machaca Flores' },
    { nombre: 'Sofía', apellido: 'Calla Chura' },
    { nombre: 'Diego', apellido: 'Pari Condori' },
    { nombre: 'Valentina', apellido: 'Tito Mamani' },
    { nombre: 'Fernando', apellido: 'Yucra Apaza' },
    { nombre: 'Claudia', apellido: 'Nina Quispe' },
  ];

  const pacientes = [];
  for (let i = 0; i < pacientesData.length; i++) {
    const p = pacientesData[i];
    const usuario = await prisma.usuario.create({
      data: {
        correo: `paciente${i + 1}@gmail.com`,
        hashContrasena: hashPassword,
        nombre: p.nombre,
        apellido: p.apellido,
        telefono: `+51 9${Math.floor(10000000 + Math.random() * 90000000)}`,
        rol: 'PACIENTE',
        correoVerificado: true,
        activo: true,
      }
    });
    const paciente = await prisma.paciente.create({
      data: {
        idUsuario: usuario.id,
        ciudad: ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura'][Math.floor(Math.random() * 5)],
        pais: 'Perú',
        grupoSanguineo: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][Math.floor(Math.random() * 8)],
      }
    });
    pacientes.push(paciente);
  }
  console.log(`   ✅ ${pacientes.length} pacientes creados`);

  // ============================================
  // DISPONIBILIDADES (45 - 3 por médico)
  // ============================================
  console.log('📅 Creando disponibilidades...');
  const dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  let dispCount = 0;
  for (const medico of medicos) {
    const diasSeleccionados = dias.sort(() => Math.random() - 0.5).slice(0, 3);
    for (const dia of diasSeleccionados) {
      await prisma.disponibilidad.create({
        data: {
          idMedico: medico.id,
          diaSemana: dia,
          horaInicio: '09:00',
          horaFin: '17:00',
          activo: true,
        }
      });
      dispCount++;
    }
  }
  console.log(`   ✅ ${dispCount} disponibilidades creadas`);

  // ============================================
  // CITAS (30)
  // ============================================
  console.log('🗓️ Creando citas...');
  const estados = ['PROGRAMADA', 'CONFIRMADA', 'COMPLETADA', 'CANCELADA'];
  const citas = [];
  const motivos = [
    'Control de rutina',
    'Dolor de cabeza persistente',
    'Revisión de exámenes',
    'Seguimiento de tratamiento',
    'Primera consulta',
    'Malestar general',
    'Dolor abdominal',
    'Control postoperatorio',
    'Evaluación cardiovascular',
    'Problemas de visión',
  ];

  for (let i = 0; i < 30; i++) {
    const fechaCita = new Date();
    fechaCita.setDate(fechaCita.getDate() + Math.floor(Math.random() * 60) - 30); // -30 a +30 días
    fechaCita.setHours(9 + Math.floor(Math.random() * 8), 0, 0, 0);

    const estado = estados[Math.floor(Math.random() * estados.length)];
    const cita = await prisma.cita.create({
      data: {
        idPaciente: pacientes[Math.floor(Math.random() * pacientes.length)].id,
        idMedico: medicos[Math.floor(Math.random() * medicos.length)].id,
        fechaHoraCita: fechaCita,
        estado: estado,
        motivo: motivos[Math.floor(Math.random() * motivos.length)],
        notas: estado === 'COMPLETADA' ? 'Consulta realizada satisfactoriamente' : null,
      }
    });
    citas.push(cita);
  }
  console.log(`   ✅ ${citas.length} citas creadas`);

  // ============================================
  // CONSULTAS (20 - de citas completadas)
  // ============================================
  console.log('📝 Creando consultas...');
  const citasCompletadas = citas.filter(c => c.estado === 'COMPLETADA');
  const consultas = [];
  const diagnosticos = [
    'Hipertensión arterial leve',
    'Infección respiratoria',
    'Gastritis crónica',
    'Ansiedad generalizada',
    'Dermatitis atópica',
    'Migraña tensional',
    'Diabetes tipo 2 controlada',
    'Lumbalgia mecánica',
  ];

  for (const cita of citasCompletadas.slice(0, 20)) {
    const consulta = await prisma.consulta.create({
      data: {
        idCita: cita.id,
        fechaInicio: cita.fechaHoraCita,
        fechaFin: new Date(cita.fechaHoraCita.getTime() + 30 * 60000),
        duracion: 30,
        tipoConsulta: ['CHAT', 'VIDEO', 'HIBRIDA'][Math.floor(Math.random() * 3)],
        diagnostico: diagnosticos[Math.floor(Math.random() * diagnosticos.length)],
        tratamiento: 'Se indica tratamiento farmacológico y seguimiento.',
        estado: 'COMPLETADA',
      }
    });
    consultas.push(consulta);
  }
  console.log(`   ✅ ${consultas.length} consultas creadas`);

  // ============================================
  // PAGOS (25)
  // ============================================
  console.log('💰 Creando pagos...');
  const citasParaPago = citas.filter(c => c.estado === 'COMPLETADA' || c.estado === 'CONFIRMADA');
  let pagosCount = 0;
  for (const cita of citasParaPago.slice(0, 25)) {
    const monto = 100 + Math.floor(Math.random() * 100);
    await prisma.pago.create({
      data: {
        idCita: cita.id,
        idPaciente: cita.idPaciente,
        idMedico: cita.idMedico,
        monto: monto,
        comisionPlataforma: monto * 0.1,
        montoMedico: monto * 0.9,
        moneda: 'PEN',
        metodoPago: ['TARJETA', 'BILLETERA', 'TRANSFERENCIA'][Math.floor(Math.random() * 3)],
        idTransaccion: `TXN-${Date.now()}-${pagosCount}`,
        estado: ['COMPLETADO', 'PENDIENTE'][Math.floor(Math.random() * 2)],
        fechaProcesamiento: new Date(),
      }
    });
    pagosCount++;
  }
  console.log(`   ✅ ${pagosCount} pagos creados`);

  // ============================================
  // RESEÑAS (20)
  // ============================================
  console.log('⭐ Creando reseñas...');
  const comentarios = [
    'Excelente atención, muy profesional.',
    'Muy buen médico, lo recomiendo.',
    'Me explicó todo con claridad.',
    'Atención rápida y efectiva.',
    'Muy amable y profesional.',
    'Buena consulta, resolvió mis dudas.',
    'Tratamiento efectivo.',
    'Muy satisfecho con la consulta.',
  ];
  
  let resenasCount = 0;
  for (const cita of citasCompletadas.slice(0, 20)) {
    await prisma.resena.create({
      data: {
        idMedico: cita.idMedico,
        idPaciente: cita.idPaciente,
        idCita: cita.id,
        calificacion: 3 + Math.floor(Math.random() * 3), // 3-5
        comentario: comentarios[Math.floor(Math.random() * comentarios.length)],
        estado: 'APROBADA',
        verificada: true,
      }
    });
    resenasCount++;
  }
  console.log(`   ✅ ${resenasCount} reseñas creadas`);

  // ============================================
  // NOTIFICACIONES (30)
  // ============================================
  console.log('🔔 Creando notificaciones...');
  const usuarios = await prisma.usuario.findMany({ take: 30 });
  let notiCount = 0;
  for (const usuario of usuarios) {
    await prisma.notificacion.create({
      data: {
        idUsuario: usuario.id,
        tipo: ['CORREO', 'EN_APP'][Math.floor(Math.random() * 2)],
        asunto: 'Recordatorio de cita',
        mensaje: 'Tienes una cita programada próximamente.',
        estado: ['ENVIADA', 'PENDIENTE'][Math.floor(Math.random() * 2)],
      }
    });
    notiCount++;
  }
  console.log(`   ✅ ${notiCount} notificaciones creadas`);

  console.log('\n✨ ¡Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log('   - 15 Especialidades');
  console.log('   - 15 Médicos');
  console.log('   - 20 Pacientes');
  console.log('   - 45 Disponibilidades');
  console.log('   - 30 Citas');
  console.log('   - 20 Consultas');
  console.log('   - 25 Pagos');
  console.log('   - 20 Reseñas');
  console.log('   - 30 Notificaciones');
  console.log('\n🔑 Credenciales de prueba:');
  console.log('   Médico: dr.garcia@medconsult.com / Password123!');
  console.log('   Paciente: paciente1@gmail.com / Password123!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
