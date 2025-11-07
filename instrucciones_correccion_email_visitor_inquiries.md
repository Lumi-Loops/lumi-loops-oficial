# 🧩 Instrucciones al Agente IA — Corrección del Error 23514 en Visitor Inquiries (Email Constraint)

## 📅 Contexto

El envío de formularios de visitantes no registrados está fallando con el siguiente error:

```
Error storing inquiry:
code: 23514
message: new row for relation "visitor_inquiries" violates check constraint "visitor_inquiries_email_check"
```

Esto ocurre al insertar un registro en la tabla `visitor_inquiries`, debido a la **constraint** de Postgres que valida el formato de email:

```sql
((email)::text ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
```

La aplicación permite emails que pasan la validación de **Zod**, pero no cumplen este patrón (por ejemplo, contienen espacios o caracteres internacionales).

---

## ⚠️ Causa raíz

1. El email recibido del formulario no se normaliza (no se recorta ni convierte a minúsculas).
2. La validación `z.string().email()` en el servidor y el cliente es más permisiva que el regex de la BD.
3. Como resultado, Postgres rechaza el insert con `23514` (check constraint violation).

---

## ✅ Objetivo

Evitar errores de inserción normalizando y validando el email antes de guardar en la base de datos, manteniendo consistencia entre frontend, backend y BD.

---

## 🧩 Cambios requeridos

### 1️⃣ En el backend — `src/app/api/submit-lead/route.ts`

#### 🔹 Normalizar el email antes del insert

En el bloque donde se prepara el objeto `validatedData` o `insertData`, agregar:

```typescript
const normalizedEmail = validatedData.email.trim().toLowerCase();
```

Luego, al momento del `insert` en la tabla `visitor_inquiries`, reemplazar:

```typescript
email: validatedData.email,
```

por:

```typescript
email: normalizedEmail,
```

---

#### 🔹 Asegurar que el schema Zod aplique `.trim()`

Si el esquema de validación (leadFormSchema o similar) está definido en este archivo o se importa, actualizarlo:

```typescript
email: z.string().trim().email("Invalid email address"),
```

Esto evita espacios al inicio o fin que causen violación de la constraint.

---

#### 🔹 Mejorar manejo de errores al capturar `inquiryError`

Modificar el bloque de error existente:

```typescript
if (inquiryError) {
  console.error("Error storing inquiry:", inquiryError.message || inquiryError);
  return NextResponse.json(
    { success: false, error: inquiryError.message },
    { status: 400 }
  );
}
```

> Esto devolverá un mensaje claro (“Invalid email format”) al frontend sin lanzar un error genérico 500.

---

### 2️⃣ En el frontend — `src/components/forms/lead-form.tsx`

#### 🔹 Ajustar la validación de email en el schema Zod

Buscar la definición del schema `leadFormSchema` y reemplazar:

```typescript
email: z.string().email("Invalid email address"),
```

por:

```typescript
email: z.string().trim().email("Invalid email address"),
```

Esto elimina espacios invisibles antes de enviar los datos al backend.

---

## 🧩 Verificación posterior

### Pruebas funcionales

1. Enviar formulario con email válido:
   - `john@example.com` → ✅ debe insertarse sin error.
2. Enviar con espacios:
   - `" john@example.com "` → ✅ debe insertarse (espacios recortados).
3. Enviar con email inválido:
   - `"josé@ejemplo.com"` → ❌ debe ser rechazado por validación del servidor (400), sin llegar al insert.
4. Revisar Supabase → confirmar fila insertada en `visitor_inquiries` con email en minúsculas y sin espacios.

### Validación visual

- Confirmar que el toast de éxito aparece correctamente en el frontend.
- Revisar que se envíe el correo de confirmación (`sendVisitorConfirmationEmail`) y la notificación al admin.

---

## 🧰 Resultado esperado

| Elemento                       | Estado Final                              |
| ------------------------------ | ----------------------------------------- |
| Inserción en visitor_inquiries | ✅ Exitosa (sin violar constraint)        |
| Validación frontend/backend    | ✅ Consistente (.trim().toLowerCase())    |
| Emails con espacios            | ✅ Aceptados (recortados automáticamente) |
| Emails inválidos (no ASCII)    | ❌ Rechazados antes del insert            |
| Manejo de errores              | ✅ Devuelve mensaje claro al cliente      |
| Correo y notificación          | ✅ Se envían normalmente                  |

---

**Fin del documento — Instrucciones para el Agente IA (Corrección de flujo de visitantes y validación de email)**
