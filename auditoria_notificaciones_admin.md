# 🧩 Auditoría Técnica — Sistema de Notificaciones Admin (Inquiries de Visitantes)

## 🎯 Objetivo

Revisar por qué las notificaciones de nuevas consultas de visitantes (`visitor_inquiries`) no se muestran en el dashboard del administrador ni en el icono de la campana.

## 🧠 Contexto

- Las inquiries de visitantes se guardan correctamente en la tabla `public.visitor_inquiries`.
- El correo de confirmación (Resend) se envía exitosamente.
- Sin embargo:
  - No se genera ni muestra la notificación admin.
  - Tampoco aparece el toast en el cliente visitante tras el envío.
- Las inquiries sí son visibles en `/admin?tab=inquiries`.

## 🔍 Pasos para la auditoría

### 1️⃣ Revisar la creación de la notificación en el backend

- Archivo: `src/app/api/submit-lead/route.ts`
- Buscar llamada al RPC `create_admin_inquiry_notification`.
  - Confirmar que se usa `supabaseAdmin` (serviceRole).
  - Verificar que se llama tras el insert en `visitor_inquiries`.
  - Si no existe, documentar el bloque donde debería ir.
- Agregar logs temporales:
  ```typescript
  console.log("RPC Notification params:", { adminProfile, newInquiry });
  console.log("RPC result:", rpcResponse);
  ```
- Ejecutar una prueba con `bun run dev` y capturar el log.

---

### 2️⃣ Verificar si el RPC realmente inserta

- Ejecutar en Supabase SQL Editor:
  ```sql
  SELECT * FROM public.admin_inquiry_notifications
  ORDER BY created_at DESC
  LIMIT 10;
  ```
- Si no hay registros con `inquiry_type = 'visitor'`, confirmar que:
  - El RPC `create_admin_inquiry_notification` existe.
  - Tiene privilegios SECURITY DEFINER.
  - Recibe correctamente el parámetro `p_inquiry_type`.

---

### 3️⃣ Revisar RLS y policies

- Tabla: `admin_inquiry_notifications`
- Confirmar que el admin tiene permiso SELECT sobre sus notificaciones:
  ```sql
  SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'admin_inquiry_notifications';
  ```
- Si la policy filtra solo `profiles.role = 'admin'`, verificar que `auth.uid()` coincide con el `admin_user_id` de la fila.

---

### 4️⃣ Verificar hook de notificaciones

- Archivo: `src/hooks/useRealtimeNotifications.ts`
- Confirmar que:
  - Si `userRole === 'admin'`, el hook consulta `admin_inquiry_notifications`.
  - La query no filtra por `inquiry_type = 'client'`.
  - Polling o canal Realtime no lanza errores (ver consola).

---

### 5️⃣ Revisar la UI del toast

- Archivo: `src/components/forms/lead-form.tsx`
- Verificar que el bloque de éxito esté activo:
  ```typescript
  if (response.ok) {
    toast.success("Your inquiry was sent successfully!", {
      description: "We'll contact you soon by email.",
    });
  }
  ```
- Si no existe, añadirlo tras el `fetch` exitoso.

---

## 🧾 Resultados esperados del análisis

1. El agente debe determinar **dónde se interrumpe el flujo de notificación**:
   - ¿No se llama al RPC?
   - ¿El RPC falla?
   - ¿El hook no la lee?
2. Documentar hallazgos con:
   - Logs de consola relevantes.
   - Código de los archivos involucrados.
   - Capturas o descripción de las policies SQL relevantes.
3. Proponer una solución concreta basada en la causa detectada.

---

## 🧩 Archivos relevantes para revisar

- `src/app/api/submit-lead/route.ts`
- `src/hooks/useRealtimeNotifications.ts`
- `src/components/NotificationBell.tsx`
- `src/app/admin/page.tsx`
- Policies RLS de `admin_inquiry_notifications`
- RPC `create_admin_inquiry_notification`

---

## ✅ Criterio de éxito

- Confirmar causa exacta del fallo de notificación.
- Notificación admin visible en la campana tras enviar inquiry visitante.
- Toast visible en frontend visitante tras 201.
- Documentar todo en un archivo `docs/NOTIFICATIONS-VISITOR-AUDIT.md`.

---

**Fin del documento — Instrucciones de auditoría para el Agente IA**
