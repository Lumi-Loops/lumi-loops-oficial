# Extensión de Instrucciones: Manejo de Datos del Usuario Cliente

> **Continuación del documento:** `INSTRUCCIONES_PERFIL_CLIENTE_Y_SINCRONIA.md`
>
> Este documento amplía las indicaciones previas y especifica la lógica de sincronización y normalización de nombres para los registros de **clientes (usuarios autenticados)** vinculados a **formularios de visitantes**.

---

## 🎯 Objetivo

Asegurar un manejo coherente de datos personales (nombre y apellido) cuando un usuario registrado proviene de un registro previo en el formulario de visitantes.

El formulario de visitantes incluye un campo único **`full_name`**, mientras que la tabla de clientes debe almacenar los valores por separado: **`first_name`** y **`last_name`**.

---

## 🔁 Estrategia General

1. Mantener columnas **`first_name`** y **`last_name`** en `public.profiles`.
2. Al crear un perfil desde un registro de visitante:
   - Intentar **dividir** el campo `full_name` en `{first_name, last_name}`.
   - Si no se puede determinar con certeza:
     - Asignar `first_name = full_name`.
     - Dejar `last_name = NULL`.
     - Marcar `name_needs_review = true`.
3. No sobrescribir nunca valores existentes si el usuario ya los actualizó manualmente.
4. Permitir que el usuario ajuste su nombre y apellido desde su perfil y, al guardar, establecer `name_needs_review = false`.

---

## 🧱 Estructura de Base de Datos

```sql
alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists name_needs_review boolean default false,
  add column if not exists full_name text;
```

---

## 🧩 Función de División de Nombre Completo

```sql
create or replace function public.split_full_name(fn text)
returns table(first_name text, last_name text, confidence int)
language plpgsql
as $$
declare
  parts text[];
  n int;
  last text;
  joiners text[] := array['de','del','de la','da','dos','van','von','bin','al'];
begin
  if fn is null or btrim(fn) = '' then
    return query select null::text, null::text, 0;
    return;
  end if;

  fn := regexp_replace(btrim(fn), '\\s+', ' ', 'g');
  parts := regexp_split_to_array(fn, ' ');
  n := array_length(parts, 1);

  if n = 1 then
    return query select parts[1], null::text, 50;
    return;
  end if;

  last := parts[n];
  if n >= 2 then
    if lower(parts[n-1]) = any (joiners) then
      last := parts[n-1] || ' ' || last;
      return query select array_to_string(parts[1:n-2], ' '), last, 85;
    else
      return query select array_to_string(parts[1:n-1], ' '), last, 85;
    end if;
  end if;
  return query select parts[1], null::text, 50;
end;
$$;
```

---

## ⚙️ Trigger de Poblado Automático desde Visitantes

```sql
create or replace function public.populate_names_from_inquiry()
returns trigger
language plpgsql
security definer
as $$
declare
  v_full_name text;
  f text; l text; c int;
begin
  select vi.full_name
    into v_full_name
    from public.visitor_inquiries vi
   where lower(trim(vi.email)) = lower(trim(new.email))
   order by vi.created_at desc
   limit 1;

  if v_full_name is null then
    return new;
  end if;

  select first_name, last_name, confidence
    into f, l, c
    from public.split_full_name(v_full_name);

  update public.profiles p
     set first_name = coalesce(p.first_name, f),
         last_name  = coalesce(p.last_name , l),
         full_name  = coalesce(p.full_name , v_full_name),
         name_needs_review = coalesce(p.name_needs_review, (c < 80))
   where p.id = new.id;
  return new;
end;
$$;

create trigger trg_populate_names_from_inquiry
after insert on auth.users
for each row
execute function public.populate_names_from_inquiry();
```

---

## 🧮 Backfill para Usuarios Existentes

```sql
with last_vi as (
  select distinct on (lower(trim(email)))
         lower(trim(email)) as k_email,
         full_name
    from public.visitor_inquiries
   where full_name is not null and btrim(full_name) <> ''
   order by lower(trim(email)), created_at desc
)
update public.profiles p
   set first_name = coalesce(p.first_name, (select (split_full_name(lv.full_name)).first_name)),
       last_name  = coalesce(p.last_name , (select (split_full_name(lv.full_name)).last_name )),
       full_name  = coalesce(p.full_name , lv.full_name),
       name_needs_review = coalesce(p.name_needs_review,
                           (case when (select (split_full_name(lv.full_name)).confidence) < 80 then true else false end))
  from last_vi lv
 where lower(trim(p.email)) = lv.k_email;
```

---

## 🧭 Experiencia de Usuario

- Si `name_needs_review = true` o `last_name IS NULL`:
  - Mostrar un **banner** en `/dashboard/profile`:
    > _"We imported your name from a previous form. Please confirm your First name and Last name."_
- Prellenar campos de texto con los valores actuales.
- Al guardar, actualizar `name_needs_review = false`.

---

## 🔒 Políticas de Seguridad (RLS)

```sql
create policy if not exists client_read_own_profile
on public.profiles for select to authenticated
using (id = auth.uid());

create policy if not exists client_update_own_profile
on public.profiles for update to authenticated
using (id = auth.uid()) with check (id = auth.uid());
```

---

## ✅ Conclusión

Esta extensión garantiza que los datos de los clientes registrados mantengan integridad y consistencia, aprovechando los registros previos de visitantes sin perder precisión en la estructura del modelo de datos. Además, facilita una transición amigable para el usuario, quien podrá verificar y ajustar su información personal dentro del flujo habitual de su perfil.
