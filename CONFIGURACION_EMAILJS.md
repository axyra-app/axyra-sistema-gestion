# 📧 CONFIGURACIÓN DE EMAILJS PARA AXYRA

## 🚀 **PASOS PARA CONFIGURAR EMAILJS**

### **PASO 1: Crear cuenta en EmailJS**

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### **PASO 2: Configurar servicio de email**

1. En el dashboard, ve a **"Email Services"**
2. Haz clic en **"Add New Service"**
3. Selecciona tu proveedor de email:
   - **Gmail** (recomendado)
   - **Outlook**
   - **Yahoo**
   - **Otro**

#### **Si eliges Gmail:**

1. Conecta tu cuenta de Gmail
2. Autoriza el acceso
3. Copia el **Service ID** (algo como `service_xxxxxxx`)

### **PASO 3: Crear plantillas de email**

1. Ve a **"Email Templates"**
2. Haz clic en **"Create New Template"**
3. Crea las siguientes plantillas:

#### **Plantilla 1: Bienvenida**

- **Template ID**: `template_welcome`
- **Subject**: `Bienvenido a {{app_name}}`
- **Content**:

```html
<h2>¡Bienvenido a {{app_name}}!</h2>
<p>Hola {{to_name}},</p>
<p>Tu cuenta ha sido creada exitosamente con el rol de <strong>{{user_role}}</strong>.</p>
<p>Puedes acceder al sistema en: <a href="{{app_url}}">{{app_url}}</a></p>
<p>Si tienes alguna pregunta, contacta a: {{support_email}}</p>
<p>Fecha: {{current_date}}</p>
```

#### **Plantilla 2: Recuperación de Contraseña**

- **Template ID**: `template_password_reset`
- **Subject**: `Recuperación de contraseña - {{app_name}}`
- **Content**:

```html
<h2>Recuperación de Contraseña</h2>
<p>Hola {{to_name}},</p>
<p>Has solicitado recuperar tu contraseña.</p>
<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
<p><a href="{{reset_link}}">Restablecer Contraseña</a></p>
<p>Si no solicitaste este cambio, ignora este email.</p>
<p>Fecha: {{current_date}}</p>
```

#### **Plantilla 3: Notificación**

- **Template ID**: `template_notification`
- **Subject**: `{{notification_title}} - {{app_name}}`
- **Content**:

```html
<h2>{{notification_title}}</h2>
<p>Hola {{to_name}},</p>
<p>{{notification_message}}</p>
<p>Tipo: {{notification_type}}</p>
<p>Fecha: {{current_date}} - Hora: {{current_time}}</p>
```

#### **Plantilla 4: Factura**

- **Template ID**: `template_invoice`
- **Subject**: `Factura #{{invoice_number}} - {{app_name}}`
- **Content**:

```html
<h2>Factura #{{invoice_number}}</h2>
<p>Hola {{to_name}},</p>
<p>Adjunto encontrarás la factura por un monto de ${{invoice_amount}}.</p>
<p>Fecha de emisión: {{invoice_date}}</p>
<p>Fecha de vencimiento: {{invoice_due_date}}</p>
<p>Items: {{invoice_items}}</p>
```

#### **Plantilla 5: Reporte**

- **Template ID**: `template_report`
- **Subject**: `{{report_title}} - {{app_name}}`
- **Content**:

```html
<h2>{{report_title}}</h2>
<p>Hola {{to_name}},</p>
<p>Período: {{report_period}}</p>
<p>Resumen: {{report_summary}}</p>
<p>Ver reporte completo: <a href="{{report_url}}">{{report_url}}</a></p>
<p>Fecha: {{current_date}}</p>
```

#### **Plantilla 6: Alerta**

- **Template ID**: `template_alert`
- **Subject**: `ALERTA: {{alert_title}} - {{app_name}}`
- **Content**:

```html
<h2 style="color: red;">🚨 ALERTA DEL SISTEMA</h2>
<p>Hola {{to_name}},</p>
<p><strong>{{alert_title}}</strong></p>
<p>{{alert_message}}</p>
<p>Nivel: {{alert_level}}</p>
<p>Timestamp: {{alert_timestamp}}</p>
```

### **PASO 4: Obtener credenciales**

1. Ve a **"Account"** → **"General"**
2. Copia tu **Public Key** (algo como `xxxxxxxxxxxxxxx`)
3. Ve a **"Email Services"** y copia tu **Service ID**
4. Ve a **"Email Templates"** y copia los **Template IDs**

### **PASO 5: Configurar variables de entorno**

1. Renombra `env.example` a `.env`
2. Llena las siguientes variables:

```bash
# EMAILJS CONFIGURATION
EMAILJS_SERVICE_ID=tu_service_id_aqui
EMAILJS_TEMPLATE_ID=template_welcome
EMAILJS_PUBLIC_KEY=tu_public_key_aqui
EMAILJS_USER_ID=tu_user_id_aqui
```

### **PASO 6: Probar la configuración**

```javascript
// En la consola del navegador
window.axyraEmailJS.testConnection();
```

---

## 🔧 **USO DEL SISTEMA EMAILJS**

### **Enviar email de bienvenida**

```javascript
await window.axyraEmailJS.sendWelcomeEmail('usuario@ejemplo.com', 'Juan Pérez', 'Administrador');
```

### **Enviar notificación**

```javascript
await window.axyraEmailJS.sendNotificationEmail(
  'usuario@ejemplo.com',
  'Juan Pérez',
  'Nueva factura generada',
  'Se ha generado una nueva factura en el sistema',
  'info'
);
```

### **Enviar alerta**

```javascript
await window.axyraEmailJS.sendAlertEmail('admin@axyra.com', 'Administrador', {
  title: 'Error en el sistema',
  message: 'Se ha detectado un error crítico',
  level: 'high',
});
```

### **Enviar email masivo**

```javascript
const recipients = [
  { email: 'usuario1@ejemplo.com', name: 'Usuario 1' },
  { email: 'usuario2@ejemplo.com', name: 'Usuario 2' },
];

await window.axyraEmailJS.sendBulkEmail(recipients, 'template_notification', {
  notification_title: 'Mantenimiento programado',
  notification_message: 'El sistema estará en mantenimiento mañana',
  notification_type: 'maintenance',
});
```

---

## 📊 **MONITOREO Y ESTADÍSTICAS**

### **Verificar estado del sistema**

```javascript
console.log(window.axyraEmailJS.getSystemStatus());
```

### **Plantillas disponibles**

```javascript
console.log(window.axyraEmailJS.getAvailableTemplates());
```

### **Validar email**

```javascript
const isValid = window.axyraEmailJS.validateEmail('usuario@ejemplo.com');
console.log(isValid); // true o false
```

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "EmailJS no está inicializado"**

- Verifica que el script se cargó correctamente
- Revisa la consola para errores de red
- Verifica que las credenciales son correctas

### **Error: "Service not found"**

- Verifica que el Service ID es correcto
- Asegúrate de que el servicio está activo en EmailJS

### **Error: "Template not found"**

- Verifica que el Template ID es correcto
- Asegúrate de que la plantilla existe en EmailJS

### **Emails no llegan**

- Verifica la carpeta de spam
- Revisa que el servicio de email esté configurado correctamente
- Verifica los logs en EmailJS dashboard

---

## 💡 **CONSEJOS Y MEJORES PRÁCTICAS**

### **Límites de EmailJS**

- **Plan gratuito**: 200 emails/mes
- **Plan pago**: Hasta 100,000 emails/mes
- **Rate limit**: 10 emails/minuto

### **Optimización**

- Usa plantillas reutilizables
- Implementa rate limiting
- Monitorea el uso mensual
- Considera el plan pago para producción

### **Seguridad**

- Nunca expongas tu Private Key
- Usa variables de entorno para credenciales
- Valida emails antes de enviar
- Implementa rate limiting

---

## 🎯 **PRÓXIMOS PASOS**

1. **Configurar EmailJS** siguiendo esta guía
2. **Probar el sistema** con emails de prueba
3. **Integrar en el admin-brutal** para notificaciones
4. **Monitorear el uso** y considerar upgrade de plan

---

**¡EmailJS configurado correctamente!** 🎉

El sistema AXYRA ahora puede enviar emails automáticamente sin necesidad de un servidor backend.
