/**
 * AXYRA - Sistema de Analytics y Métricas
 * Recopila y analiza métricas de uso del sistema
 */

class AxyraAnalyticsSystem {
  constructor() {
    this.metrics = {
      pageViews: 0,
      userActions: 0,
      errors: 0,
      performance: {},
      usage: {},
      features: {},
    };

    this.events = [];
    this.sessionStart = Date.now();
    this.isTracking = true;

    this.init();
  }

  init() {
    console.log('📊 Inicializando sistema de analytics...');
    this.setupEventTracking();
    this.setupPerformanceTracking();
    this.setupUserBehaviorTracking();
    this.loadStoredMetrics();
  }

  setupEventTracking() {
    // Trackear clics en botones
    document.addEventListener('click', (event) => {
      if (this.isTracking && event.target.tagName === 'BUTTON') {
        this.trackEvent('button_click', {
          buttonText: event.target.textContent,
          buttonId: event.target.id,
          buttonClass: event.target.className,
        });
      }
    });

    // Trackear envío de formularios
    document.addEventListener('submit', (event) => {
      if (this.isTracking) {
        this.trackEvent('form_submit', {
          formId: event.target.id,
          formClass: event.target.className,
          formAction: event.target.action,
        });
      }
    });

    // Trackear navegación entre módulos
    document.addEventListener('click', (event) => {
      if (this.isTracking && event.target.tagName === 'A') {
        const href = event.target.getAttribute('href');
        if (href && href.includes('#')) {
          this.trackEvent('module_navigation', {
            targetModule: href.split('#')[1],
            linkText: event.target.textContent,
          });
        }
      }
    });
  }

  setupPerformanceTracking() {
    // Trackear tiempo de carga de páginas
    window.addEventListener('load', () => {
      if (this.isTracking) {
        const loadTime = performance.now();
        this.trackEvent('page_load', {
          loadTime: loadTime,
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Trackear errores JavaScript
    window.addEventListener('error', (event) => {
      if (this.isTracking) {
        this.trackEvent('javascript_error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        });
      }
    });

    // Trackear promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isTracking) {
        this.trackEvent('promise_rejection', {
          reason: event.reason,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  setupUserBehaviorTracking() {
    // Trackear tiempo en página
    let pageStartTime = Date.now();

    setInterval(() => {
      if (this.isTracking) {
        const timeOnPage = Date.now() - pageStartTime;
        this.trackEvent('time_on_page', {
          duration: timeOnPage,
          timestamp: new Date().toISOString(),
        });
        pageStartTime = Date.now();
      }
    }, 60000); // Cada minuto

    // Trackear scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (this.isTracking) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.trackEvent('scroll', {
            scrollY: window.scrollY,
            scrollPercent: (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100,
          });
        }, 1000);
      }
    });

    // Trackear resize de ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (this.isTracking) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          this.trackEvent('window_resize', {
            width: window.innerWidth,
            height: window.innerHeight,
          });
        }, 500);
      }
    });
  }

  trackEvent(eventType, eventData = {}) {
    const event = {
      id: Date.now() + Math.random(),
      type: eventType,
      data: eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
      userId: this.getCurrentUserId(),
    };

    this.events.push(event);
    this.updateMetrics(eventType, eventData);

    // Limitar número de eventos en memoria
    if (this.events.length > 1000) {
      this.events = this.events.slice(-500);
    }

    // Guardar eventos periódicamente
    if (this.events.length % 10 === 0) {
      this.saveEvents();
    }
  }

  updateMetrics(eventType, eventData) {
    // Actualizar contadores
    if (eventType === 'page_load') {
      this.metrics.pageViews++;
    } else if (eventType.includes('click') || eventType.includes('submit')) {
      this.metrics.userActions++;
    } else if (eventType.includes('error') || eventType.includes('rejection')) {
      this.metrics.errors++;
    }

    // Actualizar métricas de rendimiento
    if (eventType === 'page_load' && eventData.loadTime) {
      this.metrics.performance.loadTime = eventData.loadTime;
    }

    // Actualizar métricas de uso
    if (eventType === 'module_navigation' && eventData.targetModule) {
      if (!this.metrics.usage.modules) {
        this.metrics.usage.modules = {};
      }
      this.metrics.usage.modules[eventData.targetModule] =
        (this.metrics.usage.modules[eventData.targetModule] || 0) + 1;
    }

    // Actualizar métricas de características
    if (eventType === 'button_click' && eventData.buttonText) {
      if (!this.metrics.features.buttons) {
        this.metrics.features.buttons = {};
      }
      this.metrics.features.buttons[eventData.buttonText] =
        (this.metrics.features.buttons[eventData.buttonText] || 0) + 1;
    }
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('axyra_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('axyra_session_id', sessionId);
    }
    return sessionId;
  }

  getCurrentUserId() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }

  loadStoredMetrics() {
    try {
      const stored = localStorage.getItem('axyra_analytics_metrics');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.metrics = { ...this.metrics, ...parsed };
      }
    } catch (error) {
      console.warn('Error cargando métricas almacenadas:', error);
    }
  }

  saveEvents() {
    try {
      const eventsToSave = this.events.slice(-100); // Últimos 100 eventos
      localStorage.setItem('axyra_analytics_events', JSON.stringify(eventsToSave));
    } catch (error) {
      console.warn('Error guardando eventos:', error);
    }
  }

  saveMetrics() {
    try {
      localStorage.setItem('axyra_analytics_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Error guardando métricas:', error);
    }
  }

  getAnalyticsReport() {
    const sessionDuration = Date.now() - this.sessionStart;
    const totalEvents = this.events.length;

    // Calcular métricas de sesión
    const sessionMetrics = {
      duration: sessionDuration,
      eventsPerMinute: totalEvents / (sessionDuration / 60000),
      errorRate: (this.metrics.errors / totalEvents) * 100,
      userActionsPerMinute: this.metrics.userActions / (sessionDuration / 60000),
    };

    // Calcular métricas de uso por módulo
    const moduleUsage = this.metrics.usage.modules || {};
    const mostUsedModule = Object.keys(moduleUsage).reduce((a, b) => (moduleUsage[a] > moduleUsage[b] ? a : b), 'N/A');

    // Calcular métricas de características
    const featureUsage = this.metrics.features.buttons || {};
    const mostUsedFeature = Object.keys(featureUsage).reduce(
      (a, b) => (featureUsage[a] > featureUsage[b] ? a : b),
      'N/A'
    );

    return {
      summary: {
        sessionDuration: this.formatDuration(sessionDuration),
        totalEvents: totalEvents,
        pageViews: this.metrics.pageViews,
        userActions: this.metrics.userActions,
        errors: this.metrics.errors,
        errorRate: sessionMetrics.errorRate.toFixed(2) + '%',
      },
      performance: {
        loadTime: this.metrics.performance.loadTime || 0,
        eventsPerMinute: sessionMetrics.eventsPerMinute.toFixed(2),
        userActionsPerMinute: sessionMetrics.userActionsPerMinute.toFixed(2),
      },
      usage: {
        mostUsedModule: mostUsedModule,
        moduleUsage: moduleUsage,
        mostUsedFeature: mostUsedFeature,
        featureUsage: featureUsage,
      },
      events: this.events.slice(-50), // Últimos 50 eventos
      timestamp: new Date().toISOString(),
    };
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

  exportAnalytics(format = 'json') {
    const report = this.getAnalyticsReport();

    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'csv':
        content = this.convertToCSV(report);
        filename = 'axyra-analytics.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(report, null, 2);
        filename = 'axyra-analytics.json';
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

    console.log(`📊 Analytics exportados: ${filename}`);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Analytics exportados: ${filename}`);
    }
  }

  convertToCSV(report) {
    const rows = [];

    // Resumen
    rows.push(['Métrica', 'Valor']);
    rows.push(['Duración de Sesión', report.summary.sessionDuration]);
    rows.push(['Total de Eventos', report.summary.totalEvents]);
    rows.push(['Vistas de Página', report.summary.pageViews]);
    rows.push(['Acciones de Usuario', report.summary.userActions]);
    rows.push(['Errores', report.summary.errors]);
    rows.push(['Tasa de Errores', report.summary.errorRate]);

    rows.push([]);
    rows.push(['Módulo', 'Uso']);
    Object.entries(report.usage.moduleUsage).forEach(([module, usage]) => {
      rows.push([module, usage]);
    });

    rows.push([]);
    rows.push(['Característica', 'Uso']);
    Object.entries(report.usage.featureUsage).forEach(([feature, usage]) => {
      rows.push([feature, usage]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }

  getRealTimeMetrics() {
    return {
      currentSession: {
        duration: this.formatDuration(Date.now() - this.sessionStart),
        events: this.events.length,
        errors: this.metrics.errors,
      },
      performance: {
        loadTime: this.metrics.performance.loadTime || 0,
        memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 0,
      },
      usage: {
        pageViews: this.metrics.pageViews,
        userActions: this.metrics.userActions,
        mostUsedModule: this.getMostUsedModule(),
      },
    };
  }

  getMostUsedModule() {
    const moduleUsage = this.metrics.usage.modules || {};
    return Object.keys(moduleUsage).reduce((a, b) => (moduleUsage[a] > moduleUsage[b] ? a : b), 'N/A');
  }

  startTracking() {
    this.isTracking = true;
    console.log('▶️ Tracking de analytics iniciado');
  }

  stopTracking() {
    this.isTracking = false;
    console.log('⏸️ Tracking de analytics detenido');
  }

  clearAnalytics() {
    this.events = [];
    this.metrics = {
      pageViews: 0,
      userActions: 0,
      errors: 0,
      performance: {},
      usage: {},
      features: {},
    };

    localStorage.removeItem('axyra_analytics_events');
    localStorage.removeItem('axyra_analytics_metrics');

    console.log('🧹 Analytics limpiados');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Analytics limpiados');
    }
  }

  getEventHistory(limit = 100) {
    return this.events.slice(-limit);
  }

  getEventsByType(eventType) {
    return this.events.filter((event) => event.type === eventType);
  }

  getErrorEvents() {
    return this.events.filter((event) => event.type.includes('error') || event.type.includes('rejection'));
  }

  getPerformanceEvents() {
    return this.events.filter((event) => event.type === 'page_load' || event.type === 'time_on_page');
  }

  // Método para trackear eventos personalizados
  trackCustomEvent(eventName, eventData = {}) {
    this.trackEvent('custom_' + eventName, eventData);
  }

  // Método para trackear errores personalizados
  trackError(error, context = {}) {
    this.trackEvent('custom_error', {
      message: error.message,
      stack: error.stack,
      context: context,
    });
  }

  // Método para trackear métricas de negocio
  trackBusinessMetric(metricName, value, context = {}) {
    this.trackEvent('business_metric', {
      metric: metricName,
      value: value,
      context: context,
    });
  }
}

// Inicializar sistema de analytics
let axyraAnalyticsSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraAnalyticsSystem = new AxyraAnalyticsSystem();
  window.axyraAnalyticsSystem = axyraAnalyticsSystem;
});

// Exportar para uso global
window.AxyraAnalyticsSystem = AxyraAnalyticsSystem;

