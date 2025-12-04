-- Actualizar usuario admin con contraseña correcta
UPDATE usuarios 
SET "hashContrasena" = '$2b$12$CINpWsg8K/keFrdi23twt.YbDtL3CZGg3zpOBy.QP09NZxJEhwcG6',
    rol = 'ADMIN',
    "correoVerificado" = true,
    activo = true
WHERE correo = 'admin@medconsult.com';

-- Verificar el resultado
SELECT id, correo, nombre, apellido, rol, activo, "correoVerificado" 
FROM usuarios 
WHERE correo = 'admin@medconsult.com';
