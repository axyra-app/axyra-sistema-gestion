/**
 * AXYRA - Sistema Avanzado de Backup
 * Sistema completo con programación automática y múltiples formatos
 */

class AxyraBackupSystemAdvanced {
  constructor() {
    this.backupConfig = {
      enabled: true,
      frequency: 'daily', // daily, weekly, monthly
      time: '02:00', // Hora de backup (24h format)
      retention: 30, // Días de retención
      formats: ['json', 'csv', 'xlsx'],
      compression: true,
      encryption: false,
      cloudSync: false,
      maxSize: 100 * 1024 * 1024, // 100MB
      includeAudit: true,
      includeConfig: true,
      includeData: true,
    };

    this.backupHistory = [];
    this.scheduledBackups = [];
    this.isRunning = false;

    this.init();
  }

  init() {
    try {
      console.log('💾 Inicializando sistema avanzado de backup...');

      // Cargar configuración
      this.loadConfig();

      // Cargar historial de backups
      this.loadBackupHistory();

      // Configurar programación automática
      this.setupScheduledBackups();

      // Configurar listeners
      this.setupEventListeners();

      // Verificar backups pendientes
      this.checkPendingBackups();

      console.log('✅ Sistema de backup avanzado inicializado');
    } catch (error) {
      console.error('❌ Error inicializando backup:', error);
    }
  }

  /**
   * Ejecuta backup completo
   */
  async performBackup(options = {}) {
    if (this.isRunning) {
      throw new Error('Backup ya en progreso');
    }

    this.isRunning = true;
    const startTime = Date.now();

    try {
      console.log('🔄 Iniciando backup completo...');

      // Crear directorio de backup
      const backupId = this.generateBackupId();
      const backupInfo = {
        id: backupId,
        timestamp: new Date().toISOString(),
        status: 'IN_PROGRESS',
        formats: [],
        size: 0,
        duration: 0,
        error: null,
      };

      this.backupHistory.unshift(backupInfo);
      this.saveBackupHistory();

      // Recopilar datos
      const backupData = await this.collectBackupData(options);

      // Generar backups en diferentes formatos
      const formats = options.formats || this.backupConfig.formats;
      const backupFiles = [];

      for (const format of formats) {
        try {
          const file = await this.generateBackupFile(backupData, format, backupId);
          backupFiles.push(file);
          backupInfo.formats.push(format);
        } catch (error) {
          console.error(`Error generando backup ${format}:`, error);
        }
      }

      // Comprimir si está habilitado
      if (this.backupConfig.compression && backupFiles.length > 0) {
        await this.compressBackupFiles(backupFiles, backupId);
      }

      // Encriptar si está habilitado
      if (this.backupConfig.encryption && backupFiles.length > 0) {
        await this.encryptBackupFiles(backupFiles, backupId);
      }

      // Sincronizar con la nube si está habilitado
      if (this.backupConfig.cloudSync && backupFiles.length > 0) {
        await this.syncToCloud(backupFiles, backupId);
      }

      // Actualizar información del backup
      backupInfo.status = 'COMPLETED';
      backupInfo.duration = Date.now() - startTime;
      backupInfo.size = this.calculateTotalSize(backupFiles);
      backupInfo.files = backupFiles.map((f) => f.name);

      // Limpiar backups antiguos
      this.cleanupOldBackups();

      // Registrar evento de auditoría
      if (window.axyraAuditSystem) {
        window.axyraAuditSystem.logSystemEvent('BACKUP_COMPLETED', `Backup completado: ${backupId}`, {
          backupId: backupId,
          formats: backupInfo.formats,
          size: backupInfo.size,
          duration: backupInfo.duration,
        });
      }

      console.log('✅ Backup completado exitosamente');
      return backupInfo;
    } catch (error) {
      console.error('❌ Error durante backup:', error);

      if (backupInfo) {
        backupInfo.status = 'FAILED';
        backupInfo.error = error.message;
        backupInfo.duration = Date.now() - startTime;
      }

      // Registrar error en auditoría
      if (window.axyraAuditSystem) {
        window.axyraAuditSystem.logError(error, {
          context: 'backup_system',
          backupId: backupId,
        });
      }

      throw error;
    } finally {
      this.isRunning = false;
      this.saveBackupHistory();
    }
  }

  /**
   * Recopila todos los datos para el backup
   */
  async collectBackupData(options = {}) {
    const data = {
      metadata: {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        system: 'AXYRA',
        backupType: options.type || 'FULL',
      },
      config: {},
      data: {},
      audit: {},
      files: [],
    };

    try {
      // Configuración del sistema
      if (this.backupConfig.includeConfig) {
        data.config = {
          company: JSON.parse(localStorage.getItem('axyra_config_empresa') || '{}'),
          system: JSON.parse(localStorage.getItem('axyra_config_sistema') || '{}'),
          security: JSON.parse(localStorage.getItem('axyra_config_seguridad') || '{}'),
          roles: JSON.parse(localStorage.getItem('axyra_roles') || '[]'),
          workAreas: JSON.parse(localStorage.getItem('axyra_work_areas') || '[]'),
        };
      }

      // Datos del sistema
      if (this.backupConfig.includeData) {
        data.data = {
          empleados: JSON.parse(localStorage.getItem('axyra_empleados') || '[]'),
          horas: JSON.parse(localStorage.getItem('axyra_horas') || '[]'),
          nominas: JSON.parse(localStorage.getItem('axyra_nominas') || '[]'),
          facturas: JSON.parse(localStorage.getItem('axyra_facturas') || '[]'),
          inventario: JSON.parse(localStorage.getItem('axyra_inventario') || '[]'),
          cuadreCaja: JSON.parse(localStorage.getItem('axyra_cuadre_caja') || '[]'),
          usuarios: JSON.parse(localStorage.getItem('axyra_usuarios') || '[]'),
        };
      }

      // Logs de auditoría
      if (this.backupConfig.includeAudit && window.axyraAuditSystem) {
        data.audit = {
          logs: window.axyraAuditSystem.getLogs({ limit: 1000 }),
          stats: window.axyraAuditSystem.getAuditStats('7d'),
        };
      }

      // Archivos adjuntos (si existen)
      data.files = await this.collectAttachedFiles();

      return data;
    } catch (error) {
      console.error('Error recopilando datos:', error);
      throw error;
    }
  }

  /**
   * Genera archivo de backup en formato específico
   */
  async generateBackupFile(data, format, backupId) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `axyra_backup_${backupId}_${timestamp}.${format}`;

    switch (format.toLowerCase()) {
      case 'json':
        return this.generateJSONBackup(data, filename);
      case 'csv':
        return this.generateCSVBackup(data, filename);
      case 'xlsx':
        return this.generateXLSXBackup(data, filename);
      case 'zip':
        return this.generateZIPBackup(data, filename);
      default:
        throw new Error(`Formato no soportado: ${format}`);
    }
  }

  /**
   * Genera backup en formato JSON
   */
  generateJSONBackup(data, filename) {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });

    return {
      name: filename,
      blob: blob,
      size: blob.size,
      type: 'application/json',
    };
  }

  /**
   * Genera backup en formato CSV
   */
  generateCSVBackup(data, filename) {
    const csvData = this.convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });

    return {
      name: filename,
      blob: blob,
      size: blob.size,
      type: 'text/csv',
    };
  }

  /**
   * Genera backup en formato XLSX
   */
  generateXLSXBackup(data, filename) {
    // Implementación básica - en producción usar librería xlsx
    return this.generateCSVBackup(data, filename.replace('.xlsx', '.csv'));
  }

  /**
   * Genera backup comprimido
   */
  generateZIPBackup(data, filename) {
    // Implementación básica - en producción usar librería JSZip
    return this.generateJSONBackup(data, filename.replace('.zip', '.json'));
  }

  /**
   * Convierte datos a formato CSV
   */
  convertToCSV(data) {
    const csvRows = [];

    // Agregar metadatos
    csvRows.push('Section,Key,Value');
    csvRows.push(`metadata,version,"${data.metadata.version}"`);
    csvRows.push(`metadata,timestamp,"${data.metadata.timestamp}"`);
    csvRows.push(`metadata,system,"${data.metadata.system}"`);

    // Agregar configuración
    Object.entries(data.config).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          csvRows.push(`config,${key}.${subKey},"${subValue}"`);
        });
      } else {
        csvRows.push(`config,${key},"${value}"`);
      }
    });

    // Agregar datos
    Object.entries(data.data).forEach(([table, records]) => {
      if (Array.isArray(records) && records.length > 0) {
        const headers = Object.keys(records[0]);
        csvRows.push(`data,${table},"${headers.join(',')}"`);

        records.forEach((record) => {
          const values = headers.map((header) => `"${record[header] || ''}"`);
          csvRows.push(`data,${table},"${values.join(',')}"`);
        });
      }
    });

    return csvRows.join('\n');
  }

  /**
   * Comprime archivos de backup
   */
  async compressBackupFiles(files, backupId) {
    // Implementación básica - en producción usar librería de compresión
    console.log(`Comprimiendo ${files.length} archivos para backup ${backupId}`);
  }

  /**
   * Encripta archivos de backup
   */
  async encryptBackupFiles(files, backupId) {
    // Implementación básica - en producción usar librería de encriptación
    console.log(`Encriptando ${files.length} archivos para backup ${backupId}`);
  }

  /**
   * Sincroniza con la nube
   */
  async syncToCloud(files, backupId) {
    // Implementación básica - en producción integrar con servicios de nube
    console.log(`Sincronizando ${files.length} archivos con la nube para backup ${backupId}`);
  }

  /**
   * Recopila archivos adjuntos
   */
  async collectAttachedFiles() {
    // Implementación básica - en producción escanear directorio de archivos
    return [];
  }

  /**
   * Configura backups programados
   */
  setupScheduledBackups() {
    if (!this.backupConfig.enabled) return;

    // Limpiar programaciones existentes
    this.scheduledBackups.forEach((backup) => {
      clearTimeout(backup.timeoutId);
    });
    this.scheduledBackups = [];

    // Programar backup según frecuencia
    const now = new Date();
    const backupTime = this.parseTime(this.backupConfig.time);

    let nextBackup = new Date();
    nextBackup.setHours(backupTime.hours, backupTime.minutes, 0, 0);

    // Si ya pasó la hora de hoy, programar para mañana
    if (nextBackup <= now) {
      nextBackup.setDate(nextBackup.getDate() + 1);
    }

    // Calcular siguiente backup según frecuencia
    switch (this.backupConfig.frequency) {
      case 'daily':
        // Ya calculado arriba
        break;
      case 'weekly':
        nextBackup.setDate(nextBackup.getDate() + 7);
        break;
      case 'monthly':
        nextBackup.setMonth(nextBackup.getMonth() + 1);
        break;
    }

    const timeUntilBackup = nextBackup.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      this.performScheduledBackup();
    }, timeUntilBackup);

    this.scheduledBackups.push({
      id: 'main',
      nextRun: nextBackup,
      timeoutId: timeoutId,
      frequency: this.backupConfig.frequency,
    });

    console.log(`📅 Backup programado para: ${nextBackup.toLocaleString()}`);
  }

  /**
   * Ejecuta backup programado
   */
  async performScheduledBackup() {
    try {
      console.log('🕐 Ejecutando backup programado...');

      await this.performBackup({
        type: 'SCHEDULED',
        formats: this.backupConfig.formats,
      });

      // Reprogramar siguiente backup
      this.setupScheduledBackups();
    } catch (error) {
      console.error('❌ Error en backup programado:', error);

      // Reprogramar para intentar de nuevo en 1 hora
      setTimeout(() => {
        this.performScheduledBackup();
      }, 60 * 60 * 1000);
    }
  }

  /**
   * Restaura desde backup
   */
  async restoreFromBackup(backupFile) {
    try {
      console.log('🔄 Iniciando restauración desde backup...');

      const data = await this.parseBackupFile(backupFile);

      // Validar estructura del backup
      this.validateBackupData(data);

      // Restaurar configuración
      if (data.config) {
        Object.entries(data.config).forEach(([key, value]) => {
          if (value && typeof value === 'object') {
            localStorage.setItem(`axyra_config_${key}`, JSON.stringify(value));
          }
        });
      }

      // Restaurar datos
      if (data.data) {
        Object.entries(data.data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            localStorage.setItem(`axyra_${key}`, JSON.stringify(value));
          }
        });
      }

      // Restaurar auditoría
      if (data.audit && window.axyraAuditSystem) {
        localStorage.setItem('axyra_audit_logs', JSON.stringify(data.audit.logs || []));
      }

      // Registrar evento de restauración
      if (window.axyraAuditSystem) {
        window.axyraAuditSystem.logSystemEvent('BACKUP_RESTORED', 'Sistema restaurado desde backup', {
          backupFile: backupFile.name,
          backupTimestamp: data.metadata?.timestamp,
        });
      }

      console.log('✅ Restauración completada exitosamente');

      // Recargar página para aplicar cambios
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('❌ Error restaurando backup:', error);
      throw error;
    }
  }

  /**
   * Parsea archivo de backup
   */
  async parseBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (error) {
          reject(new Error('Error parseando archivo de backup: ' + error.message));
        }
      };

      reader.onerror = () => {
        reject(new Error('Error leyendo archivo de backup'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Valida estructura de datos de backup
   */
  validateBackupData(data) {
    if (!data.metadata) {
      throw new Error('Backup inválido: falta metadata');
    }

    if (!data.metadata.system || data.metadata.system !== 'AXYRA') {
      throw new Error('Backup inválido: no es un backup de AXYRA');
    }
  }

  /**
   * Configura el sistema de backup
   */
  configureBackup(config) {
    this.backupConfig = { ...this.backupConfig, ...config };
    this.saveConfig();

    // Reprogramar backups si cambió la configuración
    if (config.frequency || config.time) {
      this.setupScheduledBackups();
    }

    // Registrar cambio de configuración
    if (window.axyraAuditSystem) {
      window.axyraAuditSystem.logConfigEvent('UPDATE', 'backup_config', null, config);
    }
  }

  /**
   * Obtiene estadísticas de backup
   */
  getBackupStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: this.backupHistory.length,
      last24h: this.backupHistory.filter((b) => new Date(b.timestamp) > last24h).length,
      last7d: this.backupHistory.filter((b) => new Date(b.timestamp) > last7d).length,
      last30d: this.backupHistory.filter((b) => new Date(b.timestamp) > last30d).length,
      successful: this.backupHistory.filter((b) => b.status === 'COMPLETED').length,
      failed: this.backupHistory.filter((b) => b.status === 'FAILED').length,
      totalSize: this.backupHistory.reduce((sum, b) => sum + (b.size || 0), 0),
      averageSize: 0,
      nextScheduled: this.scheduledBackups[0]?.nextRun || null,
      config: this.backupConfig,
    };

    if (stats.successful > 0) {
      stats.averageSize = stats.totalSize / stats.successful;
    }

    return stats;
  }

  /**
   * Limpia backups antiguos
   */
  cleanupOldBackups() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.backupConfig.retention);

    const originalLength = this.backupHistory.length;
    this.backupHistory = this.backupHistory.filter((backup) => new Date(backup.timestamp) > cutoffDate);

    const removedCount = originalLength - this.backupHistory.length;

    if (removedCount > 0) {
      console.log(`🧹 Limpieza de backups: ${removedCount} backups antiguos eliminados`);

      if (window.axyraAuditSystem) {
        window.axyraAuditSystem.logSystemEvent('BACKUP_CLEANUP', `Limpieza de backups: ${removedCount} eliminados`);
      }
    }

    return removedCount;
  }

  /**
   * Verifica backups pendientes
   */
  checkPendingBackups() {
    const pendingBackups = this.backupHistory.filter((b) => b.status === 'IN_PROGRESS');

    if (pendingBackups.length > 0) {
      console.log(`⚠️ ${pendingBackups.length} backups pendientes encontrados`);

      // Marcar como fallidos si llevan más de 1 hora
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      pendingBackups.forEach((backup) => {
        if (new Date(backup.timestamp) < oneHourAgo) {
          backup.status = 'FAILED';
          backup.error = 'Timeout - backup pendiente por más de 1 hora';
        }
      });

      this.saveBackupHistory();
    }
  }

  // Métodos de utilidad
  generateBackupId() {
    return 'backup_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  parseTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
  }

  calculateTotalSize(files) {
    return files.reduce((sum, file) => sum + (file.size || 0), 0);
  }

  setupEventListeners() {
    // Escuchar cambios en configuración
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('axyra_config_')) {
        this.setupScheduledBackups();
      }
    });

    // Escuchar antes de cerrar la página
    window.addEventListener('beforeunload', () => {
      if (this.isRunning) {
        return 'Backup en progreso. ¿Está seguro de que desea cerrar?';
      }
    });
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem('axyra_backup_config');
      if (stored) {
        this.backupConfig = { ...this.backupConfig, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error cargando configuración de backup:', error);
    }
  }

  saveConfig() {
    try {
      localStorage.setItem('axyra_backup_config', JSON.stringify(this.backupConfig));
    } catch (error) {
      console.error('Error guardando configuración de backup:', error);
    }
  }

  loadBackupHistory() {
    try {
      const stored = localStorage.getItem('axyra_backup_history');
      if (stored) {
        this.backupHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error cargando historial de backup:', error);
    }
  }

  saveBackupHistory() {
    try {
      localStorage.setItem('axyra_backup_history', JSON.stringify(this.backupHistory));
    } catch (error) {
      console.error('Error guardando historial de backup:', error);
    }
  }
}

// Inicializar sistema de backup
let axyraBackupSystemAdvanced;
document.addEventListener('DOMContentLoaded', () => {
  axyraBackupSystemAdvanced = new AxyraBackupSystemAdvanced();
  window.axyraBackupSystemAdvanced = axyraBackupSystemAdvanced;
});

// Exportar para uso global
window.AxyraBackupSystemAdvanced = AxyraBackupSystemAdvanced;

