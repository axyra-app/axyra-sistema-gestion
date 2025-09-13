/* ========================================
   AXYRA MODAL SYSTEM PROFESSIONAL
   Sistema de Modales Profesional
   ======================================== */

class AxyraModalSystem {
  constructor() {
    this.activeModals = new Map();
    this.modalCounter = 0;
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    console.log('🎭 Inicializando Sistema de Modales AXYRA Profesional...');
    this.createModalContainer();
    this.setupGlobalStyles();
    this.setupEventListeners();
    this.isInitialized = true;
    console.log('✅ Sistema de Modales AXYRA Profesional inicializado');
  }

  createModalContainer() {
    // Crear contenedor principal para modales
    if (document.getElementById('axyra-modal-container')) return;
    
    const container = document.createElement('div');
    container.id = 'axyra-modal-container';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      pointer-events: none;
    `;
    
    document.body.appendChild(container);
  }

  setupGlobalStyles() {
    if (document.getElementById('axyra-modal-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'axyra-modal-styles';
    styles.textContent = `
      /* AXYRA Modal System Professional Styles */
      .axyra-modal-overlay {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: rgba(0, 0, 0, 0.5) !important;
        backdrop-filter: blur(4px) !important;
        z-index: 10000 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        padding: 20px !important;
        animation: axyra-modal-fade-in 0.3s ease-out !important;
        pointer-events: auto !important;
      }

      .axyra-modal {
        background: white !important;
        border-radius: 16px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        max-width: 90vw !important;
        max-height: 90vh !important;
        overflow: hidden !important;
        animation: axyra-modal-slide-up 0.3s ease-out !important;
        position: relative !important;
        width: 100% !important;
        max-width: 500px !important;
      }

      .axyra-modal-large {
        max-width: 800px !important;
      }

      .axyra-modal-xl {
        max-width: 1200px !important;
      }

      .axyra-modal-header {
        padding: 24px !important;
        border-bottom: 1px solid #e2e8f0 !important;
        background: #f8fafc !important;
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        border-radius: 16px 16px 0 0 !important;
      }

      .axyra-modal-title {
        font-size: 20px !important;
        font-weight: 600 !important;
        color: #1e293b !important;
        margin: 0 !important;
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }

      .axyra-modal-title i {
        color: #1e40af !important;
        font-size: 18px !important;
      }

      .axyra-modal-close {
        background: none !important;
        border: none !important;
        font-size: 20px !important;
        color: #64748b !important;
        cursor: pointer !important;
        padding: 8px !important;
        border-radius: 8px !important;
        transition: all 0.2s ease !important;
        width: 36px !important;
        height: 36px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }

      .axyra-modal-close:hover {
        background: #e2e8f0 !important;
        color: #1e293b !important;
      }

      .axyra-modal-body {
        padding: 24px !important;
        overflow-y: auto !important;
        max-height: 60vh !important;
        color: #374151 !important;
        line-height: 1.6 !important;
      }

      .axyra-modal-footer {
        padding: 24px !important;
        border-top: 1px solid #e2e8f0 !important;
        background: #f8fafc !important;
        display: flex !important;
        gap: 12px !important;
        justify-content: flex-end !important;
        border-radius: 0 0 16px 16px !important;
      }

      .axyra-modal-footer-left {
        justify-content: flex-start !important;
      }

      .axyra-modal-footer-center {
        justify-content: center !important;
      }

      .axyra-modal-footer-space-between {
        justify-content: space-between !important;
      }

      /* Animaciones */
      @keyframes axyra-modal-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes axyra-modal-slide-up {
        from {
          opacity: 0;
          transform: translateY(20px) scale(0.95);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      /* Responsive */
      @media (max-width: 768px) {
        .axyra-modal {
          max-width: 95vw !important;
          margin: 10px !important;
        }
        
        .axyra-modal-header,
        .axyra-modal-body,
        .axyra-modal-footer {
          padding: 16px !important;
        }
      }

      /* Estados de carga */
      .axyra-modal-loading {
        position: relative !important;
      }

      .axyra-modal-loading::after {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        bottom: 0 !important;
        background: rgba(255, 255, 255, 0.8) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        z-index: 1 !important;
      }

      .axyra-modal-loading::before {
        content: 'Cargando...' !important;
        position: absolute !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) !important;
        z-index: 2 !important;
        color: #1e40af !important;
        font-weight: 500 !important;
      }
    `;

    document.head.appendChild(styles);
  }

  setupEventListeners() {
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.activeModals.size > 0) {
        const lastModal = Array.from(this.activeModals.values()).pop();
        this.closeModal(lastModal.id);
      }
    });

    // Cerrar modal al hacer clic en el overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('axyra-modal-overlay')) {
        const modalId = e.target.dataset.modalId;
        if (modalId) {
          this.closeModal(modalId);
        }
      }
    });
  }

  showModal(options = {}) {
    const modalId = `axyra-modal-${++this.modalCounter}`;
    
    const config = {
      id: modalId,
      title: options.title || 'Modal',
      content: options.content || '',
      size: options.size || 'md', // sm, md, lg, xl
      showClose: options.showClose !== false,
      closable: options.closable !== false,
      footer: options.footer || null,
      footerAlign: options.footerAlign || 'right', // left, center, right, space-between
      onClose: options.onClose || null,
      onConfirm: options.onConfirm || null,
      confirmText: options.confirmText || 'Confirmar',
      cancelText: options.cancelText || 'Cancelar',
      showConfirm: options.showConfirm !== false,
      showCancel: options.showCancel !== false,
      loading: options.loading || false,
      className: options.className || '',
      ...options
    };

    const modal = this.createModalElement(config);
    this.activeModals.set(modalId, { element: modal, config });
    
    document.getElementById('axyra-modal-container').appendChild(modal);
    
    // Animar entrada
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });

    return modalId;
  }

  createModalElement(config) {
    const modal = document.createElement('div');
    modal.className = `axyra-modal-overlay ${config.className}`;
    modal.dataset.modalId = config.id;
    
    const sizeClass = config.size === 'sm' ? '' : 
                    config.size === 'lg' ? 'axyra-modal-large' : 
                    config.size === 'xl' ? 'axyra-modal-xl' : '';

    modal.innerHTML = `
      <div class="axyra-modal ${sizeClass} ${config.loading ? 'axyra-modal-loading' : ''}">
        ${this.createModalHeader(config)}
        ${this.createModalBody(config)}
        ${this.createModalFooter(config)}
      </div>
    `;

    return modal;
  }

  createModalHeader(config) {
    return `
      <div class="axyra-modal-header">
        <h2 class="axyra-modal-title">
          ${config.titleIcon ? `<i class="${config.titleIcon}"></i>` : ''}
          ${config.title}
        </h2>
        ${config.showClose ? `
          <button class="axyra-modal-close" data-action="close">
            <i class="fas fa-times"></i>
          </button>
        ` : ''}
      </div>
    `;
  }

  createModalBody(config) {
    return `
      <div class="axyra-modal-body">
        ${config.content}
      </div>
    `;
  }

  createModalFooter(config) {
    if (!config.footer && !config.showConfirm && !config.showCancel) {
      return '';
    }

    const footerAlignClass = `axyra-modal-footer-${config.footerAlign}`;
    
    return `
      <div class="axyra-modal-footer ${footerAlignClass}">
        ${config.footer || ''}
        ${config.showCancel ? `
          <button class="axyra-btn axyra-btn-secondary" data-action="cancel">
            ${config.cancelText}
          </button>
        ` : ''}
        ${config.showConfirm ? `
          <button class="axyra-btn axyra-btn-primary" data-action="confirm">
            ${config.confirmText}
          </button>
        ` : ''}
      </div>
    `;
  }

  closeModal(modalId) {
    const modalData = this.activeModals.get(modalId);
    if (!modalData) return;

    const { element, config } = modalData;
    
    // Ejecutar callback de cierre
    if (config.onClose) {
      config.onClose();
    }

    // Animar salida
    element.style.animation = 'axyra-modal-fade-out 0.2s ease-in';
    
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.activeModals.delete(modalId);
    }, 200);
  }

  updateModal(modalId, updates) {
    const modalData = this.activeModals.get(modalId);
    if (!modalData) return;

    const { element, config } = modalData;
    const newConfig = { ...config, ...updates };
    
    // Actualizar configuración
    this.activeModals.set(modalId, { element, config: newConfig });
    
    // Recrear modal si es necesario
    if (updates.title || updates.content || updates.footer) {
      const newModal = this.createModalElement(newConfig);
      element.parentNode.replaceChild(newModal, element);
      this.activeModals.set(modalId, { element: newModal, config: newConfig });
    }
  }

  setLoading(modalId, loading) {
    this.updateModal(modalId, { loading });
  }

  // Métodos de conveniencia para modales comunes
  showConfirmModal(options = {}) {
    return this.showModal({
      title: options.title || 'Confirmar acción',
      content: options.message || '¿Estás seguro de que deseas continuar?',
      confirmText: options.confirmText || 'Sí, continuar',
      cancelText: options.cancelText || 'Cancelar',
      onConfirm: options.onConfirm,
      onCancel: options.onCancel,
      ...options
    });
  }

  showAlertModal(options = {}) {
    return this.showModal({
      title: options.title || 'Información',
      content: options.message || '',
      showConfirm: true,
      showCancel: false,
      confirmText: options.confirmText || 'Entendido',
      onConfirm: options.onConfirm,
      ...options
    });
  }

  showErrorModal(options = {}) {
    return this.showModal({
      title: options.title || 'Error',
      titleIcon: 'fas fa-exclamation-triangle',
      content: options.message || 'Ha ocurrido un error inesperado.',
      showConfirm: true,
      showCancel: false,
      confirmText: options.confirmText || 'Entendido',
      className: 'error-modal',
      ...options
    });
  }

  showSuccessModal(options = {}) {
    return this.showModal({
      title: options.title || 'Éxito',
      titleIcon: 'fas fa-check-circle',
      content: options.message || 'La operación se completó exitosamente.',
      showConfirm: true,
      showCancel: false,
      confirmText: options.confirmText || 'Entendido',
      className: 'success-modal',
      ...options
    });
  }

  showLoadingModal(options = {}) {
    return this.showModal({
      title: options.title || 'Procesando',
      content: options.message || 'Por favor espera mientras procesamos tu solicitud...',
      showConfirm: false,
      showCancel: false,
      closable: false,
      loading: true,
      ...options
    });
  }

  // Método para cerrar todos los modales
  closeAllModals() {
    this.activeModals.forEach((_, modalId) => {
      this.closeModal(modalId);
    });
  }

  // Método para obtener información de un modal
  getModalInfo(modalId) {
    return this.activeModals.get(modalId);
  }

  // Método para verificar si hay modales abiertos
  hasActiveModals() {
    return this.activeModals.size > 0;
  }
}

// Inicializar el sistema de modales
window.axyraModals = new AxyraModalSystem();

// Agregar estilos adicionales para animaciones de salida
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  @keyframes axyra-modal-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .error-modal .axyra-modal-title i {
    color: #ef4444 !important;
  }
  
  .success-modal .axyra-modal-title i {
    color: #10b981 !important;
  }
`;
document.head.appendChild(additionalStyles);
