/**
 * AXYRA - Sistema de Notificaciones Push
 * Sistema completo de notificaciones en tiempo real
 *
 * NO MODIFICA NINGÚN CÓDIGO EXISTENTE - SOLO AGREGA FUNCIONALIDAD
 */

// ========================================
// CONFIGURACIÓN DEL SISTEMA DE NOTIFICACIONES
// ========================================

const AXYRA_NOTIFICATIONS = {
  // Tipos de notificaciones
  TYPES: {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    URGENT: 'urgent',
  },

  // Posiciones de las notificaciones
  POSITIONS: {
    TOP_RIGHT: 'top-right',
    TOP_LEFT: 'top-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_LEFT: 'bottom-left',
    TOP_CENTER: 'top-center',
    BOTTOM_CENTER: 'bottom-center',
  },

  // Configuración por defecto
  DEFAULT_CONFIG: {
    position: 'top-right',
    duration: 5000,
    maxNotifications: 5,
    sound: true,
    vibration: true,
    autoClose: true,
  },
};

// ========================================
// CLASE PRINCIPAL DE NOTIFICACIONES
// ========================================

class AxyraNotificationSystem {
  constructor(config = {}) {
    this.config = { ...AXYRA_NOTIFICATIONS.DEFAULT_CONFIG, ...config };
    this.notifications = [];
    this.notificationContainer = null;
    this.soundEnabled = this.config.sound;
    this.vibrationEnabled = this.config.vibration;

    this.init();
  }

  /**
   * Inicializa el sistema de notificaciones
   */
  init() {
    try {
      this.createNotificationContainer();
      this.setupEventListeners();
      this.requestNotificationPermission();
      console.log('Sistema de notificaciones AXYRA inicializado');
    } catch (error) {
      console.error('Error inicializando sistema de notificaciones:', error);
    }
  }

  /**
   * Crea el contenedor principal de notificaciones
   */
  createNotificationContainer() {
    if (this.notificationContainer) return;

    this.notificationContainer = document.createElement('div');
    this.notificationContainer.className = 'axyra-notifications-container';
    this.notificationContainer.id = 'axyra-notifications-container';

    // Aplicar estilos de posición
    this.applyPositionStyles();

    document.body.appendChild(this.notificationContainer);
  }

  /**
   * Aplica estilos según la posición configurada
   */
  applyPositionStyles() {
    const container = this.notificationContainer;
    const position = this.config.position;

    container.style.position = 'fixed';
    container.style.zIndex = '10000';
    container.style.pointerEvents = 'none';
    container.style.maxWidth = '400px';
    container.style.width = '100%';

    switch (position) {
      case 'top-right':
        container.style.top = '20px';
        container.style.right = '20px';
        break;
      case 'top-left':
        container.style.top = '20px';
        container.style.left = '20px';
        break;
      case 'bottom-right':
        container.style.bottom = '20px';
        container.style.right = '20px';
        break;
      case 'bottom-left':
        container.style.bottom = '20px';
        container.style.left = '20px';
        break;
      case 'top-center':
        container.style.top = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        break;
      case 'bottom-center':
        container.style.bottom = '20px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        break;
    }
  }

  /**
   * Configura los event listeners del sistema
   */
  setupEventListeners() {
    // Escuchar cambios en el localStorage para sincronización
    window.addEventListener('storage', (e) => {
      if (e.key === 'axyra_notifications') {
        this.handleStorageChange(e);
      }
    });

    // Escuchar mensajes del service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (e) => {
        if (e.data && e.data.type === 'NOTIFICATION') {
          this.showNotification(e.data.notification);
        }
      });
    }
  }

  /**
   * Solicita permiso para mostrar notificaciones
   */
  async requestNotificationPermission() {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Permiso de notificaciones:', permission);
      }
    } catch (error) {
      console.warn('No se pudo solicitar permiso de notificaciones:', error);
    }
  }

  /**
   * Muestra una nueva notificación
   * @param {Object} options - Opciones de la notificación
   */
  showNotification(options) {
    try {
      const notification = this.createNotificationElement(options);

      // Agregar al contenedor
      this.notificationContainer.appendChild(notification);
      this.notifications.push(notification);

      // Limitar número de notificaciones
      this.limitNotifications();

      // Efectos de entrada
      this.animateNotificationIn(notification);

      // Auto-cerrar si está habilitado
      if (this.config.autoClose && options.duration !== 0) {
        const duration = options.duration || this.config.duration;
        setTimeout(() => {
          this.hideNotification(notification);
        }, duration);
      }

      // Efectos adicionales
      this.playNotificationSound(options.type);
      this.vibrateDevice(options.type);

      // Notificación del navegador si está permitido
      this.showBrowserNotification(options);

      return notification;
    } catch (error) {
      console.error('Error mostrando notificación:', error);
    }
  }

  /**
   * Crea el elemento HTML de la notificación
   * @param {Object} options - Opciones de la notificación
   * @returns {HTMLElement} - Elemento de la notificación
   */
  createNotificationElement(options) {
    const notification = document.createElement('div');
    notification.className = `axyra-notification axyra-notification-${options.type || 'info'}`;

    const icon = this.getNotificationIcon(options.type);
    const title = options.title || this.getDefaultTitle(options.type);

    notification.innerHTML = `
      <div class="axyra-notification-icon">
        <i class="fas ${icon}"></i>
      </div>
      <div class="axyra-notification-content">
        <div class="axyra-notification-title">${title}</div>
        <div class="axyra-notification-message">${options.message}</div>
        ${options.details ? `<div class="axyra-notification-details">${options.details}</div>` : ''}
      </div>
      <div class="axyra-notification-actions">
        ${options.actions ? this.createActionButtons(options.actions) : ''}
        <button class="axyra-notification-close" onclick="axyraNotifications.hideNotification(this.parentElement.parentElement)">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="axyra-notification-progress"></div>
    `;

    // Agregar atributos personalizados
    if (options.id) notification.setAttribute('data-notification-id', options.id);
    if (options.priority) notification.setAttribute('data-priority', options.priority);

    return notification;
  }

  /**
   * Obtiene el icono apropiado para el tipo de notificación
   * @param {string} type - Tipo de notificación
   * @returns {string} - Clase del icono
   */
  getNotificationIcon(type) {
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle',
      urgent: 'fa-bell',
    };
    return icons[type] || icons.info;
  }

  /**
   * Obtiene el título por defecto según el tipo
   * @param {string} type - Tipo de notificación
   * @returns {string} - Título por defecto
   */
  getDefaultTitle(type) {
    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información',
      urgent: 'Urgente',
    };
    return titles[type] || titles.info;
  }

  /**
   * Crea botones de acción para la notificación
   * @param {Array} actions - Lista de acciones
   * @returns {string} - HTML de los botones
   */
  createActionButtons(actions) {
    return actions
      .map(
        (action) => `
      <button class="axyra-notification-action" onclick="${action.onclick}">
        ${action.icon ? `<i class="fas ${action.icon}"></i>` : ''}
        ${action.text}
      </button>
    `
      )
      .join('');
  }

  /**
   * Anima la entrada de la notificación
   * @param {HTMLElement} notification - Elemento de la notificación
   */
  animateNotificationIn(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';

    setTimeout(() => {
      notification.style.transition = 'all 0.3s ease-out';
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);
  }

  /**
   * Oculta una notificación específica
   * @param {HTMLElement} notification - Elemento de la notificación
   */
  hideNotification(notification) {
    try {
      if (!notification || !notification.parentElement) return;

      // Animación de salida
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';

      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
          this.removeFromArray(notification);
        }
      }, 300);
    } catch (error) {
      console.error('Error ocultando notificación:', error);
    }
  }

  /**
   * Limita el número de notificaciones visibles
   */
  limitNotifications() {
    const maxNotifications = this.config.maxNotifications;

    if (this.notifications.length > maxNotifications) {
      const notificationsToRemove = this.notifications.slice(0, this.notifications.length - maxNotifications);
      notificationsToRemove.forEach((notification) => {
        this.hideNotification(notification);
      });
    }
  }

  /**
   * Reproduce sonido de notificación
   * @param {string} type - Tipo de notificación
   */
  playNotificationSound(type) {
    if (!this.soundEnabled) return;

    try {
      // Crear audio context para sonidos personalizados
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Configurar frecuencia según el tipo
      const frequencies = {
        success: 800,
        error: 400,
        warning: 600,
        info: 700,
        urgent: 300,
      };

      oscillator.frequency.setValueAtTime(frequencies[type] || 600, audioContext.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Configurar envolvente
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.warn('No se pudo reproducir sonido de notificación:', error);
    }
  }

  /**
   * Hace vibrar el dispositivo
   * @param {string} type - Tipo de notificación
   */
  vibrateDevice(type) {
    if (!this.vibrationEnabled || !navigator.vibrate) return;

    try {
      const patterns = {
        success: [100],
        error: [200, 100, 200],
        warning: [150, 100, 150],
        info: [100],
        urgent: [300, 100, 300, 100, 300],
      };

      const pattern = patterns[type] || patterns.info;
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('No se pudo hacer vibrar el dispositivo:', error);
    }
  }

  /**
   * Muestra notificación del navegador
   * @param {Object} options - Opciones de la notificación
   */
  showBrowserNotification(options) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;

    try {
      const notification = new Notification(options.title || 'AXYRA', {
        body: options.message,
        icon: '/nomina.ico',
        badge: '/nomina.ico',
        tag: options.id || 'axyra-notification',
        requireInteraction: options.requireInteraction || false,
        silent: !this.soundEnabled,
      });

      // Event listeners para la notificación del navegador
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      notification.onclose = () => {
        console.log('Notificación del navegador cerrada');
      };
    } catch (error) {
      console.warn('No se pudo mostrar notificación del navegador:', error);
    }
  }

  /**
   * Maneja cambios en el localStorage
   * @param {StorageEvent} event - Evento de cambio
   */
  handleStorageChange(event) {
    try {
      const notifications = JSON.parse(event.newValue || '[]');
      notifications.forEach((notification) => {
        this.showNotification(notification);
      });
    } catch (error) {
      console.error('Error manejando cambio de storage:', error);
    }
  }

  /**
   * Remueve una notificación del array interno
   * @param {HTMLElement} notification - Elemento de la notificación
   */
  removeFromArray(notification) {
    const index = this.notifications.indexOf(notification);
    if (index > -1) {
      this.notifications.splice(index, 1);
    }
  }

  /**
   * Limpia todas las notificaciones
   */
  clearAll() {
    this.notifications.forEach((notification) => {
      this.hideNotification(notification);
    });
  }

  /**
   * Actualiza la configuración del sistema
   * @param {Object} newConfig - Nueva configuración
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.position) {
      this.applyPositionStyles();
    }

    if (newConfig.sound !== undefined) {
      this.soundEnabled = newConfig.sound;
    }

    if (newConfig.vibration !== undefined) {
      this.vibrationEnabled = newConfig.vibration;
    }
  }
}

// ========================================
// FUNCIONES DE CONVENIENCIA
// ========================================

/**
 * Muestra una notificación de éxito
 * @param {string} message - Mensaje de la notificación
 * @param {Object} options - Opciones adicionales
 */
function showSuccessNotification(message, options = {}) {
  return axyraNotifications.showNotification({
    type: 'success',
    message,
    ...options,
  });
}

/**
 * Muestra una notificación de error
 * @param {string} message - Mensaje de la notificación
 * @param {Object} options - Opciones adicionales
 */
function showErrorNotification(message, options = {}) {
  return axyraNotifications.showNotification({
    type: 'error',
    message,
    ...options,
  });
}

/**
 * Muestra una notificación de advertencia
 * @param {string} message - Mensaje de la notificación
 * @param {Object} options - Opciones adicionales
 */
function showWarningNotification(message, options = {}) {
  return axyraNotifications.showNotification({
    type: 'warning',
    message,
    ...options,
  });
}

/**
 * Muestra una notificación informativa
 * @param {string} message - Mensaje de la notificación
 * @param {Object} options - Opciones adicionales
 */
function showInfoNotification(message, options = {}) {
  return axyraNotifications.showNotification({
    type: 'info',
    message,
    ...options,
  });
}

/**
 * Muestra una notificación urgente
 * @param {string} message - Mensaje de la notificación
 * @param {Object} options - Opciones adicionales
 */
function showUrgentNotification(message, options = {}) {
  return axyraNotifications.showNotification({
    type: 'urgent',
    message,
    ...options,
  });
}

// ========================================
// INICIALIZACIÓN Y EXPORTACIÓN
// ========================================

// Crear instancia global del sistema de notificaciones
let axyraNotifications;

// Inicializar cuando el DOM esté listo
function initNotificationSystem() {
  try {
    axyraNotifications = new AxyraNotificationSystem();

    // Hacer disponible globalmente
    window.axyraNotifications = axyraNotifications;
    window.showSuccessNotification = showSuccessNotification;
    window.showErrorNotification = showErrorNotification;
    window.showWarningNotification = showWarningNotification;
    window.showInfoNotification = showInfoNotification;
    window.showUrgentNotification = showUrgentNotification;

    console.log('Sistema de notificaciones AXYRA disponible globalmente');
  } catch (error) {
    console.error('Error inicializando sistema de notificaciones:', error);
  }
}

// Inicializar automáticamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotificationSystem);
} else {
  initNotificationSystem();
}
