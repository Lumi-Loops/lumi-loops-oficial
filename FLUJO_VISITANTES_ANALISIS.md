# 🔍 Análisis del Flujo de Visitantes (No Registrados)

## 📋 Resumen General

Cuando un visitante **no registrado** envía una consulta desde el formulario en la página principal, el sistema realiza lo siguiente:

1. **Renderiza** el formulario `LeadForm`
2. **Valida** los datos del cliente (Frontend + Backend)
3. **Guarda** la consulta en la tabla `visitor_inquiries`
4. **Retorna** confirmación al usuario
5. **NO crea notificaciones** para el admin (TBD)

---

## 🎯 Flujo Completo Paso a Paso

### PASO 1: Frontend - Formulario en Landing

**Ubicación:** `src/components/landing/contact-section.tsx`

```
┌─ Página Principal (/)
├─ ContactSection renderiza
└─ LeadForm está disponible para visitantes sin autenticar
```

**Componente:** `src/components/forms/lead-form.tsx`

**Campos Capturados:**

- ✅ name (requerido)
- ✅ email (requerido)
- ⭕ business_name (opcional)
- ⭕ content_type (opcional) - array de checkboxes
- ⭕ platforms (opcional) - array de checkboxes
- ⭕ examples (opcional) - tags/URLs
- ⭕ goal (opcional) - select
- ⭕ budget_range (opcional) - select
- ⭕ contact_preference (opcional) - select
- ⭕ message (opcional) - textarea

**Validación Frontend:**

```typescript
const leadFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  // resto de campos opcionales...
});
```

---

### PASO 2: Frontend - Envío de Datos

**Ubicación:** `src/components/forms/lead-form.tsx` línea 55-88

**Endpoint:**

- Producción: `/api/submit-lead`
- Desarrollo: `/api/submit-lead-test`

**Método:** `POST`

**Payload JSON:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "business_name": "My Company",
  "content_type": ["Short Videos", "Educational"],
  "platforms": ["Instagram", "TikTok"],
  "examples": ["https://example.com/video1", "..."],
  "goal": "Increase Sales",
  "budget_range": "$500-$1000",
  "contact_preference": "Email proposal",
  "message": "Tell us more about your project..."
}
```

**Feedback al Usuario (Frontend):**

- 🔄 Toast: "Sending your request..."
- ✅ Éxito: "Thank you! We'll contact you soon." (5s)
- ❌ Error: "Failed to submit request" + mensaje específico

---

### PASO 3: Backend - Validación Inicial

**Ubicación:** `src/app/api/submit-lead/route.ts` línea 20-62

**Secuencia:**

1. **Parsing JSON**

   ```typescript
   const body = await request.json();
   ```

2. **Validación con Zod**

   ```typescript
   const validatedData = leadFormSchema.parse(body);
   ```

   - Si falla: Retorna 400 con detalles de error

3. **Crear Cliente Supabase**
   - Usa `anonKey` (no autenticado)
   - Usa cookies del navegador

4. **Verificación de Usuario**

   ```typescript
   const {
     data: { user },
   } = await supabase.auth.getUser();

   if (user) {
     // Si está autenticado, rechaza
     return { success: false, error: "...", status: 403 };
   }
   ```

   - **Importante:** Si el usuario está autenticado, redirige a `/dashboard`
   - Fuerza el uso de `/api/submit-inquiry` para usuarios registrados

---

### PASO 4: Backend - Inserción en BD

**Ubicación:** `src/app/api/submit-lead/route.ts` línea 64-87

**Tabla:** `visitor_inquiries`

**Inserción:**

```sql
INSERT INTO visitor_inquiries (
  name,
  email,
  business_name,
  content_type,
  platforms,
  examples,
  goal,
  budget_range,
  contact_preference,
  message,
  status,
  created_at
) VALUES (...)
```

**Características:**

- ✅ SIN `user_id` (es un visitante)
- ✅ `status: "new"`
- ✅ Timestamp automático
- ✅ Arrays guardados como JSON

**Manejo de Errores:**

```typescript
if (inquiryError) {
  console.error("Error storing inquiry:", inquiryError);
  throw new Error("Failed to store inquiry");
  // Retorna 500
}
```

---

### PASO 5: Backend - Notificación Admin (PENDIENTE)

**Ubicación:** `src/app/api/submit-lead/route.ts` línea 89-106

**Estado Actual:** ⚠️ **NO IMPLEMENTADO COMPLETAMENTE**

**Lógica Actual:**

```typescript
try {
  // Obtiene el admin
  const { data: adminSession } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .single();

  if (adminSession) {
    // NOTA: No se crea notificación
    // Solo logging
    console.info("Visitor inquiry created:", inquiry.id);
  }
} catch (err) {
  console.error("Error in notification creation:", err);
  // No falla la request
}
```

**Problema Identificado:**

- El comentario dice: "For visitor inquiries, we create a notification pointing to client_inquiries"
- Pero la lógica no está implementada
- Solo hace logging de que se creó la inquiry

**Por qué No Hay Notificaciones:**

1. La tabla `admin_inquiry_notifications` está diseñada para `client_inquiries`
2. Las inquiries de visitantes están en tabla diferente: `visitor_inquiries`
3. La FK en `admin_inquiry_notifications.inquiry_id` → `client_inquiries.id`
4. No hay manera de vincular `visitor_inquiries` con las notificaciones del admin

---

### PASO 6: Backend - Respuesta

**Ubicación:** `src/app/api/submit-lead/route.ts` línea 108-116

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Your inquiry has been submitted successfully. We will contact you soon!",
  "id": "uuid-de-la-inquiry"
}
```

**Errores Posibles:**

- `400 Bad Request` - Validación Zod falla
- `403 Forbidden` - Usuario autenticado intenta usar endpoint
- `500 Internal Server Error` - Error en BD o procesamiento

---

### PASO 7: Frontend - Confirmación

**Ubicación:** `src/components/forms/lead-form.tsx` línea 94-102

**Acciones:**

```typescript
// ✅ Toast de éxito
toast.success("Thank you! We'll contact you soon.", {
  description: "Your request has been submitted successfully.",
  duration: 5000,
});

// ✅ Limpiar formulario
reset();

// ✅ Llamar callback opcional
onSuccess?.();
```

---

## 📊 Tabla Comparativa: Visitantes vs Clientes Registrados

| Aspecto           | Visitantes          | Clientes Registrados  |
| ----------------- | ------------------- | --------------------- |
| **Tabla BD**      | `visitor_inquiries` | `client_inquiries`    |
| **User ID**       | ❌ No               | ✅ Sí                 |
| **Autenticación** | ❌ No               | ✅ Sí                 |
| **Endpoint**      | `/api/submit-lead`  | `/api/submit-inquiry` |
| **Validación**    | `leadFormSchema`    | `clientInquirySchema` |
| **Admin Notif.**  | ⚠️ No implementado  | ✅ Sí (tabla nueva)   |
| **Email**         | ❓ Manual           | ✅ Automático         |

---

## 🔴 Problemas Identificados

### 1. Falta de Notificaciones para Visitantes

**Severidad:** Media

**Problema:**

- Las consultas de visitantes se guardan pero el admin no recibe notificación
- El admin debe revisar manualmente la tabla `visitor_inquiries`

**Causa:**

- No hay `admin_visitor_notifications` o equivalente
- La tabla actual `admin_inquiry_notifications` solo funciona con `client_inquiries`

**Impacto:**

- El admin puede perder oportunidades de negocio
- No hay visibilidad en el dashboard

### 2. Sin Integración con Sistema de Notificaciones del Admin

**Severidad:** Media

**Problema:**

- Las notificaciones de visitantes no aparecen en el NotificationBell del admin
- Sistema de notificaciones solo cubre clientes registrados

**Solución Necesaria:**

- Crear tabla `admin_visitor_notifications` similar a `admin_inquiry_notifications`
- O: Extender `admin_inquiry_notifications` para soportar ambos tipos
- O: Sistema unificado de notificaciones

### 3. Flujo de Seguimiento Poco Claro

**Severidad:** Baja

**Problema:**

- No está claro cómo el admin contacta al visitante
- El comentario menciona "email notifications" pero no está implementado

**Observación:**

- Existe endpoint `/api/send-inquiry-email` pero no se usa para visitantes

---

## 📋 Flujo Actual en Diagrama

```
VISITANTE (No registrado)
    ↓
[Página Principal]
    ↓
[ContactSection → LeadForm]
    ↓
[Completa formulario + Submit]
    ↓
POST /api/submit-lead
    ↓
[Backend]
├─ Valida datos (Zod)
├─ Verifica que NO esté autenticado
├─ INSERT en visitor_inquiries
├─ Intenta obtener admin (pero sin acción)
└─ Retorna 201
    ↓
[Frontend]
├─ Toast éxito
├─ Reset formulario
└─ onSuccess callback
    ↓
ADMIN (Dashboard)
❌ NO VE NOTIFICACIÓN
❌ Debe revisar tabla manualmente
```

---

## 🎯 Recomendaciones

### Corto Plazo

1. ✅ Crear sistema de notificaciones para visitantes similar al de clientes
2. ✅ Mostrar contador de visitantes pendientes en dashboard admin
3. ✅ Email automático para admin cuando llega inquiry de visitante

### Mediano Plazo

1. ✅ Unificar sistema de notificaciones (visitantes + clientes)
2. ✅ Panel de gestión para inquiries de visitantes
3. ✅ Respuestas automáticas a visitantes

### Largo Plazo

1. ✅ Sistema de leads automatizado
2. ✅ Scoring de leads (visitantes de alto valor)
3. ✅ Pipeline de conversión

---

## ✅ Estado Actual

**Funcional:** ✅ Sí, parcialmente

- Visitantes pueden enviar consultas
- Datos se guardan correctamente

**Incompleto:** ⚠️ Sí

- Admin no recibe notificaciones
- Sin email automático
- Sin seguimiento visible

**Necesita:** 🔴

- Notificaciones en tiempo real
- Sistema de alertas
- Panel de gestión de visitantes
