# 🚀 Guía Rápida de Pruebas — Notificaciones Admin

## 📌 Credentials de Prueba

| Usuario | Email                             | Contraseña       | Rol    |
| ------- | --------------------------------- | ---------------- | ------ |
| Cliente | `brevegreuveive-1046@yopmail.com` | Check .env.local | client |
| Admin   | `lumiloops.dev@gmail.com`         | Check .env.local | admin  |

---

## ✅ Test 1: Crear Nueva Inquiry (5 min)

### Paso 1: Login Cliente

```
1. Ve a http://localhost:3000
2. Click "Sign In"
3. Email: brevegreuveive-1046@yopmail.com
4. Contraseña: (del .env.local)
5. Espera a que cargue el dashboard
```

### Paso 2: Crear Inquiry

```
1. Click "My Inquiries" en sidebar
2. Click "New Project Inquiry"
3. Completa el formulario:
   - Select "Video" + "Photography" (content type)
   - Select "Instagram" + "TikTok" (platforms)
   - Goal: "Increase Engagement"
   - Budget: "$1,000 - $5,000"
   - Message: "I need professional content for my business"
   - Preferred Contact: "Email"
4. Click "Submit"
5. Espera a ver "Inquiry submitted successfully!"
```

### Paso 3: Mantén la sesión abierta

```
No cierres esta ventana - la necesitamos para verificar actualización en tiempo real
```

---

## ✅ Test 2: Verificar Notificación en Admin (5 min)

### Paso 1: Login Admin (nueva ventana/tab)

```
1. Abre nueva ventana: http://localhost:3000
2. Click "Sign In"
3. Email: lumiloops.dev@gmail.com
4. Contraseña: (del .env.local)
5. Espera a que cargue el dashboard admin
```

### Paso 2: Verificar Campana 🔔

```
Debe ver en la esquina superior derecha (AdminHeader):
- ✅ Icono de campana con BADGE ROJO (número)
- ✅ Campana en color AMARILLO (animación bounce)
- ✅ Badge muestra "1" o número de notificaciones

⚠️ Si no ve, espera 5 segundos (polling)
```

### Paso 3: Click en Campana

```
1. Click en el icono de campana
2. Debe ver el dropdown con:
   - ✅ Icono 📋
   - ✅ Título: "New inquiry from Armando García" (o nombre del cliente)
   - ✅ Resumen: Email y tipos de contenido
   - ✅ Timestamp: "just now" o similar
   - ✅ Badge "New" (rojo)

Ejemplo:
  📋 New inquiry from Armando García 🔴 New
    Armando García (email@example.com) submitted a new project inquiry requesting: video, photography
    just now
```

---

## ✅ Test 3: Navegación al Click (3 min)

### Paso 1: Click en la Notificación

```
1. En el dropdown de la campana, CLICK en la notificación
2. Se debe cerrar el dropdown
3. Se debe redirigir a: /admin?tab=inquiries&id=<uuid>
4. La URL debe mostrar el tab "Inquiries" activo
```

### Paso 2: Verificar Marcar como Leída

```
1. Click nuevamente en la campana
2. La notificación debe mostrar ahora:
   - ❌ NO debe tener badge "New"
   - ❌ NO debe estar con fondo resaltado
   - ✅ El badge rojo del icono debe haber desaparecido o reducido
```

---

## ✅ Test 4: Tab Notifications (5 min)

### Paso 1: Navegar a Tab

```
1. En el admin, click en tab "Notifications" (junto a "Inquiries", "Customers", etc.)
2. Debe cargar la nueva vista de notificaciones
```

### Paso 2: Verificar Componente Nuevo

```
Debe ver:
- ✅ Título: "Inquiry Notifications"
- ✅ Descripción: "Notifications for new client inquiries"
- ✅ 3 tarjetas de estadísticas: Total, Unread, Read
- ✅ Filtros: "All", "Unread (1)", "Read (0)"
- ✅ La notificación listada con título y resumen
```

### Paso 3: Probar Filtros

```
1. Click en "Unread" tab
   - Debe mostrar solo notificaciones sin leer
2. Click en "Read" tab
   - Debe mostrar notificaciones leídas
3. Click en "All" tab
   - Debe mostrar todas nuevamente
```

### Paso 4: Probar Acciones

```
En la notificación, hay dos botones a la derecha:
1. 👁️ (Eye) = Mark as read/unread
   - Click para toggle
2. 🗑️ (Delete) = Eliminar
   - Click para borrar la notificación

⚠️ Al eliminar, se actualiza la lista en real-time
```

---

## ✅ Test 5: Actualización en Tiempo Real (Cliente) (3 min)

### Desde el Dashboard del Cliente

```
1. Vuelve a la ventana/tab del cliente
2. Crea OTRA inquiry
3. Vuelve a la ventana del admin
4. La campana debe actualizar automáticamente en ~5 segundos
5. Badge debe incrementar (ahora "2")
6. Nueva notificación debe aparecer en dropdown

⚠️ Si no actualiza, revisa:
   - Console (F12) por errores
   - Que el polling esté funcionando (cada 5 segundos)
```

---

## ✅ Test 6: Edge Cases (Opcional)

### Caso 1: Cliente sin Nombre

```
1. Si el cliente no tiene full_name:
   - Debe mostrar "Unknown Client" en la notificación
   - No debe romper
```

### Caso 2: Sin Tipos de Contenido

```
1. Si no se selecciona content_type:
   - Debe mostrar "General inquiry"
   - No debe romper
```

### Caso 3: Múltiples Inquiries

```
1. Crea 3-4 inquiries desde cliente
2. Admin debe ver todas en el badge
3. Dropdown debe mostrar todas
4. Tab Notifications debe listarlas todas
```

---

## 🐛 Troubleshooting

### Campana no se Actualiza

```
❌ Problema: La campana no muestra notificaciones
✅ Solución:
   1. Refresh página del admin (Ctrl+R)
   2. Verifica logs: Console (F12)
   3. Revisa base de datos: SELECT * FROM admin_inquiry_notifications
   4. Verifica que serviceRoleKey está en .env.local
```

### No Navega al Click

```
❌ Problema: Click en notificación no navega
✅ Solución:
   1. Verifica console (F12) por errores de router
   2. Verifica que inquiry_id existe en la notificación
   3. Revisa URL esperada: /admin?tab=inquiries&id=<uuid>
```

### Tab Notifications está Vacío

```
❌ Problema: Tab Notifications no muestra nada
✅ Solución:
   1. Verifica que AdminInquiryNotificationsList.tsx existe
   2. Refresh la página
   3. Revisa database: SELECT COUNT(*) FROM admin_inquiry_notifications
   4. Revisa console por errores de fetch
```

### Error de Compilación

```
❌ Si: "Parsing ecmascript source code failed"
✅ Solución:
   1. npm run build (para verificar)
   2. Si falla, vuelve a crear AdminInquiryNotificationsList.tsx
   3. Asegúrate que no tiene caracteres escapados
```

---

## 📋 Checklist Final

- [ ] Notificación se crea al submit inquiry
- [ ] Campana muestra badge y animación
- [ ] Título dinámico en dropdown (nombre del cliente)
- [ ] Resumen del mensaje en dropdown
- [ ] Click navega a /admin?tab=inquiries&id=<uuid>
- [ ] Marca como leída correctamente
- [ ] Tab Notifications sincronizado
- [ ] Filtros funcionan (All, Unread, Read)
- [ ] Mark as read/unread en tab funciona
- [ ] Delete en tab funciona
- [ ] Múltiples inquiries se manejan bien

---

## ⏱️ Tiempo Total Estimado: 25 minutos

Si todo está verde ✅ **LAS MEJORAS ESTÁN FUNCIONANDO CORRECTAMENTE**

---

## 📞 Si Necesitas Ayuda

1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor (terminal npm run dev)
3. Revisa la base de datos: SELECT \* FROM admin_inquiry_notifications
4. Verifica que los archivos se modificaron correctamente
5. Ejecuta npm run build para verificar compilación
