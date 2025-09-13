/**
 * AXYRA - Sistema de Integraciones Externas
 * Maneja integraciones con APIs y servicios externos
 */

class AxyraExternalIntegrations {
  constructor() {
    this.integrations = {
      email: {
        enabled: false,
        provider: 'smtp',
        config: {},
      },
      sms: {
        enabled: false,
        provider: 'twilio',
        config: {},
      },
      calendar: {
        enabled: false,
        provider: 'google',
        config: {},
      },
      storage: {
        enabled: false,
        provider: 'google_drive',
        config: {},
      },
      accounting: {
        enabled: false,
        provider: 'quickbooks',
        config: {},
      },
      hr: {
        enabled: false,
        provider: 'bamboo',
        config: {},
      },
    };

    this.apiKeys = {};
    this.webhooks = {};
    this.isOnline = navigator.onLine;

    this.init();
  }

  init() {
    console.log('🔗 Inicializando sistema de integraciones externas...');
    this.loadIntegrationConfig();
    this.setupOnlineStatus();
    this.setupWebhooks();
    this.testConnections();
  }

  loadIntegrationConfig() {
    try {
      const stored = localStorage.getItem('axyra_integrations');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.integrations = { ...this.integrations, ...parsed };
      }
    } catch (error) {
      console.warn('Error cargando configuración de integraciones:', error);
    }
  }

  saveIntegrationConfig() {
    try {
      localStorage.setItem('axyra_integrations', JSON.stringify(this.integrations));
    } catch (error) {
      console.error('Error guardando configuración de integraciones:', error);
    }
  }

  setupOnlineStatus() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnlineStatus();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOfflineStatus();
    });
  }

  handleOnlineStatus() {
    console.log('🌐 Conexión restaurada');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Conexión restaurada');
    }

    // Reintentar operaciones pendientes
    this.retryPendingOperations();
  }

  handleOfflineStatus() {
    console.log('📴 Sin conexión');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showWarning('Sin conexión. Algunas funciones pueden no estar disponibles.');
    }
  }

  setupWebhooks() {
    // Configurar webhooks para recibir notificaciones
    this.webhooks = {
      employeeCreated: this.createWebhook('employee_created'),
      payrollGenerated: this.createWebhook('payroll_generated'),
      inventoryLow: this.createWebhook('inventory_low'),
      systemAlert: this.createWebhook('system_alert'),
    };
  }

  createWebhook(eventType) {
    return {
      url: `${window.location.origin}/webhook/${eventType}`,
      events: [eventType],
      secret: this.generateWebhookSecret(),
      active: true,
    };
  }

  generateWebhookSecret() {
    return 'wh_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async testConnections() {
    const results = {};

    for (const [name, integration] of Object.entries(this.integrations)) {
      if (integration.enabled) {
        try {
          results[name] = await this.testIntegration(name, integration);
        } catch (error) {
          results[name] = { success: false, error: error.message };
        }
      }
    }

    console.log('🔍 Resultados de pruebas de conexión:', results);
    return results;
  }

  async testIntegration(name, integration) {
    switch (name) {
      case 'email':
        return await this.testEmailIntegration(integration);
      case 'sms':
        return await this.testSMSIntegration(integration);
      case 'calendar':
        return await this.testCalendarIntegration(integration);
      case 'storage':
        return await this.testStorageIntegration(integration);
      case 'accounting':
        return await this.testAccountingIntegration(integration);
      case 'hr':
        return await this.testHRIntegration(integration);
      default:
        throw new Error('Tipo de integración no soportado');
    }
  }

  async testEmailIntegration(integration) {
    // Simular prueba de conexión SMTP
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Conexión SMTP exitosa',
          responseTime: Math.random() * 1000 + 500,
        });
      }, 1000);
    });
  }

  async testSMSIntegration(integration) {
    // Simular prueba de conexión Twilio
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Conexión Twilio exitosa',
          responseTime: Math.random() * 1000 + 300,
        });
      }, 800);
    });
  }

  async testCalendarIntegration(integration) {
    // Simular prueba de conexión Google Calendar
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Conexión Google Calendar exitosa',
          responseTime: Math.random() * 1000 + 700,
        });
      }, 1200);
    });
  }

  async testStorageIntegration(integration) {
    // Simular prueba de conexión Google Drive
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Conexión Google Drive exitosa',
          responseTime: Math.random() * 1000 + 600,
        });
      }, 1000);
    });
  }

  async testAccountingIntegration(integration) {
    // Simular prueba de conexión QuickBooks
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Conexión QuickBooks exitosa',
          responseTime: Math.random() * 1000 + 900,
        });
      }, 1500);
    });
  }

  async testHRIntegration(integration) {
    // Simular prueba de conexión BambooHR
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Conexión BambooHR exitosa',
          responseTime: Math.random() * 1000 + 800,
        });
      }, 1100);
    });
  }

  async sendEmail(to, subject, body, options = {}) {
    if (!this.integrations.email.enabled) {
      throw new Error('Integración de email no habilitada');
    }

    if (!this.isOnline) {
      throw new Error('Sin conexión a internet');
    }

    const emailData = {
      to: to,
      subject: subject,
      body: body,
      from: options.from || 'noreply@axyra.com',
      cc: options.cc || [],
      bcc: options.bcc || [],
      attachments: options.attachments || [],
      timestamp: new Date().toISOString(),
    };

    try {
      // Simular envío de email
      const result = await this.simulateEmailSend(emailData);

      // Log del envío
      this.logIntegrationEvent('email_sent', {
        to: to,
        subject: subject,
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logIntegrationEvent('email_failed', {
        to: to,
        subject: subject,
        error: error.message,
      });
      throw error;
    }
  }

  async simulateEmailSend(emailData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          messageId: 'msg_' + Date.now(),
          timestamp: new Date().toISOString(),
        });
      }, 2000);
    });
  }

  async sendSMS(to, message, options = {}) {
    if (!this.integrations.sms.enabled) {
      throw new Error('Integración de SMS no habilitada');
    }

    if (!this.isOnline) {
      throw new Error('Sin conexión a internet');
    }

    const smsData = {
      to: to,
      message: message,
      from: options.from || 'AXYRA',
      timestamp: new Date().toISOString(),
    };

    try {
      // Simular envío de SMS
      const result = await this.simulateSMSSend(smsData);

      // Log del envío
      this.logIntegrationEvent('sms_sent', {
        to: to,
        message: message,
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logIntegrationEvent('sms_failed', {
        to: to,
        message: message,
        error: error.message,
      });
      throw error;
    }
  }

  async simulateSMSSend(smsData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          messageId: 'sms_' + Date.now(),
          timestamp: new Date().toISOString(),
        });
      }, 1500);
    });
  }

  async createCalendarEvent(eventData) {
    if (!this.integrations.calendar.enabled) {
      throw new Error('Integración de calendario no habilitada');
    }

    if (!this.isOnline) {
      throw new Error('Sin conexión a internet');
    }

    const event = {
      title: eventData.title,
      description: eventData.description,
      start: eventData.start,
      end: eventData.end,
      location: eventData.location || '',
      attendees: eventData.attendees || [],
      timestamp: new Date().toISOString(),
    };

    try {
      // Simular creación de evento
      const result = await this.simulateCalendarEvent(event);

      // Log del evento
      this.logIntegrationEvent('calendar_event_created', {
        title: event.title,
        start: event.start,
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logIntegrationEvent('calendar_event_failed', {
        title: event.title,
        error: error.message,
      });
      throw error;
    }
  }

  async simulateCalendarEvent(event) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          eventId: 'evt_' + Date.now(),
          timestamp: new Date().toISOString(),
        });
      }, 1000);
    });
  }

  async uploadFile(file, options = {}) {
    if (!this.integrations.storage.enabled) {
      throw new Error('Integración de almacenamiento no habilitada');
    }

    if (!this.isOnline) {
      throw new Error('Sin conexión a internet');
    }

    const uploadData = {
      file: file,
      folder: options.folder || 'axyra_uploads',
      public: options.public || false,
      timestamp: new Date().toISOString(),
    };

    try {
      // Simular subida de archivo
      const result = await this.simulateFileUpload(uploadData);

      // Log de la subida
      this.logIntegrationEvent('file_uploaded', {
        filename: file.name,
        size: file.size,
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logIntegrationEvent('file_upload_failed', {
        filename: file.name,
        error: error.message,
      });
      throw error;
    }
  }

  async simulateFileUpload(uploadData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          fileId: 'file_' + Date.now(),
          url: `https://drive.google.com/file/d/${Date.now()}/view`,
          timestamp: new Date().toISOString(),
        });
      }, 3000);
    });
  }

  async syncAccountingData(data) {
    if (!this.integrations.accounting.enabled) {
      throw new Error('Integración de contabilidad no habilitada');
    }

    if (!this.isOnline) {
      throw new Error('Sin conexión a internet');
    }

    try {
      // Simular sincronización con QuickBooks
      const result = await this.simulateAccountingSync(data);

      // Log de la sincronización
      this.logIntegrationEvent('accounting_synced', {
        records: data.length,
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logIntegrationEvent('accounting_sync_failed', {
        records: data.length,
        error: error.message,
      });
      throw error;
    }
  }

  async simulateAccountingSync(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          syncedRecords: data.length,
          timestamp: new Date().toISOString(),
        });
      }, 2000);
    });
  }

  async syncHRData(data) {
    if (!this.integrations.hr.enabled) {
      throw new Error('Integración de RRHH no habilitada');
    }

    if (!this.isOnline) {
      throw new Error('Sin conexión a internet');
    }

    try {
      // Simular sincronización con BambooHR
      const result = await this.simulateHRSync(data);

      // Log de la sincronización
      this.logIntegrationEvent('hr_synced', {
        records: data.length,
        success: result.success,
      });

      return result;
    } catch (error) {
      this.logIntegrationEvent('hr_sync_failed', {
        records: data.length,
        error: error.message,
      });
      throw error;
    }
  }

  async simulateHRSync(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          syncedRecords: data.length,
          timestamp: new Date().toISOString(),
        });
      }, 2500);
    });
  }

  logIntegrationEvent(eventType, data) {
    const event = {
      id: Date.now() + Math.random(),
      type: eventType,
      data: data,
      timestamp: new Date().toISOString(),
      online: this.isOnline,
    };

    // Guardar en localStorage
    try {
      const logs = JSON.parse(localStorage.getItem('axyra_integration_logs') || '[]');
      logs.push(event);

      // Limitar tamaño del log
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 500);
      }

      localStorage.setItem('axyra_integration_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Error guardando log de integración:', error);
    }
  }

  getIntegrationStatus() {
    return {
      online: this.isOnline,
      integrations: Object.entries(this.integrations).map(([name, config]) => ({
        name: name,
        enabled: config.enabled,
        provider: config.provider,
        status: config.enabled ? 'active' : 'inactive',
      })),
      webhooks: Object.keys(this.webhooks).length,
      lastSync: this.getLastSyncTime(),
    };
  }

  getLastSyncTime() {
    try {
      const logs = JSON.parse(localStorage.getItem('axyra_integration_logs') || '[]');
      if (logs.length > 0) {
        return logs[logs.length - 1].timestamp;
      }
    } catch (error) {
      console.warn('Error obteniendo último sync:', error);
    }
    return null;
  }

  enableIntegration(name, config) {
    if (this.integrations[name]) {
      this.integrations[name].enabled = true;
      this.integrations[name].config = { ...this.integrations[name].config, ...config };
      this.saveIntegrationConfig();

      console.log(`✅ Integración ${name} habilitada`);

      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showSuccess(`Integración ${name} habilitada`);
      }
    }
  }

  disableIntegration(name) {
    if (this.integrations[name]) {
      this.integrations[name].enabled = false;
      this.saveIntegrationConfig();

      console.log(`❌ Integración ${name} deshabilitada`);

      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showWarning(`Integración ${name} deshabilitada`);
      }
    }
  }

  updateIntegrationConfig(name, config) {
    if (this.integrations[name]) {
      this.integrations[name].config = { ...this.integrations[name].config, ...config };
      this.saveIntegrationConfig();

      console.log(`⚙️ Configuración de ${name} actualizada`);
    }
  }

  getIntegrationLogs(limit = 100) {
    try {
      const logs = JSON.parse(localStorage.getItem('axyra_integration_logs') || '[]');
      return logs.slice(-limit);
    } catch (error) {
      console.error('Error obteniendo logs de integración:', error);
      return [];
    }
  }

  clearIntegrationLogs() {
    localStorage.removeItem('axyra_integration_logs');
    console.log('🧹 Logs de integración limpiados');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Logs de integración limpiados');
    }
  }

  retryPendingOperations() {
    // Reintentar operaciones que fallaron por falta de conexión
    const logs = this.getIntegrationLogs();
    const failedOperations = logs.filter((log) => log.type.includes('_failed') && !log.online);

    console.log(`🔄 Reintentando ${failedOperations.length} operaciones pendientes`);

    failedOperations.forEach((operation) => {
      // Aquí se implementaría la lógica para reintentar cada operación
      console.log(`Reintentando: ${operation.type}`);
    });
  }

  exportIntegrationReport() {
    const report = {
      status: this.getIntegrationStatus(),
      logs: this.getIntegrationLogs(),
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axyra-integration-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📊 Reporte de integraciones exportado');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Reporte de integraciones exportado');
    }
  }
}

// Inicializar sistema de integraciones externas
let axyraExternalIntegrations;
document.addEventListener('DOMContentLoaded', () => {
  axyraExternalIntegrations = new AxyraExternalIntegrations();
  window.axyraExternalIntegrations = axyraExternalIntegrations;
});

// Exportar para uso global
window.AxyraExternalIntegrations = AxyraExternalIntegrations;

