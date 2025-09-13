# 🔧 Guía Completa de Variables de Entorno - AXYRA

Esta guía te ayudará a configurar todas las variables de entorno necesarias para el despliegue profesional de AXYRA.

## 📋 **VARIABLES DE ENTORNO PARA VERCEL**

### 1. **Configuración Básica de la Aplicación**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Entorno de ejecución |
| `APP_NAME` | `AXYRA Enterprise Management` | Nombre de la aplicación |
| `APP_VERSION` | `1.0.0` | Versión de la aplicación |
| `APP_ENVIRONMENT` | `production` | Entorno de la aplicación |

### 2. **Configuración de Firebase**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `FIREBASE_API_KEY` | `AIzaSyC...` | Clave API de Firebase |
| `FIREBASE_AUTH_DOMAIN` | `axyra-enterprise.firebaseapp.com` | Dominio de autenticación |
| `FIREBASE_PROJECT_ID` | `axyra-enterprise` | ID del proyecto Firebase |
| `FIREBASE_STORAGE_BUCKET` | `axyra-enterprise.appspot.com` | Bucket de almacenamiento |
| `FIREBASE_MESSAGING_SENDER_ID` | `123456789` | ID del remitente de mensajes |
| `FIREBASE_APP_ID` | `1:123456789:web:abc123` | ID de la aplicación |
| `FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` | ID de medición (opcional) |

### 3. **Configuración de APIs de Pago**

#### **Wompi (Recomendado)**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `WOMPI_PUBLIC_KEY` | `pub_test_xxx` | Clave pública de Wompi |
| `WOMPI_PRIVATE_KEY` | `prv_test_xxx` | Clave privada de Wompi |
| `WOMPI_ENVIRONMENT` | `sandbox` o `production` | Entorno de Wompi |
| `WOMPI_WEBHOOK_SECRET` | `whsec_xxx` | Secreto del webhook |

#### **PayU (Alternativa)**
| Variable | Valor | Descripción |
|----------|-------|-------------|
| `PAYU_MERCHANT_ID` | `123456` | ID del comerciante |
| `PAYU_API_KEY` | `abc123` | Clave API de PayU |
| `PAYU_API_LOGIN` | `def456` | Login API de PayU |
| `PAYU_ENVIRONMENT` | `sandbox` o `production` | Entorno de PayU |

### 4. **Configuración de Base de Datos**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DATABASE_URL` | `https://axyra-enterprise.firebaseio.com` | URL de la base de datos |
| `FIRESTORE_EMULATOR_HOST` | `localhost:8080` | Host del emulador (desarrollo) |

### 5. **Configuración de Seguridad**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `JWT_SECRET` | `tu_jwt_secret_muy_seguro` | Secreto para JWT |
| `ENCRYPTION_KEY` | `tu_clave_de_encriptacion` | Clave de encriptación |
| `CORS_ORIGIN` | `https://axyra-enterprise-management.vercel.app` | Origen permitido para CORS |

### 6. **Configuración de Email**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `SMTP_HOST` | `smtp.gmail.com` | Host del servidor SMTP |
| `SMTP_PORT` | `587` | Puerto del servidor SMTP |
| `SMTP_USER` | `tu_email@gmail.com` | Usuario SMTP |
| `SMTP_PASS` | `tu_password` | Contraseña SMTP |
| `SMTP_FROM` | `noreply@axyra.com` | Email remitente |

### 7. **Configuración de Notificaciones**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `FCM_SERVER_KEY` | `AAAA...` | Clave del servidor FCM |
| `FCM_SENDER_ID` | `123456789` | ID del remitente FCM |
| `PUSH_NOTIFICATIONS_ENABLED` | `true` | Habilitar notificaciones push |

### 8. **Configuración de Analytics**

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `GOOGLE_ANALYTICS_ID` | `G-XXXXXXXXXX` | ID de Google Analytics |
| `MIXPANEL_TOKEN` | `abc123` | Token de Mixpanel (opcional) |
| `HOTJAR_ID` | `123456` | ID de Hotjar (opcional) |

## 🔥 **VARIABLES DE ENTORNO PARA FIREBASE FUNCTIONS**

### 1. **Configurar Variables en Firebase**

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Hacer login
firebase login

# Configurar proyecto
firebase use --add

# Configurar variables de entorno
firebase functions:config:set app.name="AXYRA Enterprise Management"
firebase functions:config:set app.version="1.0.0"
firebase functions:config:set app.environment="production"
```

### 2. **Configurar APIs de Pago**

```bash
# Configurar Wompi
firebase functions:config:set wompi.public_key="pub_test_xxx"
firebase functions:config:set wompi.private_key="prv_test_xxx"
firebase functions:config:set wompi.environment="sandbox"
firebase functions:config:set wompi.webhook_secret="whsec_xxx"

# Configurar PayU
firebase functions:config:set payu.merchant_id="123456"
firebase functions:config:set payu.api_key="abc123"
firebase functions:config:set payu.api_login="def456"
firebase functions:config:set payu.environment="sandbox"
```

### 3. **Configurar Email**

```bash
# Configurar SMTP
firebase functions:config:set smtp.host="smtp.gmail.com"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.user="tu_email@gmail.com"
firebase functions:config:set smtp.pass="tu_password"
firebase functions:config:set smtp.from="noreply@axyra.com"
```

### 4. **Configurar Seguridad**

```bash
# Configurar JWT
firebase functions:config:set security.jwt_secret="tu_jwt_secret_muy_seguro"
firebase functions:config:set security.encryption_key="tu_clave_de_encriptacion"

# Configurar CORS
firebase functions:config:set security.cors_origin="https://axyra-enterprise-management.vercel.app"
```

### 5. **Configurar Notificaciones**

```bash
# Configurar FCM
firebase functions:config:set fcm.server_key="AAAA..."
firebase functions:config:set fcm.sender_id="123456789"
firebase functions:config:set notifications.push_enabled="true"
```

## 📋 **PASOS PARA CONFIGURAR EN VERCEL**

### 1. **Acceder a la Configuración**

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto `axyra-enterprise-management`
3. Ve a "Settings" > "Environment Variables"

### 2. **Agregar Variables**

1. Haz clic en "Add New"
2. Completa los campos:
   - **Name**: Nombre de la variable
   - **Value**: Valor de la variable
   - **Environment**: Selecciona "Production", "Preview", "Development" o "All"

### 3. **Variables Críticas para Producción**

```bash
# Variables básicas
NODE_ENV=production
APP_NAME=AXYRA Enterprise Management
APP_VERSION=1.0.0
APP_ENVIRONMENT=production

# Firebase
FIREBASE_API_KEY=tu_api_key
FIREBASE_AUTH_DOMAIN=axyra-enterprise.firebaseapp.com
FIREBASE_PROJECT_ID=axyra-enterprise
FIREBASE_STORAGE_BUCKET=axyra-enterprise.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123

# Wompi
WOMPI_PUBLIC_KEY=pub_test_xxx
WOMPI_PRIVATE_KEY=prv_test_xxx
WOMPI_ENVIRONMENT=sandbox
WOMPI_WEBHOOK_SECRET=whsec_xxx

# Seguridad
JWT_SECRET=tu_jwt_secret_muy_seguro
ENCRYPTION_KEY=tu_clave_de_encriptacion
CORS_ORIGIN=https://axyra-enterprise-management.vercel.app
```

## 📋 **PASOS PARA CONFIGURAR EN FIREBASE**

### 1. **Acceder a Firebase Console**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `axyra-enterprise`
3. Ve a "Functions" > "Configuration"

### 2. **Configurar Variables**

```bash
# Configurar todas las variables de una vez
firebase functions:config:set \
  app.name="AXYRA Enterprise Management" \
  app.version="1.0.0" \
  app.environment="production" \
  wompi.public_key="pub_test_xxx" \
  wompi.private_key="prv_test_xxx" \
  wompi.environment="sandbox" \
  payu.merchant_id="123456" \
  payu.api_key="abc123" \
  payu.api_login="def456" \
  payu.environment="sandbox" \
  smtp.host="smtp.gmail.com" \
  smtp.port="587" \
  smtp.user="tu_email@gmail.com" \
  smtp.pass="tu_password" \
  smtp.from="noreply@axyra.com" \
  security.jwt_secret="tu_jwt_secret_muy_seguro" \
  security.encryption_key="tu_clave_de_encriptacion" \
  security.cors_origin="https://axyra-enterprise-management.vercel.app" \
  fcm.server_key="AAAA..." \
  fcm.sender_id="123456789" \
  notifications.push_enabled="true"
```

### 3. **Verificar Configuración**

```bash
# Ver todas las variables configuradas
firebase functions:config:get

# Ver variables específicas
firebase functions:config:get wompi
firebase functions:config:get payu
firebase functions:config:get smtp
```

## 🔒 **CONSIDERACIONES DE SEGURIDAD**

### 1. **Nunca Exponer Claves Secretas**

- ❌ No incluir claves en el código
- ❌ No subir archivos `.env` al repositorio
- ✅ Usar variables de entorno
- ✅ Usar servicios de gestión de secretos

### 2. **Rotar Claves Regularmente**

- Cambiar claves de API cada 3-6 meses
- Usar diferentes claves para desarrollo y producción
- Monitorear el uso de las claves

### 3. **Validar Variables**

- Verificar que todas las variables estén configuradas
- Usar valores por defecto seguros
- Validar formatos de las variables

## 🚀 **COMANDOS DE DESPLIEGUE**

### 1. **Desplegar Firebase Functions**

```bash
# Instalar dependencias
cd functions
npm install

# Desplegar funciones
firebase deploy --only functions

# Desplegar reglas de Firestore
firebase deploy --only firestore:rules

# Desplegar índices
firebase deploy --only firestore:indexes

# Desplegar reglas de Storage
firebase deploy --only storage
```

### 2. **Desplegar Frontend en Vercel**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod

# O usar el dashboard de Vercel
```

## ✅ **CHECKLIST DE CONFIGURACIÓN**

### **Vercel**
- [ ] Variables básicas configuradas
- [ ] Variables de Firebase configuradas
- [ ] Variables de APIs de pago configuradas
- [ ] Variables de seguridad configuradas
- [ ] Variables de email configuradas
- [ ] Variables de notificaciones configuradas

### **Firebase**
- [ ] Proyecto creado
- [ ] Firestore configurado
- [ ] Authentication habilitado
- [ ] Functions desplegadas
- [ ] Variables de entorno configuradas
- [ ] Reglas de seguridad desplegadas
- [ ] Índices desplegados

### **APIs de Pago**
- [ ] Cuenta Wompi creada
- [ ] Cuenta PayU creada
- [ ] Claves de API obtenidas
- [ ] Webhooks configurados
- [ ] Variables de entorno configuradas

### **Seguridad**
- [ ] JWT configurado
- [ ] Encriptación configurada
- [ ] CORS configurado
- [ ] Headers de seguridad configurados
- [ ] Reglas de Firestore desplegadas

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### 1. **Error de Variables No Encontradas**

```bash
# Verificar variables en Firebase
firebase functions:config:get

# Verificar variables en Vercel
vercel env ls
```

### 2. **Error de CORS**

```bash
# Verificar configuración de CORS
firebase functions:config:get security.cors_origin
```

### 3. **Error de Autenticación**

```bash
# Verificar configuración de Firebase
firebase functions:config:get firebase
```

---

**Nota**: Esta guía asume que ya tienes cuentas en Vercel, Firebase, Wompi y PayU. Si necesitas ayuda con alguno de estos pasos, consulta la documentación oficial.
