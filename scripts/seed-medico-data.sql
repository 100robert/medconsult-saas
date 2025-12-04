-- Script para crear datos de prueba para citas
-- Ejecutar con: psql -U postgres -d medconsult_db -f scripts/seed-medico-data.sql

-- 1. Crear especialidad si no existe
INSERT INTO especialidades (id, nombre, descripcion, activa, "fechaCreacion", "fechaActualizacion")
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Medicina General',
  'Atención médica primaria y preventiva',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (nombre) DO NOTHING;

-- Obtener el ID de la especialidad (por si ya existía con otro ID)
DO $$
DECLARE
  v_especialidad_id UUID;
  v_usuario_medico_id UUID;
  v_medico_id UUID;
  v_paciente_id UUID;
  v_usuario_paciente_id UUID;
BEGIN
  -- Obtener ID de especialidad
  SELECT id INTO v_especialidad_id FROM especialidades WHERE nombre = 'Medicina General' LIMIT 1;
  
  -- Obtener usuario médico
  SELECT id INTO v_usuario_medico_id FROM usuarios WHERE rol = 'MEDICO' LIMIT 1;
  
  IF v_usuario_medico_id IS NULL THEN
    RAISE NOTICE 'No hay usuarios con rol MEDICO';
    RETURN;
  END IF;
  
  -- Verificar si ya existe perfil de médico para este usuario
  SELECT id INTO v_medico_id FROM medicos WHERE "idUsuario" = v_usuario_medico_id;
  
  IF v_medico_id IS NULL THEN
    -- Crear perfil de médico
    INSERT INTO medicos (
      id, "idUsuario", "numeroLicencia", "idEspecialidad",
      "aniosExperiencia", biografia, "precioPorConsulta", moneda,
      "duracionConsulta", estado, "aceptaNuevosPacientes",
      "fechaCreacion", "fechaActualizacion"
    )
    VALUES (
      gen_random_uuid(),
      v_usuario_medico_id,
      'LIC-' || SUBSTRING(v_usuario_medico_id::text, 1, 8),
      v_especialidad_id,
      5,
      'Médico general con experiencia en atención primaria',
      50.00,
      'USD',
      30,
      'VERIFICADO',
      true,
      NOW(),
      NOW()
    )
    RETURNING id INTO v_medico_id;
    
    RAISE NOTICE 'Perfil de médico creado: %', v_medico_id;
  ELSE
    RAISE NOTICE 'Perfil de médico ya existe: %', v_medico_id;
  END IF;
  
  -- Obtener usuario paciente (Carlos que usamos para login)
  SELECT id INTO v_usuario_paciente_id FROM usuarios WHERE correo = 'carlos@ejemplo.com' LIMIT 1;
  
  IF v_usuario_paciente_id IS NOT NULL THEN
    -- Verificar si ya existe perfil de paciente
    SELECT id INTO v_paciente_id FROM pacientes WHERE "idUsuario" = v_usuario_paciente_id;
    
    IF v_paciente_id IS NULL THEN
      INSERT INTO pacientes (
        id, "idUsuario", "fechaCreacion", "fechaActualizacion"
      )
      VALUES (
        gen_random_uuid(),
        v_usuario_paciente_id,
        NOW(),
        NOW()
      )
      RETURNING id INTO v_paciente_id;
      
      RAISE NOTICE 'Perfil de paciente creado: %', v_paciente_id;
    ELSE
      RAISE NOTICE 'Perfil de paciente ya existe: %', v_paciente_id;
    END IF;
  END IF;
  
  -- Mostrar resumen
  RAISE NOTICE '=== RESUMEN ===';
  RAISE NOTICE 'Especialidad ID: %', v_especialidad_id;
  RAISE NOTICE 'Médico ID: %', v_medico_id;
  RAISE NOTICE 'Paciente ID: %', v_paciente_id;
END $$;

-- Mostrar datos creados
SELECT 'ESPECIALIDADES' as tabla, id::text, nombre as info FROM especialidades LIMIT 3;
SELECT 'MEDICOS' as tabla, id::text, estado::text as info FROM medicos LIMIT 3;
SELECT 'PACIENTES' as tabla, id::text, "idUsuario"::text as info FROM pacientes LIMIT 3;
