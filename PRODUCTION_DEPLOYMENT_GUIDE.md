# 🚀 Guía Completa de Despliegue Profesional - AXYRA

Esta guía te llevará paso a paso para desplegar AXYRA de manera profesional en producción.

## 📋 **REQUISITOS PREVIOS**

- ✅ Cuenta en [Vercel](https://vercel.com)
- ✅ Cuenta en [Firebase](https://firebase.google.com)
- ✅ Repositorio en GitHub
- ✅ Node.js instalado (versión 18+)
- ✅ Git configurado

## 🏗️ **ARQUITECTURA PROFESIONAL**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRONTEND      │    │   BACKEND       │    │   DATABASE      │
│   Vercel        │◄──►│   Firebase      │◄──►│   Firestore     │
│   Static Host   │    │   Functions     │    │   NoSQL         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   APIs          │    │   Storage       │
│   Global Edge   │    │   Wompi/PayU    │    │   Firebase      │
│   Fast Loading  │    │   Payment APIs  │    │   File Storage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔥 **PASO 1: CONFIGURAR FIREBASE**

### 1.1 **Crear Proyecto Firebase**

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Crear proyecto"
3. **Nombre del proyecto**: `axyra-enterprise`
4. **ID del proyecto**: `axyra-enterprise` (se genera automáticamente)
5. **Región**: `us-central1` (recomendado)
6. Habilita Google Analytics (opcional)

### 1.2 **Configurar Firestore Database**

1. Ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. **Modo**: "Modo de prueba" (cambiar a producción después)
4. **Ubicación**: `us-central1` (debe coincidir con Functions)
5. Haz clic en "Habilitar"

### 1.3 **Configurar Authentication**

1. Ve a "Authentication"
2. Haz clic en "Comenzar"
3. **Proveedores**:
   - ✅ Correo electrónico/contraseña
   - ✅ Google (opcional)
   - ✅ Microsoft (opcional)
4. **Configuración**:
   - Dominio autorizado: `axyra-enterprise-management.vercel.app`
   - Dominio autorizado: `localhost:3000` (desarrollo)

### 1.4 **Configurar Functions**

1. Ve a "Functions"
2. Haz clic en "Comenzar"
3. **Plan**: Blaze (Pay as you go) - necesario para Functions
4. **Región**: `us-central1`

### 1.5 **Configurar Storage**

1. Ve a "Storage"
2. Haz clic en "Comenzar"
3. **Reglas**: Modo de prueba (cambiar después)
4. **Ubicación**: `us-central1`

## 🔧 **PASO 2: CONFIGURAR FIREBASE CLI**

### 2.1 **Instalar Firebase CLI**

```bash
# Instalar Firebase CLI globalmente
npm install -g firebase-tools

# Verificar instalación
firebase --version
```

### 2.2 **Hacer Login y Configurar Proyecto**

```bash
# Hacer login en Firebase
firebase login

# Verificar login
firebase projects:list

# Configurar proyecto
firebase use --add
# Selecciona: axyra-enterprise

# Verificar configuración
firebase use
```

## 🚀 **PASO 3: DESPLEGAR BACKEND (FIREBASE FUNCTIONS)**

### 3.1 **Instalar Dependencias**

```bash
# Navegar a la carpeta functions
cd functions

# Instalar dependencias
npm install

# Verificar que no hay errores
npm run lint
```

### 3.2 **Configurar Variables de Entorno**

```bash
# Configurar variables básicas
firebase functions:config:set app.name="AXYRA Enterprise Management"
firebase functions:config:set app.version="1.0.0"
firebase functions:config:set app.environment="production"

# Configurar Wompi (reemplaza con tus claves reales)
firebase functions:config:set wompi.public_key="pub_test_xxx"
firebase functions:config:set wompi.private_key="prv_test_xxx"
firebase functions:config:set wompi.environment="sandbox"
firebase functions:config:set wompi.webhook_secret="whsec_xxx"

# Configurar PayU (reemplaza con tus claves reales)
firebase functions:config:set payu.merchant_id="123456"
firebase functions:config:set payu.api_key="abc123"
firebase functions:config:set payu.api_login="def456"
firebase functions:config:set payu.environment="sandbox"

# Configurar SMTP (reemplaza con tus credenciales)
firebase functions:config:set smtp.host="smtp.gmail.com"
firebase functions:config:set smtp.port="587"
firebase functions:config:set smtp.user="tu_email@gmail.com"
firebase functions:config:set smtp.pass="tu_password"
firebase functions:config:set smtp.from="noreply@axyra.com"

# Configurar seguridad
firebase functions:config:set security.jwt_secret="tu_jwt_secret_muy_seguro_123456789"
firebase functions:config:set security.encryption_key="tu_clave_de_encriptacion_123456789"
firebase functions:config:set security.cors_origin="https://axyra-enterprise-management.vercel.app"

# Configurar notificaciones
firebase functions:config:set fcm.server_key="AAAA..."
firebase functions:config:set fcm.sender_id="123456789"
firebase functions:config:set notifications.push_enabled="true"
```

### 3.3 **Desplegar Functions**

```bash
# Desplegar todas las functions
firebase deploy --only functions

# Verificar despliegue
firebase functions:list
```

### 3.4 **Desplegar Reglas de Firestore**

```bash
# Desplegar reglas de seguridad
firebase deploy --only firestore:rules

# Verificar reglas
firebase firestore:rules:get
```

### 3.5 **Desplegar Índices**

```bash
# Desplegar índices
firebase deploy --only firestore:indexes

# Verificar índices
firebase firestore:indexes
```

### 3.6 **Desplegar Reglas de Storage**

```bash
# Desplegar reglas de storage
firebase deploy --only storage

# Verificar reglas
firebase storage:rules:get
```

## 🌐 **PASO 4: CONFIGURAR FRONTEND (VERCEL)**

### 4.1 **Conectar con Vercel**

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Haz clic en "New Project"
3. **Import Git Repository**: Selecciona `axyra-sistema-gestion`
4. **Framework Preset**: `Other`
5. **Root Directory**: `./frontend`
6. **Build Command**: (dejar vacío)
7. **Output Directory**: (dejar vacío)

### 4.2 **Configurar Variables de Entorno en Vercel**

1. Ve a "Settings" > "Environment Variables"
2. Agrega las siguientes variables:

```bash
# Variables básicas
NODE_ENV=production
APP_NAME=AXYRA Enterprise Management
APP_VERSION=1.0.0
APP_ENVIRONMENT=production

# Firebase (reemplaza con tus credenciales reales)
FIREBASE_API_KEY=AIzaSyC...
FIREBASE_AUTH_DOMAIN=axyra-enterprise.firebaseapp.com
FIREBASE_PROJECT_ID=axyra-enterprise
FIREBASE_STORAGE_BUCKET=axyra-enterprise.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX

# Wompi
WOMPI_PUBLIC_KEY=pub_test_xxx
WOMPI_PRIVATE_KEY=prv_test_xxx
WOMPI_ENVIRONMENT=sandbox
WOMPI_WEBHOOK_SECRET=whsec_xxx

# PayU
PAYU_MERCHANT_ID=123456
PAYU_API_KEY=abc123
PAYU_API_LOGIN=def456
PAYU_ENVIRONMENT=sandbox

# Seguridad
JWT_SECRET=tu_jwt_secret_muy_seguro_123456789
ENCRYPTION_KEY=tu_clave_de_encriptacion_123456789
CORS_ORIGIN=https://axyra-enterprise-management.vercel.app

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password
SMTP_FROM=noreply@axyra.com

# Notificaciones
FCM_SERVER_KEY=AAAA...
FCM_SENDER_ID=123456789
PUSH_NOTIFICATIONS_ENABLED=true

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### 4.3 **Configurar Dominio Personalizado (Opcional)**

1. Ve a "Settings" > "Domains"
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

### 4.4 **Desplegar Frontend**

1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu proyecto
3. Obtendrás una URL como: `https://axyra-enterprise-management.vercel.app`

## 🔧 **PASO 5: CONFIGURAR APIs DE PAGO**

### 5.1 **Configurar Wompi**

1. Ve a [Wompi](https://wompi.co/)
2. Crea una cuenta
3. **Sandbox**:
   - Public Key: `pub_test_xxx`
   - Private Key: `prv_test_xxx`
4. **Producción**:
   - Public Key: `pub_prod_xxx`
   - Private Key: `prv_prod_xxx`
5. Configura webhooks:
   - URL: `https://us-central1-axyra-enterprise.cloudfunctions.net/processPaymentWebhook`
   - Eventos: `transaction.updated`

### 5.2 **Configurar PayU**

1. Ve a [PayU](https://www.payulatam.com/)
2. Crea una cuenta
3. **Sandbox**:
   - Merchant ID: `123456`
   - API Key: `abc123`
   - API Login: `def456`
4. **Producción**:
   - Merchant ID: `789012`
   - API Key: `xyz789`
   - API Login: `uvw456`

## 🔒 **PASO 6: CONFIGURAR SEGURIDAD**

### 6.1 **Configurar Reglas de Firestore**

Las reglas ya están configuradas en `firestore.rules`. Verifica que estén desplegadas:

```bash
# Verificar reglas
firebase firestore:rules:get

# Si necesitas actualizar
firebase deploy --only firestore:rules
```

### 6.2 **Configurar Headers de Seguridad**

Los headers ya están configurados en `vercel.json`. Verifica que estén activos:

```bash
# Verificar headers
curl -I https://axyra-enterprise-management.vercel.app
```

### 6.3 **Configurar HTTPS**

- ✅ Vercel proporciona HTTPS automáticamente
- ✅ Firebase proporciona HTTPS automáticamente
- ✅ No se requiere configuración adicional

## 📊 **PASO 7: CONFIGURAR MONITOREO**

### 7.1 **Vercel Analytics**

1. Ve a "Analytics" en tu dashboard de Vercel
2. Habilita Vercel Analytics
3. Configura eventos personalizados

### 7.2 **Firebase Analytics**

1. Ve a "Analytics" en Firebase Console
2. Habilita Firebase Analytics
3. Configura eventos personalizados

### 7.3 **Google Analytics**

1. Crea una cuenta en [Google Analytics](https://analytics.google.com/)
2. Crea una propiedad para tu sitio
3. Obtén el ID de seguimiento
4. Agrega el código en tu aplicación

## 🚀 **PASO 8: DESPLIEGUE FINAL**

### 8.1 **Verificar Backend**

```bash
# Verificar que todas las functions estén desplegadas
firebase functions:list

# Verificar que las reglas estén desplegadas
firebase firestore:rules:get
firebase storage:rules:get

# Verificar que los índices estén desplegados
firebase firestore:indexes
```

### 8.2 **Verificar Frontend**

1. Ve a tu URL de Vercel
2. Verifica que la aplicación cargue correctamente
3. Prueba la autenticación
4. Prueba las funcionalidades principales

### 8.3 **Pruebas de Integración**

1. **Autenticación**: Registro y login
2. **APIs**: Crear empleados, registrar horas
3. **Pagos**: Procesar pagos de prueba
4. **Notificaciones**: Enviar notificaciones
5. **Reportes**: Generar reportes

## ✅ **CHECKLIST DE DESPLIEGUE**

### **Firebase**

- [ ] Proyecto creado
- [ ] Firestore configurado
- [ ] Authentication habilitado
- [ ] Functions desplegadas
- [ ] Variables de entorno configuradas
- [ ] Reglas de seguridad desplegadas
- [ ] Índices desplegados
- [ ] Storage configurado

### **Vercel**

- [ ] Proyecto conectado
- [ ] Variables de entorno configuradas
- [ ] Dominio configurado
- [ ] Headers de seguridad activos
- [ ] Analytics habilitado

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
- [ ] Reglas de Storage desplegadas

### **Monitoreo**

- [ ] Vercel Analytics habilitado
- [ ] Firebase Analytics habilitado
- [ ] Google Analytics configurado
- [ ] Logs configurados

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

### 4. **Error de Build en Vercel**

1. Revisa los logs en Vercel Dashboard
2. Verifica que no haya errores de JavaScript
3. Verifica que todas las variables estén configuradas

### 5. **Error de Functions en Firebase**

1. Revisa los logs en Firebase Console
2. Verifica que las variables estén configuradas
3. Verifica que las dependencias estén instaladas

## 🎉 **¡DESPLIEGUE COMPLETADO!**

Tu aplicación AXYRA está ahora desplegada profesionalmente con:

- **Frontend**: Vercel (https://axyra-enterprise-management.vercel.app)
- **Backend**: Firebase Functions (https://us-central1-axyra-enterprise.cloudfunctions.net/api)
- **Base de datos**: Firestore
- **Pagos**: Wompi + PayU
- **Seguridad**: Headers, CORS, reglas de Firestore
- **Monitoreo**: Analytics y logs

## 📞 **SOPORTE**

- **Documentación**: [Guía de Variables de Entorno](./ENVIRONMENT_VARIABLES_GUIDE.md)
- **GitHub**: [Repositorio](https://github.com/axyra-app/axyra-sistema-gestion)
- **Issues**: [Crear un issue](https://github.com/axyra-app/axyra-sistema-gestion/issues)

---

**¡Felicidades! Tu sistema AXYRA está listo para producción! 🚀**
