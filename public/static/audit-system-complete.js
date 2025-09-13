/**
 * AXYRA - Sistema Completo de Auditoría y Logging
 * Sistema robusto para tracking de todas las acciones del sistema
 */

class AxyraAuditSystem {
  constructor() {
    this.auditLogs = [];
    this.maxLogs = 10000; // Máximo de logs en memoria
    this.retentionDays = 90; // Días de retención
    this.isEnabled = true;
    this.sensitiveFields = ['password', 'token', 'secret', 'key', 'pin'];

    this.init();
  }

  init() {
    try {
      console.log('🔍 Inicializando sistema de auditoría completo...');

      // Cargar logs existentes
      this.loadAuditLogs();

      // Configurar listeners globales
      this.setupGlobalListeners();

      // Configurar limpieza automática
      this.setupAutoCleanup();

      // Registrar inicio del sistema
      this.logSystemEvent('SYSTEM_START', 'Sistema de auditoría inicializado');

      console.log('✅ Sistema de auditoría inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando auditoría:', error);
    }
  }

  /**
   * Registra un evento de auditoría
   */
  logEvent(type, description, details = {}, userId = null, ip = null) {
    if (!this.isEnabled) return;

    try {
      const auditEntry = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        type: type,
        description: description,
        details: this.sanitizeDetails(details),
        userId: userId || this.getCurrentUserId(),
        ip: ip || this.getClientIP(),
        userAgent: navigator.userAgent,
        sessionId: this.getSessionId(),
        module: this.getCurrentModule(),
        severity: this.getSeverityLevel(type),
        category: this.getEventCategory(type),
      };

      // Agregar al array de logs
      this.auditLogs.unshift(auditEntry);

      // Mantener límite de logs en memoria
      if (this.auditLogs.length > this.maxLogs) {
        this.auditLogs = this.auditLogs.slice(0, this.maxLogs);
      }

      // Guardar en localStorage
      this.saveAuditLogs();

      // Log en consola para desarrollo
      if (process?.env?.NODE_ENV === 'development') {
        console.log('📝 Audit Log:', auditEntry);
      }

      // Notificar eventos críticos
      if (auditEntry.severity === 'CRITICAL') {
        this.notifyCriticalEvent(auditEntry);
      }

      return auditEntry;
    } catch (error) {
      console.error('❌ Error registrando evento de auditoría:', error);
    }
  }

  /**
   * Registra eventos del sistema
   */
  logSystemEvent(type, description, details = {}) {
    return this.logEvent(type, description, details, 'SYSTEM', 'localhost');
  }

  /**
   * Registra eventos de usuario
   */
  logUserEvent(type, description, details = {}, userId = null) {
    return this.logEvent(type, description, details, userId);
  }

  /**
   * Registra eventos de seguridad
   */
  logSecurityEvent(type, description, details = {}, userId = null) {
    const securityDetails = {
      ...details,
      securityEvent: true,
      riskLevel: this.assessRiskLevel(type, details),
    };

    return this.logEvent(type, description, securityDetails, userId);
  }

  /**
   * Registra eventos de datos
   */
  logDataEvent(operation, entity, entityId, changes = {}, userId = null) {
    const dataDetails = {
      operation: operation, // CREATE, UPDATE, DELETE, READ
      entity: entity,
      entityId: entityId,
      changes: changes,
      dataEvent: true,
    };

    return this.logEvent('DATA_' + operation, `${operation} ${entity}`, dataDetails, userId);
  }

  /**
   * Registra eventos de configuración
   */
  logConfigEvent(type, configKey, oldValue, newValue, userId = null) {
    const configDetails = {
      configKey: configKey,
      oldValue: this.sanitizeValue(oldValue),
      newValue: this.sanitizeValue(newValue),
      configEvent: true,
    };

    return this.logEvent('CONFIG_' + type, `Configuración ${type}: ${configKey}`, configDetails, userId);
  }

  /**
   * Registra eventos de autenticación
   */
  logAuthEvent(type, userId, details = {}) {
    const authDetails = {
      authType: type,
      timestamp: new Date().toISOString(),
      success: details.success !== false,
      ...details,
    };

    return this.logEvent('AUTH_' + type, `Autenticación ${type}`, authDetails, userId);
  }

  /**
   * Registra eventos de error
   */
  logError(error, context = {}, userId = null) {
    const errorDetails = {
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context: context,
      errorEvent: true,
    };

    return this.logEvent('ERROR', 'Error del sistema', errorDetails, userId);
  }

  /**
   * Obtiene logs con filtros
   */
  getLogs(filters = {}) {
    let filteredLogs = [...this.auditLogs];

    // Filtrar por tipo
    if (filters.type) {
      filteredLogs = filteredLogs.filter((log) => log.type === filters.type);
    }

    // Filtrar por usuario
    if (filters.userId) {
      filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId);
    }

    // Filtrar por severidad
    if (filters.severity) {
      filteredLogs = filteredLogs.filter((log) => log.severity === filters.severity);
    }

    // Filtrar por categoría
    if (filters.category) {
      filteredLogs = filteredLogs.filter((log) => log.category === filters.category);
    }

    // Filtrar por fecha
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= endDate);
    }

    // Filtrar por módulo
    if (filters.module) {
      filteredLogs = filteredLogs.filter((log) => log.module === filters.module);
    }

    // Ordenar por timestamp (más recientes primero)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Limitar resultados
    if (filters.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit);
    }

    return filteredLogs;
  }

  /**
   * Obtiene estadísticas de auditoría
   */
  getAuditStats(period = '24h') {
    const now = new Date();
    let startDate;

    switch (period) {
      case '1h':
        startDate = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    const recentLogs = this.getLogs({
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    });

    const stats = {
      totalEvents: recentLogs.length,
      byType: {},
      bySeverity: {},
      byCategory: {},
      byUser: {},
      byModule: {},
      criticalEvents: 0,
      securityEvents: 0,
      errorEvents: 0,
      timeRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
    };

    recentLogs.forEach((log) => {
      // Contar por tipo
      stats.byType[log.type] = (stats.byType[log.type] || 0) + 1;

      // Contar por severidad
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;

      // Contar por categoría
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;

      // Contar por usuario
      stats.byUser[log.userId] = (stats.byUser[log.userId] || 0) + 1;

      // Contar por módulo
      if (log.module) {
        stats.byModule[log.module] = (stats.byModule[log.module] || 0) + 1;
      }

      // Contar eventos especiales
      if (log.severity === 'CRITICAL') stats.criticalEvents++;
      if (log.details?.securityEvent) stats.securityEvents++;
      if (log.details?.errorEvent) stats.errorEvents++;
    });

    return stats;
  }

  /**
   * Exporta logs a diferentes formatos
   */
  exportLogs(format = 'json', filters = {}) {
    const logs = this.getLogs(filters);

    switch (format.toLowerCase()) {
      case 'json':
        return this.exportToJSON(logs);
      case 'csv':
        return this.exportToCSV(logs);
      case 'xlsx':
        return this.exportToXLSX(logs);
      case 'pdf':
        return this.exportToPDF(logs);
      default:
        throw new Error('Formato no soportado: ' + format);
    }
  }

  /**
   * Limpia logs antiguos
   */
  cleanupOldLogs() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

    const originalLength = this.auditLogs.length;
    this.auditLogs = this.auditLogs.filter((log) => new Date(log.timestamp) > cutoffDate);

    const removedCount = originalLength - this.auditLogs.length;

    if (removedCount > 0) {
      this.logSystemEvent('AUDIT_CLEANUP', `Limpieza de auditoría: ${removedCount} logs eliminados`);
      this.saveAuditLogs();
    }

    return removedCount;
  }

  /**
   * Configura listeners globales
   */
  setupGlobalListeners() {
    // Interceptar errores globales
    window.addEventListener('error', (event) => {
      this.logError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Interceptar promesas rechazadas
    window.addEventListener('unhandledrejection', (event) => {
      this.logError(new Error(event.reason), {
        type: 'unhandledrejection',
        promise: event.promise,
      });
    });

    // Interceptar cambios en localStorage
    this.interceptLocalStorage();

    // Interceptar formularios
    this.interceptForms();

    // Interceptar clicks en botones importantes
    this.interceptImportantClicks();
  }

  /**
   * Intercepta cambios en localStorage
   */
  interceptLocalStorage() {
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;

    localStorage.setItem = (key, value) => {
      this.logDataEvent('UPDATE', 'localStorage', key, {
        operation: 'setItem',
        key: key,
        newValue: this.sanitizeValue(value),
      });
      return originalSetItem.call(localStorage, key, value);
    };

    localStorage.removeItem = (key) => {
      this.logDataEvent('DELETE', 'localStorage', key, {
        operation: 'removeItem',
        key: key,
      });
      return originalRemoveItem.call(localStorage, key);
    };
  }

  /**
   * Intercepta formularios
   */
  interceptForms() {
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (form.tagName === 'FORM') {
        const formData = new FormData(form);
        const formObject = {};

        for (let [key, value] of formData.entries()) {
          formObject[key] = this.sanitizeValue(value);
        }

        this.logUserEvent('FORM_SUBMIT', `Formulario enviado: ${form.id || form.className}`, {
          formId: form.id,
          formClass: form.className,
          formData: formObject,
        });
      }
    });
  }

  /**
   * Intercepta clicks importantes
   */
  interceptImportantClicks() {
    document.addEventListener('click', (event) => {
      const target = event.target;

      // Botones de acción importantes
      if (target.matches('button[data-audit-important], .axyra-btn[data-audit-important]')) {
        this.logUserEvent('BUTTON_CLICK', `Botón importante clickeado: ${target.textContent.trim()}`, {
          buttonText: target.textContent.trim(),
          buttonClass: target.className,
          buttonId: target.id,
        });
      }

      // Enlaces de navegación
      if (target.matches('a[href]')) {
        this.logUserEvent('NAVIGATION', `Navegación: ${target.href}`, {
          href: target.href,
          text: target.textContent.trim(),
        });
      }
    });
  }

  /**
   * Configura limpieza automática
   */
  setupAutoCleanup() {
    // Limpiar cada 24 horas
    setInterval(() => {
      this.cleanupOldLogs();
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * Notifica eventos críticos
   */
  notifyCriticalEvent(auditEntry) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showError(`Evento crítico detectado: ${auditEntry.description}`, {
        title: 'Alerta de Seguridad',
        persistent: true,
        actions: [
          {
            label: 'Ver Detalles',
            action: () => this.showEventDetails(auditEntry.id),
          },
        ],
      });
    }
  }

  /**
   * Muestra detalles de un evento
   */
  showEventDetails(eventId) {
    const event = this.auditLogs.find((log) => log.id === eventId);
    if (!event) return;

    const modal = this.createEventDetailsModal(event);
    document.body.appendChild(modal);
  }

  /**
   * Crea modal de detalles de evento
   */
  createEventDetailsModal(event) {
    const modal = document.createElement('div');
    modal.className = 'axyra-modal-overlay';
    modal.innerHTML = `
      <div class="axyra-modal-content axyra-modal-large">
        <div class="axyra-modal-header">
          <h3>Detalles del Evento de Auditoría</h3>
          <button class="axyra-modal-close" onclick="this.closest('.axyra-modal-overlay').remove()">×</button>
        </div>
        <div class="axyra-modal-body">
          <div class="axyra-audit-details">
            <div class="axyra-audit-section">
              <h4>Información Básica</h4>
              <div class="axyra-audit-grid">
                <div class="axyra-audit-item">
                  <label>ID:</label>
                  <span>${event.id}</span>
                </div>
                <div class="axyra-audit-item">
                  <label>Timestamp:</label>
                  <span>${new Date(event.timestamp).toLocaleString()}</span>
                </div>
                <div class="axyra-audit-item">
                  <label>Tipo:</label>
                  <span class="axyra-audit-type">${event.type}</span>
                </div>
                <div class="axyra-audit-item">
                  <label>Severidad:</label>
                  <span class="axyra-audit-severity axyra-severity-${event.severity.toLowerCase()}">${
      event.severity
    }</span>
                </div>
                <div class="axyra-audit-item">
                  <label>Categoría:</label>
                  <span>${event.category}</span>
                </div>
                <div class="axyra-audit-item">
                  <label>Usuario:</label>
                  <span>${event.userId}</span>
                </div>
                <div class="axyra-audit-item">
                  <label>IP:</label>
                  <span>${event.ip}</span>
                </div>
                <div class="axyra-audit-item">
                  <label>Módulo:</label>
                  <span>${event.module || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div class="axyra-audit-section">
              <h4>Descripción</h4>
              <p>${event.description}</p>
            </div>
            
            <div class="axyra-audit-section">
              <h4>Detalles</h4>
              <pre class="axyra-audit-json">${JSON.stringify(event.details, null, 2)}</pre>
            </div>
          </div>
        </div>
        <div class="axyra-modal-footer">
          <button class="axyra-btn axyra-btn-secondary" onclick="this.closest('.axyra-modal-overlay').remove()">
            Cerrar
          </button>
          <button class="axyra-btn axyra-btn-primary" onclick="axyraAuditSystem.exportLogs('json', {id: '${
            event.id
          }'})">
            Exportar
          </button>
        </div>
      </div>
    `;
    return modal;
  }

  // Métodos de utilidad
  generateId() {
    return 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  sanitizeDetails(details) {
    const sanitized = { ...details };

    // Remover campos sensibles
    this.sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }

  sanitizeValue(value) {
    if (typeof value === 'string') {
      // Verificar si contiene datos sensibles
      const lowerValue = value.toLowerCase();
      if (this.sensitiveFields.some((field) => lowerValue.includes(field))) {
        return '[REDACTED]';
      }
    }
    return value;
  }

  getCurrentUserId() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user?.id || user?.email || 'anonymous';
    }
    return 'anonymous';
  }

  getClientIP() {
    // En un entorno real, esto vendría del servidor
    return '127.0.0.1';
  }

  getSessionId() {
    return sessionStorage.getItem('axyra_session_id') || 'unknown';
  }

  getCurrentModule() {
    const path = window.location.pathname;
    const module = path.split('/').pop().replace('.html', '');
    return module || 'unknown';
  }

  getSeverityLevel(type) {
    const criticalTypes = ['ERROR', 'SECURITY_BREACH', 'DATA_CORRUPTION', 'SYSTEM_FAILURE'];
    const highTypes = ['AUTH_FAILED', 'PERMISSION_DENIED', 'CONFIG_CHANGE', 'DATA_DELETE'];
    const mediumTypes = ['USER_ACTION', 'DATA_UPDATE', 'FORM_SUBMIT'];

    if (criticalTypes.some((t) => type.includes(t))) return 'CRITICAL';
    if (highTypes.some((t) => type.includes(t))) return 'HIGH';
    if (mediumTypes.some((t) => type.includes(t))) return 'MEDIUM';
    return 'LOW';
  }

  getEventCategory(type) {
    if (type.startsWith('AUTH_')) return 'AUTHENTICATION';
    if (type.startsWith('DATA_')) return 'DATA';
    if (type.startsWith('CONFIG_')) return 'CONFIGURATION';
    if (type.startsWith('SECURITY_')) return 'SECURITY';
    if (type.includes('ERROR')) return 'ERROR';
    if (type.includes('SYSTEM')) return 'SYSTEM';
    return 'USER_ACTION';
  }

  assessRiskLevel(type, details) {
    if (type.includes('FAILED') || type.includes('DENIED')) return 'HIGH';
    if (type.includes('DELETE') || type.includes('REMOVE')) return 'MEDIUM';
    return 'LOW';
  }

  loadAuditLogs() {
    try {
      const stored = localStorage.getItem('axyra_audit_logs');
      if (stored) {
        this.auditLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error cargando logs de auditoría:', error);
      this.auditLogs = [];
    }
  }

  saveAuditLogs() {
    try {
      localStorage.setItem('axyra_audit_logs', JSON.stringify(this.auditLogs));
    } catch (error) {
      console.error('Error guardando logs de auditoría:', error);
    }
  }

  exportToJSON(logs) {
    const data = {
      exportDate: new Date().toISOString(),
      totalLogs: logs.length,
      logs: logs,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `axyra_audit_logs_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportToCSV(logs) {
    const headers = ['ID', 'Timestamp', 'Type', 'Description', 'User', 'IP', 'Module', 'Severity', 'Category'];
    const csvContent = [
      headers.join(','),
      ...logs.map((log) =>
        [
          log.id,
          log.timestamp,
          log.type,
          `"${log.description.replace(/"/g, '""')}"`,
          log.userId,
          log.ip,
          log.module || '',
          log.severity,
          log.category,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `axyra_audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportToXLSX(logs) {
    // Implementación básica - en producción usar una librería como xlsx
    this.exportToCSV(logs);
  }

  exportToPDF(logs) {
    // Implementación básica - en producción usar una librería como jsPDF
    this.exportToJSON(logs);
  }

  // Métodos públicos para uso externo
  enable() {
    this.isEnabled = true;
    this.logSystemEvent('AUDIT_ENABLED', 'Sistema de auditoría habilitado');
  }

  disable() {
    this.isEnabled = false;
    this.logSystemEvent('AUDIT_DISABLED', 'Sistema de auditoría deshabilitado');
  }

  clearLogs() {
    const count = this.auditLogs.length;
    this.auditLogs = [];
    this.saveAuditLogs();
    this.logSystemEvent('AUDIT_CLEARED', `Logs de auditoría limpiados: ${count} registros eliminados`);
    return count;
  }

  getSystemHealth() {
    const stats = this.getAuditStats('24h');
    const health = {
      status: 'HEALTHY',
      issues: [],
      recommendations: [],
    };

    // Verificar eventos críticos
    if (stats.criticalEvents > 0) {
      health.status = 'WARNING';
      health.issues.push(`${stats.criticalEvents} eventos críticos en las últimas 24h`);
    }

    // Verificar errores
    if (stats.errorEvents > 10) {
      health.status = 'WARNING';
      health.issues.push(`${stats.errorEvents} errores en las últimas 24h`);
    }

    // Verificar actividad de seguridad
    if (stats.securityEvents > 5) {
      health.status = 'WARNING';
      health.issues.push(`${stats.securityEvents} eventos de seguridad en las últimas 24h`);
    }

    // Recomendaciones
    if (stats.totalEvents > 1000) {
      health.recommendations.push('Considerar aumentar la frecuencia de limpieza de logs');
    }

    if (stats.byUser['anonymous'] > 100) {
      health.recommendations.push('Muchos eventos de usuario anónimo - verificar autenticación');
    }

    return health;
  }
}

// Inicializar sistema de auditoría
let axyraAuditSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraAuditSystem = new AxyraAuditSystem();
  window.axyraAuditSystem = axyraAuditSystem;
});

// Exportar para uso global
window.AxyraAuditSystem = AxyraAuditSystem;
