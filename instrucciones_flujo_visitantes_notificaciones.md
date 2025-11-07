# 🧩 Instrucciones al Agente IA — Implementación del Flujo de Consultas de Visitantes (No Registrados)

## 📅 Contexto

El sistema actual permite que visitantes no registrados envíen consultas desde la página principal, las cuales se guardan correctamente en la tabla `visitor_inquiries`.  
Sin embargo, no se envía ningún correo de confirmación al visitante ni notificación al admin, y las consultas no se vinculan automáticamente cuando el visitante se registra más tarde.

El objetivo es implementar un **flujo completo y automatizado** que conecte la creación de inquiries de visitantes con el sistema de registro y notificación existentes.

---

## 🎯 Objetivos Generales

1. **Enviar un correo automático al visitante** tras enviar una consulta.
2. **Incluir un botón en el correo** para redirigirlo a la página de registro de usuario.
3. **Vincular automáticamente la inquiry con la cuenta creada** cuando el visitante se registre.
4. **Notificar al admin** cuando llega una nueva inquiry de visitante.

---

## ⚙️ Consideraciones previas

- El proyecto ya está configurado con **Resend (SMTP)** y la API Key se encuentra en:
  - **Supabase secrets:** `RESEND_API_KEY`
  - **Variables de entorno:** `process.env.RESEND_API_KEY`
- El sistema de notificaciones admin ya usa **RPC + serviceRoleKey**.
- Las consultas de visitantes se guardan en la tabla `public.visitor_inquiries`.

El agente puede usar directamente la API de Resend para el envío de correos, sin requerir configuración adicional.

---

## 🧩 1. Corregir endpoint de envío

### Archivo

`src/components/forms/lead-form.tsx`

### Instrucciones

- Verificar que el endpoint sea **`/api/submit-lead`** (no `/api/submit-lead-test`).
- Si el código aún apunta al endpoint de test, reemplazarlo.
- Validar que el `fetch` use método `POST` y `Content-Type: application/json`.

---

## 🧩 2. Modificar endpoint `/api/submit-lead`

### Archivo

`src/app/api/submit-lead/route.ts`

### Instrucciones

1. **Después del insert exitoso en `visitor_inquiries`**, agregar lógica para enviar correo al visitante.

2. **Importar Resend:**

```typescript
import { Resend } from "resend";
```

3. **Crear función auxiliar dentro del archivo o en `/lib/email/sendVisitorConfirmationEmail.ts`:**

```typescript
async function sendVisitorConfirmationEmail({ name, email, inquiryId }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const registrationUrl = `https://lumiloops.com/signup?ref=${inquiryId}`;

  await resend.emails.send({
    from: "Lumiloops <no-reply@lumiloops.com>",
    to: email,
    subject: "Thanks for your inquiry — Let's stay in touch!",
    html: `
      <h2 style="font-family:sans-serif;">Hi ${name}, thanks for reaching out to Lumiloops!</h2>
      <p>We've received your inquiry and our team will review it shortly.</p>
      <p>To stay updated and manage your projects easily, we invite you to create your free Lumiloops account.</p>
      <a href="${registrationUrl}" style="display:inline-block;background:#4f46e5;color:white;
         padding:10px 18px;border-radius:6px;text-decoration:none;margin-top:10px;">
         Create My Account
      </a>
      <p style="margin-top:15px;">After registering, your inquiry will be linked automatically to your new account.</p>
      <p>Thank you,<br/>The Lumiloops Team</p>
    `,
  });
}
```

4. **Llamar la función después de guardar la inquiry:**

```typescript
await sendVisitorConfirmationEmail({
  name: validatedData.name,
  email: validatedData.email,
  inquiryId: newInquiry.id,
});
```

> ⚠️ Revisar si existe un sistema similar (`sendInquiryEmail` o `sendClientNotificationEmail`) y reutilizarlo si es compatible.

---

## 🧩 3. Agregar campo `linked_user_id` a la tabla `visitor_inquiries`

Ejecutar migración SQL:

```sql
ALTER TABLE public.visitor_inquiries
ADD COLUMN IF NOT EXISTS linked_user_id uuid NULL REFERENCES auth.users(id);
```

> Este campo permitirá asociar inquiries de visitantes con su nueva cuenta tras el registro.

---

## 🧩 4. Vincular inquiry al registrarse

### Archivo sugerido

`src/app/api/auth/callback/route.ts`  
(o webhook de registro de Supabase si existe)

### Instrucciones

Cuando un usuario complete su registro:

```typescript
await supabase
  .from("visitor_inquiries")
  .update({ linked_user_id: newUser.id })
  .eq("email", newUser.email)
  .is("linked_user_id", null);
```

> Esto vincula automáticamente inquiries previas de visitantes con su nueva cuenta.

---

## 🧩 5. Crear notificación para admin

### Instrucciones

El admin debe recibir una notificación cuando llegue una nueva `visitor_inquiry`.

1. Extender el RPC `create_admin_inquiry_notification` para aceptar `p_inquiry_type = 'visitor'`.

2. En `/api/submit-lead/route.ts`, después del insert y envío de email:

```typescript
const { data: adminProfile } = await supabaseAdmin
  .from("profiles")
  .select("id")
  .eq("role", "admin")
  .single();

if (adminProfile) {
  await supabaseAdmin.rpc("create_admin_inquiry_notification", {
    p_admin_user_id: adminProfile.id,
    p_inquiry_id: newInquiry.id,
    p_inquiry_type: "visitor",
    p_title: `New visitor inquiry from ${validatedData.name}`,
    p_message: `${validatedData.name} (${validatedData.email}) submitted a visitor inquiry.`,
  });
}
```

---

## 🧩 6. Confirmación visual al visitante (Frontend)

**Archivo:** `src/components/forms/lead-form.tsx`

Actualizar mensaje de éxito:

```typescript
toast.success("Thanks for your inquiry!", {
  description:
    "We've sent you an email with a link to create your Lumiloops account.",
  duration: 8000,
});
```

---

## 🧩 7. Verificación posterior

1. Enviar consulta como visitante no registrado.
   - Verificar inserción en `visitor_inquiries`
   - Confirmar recepción del correo Resend
   - Revisar que el enlace lleva a `/signup?ref=<inquiryId>`

2. Registrar usuario con el mismo email.
   - Confirmar actualización automática de `linked_user_id`.

3. Revisar dashboard del admin.
   - Confirmar notificación “New visitor inquiry”.

---

## ✅ Resultado Esperado

| Elemento                        | Estado Final                                  |
| ------------------------------- | --------------------------------------------- |
| Registro de visitor_inquiry     | ✅ Correcto                                   |
| Envío de correo de confirmación | ✅ Usando Resend SMTP                         |
| Vinculación tras registro       | ✅ Automática                                 |
| Notificación al admin           | ✅ RPC extendido (`inquiry_type = 'visitor'`) |
| UX visitante                    | ✅ Mensaje visual + email de seguimiento      |
| Backend                         | ✅ Seguro, reutiliza Resend y RPC existentes  |

---

**Fin del documento — Instrucciones detalladas para el Agente IA (MCP)**
