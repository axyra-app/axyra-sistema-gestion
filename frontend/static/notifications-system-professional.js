// ========================================
// SISTEMA DE NOTIFICACIONES PROFESIONAL AXYRA
// ========================================

class AxyraNotificationSystemProfessional {
  constructor() {
    this.notifications = [];
    this.container = null;
    this.maxNotifications = 3;
    this.isInitialized = false;

    this.init();
  }

  async init() {
    try {
      console.log('🔔 Inicializando Sistema de Notificaciones Profesional AXYRA...');

      this.createNotificationContainer();
      this.setupEventListeners();
      this.loadStoredNotifications();

      this.isInitialized = true;
      console.log('✅ Sistema de Notificaciones Profesional AXYRA inicializado');
    } catch (error) {
      console.error('❌ Error inicializando sistema de notificaciones:', error);
    }
  }

  createNotificationContainer() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.className = 'axyra-notifications-container-professional';
    this.container.id = 'axyra-notifications-container';

    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 380px;
      max-height: 80vh;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 10000;
      pointer-events: none;
    `;

    if (document.body) {
      document.body.appendChild(this.container);
    }
  }

  setupEventListeners() {
    // Event listeners para cerrar notificaciones
    document.addEventListener('click', (e) => {
      if (e.target.matches('.axyra-notification-close')) {
        const notificationId = e.target.closest('.axyra-notification').id;
        this.removeNotification(notificationId);
      }
    });

    // Event listeners para acciones
    document.addEventListener('click', (e) => {
      if (e.target.matches('.axyra-notification-action')) {
        const notificationId = e.target.closest('.axyra-notification').id;
        this.handleNotificationAction(notificationId);
      }
    });
  }

  loadStoredNotifications() {
    try {
      const stored = localStorage.getItem('axyra_notifications');
      if (stored) {
        const notifications = JSON.parse(stored);
        notifications.forEach((notification) => {
          if (notification.timestamp > Date.now() - 24 * 60 * 60 * 1000) {
            // Solo últimas 24h
            this.showNotification(notification.message, notification.type, notification.duration, notification.action);
          }
        });
      }
    } catch (error) {
      console.warn('⚠️ Error cargando notificaciones almacenadas:', error);
    }
  }

  showNotification(message, type = 'info', duration = 5000, action = null) {
    try {
      const notification = {
        id: 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        message: message,
        type: type,
        timestamp: Date.now(),
        duration: duration,
        action: action,
        title: this.getNotificationTitle(type),
      };

      this.notifications.unshift(notification);

      // Limitar número de notificaciones
      if (this.notifications.length > this.maxNotifications) {
        this.notifications = this.notifications.slice(0, this.maxNotifications);
      }

      this.renderNotification(notification);
      this.storeNotifications();

      // Auto-remove después de la duración
      if (duration > 0) {
        setTimeout(() => {
          this.removeNotification(notification.id);
        }, duration);
      }
    } catch (error) {
      console.error('❌ Error mostrando notificación:', error);
    }
  }

  renderNotification(notification) {
    try {
      const notificationElement = document.createElement('div');
      notificationElement.id = notification.id;
      notificationElement.className = `axyra-notification-professional axyra-notification-${notification.type}`;

      notificationElement.style.cssText = `
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05);
        margin-bottom: 12px;
        padding: 16px;
        border: 1px solid rgba(255, 255, 255, 0.8);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        max-width: 100%;
        min-width: 320px;
        overflow: visible;
        position: relative;
        backdrop-filter: blur(10px);
        border-left: 3px solid ${this.getNotificationColor(notification.type)};
      `;

      notificationElement.innerHTML = `
        <div class="axyra-notification-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="axyra-notification-icon" style="
              width: 32px; 
              height: 32px; 
              border-radius: 50%; 
              background: ${this.getNotificationGradient(notification.type)}; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 16px; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              flex-shrink: 0;
            ">
              ${this.getNotificationIcon(notification.type)}
            </div>
            <div>
              <div class="axyra-notification-title" style="
                font-weight: 600; 
                font-size: 14px; 
                color: #1e293b; 
                margin-bottom: 2px;
                line-height: 1.2;
              ">
                ${notification.title}
              </div>
              <div class="axyra-notification-time" style="
                font-size: 10px; 
                color: #64748b; 
                font-weight: 500;
              ">
                ${this.formatTime(notification.timestamp)}
              </div>
            </div>
          </div>
          <button class="axyra-notification-close" style="
            background: rgba(148, 163, 184, 0.1); 
            border: none; 
            color: #64748b; 
            font-size: 14px; 
            cursor: pointer; 
            padding: 4px; 
            border-radius: 50%; 
            transition: all 0.3s ease; 
            width: 24px; 
            height: 24px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
            flex-shrink: 0;
          ">
            ×
          </button>
        </div>
        
        <div class="axyra-notification-content">
          <div class="axyra-notification-message" style="
            color: #475569; 
            font-size: 13px; 
            line-height: 1.4; 
            margin-bottom: ${notification.action ? '12px' : '0'}; 
            font-weight: 500;
          ">
            ${notification.message}
          </div>
          
          ${
            notification.action
              ? `
            <div class="axyra-notification-actions" style="display: flex; gap: 8px; align-items: center;">
              <button class="axyra-notification-action" style="
                background: ${this.getNotificationColor(notification.type)}; 
                color: white; 
                border: none; 
                padding: 8px 16px; 
                border-radius: 6px; 
                font-size: 12px; 
                font-weight: 600; 
                cursor: pointer; 
                transition: all 0.3s ease; 
                box-shadow: 0 2px 8px ${this.getNotificationColor(notification.type)}40;
                flex: 1;
              ">
                ${notification.action}
              </button>
            </div>
          `
              : ''
          }
        </div>
      `;

      if (this.container) {
        this.container.appendChild(notificationElement);

        // Animación de entrada
        setTimeout(() => {
          notificationElement.style.transform = 'translateX(0)';
          notificationElement.style.opacity = '1';
        }, 100);
      }
    } catch (error) {
      console.error('❌ Error renderizando notificación:', error);
    }
  }

  removeNotification(notificationId) {
    try {
      const notificationElement = document.getElementById(notificationId);
      if (notificationElement) {
        notificationElement.style.transform = 'translateX(100%)';
        notificationElement.style.opacity = '0';

        setTimeout(() => {
          if (notificationElement.parentElement) {
            notificationElement.remove();
          }
        }, 300);
      }

      // Remover de la lista
      this.notifications = this.notifications.filter((n) => n.id !== notificationId);
      this.storeNotifications();
    } catch (error) {
      console.error('❌ Error removiendo notificación:', error);
    }
  }

  handleNotificationAction(notificationId) {
    try {
      const notification = this.notifications.find((n) => n.id === notificationId);
      if (notification) {
        console.log('🔔 Acción de notificación ejecutada:', notification.action);

        // Aquí puedes agregar lógica específica para cada acción
        if (notification.action === 'Ver empleados') {
          // Redirigir a la página de empleados
          window.location.href = '/modulos/empleados/empleados.html';
        }

        this.removeNotification(notificationId);
      }
    } catch (error) {
      console.error('❌ Error manejando acción de notificación:', error);
    }
  }

  getNotificationColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };
    return colors[type] || colors.info;
  }

  getNotificationGradient(type) {
    const gradients = {
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    };
    return gradients[type] || gradients.info;
  }

  getNotificationIcon(type) {
    const icons = {
      success: '✓',
      error: '⚠',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type] || icons.info;
  }

  getNotificationTitle(type) {
    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información',
    };
    return titles[type] || titles.info;
  }

  formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) {
      // Menos de 1 minuto
      return 'Ahora';
    } else if (diff < 3600000) {
      // Menos de 1 hora
      const minutes = Math.floor(diff / 60000);
      return `Hace ${minutes}m`;
    } else if (diff < 86400000) {
      // Menos de 1 día
      const hours = Math.floor(diff / 3600000);
      return `Hace ${hours}h`;
    } else {
      const date = new Date(timestamp);
      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  storeNotifications() {
    try {
      localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.warn('⚠️ Error almacenando notificaciones:', error);
    }
  }

  // Métodos públicos
  success(message, duration = 5000, action = null) {
    this.showNotification(message, 'success', duration, action);
  }

  error(message, duration = 5000, action = null) {
    this.showNotification(message, 'error', duration, action);
  }

  warning(message, duration = 5000, action = null) {
    this.showNotification(message, 'warning', duration, action);
  }

  info(message, duration = 5000, action = null) {
    this.showNotification(message, 'info', duration, action);
  }

  show(message, type = 'info', duration = 5000, action = null) {
    this.showNotification(message, type, duration, action);
  }

  clear() {
    this.notifications = [];
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.storeNotifications();
  }

  getStats() {
    return {
      total: this.notifications.length,
      byType: this.notifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {}),
      maxNotifications: this.maxNotifications,
    };
  }
}

// Inicializar el sistema de notificaciones profesional
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraNotificationSystem = new AxyraNotificationSystemProfessional();
  });
} else {
  window.axyraNotificationSystem = new AxyraNotificationSystemProfessional();
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraNotificationSystemProfessional;
}

