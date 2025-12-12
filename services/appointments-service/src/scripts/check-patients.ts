
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- APPOINTMENTS SERVICE DB CHECK ---');
        const count = await prisma.paciente.count();
        console.log(`Total patients in DB: ${count}`);

        // In appointments-service, Paciente might not have 'usuario' relation included if schema is different?
        // Let's check schema first. Schema says Paciente has usuario relation.
        // But usuario is another model.

        const patients = await prisma.paciente.findMany();

        console.log('Patients IDs in Appointments Service:');
        patients.forEach(p => {
            console.log(`- ID: ${p.id}, UserID: ${p.idUsuario}`);
        });
        console.log('-------------------------------------');

    } catch (error) {
        console.error('Error querying DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
