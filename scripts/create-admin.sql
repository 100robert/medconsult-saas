-- Crear usuario admin
-- La contraseña es: Admin123! (hasheada con bcrypt)
INSERT INTO "Usuario" (id, correo, contrasena, nombre, apellido, rol, "correoVerificado", activo, "fechaCreacion", "fechaActualizacion")
VALUES (
  gen_random_uuid(),
  'admin@medconsult.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X.VkJWZxyJpjHdS2W',
  'Admin',
  'Sistema',
  'ADMIN',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (correo) DO NOTHING;
