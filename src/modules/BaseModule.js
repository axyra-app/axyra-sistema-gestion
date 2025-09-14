// ========================================
// MÓDULO BASE AXYRA
// ========================================

/**
 * Clase base para todos los módulos de AXYRA
 * Proporciona funcionalidad común y estructura estándar
 */
class BaseModule {
  constructor(name, config = {}) {
    this.name = name;
    this.config = {
      version: '1.0.0',
      dependencies: [],
      ...config,
    };
    this.isInitialized = false;
    this.eventListeners = new Map();
    this.services = new Map();
  }

  /**
   * Inicializar el módulo
   */
  async init(services = {}) {
    if (this.isInitialized) {
      console.warn(`⚠️ Módulo ${this.name} ya está inicializado`);
      return;
    }

    try {
      console.log(`🚀 Inicializando módulo ${this.name}...`);

      // Guardar referencias a servicios
      this.services = services;

      // Inicializar dependencias
      await this.initDependencies();

      // Configurar el módulo
      await this.setup();

      // Configurar eventos
      this.setupEvents();

      this.isInitialized = true;
      console.log(`✅ Módulo ${this.name} inicializado correctamente`);

      // Emitir evento de inicialización
      this.emit('module:initialized', { name: this.name, version: this.config.version });
    } catch (error) {
      console.error(`❌ Error inicializando módulo ${this.name}:`, error);
      throw error;
    }
  }

  /**
   * Inicializar dependencias del módulo
   */
  async initDependencies() {
    for (const dependency of this.config.dependencies) {
      const service = this.services.get(dependency);
      if (service) {
        console.log(`🔗 Dependencia ${dependency} cargada`);
      } else {
        console.warn(`⚠️ Dependencia ${dependency} no encontrada`);
      }
    }
  }

  /**
   * Configurar el módulo (implementar en subclases)
   */
  async setup() {
    // Implementar en subclases
  }

  /**
   * Configurar eventos del módulo
   */
  setupEvents() {
    // Implementar en subclases
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
    const event = new CustomEvent(`${this.name}:${eventName}`, {
      detail: {
        module: this.name,
        data,
      },
    });
    document.dispatchEvent(event);
  }

  /**
   * Escuchar evento
   */
  on(eventName, callback) {
    const fullEventName = `${this.name}:${eventName}`;
    if (!this.eventListeners.has(fullEventName)) {
      this.eventListeners.set(fullEventName, []);
    }
    this.eventListeners.get(fullEventName).push(callback);

    document.addEventListener(fullEventName, (event) => {
      callback(event.detail.data);
    });
  }

  /**
   * Escuchar evento global
   */
  onGlobal(eventName, callback) {
    document.addEventListener(eventName, (event) => {
      callback(event.detail);
    });
  }

  /**
   * Obtener configuración del módulo
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.emit('config:updated', this.config);
  }

  /**
   * Obtener información del módulo
   */
  getInfo() {
    return {
      name: this.name,
      version: this.config.version,
      isInitialized: this.isInitialized,
      dependencies: this.config.dependencies,
    };
  }

  /**
   * Limpiar recursos del módulo
   */
  cleanup() {
    // Limpiar event listeners
    this.eventListeners.forEach((callbacks, eventName) => {
      callbacks.forEach((callback) => {
        document.removeEventListener(eventName, callback);
      });
    });
    this.eventListeners.clear();

    this.isInitialized = false;
    console.log(`🧹 Módulo ${this.name} limpiado`);
  }

  /**
   * Manejar errores del módulo
   */
  handleError(error, context = '') {
    const errorInfo = {
      module: this.name,
      error: error.message,
      context,
      timestamp: new Date().toISOString(),
    };

    console.error(`❌ Error en módulo ${this.name}:`, errorInfo);

    // Emitir evento de error
    this.emit('error', errorInfo);

    // Notificar al servicio de notificaciones si está disponible
    const notificationService = this.getService('notifications');
    if (notificationService) {
      notificationService.showError(`Error en ${this.name}`, error.message);
    }
  }

  /**
   * Validar datos
   */
  validateData(data, schema) {
    // Implementar validación básica
    for (const [key, rules] of Object.entries(schema)) {
      if (rules.required && !data.hasOwnProperty(key)) {
        throw new Error(`Campo requerido: ${key}`);
      }

      if (data[key] && rules.type && typeof data[key] !== rules.type) {
        throw new Error(`Tipo incorrecto para ${key}: esperado ${rules.type}`);
      }
    }

    return true;
  }

  /**
   * Formatear datos para mostrar
   */
  formatData(data, format = 'default') {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
        }).format(data);

      case 'date':
        return new Intl.DateTimeFormat('es-CO').format(new Date(data));

      case 'number':
        return new Intl.NumberFormat('es-CO').format(data);

      default:
        return data;
    }
  }
}

// Exportar para uso global
window.BaseModule = BaseModule;
