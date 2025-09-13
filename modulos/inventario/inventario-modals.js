/**
 * Sistema de Modales Profesionales para Inventario AXYRA
 * Versión: 1.0.0
 */

class AxyraInventarioModals {
  constructor() {
    this.activeModals = new Set();
    this.init();
  }

  init() {
    this.createModalStyles();
    console.log('✅ Sistema de Modales de Inventario AXYRA inicializado');
  }

  createModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Estilos para Modales de Inventario AXYRA */
      .axyra-inventario-modal-overlay {
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

      .axyra-inventario-modal-overlay.show {
        opacity: 1;
        visibility: visible;
      }

      .axyra-inventario-modal-container {
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

      .axyra-inventario-modal-overlay.show .axyra-inventario-modal-container {
        transform: scale(1) translateY(0);
      }

      .axyra-inventario-modal-header {
        background: linear-gradient(135deg, #4f81bd 0%, #2c5aa0 100%);
        color: white;
        padding: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }

      .axyra-inventario-modal-title {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .axyra-inventario-modal-title i {
        font-size: 1.25rem;
        opacity: 0.9;
      }

      .axyra-inventario-modal-close {
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
      }

      .axyra-inventario-modal-close:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(1.1);
      }

      .axyra-inventario-modal-body {
        padding: 24px;
        max-height: 60vh;
        overflow-y: auto;
      }

      .axyra-inventario-modal-footer {
        padding: 20px 24px;
        background: #f8f9fa;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }

      .axyra-inventario-form-group {
        margin-bottom: 20px;
      }

      .axyra-inventario-form-label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        color: #374151;
      }

      .axyra-inventario-form-input,
      .axyra-inventario-form-select,
      .axyra-inventario-form-textarea {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        transition: all 0.3s ease;
        box-sizing: border-box;
      }

      .axyra-inventario-form-input:focus,
      .axyra-inventario-form-select:focus,
      .axyra-inventario-form-textarea:focus {
        outline: none;
        border-color: #4f81bd;
        box-shadow: 0 0 0 3px rgba(79, 129, 189, 0.1);
      }

      .axyra-inventario-form-textarea {
        resize: vertical;
        min-height: 80px;
      }

      .axyra-inventario-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .axyra-inventario-btn-primary {
        background: #4f81bd;
        color: white;
      }

      .axyra-inventario-btn-primary:hover {
        background: #2c5aa0;
        transform: translateY(-1px);
      }

      .axyra-inventario-btn-secondary {
        background: #6b7280;
        color: white;
      }

      .axyra-inventario-btn-secondary:hover {
        background: #4b5563;
      }

      .axyra-inventario-btn-success {
        background: #10b981;
        color: white;
      }

      .axyra-inventario-btn-success:hover {
        background: #059669;
      }

      .axyra-inventario-btn-danger {
        background: #ef4444;
        color: white;
      }

      .axyra-inventario-btn-danger:hover {
        background: #dc2626;
      }
    `;
    document.head.appendChild(style);
  }

  showModal(options) {
    const {
      title,
      content,
      icon = 'fas fa-box',
      buttons = [],
      onClose = null,
      onConfirm = null
    } = options;

    const modalId = `inventario_modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const modalHTML = `
      <div class="axyra-inventario-modal-overlay" id="${modalId}">
        <div class="axyra-inventario-modal-container">
          <div class="axyra-inventario-modal-header">
            <h3 class="axyra-inventario-modal-title">
              <i class="${icon}"></i>
              ${title}
            </h3>
            <button class="axyra-inventario-modal-close" data-action="close">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="axyra-inventario-modal-body">
            ${content}
          </div>
          <div class="axyra-inventario-modal-footer">
            ${buttons.map(btn => `
              <button class="axyra-inventario-btn axyra-inventario-btn-${btn.type}" data-action="${btn.action}">
                <i class="${btn.icon}"></i>
                ${btn.text}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHTML;
    const modal = modalElement.firstElementChild;

    document.body.appendChild(modal);
    this.activeModals.add(modalId);

    // Animar entrada
    requestAnimationFrame(() => {
      modal.classList.add('show');
    });

    // Configurar eventos
    this.setupModalEvents(modal, modalId, { onClose, onConfirm });

    return modalId;
  }

  setupModalEvents(modal, modalId, { onClose, onConfirm }) {
    // Cerrar con botón X
    modal.querySelector('.axyra-inventario-modal-close').addEventListener('click', () => {
      this.closeModal(modalId);
      if (onClose) onClose();
    });

    // Cerrar con clic en overlay
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modalId);
        if (onClose) onClose();
      }
    });

    // Botones del footer
    modal.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        if (action === 'close') {
          this.closeModal(modalId);
          if (onClose) onClose();
        } else if (action === 'confirm') {
          this.closeModal(modalId);
          if (onConfirm) onConfirm();
        }
      });
    });

    // Cerrar con Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modalId);
        if (onClose) onClose();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.remove();
        this.activeModals.delete(modalId);
      }, 300);
    }
  }

  // Modal para agregar/editar producto
  showProductModal(producto = null) {
    const isEdit = producto !== null;
    const title = isEdit ? 'Editar Producto' : 'Nuevo Producto';
    const icon = isEdit ? 'fas fa-edit' : 'fas fa-plus';

    const content = `
      <form id="productForm">
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Nombre del Producto *</label>
          <input type="text" class="axyra-inventario-form-input" id="productName" 
                 value="${producto?.nombre || ''}" required>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Categoría *</label>
          <select class="axyra-inventario-form-select" id="productCategory" required>
            <option value="">Seleccionar categoría</option>
            <option value="alimentos" ${producto?.categoria === 'alimentos' ? 'selected' : ''}>Alimentos</option>
            <option value="bebidas" ${producto?.categoria === 'bebidas' ? 'selected' : ''}>Bebidas</option>
            <option value="limpieza" ${producto?.categoria === 'limpieza' ? 'selected' : ''}>Limpieza</option>
            <option value="otros" ${producto?.categoria === 'otros' ? 'selected' : ''}>Otros</option>
          </select>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Precio *</label>
          <input type="number" class="axyra-inventario-form-input" id="productPrice" 
                 value="${producto?.precio || ''}" step="0.01" min="0" required>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Stock Inicial *</label>
          <input type="number" class="axyra-inventario-form-input" id="productStock" 
                 value="${producto?.stock || ''}" min="0" required>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Descripción</label>
          <textarea class="axyra-inventario-form-textarea" id="productDescription" 
                    placeholder="Descripción del producto...">${producto?.descripcion || ''}</textarea>
        </div>
      </form>
    `;

    return this.showModal({
      title,
      icon,
      content,
      buttons: [
        {
          text: 'Cancelar',
          type: 'secondary',
          action: 'close',
          icon: 'fas fa-times'
        },
        {
          text: isEdit ? 'Actualizar' : 'Crear',
          type: 'primary',
          action: 'confirm',
          icon: isEdit ? 'fas fa-save' : 'fas fa-plus'
        }
      ],
      onConfirm: () => {
        this.handleProductSubmit(producto);
      }
    });
  }

  // Modal para entrada de inventario
  showEntradaModal(producto = null) {
    const content = `
      <form id="entradaForm">
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Producto *</label>
          <select class="axyra-inventario-form-select" id="entradaProduct" required>
            <option value="">Seleccionar producto</option>
            <!-- Los productos se cargarán dinámicamente -->
          </select>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Cantidad *</label>
          <input type="number" class="axyra-inventario-form-input" id="entradaCantidad" 
                 min="1" required>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Precio Unitario</label>
          <input type="number" class="axyra-inventario-form-input" id="entradaPrecio" 
                 step="0.01" min="0">
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Proveedor</label>
          <input type="text" class="axyra-inventario-form-input" id="entradaProveedor" 
                 placeholder="Nombre del proveedor">
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Observaciones</label>
          <textarea class="axyra-inventario-form-textarea" id="entradaObservaciones" 
                    placeholder="Observaciones sobre la entrada..."></textarea>
        </div>
      </form>
    `;

    return this.showModal({
      title: 'Entrada de Inventario',
      icon: 'fas fa-arrow-down',
      content,
      buttons: [
        {
          text: 'Cancelar',
          type: 'secondary',
          action: 'close',
          icon: 'fas fa-times'
        },
        {
          text: 'Registrar Entrada',
          type: 'success',
          action: 'confirm',
          icon: 'fas fa-check'
        }
      ],
      onConfirm: () => {
        this.handleEntradaSubmit();
      }
    });
  }

  // Modal para salida de inventario
  showSalidaModal(producto = null) {
    const content = `
      <form id="salidaForm">
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Producto *</label>
          <select class="axyra-inventario-form-select" id="salidaProduct" required>
            <option value="">Seleccionar producto</option>
            <!-- Los productos se cargarán dinámicamente -->
          </select>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Cantidad *</label>
          <input type="number" class="axyra-inventario-form-input" id="salidaCantidad" 
                 min="1" required>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Motivo *</label>
          <select class="axyra-inventario-form-select" id="salidaMotivo" required>
            <option value="">Seleccionar motivo</option>
            <option value="venta">Venta</option>
            <option value="consumo">Consumo interno</option>
            <option value="perdida">Pérdida</option>
            <option value="devolucion">Devolución</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        
        <div class="axyra-inventario-form-group">
          <label class="axyra-inventario-form-label">Observaciones</label>
          <textarea class="axyra-inventario-form-textarea" id="salidaObservaciones" 
                    placeholder="Observaciones sobre la salida..."></textarea>
        </div>
      </form>
    `;

    return this.showModal({
      title: 'Salida de Inventario',
      icon: 'fas fa-arrow-up',
      content,
      buttons: [
        {
          text: 'Cancelar',
          type: 'secondary',
          action: 'close',
          icon: 'fas fa-times'
        },
        {
          text: 'Registrar Salida',
          type: 'danger',
          action: 'confirm',
          icon: 'fas fa-check'
        }
      ],
      onConfirm: () => {
        this.handleSalidaSubmit();
      }
    });
  }

  handleProductSubmit(producto) {
    const form = document.getElementById('productForm');
    if (!form) return;

    const formData = {
      nombre: document.getElementById('productName').value,
      categoria: document.getElementById('productCategory').value,
      precio: parseFloat(document.getElementById('productPrice').value),
      stock: parseInt(document.getElementById('productStock').value),
      descripcion: document.getElementById('productDescription').value
    };

    if (!formData.nombre || !formData.categoria || formData.precio < 0 || formData.stock < 0) {
      alert('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    // Aquí se integraría con el sistema de inventario
    console.log('Datos del producto:', formData);
    
    if (window.axyraInventario) {
      if (producto) {
        window.axyraInventario.actualizarProducto(producto.id, formData);
      } else {
        window.axyraInventario.agregarProducto(formData);
      }
    }

    // Mostrar notificación de éxito
    if (window.axyraNotifications) {
      window.axyraNotifications.show(
        producto ? 'Producto actualizado correctamente' : 'Producto creado correctamente',
        'success'
      );
    }
  }

  handleEntradaSubmit() {
    const form = document.getElementById('entradaForm');
    if (!form) return;

    const formData = {
      productoId: document.getElementById('entradaProduct').value,
      cantidad: parseInt(document.getElementById('entradaCantidad').value),
      precio: parseFloat(document.getElementById('entradaPrecio').value) || 0,
      proveedor: document.getElementById('entradaProveedor').value,
      observaciones: document.getElementById('entradaObservaciones').value
    };

    if (!formData.productoId || formData.cantidad <= 0) {
      alert('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    console.log('Datos de entrada:', formData);
    
    if (window.axyraInventario) {
      window.axyraInventario.registrarEntrada(formData);
    }

    if (window.axyraNotifications) {
      window.axyraNotifications.show('Entrada registrada correctamente', 'success');
    }
  }

  handleSalidaSubmit() {
    const form = document.getElementById('salidaForm');
    if (!form) return;

    const formData = {
      productoId: document.getElementById('salidaProduct').value,
      cantidad: parseInt(document.getElementById('salidaCantidad').value),
      motivo: document.getElementById('salidaMotivo').value,
      observaciones: document.getElementById('salidaObservaciones').value
    };

    if (!formData.productoId || formData.cantidad <= 0 || !formData.motivo) {
      alert('Por favor complete todos los campos requeridos correctamente');
      return;
    }

    console.log('Datos de salida:', formData);
    
    if (window.axyraInventario) {
      window.axyraInventario.registrarSalida(formData);
    }

    if (window.axyraNotifications) {
      window.axyraNotifications.show('Salida registrada correctamente', 'success');
    }
  }
}

// Inicializar el sistema de modales de inventario
window.axyraInventarioModals = new AxyraInventarioModals();

// Funciones globales para compatibilidad
window.mostrarModalProducto = function(producto = null) {
  return window.axyraInventarioModals.showProductModal(producto);
};

window.mostrarModalEntrada = function() {
  return window.axyraInventarioModals.showEntradaModal();
};

window.mostrarModalSalida = function() {
  return window.axyraInventarioModals.showSalidaModal();
};

window.cerrarModalProducto = function() {
  // Se cierra automáticamente con el botón o overlay
};

window.cerrarModalEntrada = function() {
  // Se cierra automáticamente con el botón o overlay
};

window.cerrarModalSalida = function() {
  // Se cierra automáticamente con el botón o overlay
};

console.log('✅ Sistema de Modales de Inventario AXYRA cargado');
