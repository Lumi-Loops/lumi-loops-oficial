# Configurar Redirect URLs en Supabase

## Pasos en Supabase Dashboard

1. Ve a **Authentication** > **Providers** > **Email**
2. Baja hasta **Redirect URLs**
3. Agrega estas URLs según tu ambiente:

### URLs a agregar

```
# Desarrollo local
http://localhost:3000/auth/callback

# Staging
https://staging.lumiloops.com/auth/callback

# Producción
https://lumiloops.com/auth/callback
```

## Plantilla de Email de Confirmación

En **Email Templates**, edita la plantilla de confirmación (Confirm signup):

```
Confirm your signup

Follow this link to confirm your user:

{{ .ConfirmationURL }}
```

El URL generado será: `{{ .ConfirmationURL }}/auth/callback?token_hash=...&type=signup`

## Plantilla de Reset de Password

Edita la plantilla de **Reset Password**:

```
Reset your password

Click below to reset your password:

{{ .ResetPasswordURL }}
```

## Notas Importantes

- Supabase genera automáticamente los query parameters (`token_hash`, `type`)
- El callback debe estar en la ruta `/auth/callback`
- La query string es generada automáticamente por Supabase
- Múltiples URLs pueden ser agregadas separadas por comas
