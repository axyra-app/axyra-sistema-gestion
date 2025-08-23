// SISTEMA UNIFICADO DE AUDITORÍA AXYRA - VERSIÓN COMPLETA
// Consolida todas las funcionalidades de auditoría y logging en un solo sistema

class AxyraAuditSystemUnified {
  constructor() {
    this.isInitialized = false;
    this.auditConfig = {
      enabled: true,
      logLevel: 'INFO', // DEBUG, INFO, WARN, ERROR
      retention: 90, // días
      maxLogs: 10000,
      realTime: true,
      sensitiveFields: ['password', 'token', 'secret', 'key'],
    };
    this.auditLogs = [];
    this.currentSession = null;
    this.userActions = new Map();

    console.log('📝 Inicializando Sistema Unificado de Auditoría AXYRA...');
  }

  // Inicializar sistema
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('⚠️ Sistema ya inicializado');
        return;
      }

      console.log('🔄 Configurando sistema de auditoría...');

      // Cargar configuración guardada
      await this.loadAuditConfig();

      // Cargar logs existentes
      await this.loadAuditLogs();

      // Configurar sesión actual
      this.setupCurrentSession();

      // Configurar listeners
      this.setupEventListeners();

      // Configurar limpieza automática
      this.setupAutoCleanup();

      this.isInitialized = true;
      console.log('✅ Sistema Unificado de Auditoría AXYRA inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando sistema de auditoría:', error);
    }
  }

  // Cargar configuración de auditoría
  async loadAuditConfig() {
    try {
      const savedConfig = localStorage.getItem('axyra_audit_config');
      if (savedConfig) {
        this.auditConfig = { ...this.auditConfig, ...JSON.parse(savedConfig) };
        console.log('✅ Configuración de auditoría cargada:', this.auditConfig);
      }
    } catch (error) {
      console.error('❌ Error cargando configuración de auditoría:', error);
    }
  }

  // Cargar logs de auditoría
  async loadAuditLogs() {
    try {
      const logsData = localStorage.getItem('axyra_audit_logs');
      if (logsData) {
        this.auditLogs = JSON.parse(logsData);
        console.log(`📋 ${this.auditLogs.length} logs de auditoría cargados`);
      }
    } catch (error) {
      console.error('❌ Error cargando logs de auditoría:', error);
    }
  }

  // Configurar sesión actual
  setupCurrentSession() {
    try {
      this.currentSession = {
        id: Date.now() + Math.random(),
        startTime: new Date().toISOString(),
        user: this.getCurrentUser(),
        ip: this.getClientIP(),
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      console.log('✅ Sesión de auditoría configurada:', this.currentSession);
    } catch (error) {
      console.error('❌ Error configurando sesión de auditoría:', error);
    }
  }

  // Obtener usuario actual
  getCurrentUser() {
    try {
      if (window.axyraUnifiedAuth && window.axyraUnifiedAuth.getCurrentUser()) {
        return window.axyraUnifiedAuth.getCurrentUser();
      }

      const userData = localStorage.getItem('axyra.app');
      if (userData) {
        return JSON.parse(userData);
      }

      return { username: 'anonymous', id: 'anonymous' };
    } catch (error) {
      console.error('❌ Error obteniendo usuario actual:', error);
      return { username: 'unknown', id: 'unknown' };
    }
  }

  // Obtener IP del cliente (simulado)
  getClientIP() {
    // En producción, esto vendría del servidor
    return '127.0.0.1';
  }

  // Configurar listeners de eventos
  setupEventListeners() {
    try {
      // Listener para eventos de auditoría
      window.addEventListener('axyra:audit:log', (event) => {
        this.handleAuditEvent(event.detail);
      });

      // Listener para cambios en el sistema
      this.setupSystemEventListeners();

      // Listener para acciones del usuario
      this.setupUserActionListeners();

      console.log('✅ Listeners de auditoría configurados');
    } catch (error) {
      console.error('❌ Error configurando listeners:', error);
    }
  }

  // Configurar listeners de eventos del sistema
  setupSystemEventListeners() {
    try {
      // Listener para cambios en localStorage
      const originalSetItem = localStorage.setItem;
      const originalRemoveItem = localStorage.removeItem;

      localStorage.setItem = (key, value) => {
        this.logSystemEvent('localStorage_set', { key, value: this.sanitizeValue(value) });
        originalSetItem.call(localStorage, key, value);
      };

      localStorage.removeItem = (key) => {
        this.logSystemEvent('localStorage_remove', { key });
        originalRemoveItem.call(localStorage, key);
      };

      // Listener para navegación
      window.addEventListener('beforeunload', () => {
        this.logSystemEvent('session_end', { session: this.currentSession });
      });

      // Listener para errores
      window.addEventListener('error', (event) => {
        this.logSystemEvent('javascript_error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          error: event.error?.stack,
        });
      });

      // Listener para promesas rechazadas
      window.addEventListener('unhandledrejection', (event) => {
        this.logSystemEvent('unhandled_promise_rejection', {
          reason: event.reason?.toString(),
          promise: event.promise,
        });
      });
    } catch (error) {
      console.error('❌ Error configurando listeners del sistema:', error);
    }
  }

  // Configurar listeners de acciones del usuario
  setupUserActionListeners() {
    try {
      // Listener para clicks en botones importantes
      document.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'BUTTON' || target.closest('button')) {
          const button = target.tagName === 'BUTTON' ? target : target.closest('button');
          this.logUserAction('button_click', {
            text: button.textContent?.trim(),
            id: button.id,
            className: button.className,
            dataset: button.dataset,
          });
        }
      });

      // Listener para envíos de formularios
      document.addEventListener('submit', (event) => {
        this.logUserAction('form_submit', {
          action: event.target.action,
          method: event.target.method,
          formId: event.target.id,
          formClass: event.target.className,
        });
      });

      // Listener para cambios en inputs importantes
      document.addEventListener('change', (event) => {
        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA') {
          if (target.dataset.audit === 'true' || target.id?.includes('password') || target.id?.includes('email')) {
            this.logUserAction('input_change', {
              type: target.type,
              id: target.id,
              name: target.name,
              value: this.sanitizeValue(target.value),
            });
          }
        }
      });
    } catch (error) {
      console.error('❌ Error configurando listeners de acciones del usuario:', error);
    }
  }

  // Configurar limpieza automática
  setupAutoCleanup() {
    try {
      // Limpiar logs antiguos diariamente
      setInterval(() => {
        this.cleanupOldLogs();
      }, 24 * 60 * 60 * 1000); // 24 horas

      console.log('✅ Limpieza automática configurada');
    } catch (error) {
      console.error('❌ Error configurando limpieza automática:', error);
    }
  }

  // Manejar evento de auditoría
  handleAuditEvent(eventData) {
    try {
      const { type, action, details, level = 'INFO' } = eventData;

      // Verificar nivel de log
      if (!this.shouldLog(level)) {
        return;
      }

      // Crear log de auditoría
      const auditLog = this.createAuditLog(type, action, details, level);

      // Agregar al historial
      this.addToLogs(auditLog);

      // Emitir evento si está habilitado en tiempo real
      if (this.auditConfig.realTime) {
        this.emitAuditEvent('logCreated', { log: auditLog });
      }
    } catch (error) {
      console.error('❌ Error manejando evento de auditoría:', error);
    }
  }

  // Verificar si se debe registrar el log
  shouldLog(level) {
    const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
    const currentLevel = levels[this.auditConfig.logLevel] || 1;
    const eventLevel = levels[level] || 1;

    return eventLevel >= currentLevel;
  }

  // Crear log de auditoría
  createAuditLog(type, action, details, level) {
    try {
      const log = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        level: level,
        type: type,
        action: action,
        details: details,
        session: this.currentSession,
        user: this.getCurrentUser(),
        context: {
          url: window.location.href,
          referrer: document.referrer,
          timestamp: Date.now(),
        },
      };

      return log;
    } catch (error) {
      console.error('❌ Error creando log de auditoría:', error);
      return null;
    }
  }

  // Agregar log al historial
  addToLogs(auditLog) {
    try {
      if (!auditLog) return;

      this.auditLogs.unshift(auditLog);

      // Mantener límite de logs
      if (this.auditLogs.length > this.auditConfig.maxLogs) {
        this.auditLogs = this.auditLogs.slice(0, this.auditConfig.maxLogs);
      }

      // Guardar en localStorage
      localStorage.setItem('axyra_audit_logs', JSON.stringify(this.auditLogs));
    } catch (error) {
      console.error('❌ Error agregando log:', error);
    }
  }

  // Registrar evento del sistema
  logSystemEvent(action, details) {
    try {
      this.handleAuditEvent({
        type: 'SYSTEM',
        action: action,
        details: details,
        level: 'INFO',
      });
    } catch (error) {
      console.error('❌ Error registrando evento del sistema:', error);
    }
  }

  // Registrar acción del usuario
  logUserAction(action, details) {
    try {
      this.handleAuditEvent({
        type: 'USER_ACTION',
        action: action,
        details: details,
        level: 'INFO',
      });
    } catch (error) {
      console.error('❌ Error registrando acción del usuario:', error);
    }
  }

  // Registrar evento de seguridad
  logSecurityEvent(action, details, level = 'WARN') {
    try {
      this.handleAuditEvent({
        type: 'SECURITY',
        action: action,
        details: details,
        level: level,
      });
    } catch (error) {
      console.error('❌ Error registrando evento de seguridad:', error);
    }
  }

  // Registrar evento de negocio
  logBusinessEvent(action, details, level = 'INFO') {
    try {
      this.handleAuditEvent({
        type: 'BUSINESS',
        action: action,
        details: details,
        level: level,
      });
    } catch (error) {
      console.error('❌ Error registrando evento de negocio:', error);
    }
  }

  // Sanitizar valor sensible
  sanitizeValue(value) {
    try {
      if (typeof value === 'string') {
        // Ocultar campos sensibles
        for (const field of this.auditConfig.sensitiveFields) {
          if (value.toLowerCase().includes(field.toLowerCase())) {
            return '[SENSITIVE_DATA]';
          }
        }
      }
      return value;
    } catch (error) {
      return '[ERROR_SANITIZING]';
    }
  }

  // Limpiar logs antiguos
  cleanupOldLogs() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.auditConfig.retention);

      const originalCount = this.auditLogs.length;
      this.auditLogs = this.auditLogs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate > cutoffDate;
      });

      const removedCount = originalCount - this.auditLogs.length;
      if (removedCount > 0) {
        console.log(`🧹 ${removedCount} logs antiguos eliminados`);

        // Guardar logs actualizados
        localStorage.setItem('axyra_audit_logs', JSON.stringify(this.auditLogs));
      }
    } catch (error) {
      console.error('❌ Error limpiando logs antiguos:', error);
    }
  }

  // Buscar logs
  searchLogs(filters = {}) {
    try {
      let filteredLogs = [...this.auditLogs];

      // Filtrar por tipo
      if (filters.type) {
        filteredLogs = filteredLogs.filter((log) => log.type === filters.type);
      }

      // Filtrar por nivel
      if (filters.level) {
        filteredLogs = filteredLogs.filter((log) => log.level === filters.level);
      }

      // Filtrar por usuario
      if (filters.user) {
        filteredLogs = filteredLogs.filter(
          (log) => log.user?.username?.includes(filters.user) || log.user?.id?.includes(filters.user)
        );
      }

      // Filtrar por acción
      if (filters.action) {
        filteredLogs = filteredLogs.filter((log) => log.action?.includes(filters.action));
      }

      // Filtrar por fecha
      if (filters.dateFrom) {
        const dateFrom = new Date(filters.dateFrom);
        filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) >= dateFrom);
      }

      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        filteredLogs = filteredLogs.filter((log) => new Date(log.timestamp) <= dateTo);
      }

      // Ordenar por timestamp (más reciente primero)
      filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      return filteredLogs;
    } catch (error) {
      console.error('❌ Error buscando logs:', error);
      return [];
    }
  }

  // Generar reporte de auditoría
  generateAuditReport(filters = {}, options = {}) {
    try {
      console.log('🔄 Generando reporte de auditoría...');

      const logs = this.searchLogs(filters);

      // Calcular estadísticas
      const stats = {
        totalLogs: logs.length,
        logsByType: {},
        logsByLevel: {},
        logsByUser: {},
        logsByAction: {},
        logsByHour: {},
        logsByDay: {},
      };

      logs.forEach((log) => {
        // Por tipo
        stats.logsByType[log.type] = (stats.logsByType[log.type] || 0) + 1;

        // Por nivel
        stats.logsByLevel[log.level] = (stats.logsByLevel[log.level] || 0) + 1;

        // Por usuario
        const username = log.user?.username || 'unknown';
        stats.logsByUser[username] = (stats.logsByUser[username] || 0) + 1;

        // Por acción
        stats.logsByAction[log.action] = (stats.logsByAction[log.action] || 0) + 1;

        // Por hora
        const hour = new Date(log.timestamp).getHours();
        stats.logsByHour[hour] = (stats.logsByHour[hour] || 0) + 1;

        // Por día
        const day = new Date(log.timestamp).toDateString();
        stats.logsByDay[day] = (stats.logsByDay[day] || 0) + 1;
      });

      const report = {
        generatedAt: new Date().toISOString(),
        filters: filters,
        options: options,
        statistics: stats,
        logs: options.includeLogs ? logs : [],
        summary: {
          period: filters.dateFrom && filters.dateTo ? `${filters.dateFrom} a ${filters.dateTo}` : 'Todo el período',
          totalEvents: logs.length,
          topUser: Object.entries(stats.logsByUser).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A',
          topAction: Object.entries(stats.logsByAction).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A',
          criticalEvents: stats.logsByLevel['ERROR'] || 0,
        },
      };

      console.log('✅ Reporte de auditoría generado');
      return report;
    } catch (error) {
      console.error('❌ Error generando reporte de auditoría:', error);
      throw error;
    }
  }

  // Exportar logs
  exportLogs(filters = {}, format = 'json') {
    try {
      console.log(`🔄 Exportando logs en formato ${format}...`);

      const logs = this.searchLogs(filters);

      switch (format.toLowerCase()) {
        case 'json':
          return this.exportToJSON(logs);
        case 'csv':
          return this.exportToCSV(logs);
        case 'excel':
          return this.exportToExcel(logs);
        default:
          throw new Error(`Formato no soportado: ${format}`);
      }
    } catch (error) {
      console.error('❌ Error exportando logs:', error);
      throw error;
    }
  }

  // Exportar a JSON
  exportToJSON(logs) {
    try {
      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);

      console.log('✅ Logs exportados a JSON');
      return true;
    } catch (error) {
      console.error('❌ Error exportando a JSON:', error);
      throw error;
    }
  }

  // Exportar a CSV
  exportToCSV(logs) {
    try {
      const headers = ['Timestamp', 'Level', 'Type', 'Action', 'User', 'Details'];
      const csvData = [headers];

      logs.forEach((log) => {
        csvData.push([
          log.timestamp,
          log.level,
          log.type,
          log.action,
          log.user?.username || 'N/A',
          JSON.stringify(log.details).replace(/"/g, '""'),
        ]);
      });

      const csvContent = csvData.map((row) => row.map((field) => `"${field}"`).join(',')).join('\n');

      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      console.log('✅ Logs exportados a CSV');
      return true;
    } catch (error) {
      console.error('❌ Error exportando a CSV:', error);
      throw error;
    }
  }

  // Exportar a Excel
  exportToExcel(logs) {
    try {
      if (typeof XLSX === 'undefined') {
        throw new Error('XLSX no disponible');
      }

      const excelData = [['Timestamp', 'Level', 'Type', 'Action', 'User', 'Details', 'Session ID', 'URL']];

      logs.forEach((log) => {
        excelData.push([
          log.timestamp,
          log.level,
          log.type,
          log.action,
          log.user?.username || 'N/A',
          JSON.stringify(log.details).substring(0, 100) + '...',
          log.session?.id || 'N/A',
          log.context?.url || 'N/A',
        ]);
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(excelData);

      // Aplicar estilos
      worksheet['!cols'] = [
        { width: 20 }, // Timestamp
        { width: 10 }, // Level
        { width: 15 }, // Type
        { width: 20 }, // Action
        { width: 15 }, // User
        { width: 40 }, // Details
        { width: 15 }, // Session ID
        { width: 30 }, // URL
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Logs');

      const fileName = `audit_logs_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      console.log('✅ Logs exportados a Excel');
      return true;
    } catch (error) {
      console.error('❌ Error exportando a Excel:', error);
      throw error;
    }
  }

  // Emitir evento de auditoría
  emitAuditEvent(eventName, data) {
    try {
      const event = new CustomEvent(`axyra:audit:${eventName}`, {
        detail: {
          timestamp: new Date().toISOString(),
          ...data,
        },
      });

      window.dispatchEvent(event);
      console.log(`📡 Evento emitido: axyra:audit:${eventName}`, data);
    } catch (error) {
      console.error('❌ Error emitiendo evento de auditoría:', error);
    }
  }

  // Obtener información del sistema
  getSystemInfo() {
    return {
      isInitialized: this.isInitialized,
      config: this.auditConfig,
      totalLogs: this.auditLogs.length,
      currentSession: this.currentSession,
      userActions: this.userActions.size,
    };
  }

  // Obtener logs de auditoría
  getAuditLogs() {
    return this.auditLogs;
  }

  // Obtener log específico
  getAuditLog(logId) {
    return this.auditLogs.find((log) => log.id === logId);
  }

  // Limpiar logs
  clearLogs() {
    try {
      this.auditLogs = [];
      localStorage.removeItem('axyra_audit_logs');
      console.log('✅ Logs de auditoría limpiados');
    } catch (error) {
      console.error('❌ Error limpiando logs:', error);
    }
  }

  // Actualizar configuración
  updateConfig(newConfig) {
    try {
      console.log('🔄 Actualizando configuración de auditoría...');

      this.auditConfig = { ...this.auditConfig, ...newConfig };

      // Guardar configuración
      localStorage.setItem('axyra_audit_config', JSON.stringify(this.auditConfig));

      console.log('✅ Configuración de auditoría actualizada:', this.auditConfig);
    } catch (error) {
      console.error('❌ Error actualizando configuración de auditoría:', error);
    }
  }
}

// Crear instancia global
window.axyraAuditSystem = new AxyraAuditSystemUnified();

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAuditSystem.initialize();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraAuditSystemUnified;
}

console.log('📝 Sistema Unificado de Auditoría AXYRA cargado');
