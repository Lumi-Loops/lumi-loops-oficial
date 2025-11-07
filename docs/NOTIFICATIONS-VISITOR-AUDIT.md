# Auditoría — Notificaciones Admin para Inquiries de Visitantes

Fecha: 2025-11-06

## Resumen

- Se envió correctamente una inquiry de visitante (Carlos Briceño, yujeriddoffoi-3455@yopmail.com).
- El correo de confirmación llegó al buzón del visitante y el registro existe en `public.visitor_inquiries` con id `3410d479-56a9-42e8-9428-3572dba53c20`.
- No se generó notificación en `admin_inquiry_notifications` (no aparece en la campana ni en la sección de Notifications del admin).

## Causa raíz

- El RPC `public.create_admin_inquiry_notification` fue llamado desde el backend con `p_inquiry_type = 'visitor'` y el `p_inquiry_id` de la tabla `visitor_inquiries`.
- La tabla `public.admin_inquiry_notifications` tiene la constraint:
  - `FOREIGN KEY (inquiry_id) REFERENCES client_inquiries(id)`
- Aunque el `inquiry_type` permite `'visitor'`, el `inquiry_id` está forzado a referenciar únicamente `client_inquiries`. Al intentar insertar una notificación para un visitante, se produce `ERROR: 23503 foreign key violation`.

Evidencia (consultas ejecutadas):

- `visitor_inquiries` contiene el id reportado:
  - `SELECT id, name, email, created_at FROM public.visitor_inquiries ORDER BY created_at DESC LIMIT 10;`
- No existen notificaciones para dicho inquiry:
  - `SELECT * FROM public.admin_inquiry_notifications WHERE inquiry_id = '3410d479-56a9-42e8-9428-3572dba53c20';`
- Intento de ejecución manual del RPC:
  - Error FK: `admin_inquiry_notifications_inquiry_id_fkey` referencia `client_inquiries(id)`.

## Propuesta de solución (DB + RPC)

1. Extender el esquema de `admin_inquiry_notifications` para soportar inquiries de visitantes:

- Agregar columna `visitor_inquiry_id uuid NULL` con FK a `public.visitor_inquiries(id)`.
- Añadir una `CHECK` que garantice coherencia según el tipo:
  - Si `inquiry_type = 'client'`: `inquiry_id NOT NULL` y `visitor_inquiry_id IS NULL`.
  - Si `inquiry_type = 'visitor'`: `visitor_inquiry_id NOT NULL` y `inquiry_id IS NULL`.

2. Actualizar el RPC `create_admin_inquiry_notification` para insertar en la columna adecuada:

- Si `p_inquiry_type = 'client'`: usar `inquiry_id = p_inquiry_id`.
- Si `p_inquiry_type = 'visitor'`: usar `visitor_inquiry_id = p_inquiry_id`.
- Mantener `SECURITY DEFINER` y el retorno de filas. Se puede ampliar el `RETURNS TABLE` para incluir `visitor_inquiry_id`.

### Migración SQL propuesta

```sql
BEGIN;

-- 1) Extender tabla con columna para visitantes
ALTER TABLE public.admin_inquiry_notifications
  ADD COLUMN IF NOT EXISTS visitor_inquiry_id uuid NULL;

ALTER TABLE public.admin_inquiry_notifications
  ADD CONSTRAINT admin_inquiry_notifications_visitor_inquiry_id_fkey
  FOREIGN KEY (visitor_inquiry_id) REFERENCES public.visitor_inquiries(id) ON DELETE CASCADE;

-- 2) Coherencia de referencia según tipo
ALTER TABLE public.admin_inquiry_notifications
  ADD CONSTRAINT admin_inquiry_notifications_reference_check
  CHECK (
    (inquiry_type = 'client' AND inquiry_id IS NOT NULL AND visitor_inquiry_id IS NULL)
    OR
    (inquiry_type = 'visitor' AND visitor_inquiry_id IS NOT NULL AND inquiry_id IS NULL)
  );

-- 3) Actualizar RPC para enrutar id a la columna correspondiente
CREATE OR REPLACE FUNCTION public.create_admin_inquiry_notification(
  p_admin_user_id uuid,
  p_inquiry_id uuid,
  p_inquiry_type varchar,
  p_title varchar,
  p_message text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  admin_user_id uuid,
  inquiry_id uuid,
  visitor_inquiry_id uuid,
  inquiry_type varchar,
  title varchar,
  message text,
  read boolean,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
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
    ) VALUES (
      p_admin_user_id,
      p_inquiry_id,
      p_inquiry_type,
      p_title,
      COALESCE(p_message, 'A new inquiry has been received'),
      FALSE,
      NOW(),
      NOW()
    )
    RETURNING
      admin_inquiry_notifications.id,
      admin_inquiry_notifications.admin_user_id,
      admin_inquiry_notifications.inquiry_id,
      admin_inquiry_notifications.visitor_inquiry_id,
      admin_inquiry_notifications.inquiry_type,
      admin_inquiry_notifications.title,
      admin_inquiry_notifications.message,
      admin_inquiry_notifications.read,
      admin_inquiry_notifications.created_at;
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
    ) VALUES (
      p_admin_user_id,
      p_inquiry_id,
      p_inquiry_type,
      p_title,
      COALESCE(p_message, 'A new inquiry has been received'),
      FALSE,
      NOW(),
      NOW()
    )
    RETURNING
      admin_inquiry_notifications.id,
      admin_inquiry_notifications.admin_user_id,
      admin_inquiry_notifications.inquiry_id,
      admin_inquiry_notifications.visitor_inquiry_id,
      admin_inquiry_notifications.inquiry_type,
      admin_inquiry_notifications.title,
      admin_inquiry_notifications.message,
      admin_inquiry_notifications.read,
      admin_inquiry_notifications.created_at;
  END IF;
END;
$function$;

COMMIT;
```

## Consideraciones de RLS y hooks

- Policies actuales permiten al admin ver sus notificaciones (`admin_user_id = auth.uid()`), no requieren cambios.
- El hook `useRealtimeNotifications` ya consulta `admin_inquiry_notifications` filtrando por `admin_user_id` sin discriminar `inquiry_type`, por lo que las notificaciones de visitantes se verán automáticamente tras la migración.

## Plan de verificación

1. Ejecutar la migración anterior.
2. Reenviar una inquiry de visitante.
3. Confirmar que aparece una nueva fila en `admin_inquiry_notifications` con `inquiry_type='visitor'` y `visitor_inquiry_id` poblado.
4. Verificar que el admin ve la notificación en el icono de la campana y en la sección de Notifications.
5. Log de backend:
   - Ver `RPC Notification params` y `RPC result` sin errores en consola.

## Alternativas

- Eliminar la FK de `inquiry_id` para permitir guardar el id de visitantes en la misma columna. No recomendado: se pierde integridad referencial para clientes.
- Unificar inquiries (cliente/visitante) en una tabla única y normalizar el flujo. Requiere mayor refactor.

## Conclusión

El fallo se debe a la restricción FK que referencia exclusivamente `client_inquiries`. Con la ampliación propuesta (columna `visitor_inquiry_id` + ajuste del RPC) el sistema de notificaciones admin admitirá inquiries de visitantes sin violaciones de integridad y la UI comenzará a mostrar dichas notificaciones.
