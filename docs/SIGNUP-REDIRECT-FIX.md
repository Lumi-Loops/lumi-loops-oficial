# Signup Redirect Fix — Corrección del flujo de registro de visitantes

## Contexto del problema

- El botón "Create My Account" en el correo de confirmación apuntaba a `/signup?ref=<inquiry_id>`.
- La página `/signup` no está integrada con el layout principal ni con el sistema de autenticación.
- La ruta correcta es `/auth/signup`, donde está el formulario real con `ThemeProvider`, `AuthProvider` y `Toaster`.

## Cambios aplicados

1. Actualización del enlace en el correo de confirmación

- Archivo: `src/lib/email/sendVisitorConfirmationEmail.ts`
- Cambio:

```diff
-  }/signup?ref=${inquiryId}`;
  }/auth/signup?ref=${inquiryId}`;
```

- Justificación: Mantener el parámetro `ref` para vincular automáticamente la `visitor_inquiry` al usuario que se registra.

2. Redirección automática de `/signup` a `/auth/signup`

- Archivo: `src/app/signup/page.tsx`
- Implementación (preservando query params para compatibilidad con correos antiguos):

```tsx
import { redirect } from "next/navigation";

export default function SignupRedirect({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const qs = new URLSearchParams();
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === "string" && value.length > 0) {
        qs.set(key, value);
      } else if (Array.isArray(value)) {
        for (const v of value) {
          if (typeof v === "string" && v.length > 0) qs.append(key, v);
        }
      }
    }
  }

  const target = qs.toString() ? `/auth/signup?${qs}` : "/auth/signup";
  redirect(target);
}
```

## Validación del flujo completo

- Prueba 1: Nueva inquiry
  1. Enviar inquiry desde Home.
  2. Abrir correo de confirmación y hacer clic en **Create My Account**.
  3. Resultado esperado: carga `/auth/signup?ref=<inquiry_id>` con layout completo y registro exitoso.

- Prueba 2: Redirección manual
  1. Navegar a `http://localhost:3000/signup`.
  2. Resultado esperado: redirige a `/auth/signup`. Si el enlace antiguo incluía `?ref=<id>`, la redirección preserva parámetros.

## Escenarios adicionales

- Usuario no autenticado: Mostrar formulario de registro normalmente en `/auth/signup`.
- Usuario con sesión activa: Se añadió guard en `src/app/auth/signup/page.tsx` para redirigir a `/dashboard` si existe `user` activo.
- Parámetros inválidos: Si `ref` es inválido o falta, la redirección preserva los parámetros pero el registro funciona igualmente (la vinculación debe manejar omisiones o valores incorrectos sin bloquear el alta).

## Escenarios validados

- Acceso a `/signup?ref=test-inquiry-123` → redirige a `/auth/signup?ref=test-inquiry-123`.
- Acceso a `/auth/signup` sin sesión → muestra `SignUpForm` con layout correcto.
- Acceso a `/auth/signup` con sesión activa → redirige automáticamente a `/dashboard`.

## Criterios de éxito

| Criterio               | Resultado esperado                                  |
| ---------------------- | --------------------------------------------------- |
| Link de correo         | `/auth/signup?ref=<id>`                             |
| Página renderizada     | Formulario con navbar/footer/providers              |
| Registro visitante     | Usuario creado en `auth.users`                      |
| Vinculación automática | `linked_user_id` actualizado en `visitor_inquiries` |
| Redirección `/signup`  | Funciona sin errores y preserva query si existe     |

## Notas

- La ruta `/auth/signup` ya existe: `src/app/auth/signup/page.tsx`.
- El `Toaster` global está montado en `src/app/layout.tsx`.
