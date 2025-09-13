/**
 * AXYRA - Sistema de Logging y Debugging
 * Maneja logs, debugging y monitoreo de errores
 */

class AxyraLoggingSystem {
  constructor() {
    this.logs = [];
    this.levels = ['debug', 'info', 'warn', 'error', 'fatal'];
    this.categories = ['system', 'user', 'security', 'performance', 'business'];
    this.maxLogs = 1000;
    this.isDebugMode = false;
    this.isEnabled = true;

    this.init();
  }

  init() {
    console.log('📝 Inicializando sistema de logging...');
    this.loadLogs();
    this.setupConsoleOverrides();
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();
    this.setupLogRotation();
  }

  loadLogs() {
    try {
      const stored = localStorage.getItem('axyra_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando logs:', error);
    }
  }

  saveLogs() {
    try {
      localStorage.setItem('axyra_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error guardando logs:', error);
    }
  }

  setupConsoleOverrides() {
    if (!this.isEnabled) return;

    // Guardar métodos originales
    this.originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
    };

    // Override console methods
    console.log = (...args) => {
      this.log('info', 'console', args.join(' '));
      this.originalConsole.log.apply(console, args);
    };

    console.info = (...args) => {
      this.log('info', 'console', args.join(' '));
      this.originalConsole.info.apply(console, args);
    };

    console.warn = (...args) => {
      this.log('warn', 'console', args.join(' '));
      this.originalConsole.warn.apply(console, args);
    };

    console.error = (...args) => {
      this.log('error', 'console', args.join(' '));
      this.originalConsole.error.apply(console, args);
    };

    console.debug = (...args) => {
      this.log('debug', 'console', args.join(' '));
      this.originalConsole.debug.apply(console, args);
    };
  }

  setupErrorHandling() {
    // Capturar errores JavaScript
    window.addEventListener('error', (event) => {
      this.log('error', 'javascript', `Error: ${event.message}`, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Capturar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      this.log('error', 'promise', `Unhandled Promise Rejection: ${event.reason}`, {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });

    // Capturar errores de recursos
    window.addEventListener(
      'error',
      (event) => {
        if (event.target !== window) {
          this.log('error', 'resource', `Resource Error: ${event.target.src || event.target.href}`, {
            tagName: event.target.tagName,
            src: event.target.src || event.target.href,
          });
        }
      },
      true
    );
  }

  setupPerformanceMonitoring() {
    // Monitorear rendimiento
    if (performance && performance.mark) {
      performance.mark('axyra-app-start');
    }

    // Monitorear memoria
    if (performance.memory) {
      setInterval(() => {
        this.log('debug', 'performance', 'Memory usage', {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
        });
      }, 60000); // Cada minuto
    }

    // Monitorear tiempo de carga
    window.addEventListener('load', () => {
      const loadTime = performance.now();
      this.log('info', 'performance', `Page loaded in ${loadTime.toFixed(2)}ms`, {
        loadTime: loadTime,
        navigationStart: performance.timing?.navigationStart,
        loadEventEnd: performance.timing?.loadEventEnd,
      });
    });
  }

  setupLogRotation() {
    // Rotar logs cada 5 minutos
    setInterval(() => {
      this.rotateLogs();
    }, 5 * 60 * 1000);
  }

  log(level, category, message, data = {}) {
    if (!this.isEnabled) return;

    const logEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      level: level,
      category: category,
      message: message,
      data: data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUser(),
    };

    this.logs.push(logEntry);

    // Limitar número de logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    this.saveLogs();

    // Mostrar en consola si está en modo debug
    if (this.isDebugMode) {
      this.displayLog(logEntry);
    }
  }

  displayLog(logEntry) {
    const colors = {
      debug: '#6c757d',
      info: '#17a2b8',
      warn: '#ffc107',
      error: '#dc3545',
      fatal: '#6f42c1',
    };

    const color = colors[logEntry.level] || '#6c757d';
    const timestamp = new Date(logEntry.timestamp).toLocaleTimeString();

    console.log(
      `%c[${timestamp}] %c[${logEntry.level.toUpperCase()}] %c[${logEntry.category}] %c${logEntry.message}`,
      `color: ${color}; font-weight: bold;`,
      `color: ${color};`,
      `color: #6c757d;`,
      `color: inherit;`
    );

    if (Object.keys(logEntry.data).length > 0) {
      console.log('Data:', logEntry.data);
    }
  }

  debug(message, data = {}) {
    this.log('debug', 'debug', message, data);
  }

  info(message, data = {}) {
    this.log('info', 'info', message, data);
  }

  warn(message, data = {}) {
    this.log('warn', 'warn', message, data);
  }

  error(message, data = {}) {
    this.log('error', 'error', message, data);
  }

  fatal(message, data = {}) {
    this.log('fatal', 'fatal', message, data);
  }

  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];

    if (filters.level) {
      filteredLogs = filteredLogs.filter((log) => log.level === filters.level);
    }

    if (filters.category) {
      filteredLogs = filteredLogs.filter((log) => log.category === filters.category);
    }

    if (filters.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId);
    }

    if (filters.dateFrom) {
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= new Date(filters.dateTo));
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredLogs = filteredLogs.filter(
        (log) => log.message.toLowerCase().includes(searchTerm) || log.category.toLowerCase().includes(searchTerm)
      );
    }

    return filteredLogs.slice(-filters.limit || 100);
  }

  getLogStatistics() {
    const totalLogs = this.logs.length;
    const levelStats = {};
    const categoryStats = {};

    this.logs.forEach((log) => {
      levelStats[log.level] = (levelStats[log.level] || 0) + 1;
      categoryStats[log.category] = (categoryStats[log.category] || 0) + 1;
    });

    const errorCount = levelStats.error || 0;
    const fatalCount = levelStats.fatal || 0;
    const errorRate = totalLogs > 0 ? ((errorCount + fatalCount) / totalLogs) * 100 : 0;

    return {
      total: totalLogs,
      levelStats: levelStats,
      categoryStats: categoryStats,
      errorCount: errorCount,
      fatalCount: fatalCount,
      errorRate: errorRate,
    };
  }

  getErrorLogs() {
    return this.logs.filter((log) => log.level === 'error' || log.level === 'fatal');
  }

  getRecentErrors(limit = 10) {
    return this.getErrorLogs().slice(-limit);
  }

  clearLogs() {
    this.logs = [];
    this.saveLogs();
    console.log('🧹 Logs limpiados');
  }

  rotateLogs() {
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
      this.saveLogs();
    }
  }

  exportLogs(format = 'json') {
    const data = {
      logs: this.logs,
      statistics: this.getLogStatistics(),
      exportDate: new Date().toISOString(),
    };

    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'csv':
        content = this.convertLogsToCSV();
        filename = 'axyra-logs.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        filename = 'axyra-logs.json';
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📊 Logs exportados');
  }

  convertLogsToCSV() {
    const rows = [];

    // Encabezados
    rows.push(['Timestamp', 'Level', 'Category', 'Message', 'User', 'URL']);

    // Datos
    this.logs.forEach((log) => {
      rows.push([
        new Date(log.timestamp).toLocaleString(),
        log.level,
        log.category,
        log.message,
        log.userId || 'system',
        log.url,
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }

  enableDebugMode() {
    this.isDebugMode = true;
    console.log('🐛 Modo debug habilitado');
  }

  disableDebugMode() {
    this.isDebugMode = false;
    console.log('🐛 Modo debug deshabilitado');
  }

  enableLogging() {
    this.isEnabled = true;
    this.setupConsoleOverrides();
    console.log('📝 Logging habilitado');
  }

  disableLogging() {
    this.isEnabled = false;
    this.restoreConsole();
    console.log('📝 Logging deshabilitado');
  }

  restoreConsole() {
    if (this.originalConsole) {
      console.log = this.originalConsole.log;
      console.info = this.originalConsole.info;
      console.warn = this.originalConsole.warn;
      console.error = this.originalConsole.error;
      console.debug = this.originalConsole.debug;
    }
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }

  createLogViewer() {
    const viewer = document.createElement('div');
    viewer.id = 'log-viewer';
    viewer.innerHTML = `
      <div class="log-viewer-header">
        <h3>📝 Visor de Logs</h3>
        <div class="log-controls">
          <button onclick="axyraLoggingSystem.clearLogs()" class="btn btn-sm btn-danger">Limpiar</button>
          <button onclick="axyraLoggingSystem.exportLogs()" class="btn btn-sm btn-primary">Exportar</button>
          <button onclick="document.getElementById('log-viewer').remove()" class="btn btn-sm btn-secondary">Cerrar</button>
        </div>
      </div>
      <div class="log-viewer-content">
        <div class="log-filters">
          <select id="log-level-filter">
            <option value="">Todos los niveles</option>
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warn">Warning</option>
            <option value="error">Error</option>
            <option value="fatal">Fatal</option>
          </select>
          <select id="log-category-filter">
            <option value="">Todas las categorías</option>
            <option value="system">Sistema</option>
            <option value="user">Usuario</option>
            <option value="security">Seguridad</option>
            <option value="performance">Rendimiento</option>
            <option value="business">Negocio</option>
          </select>
          <input type="text" id="log-search" placeholder="Buscar en logs...">
        </div>
        <div class="log-list" id="log-list">
          ${this.renderLogs()}
        </div>
      </div>
    `;

    viewer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 80%;
      height: 80%;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: monospace;
      font-size: 12px;
    `;

    document.body.appendChild(viewer);

    // Configurar filtros
    const levelFilter = document.getElementById('log-level-filter');
    const categoryFilter = document.getElementById('log-category-filter');
    const searchInput = document.getElementById('log-search');

    const updateLogs = () => {
      const filters = {
        level: levelFilter.value,
        category: categoryFilter.value,
        search: searchInput.value,
      };
      const filteredLogs = this.getLogs(filters);
      document.getElementById('log-list').innerHTML = this.renderLogs(filteredLogs);
    };

    levelFilter.addEventListener('change', updateLogs);
    categoryFilter.addEventListener('change', updateLogs);
    searchInput.addEventListener('input', updateLogs);
  }

  renderLogs(logs = null) {
    const logsToRender = logs || this.logs.slice(-100);

    return logsToRender
      .map((log) => {
        const timestamp = new Date(log.timestamp).toLocaleString();
        const levelClass = `log-level-${log.level}`;
        const dataStr =
          Object.keys(log.data).length > 0 ? `<div class="log-data">${JSON.stringify(log.data, null, 2)}</div>` : '';

        return `
        <div class="log-entry ${levelClass}">
          <div class="log-header">
            <span class="log-timestamp">${timestamp}</span>
            <span class="log-level">[${log.level.toUpperCase()}]</span>
            <span class="log-category">[${log.category}]</span>
            <span class="log-user">${log.userId || 'system'}</span>
          </div>
          <div class="log-message">${log.message}</div>
          ${dataStr}
        </div>
      `;
      })
      .join('');
  }

  getPerformanceMetrics() {
    const metrics = {
      loadTime: 0,
      memoryUsage: 0,
      errorCount: 0,
      logCount: this.logs.length,
    };

    if (performance.timing) {
      metrics.loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    }

    if (performance.memory) {
      metrics.memoryUsage = performance.memory.usedJSHeapSize;
    }

    metrics.errorCount = this.getErrorLogs().length;

    return metrics;
  }

  generateLogReport() {
    const statistics = this.getLogStatistics();
    const performance = this.getPerformanceMetrics();
    const recentErrors = this.getRecentErrors(5);

    return {
      statistics: statistics,
      performance: performance,
      recentErrors: recentErrors,
      generatedAt: new Date().toISOString(),
    };
  }
}

// Inicializar sistema de logging
let axyraLoggingSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraLoggingSystem = new AxyraLoggingSystem();
  window.axyraLoggingSystem = axyraLoggingSystem;
});

// Exportar para uso global
window.AxyraLoggingSystem = AxyraLoggingSystem;

