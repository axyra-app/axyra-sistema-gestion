/* ========================================
   AXYRA DASHBOARD PROFESSIONAL MODALS
   Modales Profesionales para Dashboard
   ======================================== */

class AxyraDashboardModals {
  constructor() {
    this.modalSystem = window.axyraModals;
    this.init();
  }

  init() {
    this.setupEventListeners();
    console.log('✅ Modales profesionales del dashboard inicializados');
  }

  setupEventListeners() {
    // Event listeners para botones del dashboard
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-modal="personalize"]')) {
        e.preventDefault();
        this.showPersonalizeDashboardModal();
      }
      
      if (e.target.matches('[data-modal="configure"]')) {
        e.preventDefault();
        this.showConfigurationModal();
      }
      
      if (e.target.matches('[data-modal="delete-widget"]')) {
        e.preventDefault();
        const widgetId = e.target.dataset.widgetId;
        const widgetName = e.target.dataset.widgetName || 'Widget';
        this.showDeleteWidgetModal(widgetId, widgetName);
      }
    });
  }

  showPersonalizeDashboardModal() {
    const content = `
      <div class="axyra-personalize-dashboard">
        <div class="axyra-personalize-header">
          <h3><i class="fas fa-palette"></i> Personalizar Dashboard</h3>
          <p>Arrastra y organiza los widgets según tus preferencias</p>
        </div>
        
        <div class="axyra-personalize-content">
          <div class="axyra-widgets-grid" id="axyraWidgetsGrid">
            <div class="axyra-widget-item" data-widget="employees">
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
            
            <div class="axyra-widget-item" data-widget="hours">
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
            
            <div class="axyra-widget-item" data-widget="payroll">
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
            
            <div class="axyra-widget-item" data-widget="salaries">
              <div class="axyra-widget-preview">
                <i class="fas fa-dollar-sign"></i>
                <span>Total Salarios</span>
              </div>
              <div class="axyra-widget-controls">
                <button class="axyra-btn axyra-btn-sm axyra-btn-secondary">
                  <i class="fas fa-eye"></i> Ver
                </button>
              </div>
            </div>
            
            <div class="axyra-widget-item" data-widget="cash">
              <div class="axyra-widget-preview">
                <i class="fas fa-calculator"></i>
                <span>Cuadres de Caja</span>
              </div>
              <div class="axyra-widget-controls">
                <button class="axyra-btn axyra-btn-sm axyra-btn-secondary">
                  <i class="fas fa-eye"></i> Ver
                </button>
              </div>
            </div>
            
            <div class="axyra-widget-item" data-widget="inventory">
              <div class="axyra-widget-preview">
                <i class="fas fa-boxes"></i>
                <span>Items en Inventario</span>
              </div>
              <div class="axyra-widget-controls">
                <button class="axyra-btn axyra-btn-sm axyra-btn-secondary">
                  <i class="fas fa-eye"></i> Ver
                </button>
              </div>
            </div>
          </div>
          
          <div class="axyra-personalize-actions">
            <button class="axyra-btn axyra-btn-secondary" onclick="axyraModals.closeAllModals()">
              <i class="fas fa-undo"></i> Restaurar por defecto
            </button>
            <button class="axyra-btn axyra-btn-primary" onclick="axyraModals.closeAllModals()">
              <i class="fas fa-save"></i> Guardar cambios
            </button>
          </div>
        </div>
      </div>
    `;

    return this.modalSystem.showModal({
      title: 'Personalizar Dashboard',
      titleIcon: 'fas fa-palette',
      content: content,
      size: 'lg',
      showConfirm: false,
      showCancel: false,
      footer: `
        <button class="axyra-btn axyra-btn-secondary" onclick="axyraModals.closeAllModals()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button class="axyra-btn axyra-btn-primary" onclick="axyraModals.closeAllModals()">
          <i class="fas fa-save"></i> Guardar cambios
        </button>
      `,
      footerAlign: 'center'
    });
  }

  showConfigurationModal() {
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
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox" checked> Total salarios
              </label>
            </div>
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox" checked> Cuadres de caja
              </label>
            </div>
            <div class="axyra-config-option">
              <label class="axyra-label">
                <input type="checkbox" checked> Items en inventario
              </label>
            </div>
          </div>
        </div>
      </div>
    `;

    return this.modalSystem.showModal({
      title: 'Configurar Dashboard',
      titleIcon: 'fas fa-cogs',
      content: content,
      size: 'md',
      showConfirm: false,
      showCancel: false,
      footer: `
        <button class="axyra-btn axyra-btn-secondary" onclick="axyraModals.closeAllModals()">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button class="axyra-btn axyra-btn-primary" onclick="axyraModals.closeAllModals()">
          <i class="fas fa-save"></i> Guardar configuración
        </button>
      `,
      footerAlign: 'center'
    });
  }

  showDeleteWidgetModal(widgetId, widgetName) {
    const content = `
      <div class="axyra-delete-widget">
        <div class="axyra-delete-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h4>¿Eliminar widget "${widgetName}"?</h4>
        <p>Esta acción eliminará el widget del dashboard. Podrás agregarlo nuevamente desde la configuración.</p>
        <div class="axyra-delete-actions">
          <button class="axyra-btn axyra-btn-secondary" onclick="axyraModals.closeAllModals()">
            <i class="fas fa-times"></i> Cancelar
          </button>
          <button class="axyra-btn axyra-btn-error" onclick="axyraModals.closeAllModals()">
            <i class="fas fa-trash"></i> Eliminar
          </button>
        </div>
      </div>
    `;

    return this.modalSystem.showModal({
      title: 'Eliminar Widget',
      titleIcon: 'fas fa-trash',
      content: content,
      size: 'sm',
      showConfirm: false,
      showCancel: false
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraDashboardModals = new AxyraDashboardModals();
});

// También inicializar inmediatamente si el DOM ya está listo
if (document.readyState !== 'loading') {
  window.axyraDashboardModals = new AxyraDashboardModals();
}
