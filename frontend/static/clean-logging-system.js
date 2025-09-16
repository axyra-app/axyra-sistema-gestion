// ========================================
// SISTEMA DE LOGGING LIMPIO - AXYRA
// ========================================
// Sistema optimizado para reducir spam de logs

class AxyraCleanLogger {
  constructor() {
    this.logLevel = 'INFO'; // DEBUG, INFO, WARN, ERROR, SILENT
    this.maxLogs = 50; // Máximo de logs en memoria
    this.logs = [];
    this.silentModules = [
      'audit-system-unified',
      'include-header',
      'shared-header'
    ];
    
    this.init();
  }

  init() {
    // Configurar nivel de logging desde localStorage
    const savedLevel = localStorage.getItem('axyra-log-level');
    if (savedLevel) {
      this.logLevel = savedLevel;
    }

    // Interceptar console.log para filtrar
    this.interceptConsole();
    
    console.log('🔧 Sistema de logging limpio inicializado');
  }

  interceptConsole() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      if (this.shouldLog('INFO', args)) {
        originalLog(...args);
      }
    };

    console.warn = (...args) => {
      if (this.shouldLog('WARN', args)) {
        originalWarn(...args);
      }
    };

    console.error = (...args) => {
      if (this.shouldLog('ERROR', args)) {
        originalError(...args);
      }
    };
  }

  shouldLog(level, args) {
    // Verificar nivel de logging
    const levels = ['SILENT', 'ERROR', 'WARN', 'INFO', 'DEBUG'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex > currentLevelIndex) {
      return false;
    }

    // Filtrar módulos silenciosos
    const message = args.join(' ');
    for (const module of this.silentModules) {
      if (message.includes(module)) {
        return false;
      }
    }

    // Filtrar logs repetitivos
    if (this.isRepetitiveLog(message)) {
      return false;
    }

    return true;
  }

  isRepetitiveLog(message) {
    // Detectar logs repetitivos
    const repetitivePatterns = [
      'Log de auditoría agregado',
      '📋 Log de auditoría agregado',
      'system_event',
      'Error cargando PayPal SDK',
      'Cannot determine language'
    ];

    return repetitivePatterns.some(pattern => message.includes(pattern));
  }

  setLogLevel(level) {
    this.logLevel = level;
    localStorage.setItem('axyra-log-level', level);
    console.log(`🔧 Nivel de logging cambiado a: ${level}`);
  }

  enableDebugMode() {
    this.setLogLevel('DEBUG');
  }

  enableProductionMode() {
    this.setLogLevel('WARN');
  }

  clearLogs() {
    this.logs = [];
    console.clear();
    console.log('🧹 Logs limpiados');
  }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  window.axyraCleanLogger = new AxyraCleanLogger();
  
  // Configurar modo de producción por defecto
  window.axyraCleanLogger.enableProductionMode();
});

// ========================================
// FUNCIONES GLOBALES
// ========================================

/**
 * Activar modo debug
 */
function enableDebugLogs() {
  if (window.axyraCleanLogger) {
    window.axyraCleanLogger.enableDebugMode();
  }
}

/**
 * Activar modo producción
 */
function enableProductionLogs() {
  if (window.axyraCleanLogger) {
    window.axyraCleanLogger.enableProductionMode();
  }
}

/**
 * Limpiar logs
 */
function clearAllLogs() {
  if (window.axyraCleanLogger) {
    window.axyraCleanLogger.clearLogs();
  }
}

// ========================================
// EXPORTACIONES
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AxyraCleanLogger, enableDebugLogs, enableProductionLogs, clearAllLogs };
}
