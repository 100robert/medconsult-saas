const path = require('path');
process.chdir(path.join(__dirname, '..', 'shared'));
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== MÉDICOS EN LA BASE DE DATOS ===');
  const medicos = await prisma.medico.findMany();
  console.log('Médicos:', medicos.length);
  console.log(JSON.stringify(medicos, null, 2));
  
  console.log('\n=== USUARIOS CON ROL MEDICO ===');
  const usuariosMedicos = await prisma.usuario.findMany({
    where: { rol: 'MEDICO' }
  });
  console.log('Usuarios médicos:', usuariosMedicos.length);
  usuariosMedicos.forEach(u => {
    console.log(`- ${u.id}: ${u.nombre} ${u.apellido}`);
  });
  
  console.log('\n=== PACIENTES ===');
  const pacientes = await prisma.paciente.findMany();
  console.log('Pacientes:', pacientes.length);
  console.log(JSON.stringify(pacientes, null, 2));
  
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
});
