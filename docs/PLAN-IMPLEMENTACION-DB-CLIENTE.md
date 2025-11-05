# Plan de Implementación - Estructura de Base de Datos para Usuario Cliente

## Análisis del Flujo de Usuario Cliente

### Flujos Identificados:

1. **Contacto sin registro** (Landing Page) → `visitor_inquiries`
2. **Registro y login** → Acceso a dashboard
3. **Gestión de citas** → `appointments` (Calendly integration)
4. **Gestión de paquetes y pagos** → `packages`, `payments`
5. **Notificaciones en tiempo real** → `notifications`
6. **Descarga de productos finales** → `downloads`

---

## Estructura de Tablas a Crear

### 1. Tabla: `visitor_inquiries`

**Propósito:** Almacenar contactos desde el formulario de la landing sin registro

```sql
CREATE TABLE public.visitor_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new', -- new, responded, archived
  source VARCHAR(50) DEFAULT 'landing', -- landing, ads, referral, social
  linked_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Para enlazar con usuario registrado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos:**

- `id`: UUID único
- `name`: Nombre del visitante
- `email`: Email de contacto
- `message`: Contenido del mensaje
- `status`: Estado de la consulta (new, responded, archived)
- `source`: Fuente del contacto (landing, ads, referral, social)
- `linked_user_id`: Enlace opcional con usuario que se registró después
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

---

### 2. Tabla: `packages`

**Propósito:** Catálogo de paquetes/servicios disponibles

```sql
CREATE TABLE public.packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  duration_days INTEGER, -- Duración del servicio en días
  features JSONB, -- Array de características
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos:**

- `id`: UUID único
- `name`: Nombre del paquete
- `description`: Descripción detallada
- `price`: Precio en formato decimal
- `duration_days`: Duración del servicio
- `features`: JSON array de características
- `is_active`: Si está disponible para compra
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

---

### 3. Tabla: `appointments`

**Propósito:** Citas agendadas (integración Calendly)

```sql
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calendly_event_id VARCHAR(255), -- ID del evento en Calendly
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL CHECK (scheduled_date > now()),
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no_show
  cancel_reason TEXT, -- Razón de cancelación si aplica
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos:**

- `id`: UUID único
- `user_id`: Referencia al usuario (FK)
- `calendly_event_id`: ID del evento en Calendly
- `scheduled_date`: Fecha y hora de la cita
- `status`: Estado (scheduled, completed, cancelled, no_show)
- `cancel_reason`: Razón de cancelación si aplica
- `notes`: Notas adicionales
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

---

### 4. Tabla: `payments`

**Propósito:** Registro de transacciones de pago

```sql
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE RESTRICT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method VARCHAR(50), -- credit_card, debit_card, paypal, etc.
  transaction_id VARCHAR(255), -- ID de la transacción externa
  paid_at TIMESTAMP WITH TIME ZONE, -- Fecha de confirmación de pago
  metadata JSONB, -- Datos adicionales del pago
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos:**

- `id`: UUID único
- `user_id`: Referencia al usuario (FK)
- `package_id`: Referencia al paquete (FK)
- `amount`: Monto a pagar
- `status`: Estado del pago
- `payment_method`: Método de pago usado
- `transaction_id`: ID de la transacción en proveedor externo
- `paid_at`: Fecha de confirmación de pago (diferente de created_at)
- `metadata`: JSON con datos adicionales
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

---

### 5. Tabla: `notifications`

**Propósito:** Notificaciones en tiempo real para usuarios

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- appointment, payment, download_ready, etc.
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  action_url VARCHAR(500), -- URL para accionar desde la notificación
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos:**

- `id`: UUID único
- `user_id`: Referencia al usuario (FK)
- `type`: Tipo de notificación
- `title`: Título de la notificación
- `message`: Contenido de la notificación
- `action_url`: URL para acción directa
- `read`: Si fue leída
- `created_at`: Fecha de creación

---

### 6. Tabla: `downloads`

**Propósito:** Productos finales disponibles para descargar

---

### 7. Tabla: `event_logs` (Auditoría)

**Propósito:** Registro de eventos críticos para auditoría y debugging

```sql
CREATE TABLE public.event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type VARCHAR(50) NOT NULL, -- appointment_created, payment_completed, download_ready, etc.
  entity_type VARCHAR(50) NOT NULL, -- appointment, payment, download, notification
  entity_id UUID NOT NULL, -- ID de la entidad afectada
  event_data JSONB, -- Datos del evento en formato JSON
  ip_address INET, -- IP del usuario
  user_agent TEXT, -- User agent del browser
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos:**

- `id`: UUID único
- `user_id`: Usuario que ejecutó la acción (puede ser NULL para eventos del sistema)
- `event_type`: Tipo de evento (appointment_created, payment_completed, etc.)
- `entity_type`: Tipo de entidad afectada
- `entity_id`: ID de la entidad afectada
- `event_data`: JSON con datos específicos del evento
- `ip_address`: IP del usuario
- `user_agent`: User agent del navegador
- `created_at`: Fecha del evento

```sql
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE RESTRICT,
  file_url VARCHAR(500) NOT NULL CHECK (file_url ~* '^https?://'),
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT, -- Tamaño del archivo en bytes
  bucket_name VARCHAR(100) DEFAULT 'lumiloops-downloads', -- Bucket de almacenamiento
  storage_path VARCHAR(500), -- Ruta completa en storage
  status VARCHAR(50) DEFAULT 'queued', -- queued, rendering, uploading, ready, expired, failed
  download_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE, -- Fecha de expiración del enlace
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

**Campos:**

- `id`: UUID único
- `user_id`: Referencia al usuario (FK)
- `package_id`: Referencia al paquete (FK)
- `file_url`: URL del archivo para descargar
- `file_name`: Nombre del archivo
- `file_size`: Tamaño en bytes
- `bucket_name`: Bucket de almacenamiento (R2, S3)
- `storage_path`: Ruta completa en el storage
- `status`: Estado (queued, rendering, uploading, ready, expired, failed)
- `download_count`: Número de descargas realizadas
- `expires_at`: Cuándo expira el enlace
- `created_at`: Fecha de creación
- `updated_at`: Última actualización

---

## Relaciones Entre Tablas

```
profiles (auth.users)
  ├── 1:N → appointments
  ├── 1:N → payments
  ├── 1:N → notifications
  ├── 1:N → downloads
  ├── 1:N → event_logs
  └── 1:N → visitor_inquiries (linked_user_id, opcional)

packages
  ├── 1:N → payments
  └── 1:N → downloads
```

---

## Índices Necesarios

```sql
-- Para mejorar queries por usuario
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_downloads_user_id ON public.downloads(user_id);
CREATE INDEX idx_event_logs_user_id ON public.event_logs(user_id);

-- Para queries por estado
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_downloads_status ON public.downloads(status);

-- Para queries por fecha
CREATE INDEX idx_appointments_scheduled_date ON public.appointments(scheduled_date);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

-- Para queries de vendor_inquiries por admin
CREATE INDEX idx_visitor_inquiries_status ON public.visitor_inquiries(status);
CREATE INDEX idx_visitor_inquiries_created_at ON public.visitor_inquiries(created_at);
CREATE INDEX idx_visitor_inquiries_linked_user ON public.visitor_inquiries(linked_user_id);

-- Para queries de event_logs (auditoría)
CREATE INDEX idx_event_logs_event_type ON public.event_logs(event_type);
CREATE INDEX idx_event_logs_entity ON public.event_logs(entity_type, entity_id);
CREATE INDEX idx_event_logs_created_at ON public.event_logs(created_at);
```

---

## RLS Policies

### `visitor_inquiries` - Solo admin puede ver/editar

```sql
-- Admin puede ver todas las consultas
CREATE POLICY admin_view_inquiries ON public.visitor_inquiries
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Admin puede actualizar estado
CREATE POLICY admin_update_inquiries ON public.visitor_inquiries
FOR UPDATE USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
```

### `appointments` - Usuario solo ve sus citas

```sql
CREATE POLICY user_view_own_appointments ON public.appointments
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY user_insert_appointments ON public.appointments
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY user_update_own_appointments ON public.appointments
FOR UPDATE USING (user_id = auth.uid());

-- Admin ve todas
CREATE POLICY admin_view_all_appointments ON public.appointments
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
```

### `payments` - Usuario ve sus pagos

```sql
CREATE POLICY user_view_own_payments ON public.payments
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY user_insert_payments ON public.payments
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Admin ve todas
CREATE POLICY admin_view_all_payments ON public.payments
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
```

### `notifications` - Usuario solo ve sus notificaciones

```sql
CREATE POLICY user_view_own_notifications ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY user_update_own_notifications ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

-- Sistema puede insertar notificaciones
CREATE POLICY system_insert_notifications ON public.notifications
FOR INSERT WITH CHECK (true);
```

### `downloads` - Usuario solo descarga sus archivos

```sql
CREATE POLICY user_view_own_downloads ON public.downloads
FOR SELECT USING (user_id = auth.uid());

-- Admin ve todas
CREATE POLICY admin_view_all_downloads ON public.downloads
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
```

### `packages` - Todos pueden ver paquetes activos

```sql
CREATE POLICY public_view_active_packages ON public.packages
FOR SELECT USING (is_active = true);

-- Admin ve todos
CREATE POLICY admin_view_all_packages ON public.packages
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);
```

### `event_logs` - Solo admin puede ver logs completos

```sql
-- Admin puede ver todos los logs
CREATE POLICY admin_view_all_event_logs ON public.event_logs
FOR SELECT USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- Usuario solo ve sus propios eventos
CREATE POLICY user_view_own_event_logs ON public.event_logs
FOR SELECT USING (user_id = auth.uid());

-- Sistema puede insertar eventos (triggers)
CREATE POLICY system_insert_event_logs ON public.event_logs
FOR INSERT WITH CHECK (true);
```

---

## Triggers

### Auto-update `updated_at` en todas las tablas

```sql
CREATE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas
CREATE TRIGGER update_appointments_timestamp BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_payments_timestamp BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_downloads_timestamp BEFORE UPDATE ON public.downloads
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_packages_timestamp BEFORE UPDATE ON public.packages
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

CREATE TRIGGER update_visitor_inquiries_timestamp BEFORE UPDATE ON public.visitor_inquiries
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- NO AGREGAR TRIGGER A event_logs (es tabla de auditoría inmutable)
```

### Triggers para Registrar Eventos en `event_logs`

```sql
-- Registrar creación de citas
CREATE FUNCTION log_appointment_event()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.event_logs (user_id, event_type, entity_type, entity_id, event_data)
  VALUES (NEW.user_id, 'appointment_created', 'appointment', NEW.id,
          jsonb_build_object('scheduled_date', NEW.scheduled_date, 'status', NEW.status));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER appointment_creation_log AFTER INSERT ON public.appointments
FOR EACH ROW EXECUTE FUNCTION log_appointment_event();

-- Registrar cambios de estado de pagos
CREATE FUNCTION log_payment_event()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO public.event_logs (user_id, event_type, entity_type, entity_id, event_data)
    VALUES (NEW.user_id, 'payment_status_changed', 'payment', NEW.id,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status, 'amount', NEW.amount));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payment_change_log AFTER UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION log_payment_event();

-- Registrar cambios de estado de descargas
CREATE FUNCTION log_download_event()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != NEW.status THEN
    INSERT INTO public.event_logs (user_id, event_type, entity_type, entity_id, event_data)
    VALUES (NEW.user_id, 'download_status_changed', 'download', NEW.id,
            jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER download_change_log AFTER UPDATE ON public.downloads
FOR EACH ROW EXECUTE FUNCTION log_download_event();
```

---

## Plan de Implementación en Fases

### **Fase 1: Tablas Base** (Prioridad Alta)

- [ ] `packages` - Catálogo de servicios
- [ ] `visitor_inquiries` - Contactos desde landing
- [ ] `payments` - Registro de transacciones
- **Commit:** "database: Crear tablas base packages, visitor_inquiries, payments"

### **Fase 2: Tablas de Usuario** (Prioridad Alta)

- [ ] `appointments` - Gestión de citas
- [ ] `downloads` - Productos finales
- **Commit:** "database: Crear tablas appointments y downloads"

### **Fase 3: Notificaciones y Auditoría** (Prioridad Media)

- [ ] `notifications` - Sistema de notificaciones
- [ ] `event_logs` - Sistema de auditoría
- [ ] Crear índices para todas las tablas
- [ ] Crear triggers de auto-timestamp
- **Commit:** "database: Crear tabla notifications, event_logs, índices y triggers"

### **Fase 4: Seguridad (RLS)** (Prioridad Alta)

- [ ] Implementar RLS policies para todas las tablas
- [ ] Verificar permisos de admin y usuario
- **Commit:** "database: Implementar RLS policies completas"

### **Fase 5: Integración con API** (Prioridad Media)

- [ ] Crear rutas API: `/api/appointments`, `/api/payments`, `/api/downloads`, `/api/notifications`
- [ ] Crear rutas API: `/api/packages`, `/api/visitor-inquiries` (admin)
- **Commit:** "feat: Crear API endpoints para gestión de cliente"

### **Fase 6: Documentación** (Prioridad Baja)

- [ ] Actualizar docs/DATABASE-SCHEMA.md con esquema completo
- **Commit:** "docs: Actualizar documentación de schema de base de datos"

---

## Consideraciones Importantes

1. **Seguridad:**
   - Todas las tablas deben tener RLS habilitado
   - Los usuarios solo ven sus datos
   - Admin ve todo

2. **Performance:**
   - Índices en user_id, status, created_at
   - Queries paginadas para listas grandes

3. **Integraciones:**
   - `appointments` integra con Calendly
   - `payments` integra con proveedor de pagos
   - `downloads` conecta con storage (R2, S3)
   - Notificaciones en tiempo real con Supabase Realtime

4. **Validaciones Implementadas:**
   - ✅ Email válido: `CHECK (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')`
   - ✅ Amount positivo: `CHECK (amount > 0)`
   - ✅ Fecha futura en citas: `CHECK (scheduled_date > now())`
   - ✅ URL válida en downloads: `CHECK (file_url ~* '^https?://')`
   - ✅ Estados válidos mediante ENUM-like constraints
   - ✅ Foreign keys con CASCADE/RESTRICT apropiados
   - ✅ Campos NOT NULL donde corresponde

---

## Próximos Pasos

1. Revisar y aprobar este plan
2. Comenzar con Fase 1 (tablas base)
3. Ejecutar migraciones en orden
4. Crear APIs según se complete cada fase
5. Documentar finalmente todo el schema
