# 🧩 Instrucciones de Vinculación Automática de Inquiries con Usuarios Registrados

**Archivo:** `instrucciones_vinculacion_inquiries_user.md`  
**Objetivo:** Automatizar la vinculación de inquiries de visitantes con sus cuentas al momento de registrarse, actualizar el estado en la interfaz del admin y generar notificaciones automáticas.

---

## 🧭 Fase 1 — Verificación previa en la base de datos

Antes de crear nuevos triggers o funciones, verificar si ya existen configuraciones similares.

### 📋 Consultas SQL de diagnóstico

```sql
-- 1️⃣ Buscar funciones relacionadas con "link", "inquiry" o "user"
select routine_name, routine_definition
from information_schema.routines
where routine_schema = 'public'
  and (routine_name ilike '%link%' or routine_name ilike '%inquiry%' or routine_name ilike '%user%');

-- 2️⃣ Listar triggers existentes
select event_object_table as table_name, trigger_name, action_timing, event_manipulation, action_statement
from information_schema.triggers
where trigger_schema = 'public'
  and (trigger_name ilike '%link%' or trigger_name ilike '%user%' or trigger_name ilike '%inquiry%');

-- 3️⃣ Confirmar si la columna linked_user_id existe en visitor_inquiries
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'visitor_inquiries' and column_name = 'linked_user_id';

-- 4️⃣ Verificar si hay campos o constraints relacionados con user_status
select column_name, data_type
from information_schema.columns
where table_schema = 'public' and table_name = 'visitor_inquiries' and column_name = 'user_status';
```

📌 **Acción:**  
Si existe alguna función con comportamiento similar (`link_user_to_inquiries`, `update_user_status`, etc.), revisar su contenido antes de crear las nuevas.  
Si no hay coincidencias, proceder con las fases siguientes.

---

## ⚙️ Fase 2 — Ampliación de la tabla `visitor_inquiries`

Agregar campo `user_status` para distinguir entre visitantes y usuarios registrados.

### 📜 SQL

```sql
alter table public.visitor_inquiries
add column if not exists user_status varchar default 'visitor'
check (user_status in ('visitor', 'registered'));

alter table public.visitor_inquiries
add column if not exists linked_at timestamp with time zone;
```

---

## 🧩 Fase 3 — Creación del Trigger Principal

### 🎯 Objetivo

Cuando un nuevo usuario se registra en `auth.users`, si su email coincide con el de un visitante existente, el sistema vincula automáticamente las inquiries y actualiza el estado.

### 🧱 Implementación SQL

```sql
-- 1️⃣ Crear función principal
create or replace function public.link_user_to_inquiries()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Vincular inquiries por coincidencia de email
  update public.visitor_inquiries
  set linked_user_id = new.id,
      user_status = 'registered',
      linked_at = now()
  where lower(trim(email)) = lower(trim(new.email))
  and linked_user_id is null;

  return new;
end;
$$;

-- 2️⃣ Crear trigger
create trigger trg_link_user_to_inquiries
after insert on auth.users
for each row
execute function public.link_user_to_inquiries();
```

📌 **Resultado esperado:**  
Cada nuevo registro en `auth.users` actualiza automáticamente todas las inquiries cuyo email coincide y no estaban vinculadas.

---

## 🔔 Fase 4 — Notificación al Admin cuando un visitante se convierte en cliente

### 🎯 Objetivo

Cuando una inquiry vinculada cambia su estado a “registered”, crear automáticamente una notificación en `admin_inquiry_notifications`.

### 🧱 Implementación SQL

```sql
-- 1️⃣ Crear función de notificación
create or replace function public.notify_admin_user_registered()
returns trigger
language plpgsql
security definer
as $$
declare
  v_email text;
begin
  select email into v_email from public.visitor_inquiries where id = new.id;

  insert into public.admin_inquiry_notifications (
    admin_user_id,
    inquiry_type,
    title,
    message,
    read,
    created_at
  )
  values (
    (select id from public.admin_profiles order by created_at asc limit 1),
    'visitor',
    'Visitor became a registered client',
    concat('The visitor ', v_email, ' has just registered and their inquiry is now linked to their user account.'),
    false,
    now()
  );

  return new;
end;
$$;

-- 2️⃣ Crear trigger
create trigger trg_notify_admin_user_registered
after update of linked_user_id on public.visitor_inquiries
for each row
when (new.linked_user_id is not null and old.linked_user_id is null)
execute function public.notify_admin_user_registered();
```

📌 **Resultado esperado:**  
El admin recibe automáticamente una notificación cuando un visitante se convierte en usuario registrado.

---

## 🖼️ Fase 5 — Actualización de la Interfaz del Admin

### 🎨 Indicador visual de tipo de usuario

En el componente `InquiryCard` o `NotificationItem`, mostrar un distintivo según `user_status`.

#### 🔹 Ejemplo con íconos (Lucide)

```tsx
import { Circle, CircleCheck } from "lucide-react";

{
  inquiry.user_status === "registered" ? (
    <CircleCheck className="text-green-500" title="Registered user" />
  ) : (
    <Circle className="text-purple-500" title="Visitor" />
  );
}
```

#### 🔹 Ejemplo con Badge (shadcn/ui)

```tsx
<Badge variant={inquiry.user_status === "registered" ? "success" : "secondary"}>
  {inquiry.user_status === "registered" ? "Registered User" : "Visitor"}
</Badge>
```

### 💡 Sugerencia

- Agregar filtro adicional en la UI: `Show: [All | Visitors | Registered]`
- Mostrar notificación visual al admin cuando una inquiry cambia de estado (“This visitor is now a registered user”).

---

## 🧪 Fase 6 — Pruebas Funcionales

### ✅ Escenario 1 — Envío inicial por visitante

1. Enviar un inquiry desde Home con email nuevo no registrado.
2. Verificar en `visitor_inquiries`:
   - `linked_user_id` = NULL
   - `user_status` = “visitor”

### ✅ Escenario 2 — Registro con el mismo email

1. Registrarse en `/auth/signup` con el mismo email.
2. Verificar en `visitor_inquiries`:
   - `linked_user_id` = `<nuevo_user_id>`
   - `user_status` = “registered”
   - `linked_at` = timestamp actual
3. Verificar en `admin_inquiry_notifications`:
   - Nueva notificación con título “Visitor became a registered client”.

### ✅ Escenario 3 — Visualización en dashboard

- Admin:
  - La inquiry del usuario muestra ahora un ícono verde o badge de “Registered User”.
  - Notificación visible en campana o lista.
- Cliente:
  - En su dashboard (“My Inquiries”) aparece la inquiry vinculada automáticamente.

---

## 🧰 Fase 7 — Auditoría y Seguridad

- Asegurarse de que la función `link_user_to_inquiries` tenga `security definer`.
- Revisar políticas RLS en `visitor_inquiries` para permitir actualización desde triggers:
  ```sql
  alter table public.visitor_inquiries enable row level security;
  ```
- Validar permisos del rol `authenticated` y `service_role` para acceso controlado.

---

## 📄 Estado final esperado

| Elemento                    | Estado                                             |
| --------------------------- | -------------------------------------------------- |
| **Vinculación automática**  | ✅ Activa mediante trigger                         |
| **Actualización de estado** | ✅ `user_status` = “registered”                    |
| **Notificación al admin**   | ✅ Automática con mensaje claro                    |
| **UI admin actualizada**    | ✅ Badge o ícono visible según tipo                |
| **Auditoría**               | ✅ Campo `linked_at` registra fecha de vinculación |

---

## 📘 Notas finales

- Toda la lógica de sincronización se ejecuta a nivel de base de datos, garantizando integridad total incluso si el registro ocurre fuera del frontend.
- El sistema es completamente extensible: se puede agregar seguimiento de cambios con `pg_notify` o logs de auditoría si se requiere.
- Este enfoque cumple con las mejores prácticas profesionales para proyectos multirol (visitantes → clientes → admin).
