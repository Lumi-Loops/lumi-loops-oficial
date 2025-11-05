# Flujo de Lógica de Negocio para Atender a un Usuario Cliente

## 1. Ingreso del Usuario a la Landing Page

El usuario cliente puede interactuar de dos maneras principales:

### A) Vía Formulario de Contacto (sin registro)

- El usuario completa el formulario en la landing con su nombre, correo y mensaje.
- Se guarda en la base de datos (tabla `visitor_inquiries`) como una consulta de visitante.
- El admin recibe una notificación por correo y puede ver la consulta en el panel de administración.
- Opcionalmente, se envía un correo automático al usuario confirmando que su mensaje fue recibido.

### B) Vía Registro e Inicio de Sesión

- El usuario elige registrarse en la plataforma desde el botón de “Sign Up”.
- Completa su registro y obtiene acceso a su propio dashboard personalizado.
- Desde el dashboard, puede gestionar sus citas, pagos, notificaciones y descargas.

## 2. Funcionalidades del Dashboard del Cliente Registrado

- **Sección de Datos del Usuario:** Permite actualizar su información básica.
- **Gestión de Citas:** Integración con Calendly para agendar videollamadas. Los detalles de las citas se guardan en la tabla `appointments`.
- **Resumen de Paquetes y Pagos:** Puede ver los paquetes disponibles, realizar pagos (registrados en la tabla `payments`) y confirmar sus compras.
- **Notificaciones:** Sección donde recibe actualizaciones en tiempo real (desde la tabla `notifications`), como alertas de que su video está listo para descargar.
- **Descarga de Productos Finales:** Una vez que el video esté listo, el usuario recibe un enlace en su dashboard y por correo para descargar su producto.

## 3. Notificaciones y Correos

- Los eventos importantes (citas, pagos, productos listos) generan notificaciones en el panel del cliente.
- También se envían correos desde el correo empresarial para confirmar registros, consultas recibidas y enlaces de descarga.

---
