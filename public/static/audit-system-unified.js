// Sistema Unificado de Auditoría AXYRA - VERSIÓN SIMPLIFICADA
// Evita conflictos y mejora el rendimiento

class AxyraAuditSystemUnified {
  constructor() {
    this.isInitialized = false;
    this.auditLogs = [];
    this.config = {
      autoLog: true,
      maxLogs: 1000,
      debug: false
    };
  }

  // Inicialización simple sin conflictos
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('📋 Inicializando Sistema Unificado de Auditoría AXYRA...');
      
      // Cargar configuración y logs
      this.loadAuditConfig();
      this.loadAuditLogs();
      
      // Configurar listeners básicos
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('✅ Sistema Unificado de Auditoría AXYRA inicializado');
    } catch (error) {
      console.warn('⚠️ Error inicializando sistema unificado de auditoría:', error);
    }
  }

  // Cargar configuración de auditoría
  loadAuditConfig() {
    try {
      const savedConfig = localStorage.getItem('axyra_audit_config');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.warn('⚠️ Error cargando configuración de auditoría:', error);
    }
  }

  // Cargar logs de auditoría
  loadAuditLogs() {
    try {
      const savedLogs = localStorage.getItem('axyra_audit_logs');
      if (savedLogs) {
        this.auditLogs = JSON.parse(savedLogs);
        console.log(`📋 ${this.auditLogs.length} logs de auditoría cargados del almacenamiento`);
      }
    } catch (error) {
      console.warn('⚠️ Error cargando logs de auditoría:', error);
    }
  }

  // Configurar listeners básicos
  setupEventListeners() {
    // Solo configurar si no hay conflictos
    if (!window.axyraAuditSystem) {
      // Listener para cambios en localStorage
      window.addEventListener('storage', (e) => {
        if (this.config.autoLog) {
          this.logSystemEvent('storage_change', {
            key: e.key,
            oldValue: e.oldValue,
            newValue: e.newValue
          });
        }
      });

      // Listener para errores de JavaScript
      window.addEventListener('error', (e) => {
        if (this.config.autoLog) {
          this.logSystemEvent('javascript_error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno
          });
        }
      });
    }
  }

  // Crear log de auditoría
  createAuditLog(type, details, user = null) {
    try {
      const log = {
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        type: type,
        details: this.sanitizeValue(details),
        user: user || this.getCurrentUser() || 'system',
        ip: this.getClientIP() || 'unknown',
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      // Agregar a logs
      this.addToLogs(log);
      
      return log;
    } catch (error) {
      console.warn('⚠️ Error creando log de auditoría:', error);
      return null;
    }
  }

  // Agregar log a la lista
  addToLogs(log) {
    try {
      this.auditLogs.unshift(log);
      
      // Limitar número de logs
      if (this.auditLogs.length > this.config.maxLogs) {
        this.auditLogs = this.auditLogs.slice(0, this.config.maxLogs);
      }
      
      // Guardar en localStorage
      localStorage.setItem('axyra_audit_logs', JSON.stringify(this.auditLogs));
      
      console.log(`📋 Log de auditoría agregado: ${log.type}`);
    } catch (error) {
      console.warn('⚠️ Error agregando log de auditoría:', error);
    }
  }

  // Log de evento del sistema
  logSystemEvent(eventType, details) {
    if (!this.config.autoLog) return;
    
    this.createAuditLog('system_event', {
      event: eventType,
      details: details
    });
  }

  // Log de acción del usuario
  logUserAction(action, details) {
    this.createAuditLog('user_action', {
      action: action,
      details: details
    });
  }

  // Log de evento de seguridad
  logSecurityEvent(eventType, details) {
    this.createAuditLog('security_event', {
      event: eventType,
      details: details
    });
  }

  // Log de evento de negocio
  logBusinessEvent(eventType, details) {
    this.createAuditLog('business_event', {
      event: eventType,
      details: details
    });
  }

  // Obtener usuario actual
  getCurrentUser() {
    try {
      if (window.axyraAuthManager) {
        return window.axyraAuthManager.getCurrentUser();
      }
      
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.username || user.email || 'unknown';
      }
      
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  // Obtener IP del cliente (simulado)
  getClientIP() {
    // En producción, esto vendría del servidor
    return '127.0.0.1';
  }

  // Sanitizar valores para evitar problemas de seguridad
  sanitizeValue(value) {
    try {
      if (typeof value === 'string') {
        // Limitar longitud y remover caracteres peligrosos
        return value.substring(0, 1000).replace(/[<>]/g, '');
      }
      if (typeof value === 'object') {
        // Convertir a string y sanitizar
        return JSON.stringify(value).substring(0, 1000).replace(/[<>]/g, '');
      }
      return String(value).substring(0, 1000);
    } catch (error) {
      return 'error_processing_value';
    }
  }

  // Buscar logs
  searchLogs(query, filters = {}) {
    try {
      let filteredLogs = this.auditLogs;
      
      // Filtrar por tipo
      if (filters.type) {
        filteredLogs = filteredLogs.filter(log => log.type === filters.type);
      }
      
      // Filtrar por usuario
      if (filters.user) {
        filteredLogs = filteredLogs.filter(log => log.user === filters.user);
      }
      
      // Filtrar por fecha
      if (filters.dateFrom) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= new Date(filters.dateFrom));
      }
      if (filters.dateTo) {
        filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= new Date(filters.dateTo));
      }
      
      // Buscar en texto
      if (query) {
        const searchTerm = query.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          JSON.stringify(log).toLowerCase().includes(searchTerm)
        );
      }
      
      return filteredLogs;
    } catch (error) {
      console.warn('⚠️ Error buscando logs:', error);
      return [];
    }
  }

  // Generar reporte de auditoría
  generateAuditReport(filters = {}) {
    try {
      const logs = this.searchLogs('', filters);
      
      const report = {
        generatedAt: new Date().toISOString(),
        totalLogs: logs.length,
        logsByType: {},
        logsByUser: {},
        logsByDate: {}
      };
      
      // Agrupar por tipo
      logs.forEach(log => {
        report.logsByType[log.type] = (report.logsByType[log.type] || 0) + 1;
        report.logsByUser[log.user] = (report.logsByUser[log.user] || 0) + 1;
        
        const date = log.timestamp.split('T')[0];
        report.logsByDate[date] = (report.logsByDate[date] || 0) + 1;
      });
      
      return report;
    } catch (error) {
      console.warn('⚠️ Error generando reporte de auditoría:', error);
      return { error: 'Error generando reporte' };
    }
  }

  // Exportar logs
  exportLogs(format = 'json', filters = {}) {
    try {
      const logs = this.searchLogs('', filters);
      
      switch (format) {
        case 'json':
          return this.exportToJSON(logs);
        case 'csv':
          return this.exportToCSV(logs);
        default:
          return this.exportToJSON(logs);
      }
    } catch (error) {
      console.warn('⚠️ Error exportando logs:', error);
      return null;
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
      console.warn('⚠️ Error exportando a JSON:', error);
      return false;
    }
  }

  // Exportar a CSV
  exportToCSV(logs) {
    try {
      if (logs.length === 0) {
        console.warn('⚠️ No hay logs para exportar');
        return false;
      }
      
      const headers = ['ID', 'Timestamp', 'Type', 'User', 'IP', 'Details'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          log.id,
          log.timestamp,
          log.type,
          log.user,
          log.ip,
          JSON.stringify(log.details).replace(/"/g, '""')
        ].join(','))
      ].join('\n');
      
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
      console.warn('⚠️ Error exportando a CSV:', error);
      return false;
    }
  }

  // Limpiar logs antiguos
  cleanupOldLogs(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      
      const originalCount = this.auditLogs.length;
      this.auditLogs = this.auditLogs.filter(log => 
        new Date(log.timestamp) >= cutoffDate
      );
      
      const removedCount = originalCount - this.auditLogs.length;
      
      if (removedCount > 0) {
        localStorage.setItem('axyra_audit_logs', JSON.stringify(this.auditLogs));
        console.log(`🗑️ ${removedCount} logs antiguos eliminados`);
      }
      
      return removedCount;
    } catch (error) {
      console.warn('⚠️ Error limpiando logs antiguos:', error);
      return 0;
    }
  }

  // Obtener logs de auditoría
  getAuditLogs() {
    return this.auditLogs;
  }

  // Limpiar todos los logs
  clearLogs() {
    this.auditLogs = [];
    localStorage.removeItem('axyra_audit_logs');
    console.log('🗑️ Todos los logs de auditoría eliminados');
  }

  // Información del sistema
  getSystemInfo() {
    return {
      version: '1.0.0-simplified',
      isInitialized: this.isInitialized,
      totalLogs: this.auditLogs.length,
      config: this.config
    };
  }
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (!window.axyraAuditSystemUnified) {
    window.axyraAuditSystemUnified = new AxyraAuditSystemUnified();
    window.axyraAuditSystemUnified.initialize();
  }
});

// Exportar para uso global
window.AxyraAuditSystemUnified = AxyraAuditSystemUnified;
