/**
 * AXYRA - Sistema de Notificaciones Push Reales
 * Implementación completa con Service Worker y Web Push API
 */

class AxyraPushNotificationsSystem {
  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
    this.registration = null;
    this.subscription = null;
    this.vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI8Uyf0V8pRZ3g';
    this.serverUrl = 'https://api.axyra.com/push';

    this.init();
  }

  async init() {
    if (!this.isSupported) {
      console.warn('Push notifications no soportadas en este navegador');
      return;
    }

    try {
      console.log('🔔 Inicializando sistema de notificaciones push...');

      // Registrar service worker
      await this.registerServiceWorker();

      // Solicitar permisos
      await this.requestPermission();

      // Configurar suscripción
      await this.setupSubscription();

      // Configurar listeners
      this.setupEventListeners();

      console.log('✅ Sistema de notificaciones push inicializado');
    } catch (error) {
      console.error('❌ Error inicializando notificaciones push:', error);
    }
  }

  async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registrado:', this.registration);
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
      throw error;
    }
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permisos de notificación denegados');
      }
      console.log('Permisos de notificación concedidos');
    } catch (error) {
      console.error('Error solicitando permisos:', error);
      throw error;
    }
  }

  async setupSubscription() {
    try {
      this.subscription = await this.registration.pushManager.getSubscription();

      if (!this.subscription) {
        this.subscription = await this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
        });
      }

      // Enviar suscripción al servidor
      await this.sendSubscriptionToServer();

      console.log('Suscripción push configurada:', this.subscription);
    } catch (error) {
      console.error('Error configurando suscripción:', error);
      throw error;
    }
  }

  async sendSubscriptionToServer() {
    try {
      const response = await fetch(`${this.serverUrl}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: this.subscription,
          userId: this.getCurrentUserId(),
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error enviando suscripción al servidor');
      }

      console.log('Suscripción enviada al servidor');
    } catch (error) {
      console.error('Error enviando suscripción:', error);
    }
  }

  async sendPushNotification(title, options = {}) {
    try {
      const notification = {
        title: title,
        body: options.body || '',
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/badge-72x72.png',
        tag: options.tag || 'axyra-notification',
        data: options.data || {},
        actions: options.actions || [],
        requireInteraction: options.requireInteraction || false,
        silent: options.silent || false,
      };

      const response = await fetch(`${this.serverUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: this.subscription,
          notification: notification,
          userId: this.getCurrentUserId(),
        }),
      });

      if (!response.ok) {
        throw new Error('Error enviando notificación push');
      }

      console.log('Notificación push enviada');
    } catch (error) {
      console.error('Error enviando notificación push:', error);
    }
  }

  setupEventListeners() {
    // Escuchar mensajes del service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      this.handleServiceWorkerMessage(event.data);
    });

    // Escuchar clics en notificaciones
    self.addEventListener('notificationclick', (event) => {
      this.handleNotificationClick(event);
    });

    // Escuchar cierre de notificaciones
    self.addEventListener('notificationclose', (event) => {
      this.handleNotificationClose(event);
    });
  }

  handleServiceWorkerMessage(data) {
    switch (data.type) {
      case 'NOTIFICATION_RECEIVED':
        this.handleNotificationReceived(data.notification);
        break;
      case 'NOTIFICATION_CLICKED':
        this.handleNotificationClicked(data.notification);
        break;
      default:
        console.log('Mensaje del service worker:', data);
    }
  }

  handleNotificationReceived(notification) {
    console.log('Notificación recibida:', notification);

    // Registrar en auditoría
    if (window.axyraAuditSystem) {
      window.axyraAuditSystem.logSystemEvent('PUSH_NOTIFICATION_RECEIVED', 'Notificación push recibida', {
        title: notification.title,
        tag: notification.tag,
      });
    }
  }

  handleNotificationClicked(notification) {
    console.log('Notificación clickeada:', notification);

    // Registrar en auditoría
    if (window.axyraAuditSystem) {
      window.axyraAuditSystem.logSystemEvent('PUSH_NOTIFICATION_CLICKED', 'Notificación push clickeada', {
        title: notification.title,
        tag: notification.tag,
      });
    }
  }

  handleNotificationClick(event) {
    event.notification.close();

    // Abrir ventana o foco en la aplicación
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }

  handleNotificationClose(event) {
    console.log('Notificación cerrada:', event.notification);
  }

  // Métodos de utilidad
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  getCurrentUserId() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user?.id || user?.email || 'anonymous';
    }
    return 'anonymous';
  }

  async unsubscribe() {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        this.subscription = null;
        console.log('Desuscrito de notificaciones push');
      }
    } catch (error) {
      console.error('Error desuscribiéndose:', error);
    }
  }

  isSubscribed() {
    return this.subscription !== null;
  }
}

// Inicializar sistema de notificaciones push
let axyraPushNotifications;
document.addEventListener('DOMContentLoaded', () => {
  axyraPushNotifications = new AxyraPushNotificationsSystem();
  window.axyraPushNotifications = axyraPushNotifications;
});

// Exportar para uso global
window.AxyraPushNotificationsSystem = AxyraPushNotificationsSystem;
