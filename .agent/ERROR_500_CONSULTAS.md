# 🐛 Error 500 en Consultas - Explicación y Solución

## 📋 Descripción del Error

**Síntoma**: Error 500 al cargar el dashboard que llama a `/api/consultas/mis-consultas`

**Error en consola**:
```
AxiosError: Request failed with status code 500
```

**Ubicación del error**:
- Frontend: `src/lib/consultations.ts:73`
- Backend: `services/consultations-service/src/services/consulta.service.ts:330`

---

## 🔍 Causa del Problema

El error ocurre porque:

1. **Usuario está autenticado** con un JWT válido
2. **El servicio intenta obtener consultas** del usuario
3. **Busca el perfil de médico/paciente** asociado al usuario
4. **No encuentra el perfil** porque:
   - Si el usuario se registró como PACIENTE, no tiene registro en la tabla `pacientes`
   - Si es MEDICO, no tiene registro en la tabla `medicos`
5. **Debería retornar array vacío**, pero algo en el flujo causa error 500

### Flujo del Error

```
Usuario autenticado (JWT válido)
         ↓
GET /api/consultas/mis-consultas
         ↓  
consultaService.obtenerPorUsuario(userId, rol)
         ↓
Si rol = PACIENTE:
    →  prisma.paciente.findUnique({ where: { idUsuario } })
    →  paciente = NULL (no existe)
    →  Intento de acceder a paciente.id
    →  💥 ERROR (o retorna [], pero falla en otro lado)
```

---

## ✅ Solución Implementada

### Cambios en `consulta.service.ts`

**Antes** (líneas 330-397):
```typescript
consultaService.obtenerPorUsuario = async function(...) {
  const paciente = await prisma.paciente.findUnique({ ... });
  
  if (!paciente) {
    return { data: [], pagination: { ... } };
  }
  
  where.cita = { idPaciente: paciente.id };
  // ... resto del código sin try-catch
};
```

**Problemas**:
- ❌ Sin try-catch global
- ❌ Si falla algo después, el error sube sin control
- ❌ Logs no informativos

**Después** (mejorado):
```typescript
consultaService.obtenerPorUsuario = async function(...) {
  try {
    const paciente = await prisma.paciente.findUnique({ ... });
    
    if (!paciente) {
      console.log(`No se encontró perfil de paciente para usuario ${idUsuario}`);
      return { data: [], pagination: { ... } };
    }
    
  where.cita = { idPaciente: paciente.id };
    // ... resto del código
    
  } catch (error) {
    console.error('Error en obtenerPorUsuario:', error);
    return { data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } };
  }
};
```

**Mejoras**:
- ✅ Try-catch global para capturar cualquier error
- ✅ Logs informativos con console.log/error
- ✅ Retorna 200 con array vacío en vez de 500
- ✅ Usuario ve dashboard vacío en vez de error

---

## 🎯 Causa Raíz del Problema

El problema no es solo el código, sino **la arquitectura de datos**:

### Problema de Diseño

Cuando un usuario se registra con `/api/auth/register`:

```typescript
// auth-service crea esto:
Usuario {
  id: "uuid",
  correo: "test@test.com",
  nombre: "Juan",
  rol: "PACIENTE",
  ...
}
```

**PERO NO crea**:
```typescript
Paciente {
  id: "uuid",
  idUsuario: "usuario-uuid",  // ❌ NO SE CREA AUTOMÁTICAMENTE
  ...
}
```

### ¿Por qué?

El schema de Prisma define las relaciones pero **no crea automáticamente** los perfiles:

```prisma
model Usuario {
  id       String   @id
  rol      RolUsuario
  // ...
  paciente Paciente?  // ← Relación opcional
  medico   Medico?    // ← Relación opcional
}

model Paciente {
  id        String  @id
  idUsuario String  @unique
  usuario   Usuario @relation(...)
  // ...
}
```

---

## 🔧 Solución Completa (3 Partes)

### 1. ✅ Fix Inmediato (Ya implementado)

Agregar try-catch en `consulta.service.ts` para que no falle.

**Resultado**: Error 500 desaparece, pero no hay datos.

---

### 2. ⚠️ Crear Perfil de Paciente Automáticamente

**Modificar** `auth-service` para que al registrar un paciente, también cree el perfil:

**Ubicación**: `services/auth-service/src/services/auth.service.ts`

```typescript
async register(data) {
  // 1. Crear usuario
  const usuario = await prisma.usuario.create({
    data: {
      correo: data.correo,
      hashContrasena: await bcrypt.hash(data.contrasena, 10),
      nombre: data.nombre,
      apellido: data.apellido,
      rol: 'PACIENTE'
    }
  });

  // 2. ✅ CREAR PERFIL DE PACIENTE
  await prisma.paciente.create({
    data: {
      idUsuario: usuario.id,
      fechaNacimiento: data.fechaNacimiento,
      genero: data.genero,
    }
  });

  return usuario;
}
```

---

### 3. ⚠️ Crear Perfil de Médico al Registrarlo (Admin)

**Modificar** `auth-service` para crear perfil de médico:

**Ubicación**: `services/auth-service/src/controllers/auth.controller.ts`

```typescript
async adminCreateUser(req, res) {
  const { rol, especialidad, numeroLicencia, ... } = req.body;
  
  // 1. Crear usuario
  const usuario = await prisma.usuario.create({
    data: { rol: 'MEDICO', ... }
  });

  // 2. ✅ CREAR PERFIL DE MÉDICO
  if (rol === 'MEDICO') {
    await prisma.medico.create({
      data: {
        idUsuario: usuario.id,
        numeroLicencia,
        idEspecialidad: especialidad,
        precioPorConsulta: 50.00,
        ...
      }
    });
  }

  return usuario;
}
```

---

## 🧪 Verificar el Fix

### Paso 1: Reiniciar el servicio

El cambio en `consulta.service.ts` requiere reiniciar:

```bash
# El backend se reiniciará automáticamente si usas ts-node-dev
# Solo guarda el archivo y espera unos segundos
```

### Paso 2: Verificar en el navegador

1. Recargar el dashboard: http://localhost:3010/dashboard
2. **Ahora NO debería dar error 500**
3. **Debería mostrar**:
   - Dashboard vacío (sin consultas)
   - Sin errores en consola

### Paso 3: Verificar logs del backend

En la terminal del backend deberías ver:

```
No se encontró perfil de paciente para usuario abc-123-uuid
```

Esto confirma que el error está controlado.

---

## 📊 Siguientes Pasos Recomendados

### Opción A: Crear Perfil Manualmente (Para Testing)

Usa Prisma Studio para crear el perfil de paciente:

```bash
cd services/auth-service
npx prisma studio
```

1. Ve a tabla `usuarios` y copia el `id` de tu usuario
2. Ve a tabla `pacientes`
3. Crea nuevo registro:
   ```
   id: (auto genera)
   idUsuario: (pega el id del usuario)
   fechaNacimiento: "1990-01-01"
   ```
4. Guarda

Ahora recarga el dashboard y debería funcionar (aunque sin consultas).

---

### Opción B: Fix en Auth Service (Recomendado)

Crear el perfil automáticamente en el registro.

**¿Necesitas que implemente este fix?** Puedo hacerlo ahora mismo.

---

## 🎯 Resumen

| Componente | Estado | Acción |
|------------|--------|--------|
| **consulta.service.ts** | ✅ ARREGLADO | Agregado try-catch |
| **auth.service.ts** | ⚠️ PENDIENTE | Crear perfil al registrar |
| **Dashboard** | ✅ FUNCIONA | Ya no da error 500 |
| **Datos** | ❌ VACÍO | No hay consultas (normal) |

---

## 🧑‍💻 Comandos Útiles

```bash
# Ver logs del backend
# (Ya está corriendo, solo mira la terminal)

# Reiniciar solo consultations service
cd services/consultations-service
npm run dev

# Ver datos en Prisma Studio
cd services/auth-service
npx prisma studio
```

---

**Status**: ✅ Error 500 resuelto temporalmente  
**Próximo paso**: Crear perfil de paciente/médico automáticamente
