
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Checking database connection...');
        const count = await prisma.paciente.count();
        console.log(`Total patients in DB: ${count}`);

        const patients = await prisma.paciente.findMany({
            include: {
                usuario: {
                    select: { nombre: true, apellido: true }
                }
            }
        });

        console.log('Patients list:');
        patients.forEach(p => {
            console.log(`- ID: ${p.id}, Name: ${p.usuario.nombre} ${p.usuario.apellido}, UserID: ${p.idUsuario}`);
        });

    } catch (error) {
        console.error('Error querying DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
