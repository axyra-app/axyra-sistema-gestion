// Sistema Unificado de Backup AXYRA - VERSIÓN SIMPLIFICADA
// Evita conflictos y mejora el rendimiento

class AxyraBackupSystemUnified {
  constructor() {
    this.isInitialized = false;
    this.backups = [];
    this.config = {
      autoBackup: false,
      maxBackups: 10,
      debug: false
    };
  }

  // Inicialización simple sin conflictos
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('💾 Inicializando Sistema Unificado de Backup AXYRA...');
      
      // Cargar configuración y historial
      this.loadBackupConfig();
      this.loadBackupHistory();
      
      // Configurar listeners básicos
      this.setupEventListeners();
      
      this.isInitialized = true;
      console.log('✅ Sistema Unificado de Backup AXYRA inicializado');
    } catch (error) {
      console.warn('⚠️ Error inicializando sistema unificado de backup:', error);
    }
  }

  // Cargar configuración de backup
  loadBackupConfig() {
    try {
      const savedConfig = localStorage.getItem('axyra_backup_config');
      if (savedConfig) {
        this.config = { ...this.config, ...JSON.parse(savedConfig) };
      }
    } catch (error) {
      console.warn('⚠️ Error cargando configuración de backup:', error);
    }
  }

  // Cargar historial de backups
  loadBackupHistory() {
    try {
      const savedBackups = localStorage.getItem('axyra_backups');
      if (savedBackups) {
        this.backups = JSON.parse(savedBackups);
        console.log(`💾 ${this.backups.length} backups cargados del almacenamiento`);
      }
    } catch (error) {
      console.warn('⚠️ Error cargando historial de backups:', error);
    }
  }

  // Configurar listeners básicos
  setupEventListeners() {
    // Solo configurar si no hay conflictos
    if (!window.axyraBackupSystem) {
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-backup-action]')) {
          this.handleBackupRequest(e);
        }
      });
    }
  }

  // Manejar solicitud de backup
  handleBackupRequest(event) {
    try {
      const action = event.target.dataset.backupAction;
      
      console.log(`💾 Solicitud de backup: ${action}`);
      
      switch (action) {
        case 'create':
          this.createBackup();
          break;
        case 'restore':
          this.showRestoreOptions();
          break;
        case 'list':
          this.showBackupList();
          break;
        default:
          console.warn('⚠️ Acción de backup no reconocida:', action);
      }
    } catch (error) {
      console.warn('⚠️ Error manejando solicitud de backup:', error);
    }
  }

  // Crear backup
  async createBackup() {
    try {
      console.log('🔄 Creando backup del sistema...');
      
      const backup = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        name: `Backup_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}`,
        data: await this.collectSystemData(),
        size: 0,
        status: 'completed'
      };
      
      // Calcular tamaño
      backup.size = JSON.stringify(backup.data).length;
      
      // Agregar a historial
      this.addToHistory(backup);
      
      // Mostrar notificación
      this.showBackupNotification('Backup creado exitosamente', 'success');
      
      console.log('✅ Backup creado:', backup.name);
      return backup;
    } catch (error) {
      console.warn('⚠️ Error creando backup:', error);
      this.showBackupNotification('Error creando backup', 'error');
      return null;
    }
  }

  // Recolectar datos del sistema
  async collectSystemData() {
    try {
      const systemData = {
        empleados: JSON.parse(localStorage.getItem('axyra_empleados') || '[]'),
        horas: JSON.parse(localStorage.getItem('axyra_horas') || '[]'),
        nominas: JSON.parse(localStorage.getItem('axyra_nominas') || '[]'),
        cuadres: JSON.parse(localStorage.getItem('axyra_cuadres') || '[]'),
        inventario: JSON.parse(localStorage.getItem('axyra_inventario') || '[]'),
        configuracion: JSON.parse(localStorage.getItem('axyra_configuracion') || '{}'),
        timestamp: new Date().toISOString()
      };
      
      return systemData;
    } catch (error) {
      console.warn('⚠️ Error recolectando datos del sistema:', error);
      return { error: 'Error recolectando datos' };
    }
  }

  // Agregar backup al historial
  addToHistory(backup) {
    try {
      this.backups.unshift(backup);
      
      // Limitar número de backups
      if (this.backups.length > this.config.maxBackups) {
        this.backups = this.backups.slice(0, this.config.maxBackups);
      }
      
      // Guardar en localStorage
      localStorage.setItem('axyra_backups', JSON.stringify(this.backups));
      
      console.log(`💾 Backup agregado al historial: ${backup.name}`);
    } catch (error) {
      console.warn('⚠️ Error agregando backup al historial:', error);
    }
  }

  // Mostrar opciones de restauración
  showRestoreOptions() {
    try {
      if (this.backups.length === 0) {
        this.showBackupNotification('No hay backups disponibles para restaurar', 'warning');
        return;
      }
      
      // Crear modal simple de restauración
      const modal = document.createElement('div');
      modal.className = 'axyra-backup-modal';
      modal.innerHTML = `
        <div class="axyra-backup-modal-content">
          <h3>Restaurar Backup</h3>
          <p>Selecciona un backup para restaurar:</p>
          <div class="axyra-backup-list">
            ${this.backups.map(backup => `
              <div class="axyra-backup-item">
                <span>${backup.name}</span>
                <span>${new Date(backup.timestamp).toLocaleString()}</span>
                <button onclick="axyraBackupSystemUnified.restoreBackup('${backup.id}')">
                  Restaurar
                </button>
              </div>
            `).join('')}
          </div>
          <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
        </div>
      `;
      
      document.body.appendChild(modal);
    } catch (error) {
      console.warn('⚠️ Error mostrando opciones de restauración:', error);
    }
  }

  // Restaurar backup
  async restoreBackup(backupId) {
    try {
      const backup = this.backups.find(b => b.id == backupId);
      if (!backup) {
        throw new Error('Backup no encontrado');
      }
      
      console.log(`🔄 Restaurando backup: ${backup.name}`);
      
      // Confirmar restauración
      if (!confirm(`¿Estás seguro de que quieres restaurar el backup "${backup.name}"? Esto sobrescribirá los datos actuales.`)) {
        return;
      }
      
      // Restaurar datos
      await this.restoreSystemData(backup.data);
      
      // Mostrar notificación
      this.showBackupNotification('Backup restaurado exitosamente', 'success');
      
      console.log('✅ Backup restaurado:', backup.name);
      
      // Recargar página para aplicar cambios
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.warn('⚠️ Error restaurando backup:', error);
      this.showBackupNotification('Error restaurando backup', 'error');
    }
  }

  // Restaurar datos del sistema
  async restoreSystemData(data) {
    try {
      // Restaurar cada tipo de dato
      if (data.empleados) {
        localStorage.setItem('axyra_empleados', JSON.stringify(data.empleados));
      }
      if (data.horas) {
        localStorage.setItem('axyra_horas', JSON.stringify(data.horas));
      }
      if (data.nominas) {
        localStorage.setItem('axyra_nominas', JSON.stringify(data.nominas));
      }
      if (data.cuadres) {
        localStorage.setItem('axyra_cuadres', JSON.stringify(data.cuadres));
      }
      if (data.inventario) {
        localStorage.setItem('axyra_inventario', JSON.stringify(data.inventario));
      }
      if (data.configuracion) {
        localStorage.setItem('axyra_configuracion', JSON.stringify(data.configuracion));
      }
      
      console.log('✅ Datos del sistema restaurados');
    } catch (error) {
      console.warn('⚠️ Error restaurando datos del sistema:', error);
      throw error;
    }
  }

  // Mostrar lista de backups
  showBackupList() {
    try {
      if (this.backups.length === 0) {
        this.showBackupNotification('No hay backups disponibles', 'info');
        return;
      }
      
      const backupInfo = this.backups.map(backup => 
        `${backup.name} - ${new Date(backup.timestamp).toLocaleString()} (${backup.size} bytes)`
      ).join('\n');
      
      alert(`Backups disponibles:\n\n${backupInfo}`);
    } catch (error) {
      console.warn('⚠️ Error mostrando lista de backups:', error);
    }
  }

  // Mostrar notificación de backup
  showBackupNotification(message, type = 'info') {
    try {
      // Usar sistema de notificaciones existente si está disponible
      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showNotification(message, type);
      } else {
        // Fallback simple
        console.log(`💾 ${message}`);
        alert(message);
      }
    } catch (error) {
      console.warn('⚠️ Error mostrando notificación de backup:', error);
    }
  }

  // Obtener historial de backups
  getBackupHistory() {
    return this.backups;
  }

  // Limpiar historial
  clearHistory() {
    this.backups = [];
    localStorage.removeItem('axyra_backups');
    console.log('🗑️ Historial de backups limpiado');
  }

  // Información del sistema
  getSystemInfo() {
    return {
      version: '1.0.0-simplified',
      isInitialized: this.isInitialized,
      totalBackups: this.backups.length,
      config: this.config
    };
  }
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (!window.axyraBackupSystemUnified) {
    window.axyraBackupSystemUnified = new AxyraBackupSystemUnified();
    window.axyraBackupSystemUnified.initialize();
  }
});

// Exportar para uso global
window.AxyraBackupSystemUnified = AxyraBackupSystemUnified;
