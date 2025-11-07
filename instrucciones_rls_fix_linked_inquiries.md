# 🔒 Corrección de visibilidad de inquiries vinculadas (RLS Policy Fix)

## 🧠 Diagnóstico

El trigger de vinculación funciona correctamente, pero las inquiries no se muestran en el dashboard del cliente debido a que la política de seguridad a nivel de fila (RLS) en la tabla `public.visitor_inquiries` no permite que los usuarios autenticados vean sus registros vinculados.

## 📊 Evidencia del problema

Ejemplo real:

```sql
select id, email, linked_user_id, user_status, linked_at
from public.visitor_inquiries
where lower(trim(email)) = lower('zuppoijifreve-7785@yopmail.com');
```

Resultado:

```json
{
  "linked_user_id": "61460969-ffe6-4516-bf91-5c2bebd34cfa",
  "user_status": "registered",
  "linked_at": "2025-11-07 00:58:05.746404+00"
}
```

➡️ La vinculación ocurrió, pero en el dashboard del cliente no se muestra la inquiry porque la policy de `SELECT` usa `(user_id = auth.uid())`, mientras que la columna correcta es `linked_user_id`.

---

## ✅ Solución

### 1. Confirmar que RLS está habilitado

```sql
alter table public.visitor_inquiries enable row level security;
```

### 2. Eliminar la policy antigua (si existe)

```sql
drop policy if exists client_read_own_visitor_inquiries on public.visitor_inquiries;
```

### 3. Crear la nueva policy correcta

```sql
create policy client_read_own_visitor_inquiries
on public.visitor_inquiries
for select
to authenticated
using (linked_user_id = auth.uid());
```

### 4. Mantener las políticas para administradores

```sql
create policy if not exists admin_read_all_visitor_inquiries
on public.visitor_inquiries
for select
to authenticated
using (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role = 'admin'
));
```

### 5. Verificar funcionamiento

```sql
set role authenticated;
select id, email, linked_user_id, user_status
from public.visitor_inquiries
where linked_user_id = auth.uid();
```

Debe devolver registros con el mismo `auth.uid()` que el usuario logueado.

---

## 🧩 Verificación en la UI

1. Ingresar con el usuario registrado (`zuppoijifreve-7785@yopmail.com`).
2. Ir a **Dashboard → My Inquiries**.
3. Debe mostrarse la inquiry con el badge **“Linked from Visitor”**.

---

## 🛡️ Notas adicionales

- Las funciones de trigger (`link_user_to_inquiries` y `notify_admin_user_registered`) ya funcionan correctamente.
- Esta corrección no afecta a las policies de administradores ni al flujo de creación de inquiries.
- Si se agregan más roles (e.g. manager o support), extender las policies según sus permisos.

---

## 📁 Documentación sugerida

Actualizar `docs/VINCULACION-INQUIRIES.md` con el apartado:

```markdown
### RLS Configuration for Linked Users

Usuarios autenticados ahora pueden leer únicamente sus propias inquiries vinculadas (`linked_user_id = auth.uid()`).  
Los administradores mantienen visibilidad global.
```
