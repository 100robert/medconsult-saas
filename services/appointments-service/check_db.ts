
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const medicos = await prisma.medico.count();
        const disponibilidades = await prisma.disponibilidad.count();
        const citas = await prisma.cita.count();

        console.log('--- DB STATISTICS ---');
        console.log(`Medicos: ${medicos}`);
        console.log(`Disponibilidades: ${disponibilidades}`);
        console.log(`Citas: ${citas}`);
        console.log('---------------------');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
