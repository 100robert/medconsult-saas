import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('=== Verificando citas en la base de datos ===\n');

    // Contar total de citas
    const totalCitas = await prisma.cita.count();
    console.log(`Total de citas: ${totalCitas}`);

    // Últimas 5 citas creadas
    const citas = await prisma.cita.findMany({
        take: 5,
        orderBy: { fechaCreacion: 'desc' },
        include: {
            paciente: {
                include: {
                    usuario: { select: { id: true, nombre: true, correo: true } }
                }
            },
            medico: {
                include: {
                    usuario: { select: { id: true, nombre: true } }
                }
            }
        }
    });

    console.log('\nÚltimas 5 citas:');
    citas.forEach((c, i) => {
        console.log(`\n${i + 1}. ID: ${c.id}`);
        console.log(`   Estado: ${c.estado}`);
        console.log(`   Fecha/Hora: ${c.fechaHoraCita}`);
        console.log(`   Paciente ID (perfil): ${c.idPaciente}`);
        console.log(`   Paciente Usuario ID: ${c.paciente?.usuario?.id || 'N/A'}`);
        console.log(`   Paciente Nombre: ${c.paciente?.usuario?.nombre || 'N/A'}`);
        console.log(`   Médico ID (perfil): ${c.idMedico}`);
        console.log(`   Médico Usuario ID: ${c.medico?.usuario?.id || 'N/A'}`);
        console.log(`   Médico Nombre: ${c.medico?.usuario?.nombre || 'N/A'}`);
    });

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    prisma.$disconnect();
});
