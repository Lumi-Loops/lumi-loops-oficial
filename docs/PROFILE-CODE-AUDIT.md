# Auditoría de Código de Perfil de Cliente

Este documento describe los cambios realizados en el API y UI del perfil del cliente para corregir las inconsistencias de visualización y completar la implementación de la sección de perfil.

## API: `src/app/api/profile/route.ts`

- GET: retorna `select('*')` para el usuario autenticado, incluyendo los nuevos campos.
- POST: soporte para creación con validación (Zod) de `first_name`, `last_name`, `full_name`, `business_name`, `avatar_url`, `phone`, `country`, `city`. Deriva `full_name` a partir de `first_name + last_name` si no se proporciona.
- PATCH: validación (Zod) y actualización parcial de los campos anteriores. Sincroniza `full_name` con `first_name + last_name` y limpia `name_needs_review` cuando el usuario proporciona nombre completo.

Fragmento clave de validación y sincronía:

```
const profileUpdateSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  full_name: z.string().max(200).optional(),
  business_name: z.string().max(200).optional(),
  avatar_url: z.string().url().max(500).optional(),
  phone: z.string().max(30).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
});

const derivedFullName = payload.full_name || [payload.first_name, payload.last_name].filter(Boolean).join(" ");
if (derivedFullName) {
  updates.full_name = derivedFullName;
  if ((payload.first_name && payload.last_name) || (payload.full_name && payload.full_name.trim().length > 0)) {
    updates.name_needs_review = false;
  }
}
```

## UI: `src/app/dashboard/profile/page.tsx`

- Añade campos editables: `first_name`, `last_name`, `business_name`, `phone`, `country`, `city`, `avatar_url`.
- Validación en cliente con Zod previa al envío.
- Banner informativo si `name_needs_review` es true.

## UI: `src/components/client/ClientDashboard.tsx`

- Fetch a `/api/profile` para mostrar en el header: `full_name` (o `first_name + last_name`) y `business_name`.
- Mejora la coherencia de identidad del cliente.

## Pruebas realizadas

- Apertura de `http://localhost:3001/dashboard` y `http://localhost:3001/dashboard/profile` sin errores en navegador.
- Se recomienda revisar logs de terminal para asegurar ausencia de errores adicionales.

## Próximos pasos sugeridos

- Validar INSERT/UPDATE complementarios de RLS si se amplían casos de uso.
- Agregar tests e2e (Playwright) para flujos de registro y edición de perfil.
