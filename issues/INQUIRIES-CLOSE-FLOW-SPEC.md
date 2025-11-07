# 🗂️ Especificación funcional y técnica — Cierre de Inquiries (sin edición)

> **Estado:** Planificado (no implementar aún).  
> **Objetivo:** Permitir que el cliente _no edite_ una inquiry enviada; en su lugar, pueda **solicitar** su cierre antes de que el admin responda, o en cualquier momento para casos especiales. El cierre definitivo lo aprueba el admin. Se requiere trazabilidad completa y notificaciones.

---

## 1) Resumen del flujo

1. **Cliente registrado** crea una inquiry (o previamente la envió como visitante y quedó vinculada).
2. **No puede editar** el contenido de la inquiry.
3. El cliente puede **solicitar cierre** (Request Close) mediante modal con **motivo**.
4. La inquiry pasa a estado **`pending_close`** y se **notifica al admin**.
5. El admin **aprueba** (o rechaza) la solicitud.
   - Si aprueba → estado **`closed`**.
   - Si rechaza → vuelve a **`open`** (o `answered`, según corresponda).
6. Trazabilidad: queda **quién**, **cuándo**, **por qué** y **qué decisión** tomó el admin.

---

## 2) Modelo de datos (DB)

### 2.1 Tablas afectadas

Se usará la(s) tabla(s) de inquiries existente(s):

- `public.client_inquiries` (para clientes)
- `public.visitor_inquiries` (para visitantes ya vinculados vía `linked_user_id`)

> Si el proyecto consolida a futuro ambas en una sola, aplicar el mismo patrón.

### 2.2 Cambios propuestos

**En `public.client_inquiries` y `public.visitor_inquiries` agregar:**

```sql
alter table public.client_inquiries
  add column if not exists status varchar default 'open'
    check (status in ('open','answered','pending_close','closed')),
  add column if not exists closed_reason text,
  add column if not exists closed_requested_at timestamptz,
  add column if not exists closed_by_admin boolean default false;

alter table public.visitor_inquiries
  add column if not exists status varchar default 'open'
    check (status in ('open','answered','pending_close','closed')),
  add column if not exists closed_reason text,
  add column if not exists closed_requested_at timestamptz,
  add column if not exists closed_by_admin boolean default false;
```

> **Nota:** `answered` lo setea el admin cuando responde (ya o a futuro).

### 2.3 Auditoría opcional (recomendado)

Tabla liviana para eventos:

```sql
create table if not exists public.inquiry_events (
  id uuid primary key default gen_random_uuid(),
  inquiry_kind varchar not null check (inquiry_kind in ('client','visitor')),
  inquiry_id uuid not null,
  actor_user_id uuid null,
  event_type varchar not null check (event_type in ('request_close','approve_close','reject_close')),
  reason text null,
  created_at timestamptz not null default now()
);
create index if not exists idx_inquiry_events_inquiry on public.inquiry_events(inquiry_kind, inquiry_id);
```

---

## 3) Reglas de negocio

- **No edición** del contenido después de enviado. Campos inmutables: `title`, `message`, adjuntos, etc.
- El **cliente registrado** puede **solicitar cierre** siempre, pero UX sugiere:
  - Mostrar aviso si no ha sido respondida aún (“puedes cerrar antes de respuesta”).
  - Si ya está `answered`, permitir `pending_close` igualmente (caso: “ya no necesito soporte”).
- **El admin es quien cierra** definitivamente la inquiry.
- Una inquiry `closed` **no se reabre**, salvo futura feature “reopen” (fuera de alcance ahora).

---

## 4) RLS (Row Level Security)

> Ajustar para ambas tablas (`client_inquiries`, `visitor_inquiries`). Ejemplos abajo para `visitor_inquiries`; replicar en `client_inquiries` usando `user_id` en lugar de `linked_user_id` si aplica.

### 4.1 Lectura (ya existente)

```sql
-- Cliente ve sus inquiries vinculadas
create policy if not exists client_read_own_visitor_inquiries
on public.visitor_inquiries
for select
to authenticated
using (linked_user_id = auth.uid());
```

### 4.2 Solicitar cierre (UPDATE restringido)

Permitir **solo** actualizar los campos de solicitud cuando es el **dueño**:

```sql
create policy if not exists client_request_close_visitor_inquiries
on public.visitor_inquiries
for update
to authenticated
using (linked_user_id = auth.uid())
with check (
  linked_user_id = auth.uid()
  and status in ('open','answered')   -- puede pedir cierre desde estos estados
);
```

> **Enforcement adicional** se hará a nivel API (ver §6).

### 4.3 Cerrar (UPDATE por admin)

```sql
create policy if not exists admin_close_visitor_inquiries
on public.visitor_inquiries
for update
to authenticated
using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role='admin'))
with check (true);
```

> Admin puede cambiar `status` a `closed` y setear `closed_by_admin=true`.

---

## 5) Notificaciones (admin & cliente)

- **Cuando cliente solicita cierre** (`pending_close`):
  - Crear notificación en `admin_inquiry_notifications` con `title="Close request"` y `message="Client X requested to close inquiry Y"`.
  - Sonido/contador en campana del admin (ya implementado para otras notificaciones).

- **Cuando admin decide (approve/reject)**:
  - (Opcional) notificación al cliente vía email o in-app:
    - Aprobada → “Your inquiry was closed by the admin.”
    - Rechazada → “Your closure request was declined.”

> **Sugerencia:** reusar RPC/cola ya existente y plantillas con Resend (SMTP ya configurado).

---

## 6) Endpoints API (Next.js)

> Prefijo sugerido: `/api/inquiries`

### 6.1 POST `/api/inquiries/request-close`

- **Body:** `{ inquiryId: string, kind: 'client'|'visitor', reason: string }`
- **Auth:** `authenticated`
- **Lógica:**
  1. Verificar **ownership**:
     - `kind='visitor'` → `linked_user_id = auth.uid()`
     - `kind='client'` → `user_id = auth.uid()`
  2. Verificar estado actual: permitir si `status in ('open','answered')`.
  3. Update:
     ```sql
     set status='pending_close', closed_reason=<reason>, closed_requested_at=now()
     ```
  4. Insertar evento en `inquiry_events` (`request_close`).
  5. Crear notificación admin.
  6. Responder `200 { ok: true }`.

### 6.2 POST `/api/inquiries/approve-close`

- **Body:** `{ inquiryId: string, kind: 'client'|'visitor' }`
- **Auth:** admin
- **Lógica:**
  1. Verificar rol admin.
  2. Verificar estado actual: permitir si `status='pending_close'` (o también desde `open/answered` si deseas bypass admin).
  3. Update:
     ```sql
     set status='closed', closed_by_admin=true
     ```
  4. Insertar evento `approve_close`.
  5. (Opcional) notificar al cliente.

### 6.3 POST `/api/inquiries/reject-close` (opcional)

- **Body:** `{ inquiryId: string, kind: 'client'|'visitor', reason?: string }`
- **Auth:** admin
- **Lógica:**
  1. Verificar rol admin.
  2. Update a `status` previo (`open` o `answered`), y log en `inquiry_events` como `reject_close` con `reason` opcional.

> **Nota:** separar `client`/`visitor` te permite apuntar a tablas distintas sin unificar aún.

---

## 7) UI/UX

### 7.1 Cliente (Dashboard → My Inquiries)

- **Sin edición**: deshabilitar inputs, mostrar contenido como read-only.
- Botón **Request Close** (visible si `status in ('open','answered')`).
- **Modal**:
  - `Select motivo` (requerido): _Not relevant anymore_, _I solved it_, _Wrong submission_, _Other…_
  - `Textarea` opcional `Additional comments`
  - Botón **Confirmar** (POST → `/request-close`)
- Badge por estado:
  - `open` (verde), `answered` (azul), `pending_close` (naranja), `closed` (gris).

### 7.2 Admin (Dashboard → Inquiries)

- Badge **Pending Close** con color (naranja).
- Botones: **Approve Close** / **Reject** (reason opcional).
- Notificaciones en campana cuando llega una solicitud.

---

## 8) Validaciones

### 8.1 Servidor (API)

- Verificar ownership (cliente).
- Verificar rol (admin) para aprobar/rechazar.
- Verificar transición de estados válida:
  - `open|answered → pending_close` (cliente)
  - `pending_close → closed` (admin approve)
  - `pending_close → open|answered` (admin reject)
- Responder 400/403 ante reglas inválidas.

### 8.2 Cliente

- Confirmación previa (“¿Revisaste tu inquiry?”) antes del envío inicial.
- Validación de `reason` requerido en el modal de cierre.

---

## 9) Triggers (opcionales / nice-to-have)

- **`AFTER UPDATE`** en `client_inquiries` y `visitor_inquiries` para:
  - Cuando `status` cambia a `pending_close` → insertar notificación admin.
  - Cuando `status` cambia a `closed` → notificación al cliente (email o in-app).

> Alternativa: hacerlo en la API (más fácil de auditar y testear).

---

## 10) Pruebas (manuales y E2E)

1. **Cliente (no editable):** envía inquiry y verifica UI read-only.
2. **Request Close:** abre modal, envía, ver `status = pending_close`, notificación admin.
3. **Admin Approve:** botón → `status = closed`, badge gris, evento `approve_close`.
4. **Admin Reject:** botón → `status` revierte; evento `reject_close`.
5. **RLS:** otro usuario no ve ni puede cambiar inquiries ajenas.
6. **Auditoría:** `inquiry_events` registra los pasos.

---

## 11) Observabilidad y logs

- Loguear en server: `request-close`, `approve-close`, `reject-close` (usuario, inquiry_id, motivo).
- (Opcional) métricas: conteo de solicitudes por semana, tasa de aprobaciones.

---

## 12) Rollback / compatibilidad

- Los `ALTER TABLE ... add column if not exists` son **idempotentes**.
- Policies RLS: agregar con `if not exists` y versionar en migraciones.
- Endpoints: planificar feature flags para habilitar por entorno.

---

## 13) Checklist de entrega

- [ ] Migraciones DB preparadas pero **no aplicadas**.
- [ ] Policies RLS escritas y documentadas.
- [ ] Endpoints definidos (sin publicar).
- [ ] UI diseñada (mock / Figma o story).
- [ ] Documentación lista (`docs/INQUIRIES-CLOSE-FLOW.md`).

---

## 14) Decisiones pendientes (cuando se implemente)

- ¿Permitir _request-close_ también cuando `answered`? (**sugerido: sí**)
- ¿Notificar al cliente por email al aprobar/rechazar? (**sugerido: sí**, reusar Resend)
- ¿Registrar `reject_reason`? (**sugerido: sí**, opcional en endpoint)

---

**Fin de especificación — Cierre de Inquiries (sin edición)**
