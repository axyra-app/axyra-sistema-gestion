/**
 * AXYRA - Guard de Membresías
 * Interceptor que bloquea acciones según el plan del usuario
 */

class AxyraMembershipGuard {
  constructor() {
    this.membership = null;
    this.interceptors = new Map();
    
    this.init();
  }

  init() {
    // Esperar a que el sistema de membresías esté disponible
    this.waitForMembership();
    
    // Configurar interceptores
    this.setupInterceptors();
    
    console.log('🛡️ Guard de Membresías inicializado');
  }

  async waitForMembership() {
    while (!window.AxyraMembership) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.membership = window.AxyraMembership;
    this.setupMembershipListeners();
  }

  setupMembershipListeners() {
    // Escuchar cambios de plan
    window.addEventListener('membership:planChanged', () => {
      this.updateAllRestrictions();
    });

    // Escuchar cambios de uso
    window.addEventListener('membership:usageUpdated', () => {
      this.updateAllRestrictions();
    });
  }

  setupInterceptors() {
    // Interceptor para botones
    this.interceptButtons();
    
    // Interceptor para formularios
    this.interceptForms();
    
    // Interceptor para enlaces
    this.interceptLinks();
    
    // Interceptor para eventos personalizados
    this.interceptCustomEvents();
  }

  interceptButtons() {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button, .btn, [role="button"]');
      if (!button) return;

      const module = button.dataset.module;
      const action = button.dataset.action;
      
      if (module || action) {
        const restriction = this.checkRestriction(module, action);
        if (!restriction.allowed) {
          e.preventDefault();
          e.stopPropagation();
          this.showRestriction(restriction);
        }
      }
    });
  }

  interceptForms() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const module = form.dataset.module;
      const action = form.dataset.action;
      
      if (module || action) {
        const restriction = this.checkRestriction(module, action);
        if (!restriction.allowed) {
          e.preventDefault();
          this.showRestriction(restriction);
        }
      }
    });
  }

  interceptLinks() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const module = link.dataset.module;
      const action = link.dataset.action;
      
      if (module || action) {
        const restriction = this.checkRestriction(module, action);
        if (!restriction.allowed) {
          e.preventDefault();
          this.showRestriction(restriction);
        }
      }
    });
  }

  interceptCustomEvents() {
    // Interceptar eventos personalizados de AXYRA
    const customEvents = [
      'axyra:addEmployee',
      'axyra:addNomina',
      'axyra:addProduct',
      'axyra:addCuadre',
      'axyra:generateReport',
      'axyra:exportData',
      'axyra:uploadFile'
    ];

    customEvents.forEach(eventName => {
      document.addEventListener(eventName, (e) => {
        const module = e.detail?.module;
        const action = e.detail?.action;
        
        if (module || action) {
          const restriction = this.checkRestriction(module, action);
          if (!restriction.allowed) {
            e.preventDefault();
            e.stopPropagation();
            this.showRestriction(restriction);
          }
        }
      });
    });
  }

  checkRestriction(module, action) {
    if (!this.membership) {
      return { allowed: true };
    }

    // Verificar acceso al módulo
    if (module && !this.membership.canAccessModule(module)) {
      return {
        allowed: false,
        reason: `El módulo ${module} no está disponible en tu plan`,
        upgradeRequired: true,
        type: 'module'
      };
    }

    // Verificar límites específicos
    if (action) {
      switch (action) {
        case 'addEmployee':
          if (!this.membership.canAddEmployee()) {
            return {
              allowed: false,
              reason: `Has alcanzado el límite de empleados para tu plan`,
              upgradeRequired: true,
              type: 'limit',
              resource: 'empleados'
            };
          }
          break;
          
        case 'addNomina':
          if (!this.membership.canAddNomina()) {
            return {
              allowed: false,
              reason: `Has alcanzado el límite de nóminas para tu plan`,
              upgradeRequired: true,
              type: 'limit',
              resource: 'nominas'
            };
          }
          break;
          
        case 'uploadFile':
          const fileSize = action.detail?.fileSize || 0;
          if (!this.membership.canUploadFile(fileSize)) {
            return {
              allowed: false,
              reason: `No tienes suficiente espacio de almacenamiento`,
              upgradeRequired: true,
              type: 'limit',
              resource: 'almacenamiento'
            };
          }
          break;
      }
    }

    return { allowed: true };
  }

  showRestriction(restriction) {
    // Crear notificación de restricción
    const notification = document.createElement('div');
    notification.className = 'membership-restriction-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🚫</div>
        <div class="notification-text">
          <h4>Funcionalidad Restringida</h4>
          <p>${restriction.reason}</p>
          ${restriction.upgradeRequired ? `
            <button class="upgrade-btn" onclick="window.AxyraMembership.showPlansModal()">
              Ver Planes Disponibles
            </button>
          ` : ''}
        </div>
        <button class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</button>
      </div>
    `;

    // Agregar estilos si no existen
    if (!document.querySelector('#membership-guard-styles')) {
      const styles = document.createElement('style');
      styles.id = 'membership-guard-styles';
      styles.textContent = `
        .membership-restriction-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 10000;
          max-width: 400px;
          animation: slideIn 0.3s ease;
        }
        
        .notification-content {
          display: flex;
          align-items: flex-start;
          padding: 16px;
        }
        
        .notification-icon {
          font-size: 24px;
          margin-right: 12px;
        }
        
        .notification-text {
          flex: 1;
        }
        
        .notification-text h4 {
          margin: 0 0 8px 0;
          color: #dc2626;
          font-size: 16px;
        }
        
        .notification-text p {
          margin: 0 0 12px 0;
          color: #6b7280;
          font-size: 14px;
        }
        
        .upgrade-btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .upgrade-btn:hover {
          background: #2563eb;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #9ca3af;
          margin-left: 8px;
        }
        
        @keyframes slideIn {
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

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  updateAllRestrictions() {
    // Actualizar todos los elementos con restricciones
    const restrictedElements = document.querySelectorAll('[data-module], [data-action]');
    restrictedElements.forEach(element => {
      this.updateElementRestriction(element);
    });
  }

  updateElementRestriction(element) {
    const module = element.dataset.module;
    const action = element.dataset.action;
    
    if (!module && !action) return;

    const restriction = this.checkRestriction(module, action);
    
    if (!restriction.allowed) {
      element.classList.add('restricted');
      element.style.opacity = '0.5';
      element.style.pointerEvents = 'none';
      
      // Agregar tooltip
      element.title = restriction.reason;
    } else {
      element.classList.remove('restricted');
      element.style.opacity = '';
      element.style.pointerEvents = '';
      element.title = '';
    }
  }

  // Métodos de utilidad
  isModuleRestricted(moduleName) {
    if (!this.membership) return false;
    return !this.membership.canAccessModule(moduleName);
  }

  isActionRestricted(actionName) {
    if (!this.membership) return false;
    const restriction = this.checkRestriction(null, actionName);
    return !restriction.allowed;
  }

  getRestrictionReason(module, action) {
    const restriction = this.checkRestriction(module, action);
    return restriction.allowed ? null : restriction.reason;
  }

  // Interceptor para funciones específicas
  interceptFunction(module, action, originalFunction) {
    return (...args) => {
      const restriction = this.checkRestriction(module, action);
      if (!restriction.allowed) {
        this.showRestriction(restriction);
        return;
      }
      return originalFunction.apply(this, args);
    };
  }
}

// Instancia global
window.AxyraMembershipGuard = new AxyraMembershipGuard();

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraMembershipGuard;
}
