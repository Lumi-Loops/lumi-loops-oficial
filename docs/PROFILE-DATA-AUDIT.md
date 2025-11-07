# Auditoría de datos de Perfil de Cliente

Este documento resume los campos del perfil, las migraciones aplicadas y las verificaciones realizadas para asegurar la correcta visualización y sincronización del nombre del cliente y nombre de la empresa.

## Campos en public.profiles

- id (uuid)
- email (text)
- full_name (text)
- first_name (text)
- last_name (text)
- business_name (text)
- phone (text)
- country (text)
- city (text)
- onboarded (boolean, default false)
- name_needs_review (boolean, default false)
- avatar_url (text)
- created_at / updated_at (timestamps)

## Migraciones aplicadas

1. Extensión de la tabla `public.profiles` para incluir los nuevos campos:

```
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists business_name text,
  add column if not exists phone text,
  add column if not exists country text,
  add column if not exists city text,
  add column if not exists onboarded boolean default false,
  add column if not exists name_needs_review boolean default false;
```

2. Función auxiliar para dividir nombre completo:

```
create or replace function public.split_full_name(fn text)
returns table(first_name text, last_name text, confidence int)
language plpgsql
...
```

3. Trigger para poblar datos desde `visitor_inquiries` al crear usuario:

```
create or replace function public.populate_names_from_inquiry() returns trigger ...
create trigger trg_populate_names_from_inquiry after insert on auth.users for each row execute function public.populate_names_from_inquiry();
```

4. Backfill para perfiles existentes:

```
with last_vi as (
  select distinct on (lower(trim(email))) lower(trim(email)) as k_email, name, business_name
  from public.visitor_inquiries
  where name is not null and btrim(name) <> ''
  order by lower(trim(email)), created_at desc
)
update public.profiles p
   set first_name = coalesce(p.first_name, s.first_name),
       last_name  = coalesce(p.last_name , s.last_name ),
       full_name  = coalesce(p.full_name , lv.name),
       business_name = coalesce(p.business_name, lv.business_name),
       name_needs_review = coalesce(p.name_needs_review, (case when s.confidence < 80 then true else false end)),
       updated_at = now()
  from last_vi lv
  cross join lateral split_full_name(lv.name) as s
 where lower(trim(p.email)) = lv.k_email;
```

## Verificaciones

- `auth.users` tiene triggers: `handle_new_user` y `trg_link_user_to_inquiries` y ahora `trg_populate_names_from_inquiry`.
- RLS para `profiles`: usuarios pueden ver/actualizar su propio perfil; administradores pueden ver/actualizar todos.
- Se probó visualmente el dashboard y la página de perfil en `http://localhost:3001/dashboard` y `http://localhost:3001/dashboard/profile` sin errores en el navegador.

## Impacto en UI

- Header del dashboard muestra `full_name` (o `first_name + last_name`) y `business_name`.
- La página de perfil permite editar nombre, apellido, nombre de empresa, teléfono, país, ciudad y avatar, con validación.
