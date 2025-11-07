# Supabase Auth Setup

## Requisitos

- Proyecto Supabase activo
- Variables de entorno configuradas en `.env.local`
- `.dev.vars` configurado para desarrollo local

## Pasos de Configuración

### 1. Ejecutar Script SQL en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `docs/SUPABASE-SETUP.sql`
4. Ejecuta el script

Esto creará:

- Tabla `profiles` con campos: id, email, full_name, avatar_url, role, timestamps
- Políticas RLS para usuarios y admins
- Triggers automáticos para crear perfil en signup

### 2. Estructura de la Aplicación

#### Clientes Supabase

- `src/lib/supabase-browser.ts` - Cliente para frontend (public)
- API routes usan instancias locales de cliente

#### Autenticación

- `src/components/providers/AuthProvider.tsx` - Context provider global
- `src/hooks/useAuth.ts` - Hook para acceder a usuario y métodos auth
- `src/hooks/useUserRole.ts` - Hook para obtener el role del usuario

#### Componentes de Protección

- `<AuthGuard>` - Protege rutas para usuarios autenticados
- `<AdminGuard>` - Protege rutas solo para admins

#### Páginas de Auth

- `/auth/signin` - Formulario de inicio de sesión
- `/auth/signup` - Formulario de registro
- `/auth/verify-email` - Confirmación de email

#### APIs

- `GET /api/user/role` - Obtener role del usuario autenticado
- `GET /api/profile` - Obtener perfil del usuario
- `POST /api/profile` - Crear perfil
- `PATCH /api/profile` - Actualizar perfil

### 3. Usar en Componentes

#### Obtener usuario autenticado

```tsx
"use client";
import { useAuth } from "@/hooks/useAuth";

export function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return <div>Hello, {user.email}</div>;
}
```

#### Proteger rutas

```tsx
import { AuthGuard } from "@/components/auth/AuthGuard";

export function ProtectedPage() {
  return (
    <AuthGuard>
      <div>This is protected</div>
    </AuthGuard>
  );
}
```

#### Rutas solo para admins

```tsx
import { AdminGuard } from "@/components/auth/AdminGuard";

export function AdminPage() {
  return (
    <AdminGuard>
      <div>Admin panel</div>
    </AdminGuard>
  );
}
```

#### Obtener role del usuario

```tsx
"use client";
import { useUserRole } from "@/hooks/useUserRole";

export function RoleInfo() {
  const { role, isAdmin, isClient } = useUserRole();

  return <div>Role: {role}</div>;
}
```

### 4. Roles

Existen dos roles en la aplicación:

- **admin** - Acceso completo, puede ver/editar todos los perfiles, eliminar usuarios
- **client** - Acceso limitado, solo puede ver/editar su propio perfil

Los perfiles se crean automáticamente como `client` en el signup. Los admins deben ser designados manualmente en Supabase.

### 5. Verificación

Para verificar que todo está configurado correctamente:

1. Crear un usuario nuevo en `/auth/signup`
2. Verificar que el perfil se cree automáticamente en la tabla `profiles`
3. Navegar a `/dashboard/profile` (debe estar protegido)
4. Verificar que RLS está funcionando correctamente

## Troubleshooting

**Usuario no puede acceder a su perfil:**

- Verificar que RLS está habilitado en tabla `profiles`
- Verificar que las políticas están correctas
- Revisar logs en Supabase

**Perfil no se crea en signup:**

- Verificar que el trigger `on_auth_user_created` existe
- Revisar logs en Supabase para errores

**Role siempre es 'client':**

- Verificar que el perfil tiene role = 'client' por defecto
- Para promover a admin, actualizar manualmente en Supabase
