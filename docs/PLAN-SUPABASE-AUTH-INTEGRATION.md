# Plan de Integración: Supabase Auth + Next.js + Cloudflare Workers

**Rama:** `feature/supabase-auth-integration-phase1`  
**Objetivo:** Transformar la landing page estática en una aplicación con autenticación básica y gestión de usuarios usando Supabase Auth directamente (sin ORM externo en esta fase) y Prisma para gestión de datos.

---

## 📋 Servidores MCP Disponibles y su Jurisdicción

| MCP                             | Propósito                                                                           | Restricción                    |
| ------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------ |
| **context7**                    | Documentación oficial de librerías (Next.js, Supabase, Resend, Stripe)              | NO examina código del proyecto |
| **supabase-lumiloops-oficial**  | Gestión/consultas administrativas en Supabase (tablas, usuarios, RLS, logs, tokens) | Limitado a operaciones admin   |
| **chrome-devtools**             | Depuración visual, estados auth, cookies, JWT en navegador                          | Solo desarrollo/testing        |
| **cloudflare-workers-bindings** | Manejo de variables de entorno y secrets en Workers                                 | Testing configuración y logs   |
| **github-lumiloops-oficial**    | Versionado, commits, push/pull de cambios                                           | Sincronización repositorio     |

---

## 🎯 Fases de Implementación

### **Fase 1: Preparativos y Variables de Entorno**

**Duración estimada:** 1-2 horas  
**Responsable:** Verificación y configuración inicial

#### Pasos:

1. **Auditar archivo `.env.local`**
   - Verificar presencia de:
     - `NEXT_PUBLIC_SUPABASE_URL` ✓
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✓
     - `SUPABASE_SERVICE_ROLE_KEY` ✓
     - `DATABASE_URL` (Connection Pooling) ✓
     - `DIRECT_DATABASE_URL` (para migraciones) ✓
   - **Herramienta MCP:** `supabase-lumiloops-oficial` para verificar que los valores sean válidos

2. **Crear/Actualizar `.dev.vars`**
   - Espejo de secretos para ambiente de desarrollo local
   - Incluir valores de Supabase y configuración de Workers
   - Ejemplo estructura:
     ```
     NEXT_PUBLIC_SUPABASE_URL=...
     NEXT_PUBLIC_SUPABASE_ANON_KEY=...
     SUPABASE_SERVICE_ROLE_KEY=...
     DATABASE_URL=...
     ```

3. **Validar `wrangler.toml`**
   - Confirmar compatibilidad con Next.js:
     ```toml
     compatibility_date = "2025-03-25"
     compatibility_flags = ["nodejs_compat"]
     ```
   - Revisar bindings de assets y variables
   - **Herramienta MCP:** `cloudflare-workers-bindings` para testear propagación

4. **Verificar Supabase Project Setup**
   - **Herramienta MCP:** `supabase-lumiloops-oficial`
   - Confirmar:
     - ✓ Auth habilitado (proveedor Email)
     - ✓ RLS activa en tablas
     - ✓ Tabla `auth.users` lista
     - ✓ Tabla `public.profiles` creada (si aplica)
     - ✓ Policies de seguridad configuradas

#### Entregable:

- [ ] `.env.local` verificado y documentado
- [ ] `.dev.vars` creado con variables de desarrollo
- [ ] `wrangler.toml` compatible con Workers
- [ ] Supabase Auth y RLS confirmados activos

---

### **Fase 2: Dependencias y Configuración de Adaptadores**

**Duración estimada:** 1-2 horas  
**Responsable:** Instalación y configuración

#### Pasos:

1. **Verificar/Instalar Dependencias Core**
   - **Herramienta MCP:** `context7` para documentación oficial
   - Librerías requeridas:
     ```json
     "@supabase/supabase-js": "^2.79.0"
     "@supabase/ssr": "^0.7.0"
     "@prisma/client": "^6.18.0"
     "prisma": "^6.18.0"
     "@opennextjs/cloudflare": "^1.11.0"
     ```
   - Estado: ✓ Ya instaladas en `package.json`

2. **Integrar Adaptador Cloudflare + Next.js**
   - Revisar `open-next.config.ts` (si existe)
   - Configurar routes y outputs según documentación
   - **Herramienta MCP:** `context7` para `@cloudflare/next-on-pages` o `@opennextjs/cloudflare`

3. **Validar Prisma Schema**
   - Revisar `prisma/schema.prisma`
   - Confirmar datasource para Supabase (PostgreSQL)
   - Modelo básico de `profiles` vinculado a `auth.uid()`
   - **Herramienta MCP:** `supabase-lumiloops-oficial` para RLS en tabla

4. **Generar/Ejecutar Migraciones Iniciales**

   ```bash
   npx prisma migrate dev --name init
   ```

   - Usar `DIRECT_DATABASE_URL` para migraciones
   - Verificar creación de tablas en Supabase

#### Entregable:

- [ ] Todas las dependencias instaladas (`npm list @supabase/* @prisma/*`)
- [ ] `open-next.config.ts` configurado correctamente
- [ ] Prisma schema validado
- [ ] Migraciones iniciales ejecutadas exitosamente

---

### **Fase 3: Clientes y Lógica de Autenticación**

**Duración estimada:** 2-3 horas  
**Responsable:** Implementación de clientes Supabase

#### Pasos:

1. **Crear Cliente Browser (`lib/supabase-browser.ts`)**
   - **Herramienta MCP:** `context7` para API `@supabase/supabase-js`
   - Uso: Client-side auth, queries con RLS
   - Funcionalidades:
     ```typescript
     - createClient() para instanciación
     - getSession() para obtener sesión actual
     - signUp(), signIn(), signOut()
     - onAuthStateChange() para suscripción
     ```
   - Almacenamiento de JWT en localStorage/cookie

2. **Crear Cliente Server (`lib/supabase-server.ts`)**
   - **Herramienta MCP:** `context7` para `@supabase/ssr` y SSR patterns
   - Uso: Server Actions, API routes, operaciones privilegiadas
   - Configuración:
     ```typescript
     - createServerClient() con cookieStore
     - service_role_key para operaciones admin
     - Manejo de cookies para persistencia
     ```

3. **Implementar Hook de Autenticación (`hooks/useAuth.ts`)**
   - **Herramienta MCP:** `context7` para React hooks patterns
   - Funcionalidades:
     ```typescript
     - useAuth(): { user, loading, signUp, signIn, signOut }
     - useAuthContext() para contexto global
     - manejo de refresh token automático
     - sincronización de sesión entre tabs
     ```
   - Context Provider (`AuthProvider.tsx`)

4. **Crear Componentes de Auth UI**
   - **Herramienta MCP:** `chrome-devtools` para testing de UI
   - Componentes:
     - `SignUpForm.tsx` (email, password, validación)
     - `SignInForm.tsx` (email, password, remember me)
     - `SignOutButton.tsx`
     - `AuthGuard.tsx` (protección de rutas)
   - Usar Zod para validación de schemas

5. **Actualizar Landing Page**
   - Agregar: "Sign In" / "Sign Up" buttons en navbar
   - Mostrar nombre/email del usuario si autenticado
   - Proteger secciones sensibles con `<AuthGuard>`

6. **Configurar Middleware de Autenticación (`middleware.ts`)**
   - **Herramienta MCP:** `context7` para Next.js middleware
   - Verificar sesión en cada request
   - Redirigir a login si token inválido
   - Mantener sesión persistente en Workers

#### Entregable:

- [ ] `lib/supabase-browser.ts` implementado
- [ ] `lib/supabase-server.ts` implementado
- [ ] `hooks/useAuth.ts` con Context creado
- [ ] Componentes UI de auth en `src/components/auth/`
- [ ] Landing page actualizada con controles auth
- [ ] `middleware.ts` configurado
- [ ] ✓ Testing en `chrome-devtools` (sesión, cookies, JWT)

---

### **Fase 4: Gestión de Datos con Supabase + Prisma**

**Duración estimada:** 2-3 horas  
**Responsable:** Integración de base de datos

#### Pasos:

1. **Definir Schema de Usuarios en Prisma**

   ```prisma
   model Profile {
     id        String   @id @db.Uuid
     email     String   @unique
     fullName  String?
     avatar    String?
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

   - Vinculado a `auth.users` de Supabase por `id`
   - **Herramienta MCP:** `supabase-lumiloops-oficial` para RLS

2. **Crear API Route para Operaciones de Perfil** (`/api/profile`)
   - **Herramienta MCP:** `context7` para Next.js API routes
   - Endpoints:
     - `GET /api/profile` - obtener perfil del usuario autenticado
     - `POST /api/profile` - crear perfil (post sign-up)
     - `PATCH /api/profile` - actualizar perfil
   - Usar cliente server para acceso a BD

3. **Implementar Lógica de Sign-Up con Perfil**
   - En hook `useAuth.ts`:
     ```typescript
     1. Llamar signUp() de Supabase Auth
     2. Esperar confirmación de email (si aplica)
     3. Crear registro en tabla `profiles` vía API
     4. Actualizar estado global de usuario
     ```
   - **Herramienta MCP:** `chrome-devtools` para verificar flujo

4. **Página de Perfil del Usuario** (`/dashboard/profile`)
   - Mostrar/editar información de perfil
   - Usar API routes del paso anterior
   - Protegida por `<AuthGuard>`

5. **Testing de Integridad de Datos**
   - **Herramienta MCP:** `supabase-lumiloops-oficial`
   - Verificar:
     - ✓ RLS en `profiles` tabla
     - ✓ Usuarios solo pueden ver/editar su propio perfil
     - ✓ Sincronización entre `auth.users` y `profiles`

#### Entregable:

- [ ] Schema Prisma con `Profile` model
- [ ] Migraciones Prisma ejecutadas
- [ ] API routes `/api/profile` implementadas
- [ ] Lógica de sign-up con creación de perfil
- [ ] Página `/dashboard/profile` creada
- [ ] ✓ RLS policies verificadas en Supabase
- [ ] ✓ Datos de test en BD

---

### **Fase 5: Despliegue y Validación en Workers**

**Duración estimada:** 1-2 horas  
**Responsable:** Testing y despliegue

#### Pasos:

1. **Validar Configuración de Variables en Workers**
   - **Herramienta MCP:** `cloudflare-workers-bindings`
   - Testing:
     ```bash
     wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts
     wrangler secret list
     ```
   - Confirmar que todos los secrets estén disponibles

2. **Build y Testing Local**

   ```bash
   npm run build
   npm run preview
   ```

   - Verificar que Next.js se compile correctamente para Workers
   - **Herramienta MCP:** `chrome-devtools` para testing E2E

3. **Testing de Autenticación en Producción**
   - Crear usuario de prueba
   - Flujo: sign-up → email verification → sign-in → create profile
   - Verificar persistencia de sesión en refresh
   - **Herramienta MCP:** `chrome-devtools` (cookies, tokens, storage)

4. **Inspección de Logs**
   - **Herramienta MCP:** `cloudflare-workers-bindings` para Worker logs
   - **Herramienta MCP:** `supabase-lumiloops-oficial` para BD logs
   - Buscar errores en:
     - Autenticación
     - Creación de perfiles
     - RLS violations

5. **Documentación Final**
   - README con instrucciones de setup
   - Guía de troubleshooting
   - Diagrama de flujo de autenticación

#### Entregable:

- [ ] Configuración de Workers validada
- [ ] Build exitoso sin errores
- [ ] Testing E2E completado (sign-up, sign-in, profile)
- [ ] ✓ Sesiones persistentes confirmadas
- [ ] ✓ Logs sin errores críticos
- [ ] Documentación de despliegue completada

---

## 🔒 Consideraciones de Seguridad

- [ ] **RLS Policies:** Tabla `profiles` con acceso solo a perfil propio
- [ ] **Secrets Management:** `SUPABASE_SERVICE_ROLE_KEY` nunca expuesto al cliente
- [ ] **JWT en Cookies:** Usar HTTP-only cookies en Server Actions
- [ ] **CORS:** Configurar correctamente para Workers domain
- [ ] **Rate Limiting:** Implementar en endpoints de auth (future phase)

---

## 📦 Entregables Totales

### Archivos Creados:

```
src/
├── components/
│   └── auth/
│       ├── SignUpForm.tsx
│       ├── SignInForm.tsx
│       ├── SignOutButton.tsx
│       └── AuthGuard.tsx
├── app/
│   ├── dashboard/
│   │   └── profile/
│   │       └── page.tsx
│   └── api/
│       └── profile/
│           ├── route.ts (GET, POST, PATCH)
├── hooks/
│   ├── useAuth.ts
│   └── AuthProvider.tsx
├── lib/
│   ├── supabase-browser.ts
│   ├── supabase-server.ts
│   └── auth-schemas.ts (Zod)
└── middleware.ts
```

### Archivos Modificados:

```
- .env.local (verificado)
- .dev.vars (creado)
- wrangler.toml (validado)
- package.json (dependencias verificadas)
- prisma/schema.prisma (schema actualizado)
- src/app/layout.tsx (AuthProvider agregado)
- src/components/navbar/Navbar.tsx (botones auth)
```

---

## 📅 Timeline Estimado

| Fase             | Horas     | Estado       |
| ---------------- | --------- | ------------ |
| 1: Preparativos  | 1-2h      | ⏳ Pendiente |
| 2: Dependencias  | 1-2h      | ⏳ Pendiente |
| 3: Autenticación | 2-3h      | ⏳ Pendiente |
| 4: Gestión Datos | 2-3h      | ⏳ Pendiente |
| 5: Despliegue    | 1-2h      | ⏳ Pendiente |
| **TOTAL**        | **7-12h** |              |

---

## 🚀 Próximas Acciones

1. ✅ Rama `feature/supabase-auth-integration-phase1` creada
2. ⏳ Iniciar Fase 1 (Preparativos)
3. ⏳ Documentar avances después de cada fase
4. ⏳ Commit a GitHub al completar cada fase

---

## 📝 Notas

- Este plan evita usar ORMs complejos, enfocándose en Supabase Auth + Prisma ORM solo donde sea necesario
- Cada fase es independiente pero secuencial
- Se utilizan MCP tools según su jurisdicción específica
- Los commits se harán fase por fase mediante `github-lumiloops-oficial`
