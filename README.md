# 🚀 AXYRA - Sistema de Gestión Empresarial

**AXYRA** es un sistema completo de gestión empresarial que incluye gestión de empleados, nóminas, control de horas, cuadre de caja y más. Desarrollado con tecnologías modernas y una interfaz profesional.

## ✨ **Características Principales**

### 🔐 **Sistema de Autenticación**

- **Firebase Authentication** integrado
- **Google OAuth** para inicio de sesión rápido
- **Verificación de email** en tiempo real
- **Sistema de 2FA** personalizado
- **Gestión de sesiones** segura

### 👥 **Gestión de Empleados**

- Registro completo de empleados
- Gestión de departamentos y cargos
- Historial de empleados
- Importación/exportación masiva
- Plantillas profesionales de Excel

### ⏰ **Control de Horas**

- Registro de entrada y salida
- Cálculo automático de horas ordinarias y nocturnas
- Gestión de turnos
- Reportes de tiempo trabajado
- Integración con nóminas

### 💰 **Gestión de Nóminas**

- Cálculo automático de salarios
- Generación de comprobantes
- Gestión de períodos de pago
- Cálculo de prestaciones sociales
- Exportación a Excel profesional

### 🧮 **Cuadre de Caja**

- Registro de facturas
- Control de ingresos por área
- Resumen diario de caja
- Exportación de reportes
- Gestión de métodos de pago

### 📊 **Dashboard Inteligente**

- Estadísticas en tiempo real
- Gráficos de rendimiento
- Actividad reciente
- Indicadores clave de rendimiento
- Resumen ejecutivo

## 🛠️ **Tecnologías Utilizadas**

### **Frontend**

- **HTML5** + **CSS3** moderno
- **JavaScript ES6+** con async/await
- **Font Awesome** para iconografía
- **Responsive Design** para todos los dispositivos

### **Backend & Base de Datos**

- **Firebase Firestore** como base de datos principal
- **Firebase Authentication** para autenticación
- **localStorage** como fallback offline
- **Sistema híbrido** Firebase + localStorage

### **Integraciones**

- **Google OAuth** para autenticación social
- **EmailJS** para verificación de emails
- **SheetJS** para exportación a Excel
- **jsPDF** para generación de PDFs

## 🚀 **Despliegue Rápido**

### **Opción 1: Vercel (Recomendado)**

1. **Fork** este repositorio en GitHub
2. **Conecta** tu cuenta de Vercel
3. **Importa** el proyecto desde GitHub
4. **Configura** las variables de entorno de Firebase
5. **¡Despliega!** en segundos

### **Opción 2: Firebase Hosting**

1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Inicializa: `firebase init hosting`
4. Despliega: `firebase deploy`

### **Opción 3: GitHub Pages**

1. Ve a Settings > Pages en tu repositorio
2. Selecciona la rama `main`
3. Configura el directorio `/frontend`
4. ¡Listo!

## ⚙️ **Configuración de Firebase**

### **1. Crear Proyecto Firebase**

- Ve a [Firebase Console](https://console.firebase.google.com/)
- Crea un nuevo proyecto
- Habilita **Authentication** y **Firestore**

### **2. Configurar Autenticación**

- Habilita **Email/Password**
- Habilita **Google Sign-in**
- Configura dominios autorizados

### **3. Configurar Firestore**

- Crea la base de datos en modo de prueba
- Configura las reglas de seguridad
- Estructura las colecciones

### **4. Obtener Credenciales**

- Ve a Configuración del proyecto
- Copia la configuración de Firebase
- Actualiza `firebase-config.js`

## 📱 **Uso del Sistema**

### **Para Administradores**

1. **Inicia sesión** con tu cuenta Google o email
2. **Verifica tu email** si es la primera vez
3. **Accede al dashboard** para ver estadísticas
4. **Gestiona empleados** desde el módulo correspondiente
5. **Configura parámetros** del sistema

### **Para Usuarios**

1. **Regístrate** con tu email
2. **Verifica tu cuenta** con el código enviado
3. **Inicia sesión** en el sistema
4. **Accede a los módulos** según tu rol

## 🔧 **Desarrollo Local**

### **Requisitos**

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (VS Code recomendado)
- Cuenta de Firebase

### **Instalación**

1. **Clona** el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/axyra.git
   cd axyra
   ```

2. **Configura Firebase**:

   - Copia tu configuración de Firebase
   - Actualiza `frontend/static/firebase-config.js`

3. **Abre** `frontend/index.html` en tu navegador

4. **¡Listo para desarrollar!**

## 📁 **Estructura del Proyecto**

```
axyra/
├── frontend/                 # Frontend principal
│   ├── modulos/             # Módulos de la aplicación
│   │   ├── dashboard/       # Dashboard principal
│   │   ├── empleados/       # Gestión de empleados
│   │   ├── horas/           # Control de horas
│   │   ├── nomina/          # Gestión de nóminas
│   │   └── cuadre_caja/     # Cuadre de caja
│   ├── static/              # Archivos estáticos
│   │   ├── firebase-config.js
│   │   ├── firebase-user-system.js
│   │   ├── firebase-data-system.js
│   │   └── axyra-styles.css
│   ├── login.html           # Página de login
│   ├── register.html        # Página de registro
│   └── index.html           # Página principal
├── plantillas/              # Plantillas Excel
├── README.md                # Este archivo
└── .gitignore              # Archivos a ignorar
```

## 🎯 **Próximas Funcionalidades**

- [ ] **App móvil** nativa para Android/iOS
- [ ] **Notificaciones push** en tiempo real
- [ ] **Reportes avanzados** con gráficos interactivos
- [ ] **Integración con bancos** para pagos automáticos
- [ ] **Sistema de roles** y permisos avanzados
- [ ] **API REST** para integraciones externas
- [ ] **Backup automático** en la nube
- [ ] **Multi-idioma** (Español, Inglés, Portugués)

## 🤝 **Contribuir**

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 **Soporte**

- **Email**: soporte@axyra.com
- **Documentación**: [docs.axyra.com](https://docs.axyra.com)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/axyra/issues)

## 🙏 **Agradecimientos**

- **Firebase** por la infraestructura robusta
- **Vercel** por el hosting gratuito
- **Comunidad open source** por las librerías utilizadas

---

**¿Listo para revolucionar la gestión de tu empresa? ¡Empieza con AXYRA hoy mismo!** 🚀✨

**Desarrollado con ❤️ para empresas que quieren crecer**
