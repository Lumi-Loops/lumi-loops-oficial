# 🧩 Instrucciones — Restaurar notificación toast en LeadForm

## 🎯 Objetivo

Asegurar que cuando un visitante envíe correctamente el formulario de consulta (`/api/submit-lead` o `/api/submit-lead-test`), se muestre una notificación toast (Sonner) confirmando el envío exitoso.

---

## 🧠 Contexto actual

- El envío del formulario visitante funciona correctamente (API responde con `201`).
- El correo de confirmación (Resend) se envía y la notificación admin se crea.
- **Sin embargo:** no se muestra ninguna notificación visual (`toast`) al usuario visitante.

Esto indica que el bloque `toast.success()` probablemente falta, está mal ubicado o el `Toaster` no está montado en el layout global.

---

## ⚙️ Implementación solicitada

### 1️⃣ Archivo a revisar

```
src/components/forms/lead-form.tsx
```

### 2️⃣ Dependencia esperada

```tsx
import { toast } from "sonner";
```

### 3️⃣ Ubicación del bloque

Dentro del manejador del formulario (`onSubmit` o `handleSubmit`), justo después de recibir la respuesta del `fetch`:

```tsx
const response = await fetch("/api/submit-lead", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

if (response.ok) {
  toast.success("Your inquiry was sent successfully!", {
    description:
      "We’ve sent you a confirmation email — please check your inbox.",
  });
} else {
  toast.error("Failed to send inquiry", {
    description: "Please try again later.",
  });
}
```

### 4️⃣ Validar presencia del Toaster global

En el layout principal (`src/app/layout.tsx`), confirmar que existe:

```tsx
import { Toaster } from "sonner";

<Toaster position="top-center" richColors />;
```

Si no está presente, insertarlo justo antes del cierre del `<body>` o en el `RootLayout` general.

---

## ✅ Validación posterior

1. Ejecutar `bun run dev`.
2. Enviar un formulario desde la Home page con datos válidos.
3. Verificar:

   | Elemento           | Resultado esperado                                              |
   | ------------------ | --------------------------------------------------------------- |
   | API Response       | 201 Created                                                     |
   | Toast              | Visible en la parte superior (center) con mensaje de éxito      |
   | Logs               | Sin errores `toast is not defined` o `Toaster missing provider` |
   | Correo             | Recibido correctamente                                          |
   | Notificación admin | Visible en dashboard                                            |

---

## 🧩 Documentación

Crear o actualizar el archivo:

```
docs/TOAST-VISITOR-FEEDBACK.md
```

Incluyendo:

- Contexto del problema.
- Código actualizado de `lead-form.tsx`.
- Capturas del toast visible tras envío exitoso.

---

## 🔒 Criterio de éxito

- Toast visible inmediatamente tras envío exitoso (`201`).
- Posición y colores consistentes (`top-center`, `richColors` activado).
- No se afectan otras funciones del formulario ni el envío de correos/notificaciones.

---

**Fin del documento — Restauración de notificación toast en LeadForm**
