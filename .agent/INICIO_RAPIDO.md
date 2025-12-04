# 🚀 MedConsult SaaS - Guía Rápida de Inicio

## 📋 Checklist Previo

Antes de empezar, asegúrate de tener instalado:

- [ ] **Node.js 18+** y **npm**
- [ ] **Docker Desktop** (para PostgreSQL, RabbitMQ, Redis)
- [ ] **Git**

---

## ⚡ Inicio Rápido (3 Pasos)

### 1️⃣ **Instalar dependencias**

```bash
# Instalar dependencias del root
npm install

# Instalar dependencias del Gateway
cd gateway
npm install
cd ..

# Instalar dependencias de cada servicio
cd services/auth-service
npm install
cd ../..

# Instalar dependencias del frontend
cd frontend
npm install
cd ..
```

**Tip**: Esto puede tomar varios minutos. Mientras se instala, puedes revisar la arquitectura en `.agent/ARQUITECTURA.md`

---

### 2️⃣ **Iniciar la infraestructura (Docker)**

```bash
# Iniciar PostgreSQL, RabbitMQ y Redis
docker-compose up -d

# Verificar que estén corriendo
docker-compose ps
```

Deberías ver:
- ✅ `medconsult-postgres` - PostgreSQL (Puerto 5432)
- ✅ `medconsult-rabbitmq` - RabbitMQ (Puertos 5672, 15672)
- ✅ `medconsult-redis` - Redis (Puerto 6379)

---

### 3️⃣ **Ejecutar migraciones de Prisma**

```bash
# Ir al servicio de autenticación
cd services/auth-service

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones (crear tablas)
npx prisma migrate dev

# Volver al root
cd ../..
```

Repetir para cada servicio que use base de datos:
- `services/users-service`
- `services/appointments-service`
- `services/consultations-service`
- `services/payments-service`
- `services/notifications-service`
- `services/reviews-service`
- `services/audit-service`

---

## 🎯 Ejecutar el Proyecto

### Opción A: Todo en uno (Recomendado)

**Terminal 1 - Backend (Gateway + 8 Microservicios)**:
```bash
npm run dev
```

Esto ejecutará en paralelo:
- 🌐 Gateway (puerto 3000)
- 🔐 Auth Service (puerto 3001)
- 👤 Users Service (puerto 3002)
- 📅 Appointments Service (puerto 3003)
- 🩺 Consultations Service (puerto 3004)
- 💳 Payments Service (puerto 3005)
- 🔔 Notifications Service (puerto 3006)
- ⭐ Reviews Service (puerto 3007)
- 📊 Audit Service (puerto 3008)

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Esto ejecutará:
- 🎨 Frontend Next.js (puerto 3010)

---

### Opción B: Individual (Para desarrollo específico)

**Solo Gateway + Auth** (mínimo para hacer login):
```bash
npm run dev:backend
```

**Frontend**:
```bash
cd frontend
npm run dev
```

**Un servicio específico**:
```bash
# Auth
npm run dev:auth

# Users
npm run dev:users

# Appointments
npm run dev:appointments
```

---

## 🌐 Acceder a la Aplicación

Una vez todo esté corriendo:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| 🎨 **Frontend** | http://localhost:3010 | Interfaz de usuario |
| 🌐 **API Gateway** | http://localhost:3000 | API principal |
| 🔐 **Auth Service** | http://localhost:3001 | Autenticación |
| 🐰 **RabbitMQ UI** | http://localhost:15672 | Management UI (user: `medconsult_user`, pass: `medconsult_password_dev`) |

---

## 🧪 Probar la API

### Usando el navegador:

**1. Health check del Gateway**:
```
http://localhost:3000/health
```

**2. Ver estado de todos los servicios**:
```
http://localhost:3000/api/health/services
```

**3. Info del Gateway**:
```
http://localhost:3000/
```

### Usando Postman/Thunder Client:

**Registro de usuario**:
```
POST http://localhost:3000/api/auth/register

Body (JSON):
{
  "correo": "paciente@test.com",
  "contrasena": "Password123!",
  "nombre": "Juan",
  "apellido": "Pérez"
}
```

**Login**:
```
POST http://localhost:3000/api/auth/login

Body (JSON):
{
  "correo": "paciente@test.com",
  "contrasena": "Password123!"
}
```

Respuesta:
```json
{
  "success": true,
  "data": {
    "usuario": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Obtener perfil** (requiere token):
```
GET http://localhost:3000/api/auth/profile

Headers:
Authorization: Bearer <accessToken>
```

---

## 🐛 Resolución de Problemas

### ❌ Error: "No se pudo conectar a PostgreSQL"

**Solución**:
```bash
# Verificar que Docker esté corriendo
docker-compose ps

# Si no está corriendo
docker-compose up -d

# Ver logs de PostgreSQL
docker-compose logs postgres
```

---

### ❌ Error: "Port 3000 already in use"

**Solución**:
```bash
# Windows - Matar proceso en puerto 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O cambiar el puerto en gateway/.env
PORT=3100
```

---

### ❌ Error: "Prisma Client not generated"

**Solución**:
```bash
cd services/auth-service
npx prisma generate
cd ../..
```

---

### ❌ Frontend no conecta con backend

**Verificar**:
1. Que el Gateway esté corriendo en puerto 3000
2. Que el frontend use `NEXT_PUBLIC_API_URL=http://localhost:3000/api`
3. Que CORS esté configurado correctamente en el Gateway

---

### ❌ Error 401 Unauthorized

**Verificar**:
1. Que el token JWT se esté enviando en el header `Authorization: Bearer <token>`
2. Que el `JWT_SECRET` sea el mismo en Gateway y Auth Service
3. Que el token no haya expirado

---

## 📝 Comandos Útiles

### Docker

```bash
# Iniciar contenedores
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f postgres

# Parar contenedores
docker-compose down

# Parar y eliminar volúmenes (⚠️ BORRA DATOS)
docker-compose down -v
```

### Prisma

```bash
# Generar cliente
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Abrir Prisma Studio (UI para ver DB)
npx prisma studio

# Reset database (⚠️ BORRA DATOS)
npx prisma migrate reset
```

### NPM

```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Ver procesos corriendo
npx kill-port 3000  # Matar puerto específico
```

---

## 🎓 Flujo de Desarrollo Típico

### 1. **Iniciar sesión de desarrollo**:
```bash
# Terminal 1: Iniciar Docker
docker-compose up -d

# Terminal 2: Iniciar backend
npm run dev

# Terminal 3: Iniciar frontend
cd frontend && npm run dev
```

### 2. **Hacer cambios en el código**:
- Los servicios se recargan automáticamente con `ts-node-dev`
- El frontend se recarga automáticamente con Next.js

### 3. **Ver logs**:
- Backend: Los logs aparecen en la terminal donde ejecutaste `npm run dev`
- Frontend: Logs en la terminal y en el navegador (consola)

### 4. **Probar cambios**:
- Usar el navegador para UI
- Usar Postman/Thunder Client para API

### 5. **Al terminar**:
```bash
# Ctrl+C en cada terminal

# Opcional: Apagar Docker
docker-compose down
```

---

## 📊 Base de Datos

### Ver datos en Prisma Studio:

```bash
cd services/auth-service
npx prisma studio
```

Se abrirá en http://localhost:5555

### Conectarse con cliente SQL:

**Credenciales**:
- Host: `localhost`
- Port: `5432`
- Database: `medconsult_db`
- User: `medconsult_user`
- Password: `medconsult_password_dev`

**Connection String**:
```
postgresql://medconsult_user:medconsult_password_dev@localhost:5432/medconsult_db
```

---

## 🧪 Testing

```bash
# Todos los tests
npm test

# Tests de un servicio específico
npm run test:auth

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

---

## 📚 Próximos Pasos

1. ✅ Lee la documentación completa en `.agent/ARQUITECTURA.md`
2. ✅ Explora el código de `auth-service` para entender la estructura
3. ✅ Prueba crear un usuario y hacer login desde el frontend
4. ✅ Explora los endpoints disponibles en el Gateway
5. ✅ Revisa el dashboard del frontend

---

## 🔗 Enlaces Útiles

- **Arquitectura Completa**: `.agent/ARQUITECTURA.md`
- **Prisma Docs**: https://www.prisma.io/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Express.js Docs**: https://expressjs.com/
- **Docker Compose**: https://docs.docker.com/compose/

---

## 💡 Tips

1. **Usa Prisma Studio** para ver y modificar datos fácilmente
2. **Lee los logs** - contienen información valiosa de errores
3. **Usa el health check** de servicios para ver qué está corriendo: `http://localhost:3000/api/health/services`
4. **Code with confidence** - TypeScript te ayudará a evitar errores
5. **Hot reload** está habilitado - solo guarda y los cambios se aplicarán automáticamente

---

**¡Listo para desarrollar! 🚀**

Si tienes problemas, revisa la sección de "Resolución de Problemas" o consulta la arquitectura completa.
