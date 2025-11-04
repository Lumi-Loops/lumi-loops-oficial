# 🚀 Quick Reference - Fase 1: Preparativos

**Estado Actual:** ✅ Rama creada y plan documentado  
**Rama:** `feature/supabase-auth-integration-phase1`  
**Fecha Inicio:** 2025-11-04

---

## 📋 Checklist de Verificación - Fase 1

### 1️⃣ Variables de Entorno

- [x] `.env.local` contiene todas las claves Supabase

  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://dyvmseovfgffsqxdcvdl.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  DATABASE_URL=postgresql://...?pgbouncer=true
  DIRECT_DATABASE_URL=postgresql://...
  ```

- [ ] `.dev.vars` creado para desarrollo local
  - Copiar estructura de `.env.local`
  - Usar valores de desarrollo (si aplica)

### 2️⃣ Configuración de Workers

- [x] `wrangler.toml` está configurado
  - ✓ `compatibility_date = "2025-03-25"`
  - ✓ `compatibility_flags = ["nodejs_compat"]`
  - ✓ Assets binding presente
  - ✓ Build configuration OK

- [ ] Validar secrets en Workers
  ```bash
  wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts
  ```

### 3️⃣ Dependencias

- [x] `@supabase/supabase-js@^2.79.0` instalado
- [x] `@supabase/ssr@^0.7.0` instalado
- [x] `@prisma/client@^6.18.0` instalado
- [x] `@opennextjs/cloudflare@^1.11.0` instalado

Verificar:

```bash
npm list @supabase/* @prisma/* @opennextjs/*
```

### 4️⃣ Supabase Project

**Verificar con MCP: `supabase-lumiloops-oficial`**

- [ ] Auth habilitado con proveedor Email
- [ ] RLS (Row Level Security) activo
- [ ] Tabla `public.profiles` existe
- [ ] Tabla `auth.users` lista y accesible
- [ ] Políticas de seguridad básicas configuradas

**Comando para inspeccionar:**

```sql
-- Verificar RLS en tabla
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public';

-- Ver usuarios activos
SELECT id, email FROM auth.users LIMIT 5;
```

### 5️⃣ Prisma Schema

- [ ] `prisma/schema.prisma` apunta a Supabase

  ```prisma
  datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
  }
  ```

- [ ] Migraciones iniciales ejecutadas
  ```bash
  npx prisma migrate deploy
  ```

---

## 📁 Archivos a Crear en Fase 2+

| Archivo                              | Propósito                      | Fase |
| ------------------------------------ | ------------------------------ | ---- |
| `src/lib/supabase-browser.ts`        | Cliente Supabase para frontend | 3    |
| `src/lib/supabase-server.ts`         | Cliente Supabase para backend  | 3    |
| `src/hooks/useAuth.ts`               | Hook de autenticación          | 3    |
| `src/components/auth/SignUpForm.tsx` | Formulario de registro         | 3    |
| `src/components/auth/SignInForm.tsx` | Formulario de login            | 3    |
| `src/middleware.ts`                  | Middleware de autenticación    | 3    |
| `src/app/api/profile/route.ts`       | API de perfil                  | 4    |
| `src/app/dashboard/profile/page.tsx` | Página de perfil               | 4    |

---

## 🔧 Comandos Útiles

### Desarrollo Local

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para Workers
npm run build

# Preview en Workers
npm run preview

# Ejecutar migraciones
npx prisma migrate dev

# Generar tipos de Prisma
npx prisma generate
```

### Testing & Debug

```bash
# Validar TypeScript
npm run type-check

# Linting
npm run lint

# Listar secretos en Workers
wrangler secret list

# Ver tipos generados para Workers
wrangler types --env-interface CloudflareEnv cloudflare-env.d.ts
```

### Git & Commits

```bash
# Ver estado de rama
git status

# Ver cambios
git diff

# Commit con mensaje
git commit -m "feat: [Fase X] descripción"

# Push a rama
git push origin feature/supabase-auth-integration-phase1
```

---

## 🛠️ MCP Tools por Tarea

| Tarea                      | MCP Tool                      | Comando                              |
| -------------------------- | ----------------------------- | ------------------------------------ |
| Verificar Supabase Auth    | `supabase-lumiloops-oficial`  | Consultar RLS, usuarios, tablas      |
| Documentación de librerías | `context7`                    | Consultar APIs de Supabase, Next.js  |
| Debug en navegador         | `chrome-devtools`             | Inspeccionar cookies, tokens, errors |
| Validar Workers config     | `cloudflare-workers-bindings` | Testear secrets, variables, logs     |
| Versionado de código       | `github-lumiloops-oficial`    | Commits, push, pull requests         |

---

## 🎯 Métricas de Éxito - Fase 1

- ✅ Rama `feature/supabase-auth-integration-phase1` creada
- ✅ Plan completo documentado
- ⏳ Todas las variables de entorno validadas
- ⏳ Supabase Auth y RLS verificados
- ⏳ Prisma schema validado
- ⏳ Commit inicial con documentación completado

---

## ⚠️ Puntos de Atención

1. **Secrets:** `SUPABASE_SERVICE_ROLE_KEY` NUNCA debe exponerse al cliente
2. **JWT Tokens:** Manejar con cuidado en cookies HTTP-only
3. **RLS Policies:** Deben estar activas ANTES de implementar código
4. **Connection Pool:** Usar `DATABASE_URL` con `?pgbouncer=true` para Workers
5. **Migraciones:** Usar `DIRECT_DATABASE_URL` sin PgBouncer

---

## 📞 Próximos Pasos

1. ✅ Rama creada
2. ✅ Plan documentado
3. ⏳ **Siguiente:** Iniciar Fase 1
   - Verificar `.env.local`
   - Validar Supabase con `supabase-lumiloops-oficial`
   - Crear `.dev.vars`
   - Hacer commit

---

## 📚 Referencias Rápidas

- **Plan Completo:** `PLAN-SUPABASE-AUTH-INTEGRATION.md`
- **Rama de Trabajo:** `feature/supabase-auth-integration-phase1`
- **Documentación Supabase:** https://supabase.com/docs
- **Next.js + Supabase:** https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- **Cloudflare Workers + Next.js:** https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs/

---

**Última actualización:** 2025-11-04  
**Estado de Rama:** 🟢 Activa y lista para desarrollo
