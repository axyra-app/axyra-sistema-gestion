// ========================================
// LIMPIADOR DE NOTIFICACIONES VIEJAS AXYRA
// ========================================

class AxyraNotificationCleaner {
  constructor() {
    this.init();
  }

  init() {
    console.log('🧹 Iniciando limpieza de notificaciones viejas...');
    
    // Limpiar notificaciones viejas inmediatamente
    this.cleanOldNotifications();
    
    // Limpiar periódicamente
    setInterval(() => {
      this.cleanOldNotifications();
    }, 1000);
  }

  cleanOldNotifications() {
    try {
      // Eliminar notificaciones con clases viejas
      const oldNotifications = document.querySelectorAll(`
        .axyra-notification:not(.axyra-notification-professional),
        .notification,
        .alert,
        .toast,
        [class*="notification"]:not(.axyra-notification-professional),
        [id*="notification"]:not([id*="notification_"])
      `);
      
      oldNotifications.forEach(notification => {
        if (notification && notification.parentElement) {
          console.log('🗑️ Eliminando notificación vieja:', notification);
          notification.remove();
        }
      });

      // Limpiar localStorage de notificaciones viejas
      this.cleanOldStorage();

    } catch (error) {
      console.warn('⚠️ Error limpiando notificaciones viejas:', error);
    }
  }

  cleanOldStorage() {
    try {
      // Limpiar claves de notificaciones viejas
      const oldKeys = [
        'notifications',
        'axyra_notifications_old',
        'notification_data',
        'alert_data'
      ];
      
      oldKeys.forEach(key => {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          console.log('🗑️ Limpiando localStorage viejo:', key);
        }
      });

    } catch (error) {
      console.warn('⚠️ Error limpiando localStorage viejo:', error);
    }
  }

  // Método para forzar limpieza
  forceClean() {
    console.log('🧹 Forzando limpieza completa...');
    
    // Eliminar todos los elementos de notificación
    const allNotifications = document.querySelectorAll(`
      .axyra-notification,
      .notification,
      .alert,
      .toast,
      [class*="notification"],
      [id*="notification"]
    `);
    
    allNotifications.forEach(notification => {
      if (notification && notification.parentElement) {
        notification.remove();
      }
    });

    // Limpiar todo el localStorage relacionado con notificaciones
    Object.keys(localStorage).forEach(key => {
      if (key.includes('notification') || key.includes('alert')) {
        localStorage.removeItem(key);
      }
    });

    console.log('✅ Limpieza completa realizada');
  }
}

// Inicializar limpiador inmediatamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraNotificationCleaner = new AxyraNotificationCleaner();
  });
} else {
  window.axyraNotificationCleaner = new AxyraNotificationCleaner();
}

// Exportar para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraNotificationCleaner;
}
