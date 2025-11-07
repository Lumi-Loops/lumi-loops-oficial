# INSTRUCCIONES PARA EL AGENTE IA – MEJORA DE INTERFAZ DE PERFIL DEL CLIENTE

> **Continuación lógica** del documento `INSTRUCCIONES_PERFIL_CLIENTE_Y_SINCRONIA.md` y `Manejo Datos Cliente Extension.md`
>
> Objetivo: Optimizar la interfaz de perfil del usuario cliente eliminando elementos innecesarios y reorganizando los campos en secciones coherentes, preparándola para futuras integraciones de avatar mediante autenticación externa.

---

## 🎯 Objetivo General

Reestructurar la interfaz del **perfil de usuario cliente** para lograr:

- Una separación clara entre **Datos personales** y **Datos de la empresa (opcional)**.
- Eliminación del campo actual **Avatar URL**, reemplazándolo por un bloque informativo.
- Preparación visual y estructural para futuras integraciones con proveedores externos (Google, Apple, Facebook) que aportarán avatar y datos personales.

---

## 🔧 Cambios a Realizar

### 1. Eliminar campo innecesario

- **Remover el campo “Avatar URL”** de la interfaz y del payload de actualización.
- Eliminar el manejo de estado y validación asociado a `avatar_url`.

### 2. Crear secciones separadas en la UI

#### **Sección 1: Datos personales**

- Campos:
  - `Email` → solo lectura.
  - `Full Name`
  - `First Name`
  - `Last Name`
  - `Phone` (opcional)
- Validaciones mínimas:
  - `first_name` y `last_name`: requeridos.
  - `phone`: opcional.
- Visual:
  - Agrupar en un contenedor (`div.bg-card`) con título `Datos personales`.
  - Mostrar banner condicional si `name_needs_review = true`.

#### **Sección 2: Datos de la empresa (opcional)**

- Implementar dentro de un **componente desplegable** (Accordion de Shadcn/UI o similar) con el título **“Datos de la empresa (opcional)”**.
- Campos:
  - `business_name`
  - `business_phone`
  - `address_line1` (Street Address)
  - `address_line2` (Address line 2 – opcional)
  - `address_city`
  - `address_state`
  - `address_zip`
- Todos los campos son **opcionales**.
- Asegurar que estos nuevos campos se envíen solo si contienen valores no vacíos (limpieza del payload antes del PATCH).

#### **Sección 3: Avatar (placeholder informativo)**

- Agregar bloque de texto informativo en la sección de “Datos personales”:
  > "Próximamente: se sincronizará automáticamente al conectar tu cuenta con Google, Apple o Facebook."
- No agregar ningún campo interactivo por el momento.

---

## 🧩 Ajustes en la API (solo si es necesario)

- **Actualizar esquema Zod** de validación en `src/app/api/profile/route.ts` para incluir los nuevos campos opcionales, sin romper compatibilidad:

```ts
const profileUpdateSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  full_name: z.string().max(200).optional(),
  phone: z.string().max(30).optional(),
  business_name: z.string().max(200).optional(),
  business_phone: z.string().max(30).optional(),
  address_line1: z.string().max(200).optional(),
  address_line2: z.string().max(200).optional(),
  address_city: z.string().max(100).optional(),
  address_state: z.string().max(100).optional(),
  address_zip: z.string().max(20).optional(),
});
```

- No se debe agregar lógica nueva, solo extender validaciones.

---

## 🧱 Ajustes de Base de Datos (si aún no existen)

Agregar columnas nuevas para dirección y teléfono empresarial:

```sql
alter table public.profiles
  add column if not exists business_phone text,
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists address_city text,
  add column if not exists address_state text,
  add column if not exists address_zip text;
```

---

## 🧠 Consideraciones para el futuro

- Cuando se integre la autenticación externa (Google, Apple, Facebook):
  - Poblar `avatar_url` automáticamente desde el proveedor.
  - Poblar `first_name` y `last_name` solo si están vacíos.
  - No sobrescribir campos ya modificados por el usuario.
- Evaluar agregar un botón de “Subir avatar” manual más adelante.

---

## ✅ Resultado Esperado

- El formulario del perfil se mostrará con una interfaz más limpia y organizada.
- Los datos personales y de empresa estarán claramente diferenciados.
- La estructura quedará preparada para futuras expansiones (SSO, avatar, validaciones regionales).
- Sin ruptura de compatibilidad con la API actual.

---

**Nota para el agente IA:**

No generar nuevo código desde cero. Reutilizar el componente actual `ClientProfile.tsx` y aplicar las modificaciones estructurales descritas. Mantener el mismo estilo visual, validaciones y manejo de estado ya implementado. El objetivo es refactorizar la interfaz y el payload sin alterar la lógica existente de sincronía o validación.
