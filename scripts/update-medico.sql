-- Actualizar contraseña del médico para pruebas
-- Credenciales: dr.garcia@medconsult.com / Medico123!

UPDATE usuarios 
SET "hashContrasena" = '$2b$10$aUfgWovSOOVxiCZSbAj7GeXFIIuSmiRZ95lBpaFwuPBZX9vteiPEm'
WHERE correo = 'dr.garcia@medconsult.com';

-- Verificar que se actualizó
SELECT correo, nombre, apellido, rol, activo 
FROM usuarios 
WHERE correo = 'dr.garcia@medconsult.com';
