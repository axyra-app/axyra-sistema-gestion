/**
 * AXYRA - Sistema de Configuración Avanzado
 * Gestión centralizada y dinámica de configuración
 */

class AxyraConfigSystem {
  constructor() {
    this.config = {
      // Configuración de la aplicación
      app: {
        name: 'AXYRA',
        version: '2.0.0',
        environment: this.getEnvironment(),
        debug: this.getEnvironment() !== 'production',
        language: 'es',
        timezone: 'America/Bogota'
      },

      // Configuración de Firebase
      firebase: {
        apiKey: this.getEnvVar('FIREBASE_API_KEY', 'AIzaSyB...'),
        authDomain: this.getEnvVar('FIREBASE_AUTH_DOMAIN', 'axyra-48238.firebaseapp.com'),
        projectId: this.getEnvVar('FIREBASE_PROJECT_ID', 'axyra-48238'),
        storageBucket: this.getEnvVar('FIREBASE_STORAGE_BUCKET', 'axyra-48238.appspot.com'),
        messagingSenderId: this.getEnvVar('FIREBASE_MESSAGING_SENDER_ID', '123456789012'),
        appId: this.getEnvVar('FIREBASE_APP_ID', '1:123456789012:web:abcdef...'),
        measurementId: this.getEnvVar('FIREBASE_MEASUREMENT_ID', 'G-XXXXXXXXXX')
      },

      // Configuración de la empresa
      empresa: {
        nombre: this.getEnvVar('EMPRESA_NOMBRE', 'VILLA VENECIA'),
        nit: this.getEnvVar('EMPRESA_NIT', '900.123.456-7'),
        direccion: this.getEnvVar('EMPRESA_DIRECCION', 'Calle 123 # 45-67, Bogotá D.C.'),
        telefono: this.getEnvVar('EMPRESA_TELEFONO', '+57 (1) 234-5678'),
        email: this.getEnvVar('EMPRESA_EMAIL', 'info@villa-venecia.com'),
        website: this.getEnvVar('EMPRESA_WEBSITE', 'https://villa-venecia.com'),
        logo: '/logo.png',
        favicon: '/nomina.ico'
      },

      // Configuración de nómina
      nomina: {
        salario_minimo: parseFloat(this.getEnvVar('SALARIO_MINIMO', '1423500')),
        auxilio_transporte: parseFloat(this.getEnvVar('AUXILIO_TRANSPORTE', '100000')),
        porcentajes: {
          salud: parseFloat(this.getEnvVar('PORCENTAJE_SALUD', '0.04')),
          pension: parseFloat(this.getEnvVar('PORCENTAJE_PENSION', '0.04')),
          fondo_solidaridad: parseFloat(this.getEnvVar('PORCENTAJE_FONDO_SOLIDARIDAD', '0.0')),
          retencion_fuente: parseFloat(this.getEnvVar('PORCENTAJE_RETENCION_FUENTE', '0.0'))
        },
        recargos: {
          nocturno: parseFloat(this.getEnvVar('RECARGO_NOCTURNO', '0.35')),
          dominical: parseFloat(this.getEnvVar('RECARGO_DOMINICAL', '0.75')),
          nocturno_dominical: parseFloat(this.getEnvVar('RECARGO_NOCTURNO_DOMINICAL', '1.1')),
          extra_diurna: parseFloat(this.getEnvVar('RECARGO_EXTRA_DIURNA', '1.25')),
          extra_nocturna: parseFloat(this.getEnvVar('RECARGO_EXTRA_NOCTURNA', '1.75')),
          diurna_dominical: parseFloat(this.getEnvVar('RECARGO_DIURNA_DOMINICAL', '0.8')),
          nocturna_dominical: parseFloat(this.getEnvVar('RECARGO_NOCTURNA_DOMINICAL', '1.1')),
          extra_diurna_dominical: parseFloat(this.getEnvVar('RECARGO_EXTRA_DIURNA_DOMINICAL', '1.05')),
          extra_nocturna_dominical: parseFloat(this.getEnvVar('RECARGO_EXTRA_NOCTURNA_DOMINICAL', '1.85'))
        },
        moneda: 'COP',
        formato_moneda: 'es-CO',
        decimales: 0
      },

      // Configuración de membresías
      membresias: {
        planes: {
          free: {
            nombre: 'Gratuito',
            precio: 0,
            duracion: 'ilimitada',
            limite_empleados: 5,
            limite_nominas: 10,
            limite_almacenamiento: 100, // MB
            modulos_disponibles: ['dashboard', 'empleados_basico', 'nominas_basico'],
            caracteristicas: [
              'Hasta 5 empleados',
              'Hasta 10 nóminas por mes',
              'Dashboard básico',
              'Reportes básicos',
              'Soporte por email'
            ],
            restricciones: [
              'Sin inventario',
              'Sin cuadre de caja',
              'Sin reportes avanzados',
              'Sin integraciones',
              'Sin backup automático'
            ]
          },
          basic: {
            nombre: 'Básico',
            precio: 50000,
            duracion: 'mensual',
            limite_empleados: 25,
            limite_nominas: 50,
            limite_almacenamiento: 500, // MB
            modulos_disponibles: ['dashboard', 'empleados', 'nominas', 'reportes_basico'],
            caracteristicas: [
              'Hasta 25 empleados',
              'Hasta 50 nóminas por mes',
              'Gestión completa de empleados',
              'Cálculo de nóminas',
              'Reportes básicos',
              'Soporte prioritario'
            ],
            restricciones: [
              'Sin inventario',
              'Sin cuadre de caja',
              'Sin reportes avanzados',
              'Sin integraciones'
            ]
          },
          professional: {
            nombre: 'Profesional',
            precio: 150000,
            duracion: 'mensual',
            limite_empleados: 100,
            limite_nominas: 200,
            limite_almacenamiento: 2000, // MB
            modulos_disponibles: ['dashboard', 'empleados', 'nominas', 'inventario', 'cuadre_caja', 'reportes', 'integraciones'],
            caracteristicas: [
              'Hasta 100 empleados',
              'Hasta 200 nóminas por mes',
              'Gestión de inventario',
              'Cuadre de caja',
              'Reportes avanzados',
              'Integraciones',
              'Backup automático',
              'Soporte prioritario 24/7'
            ],
            restricciones: [
              'Sin AI Chat',
              'Sin personalización avanzada'
            ]
          },
          enterprise: {
            nombre: 'Empresarial',
            precio: 300000,
            duracion: 'mensual',
            limite_empleados: -1, // Ilimitado
            limite_nominas: -1, // Ilimitado
            limite_almacenamiento: -1, // Ilimitado
            modulos_disponibles: ['dashboard', 'empleados', 'nominas', 'inventario', 'cuadre_caja', 'reportes', 'integraciones', 'ai_chat', 'personalizacion'],
            caracteristicas: [
              'Empleados ilimitados',
              'Nóminas ilimitadas',
              'Almacenamiento ilimitado',
              'Todos los módulos',
              'AI Chat avanzado',
              'Personalización completa',
              'API personalizada',
              'Soporte dedicado 24/7',
              'Migración de datos',
              'Capacitación incluida'
            ],
            restricciones: []
          }
        },
        pagos: {
          paypal: {
            habilitado: this.getEnvVar('PAYPAL_HABILITADO', 'true') === 'true',
            client_id: this.getEnvVar('PAYPAL_CLIENT_ID', ''),
            mode: this.getEnvVar('PAYPAL_MODE', 'sandbox')
          },
          wompi: {
            habilitado: this.getEnvVar('WOMPI_HABILITADO', 'true') === 'true',
            public_key: this.getEnvVar('WOMPI_PUBLIC_KEY', ''),
            private_key: this.getEnvVar('WOMPI_PRIVATE_KEY', '')
          }
        }
      },

      // Configuración de seguridad
      seguridad: {
        session_timeout: parseInt(this.getEnvVar('SESSION_TIMEOUT', '1800000')), // 30 minutos
        max_login_attempts: parseInt(this.getEnvVar('MAX_LOGIN_ATTEMPTS', '5')),
        lockout_duration: parseInt(this.getEnvVar('LOCKOUT_DURATION', '900000')), // 15 minutos
        password_min_length: 8,
        require_special_chars: true,
        require_numbers: true,
        require_uppercase: true,
        encryption_key: this.getEnvVar('ENCRYPTION_KEY', ''),
        jwt_secret: this.getEnvVar('JWT_SECRET', '')
      },

      // Configuración de UI
      ui: {
        theme: this.getStoredValue('theme', 'light'),
        language: this.getStoredValue('language', 'es'),
        date_format: 'DD/MM/YYYY',
        time_format: '24h',
        currency_symbol: '$',
        decimal_places: 0,
        animations: true,
        compact_mode: false
      },

      // Configuración de notificaciones
      notificaciones: {
        enabled: this.getEnvVar('PUSH_NOTIFICATIONS_ENABLED', 'true') === 'true',
        fcm_server_key: this.getEnvVar('FCM_SERVER_KEY', ''),
        sound: true,
        vibration: true,
        desktop: true,
        email: true
      },

      // Configuración de archivos
      archivos: {
        max_size: parseInt(this.getEnvVar('MAX_FILE_SIZE', '10485760')), // 10MB
        allowed_types: (this.getEnvVar('ALLOWED_FILE_TYPES', 'xlsx,xls,pdf,jpg,jpeg,png')).split(','),
        upload_dir: 'uploads',
        export_dir: 'exports',
        compression: true,
        watermark: false
      },

      // Configuración de API
      api: {
        base_url: this.getEnvVar('API_BASE_URL', 'https://us-central1-axyra-48238.cloudfunctions.net'),
        timeout: 30000,
        retry_attempts: 3,
        retry_delay: 1000,
        rate_limit: {
          enabled: true,
          max_requests: 100,
          window_ms: 900000 // 15 minutos
        }
      },

      // Configuración de cache
      cache: {
        enabled: true,
        ttl: parseInt(this.getEnvVar('CACHE_TTL', '3600')), // 1 hora
        max_size: 50, // MB
        strategy: 'lru'
      }
    };

    this.init();
  }

  init() {
    // Validar configuración crítica
    this.validateConfig();
    
    // Configurar listeners
    this.setupListeners();
    
    // Aplicar configuración inicial
    this.applyConfig();
    
    // Cargar configuración desde servidor si está disponible
    this.loadServerConfig();
  }

  getEnvironment() {
    if (typeof window !== 'undefined') {
      return window.location.hostname === 'localhost' ? 'development' : 'production';
    }
    return 'production';
  }

  getEnvVar(key, defaultValue) {
    // En el navegador, las variables de entorno no están disponibles directamente
    // Se pueden configurar en el build o en el servidor
    return defaultValue;
  }

  getStoredValue(key, defaultValue) {
    try {
      const stored = localStorage.getItem(`axyra_${key}`);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  setStoredValue(key, value) {
    try {
      localStorage.setItem(`axyra_${key}`, JSON.stringify(value));
    } catch (error) {
      console.warn('No se pudo guardar en localStorage:', error);
    }
  }

  validateConfig() {
    const required = [
      'firebase.apiKey',
      'firebase.projectId',
      'empresa.nombre',
      'nomina.salario_minimo'
    ];

    required.forEach(path => {
      const value = this.get(path);
      if (!value || value === 'your_..._here') {
        console.warn(`⚠️ Configuración faltante: ${path}`);
      }
    });
  }

  setupListeners() {
    // Escuchar cambios en localStorage
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('axyra_')) {
        this.loadStoredConfig();
        this.applyConfig();
      }
    });

    // Escuchar cambios de tema del sistema
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (this.get('ui.theme') === 'auto') {
          this.applyTheme();
        }
      });
    }
  }

  loadStoredConfig() {
    // Cargar configuración almacenada
    const storedConfig = {
      ui: {
        theme: this.getStoredValue('theme', this.config.ui.theme),
        language: this.getStoredValue('language', this.config.ui.language),
        compact_mode: this.getStoredValue('compact_mode', this.config.ui.compact_mode)
      }
    };

    this.config = this.mergeDeep(this.config, storedConfig);
  }

  async loadServerConfig() {
    try {
      // Cargar configuración desde el servidor
      const response = await fetch('/api/config');
      if (response.ok) {
        const serverConfig = await response.json();
        this.config = this.mergeDeep(this.config, serverConfig);
        this.applyConfig();
      }
    } catch (error) {
      console.warn('No se pudo cargar configuración del servidor:', error);
    }
  }

  applyConfig() {
    this.applyTheme();
    this.applyLanguage();
    this.applyCurrency();
    this.applyAnimations();
  }

  applyTheme() {
    const theme = this.get('ui.theme');
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }

  applyLanguage() {
    const language = this.get('ui.language');
    document.documentElement.setAttribute('lang', language);
  }

  applyCurrency() {
    const currency = this.get('ui.currency_symbol');
    const decimalPlaces = this.get('ui.decimal_places');
    
    window.AxyraCurrency = {
      symbol: currency,
      decimalPlaces: decimalPlaces,
      format: (amount) => {
        return `${currency}${amount.toLocaleString('es-CO', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces
        })}`;
      }
    };
  }

  applyAnimations() {
    const animations = this.get('ui.animations');
    document.documentElement.setAttribute('data-animations', animations ? 'enabled' : 'disabled');
  }

  // Métodos de acceso
  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }

  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => {
      if (!obj[key]) obj[key] = {};
      return obj[key];
    }, this.config);
    target[lastKey] = value;
    
    // Guardar en localStorage si es configuración de UI
    if (path.startsWith('ui.')) {
      const key = path.replace('ui.', '');
      this.setStoredValue(key, value);
    }
  }

  getAll() {
    return { ...this.config };
  }

  // Métodos de membresías
  getPlan(planName) {
    return this.config.membresias.planes[planName] || null;
  }

  getAllPlans() {
    return this.config.membresias.planes;
  }

  getPlanLimits(planName) {
    const plan = this.getPlan(planName);
    if (!plan) return null;

    return {
      empleados: plan.limite_empleados,
      nominas: plan.limite_nominas,
      almacenamiento: plan.limite_almacenamiento,
      modulos: plan.modulos_disponibles
    };
  }

  canAccessModule(planName, moduleName) {
    const plan = this.getPlan(planName);
    if (!plan) return false;

    return plan.modulos_disponibles.includes(moduleName);
  }

  isWithinLimits(planName, resource, currentCount) {
    const limits = this.getPlanLimits(planName);
    if (!limits) return false;

    const limit = limits[resource];
    if (limit === -1) return true; // Ilimitado
    if (limit === undefined) return true; // No hay límite definido

    return currentCount <= limit;
  }

  // Métodos de utilidad
  formatCurrency(amount) {
    return window.AxyraCurrency?.format(amount) || `$${amount.toLocaleString()}`;
  }

  formatDate(date, format = null) {
    const dateFormat = format || this.get('ui.date_format');
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };
    
    return new Date(date).toLocaleDateString('es-CO', options);
  }

  formatTime(date, format = null) {
    const timeFormat = format || this.get('ui.time_format');
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: timeFormat === '24h' ? '2-digit' : undefined
    };
    
    return new Date(date).toLocaleTimeString('es-CO', options);
  }

  // Validación de configuración
  isValid() {
    return this.get('firebase.apiKey') && 
           this.get('firebase.projectId') && 
           this.get('empresa.nombre');
  }

  // Merge profundo de objetos
  mergeDeep(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeDeep(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  // Reset a configuración por defecto
  reset() {
    // Limpiar localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('axyra_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Recargar página
    window.location.reload();
  }

  // Exportar configuración
  export() {
    return JSON.stringify(this.config, null, 2);
  }

  // Importar configuración
  import(configString) {
    try {
      const importedConfig = JSON.parse(configString);
      this.config = this.mergeDeep(this.config, importedConfig);
      this.applyConfig();
      return true;
    } catch (error) {
      console.error('Error importando configuración:', error);
      return false;
    }
  }
}

// Instancia global
window.AxyraConfig = new AxyraConfigSystem();

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraConfigSystem;
}
