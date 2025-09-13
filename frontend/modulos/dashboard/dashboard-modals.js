/* ========================================
   AXYRA DASHBOARD MODALS - SISTEMA DIRECTO
   Sistema de modales directo para dashboard
   ======================================== */

class DashboardModals {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.createModalOverlay();
    console.log('✅ Sistema de modales del dashboard inicializado');
  }

  createModalOverlay() {
    // Crear overlay si no existe
    if (!document.getElementById('dashboard-modal-overlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'dashboard-modal-overlay';
      overlay.className = 'axyra-modal-overlay';
      document.body.appendChild(overlay);
    }
  }

  setupEventListeners() {
    // Botón personalizar
    const btnPersonalizar = document.getElementById('btnPersonalizarDashboard');
    if (btnPersonalizar) {
      btnPersonalizar.addEventListener('click', () => {
        this.showPersonalizeModal();
      });
    }

    // Botón configurar
    const btnConfigurar = document.getElementById('btnConfigurarDashboard');
    if (btnConfigurar) {
      btnConfigurar.addEventListener('click', () => {
        this.showConfigModal();
      });
    }

    // Cerrar modales
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('axyra-modal-close') || 
          e.target.classList.contains('axyra-modal-overlay')) {
        this.closeAllModals();
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });
  }

  showPersonalizeModal() {
    const content = `
      <div class="axyra-personalize-dashboard">
        <div class="axyra-personalize-header">
          <h3><i class="fas fa-palette"></i> Personalizar Dashboard</h3>
          <p>Arrastra y organiza los widgets según tus preferencias</p>
        </div>
        
        <div class="axyra-personalize-content">
          <div class="axyra-widgets-grid">
            <div class="axyra-widget-item">
              <div class="axyra-widget-preview">
                <i class="fas fa-users"></i>
                <span>Empleados Activos</span>
              </div>
              <div class="axyra-widget-controls">
                <button class="axyra-btn axyra-btn-sm axyra-btn-secondary">
                  <i class="fas fa-eye"></i> Ver
                </button>
              </div>
            </div>
            
            <div class="axyra-widget-item">
              <div class="axyra-widget-preview">
                <i class="fas fa-clock"></i>
                <span>Horas del Mes</span>
              </div>
              <div class="axyra-widget-controls">
                <button class="axyra-btn axyra-btn-sm axyra-btn-secondary">
                  <i class="fas fa-eye"></i> Ver
                </button>
              </div>
            </div>
            
            <div class="axyra-widget-item">
              <div class="axyra-widget-preview">
                <i class="fas fa-file-invoice-dollar"></i>
                <span>Nóminas Generadas</span>
              </div>
              <div class="axyra-widget-controls">
                <button class="axyra-btn axyra-btn-sm axyra-btn-secondary">
                  <i class="fas fa-eye"></i> Ver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.showModal('Personalizar Dashboard', content, 'fas fa-palette');
  }

  showConfigModal() {
    const content = `
      <div class="axyra-configuration-dashboard">
        <div class="axyra-config-section">
          <h4><i class="fas fa-cog"></i> Configuración General</h4>
          <div class="axyra-config-options">
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox" checked> Mostrar notificaciones
              </label>
            </div>
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox" checked> Actualización automática
              </label>
            </div>
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox"> Modo oscuro
              </label>
            </div>
          </div>
        </div>
        
        <div class="axyra-config-section">
          <h4><i class="fas fa-chart-line"></i> Widgets del Dashboard</h4>
          <div class="axyra-config-options">
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox" checked> Empleados activos
              </label>
            </div>
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox" checked> Horas del mes
              </label>
            </div>
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox" checked> Nóminas generadas
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    this.showModal('Configurar Dashboard', content, 'fas fa-cogs');
  }

  showModal(title, content, icon = 'fas fa-cog') {
    // Crear modal si no existe
    let modal = document.getElementById('dashboard-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dashboard-modal';
      modal.className = 'axyra-modal';
      document.body.appendChild(modal);
    }

    // Contenido del modal
    modal.innerHTML = `
      <div class="axyra-modal-content">
        <div class="axyra-modal-header">
          <h3>
            <i class="${icon}"></i>
            ${title}
          </h3>
          <button class="axyra-modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="axyra-modal-body">
          ${content}
        </div>
      </div>
    `;

    // Mostrar overlay
    const overlay = document.getElementById('dashboard-modal-overlay');
    if (overlay) {
      overlay.classList.add('active');
    }

    // Mostrar modal
    modal.classList.add('active');

    // Focus en el modal
    setTimeout(() => {
      modal.focus();
    }, 100);
  }

  closeAllModals() {
    // Cerrar modal
    const modal = document.getElementById('dashboard-modal');
    if (modal) {
      modal.classList.remove('active');
    }

    // Cerrar overlay
    const overlay = document.getElementById('dashboard-modal-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.dashboardModals = new DashboardModals();
});

// También inicializar inmediatamente si el DOM ya está listo
if (document.readyState !== 'loading') {
  window.dashboardModals = new DashboardModals();
}
