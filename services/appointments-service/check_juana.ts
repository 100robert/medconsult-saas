import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('=== Verificando citas de Juana ===\n');

    // Buscar usuario Juana
    const usuario = await prisma.usuario.findUnique({
        where: { correo: 'juana@gmail.com' },
        select: { id: true, nombre: true, correo: true }
    });

    console.log('Usuario encontrado:', usuario);

    if (!usuario) {
        console.log('No se encontró el usuario');
        return;
    }

    // Buscar perfil de paciente
    const paciente = await prisma.paciente.findUnique({
        where: { idUsuario: usuario.id },
        select: { id: true }
    });

    console.log('Paciente ID:', paciente?.id);

    if (!paciente) {
        console.log('No se encontró perfil de paciente');
        return;
    }

    // Buscar TODAS las citas de este paciente
    const citas = await prisma.cita.findMany({
        where: { idPaciente: paciente.id },
        orderBy: { fechaCreacion: 'desc' },
        select: {
            id: true,
            estado: true,
            fechaHoraCita: true,
            fechaCreacion: true,
            tipo: true,
            medico: {
                include: {
                    usuario: { select: { nombre: true } }
                }
            }
        }
    });

    console.log(`\nTotal citas de Juana: ${citas.length}`);
    console.log('\nDesglose por estado:');

    const porEstado = citas.reduce((acc: any, c) => {
        acc[c.estado] = (acc[c.estado] || 0) + 1;
        return acc;
    }, {});
    console.log(porEstado);

    console.log('\nÚltimas 10 citas:');
    citas.slice(0, 10).forEach((c, i) => {
        console.log(`${i + 1}. Estado: ${c.estado} | Fecha: ${c.fechaHoraCita} | Médico: ${c.medico?.usuario?.nombre}`);
    });

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    prisma.$disconnect();
});
