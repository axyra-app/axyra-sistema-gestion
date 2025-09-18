# 🚀 AXYRA - Sistema de Gestión Empresarial Optimizado

Sistema completo de gestión empresarial con arquitectura moderna, sistema de membresías robusto y configuración centralizada.

## ✨ **Características Principales**

### 🏗️ **Arquitectura Optimizada**
- **Frontend**: Vercel (Static Hosting) + PWA
- **Backend**: Firebase Functions (Node.js)
- **Base de Datos**: Firestore
- **Autenticación**: Firebase Auth
- **Almacenamiento**: Firebase Storage

### 🎯 **Sistema de Membresías Brutal**
- **4 Planes**: Gratuito, Básico, Profesional, Empresarial
- **Control Total**: Límites por empleados, nóminas, almacenamiento
- **Restricciones Inteligentes**: Bloqueo automático de funcionalidades
- **UI Dinámica**: Elementos se ocultan/muestran según el plan

### ⚙️ **Configuración Centralizada**
- **Variables de Entorno**: Configuración segura
- **Configuración Dinámica**: Cambios en tiempo real
- **Persistencia**: Configuración guardada en localStorage
- **Validación**: Verificación automática de configuración

## 🚀 **Instalación Rápida**

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/axyra-sistema-gestion.git
cd axyra-sistema-gestion

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.production.example .env.local
# Editar .env.local con tus datos

# Desplegar
vercel --prod
```

## 📊 **Planes de Membresía**

| Plan | Precio | Empleados | Nóminas | Almacenamiento | Módulos |
|------|--------|-----------|---------|----------------|---------|
| **Gratuito** | $0 | 5 | 10/mes | 100 MB | Básicos |
| **Básico** | $50,000 | 25 | 50/mes | 500 MB | + Reportes |
| **Profesional** | $150,000 | 100 | 200/mes | 2 GB | + Inventario + Caja |
| **Empresarial** | $300,000 | Ilimitado | Ilimitado | Ilimitado | Todos |

## 🔧 **Configuración**

### Variables de Entorno Requeridas

```env
# Firebase
FIREBASE_API_KEY=tu_api_key
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_AUTH_DOMAIN=tu_auth_domain

# Empresa
EMPRESA_NOMBRE=Tu Empresa
EMPRESA_NIT=123456789-0

# Nómina
SALARIO_MINIMO=1423500
AUXILIO_TRANSPORTE=100000
```

### Configuración de Membresías

```javascript
// Personalizar planes
window.AxyraConfig.set('membresias.planes.free.limite_empleados', 10);
window.AxyraConfig.set('membresias.planes.basic.precio', 75000);
```

## 🎯 **Uso del Sistema de Membresías**

### Verificar Acceso a Módulos

```javascript
// Verificar si el usuario puede acceder a un módulo
if (window.AxyraMembership.canAccessModule('inventario')) {
  // Mostrar funcionalidad de inventario
}

// Verificar límites
if (window.AxyraMembership.canAddEmployee()) {
  // Permitir agregar empleado
}
```

### Interceptar Acciones

```javascript
// El sistema intercepta automáticamente:
// - Clicks en botones con data-module
// - Envío de formularios con data-action
// - Eventos personalizados de AXYRA
```

### Mostrar Restricciones

```html
<!-- Elementos se ocultan automáticamente según el plan -->
<button data-module="inventario" data-action="addProduct">
  Agregar Producto
</button>
```

## 📱 **PWA Features**

- ✅ **Instalable**: Se puede instalar como app
- ✅ **Offline**: Funciona sin conexión
- ✅ **Notificaciones**: Push notifications
- ✅ **Sincronización**: Sincronización automática

## 🔒 **Seguridad**

- **Autenticación**: Firebase Auth
- **Autorización**: Sistema de roles y permisos
- **Validación**: Validación en cliente y servidor
- **Rate Limiting**: Límites de requests
- **Headers de Seguridad**: CSP, HSTS, etc.

## 📈 **Rendimiento**

- **Carga Inicial**: < 2 segundos
- **Code Splitting**: Carga progresiva
- **Cache Inteligente**: Cache de 5 minutos
- **Compresión**: Assets comprimidos
- **CDN**: Distribución global

## 🧪 **Testing**

```bash
# Ejecutar tests
npm test

# Tests de membresías
npm run test:memberships

# Tests de configuración
npm run test:config
```

## 🚀 **Despliegue**

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel --prod
```

### Firebase Hosting

```bash
# Instalar Firebase CLI
npm i -g firebase-tools

# Desplegar
firebase deploy
```

## 📊 **Monitoreo**

- **Vercel Analytics**: Métricas de rendimiento
- **Firebase Analytics**: Eventos de usuario
- **Error Tracking**: Monitoreo de errores
- **Uptime**: Monitoreo de disponibilidad

## 🔧 **Desarrollo**

### Estructura del Proyecto

```
axyra-sistema-gestion/
├── frontend/                 # Frontend optimizado
│   ├── static/              # Assets estáticos
│   │   ├── config-system.js # Sistema de configuración
│   │   ├── membership-system.js # Sistema de membresías
│   │   └── membership-guard.js # Guard de membresías
│   └── index-optimized.html # HTML principal
├── functions/               # Firebase Functions
│   └── index.js            # Cloud Functions
├── docs/                   # Documentación
└── scripts/                # Scripts de despliegue
```

### Comandos de Desarrollo

```bash
# Desarrollo local
npm run dev

# Build
npm run build

# Lint
npm run lint

# Test
npm run test
```

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 **Soporte**

- **Documentación**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/axyra-sistema-gestion/issues)
- **Email**: soporte@axyra.com

## 🎉 **Changelog**

### v2.0.0 - Optimización Completa
- ✅ Sistema de membresías brutal implementado
- ✅ Configuración centralizada
- ✅ Arquitectura optimizada
- ✅ PWA completamente funcional
- ✅ Testing automatizado

---

**¡AXYRA - El sistema de gestión empresarial más potente! 🚀**
