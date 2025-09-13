/**
 * AXYRA - Sistema de Actualizaciones del Sistema
 * Maneja actualizaciones, versiones y migraciones
 */

class AxyraSystemUpdater {
  constructor() {
    this.currentVersion = '1.0.0';
    this.updateInfo = null;
    this.updateHistory = [];
    this.migrations = [];
    this.isUpdating = false;
    this.updateCheckInterval = null;

    this.init();
  }

  init() {
    console.log('🔄 Inicializando sistema de actualizaciones...');
    this.loadUpdateHistory();
    this.setupMigrations();
    this.checkForUpdates();
    this.setupUpdateCheck();
  }

  loadUpdateHistory() {
    try {
      this.updateHistory = JSON.parse(localStorage.getItem('axyra_update_history') || '[]');
    } catch (error) {
      console.warn('Error cargando historial de actualizaciones:', error);
    }
  }

  saveUpdateHistory() {
    try {
      localStorage.setItem('axyra_update_history', JSON.stringify(this.updateHistory));
    } catch (error) {
      console.error('Error guardando historial de actualizaciones:', error);
    }
  }

  setupMigrations() {
    this.migrations = [
      {
        version: '1.1.0',
        description: 'Migración a versión 1.1.0',
        changes: ['Nuevo sistema de notificaciones', 'Mejoras en el dashboard', 'Optimizaciones de rendimiento'],
        migration: this.migrateTo110.bind(this),
      },
      {
        version: '1.2.0',
        description: 'Migración a versión 1.2.0',
        changes: ['Sistema de roles avanzado', 'Nuevas métricas de negocio', 'Integración con APIs externas'],
        migration: this.migrateTo120.bind(this),
      },
    ];
  }

  setupUpdateCheck() {
    // Verificar actualizaciones cada 24 horas
    this.updateCheckInterval = setInterval(() => {
      this.checkForUpdates();
    }, 24 * 60 * 60 * 1000);
  }

  async checkForUpdates() {
    try {
      console.log('🔍 Verificando actualizaciones...');

      // Simular verificación de actualizaciones
      const updateInfo = await this.fetchUpdateInfo();

      if (updateInfo && this.isNewerVersion(updateInfo.version, this.currentVersion)) {
        this.updateInfo = updateInfo;
        this.notifyUpdateAvailable(updateInfo);
      } else {
        this.updateInfo = null;
      }
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
    }
  }

  async fetchUpdateInfo() {
    // Simular respuesta del servidor
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular que hay una nueva versión disponible
        const hasUpdate = Math.random() > 0.7; // 30% de probabilidad

        if (hasUpdate) {
          resolve({
            version: '1.2.0',
            releaseDate: new Date().toISOString(),
            changes: [
              'Nuevo sistema de gestión de archivos',
              'Mejoras en el sistema de reportes',
              'Optimizaciones de seguridad',
              'Nuevas integraciones',
            ],
            downloadUrl: 'https://github.com/JuanFerUran/axyra-sistema-gestion/releases/latest',
            changelogUrl: 'https://github.com/JuanFerUran/axyra-sistema-gestion/blob/main/CHANGELOG.md',
            size: '2.5MB',
            requirements: {
              minVersion: '1.0.0',
              browser: 'Chrome 80+, Firefox 75+, Safari 13+',
            },
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
  }

  showUpdateDetails(updateInfo) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Detalles de la Actualización</h3>
          <button onclick="this.closest('.modal-overlay').remove()" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="update-info">
            <h4>Versión ${updateInfo.version}</h4>
            <p class="release-date">Fecha de lanzamiento: ${new Date(updateInfo.releaseDate).toLocaleDateString()}</p>
            <p class="update-size">Tamaño: ${updateInfo.size}</p>
            
            <div class="changes">
              <h5>Cambios en esta versión:</h5>
              <ul>
                ${updateInfo.changes.map((change) => `<li>${change}</li>`).join('')}
              </ul>
            </div>
            
            <div class="requirements">
              <h5>Requisitos:</h5>
              <p>Versión mínima: ${updateInfo.requirements.minVersion}</p>
              <p>Navegador: ${updateInfo.requirements.browser}</p>
            </div>
            
            <div class="links">
              <a href="${updateInfo.downloadUrl}" target="_blank" class="btn btn-primary">
                Descargar Actualización
              </a>
              <a href="${updateInfo.changelogUrl}" target="_blank" class="btn btn-outline">
                Ver Changelog Completo
              </a>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-ghost">
            Cerrar
          </button>
          <button onclick="axyraSystemUpdater.performUpdate()" class="btn btn-primary">
            Actualizar Ahora
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  async performUpdate(updateInfo = null) {
    const update = updateInfo || this.updateInfo;
    if (!update) {
      throw new Error('No hay actualización disponible');
    }

    if (this.isUpdating) {
      throw new Error('Actualización ya en progreso');
    }

    this.isUpdating = true;
    console.log('🔄 Iniciando actualización...');

    try {
      // Mostrar progreso
      this.showUpdateProgress();

      // Ejecutar migraciones
      await this.runMigrations(update.version);

      // Actualizar versión
      this.currentVersion = update.version;
      this.updateHistory.push({
        version: update.version,
        date: new Date().toISOString(),
        changes: update.changes,
        status: 'completed',
      });

      this.saveUpdateHistory();

      // Ocultar progreso
      this.hideUpdateProgress();

      console.log('✅ Actualización completada');

      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showSuccess(`Sistema actualizado a la versión ${update.version}`);
      }

      // Recargar página para aplicar cambios
      setTimeout(() => {
        if (confirm('La actualización se ha completado. ¿Desea recargar la página para aplicar los cambios?')) {
          window.location.reload();
        }
      }, 2000);
    } catch (error) {
      console.error('Error durante la actualización:', error);
      this.hideUpdateProgress();

      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showError(`Error durante la actualización: ${error.message}`);
      }
    } finally {
      this.isUpdating = false;
    }
  }

  showUpdateProgress() {
    const progress = document.createElement('div');
    progress.id = 'update-progress';
    progress.innerHTML = `
      <div class="update-progress-content">
        <h3>🔄 Actualizando Sistema</h3>
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
        <p id="progress-text">Preparando actualización...</p>
      </div>
    `;

    progress.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(progress);

    // Animar progreso
    this.animateProgress();
  }

  animateProgress() {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    let progress = 0;
    const steps = [
      { progress: 20, text: 'Descargando actualización...' },
      { progress: 40, text: 'Verificando integridad...' },
      { progress: 60, text: 'Aplicando cambios...' },
      { progress: 80, text: 'Ejecutando migraciones...' },
      { progress: 100, text: 'Finalizando actualización...' },
    ];

    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        progress = step.progress;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = step.text;
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }

  hideUpdateProgress() {
    const progress = document.getElementById('update-progress');
    if (progress) {
      progress.remove();
    }
  }

  async runMigrations(targetVersion) {
    const migrationsToRun = this.migrations.filter(
      (m) => this.isNewerVersion(targetVersion, m.version) || this.isNewerVersion(m.version, this.currentVersion)
    );

    for (const migration of migrationsToRun) {
      console.log(`🔄 Ejecutando migración: ${migration.description}`);
      await migration.migration();
    }
  }

  async migrateTo110() {
    // Migración a versión 1.1.0
    console.log('🔄 Migrando a versión 1.1.0...');

    // Crear nuevas configuraciones
    if (!localStorage.getItem('axyra_notification_config')) {
      localStorage.setItem(
        'axyra_notification_config',
        JSON.stringify({
          enabled: true,
          sound: true,
          desktop: true,
        })
      );
    }

    // Actualizar configuraciones existentes
    const systemConfig = JSON.parse(localStorage.getItem('axyra_system_config') || '{}');
    systemConfig.version = '1.1.0';
    localStorage.setItem('axyra_system_config', JSON.stringify(systemConfig));

    console.log('✅ Migración a 1.1.0 completada');
  }

  async migrateTo120() {
    // Migración a versión 1.2.0
    console.log('🔄 Migrando a versión 1.2.0...');

    // Crear nuevas configuraciones
    if (!localStorage.getItem('axyra_roles_config')) {
      localStorage.setItem(
        'axyra_roles_config',
        JSON.stringify({
          roles: [
            { id: 'admin', name: 'Administrador', permissions: ['*'] },
            { id: 'manager', name: 'Gerente', permissions: ['view', 'edit'] },
            { id: 'employee', name: 'Empleado', permissions: ['view'] },
          ],
        })
      );
    }

    // Actualizar configuraciones existentes
    const systemConfig = JSON.parse(localStorage.getItem('axyra_system_config') || '{}');
    systemConfig.version = '1.2.0';
    localStorage.setItem('axyra_system_config', JSON.stringify(systemConfig));

    console.log('✅ Migración a 1.2.0 completada');
  }

  getUpdateStatus() {
    return {
      currentVersion: this.currentVersion,
      updateAvailable: !!this.updateInfo,
      updateInfo: this.updateInfo,
      isUpdating: this.isUpdating,
      lastCheck: new Date().toISOString(),
    };
  }

  getUpdateHistory() {
    return this.updateHistory;
  }

  getMigrations() {
    return this.migrations;
  }

  forceCheckForUpdates() {
    console.log('🔄 Verificación forzada de actualizaciones...');
    this.checkForUpdates();
  }

  disableAutoUpdate() {
    if (this.updateCheckInterval) {
      clearInterval(this.updateCheckInterval);
      this.updateCheckInterval = null;
    }

    console.log('⏸️ Actualizaciones automáticas deshabilitadas');
  }

  enableAutoUpdate() {
    this.setupUpdateCheck();
    console.log('▶️ Actualizaciones automáticas habilitadas');
  }

  rollbackToVersion(version) {
    const targetUpdate = this.updateHistory.find((u) => u.version === version);
    if (!targetUpdate) {
      throw new Error('Versión no encontrada en el historial');
    }

    console.log(`🔄 Revirtiendo a versión ${version}...`);

    // Simular rollback
    this.currentVersion = version;
    this.updateHistory.push({
      version: version,
      date: new Date().toISOString(),
      changes: ['Rollback realizado'],
      status: 'rollback',
    });

    this.saveUpdateHistory();

    console.log(`✅ Rollback a versión ${version} completado`);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Sistema revertido a la versión ${version}`);
    }
  }

  exportUpdateHistory() {
    const data = {
      currentVersion: this.currentVersion,
      updateHistory: this.updateHistory,
      migrations: this.migrations,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axyra-update-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📊 Historial de actualizaciones exportado');
  }

  getSystemInfo() {
    return {
      version: this.currentVersion,
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      timestamp: new Date().toISOString(),
    };
  }

  checkSystemCompatibility() {
    const requirements = {
      browser: {
        chrome: 80,
        firefox: 75,
        safari: 13,
        edge: 80,
      },
      features: ['localStorage', 'sessionStorage', 'fetch', 'Promise', 'async/await'],
    };

    const compatibility = {
      browser: this.checkBrowserCompatibility(requirements.browser),
      features: this.checkFeatureCompatibility(requirements.features),
      overall: true,
    };

    compatibility.overall = compatibility.browser && compatibility.features.every((f) => f.supported);

    return compatibility;
  }

  checkBrowserCompatibility(requirements) {
    const userAgent = navigator.userAgent.toLowerCase();
    const browser = this.getBrowserInfo(userAgent);

    return {
      name: browser.name,
      version: browser.version,
      supported: browser.version >= requirements[browser.name.toLowerCase()] || 0,
    };
  }

  getBrowserInfo(userAgent) {
    if (userAgent.includes('chrome')) {
      return { name: 'Chrome', version: this.extractVersion(userAgent, 'chrome/') };
    } else if (userAgent.includes('firefox')) {
      return { name: 'Firefox', version: this.extractVersion(userAgent, 'firefox/') };
    } else if (userAgent.includes('safari')) {
      return { name: 'Safari', version: this.extractVersion(userAgent, 'version/') };
    } else if (userAgent.includes('edge')) {
      return { name: 'Edge', version: this.extractVersion(userAgent, 'edge/') };
    } else {
      return { name: 'Unknown', version: 0 };
    }
  }

  extractVersion(userAgent, prefix) {
    const match = userAgent.match(new RegExp(prefix + '([0-9.]+)'));
    return match ? parseFloat(match[1]) : 0;
  }

  checkFeatureCompatibility(features) {
    return features.map((feature) => ({
      name: feature,
      supported: this.isFeatureSupported(feature),
    }));
  }

  isFeatureSupported(feature) {
    switch (feature) {
      case 'localStorage':
        return typeof Storage !== 'undefined';
      case 'sessionStorage':
        return typeof Storage !== 'undefined';
      case 'fetch':
        return typeof fetch !== 'undefined';
      case 'Promise':
        return typeof Promise !== 'undefined';
      case 'async/await':
        return typeof async !== 'undefined';
      default:
        return false;
    }
  }
}

// Inicializar sistema de actualizaciones
let axyraSystemUpdater;
document.addEventListener('DOMContentLoaded', () => {
  axyraSystemUpdater = new AxyraSystemUpdater();
  window.axyraSystemUpdater = axyraSystemUpdater;
});

// Exportar para uso global
window.AxyraSystemUpdater = AxyraSystemUpdater;

