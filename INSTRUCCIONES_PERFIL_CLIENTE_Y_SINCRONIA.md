# 🔎 Investigación & Plan: Datos de visitante → Perfil de cliente registrado

**Archivo:** `INSTRUCCIONES_PERFIL_CLIENTE_Y_SINCRONIA.md`  
**Objetivo:** Guiar al agente IA para investigar dónde se almacenan hoy los datos capturados en formularios de _visitantes_ (full name, email, business name, etc.), cómo llegan al admin, por qué no aparecen en el dashboard del cliente recién registrado, y proponer un plan de implementación para **Perfil de Cliente** + **sincronización automática** sin sobrescribir datos editados por el usuario.

---

## 1) Contexto del problema

- Cuando un **visitante** envía el formulario, el **admin** ve nombre, email y business name en la notificación / detalle de inquiry.
- Tras registrarse el visitante con el **mismo email**, su **Dashboard de cliente** no muestra esos datos (p.ej. el perfil del cliente no está poblado o la página de perfil aún no existe).
- Meta: confirmar **dónde quedan persistidos** esos campos y **definir el flujo de sincronización** hacia `public.profiles` (u otra tabla de perfil) para poblar campos iniciales del cliente.

---

## 2) Investigación en Base de Datos (SQL)

> Ejecutar en Supabase SQL Editor. Documentar resultados en `docs/PROFILE-DATA-AUDIT.md`.

### 2.1. Estructura actual de `profiles`

```sql
select column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema='public' and table_name='profiles'
order by ordinal_position;
```

**Objetivo:** Confirmar si existen columnas `full_name`, `business_name`, `phone`, etc.

- Si **no existen**, se propondrá una migración (ver §5.1).

### 2.2. ¿Dónde se guardan los datos del formulario de visitante?

- Revisar `visitor_inquiries` (y `client_inquiries` si aplica):

```sql
select column_name, data_type
from information_schema.columns
where table_schema='public' and table_name='visitor_inquiries'
order by ordinal_position;

-- Muestra ejemplos recientes:
select id, email, (case when exists (
  select 1 from information_schema.columns
  where table_name='visitor_inquiries' and column_name='full_name'
) then (select full_name) end) as full_name_guess,
       (case when exists (
  select 1 from information_schema.columns
  where table_name='visitor_inquiries' and column_name='business_name'
) then (select business_name) end) as business_name_guess,
       linked_user_id, created_at
from public.visitor_inquiries
order by created_at desc
limit 10;
```

**Objetivo:** Ver si `full_name` / `business_name` están **en esta tabla** o si se deducen en runtime desde el payload (p.ej. JSON).

### 2.3. ¿Existen tablas auxiliares?

Buscar si hay tablas “contact profiles” o JSON en columnas genéricas:

```sql
-- Candidatas comunes
select table_name
from information_schema.tables
where table_schema='public'
  and (table_name ilike '%profile%'
    or table_name ilike '%customer%'
    or table_name ilike '%account%'
    or table_name ilike '%contact%'
    or table_name ilike '%lead%'
    or table_name ilike '%meta%');

-- Columnas JSON que podrían contener el payload original
select column_name, data_type
from information_schema.columns
where table_schema='public' and table_name='visitor_inquiries' and data_type in ('json','jsonb');
```

### 2.4. Verificación de vínculo visitante → usuario

Confirmar qué filas están **vinculadas** y si hay datos útiles para poblar perfil:

```sql
select vi.id as visitor_inquiry_id,
       vi.email,
       vi.linked_user_id,
       vi.created_at
from public.visitor_inquiries vi
where vi.linked_user_id is not null
order by vi.created_at desc
limit 20;
```

---

## 3) Investigación en el código (Checklist)

> Documentar hallazgos en `docs/PROFILE-CODE-AUDIT.md` con rutas exactas de archivos y fragmentos relevantes.

- **Búsqueda** (grep/ripgrep):
  - `full_name`, `business_name`, `name`, `company`, `profile`, `profiles`, `update profile`, `ClientProfile`, `ProfileForm`, `AccountSettings`.
- **Componentes** probables:
  - `src/components/client/*` (¿existe `ClientProfile.tsx` / `ProfilePage.tsx`?).
  - `src/app/(client)/dashboard/*` o similar (¿se renderiza un “Mi perfil”?).
- **APIs**:
  - `src/app/api/*profile*/route.ts`
  - `src/app/api/user/*`
  - `src/lib/db/*`, `src/lib/supabase/*`
- **Inserciones/lecturas**:
  - En el **submit del formulario** (visitante): ¿se guarda `full_name`/`business_name` en BD o sólo se usa para notificar?
  - En el **registro**: ¿se crea/actualiza `public.profiles` con defaults?
    - Buscar hook de post-signup: `link_user_to_inquiries`, `auth` callbacks, o lógica en `/auth/signup`.
- **UI Cliente**:
  - Confirmar si el dashboard tiene sección de **Perfil**; si no, planificarla (ver §5.2).

---

## 4) Hipótesis técnicas (para confirmar)

1. Los campos **sí** se recogen y llegan al admin por **notificación**, pero **no están mapeados/persistidos** en `profiles` aún.
2. El perfil del cliente **no se crea** con defaults al registrarse (o se crea vacío).
3. No existe un **hook** que copie data desde la última `visitor_inquiry` (por email) hacia `profiles`.

---

## 5) Propuesta de solución (sin implementar aún)

> Mantener **no destructivo** y **idempotente**. No sobreescribir datos del usuario si ya los completó manualmente.

### 5.1. Modelo de datos — ampliar `profiles` (si hace falta)

```sql
alter table public.profiles
  add column if not exists full_name varchar,
  add column if not exists business_name varchar,
  add column if not exists phone varchar,
  add column if not exists country varchar,
  add column if not exists city varchar,
  add column if not exists onboarded boolean default false;
```

- **Regla de negocio:** no sobreescribir campos **no nulos** del perfil.

### 5.2. Página de Perfil (Cliente)

- **Ruta sugerida:** `src/app/(client)/dashboard/profile/page.tsx`
- **Bloques**:
  - **Summary (read-only)**: email, fecha de alta, “Linked from Visitor” si aplicó.
  - **Editable por el cliente:** `full_name`, `business_name`, `phone`, `country`, `city`.
  - **Guardar** con endpoint `PATCH /api/profile` (ver §5.3).
- **Accesibilidad/UX**:
  - Validación con Zod; toasts con Sonner.
  - Estados: `saving`, `saved`, `error`.

### 5.3. API Perfil

- **Endpoint**: `src/app/api/profile/route.ts` (REST: `GET`, `PATCH`)
  - `GET`: devuelve datos del perfil del `auth.uid()` desde `public.profiles`.
  - `PATCH`: actualiza sólo campos enviados, con **with_check RLS** para asegurar que `id = auth.uid()`.

### 5.4. Sincronización automática (poblado inicial)

> Se propone **en DB con trigger** para robustez, y/o **en servidor** tras el registro.

**Opción A — Trigger (recomendado, similar a `link_user_to_inquiries`)**

```sql
create or replace function public.populate_profile_from_latest_inquiry()
returns trigger
language plpgsql
security definer
as $$
declare
  v_email text;
  v_full_name text;
  v_business_name text;
begin
  -- Email del nuevo usuario
  v_email := lower(trim(new.email));

  -- Tomar la inquiry más reciente de ese email
  select /* ajustar nombres de columnas según existan */
         (case when exists (
            select 1 from information_schema.columns
            where table_name='visitor_inquiries' and column_name='full_name'
         ) then (select vi.full_name) end) as full_name_guess,
         (case when exists (
            select 1 from information_schema.columns
            where table_name='visitor_inquiries' and column_name='business_name'
         ) then (select vi.business_name) end) as business_name_guess
  into v_full_name, v_business_name
  from public.visitor_inquiries vi
  where lower(trim(vi.email)) = v_email
  order by vi.created_at desc
  limit 1;

  -- Poblar perfiles sin sobrescribir datos ya existentes
  update public.profiles p
  set full_name = coalesce(p.full_name, v_full_name),
      business_name = coalesce(p.business_name, v_business_name)
  where p.id = new.id;

  return new;
end;
$$;

drop trigger if exists trg_populate_profile_from_inquiry on auth.users;
create trigger trg_populate_profile_from_inquiry
after insert on auth.users
for each row
execute function public.populate_profile_from_latest_inquiry();
```

> Nota: si `visitor_inquiries` guarda esos campos con nombres distintos, ajustar la SELECT.

**Opción B — Hook en servidor (alternativa)**

- En el callback de signup (ya usas `link_user_to_inquiries`), añadir un paso que intente poblar `profiles` desde la inquiry más reciente de ese email (sin sobrescribir no-nulos).

### 5.5. RLS para `profiles`

- **Lectura**: el usuario puede leer **su propio perfil**.
- **Edición**: el usuario puede `PATCH` **su propio perfil**.  
  Ejemplo:

```sql
create policy if not exists client_read_own_profile
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy if not exists client_update_own_profile
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());
```

---

## 6) Pruebas sugeridas

1. **Visitante** envía inquiry con `full_name` + `business_name` + `email`.
2. **Registro** con el **mismo email**.
3. Validar en **profiles**:
   - `full_name`/`business_name` poblados si estaban `NULL` previamente.
4. UI **Perfil** (Dashboard → Profile): ver datos poblados y editar manualmente.
5. Repetir con usuario que **ya editó** su perfil: **no** debe sobrescribir los campos no nulos.
6. Verificar notificaciones existentes no se ven afectadas.

---

## 7) Entregables del agente IA

- `docs/PROFILE-DATA-AUDIT.md` → resultados SQL estructurados + conclusiones.
- `docs/PROFILE-CODE-AUDIT.md` → rutas y análisis de código donde se crean/leen esos campos.
- Propuesta concreta:
  - Si `profiles` carece de columnas: PR con migración SQL (idempotente).
  - Si existen: PR con trigger/servidor para **poblado inicial** (sin sobrescribir).
  - PR con **página de Perfil** (`/dashboard/profile`) + API `GET/PATCH /api/profile`.
- Pruebas E2E manuales documentadas (paso a paso).
- Impacto RLS validado y documentado.

---

## 8) Consideraciones

- **No sobrescribir** datos que el usuario haya completado manualmente (regla de oro).
- Mantener el poblado inicial como **“mejor esfuerzo”**; si faltan campos en la inquiry, dejar `NULL` en perfiles.
- Si a futuro unifican `visitor_inquiries` y `client_inquiries`, conservar la lógica de poblado desde el registro más reciente por email.
- Evitar dependencias en tablas que no existen (p.ej., `admin_profiles`). Si hace falta un admin, tomarlo de `public.profiles` con `role='admin'`.

---

**Fin — Investigación & Plan para Perfil de Cliente + Sincronización de datos desde visitante**
