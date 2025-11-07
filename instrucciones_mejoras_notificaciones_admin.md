# 🧩 Instrucciones al Agente IA — Mejoras de Notificaciones en el Panel Admin

## 📅 Contexto

El sistema de notificaciones del proyecto Lumiloops ya funciona correctamente en backend y Supabase.  
El flujo de creación y recepción de notificaciones fue validado satisfactoriamente:

- El RPC `create_admin_inquiry_notification` inserta correctamente.
- El admin recibe notificaciones en el icono de la campana.

Sin embargo, se identificaron mejoras necesarias en la **visualización, navegación y contenido** de las notificaciones en el dashboard del administrador.

---

## 🚨 Problemas Detectados

### 1️⃣ Descripciones genéricas en las notificaciones

Actualmente las notificaciones muestran solo texto genérico como:

```
Notification • 1m ago
```

No incluyen información relevante sobre quién envió la inquiry o el contexto del mensaje.

### 2️⃣ La pestaña “Notifications” (en `/admin?tab=notifications`) no refleja las notificaciones reales

El tab sigue cargando datos desde `admin_notifications_queue` (viejo sistema de mailing), en lugar de `admin_inquiry_notifications`.

### 3️⃣ El clic sobre una notificación en el menú dropdown no redirige

La función `handleNotificationClick()` aún espera columnas antiguas (`notification_type`, `response_id`) y no navega hacia la inquiry correspondiente.

---

## ✅ Objetivo General

Optimizar la **experiencia de usuario del panel admin**, asegurando que:

- Las notificaciones incluyan datos relevantes del cliente.
- El tab “Notifications” muestre la lista actualizada de notificaciones.
- El clic en la campana redirija correctamente a la inquiry relacionada.

---

## ⚙️ Recomendaciones Generales para el Agente

> ⚠️ Antes de aplicar cualquier cambio, **revisa si el archivo o componente ya existe o tiene un comportamiento similar**.  
> No crees duplicados de componentes. Si un archivo ya maneja lógica parecida, extiéndelo o refactorízalo.  
> Revisa la lógica actual antes de reemplazar código literal: **usa estas sugerencias como guía**, no como copia exacta.  
> El objetivo es mantener consistencia funcional con el resto del sistema.

---

## 🧩 1. Enriquecer la información de las notificaciones

**Archivo sugerido:** `/src/app/api/submit-inquiry/route.ts`

### Revisión previa

Verifica que la llamada al RPC `create_admin_inquiry_notification` se realiza con `supabaseAdmin`.  
Si es así, revisa los parámetros `p_title` y `p_message` y modifica su contenido para incluir información contextual (nombre del cliente, email, tipo de servicio).

### Ejemplo sugerido (no literal)

```typescript
await supabaseAdmin.rpc("create_admin_inquiry_notification", {
  p_admin_user_id: admin.id,
  p_inquiry_id: inquiry.id,
  p_inquiry_type: "client",
  p_title: `New inquiry from ${clientProfile.full_name || "Unknown Client"}`,
  p_message: `A new inquiry has been submitted by ${clientProfile.full_name || "a client"} (${clientProfile.email}). Service: ${inquiry.service_type || "General"}.`,
});
```

> 💡 Si ya existe una lógica similar, solo ajusta el texto dinámico. No dupliques funciones ni imports.

---

## 🧩 2. Sincronizar la pestaña de “Notifications” con la tabla `admin_inquiry_notifications`

**Archivo principal a revisar:** `/src/app/admin/page.tsx`

### Revisión previa

Busca el componente que actualmente se renderiza en el tab “Notifications”.  
Por ejemplo:

```tsx
<NotificationQueueAdmin />
```

Si este componente aún usa `admin_notifications_queue`, refactorízalo para consultar `admin_inquiry_notifications`.

### Si no existe un componente adecuado

Antes de crear uno nuevo, verifica que no haya otro listado de notificaciones.  
Solo si no hay ninguno, crea un componente como `AdminInquiryNotificationsList` con la siguiente lógica sugerida (ajústala al estilo y hooks existentes):

```tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminInquiryNotificationsList() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function loadNotifications() {
      const { data, error } = await supabase
        .from("admin_inquiry_notifications")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setNotifications(data);
    }
    loadNotifications();
  }, []);

  if (!notifications.length)
    return (
      <p className="text-muted-foreground text-sm">No notifications found</p>
    );

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="rounded-lg border p-3 hover:bg-muted/30 cursor-pointer"
          onClick={() =>
            (window.location.href = `/admin?tab=inquiries&id=${n.inquiry_id}`)
          }
        >
          <div className="font-semibold">{n.title}</div>
          <p className="text-sm text-muted-foreground">{n.message}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(n.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

> 🔸 Si ya hay un componente similar, extiende su funcionalidad en lugar de crear uno nuevo.

---

## 🧩 3. Corregir la navegación al hacer clic en una notificación del menú de la campana

**Archivo:** `/src/components/NotificationBell.tsx`

### Revisión previa

Busca la función `handleNotificationClick()` y revisa si usa campos obsoletos como `notification_type` o `response_id`.

Si es así, ajústala de esta forma (solo si no existe ya una lógica equivalente):

```tsx
function handleNotificationClick(notification) {
  if (userRole === "admin" && notification.inquiry_id) {
    window.location.href = `/admin?tab=inquiries&id=${notification.inquiry_id}`;
  }
}
```

> 💡 Verifica primero si ya existe una función de navegación unificada.  
> Si la hay, extiende su lógica para admitir `inquiry_id` sin duplicar código.

---

## 🧩 4. (Opcional) Mejorar el resumen visual en la campana

**Archivo:** `/src/components/NotificationBell.tsx`  
Dentro del renderizado de cada notificación, muestra título y resumen breve:

```tsx
<div className="text-sm font-medium">{notification.title}</div>
<p className="text-xs text-muted-foreground">
  {notification.message?.slice(0, 80)}...
</p>
```

> ⚠️ No apliques literal si ya hay estilos definidos. Ajusta el diseño al sistema de UI existente (Shadcn/UI, Tailwind o Radix).

---

## 🧾 Verificación Final

Después de aplicar los cambios:

1. Crear una nueva inquiry desde un usuario cliente.
2. Verificar que la campana muestra:
   - Título y resumen dinámico (nombre del cliente, tipo de servicio).
   - Badge y animación correctos.
3. Hacer clic sobre la notificación y comprobar la redirección a `/admin?tab=inquiries&id=<uuid>`.
4. Abrir la pestaña **Notifications** y confirmar que aparece la misma notificación con detalles completos.

---

## ✅ Resultado Esperado

| Elemento            | Estado Final                                          |
| ------------------- | ----------------------------------------------------- |
| Campana             | Muestra título dinámico + descripción resumida        |
| Clic en campana     | Redirige correctamente a la inquiry correspondiente   |
| Tab “Notifications” | Sincronizado con `admin_inquiry_notifications`        |
| Información visible | Cliente, servicio, fecha, descripción breve           |
| Backend             | Sin cambios (RPC y serviceRoleKey siguen funcionando) |

---

**Fin del documento — Instrucciones para el Agente IA (MCP)**
