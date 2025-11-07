# 🧭 Instrucciones — Corrección de enlace de registro (Signup Redirect Fix)

## 🎯 Objetivo

Corregir el flujo de registro de visitantes desde el correo de confirmación. Actualmente, el botón **“Create My Account”** redirige a `/signup`, una página no integrada al layout principal ni conectada al sistema de autenticación, lo que impide la creación real de usuarios.

---

## 🧩 Diagnóstico

### Problema detectado

- El correo de confirmación generado en `sendVisitorConfirmationEmail.ts` utiliza esta línea:
  ```ts
  const signupUrl = `${baseUrl}/signup?ref=${inquiryId}`;
  ```
- La página `/signup` no corresponde al formulario de registro real.
  - No tiene navbar, footer ni providers.
  - No está vinculada a Supabase Auth o Clerk.
- La ruta correcta es `/auth/signup` (donde se muestra el formulario completo con `ThemeProvider`, `AuthProvider` y `Toaster`).

### Consecuencia

- Los usuarios visitantes que siguen el enlace del correo intentan registrarse sin éxito.
- Aunque se ve un formulario, la acción no crea cuentas reales en Supabase.
- El sistema no puede vincular automáticamente la `visitor_inquiry` con el nuevo usuario registrado.

---

## 🛠️ Solución técnica

### 1️⃣ Actualizar el enlace del correo en `sendVisitorConfirmationEmail.ts`

Ubicación:

```
src/lib/email/sendVisitorConfirmationEmail.ts
```

Busca la línea:

```ts
const signupUrl = `${baseUrl}/signup?ref=${inquiryId}`;
```

Y reemplázala por:

```ts
const signupUrl = `${baseUrl}/auth/signup?ref=${inquiryId}`;
```

> 🔒 Nota: Asegúrate de mantener el query param `ref=${inquiryId}` intacto para que el sistema pueda vincular automáticamente la inquiry una vez que el usuario se registre.

---

### 2️⃣ Implementar redirección automática de `/signup` a `/auth/signup`

Crea un archivo en:

```
src/app/signup/page.tsx
```

Contenido:

```tsx
import { redirect } from "next/navigation";

export default function SignupRedirect() {
  redirect("/auth/signup");
}
```

> Esto asegura compatibilidad futura: aunque algún correo antiguo o usuario escriba `/signup` manualmente, siempre será redirigido correctamente.

---

### 3️⃣ Validar el flujo completo

#### 🔍 Prueba 1: Nueva inquiry

1. Envía una nueva inquiry desde la Home Page.
2. Abre el correo de confirmación recibido.
3. Haz clic en **Create My Account**.

#### ✅ Resultado esperado

- El navegador carga `/auth/signup?ref=<inquiry_id>`.
- Se muestra el formulario completo (con navbar y footer).
- El registro se completa con éxito.
- El usuario queda creado en `auth.users`.
- La inquiry se vincula automáticamente mediante `linked_user_id`.

#### 🔍 Prueba 2: Redirección manual

1. Ingresa manualmente `http://localhost:3000/signup` en el navegador.
2. Verifica que redirige automáticamente a `/auth/signup`.

#### ✅ Resultado esperado

- Sin errores ni loops de redirección.
- URL final: `/auth/signup`.

---

## 📋 Documentación posterior

Crea o actualiza el documento:

```
docs/SIGNUP-REDIRECT-FIX.md
```

Debe incluir:

- Contexto del problema.
- Código actualizado de `sendVisitorConfirmationEmail.ts`.
- Implementación del redirect en `/signup/page.tsx`.
- Pasos de prueba y resultados esperados.

---

## ✅ Criterios de éxito

| Criterio               | Resultado esperado                                   |
| ---------------------- | ---------------------------------------------------- |
| Link del correo        | Lleva a `/auth/signup?ref=<id>`                      |
| Página renderizada     | Formulario completo con navbar/footer                |
| Registro visitante     | Crea usuario en `auth.users`                         |
| Vinculación automática | Se actualiza `linked_user_id` en `visitor_inquiries` |
| Redirección `/signup`  | Funciona sin errores o loops                         |

---

**Fin del documento — Corrección del flujo de registro visitante (Signup Redirect Fix)**

---

## 📌 Estado de implementación (ACTUALIZACIÓN)

- Enlace del correo actualizado: ahora apunta a `/auth/signup?ref=<inquiry_id>`.
- Redirección `/signup` implementada en `src/app/signup/page.tsx` preservando parámetros de query si existen (por compatibilidad con correos antiguos y enlaces manuales).
  - Implementación:
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
          if (typeof value === "string" && value.length > 0) qs.set(key, value);
          else if (Array.isArray(value)) {
            for (const v of value)
              if (typeof v === "string" && v.length > 0) qs.append(key, v);
          }
        }
      }
      const target = qs.toString()
        ? `/auth/signup?${qs.toString()}`
        : "/auth/signup";
      redirect(target);
    }
    ```
- Pruebas ejecutadas: navegación a `/signup` y a `/signup?ref=test` redirigen correctamente a `/auth/signup` preservando la query.
- Documentación creada: `docs/SIGNUP-REDIRECT-FIX.md` con contexto, código y criterios de éxito.
