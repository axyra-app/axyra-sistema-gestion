# AXYRA - Sistema de Gestión Empresarial

## 🚀 Despliegue a Producción

Este documento contiene las instrucciones completas para desplegar el sistema AXYRA a producción.

## 📋 Requisitos Previos

### Herramientas Necesarias

- Node.js 18+
- Firebase CLI
- Vercel CLI
- Git

### Instalación de Herramientas

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Instalar Vercel CLI
npm install -g vercel

# Verificar instalaciones
firebase --version
vercel --version
```

## 🔧 Configuración

### 1. Autenticación

```bash
# Autenticarse en Firebase
firebase login

# Autenticarse en Vercel
vercel login
```

### 2. Configuración de Firebase

```bash
# Inicializar proyecto Firebase
firebase init

# Seleccionar:
# - Firestore
# - Functions
# - Hosting
# - Storage
```

### 3. Configuración de Vercel

```bash
# Inicializar proyecto Vercel
vercel

# Seguir las instrucciones del asistente
```

## 📁 Estructura de Archivos Optimizada

```
axyra-sistema-gestion/
├── firestore.rules              # Reglas de Firestore consolidadas
├── firestore.indexes.json       # Índices de Firestore consolidados
├── firebase.json                # Configuración de Firebase
├── vercel.json                  # Configuración de Vercel
├── storage.rules                # Reglas de Storage
├── deploy-production.sh         # Script de despliegue
├── api/                         # API endpoints
├── frontend/                    # Aplicación frontend
│   ├── modulos/
│   │   ├── gestion_personal/
│   │   │   └── gestion_personal_optimized.js
│   │   └── cuadre_caja/
│   │       └── cuadre_caja_optimized.js
│   └── static/
└── functions/                   # Cloud Functions
```

## 🚀 Despliegue Automático

### Opción 1: Script Automático (Recomendado)

```bash
# Hacer ejecutable el script
chmod +x deploy-production.sh

# Ejecutar despliegue
./deploy-production.sh
```

### Opción 2: Despliegue Manual

#### 1. Desplegar Firebase

```bash
# Desplegar reglas de Firestore
firebase deploy --only firestore:rules

# Desplegar índices de Firestore
firebase deploy --only firestore:indexes

# Desplegar reglas de Storage
firebase deploy --only storage

# Desplegar Cloud Functions
firebase deploy --only functions

# Desplegar hosting
firebase deploy --only hosting
```

#### 2. Desplegar Vercel

```bash
# Desplegar a producción
vercel --prod
```

## 🔐 Configuración de Seguridad

### Variables de Entorno

Configurar las siguientes variables en Vercel:

```bash
# Firebase
FIREBASE_PROJECT_ID=axyra-48238
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Wompi
WOMPI_PUBLIC_KEY=pub_prod_DMd1RNFhiA3813HZ3YZFsNjSg2beSS00
WOMPI_PRIVATE_KEY=prv_prod_aka7VAtItpCAF3qhVuD8zvt7FUWXduPY
WOMPI_EVENTS_SECRET=your-events-secret

# PayPal
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_ENVIRONMENT=production
```

### Dominios Autorizados

Agregar los siguientes dominios en Firebase Console:

- `axyra.vercel.app`
- `axyra-sistema-gestion.vercel.app`
- Tu dominio personalizado (si aplica)

## 📊 Monitoreo y Mantenimiento

### 1. Verificar Despliegue

```bash
# Verificar estado de Firebase
firebase projects:list

# Verificar estado de Vercel
vercel ls
```

### 2. Logs y Monitoreo

- **Firebase Console**: Monitorear logs de Functions y Firestore
- **Vercel Dashboard**: Monitorear logs de la aplicación
- **Google Analytics**: Configurar para métricas de uso

### 3. Backup y Recuperación

- **Firestore**: Backup automático habilitado
- **Storage**: Backup automático habilitado
- **Código**: Repositorio Git como backup

## 🧪 Pruebas Post-Despliegue

### 1. Funcionalidades Críticas

- [ ] Autenticación de usuarios
- [ ] Gestión de empleados
- [ ] Registro de horas
- [ ] Cuadre de caja
- [ ] Sistema de pagos (Wompi/PayPal)
- [ ] Generación de reportes

### 2. Pruebas de Rendimiento

- [ ] Carga de páginas < 3 segundos
- [ ] Sincronización offline/online
- [ ] Manejo de errores
- [ ] Responsive design

### 3. Pruebas de Seguridad

- [ ] Validación de reglas de Firestore
- [ ] Autenticación requerida
- [ ] Autorización por roles
- [ ] Protección contra XSS/CSRF

## 🔄 Actualizaciones

### Proceso de Actualización

1. Hacer cambios en el código
2. Probar localmente
3. Hacer commit y push a Git
4. Ejecutar script de despliegue
5. Verificar funcionamiento

### Rollback

```bash
# Rollback de Vercel
vercel rollback

# Rollback de Firebase (si es necesario)
firebase hosting:channel:delete [channel-id]
```

## 📞 Soporte

### Contacto

- **Email**: axyra.app@gmail.com
- **Documentación**: Ver carpeta `docs/`
- **Issues**: Crear issue en el repositorio

### Troubleshooting

1. **Error de autenticación**: Verificar tokens de Firebase
2. **Error de pagos**: Verificar configuración de Wompi/PayPal
3. **Error de sincronización**: Verificar reglas de Firestore
4. **Error de rendimiento**: Verificar índices de Firestore

## 📈 Métricas de Producción

### KPIs a Monitorear

- Tiempo de carga de páginas
- Tasa de error de API
- Uso de recursos de Firebase
- Satisfacción del usuario
- Conversión de pagos

### Alertas Configuradas

- Errores críticos de aplicación
- Fallos de pago
- Uso excesivo de recursos
- Intentos de acceso no autorizado

## 🎯 Próximos Pasos

1. **Configurar monitoreo avanzado**
2. **Implementar CI/CD**
3. **Agregar tests automatizados**
4. **Optimizar rendimiento**
5. **Implementar backup automático**

---

**¡Sistema AXYRA listo para producción! 🚀**

Para más información, consulta la documentación completa en la carpeta `docs/`.
