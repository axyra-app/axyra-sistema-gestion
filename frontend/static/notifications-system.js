/**
 * Sistema de Notificaciones AXYRA - VERSIÓN MEJORADA
 * Sistema completo y robusto de notificaciones push
 * NO MODIFICA NINGÚN CÓDIGO EXISTENTE - SOLO AGREGA FUNCIONALIDAD
 */

class AxyraNotificationSystem {
  constructor() {
    this.notifications = [];
    this.isInitialized = false;
    this.notificationInterval = null;
    this.lastNotificationTime = 0;
    this.notificationCooldown = 10 * 60 * 1000; // 10 minutos en milisegundos
    this.notificationContainer = null;
    this.notificationCount = 0;

    this.init();
  }

  async init() {
    try {
      // Verificar si ya está inicializado
      if (this.isInitialized) {
        console.log('⚠️ Sistema de notificaciones ya inicializado');
        return;
      }

      // Verificar si las notificaciones están soportadas
      if (!('Notification' in window)) {
        console.warn('Este navegador no soporta notificaciones push');
        return;
      }

      // Solicitar permisos si no están otorgados
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Permisos de notificación denegados');
          return;
        }
      }

      // Crear contenedor de notificaciones
      this.createNotificationContainer();

      // Inicializar el sistema
      this.isInitialized = true;
      this.setupNotificationInterval();
      this.loadStoredNotifications();
      this.renderNotifications();
      this.setupEventListeners();

      console.log('✅ Sistema de notificaciones AXYRA inicializado correctamente');

      // Mostrar notificación de bienvenida
      this.showWelcomeNotification();
    } catch (error) {
      console.error('❌ Error inicializando sistema de notificaciones:', error);
    }
  }

  createNotificationContainer() {
    try {
      // Verificar si ya existe el contenedor
      if (document.getElementById('axyra-notifications-container')) {
        this.notificationContainer = document.getElementById('axyra-notifications-container');
        return;
      }

      // Crear contenedor de notificaciones
      const container = document.createElement('div');
      container.id = 'axyra-notifications-container';
      container.className = 'axyra-notifications-container';
      container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
        pointer-events: none;
      `;

      document.body.appendChild(container);
      this.notificationContainer = container;
      console.log('✅ Contenedor de notificaciones creado');
    } catch (error) {
      console.error('❌ Error creando contenedor de notificaciones:', error);
    }
  }

  setupEventListeners() {
    try {
      // Escuchar eventos de notificaciones del sistema
      document.addEventListener('axyra-show-notification', (e) => {
        this.showNotification(e.detail.message, e.detail.type, e.detail.duration);
      });

      // Escuchar eventos de notificaciones push
      document.addEventListener('axyra-push-notification', (e) => {
        this.showPushNotification(e.detail.title, e.detail.message, e.detail.icon);
      });

      // Escuchar eventos de notificaciones de error
      document.addEventListener('axyra-error-notification', (e) => {
        this.showErrorNotification(e.detail.message, e.detail.duration);
      });

      // Escuchar eventos de notificaciones de éxito
      document.addEventListener('axyra-success-notification', (e) => {
        this.showSuccessNotification(e.detail.message, e.detail.duration);
      });

      console.log('✅ Event listeners configurados');
    } catch (error) {
      console.error('❌ Error configurando event listeners:', error);
    }
  }

  setupNotificationInterval() {
    try {
      // Limpiar intervalo existente
      if (this.notificationInterval) {
        clearInterval(this.notificationInterval);
      }

      // Configurar intervalo de 10 minutos
      this.notificationInterval = setInterval(() => {
        this.checkAndSendNotifications();
      }, this.notificationCooldown);

      // Ejecutar inmediatamente la primera vez
      this.checkAndSendNotifications();

      console.log('✅ Intervalo de notificaciones configurado');
    } catch (error) {
      console.error('❌ Error configurando intervalo de notificaciones:', error);
    }
  }

  checkAndSendNotifications() {
    try {
      const now = Date.now();

      // Verificar si ha pasado suficiente tiempo desde la última notificación
      if (now - this.lastNotificationTime < this.notificationCooldown) {
        return;
      }

      this.generateSystemNotifications();
      this.lastNotificationTime = now;
    } catch (error) {
      console.error('❌ Error verificando notificaciones:', error);
    }
  }

  generateSystemNotifications() {
    try {
      // Obtener datos del sistema
      const empleados = this.getDataFromStorage('axyra_empleados') || [];
      const horas = this.getDataFromStorage('axyra_horas') || [];
      const nominas = this.getDataFromStorage('axyra_nominas') || [];
      const cuadres = this.getDataFromStorage('axyra_cuadres') || [];
      const config = this.getDataFromStorage('axyra_config_empresa') || {};

      // Generar notificaciones del sistema
      const systemNotifications = [];

      // Verificar empleados sin horas registradas (solo si hay empleados)
      if (empleados.length > 0) {
        const empleadosSinHoras = empleados.filter((emp) => {
          // Verificar por ID del empleado y por cédula
          const tieneHorasPorId = horas.some((h) => h.empleadoId === emp.id);
          const tieneHorasPorCedula = horas.some((h) => h.cedula === emp.cedula);
          return !tieneHorasPorId && !tieneHorasPorCedula;
        });

        if (empleadosSinHoras.length > 0) {
          systemNotifications.push({
            id: 'empleados_sin_horas',
            type: 'warning',
            title: 'Empleados sin horas registradas',
            message: `${empleadosSinHoras.length} empleado(s) no tienen horas registradas en el sistema`,
            action: 'Ver empleados',
            timestamp: Date.now(),
            data: { empleados: empleadosSinHoras },
          });
        }
      }

      // Verificar nóminas pendientes
      const nominasPendientes = nominas.filter((nom) => nom.estado === 'pendiente');
      if (nominasPendientes.length > 0) {
        systemNotifications.push({
          id: 'nominas_pendientes',
          type: 'info',
          title: 'Nóminas pendientes',
          message: `${nominasPendientes.length} nómina(s) pendiente(s) de aprobación`,
          action: 'Ver nóminas',
          timestamp: Date.now(),
          data: { nominas: nominasPendientes },
        });
      }

      // Verificar cuadres de caja pendientes
      const cuadresPendientes = cuadres.filter((cuadre) => cuadre.estado === 'pendiente');
      if (cuadresPendientes.length > 0) {
        systemNotifications.push({
          id: 'cuadres_pendientes',
          type: 'info',
          title: 'Cuadres de caja pendientes',
          message: `${cuadresPendientes.length} cuadre(s) de caja pendiente(s) de revisión`,
          action: 'Ver cuadres',
          timestamp: Date.now(),
          data: { cuadres: cuadresPendientes },
        });
      }

      // Mostrar notificaciones del sistema
      systemNotifications.forEach((notification) => {
        this.showSystemNotification(notification);
      });

      console.log(`✅ ${systemNotifications.length} notificaciones del sistema generadas`);
    } catch (error) {
      console.error('❌ Error generando notificaciones del sistema:', error);
    }
  }

  showSystemNotification(notification) {
    try {
      const notificationElement = this.createNotificationElement({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        action: notification.action,
        timestamp: notification.timestamp,
        isSystem: true,
      });

      this.addNotification(notificationElement);
    } catch (error) {
      console.error('❌ Error mostrando notificación del sistema:', error);
    }
  }

  showWelcomeNotification() {
    try {
      // Mostrar notificación de bienvenida solo si es la primera vez
      const hasShownWelcome = localStorage.getItem('axyra_welcome_shown');
      if (!hasShownWelcome) {
        this.showSuccessNotification('¡Bienvenido a AXYRA! Sistema de notificaciones activado.', 5000);
        localStorage.setItem('axyra_welcome_shown', 'true');
      }
    } catch (error) {
      console.error('❌ Error mostrando notificación de bienvenida:', error);
    }
  }

  showNotification(message, type = 'info', duration = 5000) {
    try {
      const notificationElement = this.createNotificationElement({
        id: `notification_${Date.now()}`,
        type: type,
        title: this.getNotificationTitle(type),
        message: message,
        timestamp: Date.now(),
      });

      this.addNotification(notificationElement);

      // Auto-remover después del tiempo especificado
      if (duration > 0) {
        setTimeout(() => {
          this.removeNotification(notificationElement.id);
        }, duration);
      }

      return notificationElement.id;
    } catch (error) {
      console.error('❌ Error mostrando notificación:', error);
      return null;
    }
  }

  showSuccessNotification(message, duration = 5000) {
    return this.showNotification(message, 'success', duration);
  }

  showErrorNotification(message, duration = 5000) {
    return this.showNotification(message, 'error', duration);
  }

  showWarningNotification(message, duration = 5000) {
    return this.showNotification(message, 'warning', duration);
  }

  showInfoNotification(message, duration = 5000) {
    return this.showNotification(message, 'info', duration);
  }

  showPushNotification(title, message, icon = '🔔') {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: icon,
          badge: icon,
          tag: 'axyra-notification',
        });
      }
    } catch (error) {
      console.error('❌ Error mostrando notificación push:', error);
    }
  }

  createNotificationElement(notification) {
    try {
      const notificationDiv = document.createElement('div');
      notificationDiv.id = notification.id;
      notificationDiv.className = `axyra-notification axyra-notification-${notification.type}`;
      notificationDiv.style.cssText = `
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        margin-bottom: 16px;
        padding: 20px;
        border-left: 4px solid ${this.getNotificationColor(notification.type)};
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: auto;
        max-width: 400px;
        min-width: 350px;
        overflow: visible;
        position: relative;
        z-index: 10000;
      `;

      notificationDiv.innerHTML = `
        <div class="axyra-notification-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="axyra-notification-icon" style="font-size: 20px;">
              ${this.getNotificationIcon(notification.type)}
            </div>
            <div class="axyra-notification-title" style="font-weight: 600; font-size: 16px; color: #1f2937;">
              ${notification.title}
            </div>
          </div>
          <button class="axyra-notification-close" onclick="window.axyraNotificationSystem.removeNotification('${
            notification.id
          }')" style="background: none; border: none; color: #9ca3af; font-size: 18px; cursor: pointer; padding: 4px; border-radius: 50%; transition: all 0.2s ease;">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="axyra-notification-content">
          <div class="axyra-notification-message" style="color: #4b5563; font-size: 14px; line-height: 1.5; margin-bottom: 16px;">
            ${notification.message}
          </div>
          ${
            notification.action
              ? `<div class="axyra-notification-actions">
            <button class="axyra-notification-action" onclick="window.axyraNotificationSystem.handleNotificationAction('${
              notification.id
            }')" style="background: ${this.getNotificationColor(
                  notification.type
                )}; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-size: 14px; cursor: pointer; transition: all 0.2s ease;">
              ${notification.action}
            </button>
          </div>`
              : ''
          }
        </div>
      `;

      return notificationDiv;
    } catch (error) {
      console.error('❌ Error creando elemento de notificación:', error);
      return null;
    }
  }

  addNotification(notificationElement) {
    try {
      if (!this.notificationContainer) {
        this.createNotificationContainer();
      }

      if (notificationElement && this.notificationContainer) {
        this.notificationContainer.appendChild(notificationElement);
        this.notificationCount++;

        // Animar entrada
        setTimeout(() => {
          notificationElement.style.transform = 'translateX(0)';
          notificationElement.style.opacity = '1';
        }, 100);

        // Agregar a la lista de notificaciones
        this.notifications.push({
          id: notificationElement.id,
          element: notificationElement,
          timestamp: Date.now(),
        });

        console.log(`✅ Notificación agregada: ${notificationElement.id}`);
      }
    } catch (error) {
      console.error('❌ Error agregando notificación:', error);
    }
  }

  removeNotification(notificationId) {
    try {
      const notification = this.notifications.find((n) => n.id === notificationId);
      if (notification && notification.element) {
        // Animar salida
        notification.element.style.transform = 'translateX(100%)';
        notification.element.style.opacity = '0';

        // Remover después de la animación
        setTimeout(() => {
          if (notification.element.parentNode) {
            notification.element.parentNode.removeChild(notification.element);
          }

          // Remover de la lista
          this.notifications = this.notifications.filter((n) => n.id !== notificationId);
          this.notificationCount--;

          console.log(`✅ Notificación removida: ${notificationId}`);
        }, 300);
      }
    } catch (error) {
      console.error('❌ Error removiendo notificación:', error);
    }
  }

  handleNotificationAction(notificationId) {
    try {
      const notification = this.notifications.find((n) => n.id === notificationId);
      if (notification) {
        // Aquí puedes agregar lógica específica para cada acción
        console.log(`✅ Acción ejecutada para notificación: ${notificationId}`);

        // Remover la notificación después de la acción
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

  getNotificationIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
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

  getDataFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`❌ Error obteniendo datos de ${key}:`, error);
      return null;
    }
  }

  loadStoredNotifications() {
    try {
      const stored = localStorage.getItem('axyra_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
        console.log(`✅ ${this.notifications.length} notificaciones cargadas del almacenamiento`);
      }
    } catch (error) {
      console.error('❌ Error cargando notificaciones almacenadas:', error);
    }
  }

  renderNotifications() {
    try {
      if (this.notifications.length > 0) {
        this.notifications.forEach((notification) => {
          if (notification.element) {
            this.addNotification(notification.element);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error renderizando notificaciones:', error);
    }
  }

  // Métodos públicos para uso externo
  show(message, type = 'info', duration = 5000) {
    return this.showNotification(message, type, duration);
  }

  success(message, duration = 5000) {
    return this.showSuccessNotification(message, duration);
  }

  error(message, duration = 5000) {
    return this.showErrorNotification(message, duration);
  }

  warning(message, duration = 5000) {
    return this.showWarningNotification(message, duration);
  }

  info(message, duration = 5000) {
    return this.showInfoNotification(message, duration);
  }

  push(title, message, icon = '🔔') {
    return this.showPushNotification(title, message, icon);
  }

  remove(id) {
    return this.removeNotification(id);
  }

  clear() {
    try {
      this.notifications.forEach((notification) => {
        this.removeNotification(notification.id);
      });
      console.log('✅ Todas las notificaciones removidas');
    } catch (error) {
      console.error('❌ Error limpiando notificaciones:', error);
    }
  }
}

// Inicializar sistema de notificaciones cuando se carga la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraNotificationSystem = new AxyraNotificationSystem();
  });
} else {
  window.axyraNotificationSystem = new AxyraNotificationSystem();
}

// Exportar para uso en otros módulos
window.AxyraNotificationSystem = AxyraNotificationSystem;
