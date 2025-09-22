# Configuración de Variables de Entorno para Vercel

## Variables Requeridas

Configura las siguientes variables de entorno en tu proyecto de Vercel:

### Firebase

```
FIREBASE_PROJECT_ID=axyra-48238
FIREBASE_PRIVATE_KEY=your-private-key-here
FIREBASE_CLIENT_EMAIL=your-client-email@axyra-48238.iam.gserviceaccount.com
```

### Wompi

```
WOMPI_PUBLIC_KEY=pub_prod_DMd1RNFhiA3813HZ3YZFsNjSg2beSS00
WOMPI_PRIVATE_KEY=prv_prod_aka7VAtItpCAF3qhVuD8zvt7FUWXduPY
WOMPI_EVENTS_SECRET=your-events-secret-here
```

### PayPal

```
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENVIRONMENT=production
```

## Cómo Configurar

1. Ve a tu proyecto en Vercel Dashboard
2. Ve a Settings > Environment Variables
3. Agrega cada variable con su valor correspondiente
4. Asegúrate de que estén marcadas para "Production", "Preview" y "Development"

## Obtener Credenciales de Firebase

1. Ve a Firebase Console > Project Settings > Service Accounts
2. Genera una nueva clave privada
3. Copia el contenido del archivo JSON
4. Extrae los valores necesarios:
   - `project_id` → FIREBASE_PROJECT_ID
   - `private_key` → FIREBASE_PRIVATE_KEY
   - `client_email` → FIREBASE_CLIENT_EMAIL

## Obtener Credenciales de Wompi

1. Ve a tu dashboard de Wompi
2. Ve a Configuración > API Keys
3. Copia las claves de producción

## Obtener Credenciales de PayPal

1. Ve a PayPal Developer Dashboard
2. Crea una aplicación
3. Copia el Client ID y Client Secret
4. Configura el entorno como "Live" para producción
