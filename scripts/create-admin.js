// Script para crear admin
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const prisma = new PrismaClient();
  
  try {
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    const admin = await prisma.usuario.create({
      data: {
        correo: 'admin@medconsult.com',
        contrasena: hashedPassword,
        nombre: 'Admin',
        apellido: 'Sistema',
        rol: 'ADMIN',
        correoVerificado: true,
        activo: true
      }
    });
    
    console.log('✅ Admin creado:', admin.correo);
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('ℹ️ Admin ya existe');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
