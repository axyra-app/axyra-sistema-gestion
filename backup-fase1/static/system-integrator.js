/**
 * AXYRA - Integrador de Sistemas
 * Conecta y coordina todos los sistemas del proyecto
 */

class AxyraSystemIntegrator {
  constructor() {
    this.systems = new Map();
    this.isInitialized = false;
    this.init();
  }

  init() {
    console.log('🔗 Inicializando integrador de sistemas...');
    this.registerSystems();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  registerSystems() {
    // Registrar todos los sistemas disponibles
    const systemClasses = [
      'AxyraIntegrationAPISystem',
      'AxyraAdvancedSecuritySystem',
      'AxyraDataAnalyticsSystem',
      'AxyraAdvancedConfigurationSystem',
      'AxyraAdvancedUserManagementSystem',
      'AxyraFileDocumentManagementSystem',
      'AxyraProjectTaskManagementSystem',
    ];

    systemClasses.forEach((className) => {
      if (window[className]) {
        this.systems.set(className, window[className]);
        console.log(`✅ Sistema registrado: ${className}`);
      }
    });
  }

  setupEventListeners() {
    // Configurar comunicación entre sistemas
    document.addEventListener('systemEvent', (event) => {
      this.handleSystemEvent(event.detail);
    });
  }

  handleSystemEvent(eventData) {
    const { source, target, action, data } = eventData;

    if (this.systems.has(target)) {
      const targetSystem = this.systems.get(target);
      if (targetSystem && targetSystem[action]) {
        targetSystem[action](data);
      }
    }
  }

  getSystemStatus() {
    const status = {};
    this.systems.forEach((system, name) => {
      status[name] = {
        available: !!system,
        initialized: system.isInitialized || false,
      };
    });
    return status;
  }

  showSystemDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'system-integrator-dashboard';
    dashboard.innerHTML = `
      <div class="system-dashboard-overlay">
        <div class="system-dashboard-container">
          <div class="system-dashboard-header">
            <h3>🔗 Dashboard de Sistemas</h3>
            <button onclick="document.getElementById('system-integrator-dashboard').remove()">×</button>
          </div>
          <div class="system-dashboard-body">
            ${this.renderSystemStatus()}
          </div>
        </div>
      </div>
    `;

    dashboard.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 10000; display: flex;
      align-items: center; justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(dashboard);
  }

  renderSystemStatus() {
    const status = this.getSystemStatus();
    return Object.entries(status)
      .map(
        ([name, info]) => `
      <div class="system-card">
        <h4>${name}</h4>
        <p>Disponible: ${info.available ? '✅' : '❌'}</p>
        <p>Inicializado: ${info.initialized ? '✅' : '❌'}</p>
        <button onclick="window.${name.toLowerCase()}?.showDashboard?.() || window.${name.toLowerCase()}?.showSystemDashboard?.()">
          Abrir Dashboard
        </button>
      </div>
    `
      )
      .join('');
  }
}

// Inicializar integrador de sistemas
let axyraSystemIntegrator;
document.addEventListener('DOMContentLoaded', () => {
  axyraSystemIntegrator = new AxyraSystemIntegrator();
  window.axyraSystemIntegrator = axyraSystemIntegrator;
});

window.AxyraSystemIntegrator = AxyraSystemIntegrator;
