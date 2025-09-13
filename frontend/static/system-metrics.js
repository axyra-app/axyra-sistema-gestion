/**
 * AXYRA - Sistema de Métricas del Sistema
 * Monitorea y analiza el rendimiento del sistema
 */

class AxyraSystemMetrics {
  constructor() {
    this.metrics = {
      performance: {
        loadTime: 0,
        responseTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        networkLatency: 0,
      },
      usage: {
        pageViews: 0,
        userActions: 0,
        apiCalls: 0,
        errors: 0,
        warnings: 0,
      },
      data: {
        totalRecords: 0,
        storageUsed: 0,
        backupSize: 0,
        syncStatus: 'unknown',
      },
      security: {
        loginAttempts: 0,
        failedLogins: 0,
        securityEvents: 0,
        blockedRequests: 0,
      },
      business: {
        activeUsers: 0,
        totalRevenue: 0,
        totalCosts: 0,
        efficiency: 0,
      },
    };

    this.history = [];
    this.alerts = [];
    this.thresholds = {
      loadTime: 3000,
      responseTime: 1000,
      memoryUsage: 100 * 1024 * 1024, // 100MB
      cpuUsage: 80,
      errorRate: 5,
      storageUsage: 50 * 1024 * 1024 * 1024, // 50GB
    };

    this.isMonitoring = false;
    this.monitoringInterval = null;

    this.init();
  }

  init() {
    console.log('📊 Inicializando sistema de métricas...');
    this.loadHistoricalData();
    this.setupPerformanceMonitoring();
    this.setupUsageTracking();
    this.setupDataMonitoring();
    this.setupSecurityMonitoring();
    this.setupBusinessMonitoring();
    this.startMonitoring();
  }

  loadHistoricalData() {
    try {
      const stored = localStorage.getItem('axyra_system_metrics_history');
      if (stored) {
        this.history = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando datos históricos:', error);
    }
  }

  saveHistoricalData() {
    try {
      localStorage.setItem('axyra_system_metrics_history', JSON.stringify(this.history));
    } catch (error) {
      console.error('Error guardando datos históricos:', error);
    }
  }

  setupPerformanceMonitoring() {
    // Monitorear tiempo de carga
    window.addEventListener('load', () => {
      this.metrics.performance.loadTime = performance.now();
    });

    // Monitorear uso de memoria
    if (performance.memory) {
      setInterval(() => {
        this.metrics.performance.memoryUsage = performance.memory.usedJSHeapSize;
        this.metrics.performance.cpuUsage = this.estimateCPUUsage();
      }, 5000);
    }

    // Monitorear latencia de red
    this.setupNetworkMonitoring();
  }

  setupNetworkMonitoring() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const latency = entry.responseEnd - entry.requestStart;
            this.metrics.performance.networkLatency = Math.max(this.metrics.performance.networkLatency, latency);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('No se pudo configurar monitoreo de red:', error);
      }
    }
  }

  setupUsageTracking() {
    // Trackear vistas de página
    this.metrics.usage.pageViews++;

    // Trackear acciones del usuario
    document.addEventListener('click', () => {
      this.metrics.usage.userActions++;
    });

    // Trackear errores
    window.addEventListener('error', () => {
      this.metrics.usage.errors++;
    });

    // Trackear warnings
    const originalWarn = console.warn;
    console.warn = (...args) => {
      this.metrics.usage.warnings++;
      originalWarn.apply(console, args);
    };
  }

  setupDataMonitoring() {
    // Monitorear uso de almacenamiento
    setInterval(() => {
      this.updateDataMetrics();
    }, 60000); // Cada minuto
  }

  updateDataMetrics() {
    try {
      // Calcular total de registros
      const dataKeys = [
        'axyra_empleados',
        'axyra_horas',
        'axyra_nominas',
        'axyra_inventario',
        'axyra_cuadre_caja',
        'axyra_usuarios',
      ];

      let totalRecords = 0;
      dataKeys.forEach((key) => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            const parsed = JSON.parse(data);
            totalRecords += Array.isArray(parsed) ? parsed.length : 1;
          } catch (error) {
            totalRecords += 1;
          }
        }
      });

      this.metrics.data.totalRecords = totalRecords;

      // Calcular uso de almacenamiento
      let storageUsed = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('axyra_')) {
          storageUsed += localStorage.getItem(key).length;
        }
      }

      this.metrics.data.storageUsed = storageUsed;

      // Calcular tamaño de backups
      const backups = JSON.parse(localStorage.getItem('axyra_backups') || '[]');
      this.metrics.data.backupSize = backups.reduce((total, backup) => total + (backup.size || 0), 0);
    } catch (error) {
      console.error('Error actualizando métricas de datos:', error);
    }
  }

  setupSecurityMonitoring() {
    // Monitorear intentos de login
    if (window.axyraSecuritySystem) {
      // Interceptar eventos de seguridad
      const originalLogEvent = window.axyraSecuritySystem.logSecurityEvent;
      if (originalLogEvent) {
        window.axyraSecuritySystem.logSecurityEvent = (eventType, description, details) => {
          if (eventType === 'LOGIN_ATTEMPT') {
            this.metrics.security.loginAttempts++;
          } else if (eventType === 'LOGIN_FAILED') {
            this.metrics.security.failedLogins++;
          } else if (eventType.includes('SECURITY')) {
            this.metrics.security.securityEvents++;
          }

          return originalLogEvent.call(window.axyraSecuritySystem, eventType, description, details);
        };
      }
    }
  }

  setupBusinessMonitoring() {
    // Monitorear métricas de negocio
    setInterval(() => {
      this.updateBusinessMetrics();
    }, 300000); // Cada 5 minutos
  }

  updateBusinessMetrics() {
    try {
      // Usuarios activos
      this.metrics.business.activeUsers = this.getActiveUsers();

      // Ingresos totales
      const cashData = JSON.parse(localStorage.getItem('axyra_cuadre_caja') || '[]');
      this.metrics.business.totalRevenue = cashData.reduce((sum, c) => sum + (c.totalVentas || 0), 0);

      // Costos totales
      const payrollData = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
      this.metrics.business.totalCosts = payrollData.reduce((sum, p) => sum + (p.totalPagar || 0), 0);

      // Eficiencia
      this.metrics.business.efficiency = this.calculateEfficiency();
    } catch (error) {
      console.error('Error actualizando métricas de negocio:', error);
    }
  }

  getActiveUsers() {
    // Simular usuarios activos basado en sesiones
    const sessions = JSON.parse(localStorage.getItem('axyra_active_sessions') || '[]');
    return sessions.length;
  }

  calculateEfficiency() {
    // Calcular eficiencia basada en horas trabajadas vs costos
    const hoursData = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
    const totalHours = hoursData.reduce((sum, h) => sum + (h.horasTrabajadas || 0), 0);

    if (this.metrics.business.totalCosts > 0) {
      return (totalHours / this.metrics.business.totalCosts) * 1000;
    }

    return 0;
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
    return Math.min(100, (duration / 10) * 100);
  }

  startMonitoring() {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;

    // Monitoreo cada 30 segundos
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
      this.checkThresholds();
      this.saveMetrics();
    }, 30000);

    console.log('🚀 Monitoreo del sistema iniciado');
  }

  stopMonitoring() {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('⏹️ Monitoreo del sistema detenido');
  }

  collectMetrics() {
    const timestamp = new Date().toISOString();

    // Crear snapshot de métricas
    const snapshot = {
      timestamp: timestamp,
      metrics: { ...this.metrics },
      alerts: [...this.alerts],
    };

    // Agregar al historial
    this.history.push(snapshot);

    // Limitar tamaño del historial
    if (this.history.length > 1000) {
      this.history = this.history.slice(-500);
    }

    // Guardar datos históricos
    this.saveHistoricalData();
  }

  checkThresholds() {
    const alerts = [];

    // Verificar tiempo de carga
    if (this.metrics.performance.loadTime > this.thresholds.loadTime) {
      alerts.push({
        type: 'warning',
        category: 'performance',
        message: `Tiempo de carga alto: ${this.metrics.performance.loadTime}ms`,
        value: this.metrics.performance.loadTime,
        threshold: this.thresholds.loadTime,
      });
    }

    // Verificar uso de memoria
    if (this.metrics.performance.memoryUsage > this.thresholds.memoryUsage) {
      alerts.push({
        type: 'warning',
        category: 'performance',
        message: `Uso de memoria alto: ${this.formatBytes(this.metrics.performance.memoryUsage)}`,
        value: this.metrics.performance.memoryUsage,
        threshold: this.thresholds.memoryUsage,
      });
    }

    // Verificar uso de CPU
    if (this.metrics.performance.cpuUsage > this.thresholds.cpuUsage) {
      alerts.push({
        type: 'warning',
        category: 'performance',
        message: `Uso de CPU alto: ${this.metrics.performance.cpuUsage.toFixed(1)}%`,
        value: this.metrics.performance.cpuUsage,
        threshold: this.thresholds.cpuUsage,
      });
    }

    // Verificar tasa de errores
    const errorRate = (this.metrics.usage.errors / (this.metrics.usage.userActions || 1)) * 100;
    if (errorRate > this.thresholds.errorRate) {
      alerts.push({
        type: 'error',
        category: 'usage',
        message: `Tasa de errores alta: ${errorRate.toFixed(2)}%`,
        value: errorRate,
        threshold: this.thresholds.errorRate,
      });
    }

    // Verificar uso de almacenamiento
    if (this.metrics.data.storageUsed > this.thresholds.storageUsage) {
      alerts.push({
        type: 'warning',
        category: 'data',
        message: `Uso de almacenamiento alto: ${this.formatBytes(this.metrics.data.storageUsed)}`,
        value: this.metrics.data.storageUsed,
        threshold: this.thresholds.storageUsage,
      });
    }

    // Agregar nuevas alertas
    alerts.forEach((alert) => {
      if (
        !this.alerts.find(
          (a) => a.message === alert.message && new Date() - new Date(a.timestamp) < 300000 // 5 minutos
        )
      ) {
        alert.timestamp = new Date().toISOString();
        this.alerts.push(alert);
      }
    });

    // Limitar número de alertas
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }
  }

  saveMetrics() {
    try {
      localStorage.setItem('axyra_system_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.error('Error guardando métricas:', error);
    }
  }

  getSystemStatus() {
    const status = {
      overall: 'healthy',
      performance: 'good',
      usage: 'normal',
      data: 'stable',
      security: 'secure',
      business: 'profitable',
    };

    // Evaluar estado general
    const criticalAlerts = this.alerts.filter((a) => a.type === 'error').length;
    const warningAlerts = this.alerts.filter((a) => a.type === 'warning').length;

    if (criticalAlerts > 0) {
      status.overall = 'critical';
    } else if (warningAlerts > 5) {
      status.overall = 'warning';
    }

    // Evaluar rendimiento
    if (this.metrics.performance.loadTime > this.thresholds.loadTime) {
      status.performance = 'slow';
    }

    if (this.metrics.performance.memoryUsage > this.thresholds.memoryUsage) {
      status.performance = 'high_memory';
    }

    // Evaluar uso
    const errorRate = (this.metrics.usage.errors / (this.metrics.usage.userActions || 1)) * 100;
    if (errorRate > this.thresholds.errorRate) {
      status.usage = 'high_errors';
    }

    // Evaluar datos
    if (this.metrics.data.storageUsed > this.thresholds.storageUsage) {
      status.data = 'high_storage';
    }

    // Evaluar seguridad
    if (this.metrics.security.failedLogins > 10) {
      status.security = 'suspicious';
    }

    // Evaluar negocio
    if (this.metrics.business.totalCosts > this.metrics.business.totalRevenue) {
      status.business = 'loss';
    }

    return status;
  }

  getPerformanceReport() {
    const currentMetrics = { ...this.metrics };
    const status = this.getSystemStatus();
    const recentHistory = this.history.slice(-24); // Últimas 24 horas

    return {
      current: currentMetrics,
      status: status,
      history: recentHistory,
      alerts: this.alerts.slice(-20),
      recommendations: this.getRecommendations(),
      timestamp: new Date().toISOString(),
    };
  }

  getRecommendations() {
    const recommendations = [];

    // Recomendaciones de rendimiento
    if (this.metrics.performance.loadTime > this.thresholds.loadTime) {
      recommendations.push({
        category: 'performance',
        priority: 'high',
        message: 'Optimizar tiempo de carga del sistema',
        action: 'Revisar recursos y optimizar código',
      });
    }

    if (this.metrics.performance.memoryUsage > this.thresholds.memoryUsage) {
      recommendations.push({
        category: 'performance',
        priority: 'medium',
        message: 'Reducir uso de memoria',
        action: 'Limpiar datos innecesarios y optimizar algoritmos',
      });
    }

    // Recomendaciones de datos
    if (this.metrics.data.storageUsed > this.thresholds.storageUsage) {
      recommendations.push({
        category: 'data',
        priority: 'medium',
        message: 'Limpiar datos antiguos',
        action: 'Ejecutar limpieza de datos y archivar información antigua',
      });
    }

    // Recomendaciones de seguridad
    if (this.metrics.security.failedLogins > 10) {
      recommendations.push({
        category: 'security',
        priority: 'high',
        message: 'Reforzar seguridad de autenticación',
        action: 'Implementar 2FA y revisar logs de seguridad',
      });
    }

    return recommendations;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }

  exportMetricsReport(format = 'json') {
    const report = this.getPerformanceReport();

    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'csv':
        content = this.convertToCSV(report);
        filename = 'axyra-system-metrics.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(report, null, 2);
        filename = 'axyra-system-metrics.json';
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

    console.log('📊 Reporte de métricas del sistema exportado');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Reporte de métricas exportado');
    }
  }

  convertToCSV(report) {
    const rows = [];

    // Métricas actuales
    rows.push(['Métrica', 'Valor']);
    rows.push(['Tiempo de Carga', report.current.performance.loadTime + 'ms']);
    rows.push(['Uso de Memoria', this.formatBytes(report.current.performance.memoryUsage)]);
    rows.push(['Uso de CPU', report.current.performance.cpuUsage.toFixed(1) + '%']);
    rows.push(['Vistas de Página', report.current.usage.pageViews]);
    rows.push(['Acciones de Usuario', report.current.usage.userActions]);
    rows.push(['Errores', report.current.usage.errors]);
    rows.push(['Registros Totales', report.current.data.totalRecords]);
    rows.push(['Almacenamiento Usado', this.formatBytes(report.current.data.storageUsed)]);

    rows.push([]);
    rows.push(['Estado', 'Valor']);
    rows.push(['General', report.status.overall]);
    rows.push(['Rendimiento', report.status.performance]);
    rows.push(['Uso', report.status.usage]);
    rows.push(['Datos', report.status.data]);
    rows.push(['Seguridad', report.status.security]);
    rows.push(['Negocio', report.status.business]);

    return rows.map((row) => row.join(',')).join('\n');
  }

  clearAlerts() {
    this.alerts = [];
    console.log('🧹 Alertas del sistema limpiadas');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Alertas del sistema limpiadas');
    }
  }

  updateThresholds(newThresholds) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
    console.log('⚙️ Umbrales de métricas actualizados');
  }

  getHistoricalData(days = 7) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.history.filter((snapshot) => new Date(snapshot.timestamp) >= cutoffDate);
  }

  getTrendData(metric, days = 7) {
    const historicalData = this.getHistoricalData(days);

    return historicalData.map((snapshot) => ({
      timestamp: snapshot.timestamp,
      value: this.getNestedValue(snapshot.metrics, metric),
    }));
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

// Inicializar sistema de métricas
let axyraSystemMetrics;
document.addEventListener('DOMContentLoaded', () => {
  axyraSystemMetrics = new AxyraSystemMetrics();
  window.axyraSystemMetrics = axyraSystemMetrics;
});

// Exportar para uso global
window.AxyraSystemMetrics = AxyraSystemMetrics;

