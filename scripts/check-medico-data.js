const { PrismaClient } = require('../services/auth-service/node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Buscar la médica
    const medico = await prisma.medico.findFirst({
        where: {
            usuario: {
                correo: 'dra.rodriguez@medconsult.com'
            }
        },
        include: {
            usuario: {
                select: { nombre: true, apellido: true, correo: true }
            }
        }
    });

    console.log('\n=== MEDICO ===');
    console.log(JSON.stringify(medico, null, 2));

    if (!medico) {
        console.log('Médico no encontrado');
        return;
    }

    // 2. Buscar CONSULTAS de este médico
    const consultas = await prisma.consulta.findMany({
        where: {
            cita: {
                idMedico: medico.id
            }
        },
        include: {
            cita: {
                include: {
                    paciente: {
                        include: {
                            usuario: {
                                select: { nombre: true, apellido: true }
                            }
                        }
                    }
                }
            },
            recetas: true
        }
    });

    console.log('\n=== CONSULTAS ===');
    console.log('Total:', consultas.length);
    console.log(JSON.stringify(consultas, null, 2));

    // 3. Buscar CITAS de este médico
    const citas = await prisma.cita.findMany({
        where: {
            idMedico: medico.id,
            estado: { not: 'CANCELADA' }
        },
        include: {
            paciente: {
                include: {
                    usuario: { select: { nombre: true, apellido: true } }
                }
            }
        }
    });

    console.log('\n=== CITAS ===');
    console.log('Total:', citas.length);
    console.log(JSON.stringify(citas, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
