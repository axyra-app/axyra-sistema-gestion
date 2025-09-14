// ========================================
// APLICACIÓN PRINCIPAL AXYRA - CORE
// ========================================

/**
 * Clase principal de la aplicación AXYRA
 * Maneja la inicialización y coordinación de todos los módulos
 */
class AxyraApp {
  constructor() {
    this.modules = new Map();
    this.services = new Map();
    this.config = {
      version: '2.0.0',
      environment: 'production',
      debug: false,
    };
    this.isInitialized = false;
  }

  /**
   * Inicializar la aplicación
   */
  async init() {
    if (this.isInitialized) {
      console.warn('⚠️ AXYRA ya está inicializada');
      return;
    }

    console.log('🚀 Inicializando AXYRA v2.0...');

    try {
      // Inicializar servicios core
      await this.initCoreServices();

      // Cargar módulos
      await this.loadModules();

      // Configurar eventos globales
      this.setupGlobalEvents();

      this.isInitialized = true;
      console.log('✅ AXYRA inicializada correctamente');

      // Emitir evento de inicialización
      this.emit('app:initialized', { version: this.config.version });
    } catch (error) {
      console.error('❌ Error inicializando AXYRA:', error);
      throw error;
    }
  }

  /**
   * Inicializar servicios core
   */
  async initCoreServices() {
    console.log('🔧 Inicializando servicios core...');

    // Servicio de autenticación
    this.services.set('auth', new AxyraAuthService());

    // Servicio de Firebase
    this.services.set('firebase', new AxyraFirebaseService());

    // Servicio de notificaciones
    this.services.set('notifications', new AxyraNotificationService());

    // Servicio de almacenamiento
    this.services.set('storage', new AxyraStorageService());

    console.log('✅ Servicios core inicializados');
  }

  /**
   * Cargar módulos de la aplicación
   */
  async loadModules() {
    console.log('📦 Cargando módulos...');

    const moduleConfigs = [
      { name: 'dashboard', path: 'modules/dashboard/DashboardModule' },
      { name: 'empleados', path: 'modules/empleados/EmpleadosModule' },
      { name: 'nomina', path: 'modules/nomina/NominaModule' },
      { name: 'inventario', path: 'modules/inventario/InventarioModule' },
      { name: 'reportes', path: 'modules/reportes/ReportesModule' },
    ];

    for (const config of moduleConfigs) {
      try {
        const ModuleClass = await this.loadModuleClass(config.path);
        const moduleInstance = new ModuleClass();

        this.modules.set(config.name, moduleInstance);
        console.log(`✅ Módulo ${config.name} cargado`);
      } catch (error) {
        console.error(`❌ Error cargando módulo ${config.name}:`, error);
      }
    }
  }

  /**
   * Cargar clase de módulo dinámicamente
   */
  async loadModuleClass(modulePath) {
    // Implementación de carga dinámica
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `src/${modulePath}.js`;
      script.onload = () => {
        // El módulo se registra globalmente
        const moduleName = modulePath.split('/').pop();
        const ModuleClass = window[`Axyra${moduleName}`];
        if (ModuleClass) {
          resolve(ModuleClass);
        } else {
          reject(new Error(`Clase ${moduleName} no encontrada`));
        }
      };
      script.onerror = () => reject(new Error(`Error cargando ${modulePath}`));
      document.head.appendChild(script);
    });
  }

  /**
   * Configurar eventos globales
   */
  setupGlobalEvents() {
    console.log('🎯 Configurando eventos globales...');

    // Eventos de autenticación
    this.on('auth:login', (user) => {
      console.log('👤 Usuario autenticado:', user.email);
      this.updateUI('authenticated');
    });

    this.on('auth:logout', () => {
      console.log('👋 Usuario desautenticado');
      this.updateUI('unauthenticated');
    });

    // Eventos de módulos
    this.on('module:loaded', (moduleName) => {
      console.log(`📦 Módulo ${moduleName} cargado`);
    });

    // Eventos de errores
    this.on('error:global', (error) => {
      console.error('🚨 Error global:', error);
      this.handleGlobalError(error);
    });
  }

  /**
   * Obtener módulo por nombre
   */
  getModule(name) {
    return this.modules.get(name);
  }

  /**
   * Obtener servicio por nombre
   */
  getService(name) {
    return this.services.get(name);
  }

  /**
   * Emitir evento
   */
  emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }

  /**
   * Escuchar evento
   */
  on(eventName, callback) {
    document.addEventListener(eventName, (event) => {
      callback(event.detail);
    });
  }

  /**
   * Actualizar UI según estado
   */
  updateUI(state) {
    const body = document.body;
    body.className = body.className.replace(/state-\w+/g, '');
    body.classList.add(`state-${state}`);
  }

  /**
   * Manejar errores globales
   */
  handleGlobalError(error) {
    // Mostrar notificación de error
    const notificationService = this.getService('notifications');
    if (notificationService) {
      notificationService.showError('Error inesperado', error.message);
    }
  }

  /**
   * Obtener información de la aplicación
   */
  getInfo() {
    return {
      version: this.config.version,
      environment: this.config.environment,
      modules: Array.from(this.modules.keys()),
      services: Array.from(this.services.keys()),
      isInitialized: this.isInitialized,
    };
  }
}

// Exportar para uso global
window.AxyraApp = AxyraApp;

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (!window.axyraApp) {
    window.axyraApp = new AxyraApp();
    window.axyraApp.init().catch(console.error);
  }
});
