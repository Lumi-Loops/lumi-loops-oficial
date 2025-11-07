# TOAST — Feedback de Visitante en LeadForm

## Contexto del problema

- El formulario de visitante (`LeadForm`) enviaba correctamente los datos (API `201`), el correo de confirmación y creaba la notificación admin, pero no se mostraba ningún toast visual al usuario.
- Se detectó que, aunque existía un componente `Toaster` personalizado (`src/components/ui/sonner.tsx`), no estaba montado en el layout global.

## Implementación aplicada

1. Provider global del toast:

```tsx
// src/app/layout.tsx
import { Toaster } from "@/components/ui/sonner";

// Dentro de <AuthProvider> y antes del cierre del body
<Toaster position="top-center" richColors />;
```

2. Bloque de feedback en `LeadForm` tras envío exitoso:

```tsx
// src/components/forms/lead-form.tsx
import { toast } from "sonner";

// ... dentro de onSubmit, después de response.ok === true
toast.success("Your inquiry was sent successfully!", {
  description: "We’ve sent you a confirmation email — please check your inbox.",
  duration: 8000,
});

// En caso de error
toast.error("Failed to send inquiry", {
  description: errorMessage,
  duration: 5000,
});
```

3. Componente Toaster (cliente) utilizado:

```tsx
// src/components/ui/sonner.tsx
"use client";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "next-themes";

export const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      {...props}
    />
  );
};
```

## Pasos de prueba

1. Ejecutar `npm run dev` (o `bun run dev`).
2. En la home, completar el `LeadForm` con datos válidos.
3. Verificar:
   - API: `201 Created`.
   - Toast: visible en parte superior (top-center), con colores enriquecidos (richColors).
   - Consola: sin errores (`toast is not defined`, `Toaster missing provider`).
   - Correo: recibido correctamente.
   - Notificación admin: visible en el dashboard.

## Observaciones

- El `Toaster` se montó dentro de `ThemeProvider` y `AuthProvider` para heredar tema y contexto de autenticación.
- El formulario `LeadForm` es un componente cliente (`"use client"`) y usa `sonner` directamente vía `toast`.
- Se mantienen las animaciones y estilos por defecto de Sonner; `richColors` y `position="top-center"` garantizan consistencia visual.

## Capturas

Adjuntar capturas del toast visible tras envío exitoso en diferentes vistas donde se renderiza `LeadForm`.
