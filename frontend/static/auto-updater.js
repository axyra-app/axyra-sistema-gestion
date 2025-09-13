/**
 * AXYRA - Sistema de Actualizaciones Automáticas
 * Maneja actualizaciones del sistema y notificaciones de nuevas versiones
 */

class AxyraAutoUpdater {
  constructor() {
    this.currentVersion = '1.0.0';
    this.updateCheckInterval = 24 * 60 * 60 * 1000; // 24 horas
    this.updateCheckTimer = null;
    this.isChecking = false;
    this.updateAvailable = false;
    this.updateInfo = null;

    this.init();
  }

  init() {
    console.log('🔄 Inicializando sistema de actualizaciones...');
    this.loadVersionInfo();
    this.setupUpdateCheck();
    this.checkForUpdates();
  }

  loadVersionInfo() {
    // Cargar información de versión desde localStorage
    const versionInfo = localStorage.getItem('axyra_version_info');
    if (versionInfo) {
      try {
        const parsed = JSON.parse(versionInfo);
        this.currentVersion = parsed.version || this.currentVersion;
        this.lastUpdateCheck = parsed.lastCheck;
      } catch (error) {
        console.warn('Error cargando información de versión:', error);
      }
    }
  }

  saveVersionInfo() {
    const versionInfo = {
      version: this.currentVersion,
      lastCheck: new Date().toISOString(),
      updateAvailable: this.updateAvailable,
    };

    localStorage.setItem('axyra_version_info', JSON.stringify(versionInfo));
  }

  setupUpdateCheck() {
    // Verificar actualizaciones cada 24 horas
    this.updateCheckTimer = setInterval(() => {
      this.checkForUpdates();
    }, this.updateCheckInterval);
  }

  async checkForUpdates() {
    if (this.isChecking) {
      return;
    }

    this.isChecking = true;
    console.log('🔍 Verificando actualizaciones...');

    try {
      // Simular verificación de actualizaciones
      // En un entorno real, esto haría una petición al servidor
      const updateInfo = await this.fetchUpdateInfo();

      if (updateInfo && this.isNewerVersion(updateInfo.version, this.currentVersion)) {
        this.updateAvailable = true;
        this.updateInfo = updateInfo;
        this.notifyUpdateAvailable(updateInfo);
      } else {
        this.updateAvailable = false;
        this.updateInfo = null;
      }

      this.lastUpdateCheck = new Date().toISOString();
      this.saveVersionInfo();
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
    } finally {
      this.isChecking = false;
    }
  }

  async fetchUpdateInfo() {
    // Simular respuesta del servidor
    // En un entorno real, esto sería una petición HTTP
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular que hay una nueva versión disponible
        const hasUpdate = Math.random() > 0.7; // 30% de probabilidad

        if (hasUpdate) {
          resolve({
            version: '1.1.0',
            releaseDate: new Date().toISOString(),
            changes: [
              'Nuevas funcionalidades en el módulo de nómina',
              'Mejoras en el sistema de reportes',
              'Optimizaciones de rendimiento',
              'Corrección de bugs menores',
            ],
            downloadUrl: 'https://github.com/JuanFerUran/axyra-sistema-gestion/releases/latest',
            changelogUrl: 'https://github.com/JuanFerUran/axyra-sistema-gestion/blob/main/CHANGELOG.md',
          });
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }

  isNewerVersion(newVersion, currentVersion) {
    const newParts = newVersion.split('.').map(Number);
    const currentParts = currentVersion.split('.').map(Number);

    for (let i = 0; i < Math.max(newParts.length, currentParts.length); i++) {
      const newPart = newParts[i] || 0;
      const currentPart = currentParts[i] || 0;

      if (newPart > currentPart) {
        return true;
      } else if (newPart < currentPart) {
        return false;
      }
    }

    return false;
  }

  notifyUpdateAvailable(updateInfo) {
    console.log('🆕 Nueva versión disponible:', updateInfo.version);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showInfo(`Nueva versión disponible: ${updateInfo.version}`, {
        duration: 10000,
        actions: [
          {
            text: 'Ver Detalles',
            action: () => this.showUpdateDetails(updateInfo),
          },
          {
            text: 'Actualizar Ahora',
            action: () => this.performUpdate(updateInfo),
          },
        ],
      });
    }

    // Mostrar notificación persistente en la UI
    this.showUpdateNotification(updateInfo);
  }

  showUpdateNotification(updateInfo) {
    // Crear notificación persistente
    const notification = document.createElement('div');
    notification.id = 'update-notification';
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <div class="update-icon">🆕</div>
        <div class="update-text">
          <h4>Nueva versión disponible</h4>
          <p>Versión ${updateInfo.version} está disponible</p>
        </div>
        <div class="update-actions">
          <button onclick="window.axyraAutoUpdater.showUpdateDetails()" class="btn btn-sm btn-outline">
            Ver Detalles
          </button>
          <button onclick="window.axyraAutoUpdater.performUpdate()" class="btn btn-sm btn-primary">
            Actualizar
          </button>
          <button onclick="window.axyraAutoUpdater.dismissUpdate()" class="btn btn-sm btn-ghost">
            ×
          </button>
        </div>
      </div>
    `;

    // Agregar estilos
    if (!document.getElementById('update-notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'update-notification-styles';
      styles.textContent = `
        .update-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #fff;
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 10000;
          max-width: 400px;
          animation: slideInRight 0.3s ease-out;
        }
        
        .update-content {
          display: flex;
          align-items: center;
          padding: 16px;
          gap: 12px;
        }
        
        .update-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .update-text {
          flex: 1;
        }
        
        .update-text h4 {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .update-text p {
          margin: 0;
          font-size: 12px;
          color: #7f8c8d;
        }
        
        .update-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        
        .btn {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          font-size: 12px;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn-primary {
          background: #3498db;
          color: white;
          border-color: #3498db;
        }
        
        .btn-outline {
          background: transparent;
          color: #3498db;
          border-color: #3498db;
        }
        
        .btn-ghost {
          background: transparent;
          border: none;
          color: #95a5a6;
          font-size: 16px;
          padding: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(styles);
    }

    // Agregar al DOM
    document.body.appendChild(notification);
  }

  showUpdateDetails(updateInfo = null) {
    const info = updateInfo || this.updateInfo;
    if (!info) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Detalles de la Actualización</h3>
          <button onclick="this.closest('.modal-overlay').remove()" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="version-info">
            <h4>Versión ${info.version}</h4>
            <p class="release-date">Fecha de lanzamiento: ${new Date(info.releaseDate).toLocaleDateString()}</p>
          </div>
          
          <div class="changes">
            <h5>Cambios en esta versión:</h5>
            <ul>
              ${info.changes.map((change) => `<li>${change}</li>`).join('')}
            </ul>
          </div>
          
          <div class="links">
            <a href="${info.downloadUrl}" target="_blank" class="btn btn-primary">
              Descargar Actualización
            </a>
            <a href="${info.changelogUrl}" target="_blank" class="btn btn-outline">
              Ver Changelog Completo
            </a>
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-ghost">
            Cerrar
          </button>
          <button onclick="window.axyraAutoUpdater.performUpdate()" class="btn btn-primary">
            Actualizar Ahora
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  performUpdate(updateInfo = null) {
    const info = updateInfo || this.updateInfo;
    if (!info) return;

    console.log('🔄 Iniciando actualización...');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showInfo('Iniciando actualización...');
    }

    // Simular proceso de actualización
    setTimeout(() => {
      this.simulateUpdateProcess(info);
    }, 1000);
  }

  simulateUpdateProcess(updateInfo) {
    const steps = [
      'Descargando actualización...',
      'Verificando integridad...',
      'Aplicando cambios...',
      'Reiniciando sistema...',
    ];

    let currentStep = 0;

    const updateInterval = setInterval(() => {
      if (currentStep < steps.length) {
        console.log(`🔄 ${steps[currentStep]}`);

        if (window.axyraNotificationSystem) {
          window.axyraNotificationSystem.showInfo(steps[currentStep]);
        }

        currentStep++;
      } else {
        clearInterval(updateInterval);
        this.completeUpdate(updateInfo);
      }
    }, 2000);
  }

  completeUpdate(updateInfo) {
    console.log('✅ Actualización completada');

    // Actualizar versión
    this.currentVersion = updateInfo.version;
    this.updateAvailable = false;
    this.updateInfo = null;
    this.saveVersionInfo();

    // Ocultar notificación
    this.dismissUpdate();

    // Mostrar mensaje de éxito
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Sistema actualizado a la versión ${updateInfo.version}`);
    }

    // Recargar página para aplicar cambios
    setTimeout(() => {
      if (confirm('La actualización se ha completado. ¿Desea recargar la página para aplicar los cambios?')) {
        window.location.reload();
      }
    }, 2000);
  }

  dismissUpdate() {
    const notification = document.getElementById('update-notification');
    if (notification) {
      notification.remove();
    }
  }

  getUpdateStatus() {
    return {
      currentVersion: this.currentVersion,
      updateAvailable: this.updateAvailable,
      updateInfo: this.updateInfo,
      lastCheck: this.lastUpdateCheck,
      isChecking: this.isChecking,
    };
  }

  forceCheckForUpdates() {
    console.log('🔄 Verificación forzada de actualizaciones...');
    this.checkForUpdates();
  }

  setUpdateCheckInterval(interval) {
    this.updateCheckInterval = interval;

    if (this.updateCheckTimer) {
      clearInterval(this.updateCheckTimer);
      this.setupUpdateCheck();
    }

    console.log(`⚙️ Intervalo de verificación actualizado: ${interval}ms`);
  }

  disableAutoUpdate() {
    if (this.updateCheckTimer) {
      clearInterval(this.updateCheckTimer);
      this.updateCheckTimer = null;
    }

    console.log('⏸️ Actualizaciones automáticas deshabilitadas');
  }

  enableAutoUpdate() {
    this.setupUpdateCheck();
    console.log('▶️ Actualizaciones automáticas habilitadas');
  }
}

// Inicializar sistema de actualizaciones
let axyraAutoUpdater;
document.addEventListener('DOMContentLoaded', () => {
  axyraAutoUpdater = new AxyraAutoUpdater();
  window.axyraAutoUpdater = axyraAutoUpdater;
});

// Exportar para uso global
window.AxyraAutoUpdater = AxyraAutoUpdater;

