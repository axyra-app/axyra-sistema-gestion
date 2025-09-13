/**
 * AXYRA - Sistema de Configuración Avanzada
 * Configuración completa y personalización del sistema
 */

class AxyraAdvancedConfig {
  constructor() {
    this.config = {
      system: {
        name: 'AXYRA Sistema de Gestión',
        version: '1.0.0',
        environment: 'production',
        debug: false,
        maintenance: false,
        timezone: 'America/Bogota',
        language: 'es',
        currency: 'COP',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h',
      },
      security: {
        sessionTimeout: 30 * 60 * 1000, // 30 minutos
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutos
        passwordMinLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
        enable2FA: false,
        enableAudit: true,
        enableEncryption: false,
      },
      notifications: {
        enabled: true,
        email: true,
        sms: false,
        push: true,
        sound: true,
        desktop: true,
        frequency: 'immediate',
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
        },
      },
      backup: {
        enabled: true,
        frequency: 'daily',
        retention: 30,
        compression: true,
        encryption: false,
        cloudSync: false,
        autoCleanup: true,
      },
      performance: {
        cacheEnabled: true,
        cacheSize: 50 * 1024 * 1024, // 50MB
        lazyLoading: true,
        imageOptimization: true,
        minification: true,
        compression: true,
      },
      integrations: {
        firebase: {
          enabled: true,
          projectId: '',
          apiKey: '',
          authDomain: '',
          storageBucket: '',
          messagingSenderId: '',
          appId: '',
        },
        email: {
          enabled: false,
          provider: 'smtp',
          host: '',
          port: 587,
          secure: false,
          username: '',
          password: '',
        },
        sms: {
          enabled: false,
          provider: 'twilio',
          accountSid: '',
          authToken: '',
          phoneNumber: '',
        },
        calendar: {
          enabled: false,
          provider: 'google',
          clientId: '',
          clientSecret: '',
          redirectUri: '',
        },
      },
      ui: {
        theme: 'light',
        primaryColor: '#3498db',
        secondaryColor: '#2c3e50',
        accentColor: '#e74c3c',
        fontSize: 'medium',
        density: 'comfortable',
        animations: true,
        sidebarCollapsed: false,
        showTooltips: true,
        showShortcuts: true,
      },
      business: {
        companyName: '',
        companyId: '',
        companyAddress: '',
        companyPhone: '',
        companyEmail: '',
        companyWebsite: '',
        taxId: '',
        industry: '',
        size: 'small',
        timezone: 'America/Bogota',
        workingHours: {
          start: '08:00',
          end: '17:00',
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        },
      },
      modules: {
        employees: {
          enabled: true,
          permissions: ['view', 'create', 'edit', 'delete'],
          features: ['roles', 'departments', 'hierarchy', 'documents'],
        },
        hours: {
          enabled: true,
          permissions: ['view', 'create', 'edit', 'delete'],
          features: ['overtime', 'breaks', 'approval', 'export'],
        },
        payroll: {
          enabled: true,
          permissions: ['view', 'create', 'edit', 'delete'],
          features: ['calculations', 'deductions', 'benefits', 'reports'],
        },
        inventory: {
          enabled: true,
          permissions: ['view', 'create', 'edit', 'delete'],
          features: ['categories', 'stock', 'alerts', 'movements'],
        },
        cash: {
          enabled: true,
          permissions: ['view', 'create', 'edit', 'delete'],
          features: ['reconciliation', 'reports', 'export'],
        },
        reports: {
          enabled: true,
          permissions: ['view', 'create', 'export'],
          features: ['charts', 'filters', 'scheduling', 'sharing'],
        },
        dashboard: {
          enabled: true,
          permissions: ['view', 'customize'],
          features: ['widgets', 'alerts', 'analytics'],
        },
        configuration: {
          enabled: true,
          permissions: ['view', 'edit'],
          features: ['users', 'roles', 'security', 'backup'],
        },
      },
      features: {
        advancedValidation: true,
        auditLogging: true,
        dataRecovery: true,
        performanceMonitoring: true,
        businessMetrics: true,
        taskManagement: true,
        externalIntegrations: true,
        systemMetrics: true,
        autoUpdates: true,
        maintenanceMode: true,
      },
    };

    this.defaults = { ...this.config };
    this.isLoaded = false;

    this.init();
  }

  init() {
    console.log('⚙️ Inicializando configuración avanzada...');
    this.loadConfig();
    this.setupEventListeners();
    this.applyConfig();
    this.isLoaded = true;
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem('axyra_advanced_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.config = this.mergeConfig(this.config, parsed);
      }
    } catch (error) {
      console.warn('Error cargando configuración avanzada:', error);
      this.config = { ...this.defaults };
    }
  }

  saveConfig() {
    try {
      localStorage.setItem('axyra_advanced_config', JSON.stringify(this.config));
      console.log('✅ Configuración guardada');
    } catch (error) {
      console.error('Error guardando configuración:', error);
    }
  }

  mergeConfig(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeConfig(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  }

  setupEventListeners() {
    // Escuchar cambios en la configuración
    document.addEventListener('configChanged', (event) => {
      this.handleConfigChange(event.detail);
    });

    // Escuchar cambios de tema
    document.addEventListener('themeChanged', (event) => {
      this.applyTheme(event.detail.theme);
    });

    // Escuchar cambios de idioma
    document.addEventListener('languageChanged', (event) => {
      this.applyLanguage(event.detail.language);
    });
  }

  handleConfigChange(change) {
    const { section, key, value } = change;

    if (this.config[section]) {
      this.config[section][key] = value;
      this.saveConfig();
      this.applyConfig();

      console.log(`⚙️ Configuración actualizada: ${section}.${key} = ${value}`);
    }
  }

  applyConfig() {
    this.applySystemConfig();
    this.applySecurityConfig();
    this.applyNotificationConfig();
    this.applyBackupConfig();
    this.applyPerformanceConfig();
    this.applyUIConfig();
    this.applyBusinessConfig();
    this.applyModuleConfig();
    this.applyFeatureConfig();
  }

  applySystemConfig() {
    const sys = this.config.system;

    // Aplicar configuración de idioma
    document.documentElement.lang = sys.language;

    // Aplicar configuración de zona horaria
    if (window.Intl && window.Intl.DateTimeFormat) {
      // Configurar zona horaria global
      window.axyraTimezone = sys.timezone;
    }

    // Aplicar configuración de debug
    if (sys.debug) {
      window.axyraDebug = true;
    }

    // Aplicar configuración de mantenimiento
    if (sys.maintenance) {
      this.enableMaintenanceMode();
    }
  }

  applySecurityConfig() {
    const sec = this.config.security;

    // Aplicar configuración de sesión
    if (window.axyraSecuritySystem) {
      window.axyraSecuritySystem.updateSecurityConfig({
        sessionTimeout: sec.sessionTimeout,
        maxLoginAttempts: sec.maxLoginAttempts,
        lockoutDuration: sec.lockoutDuration,
        passwordMinLength: sec.passwordMinLength,
        requireSpecialChars: sec.requireSpecialChars,
        requireNumbers: sec.requireNumbers,
        requireUppercase: sec.requireUppercase,
      });
    }

    // Aplicar configuración de 2FA
    if (sec.enable2FA && window.axyra2FASystem) {
      // Habilitar 2FA globalmente
      window.axyra2FAEnabled = true;
    }

    // Aplicar configuración de auditoría
    if (sec.enableAudit && window.axyraAuditSystem) {
      // Habilitar auditoría globalmente
      window.axyraAuditEnabled = true;
    }
  }

  applyNotificationConfig() {
    const notif = this.config.notifications;

    // Aplicar configuración de notificaciones
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.updateConfig({
        enabled: notif.enabled,
        sound: notif.sound,
        desktop: notif.desktop,
        frequency: notif.frequency,
      });
    }

    // Aplicar configuración de horas silenciosas
    if (notif.quietHours.enabled) {
      this.setupQuietHours(notif.quietHours);
    }
  }

  setupQuietHours(quietHours) {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const startTime = this.timeToMinutes(quietHours.start);
    const endTime = this.timeToMinutes(quietHours.end);

    const isQuietTime =
      startTime > endTime
        ? currentTime >= startTime || currentTime < endTime
        : currentTime >= startTime && currentTime < endTime;

    if (isQuietTime) {
      window.axyraQuietHours = true;
    }
  }

  timeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  applyBackupConfig() {
    const backup = this.config.backup;

    // Aplicar configuración de backup
    if (window.axyraDataRecoverySystem) {
      window.axyraDataRecoverySystem.updateBackupConfig({
        autoBackup: backup.enabled,
        backupInterval: this.getBackupInterval(backup.frequency),
        maxBackups: backup.retention,
        compressionEnabled: backup.compression,
        encryptionEnabled: backup.encryption,
      });
    }
  }

  getBackupInterval(frequency) {
    const intervals = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
    };

    return intervals[frequency] || intervals.daily;
  }

  applyPerformanceConfig() {
    const perf = this.config.performance;

    // Aplicar configuración de caché
    if (perf.cacheEnabled) {
      window.axyraCacheEnabled = true;
      window.axyraCacheSize = perf.cacheSize;
    }

    // Aplicar configuración de carga perezosa
    if (perf.lazyLoading) {
      window.axyraLazyLoading = true;
    }

    // Aplicar configuración de optimización de imágenes
    if (perf.imageOptimization) {
      window.axyraImageOptimization = true;
    }
  }

  applyUIConfig() {
    const ui = this.config.ui;

    // Aplicar tema
    this.applyTheme(ui.theme);

    // Aplicar colores
    this.applyColors(ui.primaryColor, ui.secondaryColor, ui.accentColor);

    // Aplicar configuración de fuente
    this.applyFontSize(ui.fontSize);

    // Aplicar configuración de densidad
    this.applyDensity(ui.density);

    // Aplicar configuración de animaciones
    this.applyAnimations(ui.animations);

    // Aplicar configuración de sidebar
    this.applySidebarConfig(ui.sidebarCollapsed);

    // Aplicar configuración de tooltips
    this.applyTooltips(ui.showTooltips);

    // Aplicar configuración de atajos
    this.applyShortcuts(ui.showShortcuts);
  }

  applyTheme(theme) {
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);

    // Aplicar tema a elementos específicos
    const themeElements = document.querySelectorAll('[data-theme]');
    themeElements.forEach((element) => {
      element.setAttribute('data-theme', theme);
    });
  }

  applyColors(primary, secondary, accent) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', primary);
    root.style.setProperty('--secondary-color', secondary);
    root.style.setProperty('--accent-color', accent);
  }

  applyFontSize(size) {
    const sizes = {
      small: '12px',
      medium: '14px',
      large: '16px',
      xlarge: '18px',
    };

    document.documentElement.style.fontSize = sizes[size] || sizes.medium;
  }

  applyDensity(density) {
    const densities = {
      compact: 'compact',
      comfortable: 'comfortable',
      spacious: 'spacious',
    };

    document.body.className = document.body.className.replace(/density-\w+/g, '');
    document.body.classList.add(`density-${densities[density] || 'comfortable'}`);
  }

  applyAnimations(enabled) {
    if (!enabled) {
      document.body.classList.add('no-animations');
    } else {
      document.body.classList.remove('no-animations');
    }
  }

  applySidebarConfig(collapsed) {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      if (collapsed) {
        sidebar.classList.add('collapsed');
      } else {
        sidebar.classList.remove('collapsed');
      }
    }
  }

  applyTooltips(enabled) {
    window.axyraTooltipsEnabled = enabled;
  }

  applyShortcuts(enabled) {
    window.axyraShortcutsEnabled = enabled;
  }

  applyBusinessConfig() {
    const business = this.config.business;

    // Aplicar configuración de empresa
    if (business.companyName) {
      document.title = `${business.companyName} - AXYRA`;
    }

    // Aplicar configuración de zona horaria de negocio
    if (business.timezone) {
      window.axyraBusinessTimezone = business.timezone;
    }

    // Aplicar configuración de horarios de trabajo
    if (business.workingHours) {
      window.axyraWorkingHours = business.workingHours;
    }
  }

  applyModuleConfig() {
    const modules = this.config.modules;

    // Aplicar configuración de módulos
    Object.entries(modules).forEach(([moduleName, moduleConfig]) => {
      if (!moduleConfig.enabled) {
        this.disableModule(moduleName);
      } else {
        this.enableModule(moduleName);
      }
    });
  }

  enableModule(moduleName) {
    const moduleElement = document.querySelector(`[data-module="${moduleName}"]`);
    if (moduleElement) {
      moduleElement.style.display = 'block';
    }
  }

  disableModule(moduleName) {
    const moduleElement = document.querySelector(`[data-module="${moduleName}"]`);
    if (moduleElement) {
      moduleElement.style.display = 'none';
    }
  }

  applyFeatureConfig() {
    const features = this.config.features;

    // Aplicar configuración de características
    Object.entries(features).forEach(([featureName, enabled]) => {
      if (enabled) {
        this.enableFeature(featureName);
      } else {
        this.disableFeature(featureName);
      }
    });
  }

  enableFeature(featureName) {
    window[`axyra${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Enabled`] = true;
  }

  disableFeature(featureName) {
    window[`axyra${featureName.charAt(0).toUpperCase() + featureName.slice(1)}Enabled`] = false;
  }

  enableMaintenanceMode() {
    const maintenanceOverlay = document.createElement('div');
    maintenanceOverlay.id = 'maintenance-overlay';
    maintenanceOverlay.innerHTML = `
      <div class="maintenance-content">
        <h1>🔧 Modo de Mantenimiento</h1>
        <p>El sistema está en mantenimiento. Por favor, intente más tarde.</p>
        <div class="maintenance-spinner"></div>
      </div>
    `;

    maintenanceOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(maintenanceOverlay);
  }

  disableMaintenanceMode() {
    const maintenanceOverlay = document.getElementById('maintenance-overlay');
    if (maintenanceOverlay) {
      maintenanceOverlay.remove();
    }
  }

  getConfig(section = null, key = null) {
    if (section && key) {
      return this.config[section]?.[key];
    } else if (section) {
      return this.config[section];
    } else {
      return this.config;
    }
  }

  setConfig(section, key, value) {
    if (this.config[section]) {
      this.config[section][key] = value;
      this.saveConfig();
      this.applyConfig();

      // Disparar evento de cambio
      document.dispatchEvent(
        new CustomEvent('configChanged', {
          detail: { section, key, value },
        })
      );
    }
  }

  resetConfig() {
    this.config = { ...this.defaults };
    this.saveConfig();
    this.applyConfig();

    console.log('🔄 Configuración restablecida a valores por defecto');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Configuración restablecida');
    }
  }

  exportConfig() {
    const configData = {
      config: this.config,
      exportDate: new Date().toISOString(),
      version: this.config.system.version,
    };

    const dataStr = JSON.stringify(configData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axyra-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📤 Configuración exportada');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Configuración exportada');
    }
  }

  importConfig(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const configData = JSON.parse(event.target.result);

          if (configData.config) {
            this.config = this.mergeConfig(this.config, configData.config);
            this.saveConfig();
            this.applyConfig();

            console.log('✅ Configuración importada exitosamente');

            if (window.axyraNotificationSystem) {
              window.axyraNotificationSystem.showSuccess('Configuración importada exitosamente');
            }

            resolve();
          } else {
            throw new Error('Formato de configuración inválido');
          }
        } catch (error) {
          console.error('Error importando configuración:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error leyendo archivo'));
      };

      reader.readAsText(file);
    });
  }

  validateConfig() {
    const errors = [];

    // Validar configuración de seguridad
    if (this.config.security.passwordMinLength < 6) {
      errors.push('La longitud mínima de contraseña debe ser al menos 6 caracteres');
    }

    if (this.config.security.sessionTimeout < 5 * 60 * 1000) {
      errors.push('El tiempo de sesión debe ser al menos 5 minutos');
    }

    // Validar configuración de backup
    if (this.config.backup.retention < 1) {
      errors.push('La retención de backups debe ser al menos 1');
    }

    // Validar configuración de negocio
    if (!this.config.business.companyName) {
      errors.push('El nombre de la empresa es requerido');
    }

    if (!this.config.business.companyId) {
      errors.push('El ID de la empresa es requerido');
    }

    return errors;
  }

  getConfigSummary() {
    return {
      system: {
        name: this.config.system.name,
        version: this.config.system.version,
        environment: this.config.system.environment,
        debug: this.config.system.debug,
        maintenance: this.config.system.maintenance,
      },
      security: {
        sessionTimeout: this.config.security.sessionTimeout,
        maxLoginAttempts: this.config.security.maxLoginAttempts,
        enable2FA: this.config.security.enable2FA,
        enableAudit: this.config.security.enableAudit,
      },
      notifications: {
        enabled: this.config.notifications.enabled,
        email: this.config.notifications.email,
        sms: this.config.notifications.sms,
        push: this.config.notifications.push,
      },
      backup: {
        enabled: this.config.backup.enabled,
        frequency: this.config.backup.frequency,
        retention: this.config.backup.retention,
      },
      ui: {
        theme: this.config.ui.theme,
        primaryColor: this.config.ui.primaryColor,
        fontSize: this.config.ui.fontSize,
        density: this.config.ui.density,
      },
      business: {
        companyName: this.config.business.companyName,
        industry: this.config.business.industry,
        size: this.config.business.size,
      },
      modules: Object.keys(this.config.modules).filter((module) => this.config.modules[module].enabled),
      features: Object.keys(this.config.features).filter((feature) => this.config.features[feature]),
    };
  }
}

// Inicializar configuración avanzada
let axyraAdvancedConfig;
document.addEventListener('DOMContentLoaded', () => {
  axyraAdvancedConfig = new AxyraAdvancedConfig();
  window.axyraAdvancedConfig = axyraAdvancedConfig;
});

// Exportar para uso global
window.AxyraAdvancedConfig = AxyraAdvancedConfig;
