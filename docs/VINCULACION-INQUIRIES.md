# Vinculación de Inquiries y Políticas RLS

Este documento describe cómo se configuran las políticas de seguridad a nivel de fila (RLS) para permitir que los usuarios autenticados visualicen sus inquiries vinculadas y, al mismo tiempo, se mantenga la seguridad para otros usuarios.

## Objetivo

- Permitir que un usuario autenticado vea sus inquiries cuando:
  - `user_id = auth.uid()` (inquiries creadas directamente por el usuario), o
  - `linked_user_id = auth.uid()` (inquiries realizadas como visitante y vinculadas tras el registro).
- Mantener visibilidad global únicamente para administradores.

## Políticas RLS (SELECT)

Tabla: `public.visitor_inquiries`

```sql
-- Habilitar RLS (idempotente)
alter table public.visitor_inquiries enable row level security;

-- Policy para clientes: ver sus propias inquiries
drop policy if exists client_read_own_visitor_inquiries on public.visitor_inquiries;
create policy client_read_own_visitor_inquiries
on public.visitor_inquiries
for select
to authenticated
using ((user_id = auth.uid()) OR (linked_user_id = auth.uid()));

-- Policy para administradores: visibilidad global
drop policy if exists admin_read_all_visitor_inquiries on public.visitor_inquiries;
create policy admin_read_all_visitor_inquiries
on public.visitor_inquiries
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);
```

## Verificación rápida

Para verificar el acceso de un usuario autenticado en desarrollo, se puede simular el contexto de autenticación:

```sql
select set_config(
  'request.jwt.claims',
  '{"role":"authenticated","sub":"<USER_ID>"}',
  true
);
set role authenticated;

select id, email, linked_user_id, user_status
from public.visitor_inquiries
where linked_user_id = auth.uid();
```

Reemplazar `<USER_ID>` por el `uuid` del usuario. Debe devolver registros vinculados a ese usuario cuando existan.

## Impacto en la UI

- En el Dashboard del cliente (My Inquiries), los usuarios verán tanto las inquiries propias como las vinculadas desde el flujo de visitante.
- Los administradores mantienen visibilidad global según su `role = 'admin'` en `public.profiles`.

## Notas

- Las funciones de trigger de vinculación y notificaciones no se ven afectadas por esta configuración.
- Si se agregan nuevos roles (p. ej., `manager`, `support`), las policies deben ampliarse según corresponda.
