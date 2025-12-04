# 📚 MedConsult SaaS - Índice de Documentación

Bienvenido a la documentación completa de **MedConsult SaaS**. Esta carpeta contiene toda la información necesaria para entender, ejecutar, y desarrollar el proyecto.

---

## 🗂️ Documentos Disponibles

### 1. 📖 **RESUMEN_EJECUTIVO.md** - ¡EMPIEZA AQUÍ!
**Resumen general del proyecto completo**

**Contenido**:
- ✅ Estado general del proyecto
- ✅ Arquitectura de microservicios
- ✅ Tecnologías utilizadas (Backend, Frontend, Infraestructura)
- ✅ Todos los endpoints principales
- ✅ Configuración de seguridad
- ✅ Métricas del proyecto
- ✅ Próximos pasos sugeridos

**Ideal para**:
- Entender rápidamente qué hace el proyecto
- Ver todos los servicios disponibles
- Conocer los endpoints principales
- Obtener una visión completa en 10 minutos

**Lee esto primero** si es tu primera vez con el proyecto.

---

### 2. 🚀 **INICIO_RAPIDO.md**
**Guía paso a paso para ejecutar el proyecto**

**Contenido**:
- ✅ Checklist de requisitos previos
- ✅ Instalación de dependencias
- ✅ Configuración de Docker
- ✅ Ejecución de migraciones
- ✅ Cómo ejecutar backend y frontend
- ✅ Resolución de problemas comunes
- ✅ Comandos útiles (Docker, Prisma, NPM)

**Ideal para**:
- Primera vez ejecutando el proyecto
- Configurar el entorno de desarrollo
- Debugging de problemas comunes
- Ver comandos útiles

**Lee esto segundo** después del resumen ejecutivo.

---

### 3. 🏗️ **ARQUITECTURA.md**
**Documentación técnica completa de la arquitectura**

**Contenido**:
- ✅ Diagrama de arquitectura detallado
- ✅ Tecnologías utilizadas con detalles
- ✅ Estructura de cada microservicio
- ✅ Configuración del API Gateway
- ✅ Estructura del Frontend (Next.js)
- ✅ Comunicación entre servicios
- ✅ Infraestructura (Docker, PostgreSQL, RabbitMQ, Redis)
- ✅ Variables de entorno
- ✅ Seguridad implementada

**Ideal para**:
- Developers que van a modificar el código
- Entender cómo funcionan los microservicios
- Ver la estructura de carpetas
- Conocer las tecnologías en profundidad

**Lee esto** cuando necesites entender un componente específico.

---

### 4. 🔄 **FLUJOS_INTERACCION.md**
**Diagramas visuales de cómo fluyen las peticiones**

**Contenido**:
- ✅ Flujo de registro de paciente (paso a paso)
- ✅ Flujo de login con JWT
- ✅ Flujo de creación de cita
- ✅ Flujo de consulta médica
- ✅ Flujo de refresh token automático
- ✅ Flujo de registro de médico (admin)
- ✅ Diagrama completo del sistema
- ✅ Estados de citas
- ✅ Eventos con RabbitMQ

**Ideal para**:
- Entender la comunicación entre componentes
- Ver cómo se autentican las peticiones
- Debugging de flujos complejos
- Visualizar el sistema de forma clara

**Lee esto** cuando quieras entender cómo interactúan los servicios.

---

### 5. 🧪 **GUIA_PRUEBAS.md**
**Guía práctica para probar el sistema**

**Contenido**:
- ✅ Preparación del entorno
- ✅ Pruebas con navegador (health checks)
- ✅ Pruebas con Postman/Thunder Client
  - Registro, Login, Perfil
  - Crear médicos (admin)
  - Crear citas
  - Refresh tokens
- ✅ Pruebas del Frontend
- ✅ Verificación de base de datos (Prisma Studio)
- ✅ Casos de prueba importantes
- ✅ Checklist de verificación

**Ideal para**:
- Probar el sistema después de ejecutarlo
- Crear datos de prueba
- Verificar que todo funcione correctamente
- Debugging con Postman

**Lee esto** cuando quieras probar el sistema manualmente.

---

## 🎯 Ruta de Aprendizaje Sugerida

### 👤 Para Nuevos Desarrolladores

**Día 1**: Entender el proyecto
1. Lee **RESUMEN_EJECUTIVO.md** (15 min)
2. Lee **INICIO_RAPIDO.md** (10 min)
3. Ejecuta el proyecto siguiendo INICIO_RAPIDO.md (30 min)

**Día 2**: Probar el sistema
4. Lee **GUIA_PRUEBAS.md** (15 min)
5. Haz las pruebas básicas con Postman (30 min)
6. Explora el frontend (20 min)

**Día 3**: Entender la arquitectura
7. Lee **ARQUITECTURA.md** (30 min)
8. Revisa el código de `auth-service` (30 min)
9. Lee **FLUJOS_INTERACCION.md** (20 min)

**Día 4**: Empezar a desarrollar
10. Haz cambios pequeños en un servicio
11. Prueba tus cambios
12. Familiarízate con Prisma Studio

---

### 💼 Para Project Managers / Stakeholders

**Solo necesitas leer**:
1. **RESUMEN_EJECUTIVO.md** - Para entender el proyecto completo
2. **FLUJOS_INTERACCION.md** - Para ver cómo funciona visualmente

---

### 🔧 Para DevOps / SysAdmins

**Lectura recomendada**:
1. **INICIO_RAPIDO.md** - Instalación y configuración
2. **ARQUITECTURA.md** - Infraestructura y servicios
3. Sección de Docker en INICIO_RAPIDO.md

---

## 📂 Estructura del Proyecto

```
medconsult-saas/
├── .agent/                         # 📚 Esta carpeta
│   ├── README.md                   # Este archivo
│   ├── RESUMEN_EJECUTIVO.md        # 👈 EMPIEZA AQUÍ
│   ├── INICIO_RAPIDO.md            # Guía de instalación
│   ├── ARQUITECTURA.md             # Documentación técnica
│   ├── FLUJOS_INTERACCION.md       # Diagramas de flujo
│   └── GUIA_PRUEBAS.md             # Guía de testing
│
├── frontend/                       # Frontend Next.js
├── gateway/                        # API Gateway
├── services/                       # 8 Microservicios
│   ├── auth-service/
│   ├── users-service/
│   ├── appointments-service/
│   ├── consultations-service/
│   ├── payments-service/
│   ├── notifications-service/
│   ├── reviews-service/
│   └── audit-service/
│
├── shared/                         # Código compartido
├── docker-compose.yml              # Infraestructura
└── package.json                    # Scripts root
```

---

## 🔗 Links Rápidos

### Documentación

| Documento | Propósito | Tiempo Lectura |
|-----------|-----------|----------------|
| [RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md) | Visión general | 10 min |
| [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) | Setup inicial | 5 min |
| [ARQUITECTURA.md](./ARQUITECTURA.md) | Documentación técnica | 20 min |
| [FLUJOS_INTERACCION.md](./FLUJOS_INTERACCION.md) | Diagramas visuales | 15 min |
| [GUIA_PRUEBAS.md](./GUIA_PRUEBAS.md) | Testing manual | 10 min |

---

### Servicios (cuando estén corriendo)

| Servicio | URL Local | Descripción |
|----------|-----------|-------------|
| Frontend | http://localhost:3010 | Interfaz de usuario |
| Gateway | http://localhost:3000 | API principal |
| Auth Service | http://localhost:3001 | Autenticación |
| Users Service | http://localhost:3002 | Usuarios |
| Appointments | http://localhost:3003 | Citas |
| RabbitMQ UI | http://localhost:15672 | Message broker |
| Prisma Studio | http://localhost:5555 | Base de datos UI |

---

## 🆘 ¿Necesitas Ayuda?

### Problemas Comunes

**1. No puedo ejecutar el proyecto**
→ Lee [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) sección "Resolución de Problemas"

**2. No entiendo cómo funciona un flujo**
→ Lee [FLUJOS_INTERACCION.md](./FLUJOS_INTERACCION.md)

**3. Error en la base de datos**
→ Verifica Docker en [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)

**4. Error 401 / 403 en las peticiones**
→ Lee sección de Autenticación en [ARQUITECTURA.md](./ARQUITECTURA.md)

**5. Quiero agregar un nuevo endpoint**
→ Revisa la estructura en [ARQUITECTURA.md](./ARQUITECTURA.md) y mira ejemplos en `auth-service`

---

## 📝 Notas Importantes

### Variables de Entorno

Cada servicio necesita su archivo `.env`. Revisa los archivos `.env.example`:

```bash
# Example
gateway/.env
services/auth-service/.env
services/users-service/.env
frontend/.env.local
```

### Base de Datos

**Connection String**:
```
postgresql://medconsult_user:medconsult_password_dev@localhost:5432/medconsult_db
```

**Herramientas**:
- Prisma Studio: `npx prisma studio` (desde cualquier service)
- Cualquier cliente SQL (DBeaver, pgAdmin, etc.)

### Docker

**Iniciar**:
```bash
docker-compose up -d
```

**Ver logs**:
```bash
docker-compose logs -f
```

**Parar**:
```bash
docker-compose down
```

---

## 🎓 Recursos Externos

### Tecnologías Principales

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **Express**: https://expressjs.com/
- **Docker**: https://docs.docker.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **JWT**: https://jwt.io/

### Herramientas Recomendadas

- **Postman**: https://www.postman.com/
- **Thunder Client** (VS Code extension)
- **Prisma Studio**: Incluido con Prisma
- **Docker Desktop**: https://www.docker.com/products/docker-desktop

---

## ✅ Checklist de Documentación

Marca lo que ya hayas leído:

- [ ] RESUMEN_EJECUTIVO.md
- [ ] INICIO_RAPIDO.md
- [ ] ARQUITECTURA.md
- [ ] FLUJOS_INTERACCION.md
- [ ] GUIA_PRUEBAS.md

---

## 🚀 Estado del Proyecto

**Última actualización**: 2025-12-04

**Estado General**: ✅ **Funcionando y listo para desarrollo**

**Componentes**:
- ✅ Backend (9 servicios)
- ✅ Frontend (Next.js)
- ✅ Base de datos (PostgreSQL)
- ✅ Infraestructura (Docker)
- ✅ Autenticación (JWT)
- ✅ Tests (Jest configurado)

**Próximos pasos sugeridos**:
1. Implementar WebSockets para consultas en vivo
2. Agregar integración de pagos (Stripe)
3. Mejorar tests (aumentar coverage)
4. Preparar para producción (CI/CD)

---

## 📞 Contacto

Para dudas o sugerencias sobre la documentación, crea un issue en el repositorio.

---

**¡Feliz desarrollo! 🎉**
