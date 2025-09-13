# 🚀 Guía de Despliegue en Vercel - AXYRA

Esta guía te ayudará a desplegar AXYRA en Vercel para producción.

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub
- Node.js instalado (opcional, para desarrollo local)

## 🔧 Pasos para el Despliegue

### 1. Preparar el Repositorio

Asegúrate de que tu repositorio tenga los siguientes archivos:

- `vercel.json` ✅
- `package.json` ✅
- `README.md` ✅

### 2. Conectar con Vercel

1. Ve a [vercel.com](https://vercel.com) y haz login
2. Haz clic en "New Project"
3. Conecta tu repositorio de GitHub
4. Selecciona el repositorio `axyra-sistema-gestion`

### 3. Configurar el Proyecto

Vercel detectará automáticamente la configuración desde `vercel.json`:

```json
{
  "version": 2,
  "name": "axyra-sistema-gestion",
  "builds": [
    {
      "src": "frontend/index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    },
    {
      "src": "/",
      "dest": "/frontend/index.html"
    }
  ]
}
```

### 4. Variables de Entorno (Opcional)

Si necesitas configurar variables de entorno:

1. Ve a "Settings" > "Environment Variables"
2. Agrega las variables necesarias:
   - `NODE_ENV=production`
   - `FIREBASE_API_KEY=tu_api_key`
   - `FIREBASE_AUTH_DOMAIN=tu_domain`

### 5. Desplegar

1. Haz clic en "Deploy"
2. Vercel construirá y desplegará tu proyecto
3. Obtendrás una URL como: `https://axyra-sistema-gestion.vercel.app`

## 🌐 Configuración de Dominio Personalizado

### Opción 1: Dominio de Vercel (Gratis)

- Usa la URL proporcionada por Vercel
- Ejemplo: `https://axyra-sistema-gestion.vercel.app`

### Opción 2: Dominio Personalizado

1. Ve a "Settings" > "Domains"
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

## 🔧 Configuración Post-Despliegue

### 1. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita Authentication y Firestore
4. Actualiza la configuración en `firebase-config.js`

### 2. Configurar Pagos

1. Configura tu cuenta de Bancolombia para pagos
2. Configura Nequi para pagos móviles
3. Actualiza las claves de API en el sistema de pagos

### 3. Configurar SSL

Vercel maneja SSL automáticamente, pero puedes:

1. Verificar que el certificado esté activo
2. Configurar redirección HTTPS
3. Configurar headers de seguridad

## 📊 Monitoreo y Analytics

### 1. Vercel Analytics

1. Habilita Vercel Analytics en el dashboard
2. Monitorea el rendimiento de tu aplicación
3. Revisa métricas de uso

### 2. Google Analytics

1. Crea una cuenta en Google Analytics
2. Agrega el código de seguimiento a tu aplicación
3. Configura eventos personalizados

## 🔒 Seguridad

### 1. Headers de Seguridad

El archivo `vercel.json` incluye headers de seguridad:

- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

### 2. HTTPS

Vercel proporciona HTTPS automáticamente

### 3. Variables de Entorno

Nunca expongas claves secretas en el código

## 🚀 Actualizaciones

### 1. Despliegue Automático

- Cada push a la rama `main` desplegará automáticamente
- Las ramas de desarrollo se desplegarán como previews

### 2. Despliegue Manual

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel --prod
```

## 📱 Configuración para Móviles

### 1. PWA (Progressive Web App)

1. Agrega un `manifest.json`
2. Configura el Service Worker
3. Optimiza para móviles

### 2. Responsive Design

- La aplicación ya es responsive
- Prueba en diferentes dispositivos
- Optimiza imágenes

## 🔧 Solución de Problemas

### 1. Error 404

- Verifica las rutas en `vercel.json`
- Asegúrate de que los archivos estén en la ubicación correcta

### 2. Error de Build

- Revisa los logs en Vercel
- Verifica que no haya errores de JavaScript
- Asegúrate de que todas las dependencias estén disponibles

### 3. Problemas de CORS

- Configura las políticas de CORS
- Verifica las URLs permitidas

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

### 2. AXYRA Support

- Email: soporte@axyra.com
- GitHub Issues: [Crear un issue](https://github.com/JuanFerUran/axyra-sistema-gestion/issues)

## ✅ Checklist de Despliegue

- [ ] Repositorio conectado a Vercel
- [ ] Build exitoso
- [ ] URL de producción funcionando
- [ ] Firebase configurado
- [ ] Sistema de pagos configurado
- [ ] SSL activo
- [ ] Analytics configurado
- [ ] Pruebas en diferentes dispositivos
- [ ] Documentación actualizada

## 🎉 ¡Listo!

Tu aplicación AXYRA está ahora desplegada en Vercel y lista para recibir usuarios.

**URL de Producción:** `https://axyra-sistema-gestion.vercel.app`

---

**Nota:** Esta guía asume que ya tienes una cuenta de Vercel y un repositorio en GitHub. Si necesitas ayuda con alguno de estos pasos, consulta la documentación oficial de Vercel.
