// ========================================
// SISTEMA DE DEBUGGING Y DEPURACIÓN AXYRA
// ========================================

// Clase para debugging y depuración
class AxyraDebug {
  constructor() {
    this.isEnabled = true;
    this.logLevel = 'info'; // 'debug', 'info', 'warn', 'error'
    this.errorHandlingSetup = false; // Prevenir recursión infinita
    this.init();
  }

  // Inicializar sistema de debugging
  init() {
    if (!this.isEnabled) return;

    console.log('🔍 Inicializando sistema de debugging AXYRA...');
    this.setupGlobalErrorHandling();
    this.setupPerformanceMonitoring();
    this.logSystemInfo();
  }

  // Configurar manejo global de errores
  setupGlobalErrorHandling() {
    try {
      // Prevenir recursión infinita
      if (this.errorHandlingSetup) {
        console.log('[DEBUG] Error handling ya configurado, saltando...');
        return;
      }

      this.errorHandlingSetup = true;

      // Capturar errores no manejados
      window.addEventListener('error', (event) => {
        if (this.debugLevel >= 3) {
          this.logError('Error no manejado', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error,
          });
        }
      });

      // Capturar promesas rechazadas
      window.addEventListener('unhandledrejection', (event) => {
        if (this.debugLevel >= 3) {
          this.logError('Promesa rechazada no manejada', {
            reason: event.reason,
            promise: event.promise,
          });
        }
      });

      // Interceptar console.error para logging adicional (con protección anti-recursión)
      const originalConsoleError = console.error;
      console.error = (...args) => {
        // Prevenir recursión infinita
        if (args[0] && typeof args[0] === 'string' && args[0].includes('Maximum call stack size exceeded')) {
          originalConsoleError.apply(console, args);
          return;
        }

        if (this.debugLevel >= 3) {
          this.logError('Console Error', { args });
        }
        originalConsoleError.apply(console, args);
      };

      console.log('[DEBUG] Error handling configurado correctamente');
    } catch (error) {
      console.error('[DEBUG] Error configurando error handling:', error);
    }
  }

  // Configurar monitoreo de rendimiento
  setupPerformanceMonitoring() {
    // Monitorear tiempo de carga de la página
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.logInfo('Tiempo de carga de página', `${loadTime}ms`);
    });

    // Monitorear memoria si está disponible
    if (performance.memory) {
      setInterval(() => {
        const memory = performance.memory;
        this.logDebug('Uso de memoria', {
          used: `${Math.round(memory.usedJSHeapSize / 1048576)}MB`,
          total: `${Math.round(memory.totalJSHeapSize / 1048576)}MB`,
          limit: `${Math.round(memory.jsHeapSizeLimit / 1048576)}MB`,
        });
      }, 30000); // Cada 30 segundos
    }
  }

  // Log de información del sistema
  logSystemInfo() {
    this.logInfo('Información del sistema', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
  }

  // Log de debug
  logDebug(message, data = null) {
    if (this.shouldLog('debug')) {
      console.log(`🔍 [DEBUG] ${message}`, data);
    }
  }

  // Log de información
  logInfo(message, data = null) {
    if (this.shouldLog('info')) {
      console.log(`ℹ️ [INFO] ${message}`, data);
    }
  }

  // Log de advertencia
  logWarn(message, data = null) {
    if (this.shouldLog('warn')) {
      console.warn(`⚠️ [WARN] ${message}`, data);
    }
  }

  // Log de error
  logError(message, data = null) {
    if (this.shouldLog('error')) {
      console.error(`❌ [ERROR] ${message}`, data);

      // Enviar a servicio de monitoreo si está disponible
      this.sendToMonitoringService(message, data);
    }
  }

  // Verificar si debe hacer log según el nivel
  shouldLog(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    return levels[level] >= levels[this.logLevel];
  }

  // Enviar a servicio de monitoreo
  sendToMonitoringService(message, data) {
    try {
      // Aquí se podría integrar con servicios como Sentry, LogRocket, etc.
      if (window.axyraFirebase && window.axyraFirebase.firestore) {
        const errorLog = {
          message,
          data: JSON.stringify(data),
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
          userId: this.getCurrentUserId(),
        };

        // Guardar en Firestore para análisis posterior
        window.axyraFirebase.firestore
          .collection('error_logs')
          .add(errorLog)
          .then(() => this.logDebug('Error log guardado en Firestore'))
          .catch((err) => this.logWarn('No se pudo guardar error log en Firestore', err));
      }
    } catch (error) {
      this.logWarn('Error enviando log a servicio de monitoreo', error);
    }
  }

  // Obtener ID del usuario actual
  getCurrentUserId() {
    try {
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.username || user.email || 'unknown';
      }
      return 'anonymous';
    } catch (error) {
      return 'unknown';
    }
  }

  // Verificar estado de Firebase
  checkFirebaseStatus() {
    try {
      if (window.axyraFirebase) {
        this.logInfo('Estado de Firebase', {
          auth: !!window.axyraFirebase.auth,
          firestore: !!window.axyraFirebase.firestore,
          isDomainAuthorized: window.axyraFirebase.isDomainAuthorized,
        });
      } else {
        this.logWarn('Firebase no está disponible');
      }
    } catch (error) {
      this.logError('Error verificando estado de Firebase', error);
    }
  }

  // Verificar estado de localStorage
  checkLocalStorageStatus() {
    try {
      const keys = Object.keys(localStorage);
      const axyraKeys = keys.filter((key) => key.startsWith('axyra_'));

      this.logInfo('Estado de localStorage', {
        totalKeys: keys.length,
        axyraKeys: axyraKeys.length,
        axyraKeysList: axyraKeys,
      });

      // Verificar datos específicos
      axyraKeys.forEach((key) => {
        try {
          const value = localStorage.getItem(key);
          const parsed = JSON.parse(value);
          this.logDebug(`Contenido de ${key}`, {
            type: typeof parsed,
            hasData: !!parsed,
            size: value ? value.length : 0,
          });
        } catch (error) {
          this.logWarn(`Error parseando ${key}`, error);
        }
      });
    } catch (error) {
      this.logError('Error verificando localStorage', error);
    }
  }

  // Verificar estado de autenticación
  checkAuthStatus() {
    try {
      const userData = localStorage.getItem('axyra_isolated_user');
      const firebaseUser = localStorage.getItem('axyra_firebase_user');

      this.logInfo('Estado de autenticación', {
        hasLocalUser: !!userData,
        hasFirebaseUser: !!firebaseUser,
        currentUser: userData ? JSON.parse(userData) : null,
      });
    } catch (error) {
      this.logError('Error verificando estado de autenticación', error);
    }
  }

  // Ejecutar diagnóstico completo
  runDiagnostic() {
    this.logInfo('🔍 Iniciando diagnóstico completo del sistema...');

    setTimeout(() => this.checkFirebaseStatus(), 100);
    setTimeout(() => this.checkLocalStorageStatus(), 200);
    setTimeout(() => this.checkAuthStatus(), 300);

    this.logInfo('✅ Diagnóstico completo completado');
  }

  // Habilitar/deshabilitar debugging
  setEnabled(enabled) {
    this.isEnabled = enabled;
    this.logInfo(`Debugging ${enabled ? 'habilitado' : 'deshabilitado'}`);
  }

  // Cambiar nivel de log
  setLogLevel(level) {
    if (['debug', 'info', 'warn', 'error'].includes(level)) {
      this.logLevel = level;
      this.logInfo(`Nivel de log cambiado a: ${level}`);
    } else {
      this.logWarn(`Nivel de log inválido: ${level}`);
    }
  }
}

// Inicializar sistema de debugging cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraDebug = new AxyraDebug();

  // Ejecutar diagnóstico después de un breve delay
  setTimeout(() => {
    if (window.axyraDebug) {
      window.axyraDebug.runDiagnostic();
    }
  }, 1000);
});

// Agregar comandos de debugging a la consola
window.axyraDebugCommands = {
  // Ejecutar diagnóstico
  diagnostic: () => {
    if (window.axyraDebug) {
      window.axyraDebug.runDiagnostic();
    }
  },

  // Verificar Firebase
  checkFirebase: () => {
    if (window.axyraDebug) {
      window.axyraDebug.checkFirebaseStatus();
    }
  },

  // Verificar localStorage
  checkStorage: () => {
    if (window.axyraDebug) {
      window.axyraDebug.checkLocalStorageStatus();
    }
  },

  // Verificar autenticación
  checkAuth: () => {
    if (window.axyraDebug) {
      window.axyraDebug.checkAuthStatus();
    }
  },

  // Cambiar nivel de log
  setLogLevel: (level) => {
    if (window.axyraDebug) {
      window.axyraDebug.setLogLevel(level);
    }
  },

  // Habilitar/deshabilitar debugging
  setDebug: (enabled) => {
    if (window.axyraDebug) {
      window.axyraDebug.setEnabled(enabled);
    }
  },
};

// Mostrar comandos disponibles en consola
console.log('🔍 Comandos de debugging disponibles:');
console.log('axyraDebugCommands.diagnostic() - Ejecutar diagnóstico completo');
console.log('axyraDebugCommands.checkFirebase() - Verificar estado de Firebase');
console.log('axyraDebugCommands.checkStorage() - Verificar localStorage');
console.log('axyraDebugCommands.checkAuth() - Verificar autenticación');
console.log('axyraDebugCommands.setLogLevel("debug|info|warn|error") - Cambiar nivel de log');
console.log('axyraDebugCommands.setDebug(true|false) - Habilitar/deshabilitar debugging');

// Exportar para uso global
window.AxyraDebug = AxyraDebug;
