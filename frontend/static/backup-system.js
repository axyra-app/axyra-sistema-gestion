/**
 * AXYRA - Sistema de Backup Automático
 * Sistema completo de respaldo y sincronización de datos
 *
 * NO MODIFICA NINGÚN CÓDIGO EXISTENTE - SOLO AGREGA FUNCIONALIDAD
 */

// ========================================
// CONFIGURACIÓN DEL SISTEMA DE BACKUP
// ========================================

const AXYRA_BACKUP = {
  // Configuración por defecto
  DEFAULT_CONFIG: {
    autoBackup: true,
    backupInterval: 300000, // 5 minutos
    maxBackups: 10,
    backupToCloud: false,
    backupToLocal: true,
    encryptBackups: true,
    compressionLevel: 6,
    notifyOnBackup: true,
    backupOnChange: true,
  },

  // Tipos de backup
  TYPES: {
    FULL: 'full',
    INCREMENTAL: 'incremental',
    DIFFERENTIAL: 'differential',
  },

  // Estados del backup
  STATUS: {
    IDLE: 'idle',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    RESTORING: 'restoring',
  },
};

// ========================================
// CLASE PRINCIPAL DEL SISTEMA DE BACKUP
// ========================================

class AxyraBackupSystem {
  constructor(config = {}) {
    this.config = { ...AXYRA_BACKUP.DEFAULT_CONFIG, ...config };
    this.status = AXYRA_BACKUP.STATUS.IDLE;
    this.lastBackup = null;
    this.backupHistory = [];
    this.backupTimer = null;
    this.isInitialized = false;

    this.init();
  }

  /**
   * Inicializa el sistema de backup
   */
  async init() {
    try {
      await this.loadBackupHistory();
      this.setupEventListeners();
      this.startAutoBackup();
      this.isInitialized = true;

      console.log('Sistema de backup AXYRA inicializado');

      // Notificar que el sistema está listo
      if (this.config.notifyOnBackup) {
        this.showBackupNotification('Sistema de backup inicializado correctamente', 'info');
      }
    } catch (error) {
      console.error('Error inicializando sistema de backup:', error);
    }
  }

  /**
   * Configura los event listeners del sistema
   */
  setupEventListeners() {
    // Backup automático cuando cambien los datos
    if (this.config.backupOnChange) {
      window.addEventListener('storage', (e) => {
        if (this.shouldTriggerBackup(e.key)) {
          this.scheduleBackup(30000); // Backup en 30 segundos
        }
      });
    }

    // Backup antes de cerrar la página
    window.addEventListener('beforeunload', () => {
      this.createQuickBackup();
    });

    // Backup cuando la página se vuelve visible
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.shouldCreateBackup()) {
        this.createBackup();
      }
    });

    // Backup cuando se recupera conexión a internet
    window.addEventListener('online', () => {
      if (this.config.backupToCloud) {
        this.syncBackupsToCloud();
      }
    });
  }

  /**
   * Determina si un cambio debe trigger un backup
   * @param {string} key - Clave del localStorage que cambió
   * @returns {boolean} - True si debe trigger backup
   */
  shouldTriggerBackup(key) {
    const importantKeys = [
      'axyra_isolated_user',
      'axyra_empleados',
      'axyra_horas',
      'axyra_nomina',
      'axyra_cuadre_caja',
      'axyra_configuracion',
    ];

    return importantKeys.some((importantKey) => key.includes(importantKey));
  }

  /**
   * Determina si se debe crear un backup
   * @returns {boolean} - True si debe crear backup
   */
  shouldCreateBackup() {
    if (!this.lastBackup) return true;

    const timeSinceLastBackup = Date.now() - this.lastBackup.timestamp;
    const minInterval = this.config.backupInterval / 2; // Mínimo la mitad del intervalo

    return timeSinceLastBackup > minInterval;
  }

  /**
   * Inicia el backup automático
   */
  startAutoBackup() {
    if (!this.config.autoBackup) return;

    this.backupTimer = setInterval(() => {
      if (this.shouldCreateBackup()) {
        this.createBackup();
      }
    }, this.config.backupInterval);
  }

  /**
   * Programa un backup para más tarde
   * @param {number} delay - Delay en milisegundos
   */
  scheduleBackup(delay = 60000) {
    setTimeout(() => {
      this.createBackup();
    }, delay);
  }

  /**
   * Crea un backup completo del sistema
   * @param {string} type - Tipo de backup
   * @returns {Object} - Información del backup creado
   */
  async createBackup(type = AXYRA_BACKUP.TYPES.FULL) {
    try {
      if (this.status === AXYRA_BACKUP.STATUS.RUNNING) {
        console.log('Backup ya en progreso, saltando...');
        return null;
      }

      this.status = AXYRA_BACKUP.STATUS.RUNNING;

      // Notificar inicio del backup
      if (this.config.notifyOnBackup) {
        this.showBackupNotification('Iniciando backup del sistema...', 'info');
      }

      const startTime = Date.now();
      const backupData = await this.collectBackupData(type);
      const compressedData = await this.compressData(backupData);
      const encryptedData = await this.encryptData(compressedData);

      const backup = {
        id: this.generateBackupId(),
        type,
        timestamp: Date.now(),
        size: encryptedData.length,
        checksum: this.calculateChecksum(encryptedData),
        data: encryptedData,
        metadata: {
          version: '1.0.0',
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          type: type,
        },
      };

      // Guardar backup local
      if (this.config.backupToLocal) {
        await this.saveBackupToLocal(backup);
      }

      // Guardar backup en la nube
      if (this.config.backupToCloud) {
        await this.saveBackupToCloud(backup);
      }

      // Actualizar historial
      this.backupHistory.unshift(backup);
      this.lastBackup = backup;

      // Limpiar backups antiguos
      this.cleanupOldBackups();

      // Guardar historial
      await this.saveBackupHistory();

      const duration = Date.now() - startTime;
      this.status = AXYRA_BACKUP.STATUS.COMPLETED;

      // Notificar éxito
      if (this.config.notifyOnBackup) {
        this.showBackupNotification(
          `Backup completado en ${duration}ms. Tamaño: ${this.formatBytes(backup.size)}`,
          'success'
        );
      }

      console.log(`Backup completado en ${duration}ms`);
      return backup;
    } catch (error) {
      this.status = AXYRA_BACKUP.STATUS.FAILED;
      console.error('Error creando backup:', error);

      // Notificar error
      if (this.config.notifyOnBackup) {
        this.showBackupNotification('Error creando backup: ' + error.message, 'error');
      }

      return null;
    }
  }

  /**
   * Crea un backup rápido antes de cerrar la página
   */
  async createQuickBackup() {
    try {
      const backupData = await this.collectBackupData(AXYRA_BACKUP.TYPES.INCREMENTAL);
      const compressedData = await this.compressData(backupData);

      const quickBackup = {
        id: this.generateBackupId(),
        type: AXYRA_BACKUP.TYPES.INCREMENTAL,
        timestamp: Date.now(),
        size: compressedData.length,
        data: compressedData,
        isQuickBackup: true,
      };

      // Guardar solo localmente para backup rápido
      localStorage.setItem('axyra_quick_backup', JSON.stringify(quickBackup));
    } catch (error) {
      console.warn('No se pudo crear backup rápido:', error);
    }
  }

  /**
   * Recolecta todos los datos para el backup
   * @param {string} type - Tipo de backup
   * @returns {Object} - Datos recolectados
   */
  async collectBackupData(type) {
    const backupData = {
      timestamp: Date.now(),
      type: type,
      version: '1.0.0',
      data: {},
    };

    try {
      // Recolectar datos del localStorage
      const localStorageData = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('axyra_')) {
          try {
            localStorageData[key] = JSON.parse(localStorage.getItem(key));
          } catch (e) {
            localStorageData[key] = localStorage.getItem(key);
          }
        }
      }
      backupData.data.localStorage = localStorageData;

      // Recolectar datos de sessionStorage
      const sessionStorageData = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('axyra_')) {
          try {
            sessionStorageData[key] = JSON.parse(sessionStorage.getItem(key));
          } catch (e) {
            sessionStorageData[key] = sessionStorage.getItem(key);
          }
        }
      }
      backupData.data.sessionStorage = sessionStorageData;

      // Recolectar datos de IndexedDB si está disponible
      if ('indexedDB' in window) {
        try {
          const indexedDBData = await this.collectIndexedDBData();
          backupData.data.indexedDB = indexedDBData;
        } catch (error) {
          console.warn('No se pudo recolectar datos de IndexedDB:', error);
        }
      }

      // Recolectar configuración del sistema
      backupData.data.systemConfig = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`,
        windowSize: `${window.innerWidth}x${window.innerHeight}`,
        backupConfig: this.config,
      };

      return backupData;
    } catch (error) {
      console.error('Error recolectando datos para backup:', error);
      throw error;
    }
  }

  /**
   * Recolecta datos de IndexedDB
   * @returns {Object} - Datos de IndexedDB
   */
  async collectIndexedDBData() {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('axyra-db', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const data = {};

          // Recolectar datos de todas las object stores
          const objectStoreNames = db.objectStoreNames;
          for (const storeName of objectStoreNames) {
            try {
              const transaction = db.transaction(storeName, 'readonly');
              const store = transaction.objectStore(storeName);
              const storeData = [];

              store.openCursor().onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                  storeData.push({
                    key: cursor.key,
                    value: cursor.value,
                  });
                  cursor.continue();
                } else {
                  data[storeName] = storeData;

                  // Verificar si hemos recolectado todos los stores
                  if (Object.keys(data).length === objectStoreNames.length) {
                    resolve(data);
                  }
                }
              };
            } catch (error) {
              console.warn(`Error recolectando store ${storeName}:`, error);
              data[storeName] = [];
            }
          }

          // Si no hay stores, resolver inmediatamente
          if (objectStoreNames.length === 0) {
            resolve(data);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Comprime los datos del backup
   * @param {Object} data - Datos a comprimir
   * @returns {string} - Datos comprimidos
   */
  async compressData(data) {
    try {
      const jsonString = JSON.stringify(data);

      // Compresión simple usando LZString si está disponible
      if (window.LZString) {
        return window.LZString.compress(jsonString);
      }

      // Fallback: compresión básica removiendo espacios innecesarios
      return jsonString.replace(/\s+/g, ' ').trim();
    } catch (error) {
      console.warn('No se pudo comprimir datos, usando datos originales:', error);
      return JSON.stringify(data);
    }
  }

  /**
   * Encripta los datos del backup
   * @param {string} data - Datos a encriptar
   * @returns {string} - Datos encriptados
   */
  async encryptData(data) {
    try {
      if (!this.config.encryptBackups) {
        return data;
      }

      // Encriptación simple usando btoa (base64)
      // En producción, usar una librería de encriptación real
      return btoa(encodeURIComponent(data));
    } catch (error) {
      console.warn('No se pudo encriptar datos, usando datos originales:', error);
      return data;
    }
  }

  /**
   * Desencripta los datos del backup
   * @param {string} data - Datos encriptados
   * @returns {string} - Datos desencriptados
   */
  async decryptData(data) {
    try {
      if (!this.config.encryptBackups) {
        return data;
      }

      // Desencriptación simple usando atob (base64)
      return decodeURIComponent(atob(data));
    } catch (error) {
      console.warn('No se pudo desencriptar datos:', error);
      return data;
    }
  }

  /**
   * Guarda el backup localmente
   * @param {Object} backup - Datos del backup
   */
  async saveBackupToLocal(backup) {
    try {
      // Guardar en localStorage
      const backupKey = `axyra_backup_${backup.id}`;
      localStorage.setItem(backupKey, JSON.stringify(backup));

      // Guardar en sessionStorage como respaldo
      sessionStorage.setItem(backupKey, JSON.stringify(backup));

      console.log(`Backup guardado localmente: ${backupKey}`);
    } catch (error) {
      console.error('Error guardando backup local:', error);
      throw error;
    }
  }

  /**
   * Guarda el backup en la nube
   * @param {Object} backup - Datos del backup
   */
  async saveBackupToCloud(backup) {
    try {
      // Aquí se implementaría la lógica para guardar en Firebase, Google Drive, etc.
      // Por ahora, solo simulamos el guardado
      console.log('Backup guardado en la nube (simulado)');

      // En el futuro, implementar:
      // - Firebase Storage
      // - Google Drive API
      // - Dropbox API
      // - AWS S3
    } catch (error) {
      console.error('Error guardando backup en la nube:', error);
      // No lanzar error para no interrumpir el backup local
    }
  }

  /**
   * Restaura un backup específico
   * @param {string} backupId - ID del backup a restaurar
   * @returns {boolean} - True si se restauró correctamente
   */
  async restoreBackup(backupId) {
    try {
      this.status = AXYRA_BACKUP.STATUS.RESTORING;

      // Notificar inicio de restauración
      if (this.config.notifyOnBackup) {
        this.showBackupNotification('Iniciando restauración del backup...', 'info');
      }

      // Buscar el backup
      const backup = this.backupHistory.find((b) => b.id === backupId);
      if (!backup) {
        throw new Error('Backup no encontrado');
      }

      // Desencriptar y descomprimir datos
      const decryptedData = await this.decryptData(backup.data);
      const decompressedData = await this.decompressData(decryptedData);

      // Restaurar datos
      await this.restoreData(decompressedData.data);

      this.status = AXYRA_BACKUP.STATUS.COMPLETED;

      // Notificar éxito
      if (this.config.notifyOnBackup) {
        this.showBackupNotification('Backup restaurado correctamente', 'success');
      }

      console.log('Backup restaurado correctamente');
      return true;
    } catch (error) {
      this.status = AXYRA_BACKUP.STATUS.FAILED;
      console.error('Error restaurando backup:', error);

      // Notificar error
      if (this.config.notifyOnBackup) {
        this.showBackupNotification('Error restaurando backup: ' + error.message, 'error');
      }

      return false;
    }
  }

  /**
   * Descomprime los datos del backup
   * @param {string} data - Datos comprimidos
   * @returns {Object} - Datos descomprimidos
   */
  async decompressData(data) {
    try {
      // Descompresión usando LZString si está disponible
      if (window.LZString) {
        const decompressed = window.LZString.decompress(data);
        return JSON.parse(decompressed);
      }

      // Fallback: parsear directamente
      return JSON.parse(data);
    } catch (error) {
      console.error('Error descomprimiendo datos:', error);
      throw error;
    }
  }

  /**
   * Restaura los datos del backup
   * @param {Object} data - Datos a restaurar
   */
  async restoreData(data) {
    try {
      // Restaurar localStorage
      if (data.localStorage) {
        for (const [key, value] of Object.entries(data.localStorage)) {
          if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
          } else {
            localStorage.setItem(key, value);
          }
        }
      }

      // Restaurar sessionStorage
      if (data.sessionStorage) {
        for (const [key, value] of Object.entries(data.sessionStorage)) {
          if (typeof value === 'object') {
            sessionStorage.setItem(key, JSON.stringify(value));
          } else {
            sessionStorage.setItem(key, value);
          }
        }
      }

      // Restaurar IndexedDB si está disponible
      if (data.indexedDB && 'indexedDB' in window) {
        await this.restoreIndexedDBData(data.indexedDB);
      }

      console.log('Datos restaurados correctamente');
    } catch (error) {
      console.error('Error restaurando datos:', error);
      throw error;
    }
  }

  /**
   * Restaura datos de IndexedDB
   * @param {Object} data - Datos de IndexedDB a restaurar
   */
  async restoreIndexedDBData(data) {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('axyra-db', 1);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;

          // Restaurar cada store
          Object.entries(data).forEach(([storeName, storeData]) => {
            try {
              const transaction = db.transaction(storeName, 'readwrite');
              const store = transaction.objectStore(storeName);

              // Limpiar store existente
              store.clear();

              // Restaurar datos
              storeData.forEach((item) => {
                store.add(item.value, item.key);
              });
            } catch (error) {
              console.warn(`Error restaurando store ${storeName}:`, error);
            }
          });

          resolve();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Sincroniza backups con la nube
   */
  async syncBackupsToCloud() {
    try {
      console.log('Sincronizando backups con la nube...');

      // Implementar lógica de sincronización
      // Por ahora, solo simulamos
    } catch (error) {
      console.error('Error sincronizando backups:', error);
    }
  }

  /**
   * Limpia backups antiguos
   */
  cleanupOldBackups() {
    try {
      if (this.backupHistory.length <= this.config.maxBackups) {
        return;
      }

      const backupsToRemove = this.backupHistory.slice(this.config.maxBackups);

      backupsToRemove.forEach((backup) => {
        // Remover de localStorage
        const backupKey = `axyra_backup_${backup.id}`;
        localStorage.removeItem(backupKey);
        sessionStorage.removeItem(backupKey);

        // Remover de la nube
        if (this.config.backupToCloud) {
          this.removeBackupFromCloud(backup.id);
        }
      });

      // Actualizar historial
      this.backupHistory = this.backupHistory.slice(0, this.config.maxBackups);

      console.log(`Removidos ${backupsToRemove.length} backups antiguos`);
    } catch (error) {
      console.error('Error limpiando backups antiguos:', error);
    }
  }

  /**
   * Remueve un backup de la nube
   * @param {string} backupId - ID del backup a remover
   */
  async removeBackupFromCloud(backupId) {
    try {
      // Implementar lógica de remoción de la nube
      console.log(`Backup ${backupId} removido de la nube (simulado)`);
    } catch (error) {
      console.error('Error removiendo backup de la nube:', error);
    }
  }

  /**
   * Carga el historial de backups
   */
  async loadBackupHistory() {
    try {
      const historyData = localStorage.getItem('axyra_backup_history');
      if (historyData) {
        this.backupHistory = JSON.parse(historyData);

        // Obtener último backup
        if (this.backupHistory.length > 0) {
          this.lastBackup = this.backupHistory[0];
        }
      }

      console.log(`Historial de backups cargado: ${this.backupHistory.length} backups`);
    } catch (error) {
      console.error('Error cargando historial de backups:', error);
      this.backupHistory = [];
    }
  }

  /**
   * Guarda el historial de backups
   */
  async saveBackupHistory() {
    try {
      localStorage.setItem('axyra_backup_history', JSON.stringify(this.backupHistory));
    } catch (error) {
      console.error('Error guardando historial de backups:', error);
    }
  }

  /**
   * Genera un ID único para el backup
   * @returns {string} - ID único del backup
   */
  generateBackupId() {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calcula el checksum de los datos
   * @param {string} data - Datos para calcular checksum
   * @returns {string} - Checksum calculado
   */
  calculateChecksum(data) {
    try {
      // Checksum simple usando la suma de códigos ASCII
      let checksum = 0;
      for (let i = 0; i < data.length; i++) {
        checksum += data.charCodeAt(i);
      }
      return checksum.toString(16);
    } catch (error) {
      return '0000';
    }
  }

  /**
   * Formatea bytes en formato legible
   * @param {number} bytes - Bytes a formatear
   * @returns {string} - Bytes formateados
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Muestra una notificación del sistema de backup
   * @param {string} message - Mensaje de la notificación
   * @param {string} type - Tipo de notificación
   */
  showBackupNotification(message, type = 'info') {
    try {
      // Usar el sistema de notificaciones si está disponible
      if (window.showInfoNotification) {
        window.showInfoNotification(message, { title: 'Sistema de Backup AXYRA' });
      } else {
        console.log(`[BACKUP] ${message}`);
      }
    } catch (error) {
      console.log(`[BACKUP] ${message}`);
    }
  }

  /**
   * Obtiene estadísticas del sistema de backup
   * @returns {Object} - Estadísticas del backup
   */
  getBackupStats() {
    const totalSize = this.backupHistory.reduce((sum, backup) => sum + backup.size, 0);
    const lastBackupTime = this.lastBackup ? new Date(this.lastBackup.timestamp) : null;

    return {
      totalBackups: this.backupHistory.length,
      totalSize: this.formatBytes(totalSize),
      lastBackup: lastBackupTime,
      status: this.status,
      config: this.config,
    };
  }

  /**
   * Actualiza la configuración del sistema
   * @param {Object} newConfig - Nueva configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    // Reiniciar timer si cambió el intervalo
    if (newConfig.backupInterval && this.backupTimer) {
      clearInterval(this.backupTimer);
      this.startAutoBackup();
    }
  }

  /**
   * Detiene el sistema de backup
   */
  stop() {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }

    this.status = AXYRA_BACKUP.STATUS.IDLE;
    console.log('Sistema de backup AXYRA detenido');
  }
}

// ========================================
// FUNCIONES DE CONVENIENCIA
// ========================================

/**
 * Crea un backup manual
 * @param {string} type - Tipo de backup
 * @returns {Object} - Información del backup creado
 */
async function createManualBackup(type = AXYRA_BACKUP.TYPES.FULL) {
  if (window.axyraBackup) {
    return await window.axyraBackup.createBackup(type);
  }
  return null;
}

/**
 * Restaura un backup específico
 * @param {string} backupId - ID del backup a restaurar
 * @returns {boolean} - True si se restauró correctamente
 */
async function restoreBackup(backupId) {
  if (window.axyraBackup) {
    return await window.axyraBackup.restoreBackup(backupId);
  }
  return false;
}

/**
 * Obtiene estadísticas del sistema de backup
 * @returns {Object} - Estadísticas del backup
 */
function getBackupStats() {
  if (window.axyraBackup) {
    return window.axyraBackup.getBackupStats();
  }
  return null;
}

// ========================================
// INICIALIZACIÓN Y EXPORTACIÓN
// ========================================

// Crear instancia global del sistema de backup
let axyraBackup;

// Inicializar cuando el DOM esté listo
function initBackupSystem() {
  try {
    axyraBackup = new AxyraBackupSystem();

    // Hacer disponible globalmente
    window.axyraBackup = axyraBackup;
    window.createManualBackup = createManualBackup;
    window.restoreBackup = restoreBackup;
    window.getBackupStats = getBackupStats;

    console.log('Sistema de backup AXYRA disponible globalmente');
  } catch (error) {
    console.error('Error inicializando sistema de backup:', error);
  }
}

// Inicializar automáticamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBackupSystem);
} else {
  initBackupSystem();
}
