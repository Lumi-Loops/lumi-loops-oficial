# ✅ AUTORIZACIÓN TÉCNICA — Migración del Sistema de Notificaciones de Visitantes

## 📅 Fecha

6 de noviembre de 2025

---

## 🧩 Contexto

El agente IA completó la auditoría del sistema de notificaciones y determinó que el error que impedía la creación de notificaciones de visitantes se debía a una restricción de clave foránea (FK) en la tabla `public.admin_inquiry_notifications`:

```
inquiry_id → public.client_inquiries(id)
```

Esto provocaba un error `23503` al intentar insertar notificaciones para inquiries de visitantes (`visitor_inquiries`).

---

## 🧠 Diagnóstico confirmado

| Elemento                           | Estado                                | Comentario |
| ---------------------------------- | ------------------------------------- | ---------- |
| Inserción de visitor_inquiries     | ✅ Correcta                           |
| Envío de correo (Resend)           | ✅ Correcto                           |
| Ejecución de RPC                   | ⚠️ Falla con 23503 (FK)               |
| Lectura del hook de notificaciones | ✅ Correcta                           |
| Políticas RLS                      | ✅ Correctas                          |
| UI (campana y toast)               | ⚠️ No activa por ausencia de registro |

---

## ✅ Aprobación de migración

Se autoriza la ejecución de la **migración estructural y actualización del RPC** propuesta por el agente IA.  
El objetivo es permitir notificaciones tanto para clientes como para visitantes sin romper la integridad referencial ni el flujo actual del sistema.

---

## ⚙️ Cambios a aplicar

### 1️⃣ Alterar la tabla `admin_inquiry_notifications`

Agregar una nueva columna y una constraint de coherencia:

```sql
ALTER TABLE public.admin_inquiry_notifications
ADD COLUMN visitor_inquiry_id uuid NULL REFERENCES public.visitor_inquiries(id) ON DELETE CASCADE;

ALTER TABLE public.admin_inquiry_notifications
ADD CONSTRAINT admin_inquiry_notifications_coherence_check
CHECK (
  (inquiry_type = 'client' AND inquiry_id IS NOT NULL AND visitor_inquiry_id IS NULL)
  OR
  (inquiry_type = 'visitor' AND visitor_inquiry_id IS NOT NULL AND inquiry_id IS NULL)
);
```

> ⚠️ Si existiera una constraint previa llamada `admin_inquiry_notifications_reference_check`, deberá eliminarse antes de aplicar esta.

---

### 2️⃣ Actualizar el RPC `create_admin_inquiry_notification`

Ajustar el cuerpo para insertar según el tipo de inquiry:

```plpgsql
CREATE OR REPLACE FUNCTION public.create_admin_inquiry_notification(
  p_admin_user_id uuid,
  p_inquiry_id uuid,
  p_inquiry_type character varying,
  p_title character varying,
  p_message text DEFAULT NULL::text
)
RETURNS TABLE(
  id uuid,
  admin_user_id uuid,
  inquiry_id uuid,
  visitor_inquiry_id uuid,
  inquiry_type character varying,
  title character varying,
  message text,
  read boolean,
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF p_inquiry_type = 'client' THEN
    RETURN QUERY
    INSERT INTO public.admin_inquiry_notifications (
      admin_user_id,
      inquiry_id,
      inquiry_type,
      title,
      message,
      read,
      created_at,
      updated_at
    )
    VALUES (
      p_admin_user_id,
      p_inquiry_id,
      p_inquiry_type,
      p_title,
      COALESCE(p_message, 'A new inquiry has been received'),
      FALSE,
      NOW(),
      NOW()
    )
    RETURNING *;
  ELSE
    RETURN QUERY
    INSERT INTO public.admin_inquiry_notifications (
      admin_user_id,
      visitor_inquiry_id,
      inquiry_type,
      title,
      message,
      read,
      created_at,
      updated_at
    )
    VALUES (
      p_admin_user_id,
      p_inquiry_id,
      p_inquiry_type,
      p_title,
      COALESCE(p_message, 'A new visitor inquiry has been received'),
      FALSE,
      NOW(),
      NOW()
    )
    RETURNING *;
  END IF;
END;
$$;
```

---

## 🧪 Plan de verificación posterior a la migración

1. **Enviar una nueva inquiry de visitante.**
   - Confirmar fila creada en `admin_inquiry_notifications` con `inquiry_type='visitor'` y `visitor_inquiry_id` poblado.
2. **Verificar en dashboard admin:**
   - Notificación visible en la campana.
   - Al hacer clic, navegación correcta a `/admin?tab=inquiries&id=<visitor_inquiry_id>`.
3. **Verificar logs del backend:**
   - Sin errores `23503` ni `23514`.
   - Entradas de “RPC Notification params” y “RPC result” válidas.
4. **Validar comportamiento del toast visitante.**
   - Mensaje visible tras `201` indicando que la consulta fue enviada exitosamente.

---

## 🧾 Observaciones adicionales

- **Respaldo previo:** Antes de la alteración, crear una copia temporal:
  ```sql
  CREATE TABLE public._backup_admin_inquiry_notifications AS
  SELECT * FROM public.admin_inquiry_notifications;
  ```
- **No se eliminan notificaciones anteriores.**
- **Compatibilidad:** El hook `useRealtimeNotifications` y la `NotificationBell` ya son compatibles con `visitor_inquiry_id`.
- **Seguridad:** Mantener SECURITY DEFINER en el RPC.

---

## ✅ Resultado esperado

| Elemento                       | Estado final esperado                         |
| ------------------------------ | --------------------------------------------- |
| Notificación admin (visitante) | ✅ Creada correctamente                       |
| UI de campana                  | ✅ Muestra notificación “New visitor inquiry” |
| Navegación desde campana       | ✅ Redirige a inquiry correspondiente         |
| Emails de confirmación         | ✅ Sin impacto                                |
| Integridad de datos            | ✅ Preservada (CHECK + FK dual)               |

---

**Autorización confirmada:**

> Se aprueba aplicar la migración estructural y la actualización del RPC `create_admin_inquiry_notification` según lo especificado.

**Próximo paso:**

> Ejecutar la migración, validar logs y realizar una prueba end-to-end con un nuevo visitante.

---

**Fin del documento — Autorización técnica para el Agente IA**
