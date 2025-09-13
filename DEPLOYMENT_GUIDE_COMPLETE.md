# 🚀 Guía de Despliegue Completa - AXYRA

Esta guía te ayudará a desplegar AXYRA con **Frontend en Vercel** y **Backend en Firebase Functions**.

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Firebase](https://firebase.google.com)
- Repositorio en GitHub
- Node.js instalado (para desarrollo local)

## 🏗️ Arquitectura del Sistema

- **Frontend**: Vercel (Static Hosting)
- **Backend**: Firebase Functions (Serverless)
- **Base de Datos**: Firestore
- **Autenticación**: Firebase Auth
- **Pagos**: Wompi + PayU APIs

## 🔧 Pasos para el Despliegue

### 1. Configurar Firebase

#### 1.1 Crear Proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Haz clic en "Crear proyecto"
3. Nombre: `axyra-sistema-gestion`
4. Habilita Google Analytics (opcional)

#### 1.2 Configurar Firestore

1. Ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Modo de prueba" (cambiar a producción después)
4. Elige una ubicación (us-central1 recomendado)

#### 1.3 Configurar Authentication

1. Ve a "Authentication"
2. Haz clic en "Comenzar"
3. Habilita "Correo electrónico/contraseña"
4. Habilita "Google" (opcional)

#### 1.4 Configurar Functions

1. Ve a "Functions"
2. Haz clic en "Comenzar"
3. Instala Firebase CLI: `npm install -g firebase-tools`
4. Haz login: `firebase login`

### 2. Desplegar Backend (Firebase Functions)

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
```

### 3. Configurar Variables de Entorno

```bash
# Configurar claves de Wompi
firebase functions:config:set wompi.public_key="pub_test_xxx"
firebase functions:config:set wompi.private_key="prv_test_xxx"
firebase functions:config:set wompi.environment="sandbox"

# Configurar claves de PayU
firebase functions:config:set payu.merchant_id="xxx"
firebase functions:config:set payu.api_key="xxx"
firebase functions:config:set payu.api_login="xxx"
firebase functions:config:set payu.environment="sandbox"
```

### 4. Desplegar Frontend (Vercel)

#### 4.1 Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y haz login
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `axyra-sistema-gestion`

#### 4.2 Configurar el Proyecto

- **Framework Preset**: `Other` o `Static`
- **Root Directory**: `./frontend`
- **Build Command**: (dejar vacío)
- **Output Directory**: (dejar vacío)

#### 4.3 Variables de Entorno en Vercel

1. Ve a "Settings" > "Environment Variables"
2. Agrega las variables necesarias:
   - `NODE_ENV=production`
   - `FIREBASE_API_KEY=tu_api_key`
   - `FIREBASE_AUTH_DOMAIN=tu_domain`
   - `FIREBASE_PROJECT_ID=axyra-sistema-gestion`

### 5. Actualizar Configuración de Firebase

Actualiza el archivo `firebase-config.js` con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: 'tu_api_key',
  authDomain: 'axyra-sistema-gestion.firebaseapp.com',
  projectId: 'axyra-sistema-gestion',
  storageBucket: 'axyra-sistema-gestion.appspot.com',
  messagingSenderId: '123456789',
  appId: 'tu_app_id',
};
```

### 6. Desplegar

1. Haz clic en "Deploy" en Vercel
2. Vercel construirá y desplegará tu proyecto
3. Obtendrás una URL como: `https://axyra-sistema-gestion.vercel.app`

## 🔧 Configuración Post-Despliegue

### 1. Configurar APIs de Pago

#### Wompi (Recomendado)

1. Regístrate en [Wompi](https://wompi.co/)
2. Obtén tus claves de API
3. Configura las variables de entorno en Firebase

#### PayU (Alternativa)

1. Regístrate en [PayU](https://www.payulatam.com/)
2. Obtén tus credenciales
3. Configura las variables de entorno

### 2. Configurar Dominio Personalizado

#### En Vercel:

1. Ve a "Settings" > "Domains"
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

#### En Firebase:

1. Ve a "Hosting" > "Custom Domain"
2. Agrega tu dominio
3. Configura los DNS

## 📊 Monitoreo y Analytics

### 1. Vercel Analytics

1. Habilita Vercel Analytics en el dashboard
2. Monitorea el rendimiento de tu aplicación

### 2. Firebase Analytics

1. Habilita Firebase Analytics
2. Configura eventos personalizados

### 3. Google Analytics

1. Crea una cuenta en Google Analytics
2. Agrega el código de seguimiento

## 🔒 Seguridad

### 1. Headers de Seguridad

El archivo `vercel.json` incluye headers de seguridad:

- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

### 2. HTTPS

Vercel y Firebase proporcionan HTTPS automáticamente

### 3. Variables de Entorno

Nunca expongas claves secretas en el código

## 🚀 Actualizaciones

### 1. Despliegue Automático

- Cada push a la rama `main` desplegará automáticamente
- Las ramas de desarrollo se desplegarán como previews

### 2. Despliegue Manual

```bash
# Frontend (Vercel)
vercel --prod

# Backend (Firebase)
firebase deploy --only functions
```

## 🔧 Solución de Problemas

### 1. Error 404 en Vercel

- Verifica las rutas en `vercel.json`
- Asegúrate de que los archivos estén en la ubicación correcta

### 2. Error de Build

- Revisa los logs en Vercel
- Verifica que no haya errores de JavaScript

### 3. Problemas de CORS

- Configura las políticas de CORS en Firebase Functions
- Verifica las URLs permitidas

### 4. Error de Firebase Functions

- Verifica que las variables de entorno estén configuradas
- Revisa los logs en Firebase Console

## 📈 Optimización

### 1. Performance

- Usa Vercel Analytics para monitorear
- Optimiza imágenes
- Minimiza CSS y JavaScript

### 2. SEO

- Configura meta tags
- Usa URLs amigables
- Configura sitemap

## 🆘 Soporte

### 1. Vercel Support

- [Documentación de Vercel](https://vercel.com/docs)
- [Comunidad de Vercel](https://github.com/vercel/vercel/discussions)

### 2. Firebase Support

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Comunidad de Firebase](https://firebase.google.com/community)

### 3. AXYRA Support

- Email: soporte@axyra.com
- GitHub Issues: [Crear un issue](https://github.com/JuanFerUran/axyra-sistema-gestion/issues)

## ✅ Checklist de Despliegue

- [ ] Proyecto Firebase creado
- [ ] Firestore configurado
- [ ] Authentication habilitado
- [ ] Functions desplegadas
- [ ] Variables de entorno configuradas
- [ ] Frontend desplegado en Vercel
- [ ] APIs de pago configuradas
- [ ] SSL activo
- [ ] Analytics configurado
- [ ] Pruebas en diferentes dispositivos
- [ ] Documentación actualizada

## 🎉 ¡Listo!

Tu aplicación AXYRA está ahora desplegada con:

- **Frontend**: Vercel
- **Backend**: Firebase Functions
- **Base de datos**: Firestore
- **Pagos**: Wompi/PayU

**URLs de Producción:**

- Frontend: `https://axyra-sistema-gestion.vercel.app`
- Backend: `https://us-central1-axyra-sistema-gestion.cloudfunctions.net/api`

---

**Nota**: Esta guía asume que ya tienes cuentas en Vercel y Firebase. Si necesitas ayuda con alguno de estos pasos, consulta la documentación oficial.
