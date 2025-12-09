-- Agregar columna esPro a pacientes
ALTER TABLE pacientes ADD COLUMN "esPro" BOOLEAN DEFAULT false;

-- Verificar que se agregó correctamente
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pacientes' AND column_name = 'esPro';
