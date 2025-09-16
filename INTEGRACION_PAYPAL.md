# 💳 Integración PayPal - AXYRA Sistema de Gestión

## 📋 Descripción

Sistema completo de integración de pagos con PayPal para el sistema AXYRA, incluyendo configuración, implementación y documentación.

## 🚀 Características

- ✅ Integración completa con PayPal Business
- ✅ Soporte para pagos únicos y suscripciones
- ✅ Interfaz de usuario moderna y responsive
- ✅ Manejo de errores robusto
- ✅ Configuración automática para Vercel
- ✅ Soporte para múltiples monedas
- ✅ Webhooks para notificaciones
- ✅ Modo sandbox y producción

## 📁 Archivos Incluidos

### Configuración

- `env.example` - Variables de entorno completas
- `paypal-config.example.js` - Configuración de PayPal
- `vercel-paypal-config.json` - Configuración para Vercel
- `config-paypal-vercel.bat` - Script de configuración automática

### Frontend

- `frontend/static/paypal-integration.js` - Sistema de integración principal

## 🔧 Configuración

### 1. Credenciales de PayPal

Obtén tus credenciales desde [PayPal Developer Dashboard](https://developer.paypal.com/):

```
Client ID: AfphhCNx415bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw
Client Secret: EJnMmqSp2ahikoG2xlUwqd-dtYPtaan3LeuWyE0eF0fkhj;
Merchant ID: (Configurar en PayPal Dashboard)
Webhook ID: (Configurar en PayPal Dashboard)
```

### 2. Variables de Entorno

Configura las siguientes variables en Vercel:

```bash
PAYPAL_CLIENT_ID=AfphhCNx415bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw
PAYPAL_CLIENT_SECRET=EJnMmqSp2ahikoG2xlUwqd-dtYPtaan3LeuWyE0eF0fkhj;
PAYPAL_MERCHANT_ID=(Configurar en PayPal Dashboard)
PAYPAL_WEBHOOK_ID=(Configurar en PayPal Dashboard)
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_BASE_URL=https://api.sandbox.paypal.com
PAYPAL_WEBHOOK_URL=https://axyra-sistema-gestion.vercel.app/api/paypal/webhook
PAYPAL_RETURN_URL=https://axyra-sistema-gestion.vercel.app/payment/success
PAYPAL_CANCEL_URL=https://axyra-sistema-gestion.vercel.app/payment/cancel
```

### 3. Configuración Automática

Ejecuta el script de configuración:

```bash
# Windows
config-paypal-vercel.bat

# O manualmente
vercel env add PAYPAL_CLIENT_ID tu_client_id production
vercel env add PAYPAL_CLIENT_SECRET tu_client_secret production
# ... etc
```

## 💻 Implementación

### 1. Incluir el Script

Agrega el script de PayPal a tu HTML:

```html
<script src="static/paypal-integration.js"></script>
```

### 2. Crear Botones de Pago

```javascript
// Botón de pago simple
const payButton = createPayPalButton({
  amount: 100000,
  description: 'Pago de nómina',
  currency: 'COP',
});

// Botón de suscripción
const subButton = createPayPalSubscriptionButton({
  planId: 'P-123456789',
  amount: 50000,
  description: 'Suscripción mensual',
});
```

### 3. Escuchar Eventos

```javascript
// Escuchar eventos de pago
window.addEventListener('paypal-payment', (event) => {
  const { type, data } = event.detail;

  if (type === 'success') {
    console.log('Pago exitoso:', data);
    // Redirigir o actualizar UI
  }
});
```

## 🎨 Personalización

### Estilos CSS

```css
.paypal-payment-container {
  /* Personalizar modal */
}

.btn-paypal {
  /* Personalizar botón */
}

.paypal-payment-modal {
  /* Personalizar modal */
}
```

### Configuración Avanzada

```javascript
const paypalConfig = {
  clientId: 'tu_client_id',
  currency: 'COP',
  locale: 'es_CO',
  environment: 'sandbox',
  experience: {
    brandName: 'AXYRA Sistema de Gestión',
    logoUrl: 'https://tu-dominio.com/logo.png',
    colorScheme: 'blue',
  },
};
```

## 🔄 Flujo de Pago

1. **Usuario hace clic** en botón de pago
2. **Sistema extrae** datos del pago
3. **Se muestra modal** con detalles
4. **PayPal SDK** se inicializa
5. **Usuario autoriza** el pago
6. **Sistema captura** el pago
7. **Se envía** al servidor
8. **Se confirma** el éxito

## 🛡️ Seguridad

### Validaciones

- ✅ Validación de montos
- ✅ Verificación de webhooks
- ✅ Encriptación de datos sensibles
- ✅ Rate limiting
- ✅ Validación de IPs

### Mejores Prácticas

- 🔒 Nunca expongas el Client Secret en el frontend
- 🔒 Usa HTTPS en producción
- 🔒 Valida webhooks en el servidor
- 🔒 Implementa rate limiting
- 🔒 Registra todas las transacciones

## 🧪 Testing

### Modo Sandbox

```javascript
// Para pruebas
const config = {
  environment: 'sandbox',
  baseUrl: 'https://api.sandbox.paypal.com',
};
```

### Datos de Prueba

```
Email: sb-buyer@personal.example.com
Password: password123
```

## 📊 Monitoreo

### Logs

```javascript
// Habilitar logging detallado
const config = {
  logging: {
    enabled: true,
    level: 'debug',
  },
};
```

### Métricas

- Tasa de conversión
- Tiempo de procesamiento
- Errores por tipo
- Volumen de transacciones

## 🚨 Solución de Problemas

### Errores Comunes

#### "PayPal SDK no está cargado"

```javascript
// Verificar que el script se cargó
if (!window.paypal) {
  console.error('PayPal SDK no disponible');
}
```

#### "Error de autenticación"

```javascript
// Verificar credenciales
console.log('Client ID:', config.clientId);
```

#### "Webhook no funciona"

```javascript
// Verificar URL y configuración
console.log('Webhook URL:', config.webhookUrl);
```

## 📈 Optimización

### Performance

- Lazy loading del SDK
- Caché de configuraciones
- Compresión de respuestas
- CDN para assets

### UX

- Loading states
- Error handling
- Responsive design
- Accesibilidad

## 🔄 Actualizaciones

### Versión 1.0.0

- ✅ Integración básica
- ✅ Pagos únicos
- ✅ Modo sandbox

### Próximas Versiones

- 🔄 Suscripciones
- 🔄 Múltiples monedas
- 🔄 Analytics avanzado
- 🔄 A/B testing

## 📞 Soporte

### Documentación

- [PayPal Developer Docs](https://developer.paypal.com/docs/)
- [PayPal REST API](https://developer.paypal.com/docs/api/overview/)

### Contacto

- Email: jfuran.va@gmail.com
- Sistema: AXYRA Dashboard

## 📄 Licencia

Este sistema está integrado con AXYRA Sistema de Gestión y sigue las políticas de PayPal.

---

**Nota**: Recuerda cambiar a modo producción cuando estés listo para recibir pagos reales.
