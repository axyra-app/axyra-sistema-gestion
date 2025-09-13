// Sistema de Modales Profesionales para AXYRA Dashboard
// Diseño moderno y funcional para todas las interacciones

class AxyraProfessionalModals {
  constructor() {
    this.activeModals = new Set();
    this.modalStack = [];
    this.init();
  }

  init() {
    this.createModalStyles();
    this.setupGlobalEventListeners();
    console.log('✅ Sistema de Modales Profesionales AXYRA inicializado');
  }

  createModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Estilos para Modales Profesionales AXYRA */
      .axyra-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .axyra-modal-overlay.show {
        opacity: 1;
        visibility: visible;
      }

      .axyra-modal-container {
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        max-width: 90vw;
        max-height: 90vh;
        width: 100%;
        max-width: 600px;
        transform: scale(0.9) translateY(20px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
        position: relative;
      }

      .axyra-modal-overlay.show .axyra-modal-container {
        transform: scale(1) translateY(0);
      }

      .axyra-modal-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }

      .axyra-modal-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        pointer-events: none;
      }

      .axyra-modal-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
        position: relative;
        z-index: 1;
      }

      .axyra-modal-title i {
        font-size: 1.25rem;
        opacity: 0.9;
      }

      .axyra-modal-close {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        z-index: 1;
      }

      .axyra-modal-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }

      .axyra-modal-body {
        padding: 32px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .axyra-modal-footer {
        padding: 24px 32px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .axyra-modal-btn {
        padding: 12px 24px;
        border-radius: 8px;
        border: none;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
      }

      .axyra-modal-btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }

      .axyra-modal-btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }

      .axyra-modal-btn-secondary {
        background: #e2e8f0;
        color: #475569;
      }

      .axyra-modal-btn-secondary:hover {
        background: #cbd5e1;
      }

      .axyra-modal-btn-danger {
        background: #ef4444;
        color: white;
      }

      .axyra-modal-btn-danger:hover {
        background: #dc2626;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      }

      .axyra-modal-btn-success {
        background: #10b981;
        color: white;
      }

      .axyra-modal-btn-success:hover {
        background: #059669;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      }

      /* Animaciones de entrada */
      @keyframes modalSlideIn {
        from {
          opacity: 0;
          transform: scale(0.9) translateY(20px);
        }
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }

      @keyframes modalSlideOut {
        from {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        to {
          opacity: 0;
          transform: scale(0.9) translateY(20px);
        }
      }

      /* Estilos para contenido específico */
      .axyra-modal-content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin-bottom: 24px;
      }

      .axyra-modal-stat-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        transition: all 0.2s ease;
      }

      .axyra-modal-stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .axyra-modal-stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: #667eea;
        margin-bottom: 8px;
      }

      .axyra-modal-stat-label {
        color: #64748b;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .axyra-modal-list {
        max-height: 300px;
        overflow-y: auto;
      }

      .axyra-modal-list-item {
        display: flex;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #e2e8f0;
        gap: 12px;
      }

      .axyra-modal-list-item:last-child {
        border-bottom: none;
      }

      .axyra-modal-list-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.875rem;
      }

      .axyra-modal-list-content {
        flex: 1;
      }

      .axyra-modal-list-title {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 4px;
      }

      .axyra-modal-list-subtitle {
        color: #64748b;
        font-size: 0.875rem;
      }

      .axyra-modal-list-value {
        font-weight: 600;
        color: #667eea;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .axyra-modal-container {
          margin: 20px;
          max-width: calc(100vw - 40px);
        }

        .axyra-modal-body {
          padding: 24px;
        }

        .axyra-modal-footer {
          padding: 20px 24px;
          flex-direction: column;
        }

        .axyra-modal-btn {
          width: 100%;
          justify-content: center;
        }
      }

      /* Loading states */
      .axyra-modal-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: #64748b;
      }

      .axyra-modal-loading i {
        animation: spin 1s linear infinite;
        margin-right: 12px;
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Error states */
      .axyra-modal-error {
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .axyra-modal-error i {
        font-size: 1.25rem;
      }

      /* Success states */
      .axyra-modal-success {
        background: #f0fdf4;
        border: 1px solid #bbf7d0;
        color: #16a34a;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .axyra-modal-success i {
        font-size: 1.25rem;
      }
    `;
    document.head.appendChild(style);
  }

  setupGlobalEventListeners() {
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModals.size > 0) {
        this.closeTopModal();
      }
    });

    // Cerrar modal al hacer clic en el overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('axyra-modal-overlay')) {
        this.closeTopModal();
      }
    });
  }

  showModal(options) {
    const {
      title,
      content,
      icon = 'fas fa-info-circle',
      type = 'info',
      size = 'medium',
      showClose = true,
      buttons = [],
      onClose = null,
      onConfirm = null,
      loading = false,
      error = null,
      success = null,
    } = options;

    const modalId = `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const modalHTML = this.createModalHTML({
      modalId,
      title,
      content,
      icon,
      type,
      size,
      showClose,
      buttons,
      loading,
      error,
      success,
    });

    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    const modal = modalElement.firstElementChild;

    document.body.appendChild(modal);
    this.activeModals.add(modalId);
    this.modalStack.push(modalId);

    // Animar entrada
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });

    // Configurar eventos
    this.setupModalEvents(modal, modalId, { onClose, onConfirm });

    return modalId;
  }

  createModalHTML({ modalId, title, content, icon, type, size, showClose, buttons, loading, error, success }) {
    const sizeClass = this.getSizeClass(size);

    return `
      <div class="axyra-modal-overlay" id="${modalId}">
        <div class="axyra-modal-container ${sizeClass}">
          <div class="axyra-modal-header">
            <h3 class="axyra-modal-title">
              <i class="${icon}"></i>
              ${title}
            </h3>
            ${
              showClose
                ? '<button class="axyra-modal-close" data-action="close"><i class="fas fa-times"></i></button>'
                : ''
            }
          </div>
          <div class="axyra-modal-body">
            ${error ? `<div class="axyra-modal-error"><i class="fas fa-exclamation-triangle"></i>${error}</div>` : ''}
            ${success ? `<div class="axyra-modal-success"><i class="fas fa-check-circle"></i>${success}</div>` : ''}
            ${loading ? '<div class="axyra-modal-loading"><i class="fas fa-spinner"></i>Cargando...</div>' : ''}
            <div class="axyra-modal-content">${content}</div>
          </div>
          ${
            buttons.length > 0
              ? `
            <div class="axyra-modal-footer">
              ${buttons
                .map(
                  (btn) => `
                <button class="axyra-modal-btn axyra-modal-btn-${btn.type || 'secondary'}" data-action="${
                    btn.action || 'close'
                  }">
                  ${btn.icon ? `<i class="${btn.icon}"></i>` : ''}
                  ${btn.text}
                </button>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }
        </div>
      </div>
    `;
  }

  getSizeClass(size) {
    const sizes = {
      small: 'max-w-md',
      medium: 'max-w-2xl',
      large: 'max-w-4xl',
      xlarge: 'max-w-6xl',
      fullscreen: 'max-w-full h-full',
    };
    return sizes[size] || sizes.medium;
  }

  setupModalEvents(modal, modalId, { onClose, onConfirm }) {
    const closeBtn = modal.querySelector('[data-action="close"]');
    const confirmBtn = modal.querySelector('[data-action="confirm"]');
    const cancelBtn = modal.querySelector('[data-action="cancel"]');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal(modalId);
        if (onClose) onClose();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (onConfirm) {
          const result = onConfirm();
          if (result !== false) {
            this.closeModal(modalId);
          }
        } else {
          this.closeModal(modalId);
        }
      });
    }

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.closeModal(modalId);
        if (onClose) onClose();
      });
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('show');

    setTimeout(() => {
      modal.remove();
      this.activeModals.delete(modalId);
      this.modalStack = this.modalStack.filter((id) => id !== modalId);
    }, 300);
  }

  closeTopModal() {
    if (this.modalStack.length > 0) {
      const topModalId = this.modalStack[this.modalStack.length - 1];
      this.closeModal(topModalId);
    }
  }

  closeAllModals() {
    this.activeModals.forEach((modalId) => {
      this.closeModal(modalId);
    });
  }

  // Métodos específicos para el dashboard
  showDeleteWidgetModal(widgetName, onConfirm) {
    return this.showModal({
      title: 'Eliminar Widget',
      icon: 'fas fa-trash-alt',
      type: 'danger',
      content: `
        <div style="text-align: center; padding: 20px;">
          <div style="font-size: 3rem; color: #ef4444; margin-bottom: 16px;">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <p style="font-size: 1.125rem; color: #374151; margin-bottom: 8px;">
            ¿Estás seguro de que quieres eliminar el widget?
          </p>
          <p style="color: #6b7280; font-weight: 600;">
            "${widgetName}"
          </p>
          <p style="color: #9ca3af; font-size: 0.875rem; margin-top: 12px;">
            Esta acción no se puede deshacer.
          </p>
        </div>
      `,
      buttons: [
        {
          text: 'Cancelar',
          type: 'secondary',
          action: 'cancel',
          icon: 'fas fa-times',
        },
        {
          text: 'Eliminar',
          type: 'danger',
          action: 'confirm',
          icon: 'fas fa-trash-alt',
        },
      ],
      onConfirm: onConfirm,
    });
  }

  showPersonalizeDashboardModal() {
    return this.showModal({
      title: 'Personalizar Dashboard',
      icon: 'fas fa-cog',
      type: 'info',
      size: 'large',
      content: this.createPersonalizeDashboardContent(),
      buttons: [
        {
          text: 'Cancelar',
          type: 'secondary',
          action: 'cancel',
          icon: 'fas fa-times',
        },
        {
          text: 'Guardar Cambios',
          type: 'primary',
          action: 'confirm',
          icon: 'fas fa-save',
        },
      ],
    });
  }

  showConfigurationModal() {
    return this.showModal({
      title: 'Configuración del Sistema',
      icon: 'fas fa-cogs',
      type: 'info',
      size: 'large',
      content: this.createConfigurationContent(),
      buttons: [
        {
          text: 'Cancelar',
          type: 'secondary',
          action: 'cancel',
          icon: 'fas fa-times',
        },
        {
          text: 'Guardar Configuración',
          type: 'primary',
          action: 'confirm',
          icon: 'fas fa-save',
        },
      ],
    });
  }

  createPersonalizeDashboardContent() {
    return `
      <div class="axyra-modal-content-grid">
        <div>
          <h4 style="margin-bottom: 16px; color: #374151;">Widgets Disponibles</h4>
          <div class="axyra-modal-list">
            <div class="axyra-modal-list-item" style="cursor: pointer;">
              <div class="axyra-modal-list-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <div class="axyra-modal-list-content">
                <div class="axyra-modal-list-title">Métricas Principales</div>
                <div class="axyra-modal-list-subtitle">Estadísticas generales del sistema</div>
              </div>
              <button class="axyra-modal-btn axyra-modal-btn-primary" style="padding: 8px 16px;">
                <i class="fas fa-plus"></i> Agregar
              </button>
            </div>
            <div class="axyra-modal-list-item" style="cursor: pointer;">
              <div class="axyra-modal-list-icon">
                <i class="fas fa-chart-pie"></i>
              </div>
              <div class="axyra-modal-list-content">
                <div class="axyra-modal-list-title">Gráficos de Distribución</div>
                <div class="axyra-modal-list-subtitle">Visualizaciones de datos</div>
              </div>
              <button class="axyra-modal-btn axyra-modal-btn-primary" style="padding: 8px 16px;">
                <i class="fas fa-plus"></i> Agregar
              </button>
            </div>
            <div class="axyra-modal-list-item" style="cursor: pointer;">
              <div class="axyra-modal-list-icon">
                <i class="fas fa-clock"></i>
              </div>
              <div class="axyra-modal-list-content">
                <div class="axyra-modal-list-title">Actividad Reciente</div>
                <div class="axyra-modal-list-subtitle">Últimas acciones del sistema</div>
              </div>
              <button class="axyra-modal-btn axyra-modal-btn-primary" style="padding: 8px 16px;">
                <i class="fas fa-plus"></i> Agregar
              </button>
            </div>
          </div>
        </div>
        <div>
          <h4 style="margin-bottom: 16px; color: #374151;">Widgets Actuales</h4>
          <div class="axyra-modal-list">
            <div class="axyra-modal-list-item">
              <div class="axyra-modal-list-icon">
                <i class="fas fa-chart-bar"></i>
              </div>
              <div class="axyra-modal-list-content">
                <div class="axyra-modal-list-title">Métricas Principales</div>
                <div class="axyra-modal-list-subtitle">Activo</div>
              </div>
              <button class="axyra-modal-btn axyra-modal-btn-danger" style="padding: 8px 16px;">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="axyra-modal-list-item">
              <div class="axyra-modal-list-icon">
                <i class="fas fa-users"></i>
              </div>
              <div class="axyra-modal-list-content">
                <div class="axyra-modal-list-title">Distribución de Empleados</div>
                <div class="axyra-modal-list-subtitle">Activo</div>
              </div>
              <button class="axyra-modal-btn axyra-modal-btn-danger" style="padding: 8px 16px;">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  createConfigurationContent() {
    return `
      <div style="display: grid; gap: 24px;">
        <div class="axyra-modal-stat-card">
          <h4 style="margin-bottom: 16px; color: #374151;">Configuración General</h4>
          <div style="display: grid; gap: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <label style="font-weight: 500; color: #374151;">Actualización Automática</label>
              <input type="checkbox" checked style="transform: scale(1.2);">
            </div>
            <div>
              <label style="font-weight: 500; color: #374151; display: block; margin-bottom: 8px;">Intervalo de actualización (segundos)</label>
              <input type="number" value="30" min="10" max="300" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
            </div>
          </div>
        </div>
        
        <div class="axyra-modal-stat-card">
          <h4 style="margin-bottom: 16px; color: #374151;">Notificaciones</h4>
          <div style="display: grid; gap: 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <label style="font-weight: 500; color: #374151;">Sonido de notificaciones</label>
              <input type="checkbox" checked style="transform: scale(1.2);">
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <label style="font-weight: 500; color: #374151;">Notificaciones push</label>
              <input type="checkbox" style="transform: scale(1.2);">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  showLoadingModal(title = 'Cargando...') {
    return this.showModal({
      title,
      icon: 'fas fa-spinner',
      type: 'info',
      loading: true,
      showClose: false,
      buttons: [],
    });
  }

  showSuccessModal(title, message) {
    return this.showModal({
      title,
      icon: 'fas fa-check-circle',
      type: 'success',
      success: message,
      buttons: [
        {
          text: 'Aceptar',
          type: 'success',
          action: 'confirm',
          icon: 'fas fa-check',
        },
      ],
    });
  }

  showErrorModal(title, message) {
    return this.showModal({
      title,
      icon: 'fas fa-exclamation-triangle',
      type: 'danger',
      error: message,
      buttons: [
        {
          text: 'Aceptar',
          type: 'danger',
          action: 'confirm',
          icon: 'fas fa-times',
        },
      ],
    });
  }
}

// Inicializar el sistema de modales
window.axyraModals = new AxyraProfessionalModals();

// Funciones globales para compatibilidad
window.showDeleteWidgetModal = function (widgetName, onConfirm) {
  return window.axyraModals.showDeleteWidgetModal(widgetName, onConfirm);
};

window.showPersonalizeDashboardModal = function () {
  return window.axyraModals.showPersonalizeDashboardModal();
};

window.showConfigurationModal = function () {
  return window.axyraModals.showConfigurationModal();
};

console.log('✅ Sistema de Modales Profesionales AXYRA cargado');
