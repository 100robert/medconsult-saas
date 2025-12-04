# 🧪 MedConsult SaaS - Guía de Pruebas Prácticas

Esta guía te ayudará a probar el sistema paso a paso usando diferentes herramientas.

---

## 📋 Índice
1. [Preparación del Entorno](#preparación-del-entorno)
2. [Pruebas con el Navegador](#pruebas-con-el-navegador)
3. [Pruebas con Postman/Thunder Client](#pruebas-con-postmanthunder-client)
4. [Pruebas del Frontend](#pruebas-del-frontend)
5. [Verificación de Base de Datos](#verificación-de-base-de-datos)
6. [Casos de Prueba Importantes](#casos-de-prueba-importantes)

---

## ✅ Preparación del Entorno

### 1. Iniciar Infraestructura
```bash
# Terminal 1: Docker
docker-compose up -d

# Verificar que todo esté corriendo
docker-compose ps

# Deberías ver:
# ✅ medconsult-postgres
# ✅ medconsult-rabbitmq
# ✅ medconsult-redis
```

### 2. Ejecutar Migraciones
```bash
# Auth Service (mínimo requerido)
cd services/auth-service
npx prisma generate
npx prisma migrate dev
cd ../..

# Users Service (para médicos y pacientes)
cd services/users-service
npx prisma generate
npx prisma migrate dev
cd ../..

# Appointments Service (para citas)
cd services/appointments-service
npx prisma generate
npx prisma migrate dev
cd ../..
```

### 3. Iniciar Servicios
```bash
# Terminal 2: Backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

### 4. Verificar que todo funciona
```bash
# Cada servicio debería mostrar:
# ✅ Conexión a DB exitosa
# ✅ Servidor corriendo en puerto X
```

---

## 🌐 Pruebas con el Navegador

### 1. Health Check del Gateway
```
http://localhost:3000/health
```

**Respuesta esperada**:
```json
{
  "success": true,
  "message": "API Gateway is running",
  "timestamp": "2024-12-04T...",
  "environment": "development",
  "version": "1.0.0"
}
```

### 2. Estado de Todos los Servicios
```
http://localhost:3000/api/health/services
```

**Respuesta esperada**:
```json
{
  "success": true,
  "timestamp": "2024-12-04T...",
  "gateway": "healthy",
  "services": {
    "auth": {
      "name": "Auth Service",
      "status": "healthy",
      "statusCode": 200,
      "url": "http://localhost:3001"
    },
    "users": { ... },
    "appointments": { ... }
  }
}
```

✅ Todos los servicios deben estar **"healthy"**

### 3. Info del Gateway
```
http://localhost:3000/
```

**Respuesta esperada**:
```json
{
  "name": "MedConsult API Gateway",
  "version": "1.0.0",
  "description": "Plataforma de telemedicina SaaS",
  "endpoints": {
    "auth": "/api/auth",
    "usuarios": "/api/usuarios",
    "citas": "/api/citas",
    ...
  }
}
```

---

## 📮 Pruebas con Postman/Thunder Client

### Configuración Inicial

**Base URL**: `http://localhost:3000/api`

**Headers comunes**:
```
Content-Type: application/json
```

---

### Test 1: Registro de Paciente

**Request**:
```
POST http://localhost:3000/api/auth/register

Body (JSON):
{
  "correo": "paciente1@test.com",
  "contrasena": "Password123!",
  "nombre": "Juan",
  "apellido": "Pérez",
  "fechaNacimiento": "1990-01-15",
  "genero": "MASCULINO"
}
```

**Respuesta Esperada (201)**:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id": "uuid-aqui",
      "correo": "paciente1@test.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "PACIENTE",
      "correoVerificado": false,
      "activo": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**✅ Paso siguiente**: Guardar los tokens para usar en otras peticiones

---

### Test 2: Login

**Request**:
```
POST http://localhost:3000/api/auth/login

Body (JSON):
{
  "correo": "paciente1@test.com",
  "contrasena": "Password123!"
}
```

**Respuesta Esperada (200)**:
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "usuario": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

**Errores posibles**:
- **401**: Email o contraseña incorrectos
- **403**: Usuario inactivo
- **404**: Usuario no encontrado

---

### Test 3: Ver Perfil (Autenticado)

**Request**:
```
GET http://localhost:3000/api/auth/profile

Headers:
Authorization: Bearer <accessToken del login>
```

**Respuesta Esperada (200)**:
```json
{
  "success": true,
  "data": {
    "usuario": {
      "id": "...",
      "correo": "paciente1@test.com",
      "nombre": "Juan",
      "apellido": "Pérez",
      "rol": "PACIENTE",
      ...
    }
  }
}
```

**Error esperado sin token**:
- **401**: No token provided

---

### Test 4: Actualizar Perfil

**Request**:
```
PUT http://localhost:3000/api/auth/profile

Headers:
Authorization: Bearer <accessToken>

Body (JSON):
{
  "nombre": "Juan Carlos",
  "telefono": "+57 300 1234567"
}
```

**Respuesta Esperada (200)**:
```json
{
  "success": true,
  "data": {
    "usuario": {
      "nombre": "Juan Carlos",
      "telefono": "+57 300 1234567",
      ...
    }
  }
}
```

---

### Test 5: Crear Médico (Solo Admin)

**Pre-requisito**: Necesitas estar logueado como ADMIN.

**Opción 1**: Crear un admin manualmente en la base de datos.

**Opción 2**: Usar Prisma Studio para cambiar el rol de un usuario existente.

```bash
cd services/auth-service
npx prisma studio
```

- Ir a tabla `Usuario`
- Editar un usuario
- Cambiar `rol` a `ADMIN`
- Guardar

**Request**:
```
POST http://localhost:3000/api/auth/admin/create-user

Headers:
Authorization: Bearer <accessToken de un ADMIN>

Body (JSON):
{
  "correo": "doctor1@medconsult.com",
  "contrasena": "Doctor123!",
  "nombre": "María",
  "apellido": "García",
  "rol": "MEDICO",
  "correoVerificado": true,
  "activo": true
}
```

**Respuesta Esperada (201)**:
```json
{
  "success": true,
  "message": "Usuario creado exitosamente",
  "data": {
    "usuario": {
      "id": "...",
      "correo": "doctor1@medconsult.com",
      "nombre": "María",
      "rol": "MEDICO",
      "correoVerificado": true
    }
  }
}
```

**Error si no eres ADMIN**:
- **403**: Forbidden - Insufficient permissions

---

### Test 6: Listar Médicos

**Request**:
```
GET http://localhost:3000/api/medicos

Headers:
Authorization: Bearer <accessToken>
```

**Respuesta Esperada (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "usuario": {
        "nombre": "María",
        "apellido": "García"
      },
      "especialidad": "Medicina General",
      "numeroLicencia": "12345",
      "activo": true
    }
  ]
}
```

---

### Test 7: Ver Disponibilidad de Médico

**Request**:
```
GET http://localhost:3000/api/medicos/:medicoId/disponibilidad?fecha=2024-12-10

Headers:
Authorization: Bearer <accessToken>
```

**Respuesta Esperada (200)**:
```json
{
  "success": true,
  "data": {
    "fecha": "2024-12-10",
    "horarios": [
      {
        "hora": "09:00",
        "disponible": true
      },
      {
        "hora": "10:00",
        "disponible": true
      },
      {
        "hora": "11:00",
        "disponible": false
      }
    ]
  }
}
```

---

### Test 8: Crear Cita

**Request**:
```
POST http://localhost:3000/api/citas

Headers:
Authorization: Bearer <accessToken de un PACIENTE>

Body (JSON):
{
  "medicoId": "uuid-del-medico",
  "fechaHora": "2024-12-10T09:00:00Z",
  "motivoConsulta": "Consulta general - dolor de cabeza"
}
```

**Respuesta Esperada (201)**:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "pacienteId": "...",
    "medicoId": "...",
    "fechaHora": "2024-12-10T09:00:00Z",
    "estado": "PENDIENTE",
    "motivoConsulta": "Consulta general - dolor de cabeza"
  }
}
```

**Errores posibles**:
- **400**: Horario no disponible
- **400**: Fecha ya pasada
- **403**: Solo pacientes pueden crear citas

---

### Test 9: Listar Mis Citas

**Request**:
```
GET http://localhost:3000/api/citas

Headers:
Authorization: Bearer <accessToken>
```

**Respuesta Esperada (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "fechaHora": "2024-12-10T09:00:00Z",
      "estado": "PENDIENTE",
      "motivoConsulta": "...",
      "medico": {
        "nombre": "María",
        "apellido": "García",
        "especialidad": "Medicina General"
      }
    }
  ]
}
```

---

### Test 10: Refresh Token

**Request**:
```
POST http://localhost:3000/api/auth/refresh-token

Body (JSON):
{
  "refreshToken": "<refreshToken del login>"
}
```

**Respuesta Esperada (200)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "nuevo-access-token",
    "refreshToken": "nuevo-refresh-token",
    "usuario": { ... }
  }
}
```

---

## 🎨 Pruebas del Frontend

### 1. Landing Page
```
http://localhost:3010
```

**Verificar**:
- ✅ Diseño atractivo
- ✅ Botones de login y registro funcionan
- ✅ Animaciones suaves

### 2. Página de Registro
```
http://localhost:3010/register
```

**Flujo de prueba**:
1. Llenar formulario con datos válidos
2. Clic en "Registrarse"
3. Verificar que:
   - ✅ Se muestra mensaje de éxito
   - ✅ Redirige a `/dashboard`
   - ✅ Muestra nombre del usuario en sidebar

**Validaciones a probar**:
- ❌ Email inválido → Muestra error
- ❌ Contraseña débil → Muestra error
- ❌ Email duplicado → Muestra error del backend

### 3. Página de Login
```
http://localhost:3010/login
```

**Flujo de prueba**:
1. Usar credenciales del usuario registrado
2. Clic en "Iniciar Sesión"
3. Verificar:
   - ✅ Redirige a `/dashboard`
   - ✅ Muestra datos del usuario

**Errores a probar**:
- ❌ Email incorrecto → Mensaje de error
- ❌ Contraseña incorrecta → Mensaje de error

### 4. Dashboard
```
http://localhost:3010/dashboard
```

**Verificar**:
- ✅ Sidebar con navegación
- ✅ Cards con estadísticas (si hay datos)
- ✅ Botón de logout funciona
- ✅ Gráficos se renderizan correctamente

### 5. Crear Cita
```
http://localhost:3010/dashboard/appointments
```

**Flujo de prueba**:
1. Clic en "Nueva Cita"
2. Seleccionar médico
3. Seleccionar fecha y hora
4. Llenar motivo de consulta
5. Clic en "Agendar"
6. Verificar:
   - ✅ Modal de confirmación
   - ✅ Cita aparece en la lista
   - ✅ Estado es "PENDIENTE"

### 6. Ver Perfil
```
http://localhost:3010/dashboard/profile
```

**Verificar**:
- ✅ Muestra datos del usuario
- ✅ Permite editar campos
- ✅ Botón "Guardar" actualiza los datos

### 7. Logout
Click en botón de logout en cualquier página del dashboard

**Verificar**:
- ✅ Redirige a `/login`
- ✅ No puede acceder a `/dashboard` sin login
- ✅ Cookies eliminadas

---

## 🔍 Verificación de Base de Datos

### Usando Prisma Studio

```bash
cd services/auth-service
npx prisma studio
```

Se abrirá en `http://localhost:5555`

**Verificar tablas**:

1. **Usuario**
   - ✅ Usuarios creados con registro
   - ✅ Contraseñas hasheadas (no en texto plano)
   - ✅ Roles correctos (PACIENTE, MEDICO, ADMIN)

2. **RefreshToken**
   - ✅ Tokens guardados al hacer login
   - ✅ Expiración configurada (7 días)

3. **Cita** (si creaste citas)
   - ✅ Citas con estado correcto
   - ✅ Relaciones correctas (pacienteId, medicoId)

### Usando Cliente SQL

**Connection String**:
```
postgresql://medconsult_user:medconsult_password_dev@localhost:5432/medconsult_db
```

**Queries útiles**:

```sql
-- Ver todos los usuarios
SELECT * FROM "Usuario";

-- Ver citas con información de paciente y médico
SELECT 
  c.id,
  c."fechaHora",
  c.estado,
  p.nombre AS paciente_nombre,
  m.nombre AS medico_nombre
FROM "Cita" c
JOIN "Usuario" p ON c."pacienteId" = p.id
JOIN "Usuario" m ON c."medicoId" = m.id;

-- Ver tokens de refresh activos
SELECT * FROM "RefreshToken" WHERE revocado = false;
```

---

## ✅ Casos de Prueba Importantes

### Caso 1: Autenticación Completa
1. ✅ Registrar usuario
2. ✅ Hacer login
3. ✅ Ver perfil
4. ✅ Actualizar perfil
5. ✅ Hacer logout
6. ✅ Volver a hacer login

### Caso 2: Flujo de Cita Completa
1. ✅ Login como paciente
2. ✅ Ver médicos disponibles
3. ✅ Seleccionar médico y ver disponibilidad
4. ✅ Crear cita
5. ✅ Ver mis citas
6. ✅ Login como médico (si tienes uno)
7. ✅ Ver citas pendientes
8. ✅ Confirmar cita
9. ✅ Iniciar consulta
10. ✅ Completar consulta

### Caso 3: Manejo de Errores
1. ❌ Intentar login con email incorrecto
2. ❌ Intentar acceder a ruta protegida sin token
3. ❌ Intentar crear médico sin ser admin
4. ❌ Intentar crear cita en fecha pasada
5. ❌ Intentar crear cita en horario ocupado

### Caso 4: Refresh Token
1. ✅ Hacer login y guardar tokens
2. ✅ Esperar a que access token expire (o modificar manualmente)
3. ✅ Hacer petición que devuelva 401
4. ✅ Verificar que frontend renueva token automáticamente
5. ✅ Petición original se completa exitosamente

### Caso 5: Roles y Permisos
1. ✅ Login como PACIENTE → No puede acceder a `/dashboard/doctors`
2. ✅ Login como MEDICO → Puede ver sus citas pero no crear médicos
3. ✅ Login como ADMIN → Puede crear médicos

---

## 📊 Checklist de Verificación Final

### Backend
- [ ] Docker corriendo (PostgreSQL, RabbitMQ, Redis)
- [ ] Gateway corriendo en puerto 3000
- [ ] Auth Service corriendo en puerto 3001
- [ ] Users Service corriendo en puerto 3002
- [ ] Appointments Service corriendo en puerto 3003
- [ ] Health checks retornan 200
- [ ] Todas las migraciones aplicadas

### Frontend
- [ ] Next.js corriendo en puerto 3010
- [ ] Landing page carga correctamente
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Dashboard carga
- [ ] Sidebar navega correctamente
- [ ] Logout funciona

### Base de Datos
- [ ] PostgreSQL accesible
- [ ] Tablas creadas correctamente
- [ ] Relaciones funcionan
- [ ] Prisma Studio abre

### Seguridad
- [ ] Contraseñas hasheadas en DB
- [ ] JWT tokens válidos
- [ ] CORS configurado
- [ ] Rate limiting funciona
- [ ] Rutas protegidas verifican token

---

## 🐛 Problemas Comunes

### "Cannot connect to backend"
```bash
# Verificar que Gateway esté corriendo
curl http://localhost:3000/health

# Ver logs del Gateway
# (en la terminal donde corre npm run dev)
```

### "Database connection error"
```bash
# Verificar PostgreSQL
docker-compose ps postgres

# Ver logs
docker-compose logs postgres

# Reiniciar
docker-compose restart postgres
```

### "Token expired"
```bash
# Hacer logout y login de nuevo
# O usar el refresh token
```

### "Port already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 📚 Recursos Adicionales

- **Postman Collection**: Puedes crear una collection para reutilizar las peticiones
- **Environment Variables**: Configura variables para `baseUrl`, `accessToken`, etc.
- **Tests Automatizados**: Revisar carpeta `tests/` en cada servicio

---

## 🎯 Siguiente Paso

Una vez que hayas probado todo esto, puedes:

1. **Crear datos de prueba** con Prisma Studio
2. **Implementar nuevas features**
3. **Hacer tests unitarios** con Jest
4. **Preparar para producción**

---

**¡Buena suerte con las pruebas! 🚀**
