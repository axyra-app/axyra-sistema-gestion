// ========================================
// SISTEMA DE NOTIFICACIONES PROFESIONALES AXYRA
// ========================================

class AxyraProfessionalNotifications {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.init();
  }

  init() {
    this.createContainer();
    this.setupStyles();
    console.log('✅ Sistema de Notificaciones Profesionales AXYRA inicializado');
  }

  createContainer() {
    // Crear contenedor si no existe
    this.container = document.getElementById('axyra-notifications-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'axyra-notifications-container';
      this.container.style.cssText = `
        position: fixed !important;
        top: 20px !important;
        right: 20px !important;
        z-index: 10000000 !important;
        max-width: 400px !important;
        pointer-events: none !important;
      `;
      document.body.appendChild(this.container);
    }
  }

  setupStyles() {
    // Agregar estilos CSS si no existen
    if (!document.getElementById('axyra-notifications-styles')) {
      const style = document.createElement('style');
      style.id = 'axyra-notifications-styles';
      style.textContent = `
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

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        .axyra-notification {
          background: white !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
          margin-bottom: 15px !important;
          padding: 20px !important;
          border-left: 4px solid #3b82f6 !important;
          pointer-events: auto !important;
          animation: slideInRight 0.4s ease-out !important;
          position: relative !important;
          max-width: 100% !important;
          word-wrap: break-word !important;
        }

        .axyra-notification.success {
          border-left-color: #10b981 !important;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%) !important;
        }

        .axyra-notification.error {
          border-left-color: #ef4444 !important;
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
        }

        .axyra-notification.warning {
          border-left-color: #f59e0b !important;
          background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%) !important;
        }

        .axyra-notification.info {
          border-left-color: #3b82f6 !important;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
        }

        .axyra-notification-header {
          display: flex !important;
          align-items: center !important;
          gap: 12px !important;
          margin-bottom: 8px !important;
        }

        .axyra-notification-icon {
          width: 24px !important;
          height: 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 50% !important;
          font-size: 14px !important;
          color: white !important;
        }

        .axyra-notification.success .axyra-notification-icon {
          background: #10b981 !important;
        }

        .axyra-notification.error .axyra-notification-icon {
          background: #ef4444 !important;
        }

        .axyra-notification.warning .axyra-notification-icon {
          background: #f59e0b !important;
        }

        .axyra-notification.info .axyra-notification-icon {
          background: #3b82f6 !important;
        }

        .axyra-notification-title {
          font-weight: 700 !important;
          font-size: 16px !important;
          color: #1f2937 !important;
          margin: 0 !important;
        }

        .axyra-notification-message {
          font-size: 14px !important;
          color: #6b7280 !important;
          margin: 0 !important;
          line-height: 1.4 !important;
        }

        .axyra-notification-close {
          position: absolute !important;
          top: 8px !important;
          right: 8px !important;
          background: none !important;
          border: none !important;
          font-size: 18px !important;
          color: #9ca3af !important;
          cursor: pointer !important;
          padding: 4px !important;
          border-radius: 4px !important;
          transition: all 0.2s ease !important;
        }

        .axyra-notification-close:hover {
          background: rgba(0, 0, 0, 0.1) !important;
          color: #374151 !important;
        }

        .axyra-notification-progress {
          position: absolute !important;
          bottom: 0 !important;
          left: 0 !important;
          height: 3px !important;
          background: rgba(0, 0, 0, 0.1) !important;
          border-radius: 0 0 12px 12px !important;
          animation: progressBar 5s linear forwards !important;
        }

        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  show(message, type = 'info', title = null, duration = 5000) {
    const notification = this.createNotification(message, type, title, duration);
    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Auto-remove after duration
    setTimeout(() => {
      this.remove(notification);
    }, duration);

    return notification;
  }

  createNotification(message, type, title, duration) {
    const notification = document.createElement('div');
    notification.className = `axyra-notification ${type}`;
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    const titles = {
      success: title || 'Éxito',
      error: title || 'Error',
      warning: title || 'Advertencia',
      info: title || 'Información'
    };

    notification.innerHTML = `
      <div class="axyra-notification-header">
        <div class="axyra-notification-icon">
          ${icons[type] || 'ℹ'}
        </div>
        <h4 class="axyra-notification-title">${titles[type]}</h4>
      </div>
      <p class="axyra-notification-message">${message}</p>
      <button class="axyra-notification-close" onclick="axyraNotifications.remove(this.parentElement)">×</button>
      <div class="axyra-notification-progress"></div>
    `;

    return notification;
  }

  remove(notification) {
    if (notification && notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        const index = this.notifications.indexOf(notification);
        if (index > -1) {
          this.notifications.splice(index, 1);
        }
      }, 300);
    }
  }

  clear() {
    this.notifications.forEach(notification => {
      this.remove(notification);
    });
  }
}

// Inicializar sistema global
window.axyraNotifications = new AxyraProfessionalNotifications();

// Función global para mostrar notificaciones
window.mostrarNotificacion = function(message, type = 'info', title = null, duration = 5000) {
  if (window.axyraNotifications) {
    return window.axyraNotifications.show(message, type, title, duration);
  } else {
    // Fallback a alert si no está disponible
    alert(`${type.toUpperCase()}: ${message}`);
  }
};

// Función específica para reemplazar alerts
window.mostrarNotificacionProfesional = function(message, type = 'info') {
  const titles = {
    success: '¡Éxito!',
    error: 'Error',
    warning: 'Advertencia',
    info: 'Información'
  };
  
  return window.mostrarNotificacion(message, type, titles[type], 4000);
};

console.log('✅ Sistema de Notificaciones Profesionales AXYRA cargado');
