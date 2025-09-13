/**
 * AXYRA - Monitor de Rendimiento
 * Sistema completo de monitoreo y optimización de rendimiento
 */

class AxyraPerformanceMonitor {
  constructor() {
    this.metrics = {
      loadTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      networkLatency: 0,
      errors: 0,
      warnings: 0,
    };

    this.thresholds = {
      loadTime: 3000, // 3 segundos
      memoryUsage: 100 * 1024 * 1024, // 100MB
      cpuUsage: 80, // 80%
      networkLatency: 1000, // 1 segundo
      errors: 5,
      warnings: 10,
    };

    this.alerts = [];
    this.isMonitoring = false;
    this.monitoringInterval = null;

    this.init();
  }

  init() {
    console.log('⚡ Inicializando monitor de rendimiento...');
    this.setupPerformanceObserver();
    this.setupErrorHandling();
    this.setupMemoryMonitoring();
    this.setupNetworkMonitoring();
  }

  startMonitoring() {
    if (this.isMonitoring) {
      console.warn('Monitor ya está ejecutándose');
      return;
    }

    this.isMonitoring = true;
    console.log('🚀 Iniciando monitoreo de rendimiento...');

    // Monitoreo cada 5 segundos
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkThresholds();
      this.updateUI();
    }, 5000);

    // Monitoreo inicial
    this.collectMetrics();
  }

  stopMonitoring() {
    if (!this.isMonitoring) {
      console.warn('Monitor no está ejecutándose');
      return;
    }

    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('⏹️ Monitoreo de rendimiento detenido');
  }

  setupPerformanceObserver() {
    if ('PerformanceObserver' in window) {
      // Observar métricas de navegación
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            this.metrics.loadTime = entry.loadEventEnd - entry.loadEventStart;
          }
        });
      });

      try {
        navObserver.observe({ entryTypes: ['navigation'] });
      } catch (error) {
        console.warn('No se pudo configurar PerformanceObserver:', error);
      }
    }
  }

  setupErrorHandling() {
    // Capturar errores JavaScript
    window.addEventListener('error', (event) => {
      this.metrics.errors++;
      this.addAlert('error', `Error JavaScript: ${event.message}`, {
        file: event.filename,
        line: event.lineno,
        column: event.colno,
      });
    });

    // Capturar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errors++;
      this.addAlert('error', `Promesa rechazada: ${event.reason}`, {
        reason: event.reason,
      });
    });

    // Capturar warnings de consola
    const originalWarn = console.warn;
    console.warn = (...args) => {
      this.metrics.warnings++;
      this.addAlert('warning', `Warning: ${args.join(' ')}`);
      originalWarn.apply(console, args);
    };
  }

  setupMemoryMonitoring() {
    if (performance.memory) {
      setInterval(() => {
        this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
        this.metrics.memoryLimit = performance.memory.jsHeapSizeLimit;
        this.metrics.memoryTotal = performance.memory.totalJSHeapSize;
      }, 1000);
    }
  }

  setupNetworkMonitoring() {
    if ('PerformanceObserver' in window) {
      const networkObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const latency = entry.responseEnd - entry.requestStart;
            this.metrics.networkLatency = Math.max(this.metrics.networkLatency, latency);
          }
        });
      });

      try {
        networkObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('No se pudo configurar monitoreo de red:', error);
      }
    }
  }

  collectMetrics() {
    // Métricas de carga
    if (performance.timing) {
      const timing = performance.timing;
      this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
    }

    // Métricas de memoria
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize;
      this.metrics.memoryLimit = performance.memory.jsHeapSizeLimit;
      this.metrics.memoryTotal = performance.memory.totalJSHeapSize;
    }

    // Métricas de CPU (aproximación)
    this.estimateCPUUsage();

    // Métricas de red
    this.collectNetworkMetrics();
  }

  estimateCPUUsage() {
    const start = performance.now();

    // Ejecutar tarea de prueba
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.random();
    }

    const end = performance.now();
    const duration = end - start;

    // Estimar uso de CPU basado en duración
    this.metrics.cpuUsage = Math.min(100, (duration / 10) * 100);
  }

  collectNetworkMetrics() {
    if (navigator.connection) {
      this.metrics.connectionType = navigator.connection.effectiveType;
      this.metrics.downlink = navigator.connection.downlink;
      this.metrics.rtt = navigator.connection.rtt;
    }
  }

  checkThresholds() {
    // Verificar tiempo de carga
    if (this.metrics.loadTime > this.thresholds.loadTime) {
      this.addAlert('warning', `Tiempo de carga alto: ${this.metrics.loadTime}ms`);
    }

    // Verificar uso de memoria
    if (this.metrics.memoryUsage > this.thresholds.memoryUsage) {
      this.addAlert('warning', `Uso de memoria alto: ${this.formatBytes(this.metrics.memoryUsage)}`);
    }

    // Verificar uso de CPU
    if (this.metrics.cpuUsage > this.thresholds.cpuUsage) {
      this.addAlert('warning', `Uso de CPU alto: ${this.metrics.cpuUsage.toFixed(1)}%`);
    }

    // Verificar latencia de red
    if (this.metrics.networkLatency > this.thresholds.networkLatency) {
      this.addAlert('warning', `Latencia de red alta: ${this.metrics.networkLatency}ms`);
    }

    // Verificar errores
    if (this.metrics.errors > this.thresholds.errors) {
      this.addAlert('error', `Muchos errores: ${this.metrics.errors}`);
    }

    // Verificar warnings
    if (this.metrics.warnings > this.thresholds.warnings) {
      this.addAlert('warning', `Muchos warnings: ${this.metrics.warnings}`);
    }
  }

  addAlert(type, message, details = {}) {
    const alert = {
      id: Date.now() + Math.random(),
      type: type,
      message: message,
      details: details,
      timestamp: new Date().toISOString(),
      resolved: false,
    };

    this.alerts.push(alert);

    // Mostrar notificación
    if (window.axyraNotificationSystem) {
      if (type === 'error') {
        window.axyraNotificationSystem.showError(message);
      } else {
        window.axyraNotificationSystem.showWarning(message);
      }
    }

    // Limitar número de alertas
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  updateUI() {
    // Actualizar UI si existe
    const performanceWidget = document.getElementById('performance-widget');
    if (performanceWidget) {
      this.renderPerformanceWidget(performanceWidget);
    }
  }

  renderPerformanceWidget(container) {
    const memoryPercent = this.metrics.memoryLimit ? (this.metrics.memoryUsage / this.metrics.memoryLimit) * 100 : 0;

    container.innerHTML = `
      <div class="performance-widget">
        <h3>Monitor de Rendimiento</h3>
        <div class="metric">
          <label>Tiempo de Carga:</label>
          <span class="${this.metrics.loadTime > this.thresholds.loadTime ? 'warning' : 'ok'}">
            ${this.metrics.loadTime}ms
          </span>
        </div>
        <div class="metric">
          <label>Memoria:</label>
          <span class="${memoryPercent > 80 ? 'warning' : 'ok'}">
            ${this.formatBytes(this.metrics.memoryUsage)} (${memoryPercent.toFixed(1)}%)
          </span>
        </div>
        <div class="metric">
          <label>CPU:</label>
          <span class="${this.metrics.cpuUsage > this.thresholds.cpuUsage ? 'warning' : 'ok'}">
            ${this.metrics.cpuUsage.toFixed(1)}%
          </span>
        </div>
        <div class="metric">
          <label>Errores:</label>
          <span class="${this.metrics.errors > this.thresholds.errors ? 'error' : 'ok'}">
            ${this.metrics.errors}
          </span>
        </div>
        <div class="metric">
          <label>Warnings:</label>
          <span class="${this.metrics.warnings > this.thresholds.warnings ? 'warning' : 'ok'}">
            ${this.metrics.warnings}
          </span>
        </div>
        <div class="alerts">
          <h4>Alertas Recientes (${this.alerts.length})</h4>
          ${this.alerts
            .slice(-5)
            .map(
              (alert) => `
            <div class="alert ${alert.type}">
              <span class="time">${new Date(alert.timestamp).toLocaleTimeString()}</span>
              <span class="message">${alert.message}</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getPerformanceReport() {
    return {
      metrics: { ...this.metrics },
      thresholds: { ...this.thresholds },
      alerts: [...this.alerts],
      isMonitoring: this.isMonitoring,
      timestamp: new Date().toISOString(),
    };
  }

  exportPerformanceReport() {
    const report = this.getPerformanceReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axyra-performance-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📊 Reporte de rendimiento exportado');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Reporte de rendimiento exportado');
    }
  }

  optimizePerformance() {
    console.log('🔧 Iniciando optimización de rendimiento...');

    const optimizations = [];

    // Limpiar memoria
    if (window.gc) {
      window.gc();
      optimizations.push('Memoria limpiada');
    }

    // Limpiar localStorage si es necesario
    const localStorageSize = JSON.stringify(localStorage).length;
    if (localStorageSize > 5 * 1024 * 1024) {
      // 5MB
      this.cleanupLocalStorage();
      optimizations.push('LocalStorage limpiado');
    }

    // Limpiar alertas antiguas
    const oldAlerts = this.alerts.filter(
      (alert) => Date.now() - new Date(alert.timestamp).getTime() > 24 * 60 * 60 * 1000 // 24 horas
    );
    this.alerts = this.alerts.filter((alert) => !oldAlerts.includes(alert));
    optimizations.push(`${oldAlerts.length} alertas antiguas eliminadas`);

    // Resetear métricas
    this.metrics.errors = 0;
    this.metrics.warnings = 0;
    optimizations.push('Métricas reseteadas');

    console.log('✅ Optimizaciones aplicadas:', optimizations);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Optimizaciones aplicadas: ${optimizations.join(', ')}`);
    }

    return optimizations;
  }

  cleanupLocalStorage() {
    const keysToClean = [];

    // Identificar claves antiguas o innecesarias
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('axyra_')) {
        try {
          const value = JSON.parse(localStorage.getItem(key));
          if (value && value.timestamp) {
            const age = Date.now() - new Date(value.timestamp).getTime();
            if (age > 30 * 24 * 60 * 60 * 1000) {
              // 30 días
              keysToClean.push(key);
            }
          }
        } catch (error) {
          // Si no se puede parsear, es seguro eliminar
          keysToClean.push(key);
        }
      }
    }

    // Eliminar claves identificadas
    keysToClean.forEach((key) => {
      localStorage.removeItem(key);
    });

    console.log(`🧹 Limpiadas ${keysToClean.length} entradas de localStorage`);
  }

  setThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    console.log('⚙️ Umbrales actualizados:', this.thresholds);
  }

  getAlerts(type = null) {
    if (type) {
      return this.alerts.filter((alert) => alert.type === type);
    }
    return [...this.alerts];
  }

  resolveAlert(alertId) {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      console.log(`✅ Alerta resuelta: ${alert.message}`);
    }
  }

  clearAlerts() {
    this.alerts = [];
    console.log('🧹 Alertas limpiadas');
  }
}

// Inicializar monitor de rendimiento
let axyraPerformanceMonitor;
document.addEventListener('DOMContentLoaded', () => {
  axyraPerformanceMonitor = new AxyraPerformanceMonitor();
  window.axyraPerformanceMonitor = axyraPerformanceMonitor;

  // Iniciar monitoreo automáticamente
  axyraPerformanceMonitor.startMonitoring();
});

// Exportar para uso global
window.AxyraPerformanceMonitor = AxyraPerformanceMonitor;
